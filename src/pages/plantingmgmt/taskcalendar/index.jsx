import {Component} from 'react';
import {Button, Calendar, Badge, Icon, Select, Modal, Form, InputNumber, DatePicker, message, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import moment from 'moment';
import '../../index.less';
import './index.less';
import ModalForm from './modalForm.jsx';
import Utils from "@/pages/plantingmgmt/farmingplan/util";
import Com from '@/component/common';
import {OperationIOModel} from "@/pages/masterdata/operations/model";
import {YieIOModel} from "@/pages/assetsmgmt/yieldanalysis/model";
import {ProgramAddIOModel} from "@/pages/masterdata/soultion/addmodel";
import {MaterialIOModel} from "@/pages/masterdata/material/model";
import zhCN from 'antd/lib/locale-provider/zh_CN';
const FormItem = Form.Item;

class Resources extends Component {
    constructor(props) {
        super(props);

        this.state = {
            materialFlag: false,
            baseId: -1,//基地ID
            landId: -1,//地块ID
            cropId: -1,//作物ID
            year: "",
            month: "",
            value: "",
            type: '',
            task: {},
            workTypeLists: [],
            operationLists: [],
            materialLists: [],
            landLists: [],
            isVisible: false,
            title: '',
            listData: [],
            startTime: "",//开始日期
            endTime: "",//结束日期
            workTypeList: {
                "watering": "success",
                "protection": "error",
                "fertilizer": "default",
                "gardening": "processing",
                "harvest": "warning"
            },
            queryRole: false,
            getRole: false,
            addRole: false,
            closure: false
        };
    }

    async componentDidMount() {
        this.props.getCompanyBase();
        this.props.getCompanyCrop();
        await this.tabToday();
        await this.initData();
        await this.query();
        // 获取所有农事类型
        await OperationIOModel.GetWorkType().then((res) => {
            const workList = [];
            const list = res.data;
            if (list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                    workList.push(list[i]);
                }
            }
            this.setState({
                workTypeLists: workList
            });
        }).catch();
    }

    //初始化
    initData() {
        //获取当月第一天和最后一天
        const firstdate = `${this.state.year}-${this.setTime(this.state.month)}-01`;//当月第一天
        const day = new Date(this.state.year, this.state.month, 0);
        const lastdate = `${this.state.year}-${this.setTime(this.state.month)}-${day.getDate()}`;//当月最后一天
        this.setState({
            startTime: firstdate,
            endTime: lastdate
        });
    }

    handleBase(value) {
        this.setState({
            baseId: value,
            landId: ''
        });
        const {baseList} = this.props;
        if (baseList && baseList.length > 0) {
            const bases = baseList.filter((item) => {
                return item.id === value;
            });
            if (bases && bases.length > 0) {
                this.setState({
                    base: bases[0]
                });
            }
        }
        if (value && value !== -1) {
            this.props.getBaseLand(value);
        }
        this.setState({
            landId: -1,
            cropId: -1
        });
        this.query();
    }

    setLand(event) {  //查找的表单-基地名称
        this.setState({
            landId: event
        });
        this.query();
    }

    setCrops(event) {  //查找的表单-基地名称
        this.setState({
            cropId: event
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
            const endTime = `${this.state.endTime} 23:59:59`;
            const param = {
                companyId: 1,
                userId: 1,
                baseId: this.state.baseId === -1 ? undefined : this.state.baseId,
                landId: this.state.landId === -1 ? undefined : this.state.landId,
                cropId: this.state.cropId === -1 ? undefined : this.state.cropId,
                startTime: moment(this.state.startTime).valueOf(),
                endTime: moment(endTime).valueOf()
            };
            this.setState({
                closure: setTimeout(() => {
                    const str = JSON.stringify(param);
                    IOModel.listByPagedata({str: str}).then((res) => {
                        this.setState({
                            listData: res.data
                        });
                    });
                }, 800)
            });
        });
    }

    getListData(value) {
        const keyDate = `${value.years()}${this.setTime(value.month() + 1)}${this.setTime(value.date())}`;
        const listData = this.state.listData[keyDate];
        // let listData;
        // if(itemData){

        // switch (value.date()) {
        //     case 8:
        //         listData = [
        //             {type: 'warning', content: '灌溉'},
        //             {type: 'success', content: '浇水'}
        //         ];
        //         break;
        //     case 10:
        //         listData = [
        //             {type: 'warning', content: '灌溉'},
        //             {type: 'success', content: '浇水'}
        //         ];
        //         break;
        //     case 15:
        //         listData = [
        //             {type: 'warning', content: '灌溉'},
        //             {type: 'success', content: '浇水'}
        //         ];
        //         break;
        //     default:
        // }
        return listData || [];
        // }

    }

    //每一日期渲染
    dateFullCellRender(value) {
        //根据日期获取相应数据
        const listData = this.getListData(value);
        const today = value.date();
        // const month=value.month();
        let weatherClass = "weather";

        let antFullCalendarClass = "ant-fullcalendar-date";
        if (listData && listData.length > 0) {
            antFullCalendarClass = `ant-fullcalendar-date full-calendar-active`;
        }
        const taskList = listData.filter((item) => {
            return item.maxTemperature === undefined || item.maxTemperature === null || item.maxTemperature === '';
        });
        const weaList = listData.filter((item) => {
            return item.maxTemperature !== undefined && item.maxTemperature !== null && item.maxTemperature !== '';
        });
        //天气处理
        const weather = "sun";
        switch (weather) {
            case "sun":
                weatherClass = `weather weather-sun`;
                break;
        }
        // const wea = listData[listData.length - 1];
        const {securityKeyWord} = this.props;
        const getRole = Com.hasRole(securityKeyWord, 'taskcalendar_getById', 'show');
        return (
            <div className={antFullCalendarClass}>
                <div className="ant-fullcalendar-value">
                    <div className="today">{today}</div>
                    {(weaList && weaList.length > 0) ? ((weaList[0].descriptionDay && weaList[0].descriptionNight) ?
                        <div className={weatherClass}>
                            <span className="weather-icon-sm"><Icon type="cloud"/></span>
                            <div className="weather-layout">
                                {weaList[0].descriptionDay !== weaList[0].descriptionNight ? `${weaList[0].descriptionDay}转${weaList[0].descriptionNight}` : `${weaList[0].descriptionDay}`}
                                {/*<div className='weather-icon'><Icon type="cloud"/></div>*/}
                                {/*<div className='weather-new'>25<span>℃</span></div>*/}
                                {weaList[0].minTemperature && weaList[0].maxTemperature && <div
                                    className='weather-range'>{`${weaList[0].minTemperature}℃-${weaList[0].maxTemperature}℃`}</div>}
                            </div>
                        </div> : <div></div>) : <div></div>}
                </div>
                {getRole ? <div className="ant-fullcalendar-content">
                    <ul className="events">
                        {
                            taskList.map(item => (
                                <li key={item.id} onClick={this.queryInfo.bind(this, item.id, item.workTypeId)}>
                                    <Badge status={this.state.workTypeList[item.workTypeCode]} text={item.name}/>
                                </li>
                            ))
                        }
                    </ul>
                </div> : <div className="ant-fullcalendar-content">
                    <ul className="events">
                        {
                            listData.map(item => (
                                <li key={item.id}>
                                    <Badge status={this.state.workTypeList[item.workTypeCode]} text={item.name}/>
                                </li>
                            ))
                        }
                    </ul>
                </div>}
            </div>
        );
    }

    async queryInfo(id, typeId) {
        await this.props.getOne({'taskId': id, 'workTypeId': typeId, 'userId': 1});
        const data = this.props.detailData;
        this.props.defaultFields({
            id: {
                value: data.id
            },
            planNo: {
                value: data.planNo
            },
            cropId: {
                value: data.cropId
            },
            cropName: {
                value: data.cropName
            },
            baseId: {
                value: data.baseId
            },
            planId: {
                value: data.planId
            },
            baseName: {
                value: data.baseName
            },
            landName: {
                value: data.landName
            },
            name: {
                value: data.name
            },
            planTime: {
                value: data.planTime
            },
            planQty: {
                value: data.planQty
            },
            unit: {
                value: data.unit
            },
            dosageUnit: {
                value: data.dosageUnit
            },
            actualQty: {
                value: data.actualQty
            },
            materialName: {
                value: data.materialName
            },
            recoveryQty: {
                value: data.recoveryQty
            },
            workTypeCode: {
                value: data.workTypeCode
            },
            employeeId: {
                value: data.employeeId
            },
            supervisor: {
                value: data.supervisor
            },
            modeltype: {
                value: 'modify'
            },
            taskStatus: {
                value: this.props.status
            }
        });
        this.props.modal({modalflagDetails: true, modeltype: 'detail'});

    }

    setTime(number) {
        if (number < 10) {
            return `0${number}`;
        } else {
            return number;
        }
    }

    /**
     * 修改月份
     * @param type  向前还是向后
     */
    async onSelectMonth(type) {
        const _this = this;
        let {year, month, value} = _this.state;
        switch (type) {
            case "pro":
                if (month === 1) {
                    year = year - 1;
                    month = 12;
                } else {
                    month = month - 1;
                }
                break;
            case "next":
                if (month === 12) {
                    year = year + 1;
                    month = 1;
                } else {
                    month = month + 1;
                }
                break;
        }
        value = `${year}-${this.setTime(month)}-01`;
        //同步获取当月数据
        // await this.getListData();
        _this.setState({
            year: year,
            month: month,
            value: moment(value)
        });
        const day = new Date(year, month, 0);
        const lastdate = `${year}-${this.setTime(month)}-${this.setTime(day.getDate())}`;//当月最后一天
        await _this.setState({
            startTime: value,
            endTime: lastdate
        });
        await this.query();
    }

    async tabToday(type) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const today = date.getDate();
        //同步获取当月任务列表数据
        // await this.query();
        this.setState({
            year: year,
            month: month,
            value: moment(`${year}-${this.setTime(month)}-${this.setTime(today)}`)
        });
        this.changeValue('plannedTime', moment(`${year}-${this.setTime(month)}-${this.setTime(today)}`));
        if (type === 'create') {
            this.setState({
                type: type,
                isVisible: true,
                title: '新增任务'
            });
        } else {
            const value = `${year}-${this.setTime(month)}-01`;
            //同步获取当月数据
            const day = new Date(year, month, 0);
            const lastdate = `${year}-${this.setTime(month)}-${this.setTime(day.getDate())}`;//当月最后一天
            await this.setState({
                startTime: value,
                endTime: lastdate
            });
            await this.query();
        }
    }

    hideModal() {
        const task = this.state.task;
        const materialName = task.materialName;
        const dosageUnitName = task.dosageUnitName;
        const plannedQty = task.plannedQty;
        if (!task.workTypeId) {
            message.warning('请选择任务类型');
            return;
        }
        if (!task.operationId) {
            message.warning('请选择任务');
            return;
        }
        if (!task.materialId) {
            message.warning('请选择计划使用农资');
            return;
        }
        if (!task.baseId) {
            message.warning('请选择基地');
            return;
        }
        if (!task.landId) {
            message.warning('请选择地块');
            return;
        }
        if (!task.plannedTime) {
            message.warning('请选择计划执行时间');
            return;
        }
        if (!this.state.materialFlag && !task.plannedQty) {
            message.warning('请输入计划用量');
            return;
        }
        task.plannedTime = new Date(task.plannedTime).getTime();
        if (task.materialId === "-1") {
            task.materialName = '---';
            task.unitName = '---';
            task.plannedQty = 0;
        }
        const str = JSON.stringify(task);
        IOModel.createTask({str: str}).then((res) => {
            if (res.success && res.data > 0) {
                message.success('保存成功');
                this.query();
            } else {
                message.error('保存失败');
            }
        }).catch((res) => {
            message.error(res.message);
        });
        task.materialName = materialName;
        task.unitName = dosageUnitName;
        task.plannedQty = plannedQty;
        this.setState({
            isVisible: false,
            task: {}
        });
    }

    hideCancel() {
        this.setState({
            isVisible: false,
            task: {}
        });
    }

    handleFormChange(changedFields) {
        const fields = this.props.fields;
        this.props.defaultFields({...fields, ...changedFields});
    }

    async changeValue(type, vm) {
        const {task, workTypeLists, materialLists, operationLists} = this.state;
        if (type === 'plannedTime') {
            task['plannedTime'] = moment(vm).format('YYYY-MM-DD');
        } else {
            task[type] = vm;
        }
        if (type === 'workTypeId') {
            task['operationId'] = '';
            task['name'] = '';
            task['materialId'] = '';
            task['materialName'] = '';
            workTypeLists.forEach((item) => {
                if (item.id === vm) {
                    task['code'] = item.code;
                    task['workTypeName'] = item.name;
                }
            });
            this.setState({
                materialLists: [],
                operationLists: []
            });
            ProgramAddIOModel.getWorkSolution({workTypeId: vm}).then((res) => {
                if (res.success && res.data) {
                    this.setState({
                        materialLists: res.data.materials,
                        operationLists: res.data.operations
                    });
                }
            }).catch();
        } else if (type === 'baseId') {
            task['landId'] = '';
            await this.setState({
                landLists: []
            });
            YieIOModel.GetLandsByBaseIdAndPlan({':baseId': vm}).then((res) => {
                if (res.success && res.data) {
                    this.setState({
                        landLists: res.data
                    });
                }
            }).catch();
        } else if (type === 'materialId') {
            if (vm === '-1') {
                await this.setState({
                    materialFlag: true
                });
            } else {
                await this.setState({
                    materialFlag: false
                });
            }
            if (task.code === 'protection') {
                MaterialIOModel.GetOne({id: vm}).then((res) => {
                    if (res.success && res.data) {
                        task['purpose'] = res.data.purpose;
                        task['containment'] = res.data.containment;
                    }
                }).catch();
            }
            materialLists.forEach((item) => {
                if (item.id === vm) {
                    task['materialName'] = item.name;
                    task['unitName'] = item.dosageUnitName;
                }
            });
        } else if (type === 'operationId') {
            operationLists.forEach((item) => {
                if (item.id === vm) {
                    task['name'] = item.name;
                }
            });
        } else if (type === 'landId') {
            this.state.landLists.forEach((item) => {
                if (item.id === vm) {
                    task['supervisor'] = item.userName;
                    task['employeeId'] = item.userId;
                }
            });
        }
        this.setState({
            task: task
        });
    }

    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'taskcalendar_listByPage', 'show');
        const addRole = Com.hasRole(securityKeyWord, 'taskcalendar_add', 'insert');
        const {value, year, month, task} = this.state;
        // const {Alldate} = this.props;
        const {baseList, cropList, landList} = this.props;
        const newBaseList = [];
        const newLandList = [];
        const newCropList = [];
        newBaseList.push({id: -1, name: '全部'});
        baseList.forEach((item) => {
            newBaseList.push(item);
        });
        newLandList.push({id: -1, name: '全部'});
        landList.forEach((item) => {
            newLandList.push(item);
        });
        newCropList.push({id: -1, name: '全部'});
        cropList.forEach((item) => {
            newCropList.push(item);
        });
        //const landOptions = Utils.getOptionList(landList);
        const baseOptions = Utils.getOptionList(baseList);
        //const cropsOptions = Utils.getOptionList(cropList);
        const newLandOptions = Utils.getOptionList(newLandList);
        const newBaseOptions = Utils.getOptionList(newBaseList);
        const newCropsOptions = Utils.getOptionList(newCropList);
        const workTypeOptions = Utils.getOptionList(this.state.workTypeLists);
        const operationOptions = Utils.getOptionList(this.state.operationLists);
        const materialOptions = Utils.getOptionList(this.state.materialLists);
        const _landOptions = Utils.getOptionList(this.state.landLists);
        return (
            <div className='farming-box taskcalendar-box'>
                <div className='farming-search'>
                    <div className='farming-title farming-big-title'>
                        <div className='search-layout'>
                            <div className='search-row'>
                                <div className='search-col'>
                                    <span className='label-title'>基地</span>
                                    <Select value={this.state.baseId} onChange={this.handleBase.bind(this)}
                                            showSearch
                                            placeholder="请选择基地"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {newBaseOptions}
                                    </Select>
                                </div>
                                <div className='search-col'>
                                    <span className='label-title'>地块</span>
                                    <Select value={this.state.landId} onChange={this.setLand.bind(this)}
                                            showSearch
                                            placeholder="请选择地块"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {newLandOptions}
                                    </Select>
                                </div>
                                <div className='search-col'>
                                    <span className='label-title'>作物</span>
                                    <Select value={this.state.cropId} onChange={this.setCrops.bind(this)}
                                            showSearch
                                            placeholder="请选择作物"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {newCropsOptions}
                                    </Select>
                                    {/*<Button type="primary" onClick={() => {
                                        this.query();
                                    }}>查询</Button>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='content' style={{minHeight: 'calc(100% - 166px'}}>
                    <div className='task-calendar-layout'>
                        <div className="task-calendar-right">
                            <div className='calendar-header'>
                                <div className="left-btn"><Button type="primary"
                                                                  onClick={this.tabToday.bind(this)}>今天</Button></div>
                                <div className='calendar-header-center'>
                                    <a className='left-jiantou' onClick={this.onSelectMonth.bind(this, "pro")}><i className='iconfont icon-jiantou-copy-copy'></i></a>
                                    <span className='calendar-value'>{year}年{month}月</span>
                                    <a onClick={this.onSelectMonth.bind(this, "next")}><i className='iconfont icon-jiantou-copy-copy'></i></a>
                                </div>
                                <div className="right-btn">
                                    {addRole && <Button type="primary"
                                                        onClick={this.tabToday.bind(this, 'create')}>新增任务 <Icon
                                        type="plus-circle-o"/>
                                    </Button>}
                                </div>
                            </div>
                            {value && queryRole &&
                            <div><Calendar value={value} dateFullCellRender={this.dateFullCellRender.bind(this)}/>
                                <ModalForm props={this.props}/></div>
                            }
                        </div>
                    </div>
                </div>

                <Modal title={this.state.title} visible={this.state.isVisible} okText="确认"
                       cancelText="取消" width={600} wrapClassName='farming-admin-modal'
                       onOk={this.hideModal.bind(this)}
                       onCancel={this.hideCancel.bind(this)}
                       destroyOnClose={true}
                >
                    <Form layout="inline">
                        <FormItem label="任务类型">
                            <Select required={true} style={{width: 300}} value={task.workTypeId}
                                    onChange={this.changeValue.bind(this, 'workTypeId')}>
                                {workTypeOptions}
                            </Select>
                        </FormItem>
                        <FormItem label="任务">
                            <Select style={{width: 300}} value={task.operationId}
                                    onChange={this.changeValue.bind(this, 'operationId')}>
                                {operationOptions}
                            </Select>
                        </FormItem>
                        <FormItem label="计划使用农资">
                            <Select style={{width: 300}} value={task.materialId}
                                    onChange={this.changeValue.bind(this, 'materialId')}>
                                <Option value="-1">无</Option>
                                {materialOptions}
                            </Select>
                        </FormItem>
                        <FormItem label="基地">
                            <Select style={{width: 300}} value={task.baseId}
                                    onChange={this.changeValue.bind(this, 'baseId')}>
                                {baseOptions}
                            </Select>
                        </FormItem>
                        <FormItem label="地块">
                            <Select style={{width: 300}} value={task.landId}
                                    onChange={this.changeValue.bind(this, 'landId')}>
                                {_landOptions}
                            </Select>
                        </FormItem>
                        <FormItem label="计划执行时间">
                            <LocaleProvider locale={zhCN}>
                                <DatePicker defaultValue={moment(task.plannedTime)}
                                            onChange={this.changeValue.bind(this, 'plannedTime')}/>
                            </LocaleProvider>
                        </FormItem>
                        <FormItem label="计划用量">
                            <InputNumber style={{width: 300}} value={task.plannedQty} disabled={this.state.materialFlag}
                                         onChange={this.changeValue.bind(this, 'plannedQty')}/>{task.unitName}
                        </FormItem>
                        {task.code === 'protection' && <FormItem label="抑制期（天）">
                            <span>{task.containment}</span>
                        </FormItem>}
                        {task.code === 'protection' && <FormItem label="农资用途">
                            <span>{task.purpose}</span>
                        </FormItem>}
                        <FormItem label="负责人">
                            <span>{task.supervisor}</span>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldata, slideName, baseList, cropList, landList, detailData} = state.taskCalendarReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['taskcalendar_listByPage', 'taskcalendar_getById', 'taskcalendar_add'];
    return {
        Alldata,
        slideName,
        baseList,
        cropList,
        landList,
        detailData, securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
