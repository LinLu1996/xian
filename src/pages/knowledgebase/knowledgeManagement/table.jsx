import {Table, Pagination, message, Switch, Modal, Tooltip,LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import {Component} from 'react';
import zhCN from "antd/lib/locale-provider/zh_CN";
import Public from "@/pages/masterdata/public";

const confirm = Modal.confirm;

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: []
        };
        this.query = this.query.bind(this);
        this.columns = [{
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        },
            {
                title: '作物名称',
                dataIndex: 'cropCn',
                align: "center"
            }, {
                title: '所属种类',
                dataIndex: 'cropType',
                align: "center"
            },{
                title: '创建人',
                dataIndex: 'createUserName',
                align: "center"
            },
            {
                title: '状态',
                dataIndex: 'stauts',
                align: "center",
                render: (text, record) => {
                    if(this.props.editRole) {
                        let flag = false;
                        if (record.stauts === 1) {
                            flag = false;
                        } else {
                            flag = true;
                        }
                        return <Switch checked={flag} onChange={() => {
                            this.changeStatus(record);
                        }}/>;
                    }else{
                        return record.stauts === 1 ? '禁用' : '正常';
                    }
                }
            }];
        if(this.props.editRole || this.props.getRole ||this.props.deleteRole) {
            this.columns.push({
                title: '操作',
                dataIndex: 'caozuo',
                align: "center",
                render: (text, record) => {
                    return <div>
                        {this.props.getRole &&
                        <Tooltip title="详情"><span className='cursor' onClick={this.detail.bind(this, record)}><i
                            className='iconfont icon-xiangqing'></i></span></Tooltip>}
                        {this.props.editRole &&
                        <Tooltip title="编辑"><span onClick={this.query.bind(this, record)}>
                        <span className='cursor' style={{marginLeft: '8px'}}><i className='iconfont icon-xiugai07'></i></span>
                        </span></Tooltip>
                        }
                        {this.props.deleteRole &&
                        <Tooltip title="删除"><span onClick={this.showDeleteConfirm.bind(this, record)}>
                        <span className='cursor' style={{marginLeft: '8px'}}><i
                            className='iconfont icon-shanchu'></i></span>
                        </span></Tooltip>
                        }
                    </div>;
                }
            });
        }
    }

    changeStatus(record) {
        const {Cur, Psize} = this.props;
        const flag=Public.changeStatus(record,'knowledgeManagement_status');
        flag.then((resolve) => {
            if(resolve===true) {
                this.props.Alldatas({startPage: Cur, limit: Psize});
            }
        });
    }

    async detail(record) {
        this.state.modeltype = 'detail';
        await this.props.getOne({':id': record.id});
        const row = this.props.Rditdate;
        this.props.defaultFields({
            id: {
                value: row.id
            },
            cropType: {
                value: row.cropType
            },
            cropCn: {
                value: row.cropCn
            },
            typeMark: {
                value: row.typeMark
            },
            typeName: {
                value: row.typeName
            },
            description: {
                value: row.description
            },
            modeltype: {
                value: 'detail'
            }
        });
        this.props.modal({modalFlag: true, modeltype: 'detail'});
    }

    async query(record) {
        this.state.modeltype = 'modify';
        await this.props.getOne({':id': record.id});
        const row = this.props.Rditdate;
        this.props.defaultFields({
            id: {
                value: row.id
            },
            cropType: {
                value: row.cropType
            },
            cropCn: {
                value: row.cropCn
            },
            typeMark: {
                value: row.typeMark
            },
            typeName: {
                value: row.typeName
            },
            description: {
                value: row.description
            },
            modeltype: {
                value: 'modify'
            }
        });
        this.props.modal({modalFlag: true, modeltype: 'modify'});
    }

    showDeleteConfirm(record) {
        const _this = this;
        confirm({
            title: '确定要删除吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            className: 'crops-library-confirm',
            onOk() {
                _this.confirm(record);
            }
        });
    }

    confirm(record) {
        const {Cur, Psize} = this.props;
        IOModel.Delete({':id': record.id}).then((res) => {
            if (res.success && res.data > 0) {
                message.success('删除成功😯');
                this.props.Alldatas({startPage: Cur, limit: Psize});
            } else {
                message.error('删除失败失败');
            }
        }).catch();
    }

    onSizeChange(current, pageSize) {
        this.props.Alldatas({startPage: current, limit: pageSize});
        this.props.page({current: current, pageSize: pageSize});
    }

    onSizeChangequery(current, pageSize) {
        const {onSizeChangequery} = this.props;
        onSizeChangequery(current, pageSize);
    }

    onchooseChange(current, pageSize) {
        const {onchooseChange} = this.props;
        onchooseChange(current, pageSize);
        this.props.choosepage({current: current, pageSize: pageSize});
    }

    render() {
        const {total, Alldate} = this.props;
        return (
            <div className='res-table'>
                <LocaleProvider locale={zhCN}>
                    <Table rowKey={record => record.id} columns={this.columns} dataSource={Alldate} pagination={false}/>
                </LocaleProvider>
                <Pagination defaultCurrent={1} total={total} onChange={this.onSizeChangequery.bind(this)}
                            className='res-pagination'/>
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {Alldate, Rditdate, allBase, allLandType, total, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.cropsLibraryReducer;
    return {
        Alldate: Alldate,
        Rditdate: Rditdate,
        allBase: allBase,
        allLandType: allLandType,
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