import {Table, Pagination, message, Switch, Tooltip,LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import {Component} from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './index.less';

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data1: this.props.Data2,
            selectedRowKeys: []
        };
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width:100,
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '大类名称',
                dataIndex: 'name',
                align: "left"
            }, {
                title: '创建人',
                dataIndex: 'createUserName',
                align: "left"
            }, {
                title: '状态',
                dataIndex: 'stauts',
                align: "center",
                render: (text, record) => {
                    if (this.props.editRole) {
                        let flag = false;
                        if (record.stauts === 1) {
                            flag = false;
                        } else {
                            flag = true;
                        }
                        return <Switch checked={flag} onChange={() => {
                            this.changeStatus(record);
                        }}/>;
                    } else {
                        return record.stauts === 1 ? '禁用' : '正常';
                    }
                }
            }];
        if (this.props.editRole || this.props.gradeAddRole) {
            this.columns.push({
                title: '操作',
                dataIndex: 'caozuo',
                align: "center",
                render: (text, record) => {
                    return <div>
                        {this.props.gradeAddRole &&
                        <Tooltip title="添加作物小类">
                            <span className='cursor' onClick={this.addSmallClass.bind(this, record)}><i
                                    className='iconfont icon-jiahao'></i></span>
                        </Tooltip>}
                        {this.props.editRole &&
                        <Tooltip title="编辑">
                            <span className='cursor' onClick={this.query.bind(this, record)}><i
                                className='iconfont icon-xiugai07'></i></span>
                        </Tooltip>}
                    </div>;
                }
            });
        }
    }

    async componentWillReceiveProps(nextProps) {
      await this.setState({
        data1: nextProps.Data2
      });
    }

    changeStatus(record) {
        const {Alldatas, chooseAll, slideID, Cur, Psize, chooseCUR, chooseSIZE} = this.props;
        const deleteID = record.id;
        let stautsId = 0;
        if (record.stauts === 0) {
            stautsId = 1;
        } else {
            stautsId = 0;
        }
        IOModel.Modifydata({id: deleteID, stauts: stautsId}).then((res) => {
            if (res.success) {
                if (stautsId === 1) {
                    message.success('禁用成功');
                } else {
                    message.success('启用成功');
                }
                if (slideID === -1) {
                    Alldatas({startPage: Cur, limit: Psize, companyId: 1, name: this.props.name});
                } else {
                    chooseAll({id: this.props.slideID, startPage: chooseCUR, limit: chooseSIZE});
                }
            }
        }).catch(() => {
            message.error("操作失败");
        });
    }

    changeGradeStatus(record) {
        const modifydata = {
            id: record.id,
            stauts: record.stauts === 0 ? 1 : 0
        };
        IOModel.Modifydata(modifydata).then((res) => {
            if (res.success && res.data > 0) {
                const data2 = this.props.Data2;
                let index = 0;
                for (let i = 0; i < data2[record.parentId].length; i++) {
                    if (data2[record.parentId][i].id === record.id) {
                        index = i;
                        break;
                    }
                }
                record.stauts = modifydata.stauts;
                data2[record.parentId][index] = record;
                this.props.changeData2(data2);
                if (record.stauts === 0) {
                    message.success('启用成功');
                } else {
                    message.success('禁用成功');
                }
            }
        }).catch(() => {
            message.error("操作失败");
        });
    }

    async query(row) {
        this.props.defaultFields({
            id: {
                value: row.id
            },
            name: {
                value: row.name
            },
            stauts: {
                value: row.stauts
            },
            parentId: {
                value: row.parentId
            },
            createName: {
                value: row.createUserName
            },
            modeltype: {
                value: 'modify'
            }
        });
        this.props.modal({modalFlag: true, modeltype: 'modify'});
    }

    addSmallClass(record) {
        this.props.defaultFields({
            categoryOne: {
                value: record.id
            },
            id: {
                value: ''
            },
            name: {
                value: ''
            },
            stauts: {
                value: ''
            },
            parentId: {
                value: record.id
            },
            createName: {
                value: ''
            },
            modeltype: {
                value: 'add'
            }
        });
        this.props.modalTwo({modalFlag: true, modeltype: 'add'});
    }

    onSizeChange(current, pageSize) {
        this.props.Alldatas({startPage: current, limit: pageSize});
        this.props.page({current: current, pageSize: pageSize});
    }

    onSizeChangequery(current, pageSize) {
        const {onSizeChangequery} = this.props;
        onSizeChangequery(current, pageSize);
        this.props.page({current: current, pageSize: pageSize});
    }
    onShowSizeChange(current, pageSize) {
        const {onShowSizeChange} = this.props;
        onShowSizeChange(current, pageSize);
        this.props.page({current: 1, pageSize: pageSize});
    }

    onchooseChange(current, pageSize) {
        const {onchooseChange} = this.props;
        onchooseChange(current, pageSize);
        this.props.choosepage({current: current, pageSize: pageSize});
        this.props.page({current: current, pageSize: pageSize});
    }

    expandedRowRender(record) {
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width:100,
                key: 'key',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '小类名称',
                dataIndex: 'name',
                align: "left",
                key: 'name'
            }, {
                title: '状态',
                dataIndex: 'stauts',
                align: "center",
                render: (text, record) => {
                    if (this.props.gradeEditRole) {
                        let flag = false;
                        if (record.stauts === 1) {
                            flag = false;
                        } else {
                            flag = true;
                        }
                        return <Switch defaultChecked={flag} onChange={() => {
                            this.changeGradeStatus(record);
                        }}/>;
                    } else {
                        return record.stauts === 1 ? '禁用' : '正常';
                    }
                }
            }];
        if (this.props.gradeEditRole) {
            columns.push({
                title: '操作',
                key: 'operation',
                align: "center",
                render: (text, record) => {
                    return <div>
                        <Tooltip title="编辑作物小类">
                            <span className='cursor' onClick={this.querySmallClass.bind(this, record)}><i
                                className='iconfont icon-xiugai07'></i></span></Tooltip>
                    </div>;
                }
            });
        }
        const data = this.state.data1[record.id];
        /*
           data = this.state.data1;
         */
        return (
            <LocaleProvider locale={zhCN}>
            <Table rowKey={record => record.id}
                   columns={columns}
                   dataSource={data}
                   pagination={false}
            /></LocaleProvider>
        );
    }

    async onExpand(expanded, record) {
        if (expanded) {
            const data = this.state.data1;
            await IOModel.ListInGroupAll({companyId: 1, parentId: record.id}).then((res) => {
                if (res.success) {
                    data[record.id] = res.data;
                    this.setState({
                        data1: data
                    });
                    this.props.changeData2(data);
                }
            }).catch();
        }
    }

    querySmallClass(record) {
        this.props.defaultFields({
            id: {
                value: record.id
            },
            name: {
                value: record.name
            },
            sort: {
                value: record.sort
            },
            parentId: {
                value: record.parentId
            },
            createName: {
                value: record.createName
            },
            modeltype: {
                value: 'modify'
            }
        });
        this.props.modalTwo({modalFlag: true, modeltype: 'modify'});
    }

    render() {
        const {total, Alldate, Cur} = this.props;
        const {gradeQueryRole} = this.props;
        return (
            <div>
            <div className='res-table'>
                <LocaleProvider locale={zhCN}>
                {gradeQueryRole ?
                    <Table bordered  expandedRowRender={this.expandedRowRender.bind(this)} onExpand={this.onExpand.bind(this)}
                           rowKey={record => record.id} columns={this.columns} dataSource={Alldate}
                           pagination={false}/> :
                    <Table bordered  rowKey={record => record.id} columns={this.columns} dataSource={Alldate} pagination={false}/>
                }</LocaleProvider>
                {/*{
                    queryFlag ?
                        <Pagination defaultCurrent={1} current={Cur} total={total}
                                    onChange={this.onSizeChangequery.bind(this)}
                                    className='res-pagination'/> : chooseFlag ?
                        <Pagination className='res-pagination' current={Cur} defaultCurrent={1} total={total}
                                    onChange={this.onchooseChange.bind(this)}/> :
                        <Pagination className='res-pagination' current={Cur} defaultCurrent={1} total={total}
                                    onChange={this.onSizeChange.bind(this)}/>
                }*/}</div>
                <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={Cur} defaultCurrent={1}  total={total} /></LocaleProvider>
               {/*<Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total}*/}
                                              {/*onChange={this.onSizeChangequery.bind(this)}*/}
                    {/*/>*/}
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {EditData, Data2, Alldate, total, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.cropMaintenanceReducer;
    return {
        Data2: Data2,
        EditData: EditData,
        Alldate: Alldate,
        total: total,
        Cur,
        Psize,
        chooseFlag: chooseflag,
        deleteok: deleteOK,
        TreeD,
        parentName: parentname,
        slideID, chooseSIZE, chooseCUR
    };
};
export default connect(mapstateprops, action)(Tables);