import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
import Com from '@/component/common';
//配置接口参数
context.create('system', {
  listall: {
    mockUrl: '/proxy/resource/listAll',
    url:'/resource/listAll'
  }
});
//封装页面reducer、action
const systemModel = {
  reducer: (defaultState = {
  }, action) => {
    switch (action.type) {
      case 'SYSTEM_ALL_DATA': {
        const Alldate = action.list;
        return Object.assign({}, defaultState, {
          listdata:Alldate
        });
      }
    }
    return defaultState;
  },
  action: (dispatch) => {
    return {
      listAll: () => {  //筛选的列表数据
        IO.system.listall().then((res) => {
          const arr = [];
          res.data.map((item) => {
            const obj = {};
            obj[item.keyword] = item.resUrl;
            arr.push(obj);
            return arr;
          });
          dispatch({
            type: "SYSTEM_ALL_DATA",
            list:arr
          });
        }).catch(Com.errorCatch);
      }
    };
  }
};

reducers.assemble = {systemReducer: systemModel.reducer};
const action = systemModel.action;
export {
  action,
  IO
};
