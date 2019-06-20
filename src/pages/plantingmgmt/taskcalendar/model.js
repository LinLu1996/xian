import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
//配置接口参数
context.create('taskCalendar', {
    TasklistByPagedata: {
        mockUrl: '/proxy/workTask/getTaskCalendar',
        url: '/workTask/getTaskCalendar',
        method: 'POST'
    },
    GetOne: {
        mockUrl: '/proxy/workTask/getById',
        url: '/workTask/getById',
        method: 'GET'
    },
    createTask: {
        mockUrl: '/proxy/workTask/createTask',
        url: '/workTask/createTask',
        method: 'POST'
    }
});
//封装页面reducer、action
const farmingModel = {
    reducer: (defaultState = {
        EditData: {},
        Alldata: [],
        total: null,
        baseList: [],
        cropList: [],
        landList: [],
        detailData: {},
        Psize: 10,
        Cur: 1,
        fields: {},
        TreeD: [],
        addflag: false,
        modalflagDetails: false,
        modaltype: '',
        parentID: null,
        slideID: -1,
        modifyID: null,
        chooseCUR: 1,
        chooseSIZE: 10
    }, action) => {
        const fields = action.data;
        switch (action.type) {
            case 'TASKCALENDAR_ALL_DATA': {
                const Alldata = action.data;
                return Object.assign({}, defaultState, {
                    Alldata: Alldata,
                    chooseflag: false
                });
            }
            case 'TASKCALENDAR_ALL_BASE': {
                const dicAll = action.dataAll;
                return Object.assign({}, defaultState, {
                    baseList: dicAll
                });
            }
            case 'TASKCALENDAR_ALL_LAND': {
                const dicAll = action.dataAll;
                return Object.assign({}, defaultState, {
                    landList: dicAll
                });
            }
            case 'TASKCALENDAR_ALL_CROP': {
                const dicAll = action.dataAll;
                return Object.assign({}, defaultState, {
                    cropList: dicAll
                });
            }

            case 'TASKCALENDAR_MODAL':
                return Object.assign({}, defaultState, {
                    modalflagDetails: action.modalflagDetails,
                    modaltype: action.modaltype
                });
            case 'TASKCALENDAR_GET_ONE': {
                const data = action.data;
                return Object.assign({}, defaultState, {
                    detailData: data
                });
            }
            case 'TASKCALENDAR_DEFAULTFIELD':
                return Object.assign({}, defaultState, {fields: fields});

        }
        return defaultState;
    },
    action: (dispatch) => {
        return {

            //    查询
            Alldatas: (page) => {  //进入页面的列表数据
                IO.taskCalendar.TasklistByPagedata(page).then((res) => {
                    const data = res.data || [];
                    dispatch({
                        type: "TASKCALENDAR_ALL_DATA",
                        data
                    });
                }).catch();
            },
            getCompanyBase: () => {
                IO.earlyWarningList.getAllBase({companyId: 1}).then((res) => {
                    const data = res.data || [];
                    dispatch({
                        type: "TASKCALENDAR_ALL_BASE",
                        dataAll: data
                    });
                });
            },
            getBaseLand: (value) => {
                IO.farmCostAnalysis.getBaseLand({':baseId': value}).then((res) => {
                    const data = res.data || [];
                    dispatch({
                        type: "TASKCALENDAR_ALL_LAND",
                        dataAll: data
                    });
                });
            },
            getCompanyCrop: () => {
                IO.farmingPlan.GetAllCrop({companyId: 1}).then((res) => {
                    const data = res.data || [];
                    dispatch({
                        type: "TASKCALENDAR_ALL_CROP",
                        dataAll: data
                    });
                });
            },
            getOne: async (req) => {  //单个获取数据
                const res = await IO.taskCalendar.GetOne(req);
                const data = res.data;
                if (data.stauts === 0) {
                    data.stautsShow = '正常';
                } else if (data.stauts === 1) {
                    data.stautsShow = '禁用';
                }
                dispatch({
                    type: "TASKCALENDAR_GET_ONE",
                    data
                });
            },
            // 创建
            defaultFields: (data) => {  //弹出框的数据
                dispatch({
                    type: "TASKCALENDAR_DEFAULTFIELD",
                    data
                });
            },
            modal: (obj) => {  //弹出框是否显示
                dispatch({
                    type: "TASKCALENDAR_MODAL",
                    modalflagDetails: obj.modalflagDetails,
                    modaltype: obj.modeltype
                });
            }
        };
    }
};

reducers.assemble = {taskCalendarReducer: farmingModel.reducer};
const action = farmingModel.action;
const IOModel = {
    listByPagedata: IO.taskCalendar.listByPagedata,
    createTask: IO.taskCalendar.createTask
};
export {
    action,
    IO,
    IOModel
};
