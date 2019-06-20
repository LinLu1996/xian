import { notification } from 'antd';
import NProgress from 'nprogress';

class Com {
  static errorCatch(res) {
    NProgress.done();
    notification["error"]({
      message: res.data
    });
  }
  static addKey(data) {
    const databox = data.map((item) => {
      item.key = `${item.operationId}`;
      return item;
    });
    return databox;
  }
  static closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
      if (matchesSelector.call(el, selector)) {
        break;
      }
      el = el.parentElement;
    }
    return el;
  }
    /**
     * 判断操作是否拥有权限
     * @param securityKeyWord 用户拥有关键字集合
     * @param key 操作关键字
     * @param operate 操作类型:[show:查看,update:更新,delete:删除,insert:新增,download:下载]
     * @param page  页面
     * @returns {boolean}
     */
  static hasRole(securityKeyWord,key,operate,page) {
    if(securityKeyWord && securityKeyWord.indexOf("platform_all") > -1) {
      //平台类用户超级管理员角色，拥有所有权限
        //控制平台用户不可操作业务模块的新增、编辑、删除操作
        if(page) {
          if("company" === page || "employee" === page || "node" === page || "resource" === page || "role" === page || "account" === page || "chargeunit" === page || "knowledgebase" === page) {
            return true;
          }else {
            if("show" === operate) {
              return true;
            }
          }
        }else {
            if("show" === operate) {
                return true;
            }
        }
        return false;
    }
    if(securityKeyWord && securityKeyWord.indexOf("platform_show") > -1) {
      if(operate) {
        if("show" === operate) {
          //平台类用户观察员角色，只有查看权限
          return true;
        }else {
          return false;
        }
      }
    }
    let flag = false;
    if(securityKeyWord && key) {
      flag = securityKeyWord.indexOf(key) > -1;
    }
    return flag;
  }
}
export default Com;