import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
//配置接口参数
context.create('register', {
    getRegisterCode: {
        mockUrl: '/proxy/register/insertCode',
        url: '/register/insertCode',
        method: 'GET'
    },
    checkRegisterCode: {
        mockUrl: '/proxy/register/checkCode',
        url: '/register/checkCode',
        method: 'GET'
    },
    postUserForm: {
        mockUrl: '/proxy/register/approveEmp',
        url: '/register/approveEmp',
        method: 'POST'
    },
    CompanySubmit: {
        mockUrl: '/proxy/register/approveCompany',
        url: '/register/approveCompany',
        method: 'POST'
    },
    CheckName: {
        mockUrl: '/proxy/register/checkName',
        url: '/register/checkName',
        method: 'GET'
    },
    getUserInfo: {
        mockUrl: '/proxy/register/getEmpByPhone',
        url: '/register/getEmpByPhone',
        method: 'GET'
    },
    getCompanyInfo: {
        mockUrl: '/proxy/register/getCompanyByPhone',
        url: '/register/getCompanyByPhone',
        method: 'GET'
    }
});
//封装页面reducer、action
const farmingModel = {
    reducer: (defaultState = {
        phone: '',
        activeNav: 0
    }, action) => {
        switch (action.type) {
            case 'REGISTER_RECORD': {
                const phone = action.phone;
                const activeNav = action.activeNav;
                return Object.assign({}, defaultState, {
                    phone,
                    activeNav
                });
            }
        }
        return defaultState;
    },
    action: (dispatch) => {
        return {
            setRecord: (obj) => {  //数据
                dispatch({
                    type: "REGISTER_RECORD",
                    phone: obj.phone,
                    activeNav: obj.activeNav
                });
            }
        };
    }
};

reducers.assemble = {registerReducer: farmingModel.reducer};
const action = farmingModel.action;
const IOModel = {
    GetAllWorkType: IO.farmingOperations.GetAllWorkType,
    CompanySubmit: IO.register.CompanySubmit,
    CheckName: IO.register.CheckName
};
export {
    action,
    IO,
    IOModel
};
