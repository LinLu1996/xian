import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
import Com from '@/component/common';
import Operation from '../public.js';
//配置接口参数
context.create('account', {
  companylistByPage: {
    mockUrl: '/proxy/account/listByPage',
    url:'/account/listByPage'
  },
  modify: {
    mockUrl: '/proxy/account/setAccountStatusByAccountId',
    url: '/account/setAccountStatusByAccountId'
  },
  CompanyAll:{
    mockUrl:'/proxy/company/getUserCompany',
    url: '/company/getUserCompany'
},
  chongzhimima: {
    mockUrl: '/proxy/account/resetPasswordByAccountId/',
    url: '/account/resetPasswordByAccountId/'
  },
  employeeListAll: {
    mockUrl:'/proxy/employee/listAll',
    url:'/employee/listAll',
    method:'GET'
    },
  accountTypeList: {
    mockUrl:'/proxy/account/listAll',
    url:'/account/listAll',
    method:'GET'
  }
});
//封装页面reducer、action
const accountModel = {
  reducer: (defaultState = {
    functionaryList:['Jack','Lucy','Tom'],
    companyList:['guoqiang','nifd'],
    accountList:[{id:'platform',name:'平台账户'},{id:'company',name:'农企账户'},{id:'government',name:'政府账户'},{id:'marketing',name:'营销账户'}],
    value: '',
    Alldate:[],
    total:null,
    Psize:7,
    Cur:1,
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
      case 'ACCOUNT_ALLDATA': {  //进入页面的数据
        const Alldate = action.dataAll;
        const total = action.total;
        const flag = action.flag;
        return Object.assign({}, defaultState, {
          Alldate:Alldate,
          total:total,
          flag:flag
        });
      }
        case 'ACCOUNT_QUERY_ALL': {  //筛选 完之后的数据
          const queryAlls = action.queryall;
          const querytotal = action.querytotal;
          const flag = action.flag;
          return Object.assign({}, defaultState, {
            Alldate:queryAlls,
            total:querytotal,
            flag:flag
          });
        }
        case 'ACCOUNT_RES_PAGE':
        return Object.assign({}, defaultState, {
          Cur:action.cur,
          Psize:action.psize
        });
        case 'ACCOUNT_PARENT_ID':
        return Object.assign({}, defaultState, {
          parentid:action.parentid
        });
        case 'ACCOUNT_MODAL':
        return Object.assign({}, defaultState, {
          modalflag:action.modalflag,
          modaltype:action.modaltype
        });
        case 'ACCOUNT_SORDER':
        return Object.assign({},defaultState, {
          sortfield:action.sortfield,
          sortorder:action.sortorder
        });
        case 'ACCOUNT_DEFAULTFIELD': {
          const fields = action.data;
          return Object.assign({}, defaultState, {fields: fields});
        }
        case 'ACCOUNT_QUERYDEFAULTFIELDS': {
          const fields= action.data;
          return Object.assign({}, defaultState, {queryfields: fields});
        }
        case 'ACCOUNT_EMPLOYEE': {
            const personList = action.personList;
            return Object.assign({}, defaultState, {
                functionaryList: personList,
                chooseflag: false
            });
        }
        case 'ACCOUNT_COMPANY' : {
            const companyList= action.companyList;
            return Object.assign({}, defaultState, {
                companyList: companyList,
                chooseflag: false
            });
        }
        case 'ACCOUNT_TYPE' : {
            const accountList= action.accountList;
            return Object.assign({}, defaultState, {
                accountList: accountList,
                chooseflag: false
            });
        }
    }
    return defaultState;
  },
  action: (dispatch) => {
    return {
        accountTypeList: () => {
            IO.account.accountTypeList({companyId: -3}).then((res) => {
                const data = res.data;
                const accountList = [];
                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const account = {};
                        account.id = data[i].id;
                        account.name = data[i].accountType;
                        accountList.push(account);
                    }
                }
                dispatch({
                    type: "ACCOUNT_TYPE",
                    accountList
                });
            }).catch();
        },
       employeeListAll: () => {
            IO.account.employeeListAll().then((res) => {
                const data = res.data;
                const personList = [];
                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const person = {};
                        person.id = data[i].id;
                        person.name = data[i].realName;
                        personList.push(person);
                    }
                }
                dispatch({
                    type: "ACCOUNT_EMPLOYEE",
                    personList
                });
            }).catch();
        },
        companyListAll :() => {
            IO.account.companyListAll().then((res) => {
                const data = res.data;
                const companyList = [];
                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const company = {};
                        company.id = data[i].id;
                        company.name = data[i].companyName;
                        companyList.push(company);
                    }
                }
                dispatch({
                    type: "ACCOUNT_COMPANY",
                    companyList
                });
            }).catch();
        },
      Alldatas: ( page ) => {
        IO.account.companylistByPage(page).then((res) => {
          const initdata = Operation.modelRequest(res.data,res.success);
          const dataAll = initdata.d.map((item) => {
            if(item.stauts===0) {
              return Object.assign({}, item, {
                swich: true
              });
            }else if(item.stauts===1) {
              return Object.assign({}, item, {
                swich: false
              });
            }else {
              return item;
            }
          });
          dispatch({
            type: "ACCOUNT_ALLDATA",
            dataAll,
            total:initdata.t,
            flag:initdata.flag
          });
        }).catch(Com.errorCatch);
      },
      queryAll: (changeName) => {
        IO.account.companylistByPage(changeName).then((res) => {
          const initdata = Operation.modelRequest(res.data,res.success);
          const queryall = initdata.d.map((item) => {
            if(item.stauts===0) {
              return Object.assign({}, item, {
                swich: true
              });
            }else if(item.stauts===1) {
              return Object.assign({}, item, {
                swich: false
              });
            }else {
              return item;
            }
          });
          dispatch({
            type: "ACCOUNT_QUERY_ALL",
            queryall,
            querytotal:initdata.t,
            flag:initdata.flag
          });
        }).catch(Com.errorCatch);
      },
      defaultFields:(data) => {
        dispatch({
          type: "ACCOUNT_DEFAULTFIELD",
          data
        });
      },
      page:(obj) => {
        dispatch({
          type: "ACCOUNT_RES_PAGE",
          cur:obj.current,
          psize:obj.pageSize
        });
      },
      parentID:(name) => {
        dispatch({
          type: "ACCOUNT_PARENT_ID",
          parentid:name
        });
      },
      modal:(obj) => {
        dispatch({
          type: "ACCOUNT_MODAL",
          modalflag:obj.modalFlag,
          modaltype:obj.modeltype
        });
      },
      querydefaultfields:(data) => {
        dispatch({
          type: "ACCOUNT_QUERYDEFAULTFIELDS",
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
reducers.assemble = {accountReducer: accountModel.reducer};
const IOModel = {
    employeeListAll: IO.account.employeeListAll,
    companyListAll:IO.account.companyListAll,
    accountTypeList:IO.account.accountTypeList
};
const action = accountModel.action;
export {
  action,
  IO,
  IOModel
};
