import {Component} from 'react';
import {Button} from 'antd';
import {NavLink} from 'react-router-dom';
import Tables from './table.jsx';
import TableSetting from './tableSetting.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import '../../index.less';
import './index.less';
import Com from '@/component/common';


class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dates: '',
            queryFlag: false,
            chooseId: null,
            queryRole: false,
            queryHistoryRole: false,
            addRole: false,
            editRole: false,
            deleteRole: false
        };
    }

    handleTime() {
        const vWeek = ['周天', '周一', '周二', '周三', '周四', '周五', '周六'];
        const date = new Date();
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = month < 10? `0${month}` : month;
        let day = date.getDate();
        day = day < 10? `0${day}`: day;
        let hour = date.getHours();
        hour = hour <10 ?`0${hour}`:hour;
        let minute = date.getMinutes();
        minute = minute < 10 ? `0${minute}` : minute;
        let second = date.getSeconds();
        if(second < 10) {
            second = `0${second}`;
        }
        const vWeek_s = date.getDay();
        const week = vWeek[vWeek_s];
        let morning = '';
        if (hour <= 12) {
            morning = '上午';
        } else {
            morning = '下午';
        }
        const datess = `${year}-${month}-${day} ${week} ${morning} ${hour}:${minute}:${second}`;
        this.setState({
            dates: datess
        });
        setTimeout(this.handleTime.bind(this), 800);
        // return setTimeout(this.handleTime.bind(this),500);
    }

    componentDidMount() {
        this.props.Alldatas({startPage: 1, limit: 10, companyId: 1});//进入页面请求列表数据
        this.props.AlldatasS({startPage: 1, limit: 10, companyId: 1}); //进入页面请求列表数据
        this.handleTime();
        this.props.superiorName({name: '气象', parentLeftID: -1});
    }

    componentWillUnMount() {
        clearTimeout(this.handleTime.bind(this));
    }

    setFunctionary(event) {  //查找的表单-用户名称
        this.setState({
            functionary: event.target.value
        });
    }

    setOperationName(event) {  //查找的表单-基地名称
        this.setState({
            operationName: event.target.value
        });
    }

    setFarmingType(event) {  //查找的表单-基地名称
        this.setState({
            farmingType: event.target.value
        });
    }

    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            operationName: this.state.operationName,
            farmingType: this.state.farmingType,
            startPage: 1,
            limit: 10,
            companyId: 1
        };
        this.props.queryAll(vm);
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        const vm = {
            operationName: this.state.operationName,
            farmingType: this.state.farmingType,
            startPage: current,
            limit: size,
            companyId: 1
        };
        this.props.AlldatasS(vm);
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        const vm = {
            operationName: this.state.operationName,
            farmingType: this.state.farmingType,
            startPage: 1,
            limit: size,
            companyId: 1
        };
        this.props.AlldatasS(vm);
    }

    onSizeChangequerySetting(current, size) {  //点击筛选的分页按钮
        const vm = {
            operationName: this.state.operationName,
            farmingType: this.state.farmingType,
            startPage: current,
            limit: size,
            companyId: 1
        };
        this.props.queryAll(vm);
    }
    onShowSizeChangeSetting(current, size) {  //点击筛选的分页按钮
        const vm = {
            operationName: this.state.operationName,
            farmingType: this.state.farmingType,
            startPage: 1,
            limit: size,
            companyId: 1
        };
        this.props.queryAll(vm);
    }

    addmodel() {   //增加的按钮
        this.props.modal({modalFlag: true, modeltype: 'add'});
        this.props.defaultFields({
            operationName: {
                value: ''
            },
            id: {
                value: ''
            },
            name: {
                value: ''
            },
            crop_name: {
                value: ''
            },
            stauts: {
                value: ''
            },
            createName: {
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

    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'earlywarning_listByPage', 'show');
        const queryHistoryRole = Com.hasRole(securityKeyWord, 'earlywarning_history_listByPage', 'show');
        const addRole = Com.hasRole(securityKeyWord, 'earlywarning_add', 'insert');
        const editRole = Com.hasRole(securityKeyWord, 'earlywarning_update', 'update');
        const deleteRole = Com.hasRole(securityKeyWord, 'earlywarning_delete', 'delete');
        const {queryFlag, dates} = this.state;
        const {dataList, dataListS} = this.props;
        return (
            <div className='farming-box'>
                <div className='farming-search'>
                    <div className='farming-title'>
                        <div className='title'>气象预警</div>
                        <div className='warning-title-r'>{dates}</div>
                    </div>
                </div>
                <div className='content'>
                    <div className='early-warning-table'>
                        <div className='table-header'>
                            <p><i className='iconfont icon-yujing'></i><span>气象预警列表</span></p>
                        </div>
                        {queryHistoryRole && <Tables data={dataListS} onSizeChangequery={this.onSizeChangequery.bind(this)}
                                                     onShowSizeChange={this.onShowSizeChange.bind(this)}
                                onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>}
                    </div>
                    <div className='space'></div>
                    <div className='early-warning-table'>
                        <div className='table-header'>
                            <p><i className='iconfont icon-shezhi'></i><span>预警设置列表</span></p>
                            {addRole && <p><Button><NavLink to={'/pages/weather/earlywarning/add/-1/add'}>新增预警</NavLink></Button></p>}
                        </div>
                        {queryRole && <TableSetting data={dataList} onSizeChangequery={this.onSizeChangequerySetting.bind(this)} editRole={editRole} deleteRole={deleteRole}
                                                    onShowSizeChangeSetting={this.onShowSizeChangeSetting.bind(this)}
                                  onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, Alldata, slideName} = state.earlyWarningListReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['earlywarning_listByPage','earlywarning_history_listByPage','earlywarning_add','earlywarning_update','earlywarning_delete'];
    return {
        dataList: Alldate,//展示列表的数据
        dataListS: Alldata,//展示列表的数据
        slideName,securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
