import {Table, Pagination, message, Switch, Tooltip, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import {Component} from 'react';
import './index.less';
import zhCN from "antd/lib/locale-provider/zh_CN";

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            data1: this.props.Data2
        };
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width:100,
                key: 'key',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '作物等级组',
                dataIndex: 'name',
                align: "left",
                key: 'name'
            }, {
                title: '创建人',
                dataIndex: 'createUserName',
                align: "left",
                key: 'createUserName'
            }, {
                title: '状态',
                dataIndex: 'stautsShow',
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
                key: 'operation',
                align: "center",
                render: (text, record) => {
                    return <div>
                        {this.props.editRole &&
                        <Tooltip title="编辑">
                            <span className='cursor' onClick={this.query.bind(this, record)}><i
                                className='iconfont icon-xiugai07'></i></span></Tooltip>}
                        {this.props.gradeAddRole && <Tooltip title="新增作物等级">
                        <span className='cursor' onClick={this.addGrade.bind(this, record)}><i
                            className='iconfont icon-jiahao'></i></span></Tooltip>}
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
        const {Alldatas, chooseAll, Cur, Psize, slideID, chooseSIZE, chooseCUR} = this.props;
        const modifydata = {
            id: record.id,
            companyId: 1,
            stauts: record.stauts === 0 ? 1 : 0
        };
        IOModel.Modifydata(modifydata).then((res) => {
            if (res.success) {
                if (modifydata.stauts === 0) {
                    message.success('启用成功');
                } else {
                    message.success("禁用成功");
                }
                if (slideID === -1) {
                    Alldatas({startPage: Cur, limit: Psize, companyId: 1, name: this.props.name});
                } else {
                    chooseAll({id: this.props.slideID, startPage: chooseCUR, limit: chooseSIZE});
                }
                //this.props.TreeData({tree:[...this.tree(this.props.TreeD,record)]});
            }
        }).catch(() => {
            message.error("操作失败");
        });
    }

    changeGradeStatus(record) {
        const modifydata = {
            id: record.id,
            companyId: 1,
            userId: 1,
            stauts: record.stauts === 0 ? 1 : 0
        };
        IOModel.ModifyGradeData(modifydata).then((res) => {
            if (res.success && res.data > 0) {
                const data2 = this.props.Data2;
                let index = 0;
                for (let i = 0; i < data2[record.gradeGroupId].length; i++) {
                    if (data2[record.gradeGroupId][i].id === record.id) {
                        index = i;
                        break;
                    }
                }
                record.stauts = modifydata.stauts;
                data2[record.gradeGroupId][index] = record;
                this.props.changeData2(data2);
                if (record.stauts === 0) {
                    message.success('启用成功');
                } else {
                    message.success('禁用成功');
                }
            } else {
                message.error("更新失败");
            }
        }).catch(() => {
            message.error("更新失败");
        });
    }

    async query(record) {
        await this.props.getOne({':id': record.id});
        const row = this.props.Editdata;
        this.props.defaultFields({
            id: {
                value: row.id
            },
            gradeName: {
                value: row.name
            },
            createName: {
                value: row.createUserName
            },
            createTime: {
                value: row.gmtCreate
            },
            stauts: {
                value: row.stauts
            },
            modeltype: {
                value: 'modify'
            }
        });
        this.props.modal({modalFlag: true, modeltype: 'modify'});
    }

    async queryGrade(record) {
        await this.props.getGradeOne({':id': record.id});
        const row = this.props.EditGradedata;
        this.props.defaultFields({
            id: {
                value: row.id
            },
            gradeGroupId: {
                value: row.gradeGroupId
            },
            gradeGroupName: {
                value: ""
            },
            gradeName: {
                value: row.name
            },
            sortNum: {
                value: row.sortNum
            },
            stauts: {
                value: row.stauts
            },
            createName: {
                value: row.createUserName
            },
            createTime: {
                value: row.gmtCreate
            },
            modeltype: {
                value: 'modify'
            }
        });
        this.props.modal({gradeModalFlag: true, modeltype: 'modify'});
    }

    addGrade(record) {
        this.props.modal({gradeModalFlag: true, modeltype: 'add'});
        this.props.defaultFields({
            gradeGroupId: {
                value: record.id
            },
            gradeGroupName: {
                value: record.name
            },
            gradeName: {
                value: ''
            },
            sortNum: {
                value: 0
            },
            modeltype: {
                value: 'add'
            }
        });

    }

    onSizeChange(current, pageSize) {
        this.props.Alldatas({startPage: current, limit: pageSize, companyId: 1});
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
        this.props.page({current: current, pageSize: pageSize});
        this.props.choosepage({current: current, pageSize: pageSize});
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
                title: '作物等级',
                dataIndex: 'name',
                align: "left",
                key: 'name'
            }, {
                title: '创建人',
                dataIndex: 'createUserName',
                align: "left",
                key: 'createUserName'
            }, {
                title: '状态',
                dataIndex: 'stautsShow',
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
                        <Tooltip title="编辑作物等级">
                        <span className='cursor' onClick={this.queryGrade.bind(this, record)}><i
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
            <Table  bordered  rowKey={record => record.id} pagination={false}
                   columns={columns}
                   dataSource={data} size={'small'}
            /></LocaleProvider>
        );
    }

    async onExpand(expanded, record) {
        if (expanded) {
            const data = this.state.data1;
            await IOModel.ListInGroup({'companyId': 1, 'gradeGroupId': record.id}).then((res) => {
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

    render() {
        const {total, data, Cur} = this.props;
        const {gradeQueryRole} = this.props;
        return (
            <div>
            <div className='res-table'>
                <LocaleProvider locale={zhCN}>
                {gradeQueryRole ?
                    <Table  bordered   className="components-table-demo-nested" rowKey={record => record.id} columns={this.columns}
                           dataSource={data} expandedRowRender={this.expandedRowRender.bind(this)} pagination={false}
                           onExpand={this.onExpand.bind(this)}/> :
                    <Table  bordered   className="components-table-demo-nested" rowKey={record => record.id} columns={this.columns}
                           dataSource={data} pagination={true} onExpand={this.onExpand.bind(this)}/>
                }</LocaleProvider></div>
                {/*{
                    queryFlag ?
                        <Pagination defaultCurrent={1} current={Cur} total={total}
                                    onChange={this.onSizeChangequery.bind(this)}
                                    className='res-pagination'/> : chooseFlag ?
                        <Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total}
                                    onChange={this.onchooseChange.bind(this)}/> :
                        <Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total}
                                    onChange={this.onSizeChange.bind(this)}/>
                }*/}
                <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={Cur} defaultCurrent={1}  total={total} /></LocaleProvider>
                {/*<Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total}*/}
                                              {/*onChange={this.onSizeChangequery.bind(this)}*/}
                    {/*/>*/}
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {total, Data2, Editdata, EditGradedata, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.cropGradeReducer;
    return {
        Data2,
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