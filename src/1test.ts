//@ts-nocheck
async function fn() {
  let tName = 't_CustomerCls'
  let data = await this.getHttp().find(tName)
  let dataRef = this.getTableRefData(tName)
  let buildTreeData = (data, parentId = '0') => {
    let _data = data
      .filter((item) => item.cParentClsNo == parentId)
      .map((item) => ({
        ...item,
        children: buildTreeData(data, item.cClsNo), //
      }))
    // _data = _data.sort((a, b) => a.sort - b.sort) //
    return _data
  }
  let data1 = buildTreeData(data)
  let _data2 = [
    {
      cClsNo: 0,
      cClsName: '客户类别',
      children: data1,
    },
  ] //
  dataRef['data'] = _data2
  this.getSystem().confirmMessage('加载树数据成功')
}


async function fn() {
    let tRef = this.getRef('t_CustomerCls')
    let curRow = tRef.getCurRow()
    let _curRow = null
    if (curRow == null) {
        this.getSystem().confirmMessage('请选择一行进行编辑')
        return 
        // _curRow = {
        //     cParentClsNo: '0'
        // }
    } else {
        // let id = curRow['cClsNo']
        // _curRow = {
        //     cParentClsNo: id
        // }
    }
    await this.confirmEditEntity({
        tableName: 't_CustomerCls',
        curRow: _curRow,
        editType: "edit"
    })
}