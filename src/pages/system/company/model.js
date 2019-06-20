import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
import Com from '@/component/common';
import moment from 'moment';
import Operation from '../public.js';
//配置接口参数
const maplist = (data) => {
    const databox = data.map((item) => {
        const creatgmt = moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss');
        const querygmt = moment(item.gmtModified).format('YYYY-MM-DD HH:mm:ss');
        const zcgmt = moment(item.gmtReg).format('YYYY-MM-DD');
        const gzgmt = moment(item.gmtApproval).format('YYYY-MM-DD');
        switch (item.companyType) {
            case 1:
                item.companyType = '农企';
                break;
            case 2:
                item.companyType = '散户';
                break;
            case 3:
                item.companyType = '政府机构';
        }
        switch (item.stauts) {
            case 0:
                item.stauts = '正常';
                break;
            case 1:
                item.stauts = '禁用';
                break;
            case '':
                item.stauts = '禁用';
        }
        switch (item.regType) {
            case '1':
                item.regType = '个人独资';
                break;
            case '2':
                item.regType = '有限责任公司';
                break;
            case '3':
                item.regType = '股份公司';
                break;
            case '4':
                item.regType = '合伙企业';
        }
        return Object.assign({}, item, {
            gmtCreate: creatgmt,
            gmtModified: querygmt,
            gmtReg: zcgmt,
            gmtApproval: gzgmt,
            key: item.id
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
            title : item.companyName,
            key : item.id
        });
    });
};
const treeNodedata =(data) => {
    return data.map(item => {
        if (item.childrens) {
            item.childrens = treeNodedata(item.childrens);
        }
        return Object.assign({},item,{
            title : item.nodeName,
            key : item.id
        });
    });
};
context.create('company', {
    companylistByPage: {
        mockUrl: '/proxy/company/listByPage',
        url: '/company/listByPage'
    },
    crossOrigin: {
        mockUrl: '/proxy/scanFruit',
        url: '',
        method: 'POST'
    },
    CheckName: {
        mockUrl: '/proxy/company/checkName',
        url: '/company/checkName',
        method: 'GET'
    },
    TreeData: {
        mockUrl: '/proxy/company/getCompanyConfigTree',
        url: '/company/getCompanyConfigTree',
        method: 'GET'
    },
    TreeNodeData: {
        mockUrl: '/proxy/node/getChilds',
        url: '/node/getChilds',
        method: 'GET'
    },
    TreeDataPage: {
        mockUrl: '/proxy/company/getChildsByPage',
        url:'/company/getChildsByPage',
        method: 'GET'
    },
    getBaseList: {
        mockUrl: '/proxy/company/getBase',
        url:'/company/getBase',
        method: 'GET'
    },
    getLandList: {
        mockUrl: '/proxy/company/getLand',
        url:'/company/getLand',
        method: 'GET'
    },
    getPhoneList: {
        mockUrl: '/proxy/company/getImg',
        url:'/company/getImg',
        method: 'GET'
    }
});
context.create('comres', {
    getdata: {
        url: '/companyResource/updateByCompanyId',
        mockUrl: '/proxy/companyResource/updateByCompanyId',
        method: 'POST'
    },
    gethavedata:{
        url:'/companyResource/getResIdsByCompanyId/:id',
        mockUrl:'/proxy/companyResource/getResIdsByCompanyId/:id',
        rest: true
    }
});
//封装页面reducer、action
const companyModel = {
    reducer: (defaultState = {
        value: '',
        Alldate: [],
        total: null,
        parentname:null,
        parenttype: null,
        parentID:null,//点击修改需要的上级ID
        modifyID:null,//点击修改的ID
        slideID:-1, //点击树所对应的id
        slideName:'公司',   //点击树的父级名字
        modalflag: false,
        modaltype: '',
        fields: {},
        flag: true,//loading的展示
        queryfields: {},  //修改时存放的form的数据
        modifycode:null,  //修改的code码
        str: null,
        sortfield: 'gmt_create',
        sortorder: 'DESC',
        TreeNodeD: [],  //节点树数据
        TreeD: [], //公司树数据
        rightItem:{},
        tableCur: 1,       //弹出框table分页
        tableSize: 10,     //
        tableFlag: false,  //是否打开弹出框table
        tableType: 'base',
        tableList: [],
        tableTotal: 0,
        tableId: 0,
        searchflag:false
    }, action) => {
        switch (action.type) {
            case 'COM_ALLDATA': {  //进入页面的数据
                const Alldate = action.dataAll;
                const total = action.total;
                const flag = action.flag;
                return Object.assign({}, defaultState, {
                    Alldate: Alldate,
                    total: total,
                    flag: flag
                });
            }
            case 'COM_CHOOSE_ALL': {  //点击左边分页的数据
                const chooseAlls = action.chooseall;
                const choosetotal = action.choosetotal;
                const flag = action.flag;
                return Object.assign({}, defaultState, {
                    Alldate: chooseAlls,
                    total: choosetotal,
                    flag: flag
                });
            }
            case 'COM_MODAL':
                return Object.assign({}, defaultState, {
                    modalflag: action.modalflag,
                    modaltype: action.modaltype
                });
            case 'COM_TABLE_MODAL':
                return Object.assign({}, defaultState, {
                    tableFlag: action.tableFlag,
                    tableCur: action.tableCur,
                    tableSize: action.tableSize,
                    tableType: action.tableType,
                    tableId: action.tableId
                });
            case 'COM_TABLE_SEARCH':
                return Object.assign({}, defaultState, {
                    tableList: action.tableList,
                    tableTotal: action.tableTotal
                });
            case 'COM_DEFAULTFIELD': {
                const fields = action.data;
                return Object.assign({}, defaultState, {fields: fields});
            }
            case 'COM_QUERYDEFAULTFIELDS': {
                const fields = action.data;
                return Object.assign({}, defaultState, {queryfields: fields});
            }
            case 'COM_LOGOSTR': {
                const str = action.str;
                return Object.assign({}, defaultState, {str});
            }
            case 'COM_SORDER':
                return Object.assign({}, defaultState, {
                    sortfield: action.sortfield,
                    sortorder: action.sortorder
                });
            case 'COM_TREE_DATA':
                return Object.assign({}, defaultState, {
                    TreeD: action.tree
                });
            case 'COM_TREE_NODE_DATA':
                return Object.assign({}, defaultState, {
                    TreeNodeD: action.tree
                });
            case 'COM_PARENTID':
                return Object.assign({}, defaultState, {
                    parentID:action.parentid,
                    modifyID:action.modifyid,
                    modifycode:action.modifycode
                });
            case 'COM_SUPERIOR_NAME': //存储点击左边的数据
                return Object.assign({}, defaultState, {
                    parentname:action.Name,
                    parenttype:action.Type
                });
            case 'COM_SLIDE':
                return Object.assign({}, defaultState, {
                    slideID:action.num,
                    slideName:action.slideName
                });
            case 'COM_RIGHTQUERYITEM':
                return Object.assign({},defaultState, {
                    rightItem: action.ITEM
                });
            case 'COM_RIGHTSEARCHFLAG':
                return Object.assign({},defaultState, {
                    searchflag:action.zcflag
                });
        }
        return defaultState;
    },
    action: (dispatch) => {
        return {
            Alldatas: (page) => {
                IO.company.companylistByPage(page).then((res) => {
                    const initdata = Operation.modelRequest(res.data, res.success);
                    const dataAll = maplist(initdata.d);
                    dispatch({
                        type: "COM_ALLDATA",
                        dataAll,
                        total: initdata.t,
                        flag: initdata.flag
                    });
                }).catch(Com.errorCatch);
            },
            chooseAll:(chooseall) => {
                IO.company.TreeDataPage(chooseall).then((res) => {
                    const initdata = Operation.modelRequest(res.data,res.success);
                    const chooseall = maplist(initdata.d);
                    dispatch({
                        type: "COM_CHOOSE_ALL",
                        chooseall,
                        choosetotal:initdata.t,
                        flag:initdata.flag
                    });
                }).catch(Com.errorCatch);
            },
            defaultFields: (data) => {
                dispatch({
                    type: "COM_DEFAULTFIELD",
                    data
                });
            },
            querydefaultfields: (data) => {
                dispatch({
                    type: "COM_QUERYDEFAULTFIELDS",
                    data
                });
            },
            TreeData: (obj) => {  //存放左边的数据 公司树
                dispatch({
                    type: "COM_TREE_DATA",
                    tree: treedata(obj.tree)
                });
            },
            TreeNodeData: (obj) => {  //节点数
                dispatch({
                    type: "COM_TREE_NODE_DATA",
                    tree: treeNodedata(obj.tree)
                });
            },
            superiorName:(parent) => {
                dispatch({
                    type: "COM_SUPERIOR_NAME",
                    Name:parent.name,
                    Type:parent.type
                });
            },
            modal: (obj) => {
                dispatch({
                    type: "COM_MODAL",
                    modalflag: obj.modalFlag,
                    modaltype: obj.modeltype
                });
            },
            tableModal: (obj) => {
                dispatch({
                    type: "COM_TABLE_MODAL",
                    tableFlag: obj.tableFlag,
                    tableCur: obj.tableCur,
                    tableSize: obj.tableSize,
                    tableType: obj.tableType,
                    tableId: obj.tableId
                });
            },
            tableSearch: (table) => {
                if (table.type === 'base') {
                    IO.company.getBaseList(table).then((res) => {
                        if (res.success) {
                            const tableList = res.data.base||[];
                            const tableTotal = res.data.totalCount;
                            dispatch({
                                type: "COM_TABLE_SEARCH",
                                tableList,
                                tableTotal
                            });
                        }
                    });
                } else {
                    IO.company.getLandList(table).then((res) => {
                        if (res.success) {
                            const tableList = res.data.land||[];
                            const tableTotal = res.data.totalCount;
                            dispatch({
                                type: "COM_TABLE_SEARCH",
                                tableList,
                                tableTotal
                            });
                        }
                    });
                }
            },
            logostr: (str) => {
                dispatch({
                    type: "COM_LOGOSTR",
                    str
                });
            },
            sorter: (obj) => {
                dispatch({
                    type: "COM_SORDER",
                    sortfield: obj.sortfield,
                    sortorder: obj.sortorder
                });
            },
            slide: (obj) => {
                dispatch({
                    type: "COM_SLIDE",
                    num:obj.num,
                    slideName:obj.slideName
                });
            },
            rightqueryItem:(obj) => {
                dispatch({
                    type: "COM_RIGHTQUERYITEM",
                    ITEM:obj
                });
            },
            parentId:(obj) => {
                dispatch({
                    type: "COM_PARENTID",
                    parentid:obj.parentID,
                    modifyid:obj.modifyid,
                    modifycode:obj.modifycode
                });
            },
            RightsearchFlag:(obj) => {
            dispatch({
                type: "COM_RIGHTSEARCHFLAG",
                zcflag:obj.flag
            });
        }
        };
    }
};

reducers.assemble = {companyReducer: companyModel.reducer};
const IOModel = {
    CheckName: IO.company.CheckName
};
const action = companyModel.action;
export {
    action,
    IOModel,
    IO
};
