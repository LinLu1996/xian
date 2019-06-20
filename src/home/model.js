import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
//配置接口参
context.create('index', {
    getData: {
        mockUrl: '/proxy/astBase/listByPage',
        url: '/astBase/listByPage',
        method: 'POST'
    },
    listByPage: {
        mockUrl: '/proxy/astLand/listByPage',
        url: '/astLand/listByPage',
        method: 'POST'
    },
    getLandsByBaseId: {
        mockUrl: '/proxy/astLand/getLandsByBaseId/:baseId',
        url: '/astLand/getLandsByBaseId/:baseId',
        method: 'GET',
        rest: true
    },
    getDashReport: {
        mockUrl: '/proxy/reportResource/getDashReport',
        url: '/reportResource/getDashReport',
        method: 'GET',
        rest: true
    },
    getTaskBoard: {
        mockUrl: '/proxy/workTask/getTaskBoard',
        url: '/workTask/getTaskBoard',
        method: 'POST'
    }
});
//封装页面reducer、action
const farmingModel = {
    reducer: (defaultState = {
        slideName:'首页',
        size: 3,
        current: 1,
        total: '',
        dataList: [],
        landList: [],
        pageF: false,
        baseNum: {
            nowLands: 0,
            nowAreas: 0,
            nowCrops: 0,
            oldLands: 0,
            oldAreas: 0,
            oldCrops: 0
        },
        taskNum: {
            doneCount: 0,
            todoCount: 0,
            overtimeCount: 0,
            all: 0,
            workTaskDTODones: [],
            workTaskDTOTodos: [],
            workTaskDTOOvertimes: []
        },
        base:null
    }, action) => {
        switch (action.type) {
            case 'INDEX_ALL_DATA': {
                const data = action.data;
                return Object.assign({}, defaultState, {
                    baseNum:data
                });
            }
            case 'INDEX_SUPERIOR_BASENAME': {
                const data = action.data;
                return Object.assign({}, defaultState, {
                    base:data
                });
            }
            case 'INDEX_TASK_DATA': {
                const data = action.data;
                return Object.assign({}, defaultState, {
                    taskNum:data
                });
            }
            case 'INDEX_SUPERIOR_NAME': {
                return Object.assign({}, defaultState, {
                    parentname:action.Name
                });
            }
            case 'INDEX_PAGE':
                return Object.assign({}, defaultState, {
                    dataList: action.data,
                    total: action.total
                });
            case 'INDEX_PAGE_FLAG':
                return Object.assign({}, defaultState, {
                    pageF: action.flag
                });
            case 'INDEX_BASE_LAND':
                return Object.assign({}, defaultState, {
                    landList: action.landList
                });
        }
        return defaultState;
    },
    action: (dispatch) => {
        return {
            superiorName:(parent) => {  //点击左边树的数据
                dispatch({
                    type: "INDEX_SUPERIOR_NAME",
                    Name:parent.name,
                    parentid:parent.parentID,
                    pID:parent.parentLeftID
                });
            },
            setBase:(v) => {  //点击左边树的数据
                dispatch({
                    type: "INDEX_SUPERIOR_BASENAME",
                    data:v
                });
            },
            getDashReport: async (req) => {  //获取报表数据
                const res= await IO.index.getDashReport(req);
                const data = res.data;
                dispatch({
                    type: "INDEX_ALL_DATA",
                    data
                });
            },
            getTaskBoard: (req) => {  //进入页面的农事看板数据
                IO.index.getTaskBoard(req).then((res) => {
                    const data=res.data;
                    dispatch({
                        type: "INDEX_TASK_DATA",
                        data
                    });
                }).catch();
            },
            pageSize: (page) => {
                IO.index.listByPage(page).then((res) => {
                    const data = res.data.rows || [];
                    const total = res.data.totalCount;
                    dispatch({
                        type: "INDEX_PAGE",
                        data,
                        total
                    });
                }).catch();
            },
            pageFlag: (res) => {
                const flag = res.flag;
                dispatch({
                    type: "INDEX_PAGE_FLAG",
                    flag
                });
            },
            getLandsByBaseId: (req) => {
                IO.index.getLandsByBaseId(req).then((res) => {
                    const landList = res.data || [];
                    dispatch({
                        type: "INDEX_BASE_LAND",
                        landList
                    });
                }).catch();
            }
        };
    }
};

reducers.assemble = {indexReducer: farmingModel.reducer};
const action = farmingModel.action;
const IOModel = {
    GetPhotoList:IO.index.getData,
    GetDashReport:IO.index.getDashReport,
    GetTaskBoard:IO.index.getTaskBoard,
    getLandsByBaseId: IO.index.getLandsByBaseId,
    listByPage: IO.index.listByPage
};
export {
    action,
    IO,
    IOModel
};
