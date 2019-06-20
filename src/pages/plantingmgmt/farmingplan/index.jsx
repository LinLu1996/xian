import {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Input, Button, message, Select} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import '../../index.less';
import './index.less';
import Utils from "@/pages/plantingmgmt/farmingplan/util";
import Com from '@/component/common';


// const Option = Select.Option;
class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            planCode: '',//农事计划编号
            createName: '',//创建人
            crops: '',//作物品种
            base: '',//种植基地
            status: [1,2,3],//状态
            queryFlag: false, //筛选按钮
            queryRole: false,
            addRole: false,
            editRole: false,
            getRole: false,
            saveFlag: true,
            closure: false
        };
    }

    componentDidMount() {
        this.props.page({current: 1, pageSize: 10});
        this.props.Alldatas({companyId: 1, userId: 1, startPage: 1, limit: 10});  //进入页面请求列表数据
        this.props.getWorkPlanStatus();
        this.props.superiorName({name: '农事计划', parentLeftID: -1});
    }

    setPlanCode(event) {  //查找的表单-基地名称
        this.setState({
            planCode: event.target.value
        });
        this.query();
    }

    setCreateName(event) {  //查找的表单-基地名称
        this.setState({
            createName: event.target.value
        });
        this.query();
    }

    setCrops(event) {  //查找的表单-基地名称
        this.setState({
            crops: event.target.value
        });
        this.query();
    }

    setBase(event) {  //查找的表单-基地名称
        this.setState({
            base: event.target.value
        });
        this.query();
    }

    setStatus(event) {  //查找的表单-基地名称
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
            const vm = {
                companyId: 1,
                userId: 1,
                startPage: 1,
                limit: 10,
                code: this.state.planCode,
                createUserName: this.state.createName,
                cropName: this.state.crops,
                baseName: this.state.base,
                statusList: this.state.status
            };
            this.setState({
                closure: setTimeout(() => {
                    this.props.queryAll(vm);
                    this.props.page({current: 1, pageSize: 10});
                }, 800)
            });
        });
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            companyId: 1,
            userId: 1,
            startPage: current,
            limit: size,
            code: this.state.planCode,
            createUserName: this.state.createName,
            cropName: this.state.crops,
            baseName: this.state.base,
            statusList: this.state.status
        };
        this.props.queryAll(vm);
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            companyId: 1,
            userId: 1,
            startPage: 1,
            limit: size,
            code: this.state.planCode,
            createUserName: this.state.createName,
            cropName: this.state.crops,
            baseName: this.state.base,
            statusList: this.state.status
        };
        this.props.queryAll(vm);
    }

    addmodel() {   //增加的按钮
        this.props.modal({modalFlag: true, modeltype: 'add'});
        this.props.defaultFields({
            name: {
                value: ''
            },
            code: {
                value: ''
            },
            functionary: {
                value: ''
            },
            longitude: {
                value: ''
            },
            latitude: {
                value: ''
            },
            phone: {
                value: ''
            },
            address: {
                value: ''
            },
            createUserName: {
                value: ''
            },
            modeltype: {
                value: 'add'
            }
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

    checkName(name) {
        IOModel.CheckName({companyId: 1, name: name}).then((res) => {  //添加成功时的回
            if (res.success) {
                message.success('基地名正确');
            } else {
                message.success('基地名已存在');
            }
        }).catch();
    }

    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'farmingplan_listByPage', 'show');
        const addRole = Com.hasRole(securityKeyWord, 'farmingplan_add', 'insert');
        const editRole = Com.hasRole(securityKeyWord, 'farmingplan_update', 'update');
        const getRole = Com.hasRole(securityKeyWord, 'farmingplan_getById', 'show');
        const {queryFlag, status} = this.state;
        const {dataList} = this.props;
        const {workPlanStatusList} = this.props;
        const statusList = [{id: '', name: '全部'}];
        workPlanStatusList.forEach((item) => {
            statusList.push(item);
        });
        const statusOptions = Utils.getOptionList(statusList);
        let statusIndex = '';
        if (status && status.length === 1) {
            statusIndex = status;
        }
        return (
            <div className='farming-box'>
                <div className='farming-search'>
                    <div className='farming-title'>
                        <div className='title'>农事计划</div>
                        <div className='search-layout '>
                            <div className='search-row'>
                                <div className='search-col'>
                                    <span className='label-title'>编号</span>
                                    <div className='search-input'><Input size="large" value={this.state.planCode}
                                           onChange={this.setPlanCode.bind(this)}/></div>
                                </div>
                                <div className='search-col'>
                                    <span className='label-title'>创建人</span>
                                    <div className='search-input'><Input size="large" value={this.state.createName}
                                           onChange={this.setCreateName.bind(this)}/></div>
                                </div>
                                <div className='search-col'>
                                    <span className='label-title'>品种</span>
                                    <div className='search-input'><Input size="large" value={this.state.crops} onChange={this.setCrops.bind(this)}/></div>
                                </div>
                                <div className='search-col'>
                                    <span className='label-title'>基地</span>
                                    <div className='search-input'><Input size="large" value={this.state.base} onChange={this.setBase.bind(this)}/></div>
                                </div>
                                <div className='search-col'>
                                    <span className='label-title'>状态</span>
                                    <Select className='farmingplan-status' value={statusIndex}
                                            onChange={this.setStatus.bind(this)}>
                                        {statusOptions}
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className='table-header'>
                        <p><i className='iconfont icon-sort'></i><span>农事计划列表</span></p>
                        {addRole &&
                        <p><Button><NavLink to={'/pages/plantingmgmt/farmingplan/create'}>新增农事计划</NavLink></Button></p>}
                    </div>
                    {queryRole &&
                    <Tables data={dataList} planCode={this.state.planCode} createUserName={this.state.createUserName}
                            crops={this.state.crops} status={this.state.status} base={this.state.base}
                            editRole={editRole} getRole={getRole} onSizeChangequery={this.onSizeChangequery.bind(this)}
                            onShowSizeChange={this.onShowSizeChange.bind(this)}
                            onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>}
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName, workPlanStatusAll} = state.farmingplanReducer;
    const {securityKeyWord} = state.initReducer;
    //const securityKeyWord = ['farmingplan_listByPage','farmingplan_add','farmingplan_update','farmingplan_getById'];
    return {
        dataList: Alldate,//展示列表的数据
        workPlanStatusList: workPlanStatusAll,//状态字典
        slideName, securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
