import reducers from '@/app/reducers';import {context, IO} from '@/app/io';//配置接口参数context.create('enterprise', {    listByPageData: {        mockUrl: '/proxy/register/companyByPage',        url: '/register/companyByPage',        method: 'POST'    },    getMessage: {        mockUrl: '/proxy/register/getCompany',        url: '/register/getCompany',        method: 'GET'    },    EnterpriseSubmit: {        mockUrl: '/proxy/register/updateCompany',        url: '/register/updateCompany',        method: 'POST'    }});//封装页面reducer、actionconst farmingModel = {    reducer: (defaultState = {        dataList: [],        currentMessage:{},        currentTable:[],        total: null,        PageSize: 10,        Current: 1,        fields: {},        modalflag: false,        modaltype: ''    }, action) => {        const fields = action.data;        switch (action.type) {            case 'ENTERPRISE_ALL_DATA': {                const data = action.data;                const total = action.total;                return Object.assign({}, defaultState, {                    dataList: data,                    total: total                });            }            case 'ENTERPRISE_GETMESSAGE': {                const data = action.data;                const tableData = action.tableData;                return Object.assign({}, defaultState, {                    currentMessage: data,                    currentTable: tableData                });            }            case 'EXAMINE_RES_PAGE':                return Object.assign({}, defaultState, {                    Current: action.current,                    PageSize: action.pageSize                });            case 'EXAMINE_MODAL':                return Object.assign({}, defaultState, {                    modalflag: action.modalFlag,                    modaltype: action.modalType                });            case 'EXAMINE_DEFAULTFIELD':                return Object.assign({}, defaultState, {fields: fields});        }        return defaultState;    },    action: (dispatch) => {        return {            allData: (page) => { // 查询                IO.enterprise.listByPageData(page).then((res) => {                    const data = res.data.registerCompanies || [];                    const total = res.data.totalCount;                    dispatch({                        type: "ENTERPRISE_ALL_DATA",                        data,                        total                    });                }).catch();            },            getMessage: (page) => { // 查询                IO.enterprise.getMessage(page).then((res) => {                    const data=res.data || {};                    const tableDatas=data.registerApproves || [];                    const tableData=[];                    for(let i=0; i<tableDatas.length; i++) {                        tableData[tableDatas[i].sort]=tableDatas[i];                        if(tableDatas[i].approveAttr==='img') {                            tableData[tableDatas[i].sort].content=data.workFiles;                        }                    }                    dispatch({                        type: "ENTERPRISE_GETMESSAGE",                        data:data,                        tableData                    });                }).catch();            },            page: (obj) => {  //分页页码                dispatch({                    type: "EXAMINE_RES_PAGE",                    current: obj.current,                    pageSize: obj.pageSize                });            },            // 创建            defaultFields: (data) => {  //弹出框的数据                dispatch({                    type: "EXAMINE_DEFAULTFIELD",                    data                });            },            modal: (obj) => {  //弹出框是否显示                dispatch({                    type: "EXAMINE_MODAL",                    modalFlag: obj.modalFlag,                    modalType: obj.modalType                });            }        };    }};reducers.assemble = {enterpriseReducer: farmingModel.reducer};const action = farmingModel.action;const IOModel = {    EnterpriseSubmit:IO.enterprise.EnterpriseSubmit};export {    action,    IO,    IOModel};