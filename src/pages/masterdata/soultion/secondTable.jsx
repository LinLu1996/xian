import {Select, InputNumber, Table, Tooltip} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import { Component } from 'react';
import {OperationIOModel} from "@/pages/masterdata/operations/model";
import {IOModel} from "@/pages/masterdata/soultion/addmodel";
import './index.less';

const Option = Select.Option;
class Tables extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedRowKeys:[],
            selectedRowIndex: '',
            allWorkType:[] //所有类型
        };
        let disOr;
        if(this.props.setType==='detail') {
            disOr=true;
        } else {
            disOr=false;
        }
        this.columns = [{
            title: '序号',
            dataIndex: 'key',
            width: 100,
            key: 'key',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        }, {
            title: '所属周期',
            dataIndex: 'periodId',
            align:"center",
            width: 120,
            render: (text, record,index) => {
                return <div>
                    <Select disabled={disOr} style={{width:"100px",marginLeft:"10px"}}  value={record.periodId}
                            onChange={this.onChange.bind(this,'periodId',index,record)} >
                        {record.periodList && record.periodList.map((item) => {
                            return <Option key={item.liveId} value={item.liveId}>{item.liveName}</Option>;
                        })}
                    </Select>
                </div>;
            }
        }, {
            title: '农事类型',
            dataIndex: 'workTypeId',
            align:"center",
            width: 120,
            render: (text, record,index) => {
                return <div>
                    <Select disabled={disOr} style={{width:"100px",marginLeft:"10px"}}  value={record.workTypeId}
                            onChange={this.onChange.bind(this,'workTypeId',index,record)} >
                        {this.state.allWorkType.map((item) => {
                            return <Option key={item.id} value={item.id}>{item.name}</Option>;
                        })}
                    </Select>
                </div>;
            }
        },{
            title: '任务操作',
            dataIndex: 'operationId',
            align:"center",
            width: 120,
            render: (text, record,index) => {
                return <div>
                    <Select disabled={disOr} style={{width:"100px",marginLeft:"10px"}}  value={record.operationId}
                            onChange={this.onChange.bind(this,'operationId',index,record)} >
                        {record.operationList && record.operationList.map((item) => {
                            return <Option key={item.id} value={item.id}>{item.name}</Option>;
                        })}
                    </Select>
                </div>;
            }
        },{
            title: '使用农资',
            dataIndex: 'materialId',
            align:"center",
            width: 150,
            render: (text, record,index) => {
                return <div>
                    <Select disabled={disOr} style={{width:"130px",marginLeft:"10px"}}  value={record.materialId}
                            onChange={this.onChange.bind(this,'materialId',index,record)} >
                        {record.materialList && record.materialList.map((item) => {
                            return <Option key={item.id} value={item.id}>{item.name}</Option>;
                        })}
                    </Select>
                </div>;
            }
        }, {
            title: '用途',
            dataIndex: 'purpose',
            align:"center",
            width: 80,
            render: (text) => {
                return <div className='solution-second-purpose'>{text}</div>;
            }
        }, {
            title: '农资用量',
            dataIndex: 'plannedQty',
            align: "center",
            render: (text, record, index) => {
                return record.materialId !== -1 && <div className='solution-plannedQty'>
                <InputNumber disabled={disOr} min={0} value={record.plannedQty}
                             onChange={this.onChange.bind(this, 'plannedQty', index, record)}/>
                    <div className='solution-unit'><span className='solution-liang'>{record.unitName}/亩</span></div>
                </div>;
            }
        },
            // },{
            //     title: '用量单位',
            //     dataIndex: 'unitName',
            //     align:"center",
            //     width:150,
            //     render: (text) => {
            //         return <div>{text}</div>;
            //     }
            // },
            {
                title: '执行日期',
                dataIndex: 'delay',
                align:"center",
                width: 200,
                render: (text,record,index) => {
                    return <div style={{display:"flex",alignItems:"center",justifyContent: "center"}} >
                        <span>第</span>
                        <InputNumber disabled={disOr} style={{width:"100px",marginLeft:"10px"}} min={0}  value={record.delay} onChange={this.onChange.bind(this,'delay',index,record)}/>
                        <Select disabled={disOr} style={{width:"100px",marginLeft:"10px"}}  value={record.delayType} onChange={this.onChange.bind(this,'delayType',index,record)} >
                            <Option value="">请选择</Option>
                            <Option value="day">天</Option>
                            <Option value="week">周</Option>
                        </Select>
                    </div>;
                }
            }];
        if(!disOr) {
            this.columns.push({
              title: '操作',
              dataIndex: 'caozuo',
              align:"center",
              render: (text, record,index) => {
                return <div>
                    <Tooltip title="删除"><span className='cursor' onClick={this.deleteRecord.bind(this,index,record)} ><i className='iconfont icon-shanchu'></i></span></Tooltip>
                    <Tooltip title="拷贝"><span className='cursor' onClick={this.copy.bind(this,index,record)}><i className='iconfont icon-fjqitaxinxi'></i></span></Tooltip>
                </div>;
              }
            });
        }
    }

    componentDidMount() {
        // 获取所有农事类型
        OperationIOModel.GetWorkType().then((res) => {
            const workList = [];
            const list = res.data;
            if (list.length > 0) {
                for(let i=0; i<list.length; i++) {
                    //list[i].value = 0;
                    workList.push(list[i]);
                }
            }
            this.setState({
                allWorkType:workList
            });
            /*if (this.props.setType === 'modify') {
                for (let i = 1; i < workList.length; i++) {
                    this.onChange('workTypeId',i,workList[i],workList[i].id);
                }
            }*/
        }).catch();
    }

    async onChange(type,index,record,value) {
        if (type === 'workTypeId') {
            const cc = [{id: '', name: '请选择'}];
            const dd = [{id: -1, name: '无'}];
            await IOModel.getWorkSolution({workTypeId:value}).then((res) => {
                const list1=res.data.operations||[];
                const list2=res.data.materials||[];
                if (list1.length > 0) {
                    for(let i=0; i<list1.length; i++) {
                        cc.push(list1[i]);
                    }
                }
                record.operationList = cc;
                if (list2.length > 0) {
                    for(let i=0; i<list2.length; i++) {
                        dd.push(list2[i]);
                    }
                }
                record.materialList = dd;
            });
            // 重置其他值
            const work = this.state.allWorkType;
            let code = '';
            work.forEach((item) => {
                if (item.id === value) {
                    code = item.code;
                }
            });
            this.props.onChooseChange('code',index,code);
            this.props.onChooseChange('operationId',index,'');
            this.props.onChooseChange('materialId',index,-1);
            this.props.onChooseChange('plannedQty',index,0);
            this.props.onChooseChange('purpose',index,'');
            this.props.onChooseChange('unitName',index,'');
            this.props.onChooseChange(type,index,value,record.operationList,record.materialList);
        } else if (type === 'materialId') {
            this.props.onChooseChange(type,index,value);
            for (let i = 0; i < record.materialList.length; i++) {
                if (value === record.materialList[i].id) {
                    this.props.onChooseChange('purpose',index,record.materialList[i].purpose);
                    this.props.onChooseChange('plannedQty',index,0);
                    this.props.onChooseChange('unitName',index,record.materialList[i].dosageUnitName);
                }
            }
        } else {
            this.props.onChooseChange(type,index,value);
        }
    }
    deleteRecord(index,record) {
        this.props.deleteRecord(index,record);
    }
    copy(index,record) {
        this.props.copy(index,record);
    }
    render() {
        const { taskList,selectedRowIndex} = this.props;
        return (
            <div className='res-table program-table'>
                <Table rowKey={record => record.id} columns={this.columns}  dataSource={taskList} pagination={false} rowClassName={(record, index) => index === selectedRowIndex ? 'select-row-color' : ''}/>
            </div>
        );
    }
}
const mapstateprops = (state) => {
    const {taskList} = state.programAddReducer;
    return {
        taskList
    };
};
export default connect(mapstateprops,action)(Tables);