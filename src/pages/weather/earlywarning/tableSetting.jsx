import {Table, Pagination, message, Modal, Tooltip, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {action, IOModel} from './model';
import {Component} from 'react';
import zhCN from "antd/lib/locale-provider/zh_CN";

const confirm = Modal.confirm;

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: []
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'key',
            width: 100,
            key: 'key',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        }, {
            title: '作物',
            dataIndex: 'cropName',
            align: "left"
        }, {
            title: '潜在灾害',
            dataIndex: 'disaster',
            align: "left"
        }, {
            title: '灾害等级',
            dataIndex: 'disasterGrade',
            align: "center"
        }, {
            title: '监测期',
            dataIndex: 'periods',
            align: "left"
        }, {
            title: '监测指标',
            dataIndex: 'standard',
            align: "left"
        }];
        if (this.props.editRole || this.props.deleteRole) {
            this.columns.push({
                title: '操作',
                dataIndex: 'caozuo',
                align: "center",
                render: (text, record) => {
                    return <div>
                        {this.props.editRole && <Tooltip title="编辑">
                            <span className='cursor'><NavLink
                                to={`/pages/weather/earlywarning/add/${record.id}/modify`}><i
                                className='iconfont icon-xiugai07'></i></NavLink></span>
                        </Tooltip>}
                        {this.props.deleteRole && <Tooltip title="删除">
                            <span className='cursor' style={{marginLeft: '8px'}}
                                  onClick={this.showDeleteConfirm.bind(this, record)}>
                            <i className='iconfont icon-shanchu'></i></span>
                        </Tooltip>}
                    </div>;
                }
            });
        }
    }

    showDeleteConfirm(record) {
        const _this = this;
        confirm({
            title: '确定要删除吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            className: 'fertilizer-library-confirm',
            onOk() {
                _this.confirm(record);
            }
        });
    }

    confirm(record) {
        const {Alldatas, Cur, Psize} = this.props;
        IOModel.deleteWarning({'id': record.id}).then((res) => {
            if (res.success && res.data > 0) {
                message.success('删除成功');
                Alldatas({startPage: Cur, limit: Psize});
                //this.props.TreeData({tree: [...this.tree(this.props.TreeD, record)]});
            } else {
                message.error('删除失败');
            }
        }).catch((res) => {
            message.error(res.message);
        });
    }

    query(record) {
        this.props.defaultFields({
            id: {
                value: record.id
            },
            operationName: {
                value: record.operationName
            },
            crop_name: {
                value: record.cropName
            },
            createName: {
                value: record.createName
            },
            createTime: {
                value: record.createTime
            },
            stauts: {
                value: record.stauts
            },
            modeltype: {
                value: 'modify'
            }
        });
        this.props.modal({modalFlag: true, modeltype: 'modify'});
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
        const {onShowSizeChangeSetting} = this.props;
        onShowSizeChangeSetting(current, pageSize);
    }

    onchooseChange(current, pageSize) {
        const {onchooseChange} = this.props;
        onchooseChange(current, pageSize);
        this.props.choosepage({current: current, pageSize: pageSize});
    }

    render() {
        const {total, Alldate,Cur} = this.props;
        return (
            <div>
                <div className='res-table'>
                    <LocaleProvider locale={zhCN}>
                        <Table bordered rowKey={record => record.id} columns={this.columns} dataSource={Alldate}
                               pagination={false}/>
                    </LocaleProvider>
                </div>
                <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={Cur} defaultCurrent={1}  total={total} /></LocaleProvider>
                {/*<Pagination className='res-pagination' defaultCurrent={1} total={total}*/}
                            {/*onChange={this.onSizeChangequery.bind(this)}*/}
                {/*/>*/}
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {total, Cur, Alldata, Alldate, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.earlyWarningListReducer;
    return {
        total: total,
        Cur,
        Alldata, Alldate,
        Psize,
        chooseFlag: chooseflag,
        deleteok: deleteOK,
        TreeD,
        parentName: parentname,
        slideID, chooseSIZE, chooseCUR
    };
};
export default connect(mapstateprops, action)(Tables);