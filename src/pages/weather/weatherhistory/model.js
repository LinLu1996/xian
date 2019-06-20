import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
//配置接口参数
context.create('historicalMeteorological', {
    listByPage: {
        mockUrl: '/proxy/workWeatherHistory/listByPage',
        url: '/workWeatherHistory/listByPage',
        method: 'POST'
    },
    Adddata: {
        mockUrl: '/proxy/astLand/add',
        url: '/astLand/add',
        method: 'POST'
    },
    changeStatus: {
        mockUrl: '/proxy/astLand/updateStatus',
        url: '/astLand/updateStatus',
        method:'POST'
    },
    Modifydata: {
        mockUrl: '/proxy/astLand/update',
        url: '/astLand/update',
        method: 'POST'
    },
    GetOne: {
        mockUrl: '/proxy/astLand/getById/:id',
        url: '/astLand/getById/:id',
        method: 'GET',
        rest: true
    },
    GetAllBase: {
        mockUrl: '/proxy/astLand/baseByCompanyId',
        url: '/astLand/baseByCompanyId',
        method: 'GET'
    },
    TreeData: {
        mockUrl: '',
        rest: true
    }
});
//封装页面reducer、action
const farmingModel = {
  reducer: (defaultState = {
      weatherHistory: {
          totalCount: 0,
          rows: []
      },
      PageSize:10,
      Cur:1,
      chooseCUR:1,
      chooseSIZE:10,
      parentname:''
  }, action) => {
    switch (action.type) {
        case 'WEATHER_ALL_DATA': {
            const data = action.data;
            return Object.assign({}, defaultState, {
                weatherHistory:data
            });
        }
        case 'WEATHER_RES_PAGE': {
            return Object.assign({}, defaultState, {
                Cur:action.cur,
                PageSize:action.psize
            });
        }
        case 'WEATHER_CHOOSEPAGE': {
            return Object.assign({}, defaultState, {
                chooseCUR:action.chooseCUR,
                chooseSIZE:action.chooseSIZE
            });
        }
        case 'LAND_SUPERIOR_NAME': {
            return Object.assign({}, defaultState, {
                parentname:action.Name
            });
        }
    }
    return defaultState;
  },
  action: (dispatch) => {
    return {
        superiorName:(parent) => {  //点击左边树的数据
            dispatch({
                type: "LAND_SUPERIOR_NAME",
                Name:parent.name,
                parentid:parent.parentID,
                pID:parent.parentLeftID
            });
        },
        listByPage: ( page ) => {  //进入页面的列表数据
            IO.historicalMeteorological.listByPage(page).then((res) => {
                const data=res.data;
                dispatch({
                    type: "WEATHER_ALL_DATA",
                    data
                });
            }).catch();
        },
       page:(obj) => {  //分页页码
          dispatch({
            type: "WEATHER_RES_PAGE",
            cur:obj.current,
            psize:obj.pageSize
           });
       },
       choosepage:(obj) => {
         dispatch({
           type: "WEATHER_CHOOSEPAGE",
           chooseCUR:obj.current,
           chooseSIZE:obj.pageSize
         });
       }
    };
  }
};

reducers.assemble = {historicalMeteorologicalReducer: farmingModel.reducer};
const action = farmingModel.action;
const IOModel = {
  TreeMOdel:IO.historicalMeteorological.TreeData,
  ListByPage:IO.historicalMeteorological.listByPage
};
export {
  action,
  IO,
  IOModel
};
