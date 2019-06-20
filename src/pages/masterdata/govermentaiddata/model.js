import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
//配置接口参数
context.create('govermentaiddata', {
    listByPagedata: {
        mockUrl: '/proxy/reportPoverty/listByPageReport',
        url: '/reportPoverty/listByPageReport',
        method: 'POST'
    },
    Adddata: {
        mockUrl: '/proxy/reportPoverty/addReport',
        url: '/reportPoverty/addReport',
        method: 'POST'
    },
    Modifydata: {
        mockUrl: '/proxy/reportPoverty/updateReport',
        url: '/reportPoverty/updateReport',
        method: 'POST'
    },
    GetOne: {
        mockUrl: '/proxy/reportPoverty/getByYearReport',
        url: '/reportPoverty/getByYearReport',
        method: 'POST'
    },
  changeStatus: {
        mockUrl: '/proxy/reportPoverty/updateStatusReport',
        url: '/reportPoverty/updateStatusReport',
        method: 'POST'
    },
  CheckName: {
    mockUrl: '/proxy/reportPoverty/checkYearUniqueReport',
    url: '/reportPoverty/checkYearUniqueReport',
    method: 'POST'
  },
    TreeData: {
        mockUrl: '',
        rest: true
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
            case 'GOV_AID_DATA_ALL_DATA': {
                const Alldate = action.data;
                const total = action.total;
                return Object.assign({}, defaultState, {
                    Alldate: Alldate,
                    total: total,
                    chooseflag: false
                });
            }
            case 'GOV_AID_DATA_QUERY_ALL': {
                const queryAlls = action.data;
                const querytotal = action.querytotal;
                return Object.assign({}, defaultState, {
                    Alldate: queryAlls,
                    total: querytotal
                });
            }
            case 'GOV_AID_DATA_GET_ONE': {
                const queryAlls = action.data;
                return Object.assign({}, defaultState, {
                    Rditdate: queryAlls
                });
            }
            case 'GOV_AID_DATA_MENU_ALL':
                return Object.assign({}, defaultState, {
                    Alldate: action.arr,
                    total: action.num
                    //chooseflag:true
                });
            case 'GOV_AID_DATA_SUPERIOR_NAME':
                return Object.assign({}, defaultState, {
                    parentname: action.Name
                });
            case 'GOV_AID_DATA_RES_PAGE':
                return Object.assign({}, defaultState, {
                    Cur: action.cur,
                    Psize: action.psize
                });
            case 'GOV_AID_DATA_MODAL':
                return Object.assign({}, defaultState, {
                    modalflag: action.modalflag,
                    modaltype: action.modaltype
                });
          case 'GOV_AID_DATA_MODAL_TABLE':
            return Object.assign({}, defaultState, {
              modalTableflag:action.modalTableflag,
              modalTableType:action.modalTableType
            });
            case 'GOV_AID_DATA_DEFAULTFIELD':
                return Object.assign({}, defaultState, {fields: fields});
            case 'GOV_AID_DATA_TREE_DATAs':
                return Object.assign({}, defaultState, {
                    TreeD: action.tree
                });
            case 'GOV_AID_DATA_SLIDEID':
                return Object.assign({}, defaultState, {
                    slideID: action.num,
                    slideName: action.slideName,
                    slideparentID: action.slideparentID
                });
            case 'GOV_AID_DATA_PARENTID':
                return Object.assign({}, defaultState, {
                    parentID: action.parentid,
                    modifyID: action.modifyid
                });
            case 'GOV_AID_DATA_CHOOSEPAGE':
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
                    type: "GOV_AID_DATA_SUPERIOR_NAME",
                    Name: parent.name,
                    parentid: parent.parentID,
                    pID: parent.parentLeftID
                });
            },
            //    查询
            Alldatas: (page) => {  //进入页面的列表数据
                page.companyId = 1;
                IO.govermentaiddata.listByPagedata(page).then((res) => {
                    const data = res.data.rows || [];
                    const total = res.data.total;
                    dispatch({
                        type: "GOV_AID_DATA_ALL_DATA",
                        data,
                        total
                    });
                }).catch();
            },
            queryAll: (req) => {  //筛选的列表数据
                req.companyId = 1;
                IO.govermentaiddata.listByPagedata(req).then((res) => {
                    const querytotal = res.data.total;
                    const data = res.data.rows;
                    dispatch({
                        type: "GOV_AID_DATA_QUERY_ALL",
                        data,
                        querytotal
                    });
                }).catch();
            },
            getOne: async (req) => {  //编辑单个时获取数据
                const res = await IO.govermentaiddata.GetOne(req);
                const data = res.data;
                dispatch({
                    type: "GOV_AID_DATA_GET_ONE",
                    data
                });

            },
            page: (obj) => {  //分页页码
                dispatch({
                    type: "GOV_AID_DATA_RES_PAGE",
                    cur: obj.current,
                    psize: obj.pageSize
                });
            },
            choosepage: (obj) => {
                dispatch({
                    type: "GOV_AID_DATA_CHOOSEPAGE",
                    chooseCUR: obj.current,
                    chooseSIZE: obj.pageSize
                });
            },
            // 创建
            defaultFields: (data) => {  //弹出框的数据
                dispatch({
                    type: "GOV_AID_DATA_DEFAULTFIELD",
                    data
                });
            },
            modal: (obj) => {  //弹出框是否显示
                dispatch({
                    type: "GOV_AID_DATA_MODAL",
                    modalflag: obj.modalFlag,
                    modaltype: obj.modeltype
                });
            },
          modalTable:(obj) => {  //弹出框是否显示
            dispatch({
              type: "GOV_AID_DATA_MODAL_TABLE",
              modalTableflag:obj.modalFlag,
              modalTableType:obj.modeltype
            });
          }
        };
    }
};

reducers.assemble = {govermentaiddataReducer: farmingModel.reducer};
const action = farmingModel.action;
const IOModel = {
    TreeMOdel: IO.govermentaiddata.TreeData,
    ChangeStatus: IO.govermentaiddata.changeStatus,
    Adddata: IO.govermentaiddata.Adddata,
    Modifydata: IO.govermentaiddata.Modifydata,
    CheckName: IO.govermentaiddata.CheckName
};
export {
    action,
    IO,
    IOModel
};
