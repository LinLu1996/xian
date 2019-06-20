import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
import Com from '@/component/common';
import moment from 'moment';
import Operation from '../public.js';
const maplist = (data) => {
    const databox = data.map((item) => {
        if (item.stauts === 0) {
            return Object.assign({}, item, {
                key: item.id,
                gmtCreate: moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss'),
                gmtModified: moment(item.gmtModified).format('YYYY-MM-DD HH:mm:ss')
            });
        } else if (item.stauts === 1) {
            return Object.assign({}, item, {
                key: item.id,
                gmtCreate: moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss'),
                gmtModified: moment(item.gmtModified).format('YYYY-MM-DD HH:mm:ss')
            });
        } else {
            return Object.assign({}, item, {
                key: item.id,
                gmtCreate: moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss'),
                gmtModified: moment(item.gmtModified).format('YYYY-MM-DD HH:mm:ss')
            });
        }
    });
  return databox;
};
//配置接口参数
context.create('role', {
    rolelistByPage: {
      mockUrl: '/proxy/role/listByPage',
      url:'/role/listByPage'
  },
    setStatus: {
      mockUrl: '/proxy/position/setPositionStatusByPositionId',
      url:'position/setPositionStatusByPositionId'
    },
    CompanyAll:{
      mockUrl:'/proxy/company/getAllParentCompany',
      url: '/company/getAllParentCompany'
  }
});
context.create('role_res', {
    getdata: {
      url: '/roleResource/updateByRoleId',
      mockUrl: '/proxy/roleResource/updateByRoleId',
      method: 'POST',
      header:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    },
    gethavedata:{
        url:'/roleResource/getResIdsByRoleId/:id',
        mockUrl:'/proxy/roleResource/getResIdsByRoleId/:id',
        rest: true
    },
    deleteData:{
      url:'/role/delete/:id',
      mockUrl:'/proxy/role/delete/:id',
      rest:true
    }
  });
//封装页面reducer、action
const roleModel = {
  reducer: (defaultState = {
    value: '',
    Alldate:[],
    total:null,
    parentid:null,
    modalflag:false,
    modaltype:'',
    fields:{},
    flag:true,
    queryfields:{},
    sortfield:'gmt_create',
    sortorder:'DESC'
  }, action) => {
    switch (action.type) {
      case 'ROLE_ALLDATA': {  //进入页面的数据
        const Alldate = action.dataAll;
        const total = action.total;
        const flag = action.flag;
        return Object.assign({}, defaultState, {
          Alldate:Alldate,
          total:total,
          flag:flag
        });
      }
      case 'ROLE_PARENT_ID':
      return Object.assign({}, defaultState, {
        parentid:action.parentid
      });
      case 'ROLE_MODAL':
      return Object.assign({}, defaultState, {
        modalflag:action.modalflag,
        modaltype:action.modaltype
      });
      case 'ROLE_DEFAULTFIELD': {
        const fields = action.data;
        return Object.assign({}, defaultState, {fields: fields});
      }
      case 'ROLE_QUERYDEFAULTFIELDS': {
        const fields= action.data;
        return Object.assign({}, defaultState, {queryfields: fields});
      }
      case 'ROLE_SORDER':
      return Object.assign({},defaultState, {
        sortfield:action.sortfield,
        sortorder:action.sortorder
      });
    }
    return defaultState;
  },
  action: (dispatch) => {
    return {
      Alldatas: ( page ) => {
        IO.role.rolelistByPage(page).then((res) => {
          const initdata = Operation.modelRequest(res.data,res.success);
          const dataAll = maplist(initdata.d);
          dispatch({
            type: "ROLE_ALLDATA",
            dataAll,
            total:initdata.t,
            flag:initdata.flag
          });
        }).catch(Com.errorCatch);
      },
      defaultFields:(data) => {
        dispatch({
          type: "ROLE_DEFAULTFIELD",
          data
        });
      },
      parentID:(name) => {
        dispatch({
          type: "ROLE_PARENT_ID",
          parentid:name
        });
      },
      modal:(obj) => {
        dispatch({
          type: "ROLE_MODAL",
          modalflag:obj.modalFlag,
          modaltype:obj.modeltype
        });
      },
      querydefaultfields:(data) => {
        dispatch({
          type: "ROLE_QUERYDEFAULTFIELDS",
          data
        });
      },
      sorter:(obj) => {
        dispatch({
          type: "ROLE_SORDER",
          sortfield:obj.sortfield,
          sortorder:obj.sortorder
        });
      }
    };
  }
};

reducers.assemble = {roleReducer: roleModel.reducer};

const action = roleModel.action;
export {
  action,
  IO
};
