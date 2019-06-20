import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
import Com from "@/component/common";
context.create('empl222', {
  onlyData: {
    mockUrl: '/proxy/role/listAllByEmpId',
    url:'/role/listAllByEmpId'
  },
  meData: {
    mockUrl: '/proxy/empRole/getRoleIdsByEmpId/:id',
    url:'/empRole/getRoleIdsByEmpId/:id',
    rest: true
  },
  sonlyData: {
    mockUrl: '/proxy/empRole/updateByEmpId',
    url:'/empRole/updateByEmpId',
    method: 'POST',
    header:{
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  }
});
context.create('infouser',{
  getCurrentUserInfo: {
    mockUrl: '/proxy/security/getCurrentUserInfo',
    url: '/security/getCurrentUserInfo'
  },
  account:{
    mockUrl: '/proxy/account/getById/:id',
    url:'/account/getById/:id',
    rest: true
  }
});
//封装页面reducer、action
const _roleModel = {
  reducer: (defaultState = {
    value: '',
    did:[],
    total:null,
    queryAlls:[],
    querytotal:null,
    modifyD:[],
    deleteText:[]
  }, action) => {
    const Alldate_ = action.data;
    const total = action.total;
    const queryAlls = action.queryall;
    const querytotal = action.querytotal;
    const modifyD = action.d;
    const deleteText = action.text;
    switch (action.type) {
      case 'ALL_DATAS':
        return Object.assign({}, defaultState, {
          did:Alldate_,
          total:total
        });
        case 'QUERY_ALL':
        return Object.assign({}, defaultState, {
          Alldate:queryAlls,
          total:querytotal
        });
        case 'MODIFY_LIST':
        return Object.assign({}, defaultState, {
          Alldate:modifyD
        });
        case 'DELETE_LIST':
        return Object.assign({}, defaultState, {
          Alldate:deleteText
        });
    }
    return defaultState;
  },
  action: (dispatch) => {
    return {
      Alldatas: ( page ) => {
        IO.emprole.Alldata(page).then((res) => {
          const data=res.data.rows;
          const total=res.data.total;
          dispatch({
            type: "ALL_DATAS",
            data,
            total
          });
        }).catch(Com.errorCatch);
      },
      queryAll: (changeName) => {
        IO.emprole.querydata(changeName).then((res) => {
          const querytotal=res.data.total;
          const queryall = res.data.rows;
          dispatch({
            type: "QUERY_ALL",
            queryall,
            querytotal
          });
        }).catch(Com.errorCatch);
      },
      employeedataAdd: (AddPage) => {
        IO.emprole.Adddata(AddPage).then((res) => {
          dispatch({
            type: "ADD_DATA",
            res
          });
        }).catch(Com.errorCatch);
      },
      modifydata: (ModifyPage) => {
        IO.emprole.Modifydata(ModifyPage).then((res) => {
          dispatch({
            type: "MODIFY_DATA",
            res
          });
        }).catch(Com.errorCatch);
      },
      modifyList:(d) => {
        dispatch({
          type: "MODIFY_LIST",
          d
        });
      },
      deData:(text) => {
        dispatch({
          type: "DELETE_LIST",
          text
        });
      }
    };
  }
};

reducers.assemble = {_roleReducer: _roleModel.reducer};

const action = _roleModel.action;

export {
  action,
  IO
};
