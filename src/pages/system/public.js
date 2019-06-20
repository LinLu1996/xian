import {context} from '@/app/io';

class OperationMethod {
    addtree(arr, data, slideID) {  //筛选增加树的节点
        arr.map((item) => {
            if(item.id===slideID) {
              if(item.childrens) {
                const Datas = Object.assign({},data,{
                  key:data.id
                });
                const Darr = item.childrens.push(Datas);
                //item.leaf = 0;
                return Object.assign({},item,{
                  childrens:Darr
                });
              }else {
                //return item;
                if(item.leaf===0) {
                  return item;
                }else {
                  const Darr = [];
                  const Datas = Object.assign({},data,{
                    key:data.id
                  });
                  Darr.push(Datas);
                  item.childrens=Darr;
                    //item.isLeaf = false;
                    item.leaf = 0;
                }
              }
            }else {
              if(item.childrens) {
                this.addtree(item.childrens,data,slideID);
              }else {
                return item;
              }
            }
        });
    }

    querytree(arr, data, modifyID) {  //筛选增加树的节点
        return arr.map((item) => {
            if (item.id === modifyID) {
                return Object.assign({}, data, {
                    childrens: item.childrens,
                    key: item.key
                });
            } else {
                if (item.childrens) {
                    return Object.assign({}, item, {
                        childrens: this.querytree(item.childrens, data, modifyID)
                    });
                } else {
                    return item;
                }
            }
        });
    }

    deletetree(arr, data) {   //删除时修改树的函数
        const b = arr.map((item) => {
            if (item.id === data.id) {
                arr.filter((text) => {
                    if (text.id !== data.id) {
                        return text;
                    }
                });
            } else {
                if (item.childrens) {
                    return Object.assign({}, item, {
                        childrens: this.deletetree(item.childrens, data)
                    });
                } else {
                    return item;
                }
            }
        });
        const c = b.filter((text) => {
            if (text !== undefined) {
                return text;
            }
        });
        return c;
    }

    listurl(arr, k) {
        let b;
        arr.filter((item) => {
            if (item[k]) {
                return b = item[k];
            }
        });
        return b;
    }

    systemOpt(url) {
        context.create('system_opt', {
            request: {
                mockUrl: `/proxy${url}`,
                url: `${url}`,
                method: 'POST'
            }
        });
    }

    systemDelete(url) {
        context.create('system_Delete', {
            deleteData: {
                mockUrl: `/proxy${url}/:id`,
                url: `${url}/:id`,
                rest: true
            }
        });
    }

    modelRequest(data, success) {
        let d;
        let t;
        data && data.rows ? d = data.rows : d = [];
        data ? t = data.total : t = 0;
        let flag;
        success?flag=false:flag=true;
        return {d,t,flag};
      }
      CompanyTreelist(data, treeNode) {  //对左侧数据进行操作
        const datas = data.map((item, i) => {
            if (item.leaf === 0) {
                return Object.assign({}, item, {
                    title: item.companyName,
                    key: `${treeNode.props.eventKey}-${i}`
                });
            } else {
                return Object.assign({}, item, {
                    title: item.companyName,
                    isLeaf: true,
                    key: `${treeNode.props.eventKey}-${i}`
                });
            }
        });
        return datas;
      }
}

export default new OperationMethod();