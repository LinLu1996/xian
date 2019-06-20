import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
import Operation from "@/pages/system/public";
import Com from "@/component/common";
import moment from 'moment';
//配置接口参数
context.create('base', {
    listByPagedata: {
        mockUrl: '/proxy/astLand/listByPage',
        url: '/astLand/listByPage',
        method: 'POST'
    },
    Adddata: {
        mockUrl: '/proxy/astBase/add',
        url: '/astBase/add',
        method: 'POST'
    },
    AdddataLand: {
        mockUrl: '/proxy/astLand/add',
        url: '/astLand/add',
        method: 'POST'
    },
    deleteData: {
        mockUrl: '',
        rest: true
    },
    Modifydata: {
        mockUrl: '/proxy/astBase/update',
        url: '/astBase/update',
        method: 'POST'
    },
    ModifydataLand: {
        mockUrl: '/proxy/astLand/update',
        url: '/astLand/update',
        method: 'POST'
    },
    GetOne: {
        mockUrl: '/proxy/astBase/getById/:id',
        url: '/astBase/getById/:id',
        method: 'GET',
        rest: true
    },
    CheckName: {
        mockUrl: '/proxy/astBase/checkName',
        url: '/astBase/checkName',
        method: 'GET'
    },
    CheckLandName: {
        mockUrl: '/proxy/astLand/checkName',
        url: '/astLand/checkName',
        method: 'GET'
    },
    getAddress: {
        mockUrl: '/proxy/astBase/getDistrictNameListByAddress',
        url: '/astBase/getDistrictNameListByAddress',
        method: 'GET'
    },
    getEmpListByType: {
        mockUrl: '/proxy/employee/getEmpListByType',
        url: '/employee/getEmpListByType',
        method: 'GET'
    },
    TreeData: {
        mockUrl: '',
        rest: true
    },
    treeData: {
        mockUrl: '/proxy/astBase/getBaseConfigTree',
        url:'astBase/getBaseConfigTree',
        method: 'GET'
    },
    treeDatapage: {
        mockUrl: '/proxy/org/getChildsByIdPage',
        url:'/org/getChildsByIdPage'
    },
    GetOneLand: {
        mockUrl: '/proxy/astLand/getById/:id',
        url: '/astLand/getById/:id',
        method: 'GET',
        rest: true
    },
    setPosition: {
        mockUrl: '/proxy/astBase/queryGeo',
        url:'astBase/queryGeo',
        method: 'POST'
    }
});
const maplist = (data) => {
    const databox = data.map((item) => {
        const creatgmt = moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss');
        const querygmt = moment(item.gmtModified).format('YYYY-MM-DD HH:mm:ss');
        if(!item.parentName) {
            item.parentName=localStorage.getItem('companyName');
        }
        return Object.assign({}, item, {
            gmtCreate:creatgmt,
            gmtModified:querygmt,
            key:item.id
        });
    });
    return databox;
};
const treedata =(data) => {
    return data.map(item => {
        if (item.childrens) {
            item.childrens = treedata(item.childrens);
        }
        return Object.assign({},item,{
            title : item.type==='base' ? `【基地】${item.title}`:item.type==='land' ? `【地块】${item.title}`:item.title,
            key : item.id
        });
    });
};
//封装页面reducer、action
const farmingModel = {
    reducer: (defaultState = {
        functionaryList:['Jack','Lucy','Tom'],
        EditData: {},
        Alldate: [],
        total: null,
        parentname: null,
        PID: null,
        Psize: 10,
        Cur: 1,
        fields: {},
        fieldsTable: {},
        record: {},
        TreeD: [],
        addflag: false,
        modalflag: false,
        modaltype: '',
        modalflag_land:false,
        modaltype_land:'',
        modalTableflag: false,
        modalTableType: '',
        firstFlag: false,
        parentID: null,
        slideID: -1,
        modifyID: null,
        chooseCUR: 1,
        chooseSIZE: 10,
        slideparentID: -1,
        slideName: '基地',
        allBase: [],
        allLandType: [],
        Rditdate: {},
        companyId:null,
        baseId:null
    }, action) => {
        const fields = action.data;
        switch (action.type) {
            case 'BASE_ALL_USER': {
                const personList = action.personList;
                return Object.assign({}, defaultState, {
                    functionaryList: personList,
                    chooseflag: false
                });
            }
            case 'BASE_SETID': {
                const companyId = action.companyId;
                const baseId = action.baseId;
                return Object.assign({}, defaultState, {
                    companyId: companyId,
                    baseId: baseId
                });
            }
            case 'BASE_ALL_DATA': {
                const Alldate = action.data;
                const total = action.total;
                return Object.assign({}, defaultState, {
                    Alldate: Alldate,
                    total: total,
                    chooseflag: false
                });
            }
            case 'BASE_QUERY_ALL': {
                const queryAlls = action.data;
                const querytotal = action.querytotal;
                return Object.assign({}, defaultState, {
                    Alldate: queryAlls,
                    total: querytotal
                });
            }
            case 'BASE_GET_ONE': {
                const queryAlls = action.data;
                return Object.assign({}, defaultState, {
                    EditData: queryAlls
                });
            }
            case 'BASE_MENU_ALL':
                return Object.assign({}, defaultState, {
                    Alldate: action.arr,
                    total: action.num
                    //chooseflag:true
                });
            case 'EMP_CHOOSE_ALL': {  //点击左边分页的数据
                const chooseAlls = action.chooseall;
                const choosetotal = action.choosetotal;
                const flag = action.flag;
                return Object.assign({}, defaultState, {
                    Alldate:chooseAlls,
                    total:choosetotal,
                    flag:flag
                });
            }
//        case 'BASE_CHOOSE_ALL': {
//          const chooseAlls = action.chooseall;
//          const choosetotal = action.choosetotal;
//          return Object.assign({}, defaultState, {
//            Alldate:chooseAlls,
//            total:choosetotal
//          });
//        }
            case 'BASE_SUPERIOR_NAME':
                return Object.assign({}, defaultState, {
                    parentname: action.Name
                });
            case 'BASE_RES_PAGE':
                return Object.assign({}, defaultState, {
                    Cur: action.cur,
                    Psize: action.psize
                });
            case 'BASE_MODAL':
                return Object.assign({}, defaultState, {
                    modalflag: action.modalflag,
                    modaltype: action.modaltype,
                    modalflag_land: action.modalflag_land,
                    modaltype_land: action.modaltype_land,
                    firstFlag: action.firstFlag
                });
            case 'BASE_MODAL_TABLE':
                return Object.assign({}, defaultState, {
                    modalTableflag:action.modalTableflag,
                    modalTableType:action.modalTableType
                });
            case 'BASE_MODAL_LAND':
                return Object.assign({}, defaultState, {
                    modalflag_land:action.modalflag_land,
                    modaltype_land:action.modaltype_land
                });
            case 'BASE_DEFAULTFIELD':
                return Object.assign({}, defaultState, {fields: fields});
            case 'BASE_SETPOSI':
                // const fiel={...defaultState.fields,...action.datas};
                return Object.assign({}, defaultState, {fields:{...defaultState.fields,...action.datas}});
            case 'BASE_TABLEFIELD':
                return Object.assign({}, defaultState, {fieldsTable: fields});
            case 'BASE_TREE_DATAs':
                return Object.assign({}, defaultState, {
                    TreeD: action.tree
                });
            case 'BASE_SLIDEID':
                return Object.assign({}, defaultState, {
                    slideID: action.num,
                    slideName: action.slideName,
                    slideparentID: action.slideparentID
                });
            case 'BASE_PARENTID':
                return Object.assign({}, defaultState, {
                    parentID: action.parentid,
                    modifyID: action.modifyid
                });
            case 'BASE_RECORD': {
                const record = action.record;
                return Object.assign({}, defaultState, {record: record});
            }
            case 'BASE_CHOOSEPAGE': {
                return Object.assign({}, defaultState, {
                    chooseCUR: action.chooseCUR,
                    chooseSIZE: action.chooseSIZE
                });
            }
            case 'BASE_TREE_DATA': { //左边树数据
                return Object.assign({}, defaultState, {
                    TreeD: action.tree
                });
            }
            case 'BASE_GET_SELECT': {
                const queryAlls = action.res1;
                const base = action.res2;
                return Object.assign({}, defaultState, {
                    allBase: queryAlls,
                    allLandType: base
                });
            }
            case 'BASE_GET_ONELAND': {
                const queryAlls = action.data;
                return Object.assign({}, defaultState, {
                    Rditdate: queryAlls
                });
            }
            case 'LAND_ALL_DATA': {
                const Alldate = action.data;
                const total = action.total;
                return Object.assign({}, defaultState, {
                    Alldate: Alldate,
                    total: total,
                    chooseflag: false
                });
            }
        }
        return defaultState;
    },
    action: (dispatch) => {
        return {
            superiorName: (parent) => {  //点击左边树的数据
                dispatch({
                    type: "BASE_SUPERIOR_NAME",
                    Name: parent.name,
                    parentid: parent.parentID,
                    pID: parent.parentLeftID
                });
            },
            // 查询所有负责人
            getEmpListByType: () => {
                IO.base.getEmpListByType({type: 2}).then((res) => {
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
                        type: "BASE_ALL_USER",
                        personList
                    });
                }).catch();
            },
            //    查询
            Alldatas: (page) => {  //进入页面的列表数据
                page.companyId = 1;
                IO.base.listByPagedata(page).then((res) => {
                    const data = res.data.rows || [];
                    const total = res.data.total;
                    dispatch({
                        type: "BASE_ALL_DATA",
                        current:1,
                        data,
                        total
                    });
                }).catch();
            },
            AlldatasLand: (page) => {  //进入页面的列表数据
                IO.base.listByPagedata(page).then((res) => {
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
                IO.base.listByPagedata(req).then((res) => {
                    const querytotal = res.data.totalCount;
                    const data = res.data.rows;
                    dispatch({
                        type: "BASE_QUERY_ALL",
                        data,
                        querytotal
                    });
                }).catch();
            },
            getOne: async (req) => {  //编辑单个时获取数据
                const res = await IO.base.GetOne(req);
                const data = res.data;
                dispatch({
                    type: "BASE_GET_ONE",
                    data
                });

            },
            getOneLand: async (req) => {  //编辑单个时获取数据
                const res = await IO.base.GetOneLand(req);
                const data = res.data;
                dispatch({
                    type: "BASE_GET_ONELAND",
                    data
                });

            },
            page: (obj) => {  //分页页码
                dispatch({
                    type: "BASE_RES_PAGE",
                    cur: obj.current,
                    psize: obj.pageSize
                });
            },
            choosepage: (obj) => {
                dispatch({
                    type: "BASE_CHOOSEPAGE",
                    chooseCUR: obj.current,
                    chooseSIZE: obj.pageSize
                });
            },
            // 创建
            defaultFields: (data) => {  //弹出框的数据
                dispatch({
                    type: "BASE_DEFAULTFIELD",
                    data
                });
            },
            setPosi:(data) => {
                dispatch({
                    type: "BASE_SETPOSI",
                    datas:data
                });
            },
            // 创建
            tableFields:(data) => {  //弹出框的数据
                dispatch({
                    type: "BASE_TABLEFIELD",
                    data
                });
            },
            modal: (obj) => {  //弹出框是否显示
                dispatch({
                    type: "BASE_MODAL",
                    modalflag: obj.modalFlag || false,
                    modaltype: obj.modeltype || '',
                    modalflag_land: obj.modalFlag_land || false,
                    modaltype_land: obj.modeltype_land || '',
                    firstFlag: obj.first
                });
            },
            modalTable:(obj) => {  //弹出框是否显示
                dispatch({
                    type: "BASE_MODAL_TABLE",
                    modalTableflag:obj.modalFlag,
                    modalTableType:obj.modeltype
                });
            },
            TreeData:(obj) => {
                dispatch({
                    type: "BASE_TREE_DATA",
                    tree:treedata(obj.tree)
                });
            },
            slide:(obj) => {
                dispatch({
                    type: "BASE_SLIDEID",
                    num:obj.num,
                    slideName:obj.slideName,
                    slideparentID:obj.slideparentID
                });
            },
            chooseAll:(chooseall) => {
                IO.base.treeDatapage(chooseall).then((res) => {
                    const initdata = Operation.modelRequest(res.data,res.success);
                    const chooseall = maplist(initdata.d);
                    dispatch({
                        type: "BASE_CHOOSE_ALL",
                        chooseall,
                        choosetotal:initdata.t,
                        flag:initdata.flag
                    });
                }).catch(Com.errorCatch);
            },
            getSelestData: async (req) => {
                const res1 = await IO.farmingLand.GetAllBase(req);
                const res2 = await IO.farmingLand.GetAllLandType();
                dispatch({
                    type: "BASE_GET_SELECT",
                    res1:res1.data,
                    res2:res2.data
                });
            },
            setId:(obj) => {
                dispatch({
                    type: "BASE_SETID",
                    companyId: obj.companyId || null,
                    baseId: obj.baseId || null
                });
            }
        };
    }
};

reducers.assemble = {baseReducer: farmingModel.reducer};
const action = farmingModel.action;
const IOModel = {
    listByPagedata: IO.base.listByPagedata,
    TreeMOdel: IO.base.TreeData,
    Delete: IO.base.deleteData,
    Adddata: IO.base.Adddata,
    AdddataLand: IO.base.AdddataLand,
    Modifydata: IO.base.Modifydata,
    ModifydataLand: IO.base.ModifydataLand,
    CheckName: IO.base.CheckName,
    CheckLandName: IO.base.CheckLandName,
    getEmpListByType: IO.base.getEmpListByType,
    treeData: IO.base.treeData,
    setPosition: IO.base.setPosition,
    getAddress:IO.base.getAddress
};
const BaseIOModel = {
    getEmpListByType: IO.base.getEmpListByType
};
export {
    action,
    IO,
    IOModel,
    BaseIOModel
};
