import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
//配置接口参数
context.create('temporaryWages', {
  listAll: {
    mockUrl: '/proxy//workWage/listByPage',
    url: '/workWage/listByPage'
  },
  listByPagedata: {
   mockUrl: '',
   url: ''
  },
  Modifydata: {
    mockUrl: '/proxy/workWage/update',
    url: '/workWage/update',
    method: 'POST'
  },
  getAllUnit: {
    mockUrl: '/proxy/workWage/getAllUnit',
    url: '/workWage/getAllUnit',
    method: 'GET'
  }
});
//封装页面reducer、action
const farmingModel = {
  reducer: (defaultState = {
    saveFlag:true,
    Alldate:[],
    total:null,
    parentname:null,
    PID:null,
    Psize:10,
    Cur:1,
    fields:{},
    TreeD:[],
    addflag:false,
    modalflag:false,
    modaltype:'',
    parentID:null,
    slideID:-1,
    modifyID:null,
    chooseCUR:1,
    chooseSIZE:10,
    slideparentID:-1,
    slideName:'资源'
  }, action) => {
    const fields = action.data;
    switch (action.type) {
      case 'WAGES_SAVE_FLAG': {
        const Alldate = action.saveFlag;
        return Object.assign({}, defaultState, {
          saveFlag:Alldate
        });
      }
      case 'WAGES_ALL_DATA': {
        const Alldate = action.dataAll;
        const total = action.total;
        return Object.assign({}, defaultState, {
          Alldate:Alldate,
          total:total,
          chooseflag:false
        });
      }
        case 'WAGES_QUERY_ALL': {
          const queryAlls = action.queryall;
          return Object.assign({}, defaultState, {
            Alldate:queryAlls
          });
        }
        case 'WAGES_MENU_ALL':
        return Object.assign({}, defaultState, {
          Alldate:action.arr,
          total:action.num
          //chooseflag:true
        });
        case 'WAGES_SUPERIOR_NAME':
        return Object.assign({}, defaultState, {
          parentname:action.Name
        });
        case 'WAGES_WAGES_PAGE':
        return Object.assign({}, defaultState, {
          Cur:action.cur,
          Psize:action.psize
        });
        case 'WAGES_MODAL':
        return Object.assign({}, defaultState, {
          modalflag:action.modalflag,
          modaltype:action.modaltype
        });
        case 'WAGES_DEFAULTFIELD':
        return Object.assign({}, defaultState, {fields: fields});
        case 'WAGES_TREE_DATAs':
        return Object.assign({}, defaultState, {
          TreeD:action.tree
        });
        case 'WAGES_SLIDEID':
        return Object.assign({}, defaultState, {
          slideID:action.num,
          slideName:action.slideName,
          slideparentID:action.slideparentID
        });
        case 'WAGES_PARENTID':
        return Object.assign({}, defaultState, {
          parentID:action.parentid,
          modifyID:action.modifyid
        });
        case 'WAGES_CHOOSEPAGE':
        return Object.assign({}, defaultState, {
          chooseCUR:action.chooseCUR,
          chooseSIZE:action.chooseSIZE
        });
        case 'WAGES_Unit':
        return Object.assign({},defaultState,{
          unit:action.units
        });
    }
    return defaultState;
  },
  action: (dispatch) => {
    return {
      superiorName:(parent) => {  //点击左边树的数据
        dispatch({
          type: "WAGES_SUPERIOR_NAME",
          Name:parent.name,
          parentid:parent.parentID,
          pID:parent.parentLeftID
        });
      },
    //    查询
      Alldatas: ( page ) => {  //进入页面的列表数据
        IO.temporaryWages.listByPagedata(page).then((res) => {
          const data=res.data||[];
          const total=res.total;
          const dataAll = data.map((item) => {
            let data = item;
            if(item.stauts===0) {
                data =  Object.assign({}, item, {
                stauts: '正常'
              });
            }else if(item.stauts===1) {
                data = Object.assign({}, item, {
                stauts: '禁用'
              });
            }
            return data;
          });
          dispatch({
            type: "WAGES_ALL_DATA",
            dataAll,
            total
          });
        }).catch();
      },
      getAllUnit:() => {
        IO.temporaryWages.getAllUnit().then((res) => {
          const  data=res.data;
          const units=[];
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const unit = {};
                    unit.id = data[i].id;
                    unit.name = data[i].unitName;
                    units.push(unit);
                }
            }
            dispatch({
                type: "WAGES_Unit",
                units
            });
        }).catch();
      },
      queryAll: (req) => {  //筛选的列表数据
        IO.temporaryWages.listAll(req).then((res) => {
          const queryall = res.data;
          dispatch({
            type: "WAGES_QUERY_ALL",
            queryall
          });
        }).catch();
      },
       page:(obj) => {  //分页页码
          dispatch({
            type: "WAGES_WAGES_PAGE",
            cur:obj.current,
            psize:obj.pageSize
           });
       },
       choosepage:(obj) => {
         dispatch({
           type: "WAGES_CHOOSEPAGE",
           chooseCUR:obj.current,
           chooseSIZE:obj.pageSize
         });
       },
      // 创建
      defaultFields:(data) => {  //弹出框的数据
        dispatch({
          type: "WAGES_DEFAULTFIELD",
          data
        });
       },
      saveFlagModel:(saveFlag) => {  //弹出框的数据
        dispatch({
          type: "WAGES_SAVE_FLAG",
          saveFlag
        });
       },
      modal:(obj) => {  //弹出框是否显示
        dispatch({
          type: "WAGES_MODAL",
          modalflag:obj.modalFlag,
          modaltype:obj.modeltype
        });
      }
    };
  }
};

reducers.assemble = {temporaryWagesReducer: farmingModel.reducer};
const action = farmingModel.action;
const IOModel = {
  listAll:IO.temporaryWages.listAll,
  TreeMOdel:IO.temporaryWages.TreeData,
  Delete:IO.temporaryWages.deleteData,
  Adddata:IO.temporaryWages.Adddata,
  Modifydata:IO.temporaryWages.Modifydata,
  ListAll:IO.temporaryWages.listAll,
  getAllUnit:IO.temporaryWages.getAllUnit
};
const wageIOMode = {
    getAllUnit:IO.temporaryWages.getAllUnit
};
export {
  action,
  IO,
  IOModel,
  wageIOMode
};
