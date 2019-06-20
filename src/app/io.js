/* global __ENV__:true*/
import nattyFetch from 'natty-fetch-fd';
import NProgress from 'nprogress';
import { notification } from 'antd';
nattyFetch.on("reject",(res) => {
  if(res.code===1000) {
    sessionStorage.setItem('flag',false);
    location.reload();
  }else if(res.code===2003) {
      notification["error"]({
          message: "页面鉴权已失效，请重新登录"
      });
      setTimeout(() => {
          sessionStorage.setItem('flag',false);
          location.reload();
      }, 3000);
  }
});
const context = nattyFetch.context({
  mock: __ENV__ === "development",
  willFetch: () => {
    NProgress.start();
  },
  data:() => {
    return {
      '_csrf':sessionStorage.getItem('token')
    };
  },
  didFetch: () => {
    NProgress.done();
  },
  withCredentials: true,
  traditional: true,
  fit(response) {
    return {
      "success": response.success,
      "content": response,
      "error": response
    };
  }
});
const IO = context.api;

export {
  context,
  IO
};