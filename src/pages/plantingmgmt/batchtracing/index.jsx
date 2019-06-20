import {Component} from 'react';
import {connect} from 'react-redux';
import {Table, Input, DatePicker, Pagination, message, InputNumber, Modal, Tooltip, Icon, LocaleProvider} from 'antd';
import moment from 'moment';
import {action, IOModel} from './model';
import '../../index.less';
import './index.less';
import ModalForm from "./modalForm.jsx";
import CodeForm from "./uniqueCode.jsx";
import QRCode from './qrCode.jsx';
import Com from "@/component/common";
import zhCN from 'antd/lib/locale-provider/zh_CN';
const confirm = Modal.confirm;
const {RangePicker} = DatePicker;

class Resources extends Component {
    constructor(props) {
        super(props);
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
        this.state = {
            employeeroleisshow: false,
            empdepisshow: false,
            startDate: moment(start),//开始日期
            endDate: moment(end),//结束日期
            batch: '',//采收批次
            crops: '',//作物品种
            base: '',//基地
            land: '',//地块
            queryFlag: false,  //筛选按钮
            chooseId: null,
            data2: {},
            childData: {},//子列表数据
            childDataEx: {},//判断子列表是否展开
            expendKeys: [],
            closure: false
        };
    }

    //查看码库
    uniqueCodeLibrary(record) {
        this.props.codemodal({modalFlag: true});
        this.props.defaultFields({
            id: {
                value: record.id
            },
            gradeBatchNo: {
                value: record.batchNo
            }
        });
    }

    getSize(size) {
        const clienWidth = document.documentElement.clientWidth;
        return Math.floor(size * clienWidth / 320);
    }

    //弹出生成唯一码弹框
    saveUniqueCode(record) {
        this.props.modal({modalFlag: true, modeltype: 'add'});
        this.props.defaultFields({
            quantity: {
                value: ''
            },
            gradeId: {
                value: record.id
            },
            gradeNo: {
                value: record.batchNo
            },
            modeltype: {
                value: 'add'
            }
        });
    }

    //控制employeeroleisshow显示
    async emproleshow(record) {
        const {childDataEx} = this.state;
        this.setState({
            employeeroleisshow: true
        });
        //分级
        const params = {
            parentBatchId: record.id
        };
        await IOModel.addBatchGrade(params).then((res) => {
            if (res.success) {
                if (res.data > 0) {
                    message.success("分级成功");
                    this.refresh();
                    if (childDataEx[record.id]) {
                        childDataEx[record.id] = {showFlag: true, editFlag: true};
                    } else {
                        const ex = [];
                        ex.editFlag = true;
                        ex.showFlag = true;
                        childDataEx[record.id] = ex;
                    }
                    this.setState({childDataEx});
                    this.expandRow(true, record);
                } else {
                    Modal.error({
                        title: '提示',
                        content: res.message
                    });
                }
            }
        }).catch((res) => {
            Modal.error({
                title: '提示',
                content: res.message
            });
        });
    }

    async expandRow(expanded, record) {
        const {childDataEx, expendKeys, childData} = this.state;
        if (expanded) {
            if (!expendKeys.includes(record.id)) {
                expendKeys.push(record.id);
            }
            if (childDataEx[record.id]) {
                childDataEx[record.id].showFlag = true;
            } else {
                const ex = [];
                ex.showFlag = true;
                childDataEx[record.id] = ex;
            }
            IOModel.getChildData({':batchId': record.id}).then((res) => {
                if (res.success) {
                    const data = res.data ? res.data : [];
                    data.forEach((item) => {
                        item.editQty = item.recoveryGradeQty ? Number(item.recoveryGradeQty) : 0;
                    });
                    childData[record.id] = data;
                    this.setState({
                        childData: childData
                    });
                }
            }).catch();
        } else {
            const index = expendKeys.indexOf(record.id);
            if (index > -1) {
                expendKeys.splice(index, 1);
            }
            if (childDataEx[record.id]) {
                childDataEx[record.id].showFlag = false;
                childDataEx[record.id].editFlag = false;
            }
        }
        await this.setState({childDataEx, expendKeys});
    }

