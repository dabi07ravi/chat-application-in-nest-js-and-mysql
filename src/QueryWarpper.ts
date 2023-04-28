
enum operator{
  '=',"!=",'>','<','>=','<='
}
export default class QueryBuilder {
  private table: string;
  private opershion:string="SELECT"
  private selectColumn: string | Array<string>
  private whereCondition: Array<{
    column:string,
    operators?:string,
    value:any
}>
  constructor(table: string) {
    this.table = table
  }

  select(select: string | Array<string>) {
    this.selectColumn = select
    this.opershion ="SELECT"
    return this
  }

  where(where: Array<{
      column:string,
      operators?:'='|"!="|'>'|'<'|'>='|'<=',
      value:any
  }>) {
    this.whereCondition = where;
    return this
  }
  getQuery():string {
    let _query:string = `${this.opershion} `
    _query += this.selectColumn ? typeof this.selectColumn === 'string' ? this.selectColumn : this.selectColumn.join(', ')  :" * "
    _query += ` FROM ${this.table}`

    //console.log(this.whereCondition.map((op,index)=>`${op.column} ${op.operators} '${ op.value}' ${index > 0 ? 'AND' : '' }`))

   _query += this.whereCondition && ' where '+this.whereCondition.map((op,index)=>`${op.column} ${op.operators} '${ op.value}' ${this.whereCondition.length > 0 && index != 0 ? 'AND' : '' }`).join()
    return _query
  }
}