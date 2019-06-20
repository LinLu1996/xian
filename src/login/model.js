import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
//配置接口参数
context.create('login', {
    loginRequest: {
      mockUrl: '/proxy/authentication/form',
      url:'/authentication/form',
      method: 'POST'
    }
});
//封装页面reducer、action
const loginModel = {
  reducer: (defaultState = {
  }) => {
    return defaultState;
  },
  action: () => {
    return {
    };
  }
};

reducers.assemble = {loginReducer: loginModel.reducer};
const action = loginModel.action;
export {
  action,
  IO
};
