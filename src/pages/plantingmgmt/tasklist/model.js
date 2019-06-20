import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
//配置接口参数
context.create('agriculturalTask', {
  listByPagedata: {
      mockUrl: '/proxy/workTask/listByPage',
      url: '/workTask/listByPage',
      method: 'POST'
  },
  Adddata: {
    mockUrl: '/proxy/resource/add',
    method: 'POST'
  },
  deleteData: {
    mockUrl: '/proxy/resource/delete/:id',
      uel: '/resource/delete/:id',
    rest: true
  },
  Modifydata: {
    mockUrl: '/proxy/workTask/finish',
      url: '/workTask/finish',
    method: 'POST'
  },
  TreeData: {
    mockUrl: '/proxy/resource/getChildsById',
    rest: true
  },
    //任务类型字典
    GetAllWorkType: {
        mockUrl: '/proxy/workType/listAll',
        url: '/workType/listAll',
        method: 'GET',
        rest: true
    },
   GetOne: {
       mockUrl: '/proxy/workTask/getById',
       url: '/workTask/getById',
       method: 'GET'
   },
    finishTask: {
        mockUrl: '/proxy/workTask/finish',
        url: '/workTask/finish',
        method: 'POST'
    },
    TasklistByPagedata: {
      mockUrl: '/proxy/workTask/getTaskCalendar',
      url: '/workTask/getTaskCalendar',
      method: 'POST'
  },
  createTask: {
      mockUrl: '/proxy/workTask/createTask',
      url: '/workTask/createTask',
      method: 'POST'
  }
});
//封装页面reducer、action
const farmingModel = {
  reducer: (defaultState = {
    Alldate:[],
    total:0,
    allTotal: 0,
    pendingTotal: 0,
    overtimeTotal: 0,
    doneTotal: 0,
    parentname:null,
    PID:null,
    Psize:10,
    Cur:1,
    fields:{},
    TreeD:[],
    addflag:false,
    modalflag:false,
    modalflagDetails:false,
    modaltype:'',
    parentID:null,
    slideID:-1,
    modifyID:null,
    chooseCUR:1,
    chooseSIZE:10,
    slideparentID:-1,
    slideName:'农事任务',
    workTypeDic: [],
    detailData: {},
    baseList: [],
    cropList: [],
    landList: []
  }, action) => {
    const fields = action.data;
    switch (action.type) {
      case 'AGRTASK_ALL_DATA': {
        const Alldate = action.dataAll;
        const total = action.total;
        const allTotal = action.allTotal;
        const pendingTotal = action.pendingTotal;
        const overtimeTotal = action.overtimeTotal;
        const doneTotal = action.doneTotal;
        return Object.assign({}, defaultState, {
          Alldate:Alldate,
          total:total,
          allTotal: allTotal,
          pendingTotal: pendingTotal,
          overtimeTotal: overtimeTotal,
          doneTotal: doneTotal,
          chooseflag:false
        });
      }
        case 'AGRTASK_QUERY_ALL': {
          const queryAlls = action.queryall;
          const querytotal = action.querytotal;
          const allTotal = action.allTotal;
          const pendingTotal = action.pendingTotal;
          const overtimeTotal = action.overtimeTotal;
          const doneTotal = action.doneTotal;
          return Object.assign({}, defaultState, {
            Alldate:queryAlls,
            total:querytotal,
            pendingTotal: pendingTotal,
            overtimeTotal: overtimeTotal,
            doneTotal: doneTotal,
            allTotal: allTotal
          });
        }
        case 'AGRTASK_CLEAR_DATA': {
            const queryAlls = action.queryall;
            const querytotal = action.querytotal;
            return Object.assign({}, defaultState, {
                Alldate:queryAlls,
                total:querytotal
            });
        }
        case 'AGRTASK_MENU_ALL':
        return Object.assign({}, defaultState, {
          Alldate:action.arr,
          total:action.num
          //chooseflag:true
        });
//        case 'AGRTASK_CHOOSE_ALL': {
//          const chooseAlls = action.chooseall;
//          const choosetotal = action.choosetotal;
//          return Object.assign({}, defaultState, {
//            Alldate:chooseAlls,
//            total:choosetotal
//          });
//        }
        case 'AGRTASK_SUPERIOR_NAME':
        return Object.assign({}, defaultState, {
          parentname:action.Name
        });
        case 'AGRTASK_RES_PAGE':
        return Object.assign({}, defaultState, {
          Cur:action.cur,
          Psize:action.psize
        });
        case 'AGRTASK_MODAL':
        return Object.assign({}, defaultState, {
          modalflag:action.modalflag,
          modaltype:action.modaltype
        });
        case 'AGRTASK_MODAL_DETAILS':
        return Object.assign({}, defaultState, {
          modalflagDetails:action.modalflagDetails,
          modaltype:action.modaltype
        });
        case 'AGRTASK_DEFAULTFIELD':
        return Object.assign({}, defaultState, {fields: fields});
        case 'AGRTASK_TREE_DATAs':
        return Object.assign({}, defaultState, {
          TreeD:action.tree
        });
        case 'AGRTASK_SLIDEID':
        return Object.assign({}, defaultState, {
          slideID:action.num,
          slideName:action.slideName,
          slideparentID:action.slideparentID
        });
        case 'AGRTASK_PARENTID':
        return Object.assign({}, defaultState, {
          parentID:action.parentid,
          modifyID:action.modifyid
        });
        case 'AGRTASK_CHOOSEPAGE':
        return Object.assign({}, defaultState, {
          chooseCUR:action.chooseCUR,
          chooseSIZE:action.chooseSIZE
        });
        case 'AGRTASK_ALL_WORKTYPE_DIC':
            return Object.assign({}, defaultState, {
                workTypeDic: action.dataAll
            });
         case 'AGRTASK_GET_ONE': {
            const data = action.data;
            return Object.assign({}, defaultState, {
                detailData:data
            });
          }
          case 'TASKCALENDAR_ALL_BASE': {
            const dicAll = action.dataAll;
            return Object.assign({}, defaultState, {
                baseList: dicAll
            });
        }
        case 'TASKCALENDAR_ALL_LAND': {
            const dicAll = action.dataAll;
            return Object.assign({}, defaultState, {
                landList: dicAll
            });
        }
        case 'TASKCALENDAR_ALL_CROP': {
            const dicAll = action.dataAll;
            return Object.assign({}, defaultState, {
                cropList: dicAll
            });
        }
    }
    return defaultState;
  },
  action: (dispatch) => {
    return {
      superiorName:(parent) => {  //点击左边树的数据
        dispatch({
          type: "AGRTASK_SUPERIOR_NAME",
          Name:parent.name,
          parentid:parent.parentID,
          pID:parent.parentLeftID
        });
      },
    //    查询
      Alldatas: ( page ) => {  //进入页面的列表数据
        IO.agriculturalTask.listByPagedata(page).then((res) => {
          const data=res.data.rows||[];
          const total=res.data.total || 0;
          const allTotal = res.data.all || 0;
          const pendingTotal = res.data.pending || 0;
          const overtimeTotal = res.data.overtime || 0;
          const doneTotal = res.data.done || 0;
          const dataAll = data.map((item) => {
            if(item.stauts===0) {
              return Object.assign({}, item, {
                stautsShow: '正常'
              });
            }else if(item.stauts===1) {
              return Object.assign({}, item, {
                stautsShow: '禁用'
              });
            }else {
              return item;
            }
          });
          dispatch({
            type: "AGRTASK_ALL_DATA",
            dataAll,
            total,
            allTotal,
            pendingTotal,
            overtimeTotal,
            doneTotal
          });
        }).catch();
      },
      clearData: () => {
          const queryall = [];
          const querytotal = 0;
          dispatch({
              type: "AGRTASK_CLEAR_DATA",
              queryall,
              querytotal
          });
      },
      queryAll: (req) => {  //筛选的列表数据
        IO.agriculturalTask.listByPagedata(req).then((res) => {
          const querytotal=res.data.total || 0;
          const allTotal = res.data.all || 0;
          const pendingTotal = res.data.pending || 0;
          const overtimeTotal = res.data.overtime || 0;
          const doneTotal = res.data.done || 0;
          const data = res.data.rows || [];
          const queryall = data.map((item) => {
              if(item.stauts===0) {
                return Object.assign({}, item, {
                  stauts: '正常'
                });
              }else if(item.stauts===1) {
                return Object.assign({}, item, {
                  stauts: '禁用'
                });
              }else {
                return item;
              }
            });
          dispatch({
            type: "AGRTASK_QUERY_ALL",
            queryall,
            querytotal,
            pendingTotal,
            overtimeTotal,
            doneTotal,
            allTotal
          });
        }).catch();
      },
       page:(obj) => {  //分页页码
          dispatch({
            type: "AGRTASK_RES_PAGE",
            cur:obj.current,
            psize:obj.pageSize
           });
       },
       choosepage:(obj) => {
         dispatch({
           type: "AGRTASK_CHOOSEPAGE",
           chooseCUR:obj.current,
           chooseSIZE:obj.pageSize
         });
       },
        AllWorkTypeQuery: () => {
            IO.agriculturalTask.GetAllWorkType().then((res) => {
                const data = res.data || {};
                dispatch({
                    type: "AGRTASK_ALL_WORKTYPE_DIC",
                    dataAll: data
                });
            }).catch();
        },
        getOne: async (req) => {  //单个获取数据
            const res= await IO.agriculturalTask.GetOne(req);
            const data = res.data;
            if(data.stauts===0) {
                data.stautsShow = '正常';
            }else if(data.stauts===1) {
                data.stautsShow = '禁用';
            }
            dispatch({
                type: "AGRTASK_GET_ONE",
                data
            });
        },
        getCompanyBase: () => {
          IO.earlyWarningList.getAllBase({companyId: 1}).then((res) => {
              const data = res.data || [];
              dispatch({
                  type: "TASKCALENDAR_ALL_BASE",
                  dataAll: data
              });
          });
      },
      getBaseLand: (value) => {
          IO.farmCostAnalysis.getBaseLand({':baseId': value}).then((res) => {
              const data = res.data || [];
              dispatch({
                  type: "TASKCALENDAR_ALL_LAND",
                  dataAll: data
              });
          });
      },
      getCompanyCrop: () => {
          IO.farmingPlan.GetAllCrop({companyId: 1}).then((res) => {
              const data = res.data || [];
              dispatch({
                  type: "TASKCALENDAR_ALL_CROP",
                  dataAll: data
              });
          });
      },
      // 创建
      defaultFields:(data) => {  //弹出框的数据
        dispatch({
          type: "AGRTASK_DEFAULTFIELD",
          data
        });
       },
      modal:(obj) => {  //弹出框是否显示
        dispatch({
          type: "AGRTASK_MODAL",
          modalflag:obj.modalFlag,
          modaltype:obj.modeltype
        });
      },
      modalDetails:(obj) => {  //弹出框是否显示
          dispatch({
            type: "AGRTASK_MODAL_DETAILS",
            modalflagDetails:obj.modalFlagDetails,
            modaltype:obj.modeltype
          });
        }
    };
  }
};

reducers.assemble = {agriculturalTaskReducer: farmingModel.reducer};
const action = farmingModel.action;
const IOModel = {
  TreeMOdel:IO.agriculturalTask.TreeData,
  Delete:IO.agriculturalTask.deleteData,
  Adddata:IO.agriculturalTask.Adddata,
  Modifydata:IO.agriculturalTask.Modifydata,
  FinishTask:IO.agriculturalTask.finishTask
};
export {
  action,
  IO,
  IOModel
};
