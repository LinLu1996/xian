import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
import Com from '@/component/common';
import moment from 'moment';
import Operation from '../public.js';

const maplist = (data) => {
    const dataAll = data.map((item) => {
        const birthday = moment(item.birthday).format('YYYY-MM-DD');
        const hireDate = moment(item.hireDate).format('YYYY-MM-DD');
        const gmtCreate = moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss');
        const gmtModified = moment(item.gmtModified).format('YYYY-MM-DD HH:mm:ss');
        let type_ = '';
        if (item.type === 1) {
            type_ = '临时工';
        } else if (item.type === 2) {
            type_ = '社员';
        } else if (item.type === 3) {
            type_ = '平台用户';
        } else if (item.type === 4) {
            type_ = '政府用户';
        } else if (item.type === 5) {
            type_ = '营销用户';
        }
        let poor_ = '';
        if (item.poor === 1) {
            poor_ = '贫困';
        } else if (item.poor === 0) {
            poor_ = '非贫困';
        }
        const key = item.id;
        let idcardT = '';
        if (item.idCardType === 1) {
            idcardT = '身份证';
        } else if (item.idCardType === 2) {
            idcardT = '军官证';
        } else if (item.idCardType === 3) {
            idcardT = '学生证';
        }
        const sexx = item.sex === 1 ? '男' : '女';
        const creatAccount_ = item.creatAccount === 0 ? '未创建' : '已创建';

        return Object.assign({}, item, {
            birthday: birthday,
            hireDate: hireDate,
            gmtCreate: gmtCreate,
            gmtModified: gmtModified,
            type_: type_,
            poor_: poor_,
            key: key,
            idcardT: idcardT,
            sexx: sexx,
            creatAccount_: creatAccount_
        });
    });
    return dataAll;
};
//配置接口参数
context.create('employee', {
    rolelistByPage: {
        mockUrl: '/proxy/employee/listByPage',
        url: '/employee/listByPage'
    },
    CompanyChild: {
        mockUrl: '/proxy/company/getChild',
        url: '/company/getChild'
    },
    CompanyAll: {
        mockUrl: '/proxy/company/getUserCompany',
        url: '/company/getUserCompany'
    },
    xiugaiuser: {
        mockUrl: '/proxy/security/updateCurrentUserInfo',
        url: '/security/updateCurrentUserInfo'
    },
    huoquuserinfo: {
        mockUrl: '/proxy/security/getCurrentEmpInfo',
        url: '/security/getCurrentEmpInfo'
    },
    crossOrigin: {
        mockUrl: '/proxy/scanFruit',
        url: '/scanFruit',
        method: 'POST'
    },
    iduserinfo: {
        mockUrl: '/proxy/employee/getById/:id',
        url: '/employee/getById/:id',
        rest: true
    },
    getNodeByUser: {
        mockUrl: '/proxy/node/getNodeByUser/:id',
        url: '/node/getNodeByUser/:id',
        method: 'GET',
        rest: true
    },
    listAll: {
        mockUrl: '/proxy/node/list',
        url: '/node/list',
        rest: true
    },
    insertUseAndNode: {
        mockUrl: '/proxy/node/insertUseAndNode',
        url: '/node/insertUseAndNode',
        method: 'POST'
    }
});
context.create('position', {
    getpositionlist: {
        url: '/position/listAll',
        mockUrl: '/proxy/position/listAll'
    },
    getorglist: {
        url: '/org/listAll',
        mockUrl: '/proxy/org/listAll'
    },
    treeData: {
        url: '/org/getChildsById',
        mockUrl: '/proxy/org/getChildsById'
    }
});
context.create('orgp', {
    allData: {
        mockUrl: '/proxy/org/getChildsById/:id',
        url: '/org/getChildsById/:id',
        rest: true
    }
});
context.create('detailpassword', {
    passwordc: {
        mockUrl: '/proxy/security/updateCurrentUserPassword',
        url: '/security/updateCurrentUserPassword'
    }
});
context.create('roleres', {
    getdata: {
        url: '/empOrg/updateByEmpId',
        mockUrl: '/proxy/empOrg/updateByEmpId',
        method: 'POST',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    },
    getdata2: {
        url: '/employee/updateEmpDataByEmpId',
        mockUrl: '/proxy/employee/updateEmpDataByEmpId',
        method: 'POST',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    },
    gethavedata: {
        url: '/empOrg/getOrgIdsByEmpId/:id',
        mockUrl: '/proxy/empOrg/getOrgIdsByEmpId/:id',
        rest: true
    },
    gethavedata2: {
        url: '/employee/getDataIdsByEmpId/:id',
        mockUrl: '/proxy/employee/getDataIdsByEmpId/:id',
        rest: true
    }
});
//封装页面reducer、action
const employeeModel = {
    reducer: (defaultState = {
        value: '',
        Alldate: [],
        total: null,
        parentid: null,
        modalflag: false,
        modaltype: '',
        fields: {},
        flag: true,
        queryfields: {},
        sortfield: 'gmt_create',
        sortorder: 'DESC',
        allCompany: []
    }, action) => {
        switch (action.type) {
            case 'EMPLOYEE_ALLDATA': {  //进入页面的数据
                const Alldate = action.dataAll;
                const total = action.total;
                const flag = action.flag;
                return Object.assign({}, defaultState, {
                    Alldate: Alldate,
                    total: total,
                    flag: flag
                });
            }
            case 'EMPLOYEE_PARENT_ID':
                return Object.assign({}, defaultState, {
                    parentid: action.parentid
                });
            case 'EMPLOYEE_MODAL':
                return Object.assign({}, defaultState, {
                    modalflag: action.modalflag,
                    modaltype: action.modaltype
                });
            case 'EMPLOYEE_DEFAULTFIELD': {
                const fields = action.data;
                return Object.assign({}, defaultState, {fields: fields});
            }
            case 'EMPLOYEE_QUERYDEFAULTFIELDS': {
                const fields = action.data;
                return Object.assign({}, defaultState, {queryfields: fields});
            }
            case 'EMPLOYEE_SORDER':
                return Object.assign({}, defaultState, {
                    sortfield: action.sortfield,
                    sortorder: action.sortorder
                });
            case 'EMPLOYEE_QUERY_ALL_COMPANY':
                return Object.assign({}, defaultState, {
                    allCompany: action.allCompany
                });
            case 'EMPLOYEE_RES_PAGE':
                return Object.assign({}, defaultState, {
                    Cur: action.cur,
                    Psize: action.psize
                });
        }
        return defaultState;
    },
    action: (dispatch) => {
        return {
            Alldatas: (page) => {
                IO.employee.rolelistByPage(page).then((res) => {
                    const initdata = Operation.modelRequest(res.data, res.success);
                    const dataAll = maplist(initdata.d);
                    dispatch({
                        type: "EMPLOYEE_ALLDATA",
                        dataAll,
                        total: initdata.t,
                        flag: initdata.flag
                    });
                }).catch(Com.errorCatch);
            },
            CompanyAll: () => {
                IO.employee.CompanyAll().then((res) => {
                    if (res.success) {
                        dispatch({
                            type: "EMPLOYEE_QUERY_ALL_COMPANY",
                            allCompany: res.data
                        });
                    }
                }).catch();
            },
            defaultFields: (data) => {
                dispatch({
                    type: "EMPLOYEE_DEFAULTFIELD",
                    data
                });
            },
            parentID: (name) => {
                dispatch({
                    type: "EMPLOYEE_PARENT_ID",
                    parentid: name
                });
            },
            modal: (obj) => {
                dispatch({
                    type: "EMPLOYEE_MODAL",
                    modalflag: obj.modalFlag,
                    modaltype: obj.modeltype
                });
            },
            querydefaultfields: (data) => {
                dispatch({
                    type: "EMPLOYEE_QUERYDEFAULTFIELDS",
                    data
                });
            },
            sorter: (obj) => {
                dispatch({
                    type: "EMPLOYEE_SORDER",
                    sortfield: obj.sortfield,
                    sortorder: obj.sortorder
                });
            },
            page: (obj) => {
                dispatch({
                    type: "EMPLOYEE_RES_PAGE",
                    cur: obj.current,
                    psize: obj.pageSize
                });
            }
        };
    }
};

reducers.assemble = {employeeReducer: employeeModel.reducer};
const action = employeeModel.action;
export {
    action,
    IO
};

