import {Component} from 'react';

import FirstStep from './firstStep.jsx';
import ThirdStep from './thirdStep.jsx';
import './../index.less';
import './add.less';

import {Steps} from 'antd';
import _ from "lodash";
import {action, IOModel} from "@/pages/masterdata/soultion/addmodel";
import connect from "react-redux/es/connect/connect";

const Step = Steps.Step;

class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            actionType: '',
            id: '',
            workSolution: {},
            workTasks: [],
            workPeriods: [],
            selectedRowIndex: ''
        };
    }

    componentWillMount() {
        const params = _.replace(this.props.location.pathname, '/pages/masterdata/soultion/one/', '');
        const id = params.split("/")[0];
        const actionType = params.split("/")[1];
        this.setState({
            actionType: actionType
        });
        // 清空数据
        this.props.setName('');
        this.props.setRecord({});
        this.props.setDuration('week');
        this.props.setCycleValue([]);
        this.props.onChooseTaskList([]);
        this.props.setCrop1('');
        this.props.setCrop2('');
        this.props.setCrop3('');
        if (actionType === 'modify' || actionType === 'detail') {
            IOModel.GetOne({id: id}).then((res) => {
                if (res.success && res.data) {
                    const newPeriodList = [];
                    const newCycleList = [];
                    const newTaskList = [];
                    if (res.data.workPeriods) {
                        const periodList = res.data.workPeriods;
                        if (periodList.length > 0) {
                            let type = 'day';
                            if (periodList[0].type === 1) {
                                type = 'week';
                            }
                            this.props.setDuration(type);
                            periodList.map((item) => {
                                const cycle = {
                                    liveId: item.liveId,
                                    liveName: item.name
                                };
                                const period = {
                                    id: item.id,
                                    liveId: item.liveId,
                                    liveName: item.name,
                                    name: item.name,
                                    type: item.type,
                                    duration: item.duration
                                };
                                newCycleList.push(cycle);
                                newPeriodList.push(period);
                            });
                            this.props.setCycleValue(newPeriodList);
                        }
                    }
                    if (res.data.workTasks) {
                        const taskList = res.data.workTasks;
                        if (taskList.length > 0) {
                            for (let i = 0; i < taskList.length; i++) {
                                let type = 'day';
                                if (taskList[i].delayType === 1) {
                                    type = 'week';
                                }
                                const materialList = [{id: -1, name: '无'}];
                                const operationList = [{id: '', name: '请选择'}];
                                if (taskList[i].materials && taskList[i].materials.length > 0) {
                                    for (let k = 0; k < taskList[i].materials.length; k++) {
                                        materialList.push({
                                            id: taskList[i].materials[k].id,
                                            name: taskList[i].materials[k].name,
                                            dosageUnitName: taskList[i].materials[k].dosageUnitName
                                        });
                                    }
                                }
                                if (taskList[i].operations && taskList[i].operations.length > 0) {
                                    for (let k = 0; k < taskList[i].operations.length; k++) {
                                        operationList.push({
                                            id: taskList[i].operations[k].id,
                                            name: taskList[i].operations[k].name
                                        });
                                    }
                                }
                                const task = {
                                    id: taskList[i].id,
                                    name: taskList[i].name,
                                    delayType: type,
                                    delay: taskList[i].periodDelay,
                                    duration: taskList[i].duration,
                                    operationType: 'update',
                                    code: taskList[i].typeCode,
                                    plannedQty: taskList[i].plannedQty,
                                    unitId: taskList[i].unitId,
                                    unitName: taskList[i].unitName,
                                    purpose: taskList[i].purpose,
                                    materialId: taskList[i].materialId,
                                    materialName: taskList[i].materialName,
                                    materialList: materialList,
                                    operationId: taskList[i].operationId,
                                    operationList: operationList,
                                    workTypeId: taskList[i].workTypeId,
                                    workTypeName: taskList[i].workTypeName,
                                    periodId: taskList[i].periodId,
                                    periodName: taskList[i].periodName,
                                    periodDelay: taskList[i].periodDelay,
                                    periodList: newCycleList
                                };
                                newTaskList.push(task);
                            }
                            this.props.onChooseTaskList(newTaskList);
                        }
                    }
                    this.props.setSolution(res.data);
                    this.setState({
                        id: id,
                        workSolution: res.data.workSolution,
                        workTasks: newTaskList,
                        workPeriods: newPeriodList
                    });
                    this.props.setName(res.data.workSolution.name);
                    const record = {
                        id: res.data.workSolution.id,
                        cropId: res.data.workSolution.cropId,
                        name: res.data.workSolution.cropName,
                        no: res.data.workSolution.cropNo
                    };
                    this.props.setRecord(record);
                }
            });
        }
    }

    setStep(data) {
        this.setState({
            step: data
        });
    }

    setIndex(index) {
        this.setState({
            selectedRowIndex: index
        });
    }

    jumpToList() {
        this.props.history.push('/pages/masterdata/soultion');
    }

    render() {
        return (
                <div className='farming-box solution-add-box'>
                    <div className='content'>
                        <div className="farming-step-layout">
                            <div className='farming-step'>
                                <Steps labelPlacement='vertical' current={this.state.step}>
                                    <Step title="方案配置"/>
                                    <Step title="生产方案"/>
                                </Steps>
                            </div>
                            <div className='step-content'>
                                <div className='title'>
                                    {this.state.step === 0 && <span>第一步：设置方案</span>}
                                    {this.state.step === 1 && <span>第二步：生产方案</span>}
                                </div>
                                {this.state.step === 0 && <FirstStep setType={this.state.actionType}
                                                                     setId={this.state.id}
                                                                     workSolution={this.state.workSolution}
                                                                     selectedRowIndex={this.state.selectedRowIndex}
                                                                     setIndex={this.setIndex.bind(this)}
                                                                     setStep={this.setStep.bind(this)}/>}

                                {this.state.step === 1 &&
                                <ThirdStep setType={this.state.actionType} setStep={this.setStep.bind(this)}
                                           setIndex={this.setIndex.bind(this)}
                                           jumpToList={this.jumpToList.bind(this)}/>}
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

//export default Page;

const mapstateProps = (state) => {
    const {breedList, modalflag, allCategory} = state.programAddReducer;
    return {
        allCategory,
        breedList,
        modalflag
    };
};
export default connect(mapstateProps, action)(Page);