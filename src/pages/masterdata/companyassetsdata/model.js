import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
//配置接口参数
context.create('companyassetsdata', {
    listByPagedata: {
        mockUrl: '/proxy/reportAst/listByPage',
        url: '/reportAst/listByPage',
        method: 'POST'
    },
    Adddata: {
        mockUrl: '/proxy/reportAst/add',
        url: '/reportAst/add',
        method: 'POST'
    },
    Modifydata: {
        mockUrl: '/proxy/reportAst/updateById',
        url: '/reportAst/updateById',
        method: 'POST'
    },
    GetOne: {
        mockUrl: '/proxy/reportAst/getById/:id',
        url: '/reportAst/getById/:id',
        method: 'GET',
        rest: true
    },
    CheckName: {
        mockUrl: '/proxy/reportAst/checkAstUnique',
        url: '/reportAst/checkAstUnique',
        method: 'POST'
    },
    TreeData: {
        mockUrl: '',
        rest: true
    },
    GetAllBase: {
        mockUrl: '/proxy/astLand/baseByCompanyId',
        url: '/astLand/baseByCompanyId',
        method: 'GET'
    }
});
//封装页面reducer、action
const farmingModel = {
    reducer: (defaultState = {
        Alldate: [],
        total: null,
        parentname: null,
        PID: null,
        Psize: 10,
        Cur: 1,
        fields: {},
        fieldsTable: {},
        TreeD: [],
        addflag: false,
        modalflag: false,
        modaltype: '',
        modalTableflag: false,
        modalTableType: '',
        parentID: null,
        slideID: -1,
        modifyID: null,
        chooseCUR: 1,
        chooseSIZE: 10,
        slideparentID: -1,
        slideName: '地块',
        Rditdate: {},
        allBase: [],
        allLandType: []
    }, action) => {
        const fields = action.data;
        switch (action.type) {
            case 'LAND_ALL_DATA': {
                const Alldate = action.data;
                const total = action.total;
                return Object.assign({}, defaultState, {
                    Alldate: Alldate,
                    total: total,
                    chooseflag: false
                });
            }
            case 'LAND_QUERY_ALL': {
                const queryAlls = action.data;
                const querytotal = action.querytotal;
                return Object.assign({}, defaultState, {
                    Alldate: queryAlls,
                    total: querytotal
                });
            }
            case 'LAND_GET_ONE': {
                const queryAlls = action.data;
                return Object.assign({}, defaultState, {
                    Rditdate: queryAlls
                });
            }
            case 'LAND_MENU_ALL':
                return Object.assign({}, defaultState, {
                    Alldate: action.arr,
                    total: action.num
                    //chooseflag:true
                });
            case 'LAND_SUPERIOR_NAME':
                return Object.assign({}, defaultState, {
                    parentname: action.Name
                });
            case 'LAND_RES_PAGE':
                return Object.assign({}, defaultState, {
                    Cur: action.cur,
                    Psize: action.psize
                });
            case 'LAND_MODAL':
                return Object.assign({}, defaultState, {
                    modalflag: action.modalflag,
                    modaltype: action.modaltype
                });
            case 'LAND_DEFAULTFIELD':
                return Object.assign({}, defaultState, {fields: fields});
            case 'LAND_TREE_DATAs':
                return Object.assign({}, defaultState, {
                    TreeD: action.tree
                });
            case 'BASE_ALL_DATA':
                return Object.assign({}, defaultState, {
                    allBase: action.data
                });
            case 'LAND_SLIDEID':
                return Object.assign({}, defaultState, {
                    slideID: action.num,
                    slideName: action.slideName,
                    slideparentID: action.slideparentID
                });
            case 'LAND_PARENTID':
                return Object.assign({}, defaultState, {
                    parentID: action.parentid,
                    modifyID: action.modifyid
                });
            case 'LAND_CHOOSEPAGE':
                return Object.assign({}, defaultState, {
                    chooseCUR: action.chooseCUR,
                    chooseSIZE: action.chooseSIZE
                });
        }
        return defaultState;
    },
    action: (dispatch) => {
        return {
            superiorName: (parent) => {  //点击左边树的数据
                dispatch({
                    type: "LAND_SUPERIOR_NAME",
                    Name: parent.name,
                    parentid: parent.parentID,
                    pID: parent.parentLeftID
                });
            },
            //    查询
            Alldatas: (page) => {  //进入页面的列表数据
                page.companyId = 1;
                IO.companyassetsdata.listByPagedata(page).then((res) => {
                    const data = res.data.rows || [];
                    const total = res.data.total;
                    dispatch({
                        type: "LAND_ALL_DATA",
                        data,
                        total
                    });
                }).catch();
            },
            getAllBase() {
                IO.companyassetsdata.GetAllBase({companyId: 1}).then((res) => {
                    const data = res.data || [];
                    dispatch({
                        type: "BASE_ALL_DATA",
                        data
                    });
                }).catch();

            },
            queryAll: (req) => {  //筛选的列表数据
                req.companyId = 1;
                IO.companyassetsdata.listByPagedata(req).then((res) => {
                    const querytotal = res.data.total;
                    const data = res.data.rows;
                    dispatch({
                        type: "LAND_QUERY_ALL",
                        data,
                        querytotal
                    });
                }).catch();
            },
            getOne: async (req) => {  //编辑单个时获取数据
                const res = await IO.companyassetsdata.GetOne(req);
                const data = res.data;
                dispatch({
                    type: "LAND_GET_ONE",
                    data
                });

            },
            page: (obj) => {  //分页页码
                dispatch({
                    type: "LAND_RES_PAGE",
                    cur: obj.current,
                    psize: obj.pageSize
                });
            },
            choosepage: (obj) => {
                dispatch({
                    type: "LAND_CHOOSEPAGE",
                    chooseCUR: obj.current,
                    chooseSIZE: obj.pageSize
                });
            },
            // 创建
            defaultFields: (data) => {  //弹出框的数据
                dispatch({
                    type: "LAND_DEFAULTFIELD",
                    data
                });
            },
            modal: (obj) => {  //弹出框是否显示
                dispatch({
                    type: "LAND_MODAL",
                    modalflag: obj.modalFlag,
                    modaltype: obj.modeltype
                });
            }
        };
    }
};

reducers.assemble = {companyassetsdataReducer: farmingModel.reducer};
const action = farmingModel.action;
const IOModel = {
    TreeMOdel: IO.companyassetsdata.TreeData,
    Adddata: IO.companyassetsdata.Adddata,
    Modifydata: IO.companyassetsdata.Modifydata,
    GetOne: IO.companyassetsdata.GetOne,
    CheckName: IO.companyassetsdata.CheckName,
    listByPagedata: IO.companyassetsdata.listByPagedata
};
export {
    action,
    IO,
    IOModel
};