    deleteGrade(record) {
        const _this = this;
        confirm({
            title: '是否确认删除?',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            confirmLoading: false,
            className: 'delete',
            onOk() {
                _this.confirmDelete(record);
            }
        });
    }

    confirmDelete(record) {
        const params = {
            companyId: 1,
            id: record.id
        };
        IOModel.deleteBatchGrade(params).then((res) => {
            if (res.success) {
                if (res.data > 0) {
                    message.success("删除分级成功");
                    this.refresh();
                    const data1 = this.state.childData;
                    data1[record.id] = [];
                    this.setState({
                        childData: data1
                    });
                } else {
                    Modal.error({
                        title: '提示',
                        content: res.message
                    });
                    //message.error("已生成唯一码，不允许删除");
                }
            }
        }).catch((res) => {
            Modal.error({
                title: '提示',
                content: res.message
            });
        });
    }

    empdepshow() {
        this.setState({
            empdepisshow: true
        });
    }

    changeuserid() {
        /*this.setState({
          userid:record,
          userid_1:record.id
        });*/
    }

    addQuantity(index, record, value) {
        const qty = value;
        const {childData} = this.state;
        const childDataList = childData[record.parentBatchId];// 当前子级集合
        childDataList.forEach(item => {
            if (record.id === item.id) {
                item.editQty = qty;
            }
        });
        childData[record.parentBatchId] = childDataList;
        this.setState({
            childData
        });
    }

    componentDidMount() {
        this.props.page({current: 1, pageSize: 10});
        this.props.Alldatas({
            startPage: 1,
            limit: 10,
            companyId: 1,
            startTime: this.state.startDate ? moment(this.state.startDate).valueOf() : undefined,
            endTime: this.state.endDate ? moment(this.state.endDate).add(1, 'days').valueOf() : undefined
        });
        this.props.superiorName({name: '批次追溯', parentLeftID: -1});
    }

    refresh() {
        const vm = {
            startTime: this.state.startDate ? new Date(moment(this.state.startDate).format('YYYY-MM-DD')).getTime() : undefined,
            endTime: this.state.endDate ? new Date(moment(this.state.endDate).add(1, 'days').format('YYYY-MM-DD')).getTime() : undefined,
            startPage: this.props.Cur,
            limit: this.props.Psize,
            companyId: 1,
            batchNo: this.state.batch,
            cropName: this.state.crops,
            baseName: this.state.base,
            landName: this.state.land
        };
        this.props.queryAll(vm);
    }

    setDate(date) {
        if (date && date.length > 0) {
            this.setState({
                startDate: date[0],
                endDate: date[1]
            });
        } else {
            this.setState({
                startDate: null,
                endDate: null
            });
        }
        this.query();
    }

    setCrops(event) {
        this.setState({
            crops: event.target.value
        });
        this.query();
    }

    setBatch(event) {
        this.setState({
            batch: event.target.value
        });
        this.query();
    }

    setBase(event) {
        this.setState({
            base: event.target.value
        });
        this.query();
    }

