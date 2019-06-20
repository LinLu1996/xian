import {Component} from 'react';
import {Input, Button, Icon, Radio, InputNumber, Tooltip, Select, message, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './addmodel';
import ModalEditForm from './modalEditForm.jsx';
import './../index.less';
import './add.less';
import Tables from './secondTable.jsx';
import {ProgramIOModel} from './model';
import {IOModel} from './addmodel';
import {IOModelOut} from './../crop/model';
import zhCN from 'antd/lib/locale-provider/zh_CN';

const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class FirstStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '', //方案名称
            cropName: '', //作物
            id: '',
            type: '',
            crop1: '',
            crop2: '',
            crop3: '',
            taskList: [],
            queryRole: false,
            selectedRowIndex: '',
            nameFlag: true
        };
        this.isActive = false;
        this.Task = {
            code: '', // 类型code
            workTypeId: '', //类型
            operationId: '', //操作
            materialId: -1, //农资
            purpose: '',  //用途
            plannedQty: 0,  //农资用量
            unitName: '', //单位
            delay: 0,   //时长
            delayType: 'day', //周期
            periodId: null,
            operationType: 'insert',  //操作类型
            operationList: [{id: '', name: '请选择'}], //农事操作列表
            materialList: [{id: -1, name: '无'}], //农资列表
            periodList: this.props.cycleList
        };
    }

    async componentDidMount() {
        /*if (this.props.cycleList === 0) {
            this.props.setName(this.props.solution.name);
        }*/
        await this.props.getFirstLevelCrop({companyId: 1});
        let allPeriod = [];
        await IOModelOut.AllPeriod({companyId: 1}).then((res) => {
            if (res.success) {
                allPeriod = res.data;
            }
        });
        await this.setState({
            allPeriod: allPeriod
        });
        // const {solutionData} = this.props;
        // if(solutionData && solutionData.workSolution) {
        //     this.setState({
        //         crop1: solutionData.workSolution.firstLevelCategoryId
        //     });
        // }
    }

    getData(nextprops) {
        if (nextprops.setType === 'modify' || nextprops.setType === 'detail') {
            this.setState({
                crop1: nextprops.workSolution.firstLevelCategoryId,
                crop2: nextprops.workSolution.secondLevelCategoryId,
                crop3: nextprops.workSolution.cropId
            });
            //this.handleCrop2(nextprops.workSolution.firstLevelCategoryId);
        }
    }

    componentWillReceiveProps(nextprops) {
        if (!this.isActive && nextprops.workSolution.id) {
            this.isActive = true;
            this.getData(nextprops);
        }
        if (nextprops.selectedRowIndex > -1) {
            this.setState({
                selectedRowIndex: nextprops.selectedRowIndex
            });
        }
        if (nextprops.record.id && nextprops.nextFlag) {
            this.setState({
                crop1: nextprops.record.categoryOne,
                crop2: nextprops.record.categoryId,
                crop3: nextprops.record.id
            });
            this.props.isNext(false);
        }
        this.Task.periodList = nextprops.cycleList;
    }

    setDuration(event) {
        const Duration = event.target.value;
        this.props.setDuration(Duration);
    }

    setName(event) {
        let name = '';
        if (event.target) {
            name = event.target.value;
        } else {
            name = event;
        }
        this.setState({
            name: name
        });
        this.props.setName(name);
    }

    /**
     * 选择品种
     */
    selectCrop() {
        this.props.modal({modalFlag: true});
    }

    /**
     * 数组删除一个
     * @param cycleList
     * @param i
     */
    deleteItem(cycleList, i) {
        cycleList.splice(i, 1);
        this.props.deleteCycle(cycleList);
        const list = this.props.taskList;
        list.forEach((item) => {
            item.periodList = this.Task.periodList;
            return item;
        });
        this.props.onChooseTaskList(list);
    }

    /**
     * 第二步操作
     * @param type
     * @param i
     * @param value
     * @param operationList
     * @param materialList
     */

    onChooseChange(type, i, value, operationList, materialList) {
        const {taskList} = this.props;
        taskList[i][type] = value;
        if (operationList !== undefined && materialList !== undefined) {
            taskList[i].operationList = operationList;
            taskList[i].materialList = materialList;
        }
        this.props.onChooseTaskList(taskList);
    }

    addTask() {
        const item = Object.assign({}, this.Task);
        const {taskList} = this.props;
        taskList.push(item);
        this.props.onChooseTaskList(taskList);
    }

    deleteRecord(index, record) {
        const {taskList, deleteList} = this.props;
        taskList.splice(index, 1);
        this.props.onChooseTaskList(taskList);
        if (record.operationType === 'update') {
            record.operationType = 'delete';
            deleteList.push(record);
            this.props.onDeleteList(deleteList);
        }
    }

    /**
     * 拷贝数据
     * @param index
     * @param record
     */
    copy(index, record) {
        const {taskList} = this.props;
        const vm = {
            delay: record.delay,
            delayType: record.delayType,
            id: "",
            materialId: record.materialId,
            materialList: record.materialList,
            operationId: record.operationId,
            operationList: record.operationList,
            operationType: "insert",
            plannedQty: record.plannedQty,
            purpose: record.purpose,
            unitName: record.unitName,
            workTypeId: record.workTypeId,
            code: record.code,
            periodList: this.props.cycleList
        };
        taskList.push(vm);
        this.props.onChooseTaskList(taskList);
    }

    /**
     * 修改值
     * @param cycleList
     * @param i
     */
    setCycleValue(cycleList, i, value) {
        cycleList[i].duration = value;
        this.props.setCycleValue(cycleList);
    }

    /**
     * 编辑周期
     */
    async editCycle() {
        //const row = this.props.crop||{};
        let periods = [];
        const periodList = [];
        const keyList = [];
        if (this.state.crop3) {
            await IOModelOut.getOne({':id': this.state.crop3}).then((res) => {
                periods = res.data.astCropPeriods;
            });
            if (periods) {
                for (let i = 0; i < periods.length; i++) {
                    const period = {};
                    period.id = periods[i].id;
                    period.liveId = periods[i].liveId;
                    period.liveName = periods[i].liveName;
                    period.type = 'update';
                    period.duration = 0;
                    period.sortNum = i + 1;
                    periodList.push(period);
                    keyList.push(periods[i].liveId);
                }
            }
            await this.props.cropPeriod(periodList);
            let cropName = '';
            this.props.functionaryList3.forEach((item) => {
                if (item.id === this.state.crop3) {
                    cropName = item.name;
                }
            });
            this.props.defaultFields({
                allPeriod: {
                    value: this.state.allPeriod || []  //this.props.allPeriod.data||
                },
                id: {
                    value: this.state.crop3
                },
                name: {
                    value: cropName
                },
                OKlist: this.props.oldPeriodList,
                keyList: keyList,
                deleteList: [],
                modeltype: {
                    value: 'modify'
                }
            });
            this.props.modal({modalFlag: true, modeltype: 'modify', editFlag: true});
            this.props.old({oldPeriod: this.props.cycleList});
        } else {
            message.warning("请先选择作物品种");
        }
    }

    setNextStep() {
        if (!this.props.name) {
            message.warning("请输入方案名称");
            return;
        }
        if (this.props.setType === 'add') {
            if (!this.props.crop1) {
                message.warning("请选择一级作物");
                return;
            }
            if (!this.props.crop2) {
                message.warning("请选择二级作物");
                return;
            }
            if (!this.props.crop3) {
                message.warning("请选择三级作物");
                return;
            }
        }
        if (!this.props.record.id) {
            message.warning("请选择作物品种");
            return;
        }
        if (this.props.cycleList.length <= 0) {
            message.warning("请选择生长周期");
            return;
        } else {
            for (let i = 0; i < this.props.cycleList.length; i++) {
                if (!this.props.cycleList[i].duration || this.props.cycleList[i].duration <= 0) {
                    message.warning(`请填写${this.props.cycleList[i].liveName}的周期时长`);
                    return;
                }
            }
        }
        if (this.props.taskList.length <= 0) {
            message.warning("请添加任务");
            return;
        } else {
            for (let i = 0; i < this.props.taskList.length; i++) {
                if (!this.props.taskList[i].workTypeId) {
                    message.warning(`请选择第${i + 1}个任务的农事类型`);
                    return;
                }
                if (!this.props.taskList[i].operationId) {
                    message.warning(`请选择第${i + 1}个任务的任务操作`);
                    return;
                }
                if (this.props.taskList[i].materialId < -1 && this.props.taskList[i].plannedQty > 0) {
                    message.warning(`请输入第${i + 1}个任务的农资`);
                    return;
                }
                if (this.props.taskList[i].materialId > -1 && this.props.taskList[i].plannedQty <= 0) {
                    message.warning(`请输入第${i + 1}个任务的农资用量`);
                    return;
                }
                if (!this.props.taskList[i].periodId) {
                    message.warning(`请选择第${i + 1}个任务的所属周期`);
                    return;
                }
                if (this.props.taskList[i].delay <= 0) {
                    message.warning(`请输入第${i + 1}个任务的执行日期`);
                    return;
                }
                let period = {};
                for (let j = 0; j < this.props.cycleList.length; j++) {
                    if (this.props.cycleList[j].liveId === this.props.taskList[i].periodId) {
                        period = this.props.cycleList[j];
                        break;
                    }
                }
                if (this.props.type === 'day') {
                    if (this.props.taskList[i].delayType === 'day') {
                        if (this.props.taskList[i].delay > period.duration) {
                            message.warning(`第${i + 1}个任务的执行日期已超出所属生长周期的周期时长`);
                            return;
                        }
                    } else {
                        if (this.props.taskList[i].delay * 7 > period.duration) {
                            message.warning(`第${i + 1}个任务的执行日期已超出所属生长周期的周期时长`);
                            return;
                        }
                    }
                } else {
                    if (this.props.taskList[i].delayType === 'day') {
                        if (this.props.taskList[i].delay > period.duration * 7) {
                            message.warning(`第${i + 1}个任务的执行日期已超出所属生长周期的周期时长`);
                            return;
                        }
                    } else {
                        if (this.props.taskList[i].delay > period.duration) {
                            message.warning(`第${i + 1}个任务的执行日期已超出所属生长周期的周期时长`);
                            return;
                        }
                    }
                }
            }
        }
        if (this.state.nameFlag) {
            if (this.props.setStep) {
                this.props.setStep(1);
            }
            this.props.setIndex(-1);
            this.props.isNext(true);
        } else {
            message.warning("方案名已存在");
        }
    }

    async handleCrop1(val) {
        await this.setState({
            crop1: val,
            crop2: '',
            crop3: ''
        });
        await this.props.setFunctionaryList2([]);
        await this.props.setFunctionaryList3([]);
        await this.props.setCrop1(val);
        await this.props.setCrop2('');
        await this.props.setCrop3('');
        //请求后台获取二级作物
        this.props.getSecondLevelCrop({parentId: val, companyId: 1});
    }

    async handleCrop2(val) {
        this.setState({
            crop2: val,
            crop3: ''
        });
        await this.props.setFunctionaryList3([]);
        await this.props.setCrop2(val);
        await this.props.setCrop3('');
        //请求后台获取三级作物
        this.props.getThirdLevelCrop({parentId: val, companyId: 1});
    }

    async handleCrop3(val) {
        this.setState({
            crop3: val
        });
        await this.props.setCrop3(val);
        const {functionaryList3} = this.props;
        const crop = functionaryList3.filter((item) => {
            return item.id === val;
        })[0];
        crop.categoryOne = this.state.crop1;
        this.props.setRecord(crop);
        //请求后台获取生长周期z
        const cycleList = [];
        await IOModel.listCycleData({':id': val}).then((res) => {
            if (res.success) {
                const list = res.data.astCropPeriods || [];
                if (list.length > 0) {
                    for (let i = 0; i < list.length; i++) {
                        list[i].duration = 0;
                        cycleList.push(list[i]);
                    }
                }
            }
        }).catch();
        await this.props.setCycleValue(cycleList);
        const list = this.props.taskList;
        list.forEach((item) => {
            item.periodList = cycleList;
            item.periodId = '';
            return item;
        });
        await this.props.onChooseTaskList(list);
    }

    render() {
        const {queryRole, selectedRowIndex} = this.state;
        const {name, type, cycleList, taskList, crop1, crop2, crop3, functionaryList1, functionaryList2, functionaryList3} = this.props;
        let actionType = 'add';
        let id = -1;
        /*let className = 'form-flex scroll-flex';
        if (cycleList && cycleList.length >= 7) {
            className = 'form-flex scroll-flex scroll-div';
        }*/
        if (this.props.setType === 'modify') {
            actionType = 'modify';
            id = this.props.setId;
        } else if (this.props.setType === 'detail') {
            actionType = 'detail';
            id = this.props.setId;
        }
        return (
                <div className='step-layout'>
                    <div className='form-layout'>
                        <div className='form-title'><i className='iconfont icon-jibenxinxi'></i>基本信息</div>
                        <div className='form-row crop-type clearfix'>
                            <div className='form-col solution-form-col'>
                                <span className='label-title solution-label-title'>方案名称</span>
                                {
                                    actionType === 'add' || actionType === 'modify' ?
                                            <Input className='solution-name-input' value={name}
                                                   onChange={this.setName.bind(this)} onBlur={() => {
                                                this.checkName(name, id);
                                            }}/> :
                                            <span>{name}</span>
                                }
                            </div>
                        </div>
                        <div className='form-row  crop-type clearfix'>
                            {
                                (actionType === 'detail' || actionType === 'modify') &&
                                <div className='form-col solution-form-col'>
                                    <span className='label-title solution-label-title'>作物品种</span>
                                    {this.props.workSolution.cropName &&
                                    <div className='form-view'>{this.props.workSolution.cropName}</div>}
                                </div>
                            }
                            {/*{actionType === 'add' && <Button className='form-btn' onClick={this.selectCrop.bind(this)}>选择作物</Button>}*/}
                            {
                                (actionType === 'add') &&
                                <div className='form-col solution-form-col'>
                                    <span className='label-title solution-label-title'>作物品种</span>
                                    <Select
                                            showSearch
                                            placeholder="请选择一级作物"
                                            optionFilterProp="children"
                                            value={crop1}
                                            onChange={this.handleCrop1.bind(this)}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {
                                            functionaryList1 && functionaryList1.map((item, index) => {
                                                return <Option key={index} value={item.id}>{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                    <Select placeholder="请选择二级作物" value={crop2}
                                            onChange={this.handleCrop2.bind(this)}>
                                        {
                                            functionaryList2 && functionaryList2.map((item, index) => {
                                                return <Option key={index} value={item.id}>{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                    <Select placeholder="请选择三级作物" value={crop3}
                                            onChange={this.handleCrop3.bind(this)}>
                                        {
                                            functionaryList3 && functionaryList3.map((item, index) => {
                                                return <Option key={index} value={item.id}>{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                </div>
                            }
                        </div>
                        <div className='form-title'><Icon type='calendar'/>成长周期</div>
                        <div className='form-row clearfix'>
                            <div className='form-label'>时间单位</div>
                            <div className='form-flex'>
                                <RadioGroup onChange={this.setDuration.bind(this)} defaultValue='week' value={type}>
                                    <RadioButton value='day'>天</RadioButton>
                                    <RadioButton value='week'>周</RadioButton>
                                </RadioGroup>
                            </div>
                            {actionType === 'add' && <div>
                                <Button className='form-btn' onClick={this.editCycle.bind(this)}>编辑周期</Button>
                            </div>}
                        </div>
                        <div className='form-row clearfix'>
                            <div className='form-label'>生长周期</div>
                        </div>
                        <div className='form-row clearfix'>
                            <div className='form-label'>周期时长
                                <div className='question-icon'>
                                    <Tooltip placement="right" title="请输入该周期最大时长"><Icon type="question-circle"
                                                                                        theme="filled"/></Tooltip>
                                </div>
                            </div>
                            <div className='form-flex scroll-flex scroll-div'>
                                <div className='form-table'>
                                    {cycleList.map((v, i) => (<div className='form-line' key={i}>
                                        <div className='form-item form-item-first'>
                                            <span className='name'>{v.liveName}</span>{actionType === 'add' &&
                                        <Icon type='close' onClick={this.deleteItem.bind(this, cycleList, i)}/>}
                                        </div>
                                        <div className='form-item'>
                                            {(this.props.setType === 'modify' || this.props.setType === 'add') ?
                                                    <InputNumber min={0} value={v.duration}
                                                                 onChange={this.setCycleValue.bind(this, cycleList, i)}/> :
                                                    <InputNumber value={v.duration} readOnly={true}/>}
                                        </div>
                                    </div>))}
                                </div>
                            </div>
                        </div>
                        <div className='form-title'><i className='iconfont icon-sort'></i>农事任务列表
                            {(this.props.setType === 'modify' || this.props.setType === 'add') &&
                            <Button className='form-btn add-task' onClick={this.addTask.bind(this)}>新增任务</Button>}
                        </div>
                        <LocaleProvider locale={zhCN}>
                            <Tables setType={this.props.setType} selectedRowIndex={selectedRowIndex}
                                    cycleList={cycleList}
                                    rowKey={record => record.id} data={taskList}
                                    onChooseChange={this.onChooseChange.bind(this)}
                                    deleteRecord={this.deleteRecord.bind(this)} copy={this.copy.bind(this)}/>
                        </LocaleProvider>
                    </div>
                    <div className='step-foot'>
                        <Button className='form-btn' onClick={this.setNextStep.bind(this)}>下一步</Button>
                    </div>
                    {/*   <ModalTable props={this.props}/>*/}
                    <ModalEditForm props={this.props} queryRole={queryRole}/>
                </div>
        );
    }

    checkName(name, id) {
        if (this.state.closure) {
            clearTimeout(this.state.closure);
        }
        this.setState({
            closure: setTimeout(() => {
                if (name) {
                    ProgramIOModel.CheckName({companyId: 1, name: name, id: id}).then((res) => {  //添加成功时的回
                        if (res.success) {
                            if (res.data === 0) {
                                this.setState({
                                    nameFlag: false
                                });
                                message.warning('方案名已存在');
                            } else if (res.data === -1) {
                                message.error('验证失败');
                            } else if (res.data > 0) {
                                this.setState({
                                    nameFlag: true
                                });
                            }
                        } else {
                            message.error('验证失败');
                        }
                    }).catch(() => {
                        message.error('验证失败');
                    });
                }
            }, 800)
        });
    }
}

const mapStateprops = (state) => {
    const {cycleList, oldPeriodList, record, name, type, crop1, crop2, crop3, functionaryList1, functionaryList2, functionaryList3, solutionData, taskList, deleteList} = state.programAddReducer;
    return {
        oldPeriodList,
        functionaryList1,
        functionaryList2,
        functionaryList3,
        crop1,
        crop2,
        crop3,
        solutionData,
        type: type,//周期时长
        name: name,
        record: record,
        cycleList: cycleList, //周期列表
        taskList,
        deleteList
    };
};
export default connect(mapStateprops, action)(FirstStep);
