import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller({
  path: "/chat",
})
export class ChatController {
  constructor(private readonly chatservice: ChatService) {}

  @Post('create')
  async createChat(@Body() body) {
    const data = await this.chatservice.createChat(body);
    return data;
  }

  @Get('read')
  async readChat(@Query() query) {
    const limit = query.limit ? parseInt(query.limit) : 10;
    const page = query.page ? parseInt(query.page) : 1;
    const skip = (page - 1) * limit;
    const user_id = query.user_id;
    const data = await this.chatservice.getChat(limit, skip, user_id);
    return {
      data : data.chatData,
      totalItem: data.count,
      totalPage: Math.ceil(data.count / limit),
      page,
    };
  }

  @Delete('delete/:id')
  async deleteChat(@Param('id') id){
    const data = await this.chatservice.deleteChat(id)
    return data;
  }

  @Patch('message/:id')
  async sendMessage(@Param('id') id, @Body() body){
    const data = await this.chatservice.insertMessage(id,body)
    return data;
  }

  @Get('message/:id')
  async getMessage(@Param('id') id, @Query() query){
    const limit = query.limit ? parseInt(query.limit) : 10;
    const page = query.page ? parseInt(query.page) : 1;
    const skip = (page - 1) * limit;
    const data = await this.chatservice.getMessage(id,limit,skip);
    return {
      data : data.chatData,
      totalItem: data.count,
      totalPage: Math.ceil(data.count / limit),
      page,
    }
  }

  @Post('group')
  async manageGroup(@Body() body){
    const data = await this.chatservice.manageGroup(body)
    return data;
  }
}