    setLand(event) {
        this.setState({
            land: event.target.value
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
                startTime: this.state.startDate ? new Date(moment(this.state.startDate).format('YYYY-MM-DD')).getTime() : undefined,
                endTime: this.state.endDate ? new Date(moment(this.state.endDate).add(1, 'days').format('YYYY-MM-DD')).getTime() : undefined,
                startPage: 1,
                limit: 10,
                companyId: 1,
                batchNo: this.state.batch,
                cropName: this.state.crops,
                baseName: this.state.base,
                landName: this.state.land
            };
            this.setState({
                closure: setTimeout(() => {
                    this.props.queryAll(vm);
                    this.props.page({current: 1, pageSize: 10});
                }, 800)
            });
        });
    }

    save(record) {   //保存分级的按钮
        const {dataList} = this.props;
        const {childData, childDataEx} = this.state;
        childDataEx[record.id].editFlag = false;
        this.setState({childDataEx});
        const parentData = dataList.filter((item) => {
            return item.id === record.id;
        })[0];// 父类对象
        const totalQty = parentData.recoveryQty;//总采收数量
        const childDataList = childData[record.id];// 当前子级集合
        let editTotalQty = 0;
        childDataList.forEach((item) => {
            editTotalQty += Number(item.editQty);
        });
        if (Number(totalQty) !== editTotalQty) {
            childDataList.forEach((item) => {
                item.editQty = item.recoveryGradeQty;
            });
            Modal.warning({
                title: '警告',
                content: '同一采收批次里的分级产品数量总和必须等于原始采收数量哦'
            });
            return;
        } else {
            childDataList.forEach((item) => {
                item.recoveryGradeQty = item.editQty;
            });
        }
        const batchGradeList = [];
        childDataList.forEach((item) => {
            const obj = {
                id: item.id,
                companyId: 1,
                recoveryGradeQty: item.editQty
            };
            batchGradeList.push(obj);
        });
        const params = {
            companyId: 1,
            id: record.id,
            workGradeBatchListJson: JSON.stringify(batchGradeList)
        };
        IOModel.saveBatchGradeQty(params).then((res) => {
            if (res.success && res.data > 0) {
                message.success("保存成功");
                this.refresh();
            } else {
                Modal.error({
                    title: '提示',
                    content: res.message
                });
            }
        }).then().catch((res) => {
            Modal.error({
                title: '提示',
                content: res.message
            });
        });
    }

    saveEdit(record) {
        const {childDataEx} = this.state;
        childDataEx[record.id].editFlag = true;
        this.setState(childDataEx);
    }

    onSizeChange(current, pageSize) {
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            startTime: this.state.startDate ? new Date(moment(this.state.startDate).format('YYYY-MM-DD')).getTime() : undefined,
            endTime: this.state.endDate ? new Date(moment(this.state.endDate).add(1, 'days').format('YYYY-MM-DD')).getTime() : undefined,
            startPage: current,
            limit: pageSize,
            companyId: 1,
            batchNo: this.state.batch,
            cropName: this.state.crops,
            baseName: this.state.base,
            landName: this.state.land
        };
        this.props.queryAll(vm);
        this.props.page({current: current, pageSize: pageSize});
    }
    onShowSizeChange(current, pageSize) {
        this.setState({
            queryFlag: true
        });
        this.props.page({current: 1, pageSize: pageSize});
        const vm = {
            startTime: this.state.startDate ? new Date(moment(this.state.startDate).format('YYYY-MM-DD')).getTime() : undefined,
            endTime: this.state.endDate ? new Date(moment(this.state.endDate).add(1, 'days').format('YYYY-MM-DD')).getTime() : undefined,
            startPage: 1,
            limit: pageSize,
            companyId: 1,
            batchNo: this.state.batch,
            cropName: this.state.crops,
            baseName: this.state.base,
            landName: this.state.land
        };
        this.props.queryAll(vm);
    }


    onSizeChangequery(current, pageSize) {
        const {onSizeChangequery} = this.props;
        onSizeChangequery(current, pageSize);
        this.props.page({current: current, pageSize: pageSize});
    }

    expandedRowRender(record) {
        /*const childData = this.props.Data2;
        const id = record.id;
        childData[id] = record.dataList;
        this.props.changeTable(childData);*/
        const childData = this.state.childData[record.id];
        return (
            <div className='res-table'>
                <Table bordered rowKey={record => record.id} columns={this.columns2}
                       dataSource={childData} pagination={false} />
            </div>
        );
    }

    forBigImg(link) {
        Modal.info({
            title: '二维码扫描',
            okText: "关闭",
            className: 'batch-tracing-info',
            content: (
                <div><QRCode value={link} size={this.getSize(40)}/></div>
            )
        });
    }

    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'batchtracing_listByPage', 'show');
        const printRole = Com.hasRole(securityKeyWord, 'batchtracing_print', 'print');
        const gradePrintRole = Com.hasRole(securityKeyWord, 'batchtracing_grade_print', 'print');
        const gradeQueryRole = Com.hasRole(securityKeyWord, 'batchtracing_grade_listByPage', 'show');
        const makeGradeRole = Com.hasRole(securityKeyWord, 'batchtracing_makeGrade', 'insert');
        const deleteGradeRole = Com.hasRole(securityKeyWord, 'batchtracing_deleteGrade', 'delete');
        const editRole = Com.hasRole(securityKeyWord, 'batchtracing_update', 'update');
        const gradeGetRole = Com.hasRole(securityKeyWord, 'batchtracing_grade_get', 'show');
        const gradeAddRole = Com.hasRole(securityKeyWord, 'batchtracing_grade_add', 'insert');
        const {dataList, total, Cur} = this.props;
        const {queryFlag, expendKeys} = this.state;
        const dateFormat = 'YYYY-MM-DD';
        this.columns2 = [
            {
                title: '二维码',
                dataIndex: 'qr-code',
                align: "center",
                width: 150,
                render: (text, record) => {
                    const href = `${window.location}`.split("/#/");
                    if (record.batchNo) {
                        const link = `${href[0]}/mobile/ding/homepage?url=scavetrace/${record.batchNo}`;
                        return <div onClick={() => {
                            this.forBigImg(link);
                        }}><QRCode value={link} size={this.getSize(10)}/></div>;
                    } else {
                        return '';
                    }
                }
            }, {
                title: '采收批次',
                dataIndex: 'batchNo',
                align: "center",
                width: 200,
                render: text => <Tooltip title={text}><span style={{
                    textOverflow: 'ellipsis',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}>{text}</span></Tooltip>
            }, {
                title: '作物等级',
                dataIndex: 'gradeName',
                align: "left",
                width: 80
            }, {
                title: '数量',
                dataIndex: 'recoveryGradeQty',
                align: "right",
                width: 80,
                render: (text, record, index) => {
                    const childDataEx = this.state.childDataEx;
                    const editFlag = childDataEx[record.parentBatchId] && childDataEx[record.parentBatchId].editFlag;
                    if (editFlag) {
                        return <InputNumber value={record.editQty}
                                            onChange={this.addQuantity.bind(this, index, record)}/>;
                    } else {
                        return record.recoveryGradeQty;
                    }
                }
            }, {
                title: '单位',
                dataIndex: 'unitName',
                align: "left",
                width: 80
            }];
        if (gradeAddRole || gradeGetRole || gradePrintRole) {
            this.columns2.push({
                title: '操作',
                dataIndex: 'caozuo',
                align: "center",
                width: 200,
                render: (text, record) => {
                    return <div>
                        {gradeAddRole && <Tooltip title='生成唯一码'><span className='cursor'
                                                                                 onClick={this.saveUniqueCode.bind(this, record)}><Icon
                            type="qrcode"/></span></Tooltip>}
                        {gradeGetRole && <Tooltip title='查看码库'><span className='cursor'
                                                                                onClick={this.uniqueCodeLibrary.bind(this, record)}><Icon
                            type="eye"/></span></Tooltip>}
                        {gradePrintRole &&
                        <Tooltip title='打印'><span className='batch-tracing-hidden cursor'
                                                  onClick={this.empdepshow.bind(this)}><Icon
                            type="printer"/></span></Tooltip>}
                    </div>;
                }
            });
        }

        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                align: "center",
                key: 'key',
                width: 100,
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '二维码',
                dataIndex: 'qr-code',
                align: "center",
                width: 100,
                render: (text, record) => {
                    if (record.batchNo) {
                        const href = `${window.location}`.split("/#/");
                        const link = `${href[0]}/mobile/ding/homepage?url=scavetrace/${record.batchNo}`;
                        return <div onClick={() => {
                            this.forBigImg(link);
                        }}><QRCode value={link} size={this.getSize(10)}/></div>;
                    } else {
                        return '';
                    }
                }
            }, {
                title: '采收批次',
                dataIndex: 'batchNo',
                align: "left",
                width: 200,
                render: text => <Tooltip title={text}><span style={{
                    textOverflow: 'ellipsis',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}>{text}</span></Tooltip>
            }, {
                title: '作物品种',
                dataIndex: 'cropName',
                align: "left"
            }, {
                title: '种植基地',
                dataIndex: 'baseName',
                align: "left"
            }, {
                title: '种植地块',
                dataIndex: 'landName',
                align: "left"
            }, {
                title: '采收时间',
                dataIndex: 'recoveryDate',
                align: "center",
                width: 100,
                render: (recoveryDate) => {
                    if (recoveryDate) {
                        return moment(recoveryDate).format('YYYY-MM-DD');
                    } else {
                        return '';
                    }
                }
            }, {
                title: '农事计划编号',
                dataIndex: 'planCode',
                align: "center",
                width:120
            }, {
                title: '采收数量',
                dataIndex: 'recoveryQty',
                align: "right",
                width: 90
            }, {
                title: '采收单位',
                dataIndex: 'unitName',
                align: "left",
                width: 90
            }];
        if (editRole || makeGradeRole || deleteGradeRole || printRole) {
            this.columns.push({
                title: '操作',
                dataIndex: 'caozuo',
                align: "center",
                render: (text, record) => {
                    const childDataEx = this.state.childDataEx;
                    const showFlag = childDataEx[record.id] ? childDataEx[record.id].showFlag : false;
                    const editFlag = childDataEx[record.id] ? childDataEx[record.id].editFlag : false;
                    return <div>
                        {record.isGrade === 0 && <Tooltip title='分级'><span className='cursor'
                                                                           onClick={this.emproleshow.bind(this, record)}><Icon
                            type="switcher"/></span></Tooltip>}
                        {printRole && <Tooltip title='打印'><span className='batch-tracing-hidden cursor'
                                                                           onClick={this.empdepshow.bind(this)}><Icon
                            type="printer"/></span></Tooltip>}
                        {(record.isGrade !== 0 && showFlag && !editFlag) && editRole &&
                        <Tooltip title='编辑分级数量'><span className='cursor'
                                                      onClick={this.saveEdit.bind(this, record)}><i
                            className='iconfont icon-xiugai07'></i></span></Tooltip>}
                        {(record.isGrade !== 0 && showFlag && editFlag) && editRole &&
                        <Tooltip title='保存分级数量'><span className='cursor'
                                                      onClick={this.save.bind(this, record)}><Icon type="save"/></span></Tooltip>}
                        {(record.isGrade !== 0 && record.isCreate === 0 && showFlag && !editFlag) && deleteGradeRole &&
                        <Tooltip title='删除分级'><span className='cursor'
                                                    onClick={this.deleteGrade.bind(this, record)}><i
                            className='iconfont icon-shanchu'></i></span></Tooltip>}
                    </div>;
                }
            });
        }
        return (
            <div className='farming-box batch-box'>
                <div className='farming-search'>
                    <div className='farming-title farming-big-title'>
                        <div className='title'>批次追溯</div>
                        <div className='right-data-range'>
                            <span>采收日期范围</span>
                            <LocaleProvider locale={zhCN}>
                                <RangePicker style={{border: '1px solid #ccc'}}
                                             defaultValue={[this.state.startDate, this.state.endDate]}
                                             format={dateFormat} onChange={this.setDate.bind(this)}/>
                            </LocaleProvider>
                        </div>
                    </div>
                    <div className='search-layout batch-search-layout batch-search'>
                        <div className='search-row'>
                            <div className='search-col'>
                                <span className='label-title'>批次</span>
                                <div className='search-input'><Input size="large" value={this.state.batch} onChange={this.setBatch.bind(this)}/></div>
                            </div>
                            <div className='search-col'>
                                <span className='label-title'>作物品种</span>
                                <div className='search-input'><Input size="large" value={this.state.crops} onChange={this.setCrops.bind(this)}/></div>
                            </div>
                            <div className='search-col'>
                                <span className='label-title'>基地名称</span>
                                <div className='search-input'><Input size="large" value={this.state.base} onChange={this.setBase.bind(this)}/></div>
                            </div>
                            <div className='search-col'>
                                <span className='label-title'>地块名称</span>
                                <div className='search-input'><Input size="large" value={this.state.land} onChange={this.setLand.bind(this)}/></div>
                            </div>
                        </div>
                    </div>
                </div>
                {gradeQueryRole ? <div className='content'>
                    <div className='table-header'>
                        <p><i className='iconfont icon-sort'></i><span>批次追溯列表</span></p>
                    </div>
                    {queryRole &&
                        <div>
                            <div className='res-table batch-table'>
                                <LocaleProvider locale={zhCN}>
                                    <Table bordered rowKey={record => record.id} printRole={printRole}
                                           gradePrintRole={gradePrintRole} gradeGetRole={gradeGetRole}
                                           gradeQueryRole={gradeQueryRole} editRole={editRole} gradeAddRole={gradeAddRole}
                                           columns={this.columns}
                                           dataSource={dataList} pagination={false}
                                           expandedRowRender={this.expandedRowRender.bind(this)} queryFlag={queryFlag}
                                           onExpand={this.expandRow.bind(this)} expandedRowKeys={expendKeys}
                                    />
                                </LocaleProvider>
                            </div>
                            {/*<Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total}*/}
                                        {/*onChange={this.onSizeChange.bind(this)}*/}
                            {/*/>*/}
                            <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChange.bind(this)} current={Cur} defaultCurrent={1}  total={total} /></LocaleProvider>
                        </div>
                    }
                    <ModalForm props={this.props}/>
                    <CodeForm props={this.props}/>
                </div> : <div className='content'>
                    <div className='table-header'>
                        <p><i className='iconfont icon-sort'></i><span>批次追溯列表</span></p>
                    </div>
                    {queryRole &&
                            <div>
                                <div className='res-table batch-table'>
                                    <LocaleProvider locale={zhCN}>
                                        <Table rowKey={record => record.id} printRole={printRole}
                                               gradePrintRole={gradePrintRole}
                                               gradeGetRole={gradeGetRole} gradeQueryRole={gradeQueryRole}
                                               editRole={editRole}
                                               gradeAddRole={gradeAddRole}
                                               columns={this.columns}
                                               dataSource={dataList}
                                        />
                                    </LocaleProvider>
                                </div>
                                <Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total}
                                onChange={this.onSizeChange.bind(this)}/>
                            </div>
                    }
                    <ModalForm props={this.props}/>
                    <CodeForm props={this.props}/>
                </div>
                }
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, Data2, total, slideName, fields, chooseflag, Cur, Psize} = state.batchtracingReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['batchtracing_listByPage', 'batchtracing_makeGrade', 'batchtracing_deleteGrade', 'batchtracing_grade_listByPage', 'batchtracing_grade_print', 'batchtracing_grade_get', 'batchtracing_grade_add', 'batchtracing_update', 'batchtracing_print'];
    return {
        Data2,
        chooseflag: chooseflag,
        total: total,
        dataList: Alldate,//展示列表的数据
        slideName,
        fields,
        Cur,
        Psize, securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
