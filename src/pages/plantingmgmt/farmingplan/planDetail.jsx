import {Component} from 'react';
import {Button, Modal, Table, Input, Carousel, Card, DatePicker, Form, InputNumber, Select, message, Tooltip, LocaleProvider} from 'antd';
// import Utils from './util';
// import ETable from './table.jsx';
import '../../index.less';
import './index.less';
import _ from "lodash";
import connect from "react-redux/es/connect/connect";
import {action, IOModel} from "@/pages/plantingmgmt/farmingplan/model";
import moment from "moment";
import Utils from "@/pages/plantingmgmt/farmingplan/util";
const confirm = Modal.confirm;
import zhCN from 'antd/lib/locale-provider/zh_CN';
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

// modal编辑创建查看处理
class TaskFrom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            materialFlag:true,
            astMaterialList: [],
            workOperationList: [],
            userList: [],
            material:{},
            materialIndex: '',
            operation:{},
            operationIndex: '',
            user: {},
            land: {}
        };
    }
    getState(state, type) {
        switch (type) {
            case 'land':
                return {
                    '1': '1号大棚',
                    '2': '2号大棚',
                    '3': '3号大棚',
                    '4': '4号大棚',
                    '5': '5号大棚'
                }[state];
            case 'task':
                return {
                    '1': '松土',
                    '2': '打药'
                }[state];
            case 'taskType':
                return {
                    '1': '园艺',
                    '2': '植保'
                }[state];
            case 'period':
                return {
                    '1': '膨果期',
                    '2': '伸蔓期'
                }[state];
            case 'status':
                return {
                    '1': '已完成',
                    '2': '超时',
                    '3': '待执行'
                }[state];
        }
    }

    handleWorkTypeChange(value) {
        this.props.form.setFieldsValue({
            operationId: '',
            materialId: ''
        });
        this.setState({
            astMaterialList: [],
            workOperationList: [],
            userList: [],
            material: {}
        });
        if(value !== null && value !== '' ) {
            //根据农事类型获取农资和农事操作
            IOModel.getOptAndMatByType({workTypeId: value}).then((res) => {
                if(res.success) {
                    if(res.data && res.data.materials) {
                        this.setState({
                            astMaterialList: res.data.materials
                        });
                    }
                    if(res.data && res.data.operations) {
                        this.setState({
                            workOperationList: res.data.operations
                        });
                    }
                }
            }).catch();
        }
    }

    // handleLandChange(value) {
    //     if(value !== null && value !== '') {
    //         if(this.props.landList) {
    //             const land = this.props.landList.filter((item) => {
    //                 return value === item.id;
    //             });
    //             this.setState({
    //                 land: land
    //             });
    //         }
    //     }
    // }

    handleMaterialChange(value) {
        if(value !== null && value !== '' && value !== '-1') {
            if(this.state.astMaterialList) {
                const materialList = this.state.astMaterialList.filter((item) => {
                   return item.id === value;
                });
                if(materialList) {
                    const material = materialList[0];
                    this.setState({
                        material: material,
                        materialFlag: true
                    });
                    this.props.material(material);
                }
            }
        } else {
            this.setState({
                material:{},
                materialFlag: false
            });
          this.props.material({});
        }
    }

    handleUserChange(value) {
        if(value !== null && value !== '') {
            if(this.props.userList) {
                const userList = this.props.userList.filter((item) => {
                    return item.id === value;
                });
                if(userList) {
                    const user = userList[0];
                    this.setState({
                        user: user
                    });
                    this.props.user(user);
                }
            }
        }
    }
    handleOperation(value) {
        if(value !== null && value !== '') {
            if(this.state.workOperationList) {
                const operationList = this.state.workOperationList.filter((item) => {
                    return item.id === value;
                });
                if(operationList) {
                    const operation = operationList[0];
                    this.setState({
                        operation: operation
                    });
                    this.props.operation(operation);
                }
            }
        }
    }

    render() {
        const type = this.props.type;
        let palnInfo = this.props.palnInfo || {};
        if (type === 'create') palnInfo = {};
        const reasonLabel = type === 'edit' ? '修改原因' : '';
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
        const workTypeOptions = Utils.getOptionList(this.props.workTypeList);
        const materialList = Utils.getOptionList(this.state.astMaterialList);
        const workOperationList = Utils.getOptionList(this.state.workOperationList);
        const landList = Utils.getOptionList(this.props.landList);
        const userList = Utils.getOptionList(this.props.userList);
        const material = this.state.material;
        if(material && material.dosageUnitName) {
            palnInfo.unitName = material.dosageUnitName;
        }
        //const land = this.state.land;
        return (
            <Form layout="inline" className='ant-form'>
                <FormItem label="任务类型" {...formItemLayout}>
                    {
                        (type === 'detail' || type === 'edit') ? palnInfo.workTypeName :
                            getFieldDecorator('workTypeName', {
                                initialValue: ''
                            })(
                                <Select onChange={this.handleWorkTypeChange.bind(this)}>
                                    {workTypeOptions}
                                </Select>
                            )
                    }
                </FormItem>
                <FormItem label="任务" {...formItemLayout}>
                    {
                        (type === 'detail' || type === 'edit') ? palnInfo.name :
                            getFieldDecorator('operationId', {
                                initialValue: ''
                            })(
                                <Select onChange={this.handleOperation.bind(this)}>
                                    {workOperationList}
                                </Select>
                            )
                    }
                </FormItem>

                <FormItem label="地块" {...formItemLayout}>
                    {
                        (type === 'detail' || type === 'edit') ? palnInfo.landName :
                            getFieldDecorator('landName', {
                                initialValue: ''
                            })(
                                <Select>
                                    {landList}
                                </Select>
                            )
                    }
                </FormItem>
                {type !== 'create' ?
                    <FormItem label="生长周期" {...formItemLayout}>
                        {
                            (type === 'detail' || type === 'edit') ? palnInfo.periodName :
                                getFieldDecorator('periodName', {
                                    initialValue: palnInfo.periodName
                                })(
                                    <Select>
                                        <Option value={1}>膨果期</Option>
                                        <Option value={2}>伸蔓期</Option>
                                    </Select>
                                )
                        }
                    </FormItem> : ''
                }
                <FormItem label="计划使用农资" {...formItemLayout}>
                    {
                        (type === 'detail' || type === 'edit') ? ((palnInfo.materialId && palnInfo.materialId !== -1) ? palnInfo.materialName : '无') :
                            getFieldDecorator('materialId', {
                                initialValue: palnInfo.materialId
                            })(
                                <Select onChange={this.handleMaterialChange.bind(this)}>
                                    <Option value="-1">无</Option>
                                    {materialList}
                                </Select>
                            )
                    }
                </FormItem>
                <FormItem label="计划执行时间" {...formItemLayout}>
                    {
                        type === 'detail' ? moment(palnInfo.plannedTime).format('YYYY-MM-DD') :
                            getFieldDecorator('plannedTime', {
                                initialValue: moment(palnInfo.plannedTime)
                            })(<LocaleProvider locale={zhCN}>
                                <DatePicker defaultValue={moment(palnInfo.plannedTime)} onChange={(e) => {this.props.setPlanTime(e);}}/>
                                </LocaleProvider>
                            )
                    }
                </FormItem>


                <FormItem label="计划用量" {...formItemLayout}>
                    {
                            (type === 'detail' ? ((palnInfo.materialId && palnInfo.materialId !== -1) ? palnInfo.plannedQty : '无') :
                                ((type !== 'create' && (!palnInfo.materialId || palnInfo.materialId === -1)) ? '无' : getFieldDecorator('plannedQty', {
                                initialValue: palnInfo.plannedQty
                            })(
                                <div><InputNumber min={0} disabled={!this.state.materialFlag} defaultValue={palnInfo.plannedQty} onBlur={(e) => {this.props.setPlanQTY(e);}}/>
                                     <span style={{marginLeft: '5px'}}>{palnInfo.unitName}</span>
                                </div>
                            )))
                    }
                </FormItem>
                {type === 'create' ? <FormItem label="抑制期（天）" {...formItemLayout}>
                    {
                        // (type === 'detail' || type === 'edit') ? palnInfo.containment :
                        //                         //     getFieldDecorator('containment', {
                        //                         //         initialValue: palnInfo.containment
                        //                         //     })(
                        //                         //         <InputNumber min={1} max={30}/>
                        //                         //     )
                        (type === 'detail' || type === 'edit') ? palnInfo.containment :
                                material.containment
                    }
                </FormItem> : ''
                }
                {type === 'create' ? <FormItem label="农资用途" {...formItemLayout}>
                    {
                        // type === 'detail' ? palnInfo.purpose :
                        //     getFieldDecorator('purpose', {
                        //         initialValue: palnInfo.purpose
                        //     })(
                        //         <Input type="text" placeholder="请输入"/>
                        //     )
                        type === 'detail' ? palnInfo.purpose :
                            material.purpose
                    }
                </FormItem> : ''}

                <FormItem label="负责人" {...formItemLayout}>
                    {
                        type === 'detail' ? palnInfo.supervisor :
                            getFieldDecorator('supervisor', {
                                initialValue: palnInfo.userId
                            })(
                                <Select onChange={this.handleUserChange.bind(this)}>
                                    {userList}
                                </Select>
                            )
                    }
                </FormItem>

                <FormItem label={reasonLabel}>
                    {
                        type !== 'edit' ? '' :
                            getFieldDecorator('remark', {
                                initialValue: palnInfo.remark
                            })(
                                <TextArea className='modal-area' rows={4} placeholder="请输入修改原因"/>
                            )
                    }
                </FormItem>
            </Form>
        );
    }
}
const TaskFromNew = Form.create({})(TaskFrom);

