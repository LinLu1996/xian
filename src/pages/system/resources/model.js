import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
import Com from '@/component/common';
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
      title : item.resName,
      key : item.id
    });
  });
};
//配置接口参数
context.create('resources', {
  listByPagedata: {
    mockUrl: '/proxy/resource/listByPage',
    url:'/resource/listByPage'
  },
  TreeData: {
    mockUrl: '/proxy/resource/getResourceConfigTree',
    url:'/resource/getResourceConfigTree'
  },
  TreeDatapage: {
    mockUrl: '/proxy/resource/getChildsByIdPage',
    url:'/resource/getChildsByIdPage',
    rest: true
  },
  setStatus: {
    mockUrl: '/proxy/resource/setResourceStatusByResourceId',
    url:'/resource/setResourceStatusByResourceId'
  }
});
//封装页面reducer、action
const resourcesModel = {
  reducer: (defaultState = {
    Alldate:[], //列表的数据
    total:null,  //数据的总条数
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
      case 'RES_ALL_DATA': {
        const Alldate = action.dataAll;
        const total = action.total;
        const flag = action.flag;
        return Object.assign({}, defaultState, {
          Alldate:Alldate,
          total:total,
          flag:flag
        });
      }
        case 'RES_CHOOSE_ALL': {
          const chooseAlls = action.chooseall;
          const choosetotal = action.choosetotal;
          const flag = action.flag;
          return Object.assign({}, defaultState, {
            Alldate:chooseAlls,
            total:choosetotal,
            flag:flag
          });
        }
        case 'RES_MODAL':
        return Object.assign({}, defaultState, {
          modalflag:action.modalflag,
          modaltype:action.modaltype
        });
        case 'RES_DEFAULTFIELD': {
          const fields = action.data;
          return Object.assign({}, defaultState, {fields: fields});
        }
        case 'RES_TREE_DATAs':
        return Object.assign({}, defaultState, {
          TreeD:action.tree
        });
        case 'RES_QUERYDEFAULTFIELDS': {
          const fields= action.data;
          return Object.assign({}, defaultState, {queryfields: fields});
        }
        case 'RES_SLIDEID':
        return Object.assign({}, defaultState, {
          slideID:action.num,
          slideName:action.slideName
        });
        case 'RES_PARENTID':
        return Object.assign({}, defaultState, {
          parentID:action.parentid,
          modifyID:action.modifyid,
          modifycode:action.modifycode
        });
        case 'RES_SORDER':
        return Object.assign({},defaultState, {
          sortfield:action.sortfield,
          sortorder:action.sortorder
        });
        case 'RES_RIGHTQUERYITEM':
        return Object.assign({},defaultState, {
          rightItem:action.ITEM
        });
        case 'RES_RIGHTSEARCHFLAG':
        return Object.assign({},defaultState, {
          searchflag:action.zcflag
        });
    }
    return defaultState;
  },
  action: (dispatch) => {
    return {
      Alldatas: ( page ) => {  //进入页面的列表数据
        IO.resources.listByPagedata(page).then((res) => {
          const initdata = Operation.modelRequest(res.data,res.success);
          const dataAll = maplist(initdata.d);
          dispatch({
            type: "RES_ALL_DATA",
            dataAll,
            total:initdata.t,
            flag:initdata.flag
          });
        }).catch(Com.errorCatch);
      },
      chooseAll:(chooseall) => {   //点击侧边的列表数据
        IO.resources.TreeDatapage(chooseall).then((res) => {
          const initdata = Operation.modelRequest(res.data,res.success);
          const chooseall = maplist(initdata.d);
          dispatch({
            type: "RES_CHOOSE_ALL",
            chooseall,
            choosetotal:initdata.t,
            flag:initdata.flag
          });
        }).catch(Com.errorCatch);
      },
      defaultFields:(data) => {  //弹出框的数据
        dispatch({
          type: "RES_DEFAULTFIELD",
          data
        });
      },
      querydefaultfields:(data) => {
        dispatch({
          type: "RES_QUERYDEFAULTFIELDS",
          data
        });
      },
      TreeData:(obj) => {  //存放左边的数据
        dispatch({
          type: "RES_TREE_DATAs",
          tree:treedata(obj.tree)
        });
      },
      modal:(obj) => {  //弹出框是否显示
        dispatch({
          type: "RES_MODAL",
          modalflag:obj.modalFlag,
          modaltype:obj.modeltype
        });
      },
      slide:(obj) => {
        dispatch({
          type: "RES_SLIDEID",
          num:obj.num,
          slideName:obj.slideName
        });
      },
      querylist:(obj) => {
        dispatch({
          type: "RES_PARENTID",
          parentid:obj.parentID,
          modifyid:obj.modifyid,
          modifycode:obj.modifycode
        });
      },
      sorter:(obj) => {
        dispatch({
          type: "RES_SORDER",
          sortfield:obj.sortfield,
          sortorder:obj.sortorder
        });
      },
      rightqueryItem:(obj) => {
        dispatch({
          type: "RES_RIGHTQUERYITEM",
          ITEM:obj
        });
      },
      RightsearchFlag:(obj) => {
        dispatch({
          type: "RES_RIGHTSEARCHFLAG",
          zcflag:obj.flag
        });
      }
    };
  }
};

reducers.assemble = {resourcesReducer_: resourcesModel.reducer};
const action = resourcesModel.action;
export {
  action,
  IO
};
