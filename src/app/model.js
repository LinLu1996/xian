import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
//配置接口参数
context.create('init', {
  menu: {
    url: '/resource/getResourceTreeMenu',
    mockUrl: '/proxy/resource/getResourceTreeMenu'
  },
  securitykeyword: {
    mockUrl: '/proxy/security/getCurrentUserResourceKeyWords',
    url: '/security/getCurrentUserResourceKeyWords'
  }
});
//封装页面reducer、action
const initModel = {
  reducer: (defaultState = {
    menuData: [],
    headerStyle: "",
    slideStyle: "",
    conpanyname:'',
    logoimg:'',
    securityKeyWord:[]
  }, action) => {
    switch(action.type) {
      case 'INIT_GET_MENU':
        return Object.assign({}, defaultState, {
          menuData: action.menuData
        });
      case 'INIT_GET_USER':
        return Object.assign({}, defaultState, {
          userInfo: action.userInfo
        });
      case 'INIT_COMPANY_NAME':
        return Object.assign({}, defaultState, {
          conpanyname: action.conpanyname
        });
      case 'INIT_COMPANY_LOGO':
        return Object.assign({}, defaultState, {
          logoimg:action.logoimg
        });
      case 'INIT_SECURITY_KEYWORD':
        return Object.assign({}, defaultState, {
          securityKeyWord:action.securitykeyword
      });
    }
    return defaultState;
  },
  action: (dispatch) => {
    return {
      getMenu: () => {
        IO.init.menu().then((res) => {
          let menudata;
          res.data ? menudata = res.data : menudata=[];
          dispatch({
            type: 'INIT_GET_MENU',
            menuData: menudata
          });
        }).catch();
      },
        getSecurityKeyword: async () => {
        await IO.init.securitykeyword().then((res) => {
            let d;
            res.data?d=res.data:d=[];
            dispatch({
                type: 'INIT_SECURITY_KEYWORD',
                securitykeyword: d
            });
        }).catch();
      },
      getUser: (data) => {
        dispatch({
          type: 'INIT_GET_USER',
          userInfo: data
        });
      }
    };
  }
};

reducers.assemble = {initReducer: initModel.reducer};

const action = initModel.action;

export {
  action,
  IO
};