// 顶部详情展示

// 计划详情表格展示
class PlanDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailList: null,
            delIsVisible: false,//删除框
            reqIsVisible: false,//用工请求
            reason: null,
            confirmDate: null,
            taskInfo:{},
            detailData: {},
            pageType: '',
            material: {},
            operation: {},
            user: {},
            personQty: null,
            userList: [],
            planStatus: '',
            plannedQty:0,
            plannedTime: null,
            userId:null
        };
    }

    setPlanQTY(e) {
        this.setState({
            plannedQty:e.target.value
        });
    }

    setPlanTime(date) {
        const time = moment(date).format('YYYY-MM-DD');
        const longtime = moment(time).valueOf();
        this.setState({
            plannedTime: longtime
        });
    }

    componentDidMount() {
        const params =  _.replace(this.props.location.pathname, '/pages/plantingmgmt/farmingplan/detail/', '');
        const id = params.split("/")[0];
        this.planId = id;
        this.setState({
            pageType: params.split("/")[1]
        });
        //获取详情
        // this.props.AllDicPull();
        //this.props.QueryByPlanId({'id': id, 'companyId': 1}); //根据创建的农事方案id查数据
        const userList = [];
        IOModel.GetPlanDetail({'id': id, 'companyId': 1}).then((res) => {
            if(res.success) {
                const ast = res.data.astLands;
                if (ast && ast.length > 0) {
                    // 排重
                    for (let i = 0; i < ast.length; i++) {
                        let bool = false;
                        if (userList && userList.length > 0) {
                            for (let k = 0; k < userList.length; k++) {
                                if (userList[k].id === ast[i].userId) {
                                    bool = true;
                                }
                            }
                        }
                        if (!bool) {
                            const user = {};
                            user.id = ast[i].userId;
                            user.name = ast[i].code;
                            userList.push(user);
                        }
                    }
                    this.setState({
                        userList: userList
                    });
                }
                const detailInfo = res.data || {};
                this.detailData = detailInfo;
                this.setState({
                    detailData: detailInfo
                });
                if(detailInfo && detailInfo.workPlan) {
                    if(detailInfo.workPlan.plantingDate) {
                        this.setState({
                            confirmDate: moment(detailInfo.workPlan.plantingDate)
                        });
                    }
                    if(detailInfo.workPlan.workplanStatusCode) {
                        this.setState({
                            planStatus: detailInfo.workPlan.workplanStatusCode
                        });
                    }else {
                        this.setState({
                            planStatus: ''
                        });
                    }
                }
            }
        }).catch((res) => {
          Modal.error({
            title: '提示',
            content:res.message
          });
            //message.error("获取种植计划信息失败");
        });
        //获取农事类型
        this.props.AllWorkTypeQuery();
        this.props.superiorName({name: '农事计划详情', parentLeftID: -1});
    }

    refresh(type) {
        this.setState({
            pageType: type
        });
        //获取详情
        // this.props.AllDicPull();
        //this.props.QueryByPlanId({'id': id, 'companyId': 1}); //根据创建的农事方案id查数据
        IOModel.GetPlanDetail({'id': this.planId, 'companyId': 1}).then((res) => {
            if(res.success) {
                const detailInfo = res.data || {};
                this.detailData = detailInfo;
                this.setState({
                    detailData: detailInfo
                });
                if(detailInfo && detailInfo.workPlan) {
                    if(detailInfo.workPlan.plantingDate) {
                        this.setState({
                            confirmDate: moment(detailInfo.workPlan.plantingDate)
                        });
                    }
                    if(detailInfo.workPlan.workplanStatusCode) {
                        this.setState({
                            planStatus: detailInfo.workPlan.workplanStatusCode
                        });
                    }else {
                        this.setState({
                            planStatus: ''
                        });
                    }
                }
            }
        }).catch((res) => {
          Modal.error({
            title: '提示',
            content:res.message
          });
            //message.error("获取种植计划信息失败");
        });
    }

    //创建临时任务
    hanleOperateCreate() {
        this.hanleOperate('create');
    }

    // 功能区操作
    hanleOperate(type, row, record) {
        const item = record; //当前行
        if (type === 'create') {
            this.setState({
                type,
                isVisible: true,
                title: '新增临时任务',
                plannedTime: moment(new Date(), 'YYYY-MM-DD')
            });
        } else if (type === 'edit') {
            this.setState({
                type,
                isVisible: true,
                title: '任务调整',
                taskInfo: item,
                plannedTime: item.plannedTime,
                plannedQty: item.plannedQty
            });
        } else if (type === 'del') {
            this.setState({
                type,
                delIsVisible: true,
                title: '删除任务',
                taskInfo: item,
                reason: ''
            });
        } else if (type === 'req') {
            this.setState({
                type,
                reqIsVisible: true,
                title: '发起用工请求',
                taskInfo: item,
                personQty: null,
                userId: record.userId
            });
        } else if (type === 'pic') {
            // find photo by item.id
            IOModel.GetPhotoList({id:item.id,userId: 1,companyId: 1}).then((res) => {  //查询成功时的回调
                if (res.success) {
                    const list = res.data.rows.map((item) => (
                        <div className='photo-con' key={item.id}><img src={item.path}/></div>
                    ));
                    const remark = (
                        <div><span  className='tip'>{res.data.remark}</span></div>
                    );
                    this.setState({
                        type,
                        isVisible: true,
                        title: '查看照片',
                        taskInfo: item,
                        photoList: list,
                        rem2:remark
                    });
                }
            }).catch();
        } else {
            if (!item) {
                Modal.info({
                    title: "提示",
                    content: '请选择一个任务'
                });
                return;
            }
        }
    }

    handleDelTask() {
        if(!this.state.reason) {
            message.warning("请输入原因");
            return;
        }
        const params = {
            id: this.state.taskInfo.id,
            userId: 1,
            companyId: 1,
            remark: this.state.reason
        };
        // 删除接口
        IOModel.deleteTask(params).then((res) => {
            if(res.success) {
                message.success("删除成功");
                this.setState({
                    delIsVisible: false
                });
                this.refresh('modify');
            }
        }).catch((res) => {
          Modal.error({
            title: '提示',
            content:res.message
          });
            //message.error("删除失败");
        });

    }

    handleRequest() {
        /*this.setState({
            reason: e.target.value
        });*/
        const {personQty,userId, taskInfo} = this.state;
        if(!personQty || personQty === 0) {
            message.warning("请输入用工数量");
            return;
        }
        const params = {
            companyId: 1,
            name: taskInfo.name + moment(taskInfo.plannedTime).format("YYYY-MM-DD"),
            planId: this.planId,
            landId: taskInfo.landId,
            taskId: taskInfo.id,
            qty: personQty,
            taskName: taskInfo.name,
            userId: userId
        };
        IOModel.employmentReq(params).then((res) => {
            if(res.success) {
                if(res.data > 0) {
                    message.success("发起用工请求成功");
                    this.setState({
                        reqIsVisible: false
                    });
                    this.refresh('modify');
                }else{
                  Modal.error({
                    title: '提示',
                    content:res.message
                  });
                    //message.error("发起用工请求失败");
                }
            }
        }).catch((res) => {
          Modal.error({
            title: '提示',
            content:res.message
          });
            //message.error("发起用工请求失败");
        });
    }

    // 修改原因
    handleReason(e) {
        this.setState({
            reason: e.target.value
        });
    }
    handlePersonQty(value) {
        this.setState({
            personQty: value
        });
    }

    // 完成计划
    handlePlanDoneConfirm() {
        const _this = this;
        confirm({
            title: '确定完成计划?',
            okText: '确认',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                _this.handlePlanDone();
            }
        });
    }
    handlePlanDone() {
        const params = {
            id: this.planId,
            companyId: 1
        };
        IOModel.completePlan(params).then((res) => {
            if(res.success) {
                if(res.data === 0) {
                    message.error("任务列表有未完成任务");
                }else if(res.data > 0) {
                    message.success("完成计划成功");
                    this.refresh('modify');
                }
            }
        }).catch(() => {
            message.error("完成计划失败");
        });

    }

    // 终止计划
    handlePlanCancelConfirm() {
        const _this = this;
        confirm({
            title: '确定终止计划?',
            okText: '确认',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                _this.handlePlanCancel();
            }
        });
    }
    handlePlanCancel() {
        const params = {
            id: this.planId,
            companyId: 1
        };
        IOModel.cancelPlan(params).then((res) => {
           if(res.success) {
               if(res.data === 0) {
                   message.error("终止计划失败");
               }else if(res.data > 0) {
                   message.success("终止计划成功");
                   this.refresh('modify');
               }
           }
        }).catch(() => {
            message.error("终止计划失败");
        });

    }
    //修改定值日期
    handlePlanDate() {
        if(!this.state.confirmDate) {
            message.warning("请设置定植日期");
            return;
        }
        const params = {
            id: this.planId,
            userId: 1,
            companyId: 1,
            plantingDate: new Date(this.state.confirmDate).getTime()
        };
        IOModel.updatePlanDate(params).then((res) => {
            if(res.success) {
                message.success("定植日期更新成功");
            }

        }).catch(() => {
            message.error("定植日期更新失败");
        });
    }

    confirmTime(val) {
        if(val) {
          this.setState({
            confirmDate: moment(val, 'YYYY-MM-DD')
          });
        }else{
          this.setState({
            confirmDate: null
          });
        }
    }

    // 计划调整
    handleSubmitEdit() {
        const {material,operation,user} = this.state;
        const name = material.name;
        const dosageUnitName = material.dosageUnitName;
        let plannedQty = parseFloat(this.state.plannedQty);
        const plannedTime = this.state.plannedTime;
        const data = this.taskForm.props.form.getFieldsValue();
        if(this.state.type === 'create') {
            if(!data.workTypeName) {
                message.warning("请选择任务类型");
                return;
            }
            if(!data.operationId) {
                message.warning("请选择任务");
                return;
            }
            if(!data.landName) {
                message.warning("请选择地块");
                return;
            }
            if(!data.materialId) {
                message.warning("请选择农资");
                return;
            }
            if(!data.supervisor) {
                message.warning("请选择负责人");
                return;
            }
            if((!data.materialId || data.materialId === -1) && plannedQty > 0) {
                data.plannedQty = 0;
                plannedQty = 0;
            }
        }
        if (plannedQty < 0) {
            message.warning('计划用量不能小于0');
            return;
        }
        if(!plannedTime) {
            message.warning("请选择计划执行时间");
            return;
        }
        /*if((this.state.material.id && this.state.material.id !== -1 && plannedQty < 0) || (this.state.material.id && this.state.material.id !== -1 && isNaN(plannedQty))) {//农资存在，则判断计划用量
            message.warning("请输入计划用量");
            return;
        }
        if((!this.state.material.id || this.state.material.id === -1) && plannedQty > 0) {
            data.plannedQty = 0;
            plannedQty = 0;
        }*/
        if(this.state.type === 'create') {
            let workTypeName = '';
            if(this.props.workTypeList) {
                const workType = this.props.workTypeList.filter((item) => {
                    return item.id === data.workTypeName;
                });
                if(workType) {
                    workTypeName = workType[0].name;
                }
            }
            if(data.materialId === "-1") {
                material.name = '---';
                material.dosageUnitName = '---';
            }
            const params = {
                companyId: 1,
                planId: this.planId,
                solutionId: this.detailData.workPlan.solutionId,
                workTypeName: workTypeName,
                workTypeId: data.workTypeName,
                operationId: data.operationId,
                name: operation.name,
                landId: data.landName,
                plannedTime: plannedTime,
                materialId: data.materialId,
                materialName: material.name,
                plannedQty: plannedQty,
                unitName: material.dosageUnitName,
                containment: material.containment,
                purpose: material.purpose,
                startTime: new Date(this.detailData.workPlan.startTime).getTime(),
                employeeId: data.supervisor,//接口暂无，写死
                supervisor: user.name
            };
            const str = JSON.stringify(params);
            IOModel.addTempTask({str:str}).then((res) => {
                if(res.success) {
                    message.success("添加临时任务成功");
                    this.setState({
                        isVisible: false
                    });
                    this.refresh('modify');
                }
            }).catch(() => {
                message.error("添加临时任务失败");
            });
            material.name = name;
            material.dosageUnitName = dosageUnitName;

        }else{
            let userName = '';
            if (this.state.userList) {
                for (let i = 0; i < this.state.userList.length; i++) {
                    if (this.state.userList[i].id === data.supervisor) {
                        userName = this.state.userList[i].name;
                    }
                }
            }
            const params = {
                planId: this.planId,
                id: this.state.taskInfo.id,
                plannedQty: plannedQty,
                //plannedTime: new Date(data.plannedTime).getTime(),
                employeeId: data.supervisor,
                supervisor: userName,
                remark: data.remark
            };
            if(plannedTime) {
                params.plannedTime = plannedTime;
            }
          const str = JSON.stringify(params);
            IOModel.adjustmentTask({str:str}).then((res) => {
                if(res.success) {
                    message.success("调整成功");
                    this.setState({
                        isVisible: false,
                        plannedTime: null,
                        plannedQty: 0
                    });
                    this.refresh('modify');
                }

            }).catch(() => {
                message.error("调整失败");
            });
        }

    }

    // 查看修改记录
    handleViewRecord() {
        IOModel.listHistory({id: this.planId}).then((res) => {
            if(res.success) {
                this.setState({
                    title: '修改记录',
                    editRecordList: res.data,
                    recordIsVisible: true
                });
            }
        }).catch(() => {
            message.error("获取修改记录失败");
        });
    }

    material(material) {
        this.setState({
            material: material
        });
    }
    operation(operation) {
        this.setState({
            operation: operation
        });
    }
    user(user) {
        this.setState({
            user: user
        });
    }
    setDeletedRow(record) {
        return (record.deleted === 1 ? 'special-row' : '');
    }

    render() {
        const taskColumns = [
            {
                title: '序号',
                width: 100,
                dataIndex: 'key',
                key: 'key',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '修改时间',
                dataIndex: 'modifyTime',
                width: 120,
                render(modifyTime) {
                    if(modifyTime) {
                        return moment(modifyTime).format('YYYY-MM-DD');
                    }else {
                        return '';
                    }
                }
            }, {
                title: '修改人',
                dataIndex: 'modifyUserName',
                align: 'left',
                width: 80
            }, {
                title: '修改农事任务名称',
                dataIndex: 'name',
                width: 150,
                align: 'left'
            }, {
                title: '计划执行时间',
                dataIndex: 'plannedTime',
                width: 120,
                render(plannedTime) {
                    return moment(plannedTime).format('YYYY-MM-DD');
                }
            }, {
                title: '执行地块',
                width: 110,
                dataIndex: 'landName',
                align: 'left'
            }, {
                title: '修改字段',
                dataIndex: 'fieldName',
                width: 110,
                align: 'left',
                render(fieldName) {
                    if('planned_time' === fieldName) {
                        return '计划执行时间';
                    }else if('planned_qty' === fieldName) {
                        return '计划用量';
                    }else if('employee_id' === fieldName) {
                        return '负责人';
                    }else if('supervisor' === fieldName) {
                        return '负责人';
                    }else if('deleted' === fieldName) {
                        return '删除';
                    }else if('period_name' === fieldName) {
                        return '生长周期';
                    }else {
                        return '';
                    }
                }
            },
            {
                title: '修改前的值',
                dataIndex: 'originalValue',
                width: 120,
                render(text, record) {
                    if(record.originalValue) {
                        if(record.fieldName && 'planned_time' === record.fieldName) {
                            return moment(record.originalValue).format('YYYY-MM-DD');
                        }else{
                            return record.originalValue;
                        }
                    }else {
                        return '';
                    }
                }
            },
            {
                title: '修改后的值',
                dataIndex: 'newValue',
                width: 120,
                render(text, record) {
                    if(record.newValue) {
                        if(record.fieldName && 'planned_time' === record.fieldName) {
                            return moment(record.newValue).format('YYYY-MM-DD');
                        }else{
                            return record.newValue;
                        }
                    }else {
                        return '';
                    }
                }
            }, {
                title: '修改原因',
                dataIndex: 'remark',
                width: 100
            }
        ];
        //const recordColumn = taskColumns.splice(0, taskColumns.length - 1);
        const recordColumn = taskColumns;
        const farmPlanColumns = [
            {
                title: '序号',
                width: 100,
                dataIndex: 'key',
                key: 'key',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '任务',
                dataIndex: 'name',
                align: 'left',
                width: 100
            }, {
                title: '任务类型',
                dataIndex: 'workTypeName',
                width: 100,
                align: 'left'
            }, {
                title: '地块',
                dataIndex: 'landName',
                align: 'left',
                width: 120
            }, {
                title: '计划执行时间',
                dataIndex: 'plannedTime',
                width: 120,
                render(plannedTime) {
                    return moment(plannedTime).format('YYYY-MM-DD');
                }
            }, {
                title: '生长周期',
                dataIndex: 'periodName',
                width: 100,
                align: 'left'
            }, {
                title: '计划使用农资',
                dataIndex: 'materialName',
                width: 120,
                align: 'left'
            },
            {
                title: '计划用量',
                dataIndex: 'plannedQty',
                width: 100,
                align: 'left',
                render(text, record) {
                    if(record.plannedQty) {
                        return `${record.plannedQty}${record.unitName}`;
                    }else{
                        return "";
                    }
                }
            },
            {
                title: '抑制期',
                dataIndex: 'containment',
                align: 'right',
                width: 90
            }, {
                title: '农资用途',
                dataIndex: 'purpose',
                align: 'left',
                width: 100
            }, {
                title: '负责人',
                dataIndex: 'supervisor',
                align: 'left',
                width: 100
            }, {
                title: '状态',
                dataIndex: 'worktaskStatus',
                width: 90,
                align: 'center'
            },
            {
                title: '实际用量',
                dataIndex: 'actualQty',
                width: 100,
                align: 'right'
            }
        ];//任务列表
      if(this.state.pageType === 'modify') {
        if(this.state.planStatus && this.state.planStatus === 'pending') {
          farmPlanColumns.push({
            title: '操作',
            dataIndex: 'op',
            width: 200,
            render: (text, record) => {
              return (
                <div>
                  {record.deleted === 0 ? <div>
                      <Tooltip title="任务调整"><span className='cursor' onClick={(item) => {
                        this.hanleOperate('edit', item, record);
                      }}><i className='iconfont icon-bianji'></i> </span></Tooltip>
                      <Tooltip title="现场照片"><span className='cursor' style={{marginLeft:'8px'}} onClick={(item) => {
                        this.hanleOperate('pic', item, record);
                      }}><i className='iconfont icon-icon-photos-o'></i> </span></Tooltip>
                      <Tooltip title="删除任务"><span className='cursor' style={{marginLeft:'8px'}} onClick={(item) => {
                        this.hanleOperate('del', item, record);
                      }}><i className='iconfont icon-shanchu'></i> </span></Tooltip>
                      {record.isRequest === 0 ?  <Tooltip title="发起用工请求"><span className='cursor' style={{marginLeft:'8px'}} onClick={(item) => {
                        this.hanleOperate('req', item, record);
                      }}><i className='iconfont icon-yonggong1'></i> </span></Tooltip>:<Tooltip title="已经发过用工请求"><span className='cursor disabled' style={{marginLeft:'8px'}}
                      ><i className='iconfont icon-yonggong1'></i> </span></Tooltip>}
                      {/*<Button className='btn-task' className='' size='small' onClick={(item) => {
                                        this.hanleOperate('edit', item, record);
                                    }}>任务调整</Button>
                                    <Button className='btn-task' size='small' onClick={(item) => {
                                        this.hanleOperate('pic', item, record);
                                    }}>现场照片</Button>
                                    <Button className='btn-task' size='small' onClick={(item) => {
                                        this.hanleOperate('del', item, record);
                                    }}>删除任务</Button>
                                    <Button className='btn-task' size='small' onClick={(item) => {
                                        this.hanleOperate('req', item, record);
                                    }}>发起用工请求</Button>*/}
                    </div> :
                    <div>
                      <Tooltip title="任务调整"><span className='cursor'><i className='iconfont icon-bianji'></i> </span></Tooltip>
                      <Tooltip title="现场照片"><span className='cursor' style={{marginLeft:'8px'}}><i className='iconfont icon-icon-photos-o'></i> </span></Tooltip>
                      <Tooltip title="删除任务"><span className='cursor' style={{marginLeft:'8px'}}><i className='iconfont icon-shanchu'></i> </span></Tooltip>
                      <Tooltip title="发起用工请求"><span className='cursor' style={{marginLeft:'8px'}}><i className='iconfont icon-yonggong1'></i> </span></Tooltip>
                      {/*<Button className='btn-task' className='' size='small' disabled>任务调整</Button>
                                    <Button className='btn-task' size='small' disabled>现场照片</Button>
                                    <Button className='btn-task' size='small' disabled>删除任务</Button>
                                    <Button className='btn-task' size='small' disabled>发起用工请求</Button>*/}
                    </div>}
                </div>
              );
            }
          });
        }else {
          farmPlanColumns.push({
            title: '操作',
            dataIndex: 'op',
            width: 200,
            render: (text, record) => {
              return (
                <div>
                  {record.deleted === 0 ? <div>
                      {/* <Button className='btn-task' size='small' onClick={(item) => {
                                        this.hanleOperate('pic', item, record);
                                    }}>现场照片</Button>*/}
                      <Tooltip title="现场照片"><span className='cursor' style={{marginLeft:'8px'}} onClick={(item) => {
                        this.hanleOperate('pic', item, record);
                      }}><i className='iconfont icon-icon-photos-o'></i> </span></Tooltip>
                    </div> :
                    <div>
                      {/*<Button className='btn-task' size='small' disabled>现场照片</Button>*/}
                      <Tooltip title="现场照片"><span className='cursor' style={{marginLeft:'8px'}}><i className='iconfont icon-icon-photos-o'></i> </span></Tooltip>
                    </div>}
                </div>
              );
            }
          });
        }
      }
        const temporaryColumns = [
            {
                title: '序号',
                width: 100,
                dataIndex: 'key',
                key: 'key',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '任务',
                dataIndex: 'name',
                width: 100,
                align: 'left'
            }, {
                title: '任务类型',
                width: 100,
                dataIndex: 'workTypeName',
                align: 'left'
            }, {
                title: '地块',
                dataIndex: 'landName',
                width: 150,
                align: 'left'
            }, {
                title: '计划执行时间',
                dataIndex: 'plannedTime',
                width: 120,
                render(plannedTime) {
                    return moment(plannedTime).format('YYYY-MM-DD');
                }
            }, {
                title: '生长周期',
                width: 100,
                dataIndex: 'periodName',
                align: 'left'
            }, {
                title: '计划使用农资',
                dataIndex: 'materialName',
                width: 200,
                align: 'left'
            },
            {
                title: '计划用量',
                dataIndex: 'plannedQty',
                width: 100,
                align: 'right'
            },
            {
                title: '抑制期',
                dataIndex: 'containment',
                width: 100,
                align: 'right'
            }, {
                title: '农资用途',
                dataIndex: 'purpose',
                width: 100,
                align: 'left'
            }, {
                title: '负责人',
                dataIndex: 'supervisor',
                width: 150,
                align: 'left'
            }, {
                title: '状态',
                dataIndex: 'worktaskStatus',
                width: 100,
                align: 'center'
            },
            {
                title: '实际用量',
                dataIndex: 'actualQty',
                width: 100,
                align: 'right'
            }, {
                title: '创建人',
                dataIndex: 'createUserId',
                width: 100,
                align: 'left'
            }
        ];//临时任务列表
      if(this.state.pageType === 'modify') {
        if(this.state.planStatus && this.state.planStatus === 'pending') {
          temporaryColumns.push({
            title: '操作',
            dataIndex: 'op',
            width: 200,
            render: (text, record) => {
              return (
                <div>
                  {record.deleted === 0 ? <div>
                      <Tooltip title="任务调整"><span className='cursor' onClick={(item) => {
                        this.hanleOperate('edit', item, record);
                      }}><i className='iconfont icon-bianji'></i> </span></Tooltip>
                      <Tooltip title="现场照片"><span className='cursor' style={{marginLeft:'8px'}} onClick={(item) => {
                        this.hanleOperate('pic', item, record);
                      }}><i className='iconfont icon-icon-photos-o'></i> </span></Tooltip>
                      <Tooltip title="删除任务"><span className='cursor' style={{marginLeft:'8px'}} onClick={(item) => {
                        this.hanleOperate('del', item, record);
                      }}><i className='iconfont icon-shanchu'></i> </span></Tooltip>
                          {record.isRequest === 0 ?  <Tooltip title="发起用工请求"><span className='cursor' style={{marginLeft:'8px'}} onClick={(item) => {
                              this.hanleOperate('req', item, record);
                          }}><i className='iconfont icon-yonggong1'></i> </span></Tooltip>:<Tooltip title="已经发过用工请求"><span className='cursor disabled' style={{marginLeft:'8px'}}
                          ><i className='iconfont icon-yonggong1'></i> </span></Tooltip>}
                      {/*<Button className='btn-task' className='' size='small' onClick={(item) => {
                                        this.hanleOperate('edit', item, record);
                                    }}>任务调整</Button>
                                    <Button className='btn-task' size='small' onClick={(item) => {
                                        this.hanleOperate('pic', item, record);
                                    }}>现场照片</Button>
                                    <Button className='btn-task' size='small' onClick={(item) => {
                                        this.hanleOperate('del', item, record);
                                    }}>删除任务</Button>
                                    <Button className='btn-task' size='small' onClick={(item) => {
                                        this.hanleOperate('req', item, record);
                                    }}>发起用工请求</Button>*/}
                    </div> :
                    <div>
                      <Tooltip title="任务调整"><span className='cursor'><i className='iconfont icon-bianji'></i> </span></Tooltip>
                      <Tooltip title="现场照片"><span className='cursor' style={{marginLeft:'8px'}}><i className='iconfont icon-icon-photos-o'></i> </span></Tooltip>
                      <Tooltip title="删除任务"><span className='cursor' style={{marginLeft:'8px'}}><i className='iconfont icon-shanchu'></i> </span></Tooltip>
                      <Tooltip title="发起用工请求"><span className='cursor' style={{marginLeft:'8px'}}><i className='iconfont icon-yonggong1'></i> </span></Tooltip>
                      {/*<Button className='btn-task' className='' size='small' disabled>任务调整</Button>
                                    <Button className='btn-task' size='small' disabled>现场照片</Button>
                                    <Button className='btn-task' size='small' disabled>删除任务</Button>
                                    <Button className='btn-task' size='small' disabled>发起用工请求</Button>*/}
                    </div>}
                </div>
              );
            }
          });
        }else{
          temporaryColumns.push({
            title: '操作',
            dataIndex: 'op',
            width: 80,
            render: (text, record) => {
              return (
                <div>
                  {record.deleted === 0 ? <div>
                      {/*<Button className='btn-task' size='small' onClick={(item) => {
                                        this.hanleOperate('pic', item, record);
                                    }}>现场照片</Button>*/}
                      <Tooltip title="现场照片"><span className='cursor' style={{marginLeft:'8px'}} onClick={(item) => {
                        this.hanleOperate('pic', item, record);
                      }}><i className='iconfont icon-icon-photos-o'></i> </span></Tooltip>
                    </div> :
                    <div>
                      {/*<Button className='btn-task' size='small' disabled>现场照片</Button>*/}
                      <Tooltip title="现场照片"><span className='cursor' style={{marginLeft:'8px'}}><i className='iconfont icon-icon-photos-o'></i> </span></Tooltip>
                    </div>}
                </div>
              );
            }
          });
        }
      }
        const reListColumns = [
            {
                title: '序号',
                width: 100,
                dataIndex: 'key',
                key: 'key',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            },
            {
                title: '采收日期',
                align:'center',
                dataIndex: 'recoveryDate',
                render(recoveryDate) {
                    return moment(recoveryDate).format('YYYY-MM-DD');
                }
            }, {
                title: '采收批次',
                dataIndex: 'batchNo',
                align: 'center',
                width: 200
            }, {
                title: '作物品种',
                dataIndex: 'cropName',
                align: 'left'
            }, {
                title: '采收数量',
                dataIndex: 'recoveryqty',
                align: 'right'
            }, {
                title: '采收单位',
                dataIndex: 'unitName',
                align: 'left'
            }, {
                title: '采收地块',
                dataIndex: 'landName',
                align: 'left'
            }, {
                title: '负责人',
                dataIndex: 'userName',
                align:'left'
            }
        ];//采收记录
        let planInfo = {}; // 计划详情
        let taskList = []; // 任务列表
        let temporaryTaskList = []; // 临时任务列表
        let receiveList = []; // 采收记录
        //this.detailData = this.state.detailData;
        if(this.detailData) {
            if(this.detailData.workPlan) {
                planInfo = this.detailData.workPlan;
            }
            if(this.detailData.workTaskOrdinary) {
                taskList = this.detailData.workTaskOrdinary;
            }
            if(this.detailData.workTaskTemporary) {
                temporaryTaskList = this.detailData.workTaskTemporary;
            }
            if(this.detailData.workBath) {
                receiveList = this.detailData.workBath;
            }
            if(planInfo.startTime) {
                planInfo.startTimeFormat = moment(planInfo.startTime).format('YYYY-MM-DD');
            }
             // if(planInfo.planDate !== null) {
             //     this.state = {
             //         confirmDate: moment(planInfo.planDate, 'YYYY-MM-DD')
             //     };
             //     //planInfo.planDate = moment(planInfo.planDate, 'YYYY-MM-DD');
             // }
            if(this.detailData.astLands !== null && this.detailData.astLands.length > 0) {
                let landStr = "";
                this.detailData.astLands.forEach((item, index) => {
                    if(index === 0) {
                        landStr = item.name;
                    }else {
                        // landStr += ',' + item.name;
                        landStr =`${landStr}、${item.name}`;
                    }
                });
                planInfo.landStr = landStr;
            }else{
                this.detailData.astLands = [];
            }

        }else{
            this.detailData = {};
            this.detailData.astLands = [];
        }
        // let id = -1;
        // if(this.props.listFields && this.props.listFields.id) {
        //     id = this.props.listFields.id;
        // }else if(this.props.detailFields && this.props.detailFields.id) {
        //     id = this.props.detailFields;
        // }
        //const type = (this.props.detailFields && this.props.detailFields.type) ? this.props.detailFields.type.value : '';
        return (
            <div className='farming-box farming-plan-box'>
                <div className='farming-search'>
                    <div className='farming-title'><div className='title big-title'>农事计划详情</div></div>
                </div>
                <div className='content'>
                    <Card>
                        <ul>
                            {/*<Detail confirmDate={this.confirmDate.bind(this)} detailinfo={planInfo}/>*/}
                            <section>
                                <ul className='planDetail'>
                                    <li>农事计划编号：{planInfo.code}</li>
                                    <li>种植作物：{planInfo.cropName}</li>
                                    <li>种植方案：{planInfo.solutionName}</li>
                                    <li>种植基地：{planInfo.baseName}</li>
                                    <li>种植地块：{planInfo.landStr}</li>
                                </ul>
                              {this.state.pageType === 'modify'?<ul className='planDetail'>
                                    <li>计划开始日期：{planInfo.startTimeFormat}</li>
                                    {planInfo.workplanStatusCode === 'pending' ? <li className='plant-date-li'>定植日期：
                                        <LocaleProvider locale={zhCN}>
                                            <DatePicker value={this.state.confirmDate} onChange={this.confirmTime.bind(this)}/>
                                        </LocaleProvider>
                                        <Button className='content-button' type='primary' onClick={this.handlePlanDate.bind(this)}>确认定植日期</Button>
                                     </li> : <li>定植日期：{planInfo.plantingDate !== null ? moment(planInfo.plantingDate).format('YYYY-MM-DD') : ''}</li>}
                                </ul>:
                                <ul className='planDetail'>
                                <li>计划开始日期：{planInfo.startTimeFormat}</li>
                                {planInfo.workplanStatusCode === 'pending' ? <li className='plant-date-li'>定植日期：{moment(planInfo.confirmDate).format('YYYY-MM-DD')}
                                </li> : <li>定植日期：{planInfo.plantingDate !== null ? moment(planInfo.plantingDate).format('YYYY-MM-DD') : ''}</li>}
                              </ul>}
                              {this.state.pageType === 'modify'?<ul className='planDetail'>
                                    <li className='content-button-list plan-detail-button'>
                                        {planInfo.workplanStatusCode === 'pending' && <Button type='primary' onClick={this.handlePlanDoneConfirm.bind(this)}>计划完成</Button>}
                                        {planInfo.workplanStatusCode === 'pending' && <Button type='primary' onClick={this.handlePlanCancelConfirm.bind(this)}>终止计划</Button>}
                                    </li>
                                </ul>:<ul></ul>}
                            </section>
                        </ul>
                    </Card>
                    <div className='space'></div>
                    <div className="content-wrap">
                        <div className='table-header'>
                            <p><i className='iconfont icon-sort'></i><span>任务列表</span></p>
                            <p><Button onClick={this.handleViewRecord.bind(this)}>查看修改记录</Button></p>
                        </div>
                        <div className='res-table'>
                            <LocaleProvider locale={zhCN}>
                                <Table bordered rowKey={record => record.id} rowClassName={this.setDeletedRow.bind(this)} columns={farmPlanColumns} dataSource={taskList} pagination={false}
                                />
                            </LocaleProvider>
                        </div>
                    </div>
                    <div className='space'></div>
                    <div className="content-wrap">
                      {this.state.pageType === 'modify'?<div className='table-header'>
                            <p><i className='iconfont icon-sort'></i><span>临时任务列表</span></p>
                            {planInfo.workplanStatusCode === 'pending' && <p><Button onClick={this.hanleOperateCreate.bind(this)}>添加临时任务</Button></p>}
                        </div>:
                        <div className='table-header'>
                        <p><i className='iconfont icon-sort'></i><span>临时任务列表</span></p>
                      </div>}
                        <div className='res-table'>
                            <LocaleProvider locale={zhCN}>
                                <Table bordered rowKey={record => record.id} rowClassName={this.setDeletedRow.bind(this)} columns={temporaryColumns} dataSource={temporaryTaskList} pagination={false}
                                />
                            </LocaleProvider>
                        </div>
                    </div>
                    <div className='space'></div>
                    <div className="content-wrap">
                        <div className='table-header'>
                            <p><i className='iconfont icon-sort'></i><span>采收记录</span></p>
                        </div>
                        <div className='res-table'>
                            <LocaleProvider locale={zhCN}>
                                <Table bordered rowKey={record => record.id} columns={reListColumns} dataSource={receiveList} pagination={false}/>
                            </LocaleProvider>
                        </div>
                    </div>

                    <Modal title={this.state.title}
                           visible={this.state.delIsVisible}
                           okText="确认"
                           cancelText="取消"
                           wrapClassName='farming-admin-modal'
                           destroyOnClose={true}
                           onCancel={() => {
                               this.setState({
                                   delIsVisible: false
                               });
                           }}
                           onOk={this.handleDelTask.bind(this)}
                           width={600}>
                        <TextArea rows={4} placeholder='' value={this.state.reason}
                                  onChange={this.handleReason.bind(this)}/>
                    </Modal>

                    <Modal title={this.state.title}
                           visible={this.state.reqIsVisible}
                           okText="确认"
                           cancelText="取消"
                           wrapClassName='farming-admin-modal'
                           destroyOnClose={true}
                           onCancel={() => {
                               this.setState({
                                   reqIsVisible: false
                               });
                           }}
                           onOk={this.handleRequest.bind(this)}
                           width={600}>
                        <Form layout="inline" className='ant-form'>
                        <FormItem label="预计用工人数">
                            <div><InputNumber min={0} value={this.state.personQty} onChange={this.handlePersonQty.bind(this)}/>
                            </div>
                        </FormItem>
                        </Form>
                    </Modal>

                    <Modal title={this.state.title}
                           visible={this.state.isVisible && this.state.type === 'pic'}
                           okText="确认"
                           cancelText="取消"
                           wrapClassName='farming-admin-modal'
                           destroyOnClose={true}
                           onCancel={() => {
                               this.setState({
                                   isVisible: false
                               });
                           }}
                           onOk={() => {
                               this.setState({
                                   isVisible: false
                               });
                           }}
                           width={800}>
                        <div>
                            <Carousel>
                                {this.state.photoList}
                            </Carousel>
                          <div className='tip'>{this.state.rem2}</div>
                        </div>
                    </Modal>

                    <Modal
                        title={this.state.title}
                        visible={this.state.isVisible && this.state.type !== 'pic'}
                        okText="确认"
                        cancelText="取消"
                        onOk={this.handleSubmitEdit.bind(this)}
                        wrapClassName='farming-admin-modal plan-detail-second-modal'
                        destroyOnClose={true}
                        onCancel={() => {
                            this.taskForm.props.form.resetFields();
                            this.setState({
                                isVisible: false
                            });
                        }}
                        width={550}>
                        <TaskFromNew setPlanQTY={this.setPlanQTY.bind(this)} setPlanTime={this.setPlanTime.bind(this)} type={this.state.type} palnInfo={this.state.taskInfo} workTypeList={this.props.workTypeList} material={this.material.bind(this)} operation={this.operation.bind(this)} user={this.user.bind(this)} userList={this.state.userList} landList={this.detailData.astLands}
                                     wrappedComponentRef={(inst) => {
                                         this.taskForm = inst;
                                     }}/>
                    </Modal>

                    <Modal title={this.state.title}
                           visible={this.state.recordIsVisible}
                           wrapClassName='farming-admin-modal'
                           okText="确认"
                           cancelText="取消"
                           onCancel={() => {
                               this.setState({
                                   recordIsVisible: false
                               });
                           }}
                           onOk={() => {
                               this.setState({
                                   recordIsVisible: false
                               });
                           }}
                           width={1200}>
                        <LocaleProvider locale={zhCN}>
                            <Table rowKey={record => record.id} bordered dataSource={this.state.editRecordList} columns={recordColumn}
                                   pagination={false}/>
                        </LocaleProvider>
                    </Modal>
                </div>
            </div>
        );
    }
}


const mapStateprops = (state) => {
    const {PlanData, slideName, Alldic, detailFields, AllWorkTypeDic} = state.farmingplanReducer;
    return {
        listData:PlanData,//获取数据
        dicList: Alldic,//数据字典
        workTypeList: AllWorkTypeDic,
        slideName,
        detailFields
    };
};
export default connect(mapStateprops, action)(PlanDetail);
