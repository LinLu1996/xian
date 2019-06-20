import {Table, Pagination, InputNumber, message, Tooltip, Icon,LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import {Component} from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './index.less';

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            data1: this.props.Data2,
            expendKeys: [],
            childDataEx: [] //判断子列表是否展开
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'key',
            width:100,
            key: 'key',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        }, {
            title: '作物品种',
            dataIndex: 'name',
            align: "left",
            key: 'name'
        }, {
            title: '预估产量（亩）',
            dataIndex: 'estimateYield',
            align: "right",
            key: 'estimateYield'
        },
            {
                title: '产量单位',
                dataIndex: 'unitName',
                align: "left"
            }];
        if(this.props.editRole && this.props.gradeQueryRole) {
            this.columns.push({
                title: '操作',
                dataIndex: 'caozuo',
                align: "center",
                render: (text, record) => {
                    const {childDataEx}= this.state;
                    const editFlag = childDataEx && childDataEx[record.id] && childDataEx[record.id].editFlag; //是否点击编辑
                    //const showFlag = childDataEx && childDataEx[record.id] && childDataEx[record.id].showFlag; //是否展开
                    return <div>
                        {editFlag && <Tooltip title="保存预估产量"><span className='cursor' onClick={this.saveChange.bind(this, record)}><Icon type="save"/></span></Tooltip>}
                        {!editFlag && <Tooltip title="编辑预估产量"><span className='cursor' onClick={this.isEditFlag.bind(this, record)}><i
                            className='iconfont icon-xiugai07'></i></span></Tooltip>}
                    </div>;
                }
            });
        }
    }

    onSizeChange(current, pageSize) {
        this.props.Alldatas({startPage: current, limit: pageSize, companyId: 1});
        this.props.page({current: current, pageSize: pageSize});
    }

    onSizeChangequery(current, pageSize) {
        const {onSizeChangequery} = this.props;
        onSizeChangequery(current, pageSize);
    }
    onShowSizeChange(current, pageSize) {
        const {onShowSizeChange} = this.props;
        onShowSizeChange(current, pageSize);
    }

    onchooseChange(current, pageSize) {
        const {onchooseChange} = this.props;
        onchooseChange(current, pageSize);
        this.props.choosepage({current: current, pageSize: pageSize});
        this.props.page({current: current, pageSize: pageSize});
    }

    saveChange(record) {
        const {childDataEx} = this.state;
        childDataEx[record.id].editFlag = false;
        this.setState({childDataEx});
        const data = this.state.data1[record.id];
        let total = 0;
        data.forEach((item) => {
            total = total + parseInt(item.estimateYield);
        });
        /*if (total !== parseInt(record.estimateYield)) {
            message.warning('必须等于作物的总产量');
            return;
        }*/
        IOModel.updateAstCropReport({reportCropyieldList:JSON.stringify(data)}).then((res) => {
            if (res.success) {
                if (res.data > 0) {
                    this.props.Alldatas({startPage: this.props.Cur, limit: this.props.Psize, companyId: 1,name: this.props.crop});
                    const childData = this.state.data1;
                    childData[record.id] = data;
                    this.setState({
                      data1: childData
                    });
                    message.success('更新成功');
                } else {
                    message.error('更新失败');
                }
            } else {
                message.error('更新失败');
            }
        }).catch(() => {
            message.error('更新失败');
        });
    }

    async isEditFlag(record) {
        const {childDataEx} = this.state;
        if (childDataEx[record.id]) {
            childDataEx[record.id].editFlag = true;
        } else {
            const ex = [];
            ex.editFlag = true;
            childDataEx[record.id] = ex;
        }
        await this.setState({childDataEx});
        await this.onExpand(true,record);
    }

    addQuantity(index, record, value) {
        const data = this.state.data1;
        const data1 = data[record.cropId].map((item) => {
            if (record.id === item.id) {
                item.estimateYield = value;
            }
            return item;
        });
        data[record.cropId] = data1;
        this.setState({
            data1: data
        });
    }

    expandedRowRender(record) {
        const columns = [
            {
                title: '等级名称',
                dataIndex: 'gradeName',
                align: "left",
                key: 'gradeName'
            }, {
                title: '预估产量（亩）',
                dataIndex: 'estimateYield',
                align: "right",
                key: 'estimateYield',
                render: (text, record, index) => {
                    const {childDataEx} = this.state;
                    let flag = false;
                    if (childDataEx && childDataEx[record.cropId] && childDataEx[record.cropId].editFlag) {
                        flag = childDataEx[record.cropId].editFlag;
                    }
                    if (flag) {
                            return <InputNumber style={{width: "100px"}} defaultValue={record.estimateYield} value={record.estimateYield}
                                            onChange={this.addQuantity.bind(this, index, record)}/>;
                    } else {
                        return <span>{record.estimateYield}</span>;
                    }
                }
            },
            {
                title: '产量单位',
                dataIndex: 'unitName',
                align: "left"
            }];

        const data = this.state.data1[record.id];
        return (
            <LocaleProvider locale={zhCN}>
            <Table  bordered   rowKey={record => record.id}
                   columns={columns}
                   dataSource={data}
                   pagination={false} gradeQueryRole={this.props.gradeQueryRole}
            /></LocaleProvider>
        );
    }

    async onExpand(expanded, record) {
        const {childDataEx,expendKeys, data1} = this.state;
        if (expanded) {//展开时
            if (!expendKeys.includes(record.id)) {
                expendKeys.push(record.id);
            }
            IOModel.getAstCropReport({':id':record.id}).then((res) => {
                const data = res.data;
                if (data && data.length > 0) {
                    data1[record.id] = data;
                    this.setState({
                        data1: data1
                    });
                } else {
                    data1[record.id] = [];
                    this.setState({
                        data1: data1
                    });
                }
                //this.props.changeData2(data1);
            }).catch();
        } else {
            const index = expendKeys.indexOf(record.id);
            if (index > -1) {
                expendKeys.splice(index,1);
            }
            if (childDataEx[record.id]) {
                childDataEx[record.id].editFlag = false;
            }
        }
        await this.setState({childDataEx,expendKeys});
    }

    render() {
        const {total, data, Cur, gradeQueryRole} = this.props;
        const {expendKeys} = this.state;
        return (
            <div>
            <div className='res-table'>
                <LocaleProvider locale={zhCN}>
                {gradeQueryRole ? <Table bordered  className="components-table-demo-nested" rowKey={record => record.id} columns={this.columns}
                       dataSource={data} expandedRowRender={this.expandedRowRender.bind(this)} pagination={false} expandedRowKeys={expendKeys}
                       onExpand={this.onExpand.bind(this)}/>:<Table bordered  className="components-table-demo-nested" rowKey={record => record.id} columns={this.columns}
                                                                    dataSource={data} />}
                {/*{
                    queryFlag ?
                        <Pagination defaultCurrent={1} total={total} onChange={this.onSizeChangequery.bind(this)}  current={Cur}
                                    className='res-pagination'/> : chooseFlag ?
                        <Pagination className='res-pagination' defaultCurrent={1} total={total}  current={Cur}
                                    onChange={this.onchooseChange.bind(this)}/> :
                        <Pagination className='res-pagination' defaultCurrent={1} total={total}  current={Cur}
                                    onChange={this.onSizeChange.bind(this)}/>
                }*/}</LocaleProvider></div>
                <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={Cur} defaultCurrent={1}  total={total} /></LocaleProvider>

                {/*<Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total}*/}
                                              {/*onChange={this.onSizeChangequery.bind(this)}*/}
                    {/*/>*/}
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {total, Data2, Alldate, Editdata, EditGradedata, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.cropyielddataReducer;
    return {
        Data2,
        Alldate:Alldate,
        total: total,
        Cur,
        Psize,
        chooseFlag: chooseflag,
        deleteok: deleteOK,
        TreeD,
        parentName: parentname,
        slideID, chooseSIZE, chooseCUR,
        Editdata: Editdata,
        EditGradedata: EditGradedata
    };
};
export default connect(mapstateprops, action)(Tables);