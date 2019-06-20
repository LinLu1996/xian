import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
import Com from '@/component/common/index';
import moment from 'moment';
import Operation from '../public.js';
const maplist = (data) => {
  const databox = data.map((item) => {
    const creatgmt = moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss');
    const querygmt = moment(item.gmtModified).format('YYYY-MM-DD HH:mm:ss');
    return Object.assign({}, item, {
      gmtCreate:creatgmt,
      gmtModified:querygmt,
      key:item.id
    });
  });
  return databox;
};
const treedata =(data) => {
  return data.map(item => {
    if (item.childrens) {
      item.childrens = treedata(item.childrens);
    }
    return Object.assign({},item,{
      title : item.nodeName,
      key : item.id
    });
  });
};
//配置接口参数
context.create('node', {
  listByPagedata: {
    mockUrl: '/proxy/node/listByPage',
    url:'/node/listByPage'
  },
    add: {
        mockUrl: '/proxy/node/add',
        url:'/node/add',
        method: 'POST'
    },
    delete: {
        mockUrl: '/proxy/node/delete/:id',
        url:'/node/delete/:id',
        method: 'GET',
        rest: true
    },
    update: {
        mockUrl: '/proxy/node/update',
        url:'/node/update',
        method: 'POST'
    },
    getCompany: {
        mockUrl: '/proxy/node/getCompany/:id',
        url:'/node/getCompany/:id',
        method: 'GET',
        rest: true
    },
    allData: {
        mockUrl: '/proxy/node/getAllCompany',
        url:'/node/getAllCompany',
        method: 'GET',
        rest: true
    },
    updateByCompanyId: {
        mockUrl: '/proxy/node/updateByCompanyId',
        url:'/node/updateByCompanyId',
        method: 'POST'
    },
  TreeData: {
    mockUrl: '/proxy/node/getNodeConfigTree',
    url:'/node/getNodeConfigTree',
    rest: true
  },
  TreeDatapage: {
    mockUrl: '/proxy/node/getChildsByPage',
    url:'/node/getChildsByPage',
    rest: true
  },
  setStatus: {
    mockUrl: '/proxy/resource/setResourceStatusByResourceId',
    url:'/resource/setResourceStatusByResourceId'
  }
});
//封装页面reducer、action
const nodeModel = {
  reducer: (defaultState = {
    Alldate:[], //列表的数据
    total:null,  //数据的总条数
    parentname:null, //要显示的上级名字
    fields:{},  //form的数据
    TreeD:[],  //树的数据
    modalflag:false, //弹出框的显示
    modaltype:'', //弹出框的类型
    parentID:null,//点击修改需要的上级ID
    slideID:-1,  //点击树所对应的id
    modifyID:null,//点击修改的ID
    slideName:'资源',   //点击树的父级名字
    flag:true,  //loading的展示
    modifycode:null,  //修改的code码
    queryfields:{},  //修改时存放的form的数据
    sortfield:'gmt_create',
    sortorder:'DESC',
    rightItem:{},
    searchflag:false
  }, action) => {
    switch (action.type) {
      case 'NODE_ALL_DATA': {
        const Alldate = action.dataAll;
        const total = action.total;
        const flag = action.flag;
        return Object.assign({}, defaultState, {
          Alldate:Alldate,
          total:total,
          flag:flag
        });
      }
        case 'NODE_CHOOSE_ALL': {
          const chooseAlls = action.chooseall;
          const choosetotal = action.choosetotal;
          const flag = action.flag;
          return Object.assign({}, defaultState, {
            Alldate:chooseAlls,
            total:choosetotal,
            flag:flag
          });
        }
        case 'NODE_SUPERIOR_NAME':
        return Object.assign({}, defaultState, {
          parentname:action.Name
        });
        case 'NODE_MODAL':
        return Object.assign({}, defaultState, {
          modalflag:action.modalflag,
          modaltype:action.modaltype
        });
        case 'NODE_DEFAULTFIELD': {
          const fields = action.data;
          return Object.assign({}, defaultState, {fields: fields});
        }
        case 'NODE_TREE_DATAs':
        return Object.assign({}, defaultState, {
          TreeD:action.tree
        });
        case 'NODE_QUERYDEFAULTFIELDS': {
          const fields= action.data;
          return Object.assign({}, defaultState, {queryfields: fields});
        }
        case 'NODE_SLIDEID':
        return Object.assign({}, defaultState, {
          slideID:action.num,
          slideName:action.slideName
        });
        case 'NODE_PARENTID':
        return Object.assign({}, defaultState, {
          parentID:action.parentid,
          modifyID:action.modifyid,
          modifycode:action.modifycode
        });
        case 'NODE_SORDER':
        return Object.assign({},defaultState, {
          sortfield:action.sortfield,
          sortorder:action.sortorder
        });
        case 'NODE_RIGHTQUERYITEM':
        return Object.assign({},defaultState, {
          rightItem:action.ITEM
        });
        case 'NODE_RIGHTSEARCHFLAG':
        return Object.assign({},defaultState, {
          searchflag:action.zcflag
      });
    }
    return defaultState;
  },
  action: (dispatch) => {
    return {
      Alldatas: ( page ) => {  //进入页面的列表数据
        IO.node.listByPagedata(page).then((res) => {
          const initdata = Operation.modelRequest(res.data,res.success);
          const dataAll = maplist(initdata.d);
          dispatch({
            type: "NODE_ALL_DATA",
            dataAll,
            total:initdata.t,
            flag:initdata.flag
          });
        }).catch(Com.errorCatch);
      },
      chooseAll:(chooseall) => {   //点击侧边的列表数据
        IO.node.TreeDatapage(chooseall).then((res) => {
          const initdata = Operation.modelRequest(res.data,res.success);
          const chooseall = maplist(initdata.d);
          dispatch({
            type: "NODE_CHOOSE_ALL",
            chooseall,
            choosetotal:initdata.t,
            flag:initdata.flag
          });
        }).catch(Com.errorCatch);
      },
      defaultFields:(data) => {  //弹出框的数据
        dispatch({
          type: "NODE_DEFAULTFIELD",
          data
        });
      },
      querydefaultfields:(data) => {
        dispatch({
          type: "NODE_QUERYDEFAULTFIELDS",
          data
        });
      },
      TreeData:(obj) => {  //存放左边的数据
        dispatch({
          type: "NODE_TREE_DATAs",
          tree:treedata(obj.tree)
        });
      },
      superiorName:(parent) => {  //点击左边树的数据
        dispatch({
          type: "NODE_SUPERIOR_NAME",
          Name:parent.name
        });
      },
      modal:(obj) => {  //弹出框是否显示
        dispatch({
          type: "NODE_MODAL",
          modalflag:obj.modalFlag,
          modaltype:obj.modeltype
        });
      },
      slide:(obj) => {
        dispatch({
          type: "NODE_SLIDEID",
          num:obj.num,
          slideName:obj.slideName
        });
      },
      querylist:(obj) => {
        dispatch({
          type: "NODE_PARENTID",
          parentid:obj.parentID,
          modifyid:obj.modifyid,
          modifycode:obj.modifycode
        });
      },
      sorter:(obj) => {
        dispatch({
          type: "NODE_SORDER",
          sortfield:obj.sortfield,
          sortorder:obj.sortorder
        });
      },
      rightqueryItem:(obj) => {
        dispatch({
          type: "NODE_RIGHTQUERYITEM",
          ITEM:obj
        });
      },
      RightsearchFlag:(obj) => {
        dispatch({
          type: "NODE_RIGHTSEARCHFLAG",
          zcflag:obj.flag
        });
      }
    };
  }
};

reducers.assemble = {nodeReducer:nodeModel.reducer};
const action = nodeModel.action;
const IOModel = {
    add: IO.node.add,
    delete: IO.node.delete,
    update: IO.node.update,
    updateByCompanyId: IO.node.updateByCompanyId,
    getCompany: IO.node.getCompany,
    allData: IO.node.allData
};
export {
  action,
  IO,IOModel
};
