import {Component} from 'react';
import {Input, Button, Select, DatePicker, message, Modal, LocaleProvider} from 'antd';
import Tables from './table.jsx';
import TablesWait from './tableWait.jsx';
import {connect} from 'react-redux';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {action, IOModel} from './model';
import '../../index.less';
import './index.less';
import Utils from "@/pages/plantingmgmt/farmingplan/util";
import Com from '@/component/common';
import _ from "lodash";
import zhCN from 'antd/lib/locale-provider/zh_CN';

moment.locale('zh-cn');
const {RangePicker} = DatePicker;

class ProcurementPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operationName: '',//操作名称
            agriculturalType: '',//农事类型
            status: [1,2,3],
            planCode: '',
            userName: '',
            materialName: '',
            queryFlag: false,  //筛选按钮
            chooseId: null,
            task: ['待采农资列表', '采购计划列表'],
            currentIndex: 1,
            timeStart: moment(new Date(), 'YYYY-MM-DD'),
            timeEnd: moment(new Date(), 'YYYY-MM-DD').add(3, 'months'),
            timeStartCreate: moment(new Date(), 'YYYY-MM-DD').add(-3, 'months'),
            timeEndCreate: moment(new Date(), 'YYYY-MM-DD'),
            selectedRowKeys: [],//表格多选
            selectedRows: [],
            loading: false,
            allStatus: [],
            queryRole: false,
            queryMaterialRole: false,
            addRole: false,
            editRole: false,
            getRole: false,
            closure: false,
            disabled: true
        };
    }

    async componentDidMount() {
        //this.props.AllStatusQuery(); //状态数据字典
        await IOModel.GetAllStatus().then(res => {
            if (res.success) {
                const data = res.data || [];
                this.setState({
                    allStatus: data
                });
                /*if (data && data.length > 0) {
                    const statusId = data.filter((item) => {
                        return 'pending' === item.code;
                    })[0].id;
                    const statusList = [];
                    statusList.push(statusId);
                    this.setState({
                        status: statusList
                    });
                }*/
            }
        }).catch();
        this.props.Alldatas({
            statrTime: new Date(this.state.timeStart).getTime(),
            endTime: new Date(this.state.timeEnd).getTime(),
            startPage: 1,
            limit: 10
        });  //进入页面请求列表数据
        this.props.page({current: 1, pageSize: 10});
        this.props.superiorName({name: '采购计划', parentLeftID: -1});
        const params = _.replace(this.props.location.pathname, '/pages/plantingmgmt/procurementplan', '');
        const index = parseInt(_.replace(params, '/', ''));
        if (params) {
            await this.setState({
                currentIndex: index
            });
        }
        if (index === 2) {
            this.query();
        }
    }

    setMaterialName(event) {  //查找的表单-用户名称
        this.setState({
            materialName: event.target.value
        });
        this.query();
    }

    setPlanCode(event) {
        this.setState({
            planCode: event.target.value
        });
        this.query();
    }

    setUserName(event) {
        this.setState({
            userName: event.target.value
        });
        this.query();
    }

    setStatus(event) {  //查找的表单-状态多选
        if (event) {
            event = [event];
        } else {
            event = [1,2,3];
        }
        this.setState({
            status: event
        });
        this.query();
    }

    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        }, () => {
            if (this.state.closure) {
                clearTimeout(this.state.closure);
            }
            let vm = {};
            if (this.state.currentIndex === 1) { // 查询待采购列表
                vm = {
                    startPage: 1,
                    limit: 10,
                    materialName: this.state.materialName,
                    statrTime: this.state.timeEnd ? new Date(this.state.timeStart).getTime() : undefined,
                    endTime: this.state.timeEnd ? new Date(this.state.timeEnd).getTime() : undefined,
                    workPlanCode: this.state.planCode
                };
            } else { // 查询采购计划列表
                vm = {
                    startPage: 1,
                    limit: 10,
                    userName: this.state.userName,
                    statrTime: this.state.timeEndCreate ? new Date(this.state.timeStartCreate).getTime() : undefined,
                    endTime: this.state.timeEndCreate ? new Date(this.state.timeEndCreate).getTime() : undefined,
                    workPlanCode: this.state.planCode,
                    statusIds: JSON.stringify(this.state.status)
                };
            }
            this.setState({
                closure: setTimeout(() => {
                    if (this.state.currentIndex === 1) {
                        this.props.queryAll(vm);
                    } else {
                        this.props.queryAllProcurement(vm);
                    }
                    this.props.page({current: 1, pageSize: 10});
                }, 800)
            });
        });
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        this.props.page({current: current, pageSize: size});
        if (this.state.currentIndex === 1) { // 查询待采购列表
            const vm = {
                startPage: current,
                limit: size,
                materialName: this.state.materialName,
                statrTime: new Date(this.state.timeStart).getTime(),
                endTime: new Date(this.state.timeEnd).getTime(),
                workPlanCode: this.state.planCode
            };
            this.props.queryAll(vm);
        } else { // 查询采购计划列表
            const vm = {
                startPage: current,
                limit: size,
                userName: this.state.userName,
                statrTime: this.state.timeEndCreate ? new Date(this.state.timeStartCreate).getTime() : undefined,
                endTime: this.state.timeEndCreate ? new Date(this.state.timeEndCreate).getTime() : undefined,
                workPlanCode: this.state.planCode,
                statusIds: JSON.stringify(this.state.status)
            };
            this.props.queryAllProcurement(vm);
        }
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        this.props.page({current: 1, pageSize: size});
        if (this.state.currentIndex === 1) { // 查询待采购列表
            const vm = {
                startPage: 1,
                limit: size,
                materialName: this.state.materialName,
                statrTime: new Date(this.state.timeStart).getTime(),
                endTime: new Date(this.state.timeEnd).getTime(),
                workPlanCode: this.state.planCode
            };
            this.props.queryAll(vm);
        } else { // 查询采购计划列表
            const vm = {
                startPage: 1,
                limit: size,
                userName: this.state.userName,
                statrTime: this.state.timeEndCreate ? new Date(this.state.timeStartCreate).getTime() : undefined,
                endTime: this.state.timeEndCreate ? new Date(this.state.timeEndCreate).getTime() : undefined,
                workPlanCode: this.state.planCode,
                statusIds: JSON.stringify(this.state.status)
            };
            this.props.queryAllProcurement(vm);
        }
    }

    //创建采购计划
    addmodel() {   //增加的按钮
        //hashHistory.push('/farming_admin/planDetail/modify/123');
        const {selectedRows} = this.state;
        const list = [];
        selectedRows.forEach((item) => {
            const obj = {
                id: item.id,
                materialId: item.materialId,
                planId: item.planId,
                plannedQty: item.plannedQty
            };
            list.push(obj);
        });
        const {securityKeyWord} = this.props;
        const getRole = Com.hasRole(securityKeyWord, 'procurementplan_getById', 'show');
        const vm = {
            companyId: 1,
            materialsList: JSON.stringify(list)
        };
        IOModel.Adddata(vm).then((res) => {
            if (res.success) {
                message.success("新增成功");
                this.props.defaultFields({
                    currentId: 123
                });
                if (getRole) {
                    this.props.history.push(`/pages/plantingmgmt/procurementplan/detail/modify/${res.data}`);
                } else {
                    this.props.history.push(`/pages/plantingmgmt/procurementplan/index`);
                }
            }
        }).catch((res) => {
            Modal.error({
                title: '提示',
                content: res.message
            });
        });
    }

    fnondrag(num) {   //点击左侧边的id
        this.setState({
            chooseId: num
        });
    }

    onchooseChange(current, size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
    }

    onSelectChange(selectedRowKeys, selectedRows) {
        this.setState({selectedRowKeys, selectedRows});
        if (selectedRowKeys.length > 0) {
            this.setState({
                disabled: false
            });
        }else {
            this.setState({
                disabled: true
            });
        }
    }

    async handleTask(index) {
        const {timeStartCreate, timeEndCreate,timeStart, timeEnd, status} = this.state;
        await this.setState({
            currentIndex: index
        });
        await this.props.page({current: 1, pageSize: 10});
        await this.setState({
            materialName: '',
            userName: '',
            timeStartCreate: moment(new Date(), 'YYYY-MM-DD').add(-3, 'months'),
            timeEndCreate: moment(new Date(), 'YYYY-MM-DD'),
            planCode: '',
            timeStart: moment(new Date(), 'YYYY-MM-DD'),
            timeEnd: moment(new Date(), 'YYYY-MM-DD').add(3, 'months')
        });
        if (index === 2) {
            //第一次查询
            const vm = {
                startPage: 1,
                limit: 10,
                statrTime: timeStartCreate ? new Date(timeStartCreate).getTime() : undefined,
                endTime: timeEndCreate ? new Date(timeEndCreate).getTime() : undefined,
                statusIds: JSON.stringify(status)
            };
            await this.props.queryAllProcurement(vm);
        } else {
            await this.props.Alldatas({
                startPage: 1,
                limit: 10,
                statrTime: timeStart ? new Date(timeStart).getTime() : undefined,
                endTime: timeEnd ? new Date(timeEnd).getTime() : undefined
            });
        }
    }

    dateChange(date) {
        if (date !== null && date.length > 0) {
            const timeStart = moment(date[0]).format('YYYY-MM-DD');
            const timeEnd = moment(date[1]).format('YYYY-MM-DD');
            if (this.state.currentIndex === 1) {
                this.setState({
                    timeStart,
                    timeEnd
                });
            } else {
                this.setState({
                    timeStartCreate: timeStart,
                    timeEndCreate: timeEnd
                });
            }
        } else {
            if (this.state.currentIndex === 1) {
                this.setState({
                    timeStart: '',
                    timeEnd: ''
                });
            } else {
                this.setState({
                    timeStartCreate: '',
                    timeEndCreate: ''
                });
            }
        }
        this.query();
    }

    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'procurementplan_listByPage', 'show');
        const queryMaterialRole = Com.hasRole(securityKeyWord, 'procurementplan_material_listByPage', 'show');
        const editRole = Com.hasRole(securityKeyWord, 'procurementplan_update', 'update');
        const addRole = Com.hasRole(securityKeyWord, 'procurementplan_add', 'insert');
        const getRole = Com.hasRole(securityKeyWord, 'procurementplan_getById', 'show');
        const {queryFlag, currentIndex, allStatus, status, timeStart, timeEnd, timeStartCreate, timeEndCreate} = this.state;
        const {dataList, dataProList, user} = this.props;
        const statusList = [{id: '', name: '全部'}];
        allStatus.forEach((item) => {
            statusList.push(item);
        });
        const statusOptions = Utils.getOptionList(statusList);
        let statusIndex = '';
        if (status && status.length === 1) {
            statusIndex = status;
        }
        return (
                <div className='farming-tab-list'>
                    <div className='farming-top'>
                        <div className='title'>
                           采购计划
                        </div>
                        <div className='nav-ul title-navul'>
                            <ul>
                                {this.state.task.map((item, index) => {
                                    return <li key={index}
                                               className={index + 1 === this.state.currentIndex ? 'active-nav' : ''}
                                               onClick={this.handleTask.bind(this, index + 1)}><span>{item}</span></li>;
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className='farming-box procurement-box'>
                        {this.state.currentIndex === 1 && <div className='data-range'>
                            <span>农资日期范围</span>
                            <RangePicker onChange={this.dateChange.bind(this)}
                                         defaultValue={[timeStart,timeEnd]}/>
                        </div>}
                        {this.state.currentIndex === 2 && <div className='data-range'>
                            <span>创建日期范围</span>
                            <RangePicker onChange={this.dateChange.bind(this)}
                                         defaultValue={[timeStartCreate, timeEndCreate]}/>
                        </div>}
                        {this.state.currentIndex === 1 ?
                                <div className='farming-search'>
                                    <div className='farming-title farming-big-title'>
                                        {/*<div className='title big-title'>待采购农资</div>*/}
                                        <div className='search-layout search-layout-2'>
                                            {queryMaterialRole && <div className='search-row'>
                                                <div className='search-col'>
                                                    <span className='label-title'>种植计划编号</span>
                                                    <Input size="large" value={this.state.planCode}
                                                           onChange={this.setPlanCode.bind(this)}/>
                                                </div>
                                                <div className='search-col'>
                                                    <span className='label-title'>农资名称</span>
                                                    <Input size="large" value={this.state.materialName}
                                                           onChange={this.setMaterialName.bind(this)}/>
                                                    {/*<Button className='purchase-btn' type="primary" onClick={() => {
                                            this.query();
                                        }}>查询</Button>*/}
                                                </div>
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className='farming-search'>
                                    <div className='farming-title farming-big-title'>
                                        {/*<div className='title big-title'>采购计划列表</div>*/}
                                        <div className='search-layout'>
                                            {queryRole && <div className='search-row'>
                                                <div className='search-col'>
                                                    <span className='label-title label-big-title'>采购计划编号</span>
                                                    <Input size="large" value={this.state.planCode}
                                                           onChange={this.setPlanCode.bind(this)}/>
                                                </div>
                                                <div className='search-col'>
                                                    <span className='label-title'>创建人</span>
                                                    <Input size="large" value={this.state.userName}
                                                           onChange={this.setUserName.bind(this)}/>
                                                </div>
                                                <div className='search-col'>
                                                    <span className='label-title'>状态</span>
                                                    <Select value={statusIndex}
                                                            onChange={this.setStatus.bind(this)}>
                                                        {statusOptions}
                                                    </Select>
                                                </div>
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                        }
                        <div className='content'>
                            {
                                currentIndex === 1 && (
                                        <div>
                                            <div className='table-header'>
                                                <p><i className='iconfont icon-sort'></i><span>待采农资列表</span></p>
                                                {addRole && <p><Button onClick={this.addmodel.bind(this)} disabled={this.state.disabled} className={this.state.disabled?'null':'active'}>新增采购计划 </Button></p>}
                                            </div>
                                            {queryMaterialRole &&
                                            <LocaleProvider locale={zhCN}>
                                                <TablesWait data={dataList} onSelectChange={this.onSelectChange.bind(this)}
                                                            onSizeChangequery={this.onSizeChangequery.bind(this)}
                                                            onShowSizeChange={this.onShowSizeChange.bind(this)}
                                                            onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>
                                            </LocaleProvider>}
                                        </div>)
                            }
                            {
                                currentIndex === 2 &&
                                <div>
                                    <div className='table-header'>
                                        <p><i className='iconfont icon-sort'></i><span>采购计划列表</span></p>
                                    </div>
                                    {queryRole &&
                                    <LocaleProvider locale={zhCN}>
                                        <Tables data={dataProList} onSizeChangequery={this.onSizeChangequery.bind(this)}
                                                onShowSizeChange={this.onShowSizeChange.bind(this)}
                                                editRole={editRole} getRole={getRole} user={user}
                                                onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>
                                    </LocaleProvider>}
                                </div>
                            }
                        </div>
                    </div>
                </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName, modalflag, statusDic, AlldataPro} = state.procurementplanReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['procurementplan_listByPage', 'procurementplan_material_listByPage', 'procurementplan_update', 'procurementplan_add', 'procurementplan_getById'];
    return {
        dataList: Alldate,//展示列表的数据
        dataProList: AlldataPro,
        statusList: statusDic,
        slideName,
        modalflag, securityKeyWord
    };
};
export default connect(mapStateprops, action)(ProcurementPlan);
