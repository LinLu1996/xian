import {Component} from 'react';
import {connect} from 'react-redux';
import {Button, Table, InputNumber, message, Modal, Tooltip, LocaleProvider} from 'antd';
import {NavLink} from 'react-router-dom';
import {action, IOModel} from './model';
import ModalForm from './detailModalForm.jsx';
import '.././index.less';
import './index.less';
import _ from "lodash";
import moment from "moment";
import zhCN from 'antd/lib/locale-provider/zh_CN';
const confirm = Modal.confirm;

class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operationName: '',//操作名称
            agriculturalType: '',//农事类型
            queryFlag: false,  //筛选按钮
            chooseId: null,
            fields: this.props.fields,
            baseInfo: {},
            data: [],
            childList: [],
            pageType: '',
            expanded: []
        };
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 100,
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '农资名称',
                dataIndex: 'materialName',
                align: "left"
            }, {
                title: '汇总用量',
                dataIndex: 'plannedQty',
                align: "right"
            }, {
                title: '用量单位',
                dataIndex: 'unitName',
                align: "left"
            }, {
                title: '采购金额(元)',
                dataIndex: 'totalValue',
                align: "right",
                render: (text, record, index) => {
                    if (this.state.pageType === 'modify') {
                        return <InputNumber defaultValue={record.totalValue}
                                            onBlur={this.unitPrice.bind(this, index, record)}/>;
                    } else {
                        return <span>{record.totalValue}</span>;
                    }
                }
            }, {
                title: '成本单价',
                dataIndex: 'unitPrice',
                align: "left"
            }];
    }

    unitPrice(index, record, event) {
        record.totalValue = event.target.value;
        record.unitPrice = (parseInt(event.target.value) / parseInt(record.plannedQty)).toFixed(2);
        const {data} = this.state;
        data.splice(index, 1, {
            ...data[index],
            ...record
        });
        this.setState({
            data: data
        });
    }

    async componentDidMount() {
        const params = _.replace(this.props.location.pathname, '/pages/plantingmgmt/procurementplan/detail/', '');
        if (params !== null && params.trim() !== '') {
            const paramArr = params.split("/");
            if (paramArr !== null && paramArr.length >= 2) {
                this.detailId = paramArr[1];
                this.type = paramArr[0];
                this.setState({
                    pageType: this.type
                });
                await this.props.GetOne({":id": this.detailId});
                const {detailInfo} = this.props;
                if (detailInfo && detailInfo.title && detailInfo.title.length > 0) {
                    const baseInfo = detailInfo.title[0];
                    if (baseInfo.createTime !== null) {
                        baseInfo.createTimeFormat = moment(baseInfo.createTime).format("YYYY-MM-DD");
                    }
                    this.setState({
                        baseInfo
                    });
                }
                if (detailInfo && detailInfo.materials && detailInfo.materials.length > 0) {
                    detailInfo.materials.forEach((item) => {
                        item.childList = [];
                    });
                    this.setState({
                        data: detailInfo.materials
                    });
                }
            }
        }
        this.props.superiorName({name: '基地', parentLeftID: -1});
    }

    async refresh(id) {
        await this.props.GetOne({":id": id});
        const {detailInfo} = this.props;
        if (detailInfo && detailInfo.title && detailInfo.title.length > 0) {
            const baseInfo = detailInfo.title[0];
            if (baseInfo.createTime !== null) {
                baseInfo.createTimeFormat = moment(baseInfo.createTime).format("YYYY-MM-DD");
            }
            this.setState({
                baseInfo
            });
        }
        if (detailInfo && detailInfo.materials && detailInfo.materials.length > 0) {
            detailInfo.materials.forEach((item) => {
                item.childList = [];
            });
            this.setState({
                data: detailInfo.materials
            });
        } else {
            this.setState({
                data: []
            });
        }
    }

    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            operationName: this.state.operationName,
            farmingType: this.state.farmingType,
            startPage: 1,
            limit: 10
        };
        this.props.queryAll(vm);
    }

    addmodel() {   //增加的按钮
        this.props.modal({modalFlag: true, modeltype: 'add'});
        this.props.defaultFields({});
        this.props.AllWaitDatas({
            companyId: 1,
            statrTime: new Date().getTime(),
            endTime: new Date(moment(new Date(), 'YYYY-MM-DD').add(3, 'months')).getTime()
        });  //进入页面请求列表数据
    }

    expandedRowRender(record) {
        const data = this.state.childList[record.materialId];
        return (
            <div className='res-table'>
                <LocaleProvider locale={zhCN}>
                    <Table bordered rowKey={record => record.taskId} columns={this.columns2}
                           dataSource={data} pagination={false}/>
                </LocaleProvider>
            </div>
        );
    }

    async onExpand(expanded, record) {
        if (expanded) {
            const obj = {
                companyId: 1,
                procurementId: this.detailId,
                materialsId: record.materialId
            };
            await this.props.GetChild(obj);
            const {childData} = this.props;
            const {childList} = this.state;
            childList[record.materialId] = childData;
            const expandedData = this.state.expanded;
            const obj1 = {
                materialId: record.materialId
            };
            expandedData.push(obj1);
            this.setState({
                childList: childList,
                expanded: expandedData
            });
        } else {
            const expandedData = this.state.expanded.filter((item) => {
                return item.materialId !== record.materialId;
            });
            this.setState({
                expanded: expandedData
            });
        }
    }

    setChildList(list) {
        this.setState({
            childList: list
        });
    }

    //完成
    complete() {
        IOModel.complete({":id": this.detailId}).then((res) => {
            if (res.success) {
                message.success("操作成功");
                this.type = 'detail';
                this.setState({
                    pageType: 'detail'
                });
                this.refresh(this.detailId);
                this.query();
            }
        }).catch((res) => {
            Modal.error({
                title: '提示',
                content: res.message
            });
        });
    }

    //作废
    cancel() {
        IOModel.cancel({":id": this.detailId}).then((res) => {
            if (res.success) {
                message.success("操作成功");
                this.type = 'detail';
                this.setState({
                    pageType: 'detail'
                });
                this.refresh(this.detailId);
            }
        }).catch((res) => {
            Modal.error({
                title: '提示',
                content: res.message
            });
        });
    }

    update() {
        const list = [];
        const {data} = this.state;
        data.forEach((item) => {
            const obj = {
                id: item.id,
                materialId: item.materialId,
                totalValue: item.totalValue,
                unitPrice: item.unitPrice
            };
            if (obj.totalValue < 0 || obj.totalValue === '') {
                message.error("采购金额必须为非负数");
            } else {
                list.push(obj);
            }
        });
        IOModel.ModifyProcurement({updateMaterialsListJson: JSON.stringify(list)}).then((res) => {
            if (res.success && res.data > 0) {
                message.success("保存成功");
                this.refresh(this.detailId);
            } else {
                Modal.error({
                    title: '提示',
                    content: res.message
                });
            }
        }).catch((res) => {
            Modal.error({
                title: '提示',
                content: res.message
            });
        });
        this.refresh(this.detailId);
    }

    delete(record) {
        const _this = this;
        confirm({
            title: '你确定要删除这条农资信息吗?',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            className: 'ant-confirm-btns',
            onOk() {
                _this.confirm(record);
            }
        });
    }

    confirm(record) {
        const vm = {
            id: record.id,
            taskId: record.taskId,
            materialsId: record.materialsId,
            procurementId: record.procurementId,
            plannedQty: record.plannedQty,
            companyId: 1
        };
        IOModel.Delete(vm).then((res) => {
            if (res.success && res.data > 0) {
                message.warning("删除成功");
                this.refresh(this.detailId);
                this.childRefresh(record.materialsId);
            } else {
                Modal.error({
                    title: '提示',
                    content: res.message
                });
            }
        }).catch((res) => {
            Modal.error({
                title: '提示',
                content: res.message
            });
        });
    }

    async childRefresh(materialId) {
        const childList = this.state.childList;
        const obj = {
            companyId: 1,
            procurementId: this.detailId,
            materialsId: materialId
        };
        await IOModel.GetChild(obj).then((res) => {
            if (res.success) {
                childList[materialId] = res.data || [];
                this.setState({
                    childList: childList
                });
            }
        }).catch();
    }

    render() {
        const {baseInfo} = this.state;
        const isEdit = ('modify' === this.state.pageType);
        this.columns2 = [
            {
                title: '计划使用时间',
                dataIndex: 'planTime',
                align: "center",
                render(planTime) {
                    return moment(planTime).format('YYYY-MM-DD');
                }
            }, {
                title: '种植计划编号',
                dataIndex: 'planCode',
                align: "center"
            }, {
                title: '农事任务',
                dataIndex: 'taskName',
                align: "left"
            }, {
                title: '计划用量',
                dataIndex: 'plannedQty',
                align: "right"
            }, {
                title: '用量单位',
                dataIndex: 'unitName',
                align: "left"
            }, {
                title: '基地',
                dataIndex: 'baseName',
                align: "left"
            }, {
                title: '地块',
                dataIndex: 'landName',
                align: "left"
            }];
        if (this.state.pageType === 'modify') {
            this.columns2.push({
                title: '操作',
                dataIndex: 'caozuo',
                align: "center",
                render: (text, record) => {
                    // return <Button type="primary" onClick={this.delete.bind(this,record)}>删除</Button>;
                    return <Tooltip title="删除">
                        <span className='cursor' onClick={this.delete.bind(this, record)}><i
                            className='iconfont icon-shanchu'></i></span>
                    </Tooltip>;
                }
            });
        }
        return (
            <div className='farming-box procurement-detail-content'>
                <div className='farming-search'>
                    <div className='farming-title'>
                        <div className='title'>采购计划详情</div>
                    </div>
                </div>
                <div className='content'>
                    <div className='procurement-plan-box'>
                        <div>
                            <div className='procurement-plan-detail'>
                                <span className='agr-detail-span1'>采购计划编号：</span>
                                <span className='agr-detail-span2'>{baseInfo.code}</span>
                            </div>
                            <div className='procurement-plan-detail'>
                                <span className='agr-detail-span1'>创建时间：</span>
                                <span className='agr-detail-span2'>{baseInfo.createTimeFormat}</span>
                            </div>
                        </div>
                        <div>
                            <div className='procurement-plan-detail'>
                                <span className='agr-detail-span1'>创建人：</span>
                                <span className='agr-detail-span2'>{baseInfo.createUserName}</span>
                            </div>
                            <div className='procurement-plan-detail'>
                                <span className='agr-detail-span1'>状态：</span>
                                <span className='agr-detail-span2'>{baseInfo.stauts}</span>
                            </div>
                        </div>
                        { isEdit &&<div className='content-button-list procurement-plan-button'>
                            <Button className='detail' type="primary"
                                    onClick={this.complete.bind(this)}>完成</Button>
                            <Button className={baseInfo.stauts === '进行中' ? 'red-btn detail' : 'detail'}
                                    type="primary" onClick={this.cancel.bind(this)}>作废</Button>
                            {/*<Button className='detail-invalid' size='large' type="primary">作废</Button>*/}
                        </div>}
                    </div>
                    <div className='space'></div>
                    <div className='table-header'>
                        <p><i className='iconfont icon-sort'></i><span>农资信息</span></p>
                        {isEdit && <p><Button onClick={this.addmodel.bind(this)}>添加农资</Button></p>}
                    </div>
                    <div className='res-table'>
                        <LocaleProvider locale={zhCN}>
                            <Table bordered  rowKey={record => record.id}
                                   columns={this.columns}
                                   dataSource={this.state.data} pagination={false}
                                   expandedRowRender={this.expandedRowRender.bind(this)}
                                   onExpand={this.onExpand.bind(this)}
                            />
                        </LocaleProvider>
                        {isEdit ? <div className='content-btm-list content-button-list'>
                                <Button className='detail' type="primary"
                                        onClick={this.update.bind(this)}>保存</Button>
                                <Button className='detail red-btn' type="primary"><NavLink
                                    to={'/pages/plantingmgmt/procurementplan/2'}>取消</NavLink></Button>
                            </div> :
                            <div className='content-btm-list content-button-list'>
                                <Button className='detail' type="primary"><NavLink
                                    to={'/pages/plantingmgmt/procurementplan/2'}>返回</NavLink></Button>
                            </div>
                        }
                    </div>
                    <ModalForm props={this.props} detailId={this.detailId} refresh={this.refresh.bind(this)}
                               setChildList={this.setChildList.bind(this)} expanded={this.state.expanded}/>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, childData, slideName, fields, detailData} = state.procurementplanReducer;
    return {
        childData: childData,
        dataList: Alldate,//展示列表的数据
        slideName,
        detailInfo: detailData,
        fields
    };
};
export default connect(mapStateprops, action)(Resources);
