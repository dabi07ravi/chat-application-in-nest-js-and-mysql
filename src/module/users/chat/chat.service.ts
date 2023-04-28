import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Pool } from "mysql2/promise";
import { DB_CONNECTION } from "src/constants";

@Injectable()
export class ChatService {
  constructor(@Inject(DB_CONNECTION) private conn: Pool) {}

  async createChat(body) {
    try {
      let { name, type, members, messages, user_id } = body;
      type = type.toUpperCase();
      if (!name && !type && !members && !user_id && !messages) {
        throw "name, type and members fields are required";
      }
      if (type === "INDIVIDUAL") {
        let [chatExists] = await this.conn.query(
          `SELECT * FROM chats WHERE type = 'INDIVIDUAL' AND JSON_CONTAINS(members, ?, '$')`,
          [JSON.stringify(members)]
        );
        if (Array.isArray(chatExists) && chatExists.length > 0) {
          // Chat already exists between the two users
          throw "chat between two users already exists";
        } else {
          // Create new individual chat between the two users
          let [result] = await this.conn.query(
            `INSERT INTO chats (name, type, members, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [name, type, JSON.stringify(members), user_id]
          );
          return result;
        }
      }
      if (type === "GROUP") {
        let [chatExists] = await this.conn.query(
          `SELECT * FROM chats WHERE type = 'GROUP ' AND JSON_CONTAINS(members, ?, '$')`,
          [JSON.stringify(members)]
        );
        if (Array.isArray(chatExists) && chatExists.length > 0) {
          throw "chat between the users already exists in group";
        }
        if (members.length < 2) {
          throw "minimum two members are required to create the group";
        } else {
          let [result] = await this.conn.query(
            `INSERT INTO chats (name, type, members, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [name, type, JSON.stringify(members), user_id]
          );
          return result;
        }
      }
    } catch (error) {
      if (error === "name, type and members fields are required") {
        throw new UnprocessableEntityException({
          statusCode: 422,
          message: "name, type and members fields are required",
        });
      }
      if (error === "chat between two users already exists") {
        throw new UnprocessableEntityException({
          statusCode: 422,
          message: "chat between two users already exists",
        });
      }
      if (error === "chat between the users already exists in group") {
        throw new UnprocessableEntityException({
          statusCode: 422,
          message: "chat between the users already exists in group",
        });
      }
      if (error === "minimum two members are required to create the group") {
        throw new UnprocessableEntityException({
          statusCode: 422,
          message: "minimum two members are required to create the group",
        });
      }
      console.log(`Error while creating the data error: ${error.message}`);
    }
  }

  async getChat(limit: number, skip: number, user_id: string) {
    try {
      const [chatData] = await this.conn.query(
        `SELECT * FROM chats WHERE JSON_CONTAINS(members, JSON_ARRAY(?)) LIMIT ? OFFSET ?`,
        [user_id, limit, skip]
      );
      const [totalData] = await this.conn.query(
        `SELECT COUNT(*) AS total FROM chats WHERE user_id = ?`,
        [user_id]
      );
      const count = totalData[0]["total"];
      return { chatData, count };
    } catch (error) {
      console.log(`Error while reading the data error: ${error.message}`);
    }
  }

  async deleteChat(id) {
    try {
      const [deleteData] = await this.conn.query(
        `DELETE FROM chats WHERE id = ?`,
        [id]
      );
      return deleteData;
    } catch (error) {
      console.log(`Error while deleating the data error: ${error.message}`);
    }
  }

  async insertMessage(id, body) {
    try {
      let { sender_id, content } = body;
      if (!sender_id && !content) {
        throw "sender_id and content must be required";
      }
      let [chatExists] = await this.conn.query(
        `SELECT * FROM chats WHERE id = ?`,
        [id]
      );
      if (Array.isArray(chatExists) && chatExists.length === 0) {
        throw "chat not found";
      } else {
        let messages = chatExists[0].messages || [];

        messages.push({
          chat_id: id,
          sender_id: sender_id,
          content: content,
          created_at: new Date(),
        });

        const [updateData] = await this.conn.query(
          `UPDATE chats SET messages = ? WHERE id = ?`,
          [JSON.stringify(messages), id]
        );
        return updateData;
      }
    } catch (error) {
      if (error === "sender_id and content must be required") {
        throw new UnprocessableEntityException({
          statusCode: 422,
          message: "sender_id and content must be required",
        });
      }
      if (error === "chat not found") {
        throw new UnprocessableEntityException({
          statusCode: 422,
          message: "chat not found",
        });
      }
      console.log(`Error while updating the data error: ${error.message}`);
    }
  }

  async getMessage(id, limit: number, skip: number) {
    try {
      let [chatExists] = await this.conn.query(
        `SELECT * FROM chats WHERE id = ?`,
        [id]
      );
      if (Array.isArray(chatExists) && chatExists.length === 0) {
        throw "chat not found";
      } else {
        const [chatData] = await this.conn.query(
          `SELECT messages FROM chats WHERE id = ? LIMIT ? OFFSET ?`,
          [id, limit, skip]
        );
        const [totalData] = await this.conn.query(
          `SELECT messages FROM chats WHERE id = ?`,
          [id]
        );
        const count = totalData[0].messages.length;
        return { chatData, count };
      }
    } catch (error) {
      if (error === "chat not found") {
        throw new UnprocessableEntityException({
          statusCode: 422,
          message: "chat not found",
        });
      }
    }
  }

  async manageGroup(body) {
    try {
      //extract data
      let { groupId, action, user_id } = body;
      //validate req
      if (!groupId && !user_id) {
        throw "group_id, action and user_id fields are required";
      }
      // chk group exist or not
      const [groupData] = await this.conn.query(
        `SELECT * FROM chats WHERE id = ?`,
        [groupId]
      );
      if (Array.isArray(groupData) && groupData.length === 0) {
        throw "group not found";
      }
      // Check if the current user is a member of the group
      const currentUserRole = groupData[0].members
      .filter((item) => item.user_id == user_id)
      .map((item) => item.role);
      if (currentUserRole.length === 0) {
        throw "You are not a member of this group";
      }
      if(action === "SENDMESSAGE"){
        
      }
      // working on it
    } catch (error) {
      if (error === "group_id, action and user_id fields are required") {
        throw new UnprocessableEntityException({
          statusCode: 422,
          message: "group_id, action and user_id fields are required",
        });
      }
      if (error === "group not found") {
        throw new UnprocessableEntityException({
          statusCode: 422,
          message: "group not found",
        });
      }
      if (error === "You are not a member of this group") {
        throw new UnprocessableEntityException({
          statusCode: 422,
          message: "You are not a member of this group",
        });
      }
    }
  }
}
