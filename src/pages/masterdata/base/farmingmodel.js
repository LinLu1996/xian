import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
//配置接口参数
context.create('farmingLand', {
    listByPagedata: {
        mockUrl: '/proxy/astLand/listByPage',
        url: '/astLand/listByPage',
        method: 'POST'
    },
    Adddata: {
        mockUrl: '/proxy/astLand/add',
        url: '/astLand/add',
        method: 'POST'
    },
    deleteData: {
        mockUrl: '',
        rest: true
    },
    changeStatus: {
        mockUrl: '/proxy/astLand/updateStatus',
        url: '/astLand/updateStatus',
        method: 'POST'
    },
    Modifydata: {
        mockUrl: '/proxy/astLand/update',
        url: '/astLand/update',
        method: 'POST'
    },
    GetOne: {
        mockUrl: '/proxy/astLand/getById/:id',
        url: '/astLand/getById/:id',
        method: 'GET',
        rest: true
    },
    GetAllBase: {
        mockUrl: '/proxy/astLand/baseByCompanyId',
        url: '/astLand/baseByCompanyId',
        method: 'GET'
    },
    GetAllLandType: {
        mockUrl: '/proxy/astLand/landType',
        url: '/astLand/landType',
        method: 'GET'
    },
    CheckName: {
        mockUrl: '/proxy/astLand/checkName',
        url: '/astLand/checkName',
        method: 'GET'
    },
    TreeData: {
        mockUrl: '',
        rest: true
    },
    treeDatapage: {
        mockUrl: '/proxy/org/getChildsByIdPage',
        url:'/org/getChildsByIdPage'
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
            case 'LAND_GET_SELECT': {
                const queryAlls = action.res1;
                const base = action.res2;
                return Object.assign({}, defaultState, {
                    allBase: queryAlls,
                    allLandType: base
                });
            }
            case 'LAND_MENU_ALL':
                return Object.assign({}, defaultState, {
                    Alldate: action.arr,
                    total: action.num
                    //chooseflag:true
                });
//        case 'LAND_CHOOSE_ALL': {
//          const chooseAlls = action.chooseall;
//          const choosetotal = action.choosetotal;
//          return Object.assign({}, defaultState, {
//            Alldate:chooseAlls,
//            total:choosetotal
//          });
//        }
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
            case 'LAND_MODAL_TABLE':
                return Object.assign({}, defaultState, {
                    modalTableflag:action.modalTableflag,
                    modalTableType:action.modalTableType
                });
            case 'LAND_DEFAULTFIELD':
                return Object.assign({}, defaultState, {fields: fields});
            case 'LAND_TABLEFIELD':
                return Object.assign({}, defaultState, {fieldsTable: fields});
            case 'LAND_TREE_DATAs':
                return Object.assign({}, defaultState, {
                    TreeD: action.tree
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
                IO.farmingLand.listByPagedata(page).then((res) => {
                    const data = res.data.rows || [];
                    const total = res.data.totalCount;
                    dispatch({
                        type: "LAND_ALL_DATA",
                        data,
                        total
                    });
                }).catch();
            },
            queryAll: (req) => {  //筛选的列表数据
                req.companyId = 1;
                IO.farmingLand.listByPagedata(req).then((res) => {
                    const querytotal = res.data.totalCount;
                    const data = res.data.rows;
                    dispatch({
                        type: "LAND_QUERY_ALL",
                        data,
                        querytotal
                    });
                }).catch();
            },
            getOne: async (req) => {  //编辑单个时获取数据
                const res = await IO.farmingLand.GetOne(req);
                const data = res.data;
                dispatch({
                    type: "LAND_GET_ONE",
                    data
                });

            },
            getSelestData: async (req) => {
                const res1 = await IO.farmingLand.GetAllBase(req);
                const res2 = await IO.farmingLand.GetAllLandType();
                dispatch({
                    type: "LAND_GET_SELECT",
                    res1,
                    res2
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
            // 创建
            tableFields:(data) => {  //弹出框的数据
                dispatch({
                    type: "LAND_TABLEFIELD",
                    data
                });
            },
            modal: (obj) => {  //弹出框是否显示
                dispatch({
                    type: "LAND_MODAL",
                    modalflag: obj.modalFlag,
                    modaltype: obj.modeltype
                });
            },
            modalTable:(obj) => {  //弹出框是否显示
                dispatch({
                    type: "LAND_MODAL_TABLE",
                    modalTableflag:obj.modalFlag,
                    modalTableType:obj.modeltype
                });
            }
        };
    }
};

reducers.assemble = {farmingLandReducer: farmingModel.reducer};
const action = farmingModel.action;
const IOModel = {
    TreeMOdel: IO.farmingLand.TreeData,
    Delete: IO.farmingLand.deleteData,
    ChangeStatus: IO.farmingLand.changeStatus,
    Adddata: IO.farmingLand.Adddata,
    Modifydata: IO.farmingLand.Modifydata,
    CheckName: IO.farmingLand.CheckName
};
const LandIOModel = {
    GetAllBase:IO.farmingLand.GetAllBase
};
export {
    action,
    IO,
    IOModel,
    LandIOModel
};
