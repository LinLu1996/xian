import {Table, Pagination, Tooltip, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {Component} from 'react';
import zhCN from "antd/lib/locale-provider/zh_CN";
import moment from "moment";

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: ''
        };
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 100,
                key: 'key',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '类型',
                dataIndex: 'type',
                align: "center",
                render: () => {
                    return <span>企业</span>;
                }
            }, {
                title: '企业名称',
                dataIndex: 'name',
                align: "center"
            }, {
                title: '手机号',
                dataIndex: 'mobilePhone',
                align: "center"
            }, {
                title: '创建时间',
                dataIndex: 'gmtCreate',
                align: "center",
                render: (text) => {
                    return moment(text).format('YYYY-MM-DD');
                }
            }, {
                title: '状态',
                dataIndex: 'approveStatus',
                align: "center",
                render: (text) => {
                    if (text === 0) {
                        return <span className='awaitExamine'>待审核</span>;
                    } else if (text === 1) {
                        return <span>审核通过</span>;
                    } else if (text === 2) {
                        return <span className='noExamine'>审核不通过</span>;
                    }
                }
            }, {
                title: '操作',
                dataIndex: 'caozuo',
                align: "center",
                render: (text, record) => {
                    return <div>
                        <Tooltip title={record.approveStatus === 0 ? '审核' : '查看'}>
                                <span className='cursor' onClick={this.checkPerson.bind(this, record)}><i
                                    className='iconfont icon-yanjing'></i></span></Tooltip>
                    </div>;
                }
            }];
    }

    async checkPerson(record) {
        await this.props.getMessage({id: record.id});
        await this.props.modal({modalFlag: true, modalType: 'add'});
    }

    onSizeChangeQuery(current, pageSize) {
        const {onSizeChangequery} = this.props;
        onSizeChangequery(current, pageSize);
        this.props.page({current: current, pageSize: pageSize});
    }

    onShowSizeChange(current, pageSize) {
        const {onShowSizeChange} = this.props;
        onShowSizeChange(current, pageSize);
        this.props.page({current: 1, pageSize: pageSize});
    }

    render() {
        const {total, Current, PageSize, dataList} = this.props;
        return (
            <div>
                <div className='res-table'>
                    <LocaleProvider locale={zhCN}>
                        <Table bordered rowKey={record => record.id} columns={this.columns} dataSource={dataList}
                               pagination={false}/></LocaleProvider>
                </div>
                <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper
                                                          onShowSizeChange={this.onShowSizeChange.bind(this)}
                                                          onChange={this.onSizeChangeQuery.bind(this)} current={Current}
                                                          pageSize={PageSize}
                                                          defaultCurrent={1} total={total}/></LocaleProvider>
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {dataList, total, Current, PageSize, modalFlag, modalType} = state.enterpriseReducer;
    return {
        dataList,
        Current, PageSize,
        total,
        modalFlag, modalType
    };
};
export default connect(mapstateprops, action)(Tables);