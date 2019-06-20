import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
//配置接口参数
context.create('knowledgeMan', {
    listByPagedata: {
        mockUrl: '/proxy/article/getArticleIdByTagId',
        url: '/article/getArticleIdByTagId',
        method: 'POST',
        rest: true
    },
    getTag: {
        mockUrl: '/proxy/tag/list',
        url: '/tag/list',
        method: 'GET',
        rest: true
    },
    getChildTag: {
        mockUrl: '/proxy/tag/getChild',
        url: '/tag/getChild',
        method: 'GET'
    },
    deleteData: {
        mockUrl: '/proxy/tag/update',
        url: '/tag/update',
        method: 'POST'
    },
    Modifydata: {
        mockUrl: '/proxy/cropCate/update',
        url: '/cropCate/update',
        method: 'POST'
    },
    GetOne: {
        mockUrl: '/proxy/cropCate/getById/:id',
        url: '/cropCate/getById/:id',
        method: 'GET',
        rest: true
    },
    CheckName: {
        mockUrl: '/proxy/tag/add',
        url: '/tag/add',
        method: 'POST'
    },
    sendFile: {
        mockUrl: '/proxy/article/add',
        url: '/article/add',
        method: 'POST'
    },
    getOne: {
        mockUrl: '/proxy/article/getById',
        url: '/article/getById',
        method: 'GET'
    },
    editFile: {
        mockUrl: '/proxy/article/update',
        url: '/article/update',
        method: 'POST'
    },
    getProgress: {
        mockUrl: '/proxy/article/schedule',
        url: '/article/schedule',
        method: 'GET'
    }
});
//封装页面reducer、action
const farmingModel = {
    reducer: (defaultState = {
        Alldate: [],
        AllTag: [],
        childCount:0,
        parentCount:0,
        category:[],
        tags:[],
        total: null,
        parentname: null,
        id: -1,
        PID: '',
        Psize: 10,
        Cur: 1,
        fields: {},
        addflag: false,
        modalflag: false,
        modeltype: '',
        parentID: null,
        slideID: -1,
        modifyID: null,
        chooseCUR: 1,
        chooseSIZE: 10,
        slideparentID: -1,
        slideName: '作物'
    }, action) => {
        const fields = action.data;
        switch (action.type) {
            case 'CROPS_LIBRARY_ALL_DATA': {
                const Alldate = action.data;
                const total = action.total;
                return Object.assign({}, defaultState, {
                    Alldate: Alldate,
                    total: total
                });
            }
            case 'CROPS_LIBRARY_GET_ONE': {
                const queryAlls = action.data;
                return Object.assign({}, defaultState, {
                    Rditdate: queryAlls
                });
            }
            case 'CROPS_LIBRARY_MENU_ALL':
                return Object.assign({}, defaultState, {
                    Alldate: action.arr,
                    total: action.num
                    //chooseflag:true
                });
            case 'CROPS_LIBRARY_SUPERIOR_NAME':
                return Object.assign({}, defaultState, {
                    parentname: action.Name
                });
            case 'CROPS_LIBRARY_RES_PAGE':
                return Object.assign({}, defaultState, {
                    Cur: action.cur,
                    Psize: action.psize
                });
            case 'CROPS_LIBRARY_MODAL':
                return Object.assign({}, defaultState, {
                    modalflag: action.modalflag,
                    modeltype: action.modeltype
                });
            case 'CROPS_LIBRARY_DEFAULTFIELD':
                return Object.assign({}, defaultState, {fields: fields});
            case 'CROPS_LIBRARY_TREE_DATAs':
                return Object.assign({}, defaultState, {
                    TreeD: action.tree
                });
            case 'CROPS_LIBRARY_SLIDEID':
                return Object.assign({}, defaultState, {
                    slideID: action.num,
                    slideName: action.slideName,
                    slideparentID: action.slideparentID
                });
            case 'CROPS_LIBRARY_PARENTID':
                return Object.assign({}, defaultState, {
                    parentID: action.parentid,
                    modifyID: action.modifyid
                });
            case 'CROPS_LIBRARY_CHOOSEPAGE':
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
                    type: "CROPS_LIBRARY_SUPERIOR_NAME",
                    Name: parent.name,
                    parentid: parent.parentID,
                    pID: parent.parentLeftID
                });
            },
            //    查询
            Alldatas: (page) => {  //进入页面的列表数据
                IO.knowledgeMan.listByPagedata(page).then((res) => {
                    const data = res.data.res || [];
                    const total = res.data.totalCount;
                    dispatch({
                        type: "CROPS_LIBRARY_ALL_DATA",
                        data,
                        total
                    });
                }).catch();
            },
            getOne: async (req) => {  //编辑单个时获取数据
                const res = await IO.cropsLibrary.GetOne(req);
                const data = res.data;
                dispatch({
                    type: "CROPS_LIBRARY_GET_ONE",
                    data
                });

            },
            page: (obj) => {  //分页页码
                dispatch({
                    type: "CROPS_LIBRARY_RES_PAGE",
                    cur: obj.current,
                    psize: obj.pageSize
                });
            },
            choosepage: (obj) => {
                dispatch({
                    type: "CROPS_LIBRARY_CHOOSEPAGE",
                    chooseCUR: obj.current,
                    chooseSIZE: obj.pageSize
                });
            },
            // 创建
            defaultFields: (data) => {  //弹出框的数据
                dispatch({
                    type: "CROPS_LIBRARY_DEFAULTFIELD",
                    data
                });
            },
            modal: (obj) => {  //弹出框是否显示
                dispatch({
                    type: "CROPS_LIBRARY_MODAL",
                    modalflag: obj.modalFlag,
                    modeltype: obj.modeltype
                });
            }
        };
    }
};

reducers.assemble = {knowledgeManagementReducer: farmingModel.reducer};
const action = farmingModel.action;
const IOModel = {
    CheckName: IO.knowledgeMan.CheckName,
    getTag: IO.knowledgeMan.getTag,
    getChildTag: IO.knowledgeMan.getChildTag,
    Delete: IO.knowledgeMan.deleteData,
    Alldatas: IO.knowledgeMan.listByPagedata,
    sendFile: IO.knowledgeMan.sendFile,
    getOne: IO.knowledgeMan.getOne,
    editFile: IO.knowledgeMan.editFile,
    getProgress: IO.knowledgeMan.getProgress
};
export {
    action,
    IO,
    IOModel
};
