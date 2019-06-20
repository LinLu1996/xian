import {Table, Pagination, message, Tooltip, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {Component} from 'react';
import {IO} from '@/app/io';
import Com from '@/component/common';
import moment from "moment";
import zhCN from 'antd/lib/locale-provider/zh_CN';
class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            statusloading: false,
            psize: 10,
            recordid: -1
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'key',
            width: 100,
            key: 'key',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        },{
            title: '上级节点',
            dataIndex: 'parentName',
            align: 'left',
            render: (text) => {
                return <Tooltip title={text}><span style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}>{text}</span></Tooltip>;
            }
        }, {
            title: '节点名称',
            dataIndex: 'nodeName',
            sorter: true,
            align: 'left',
            render: (text) => {
                return <Tooltip title={text}><span style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}>{text}</span></Tooltip>;
            }
        }, {
            title: '节点编码',
            dataIndex: 'nodeCode',
            align: 'left',
            render: (text) => {
                return <Tooltip title={text}><span style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}>{text}</span></Tooltip>;
            }
        },{
            title: '创建时间',
            dataIndex: 'gmtCreate',
            sorter: true,
            render: (text) => {
                const time = moment(text).format('YYYY-MM-DD');
                return <Tooltip title={time}><span style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                    }}>{time}</span></Tooltip>;
                }
            }, {
                title: '创建人',
                dataIndex: 'createUserName',
                align: 'left'
            },{
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    return <div>
                        {
                            (Com.hasRole(this.props.securityKeyWord, 'node_update', 'update', 'node')) ?
                                <Tooltip placement="top" title='编辑'><span className='cursor'
                                                                          onClick={this.query.bind(this, record)}><i
                                    className='iconfont icon-xiugai07'></i></span></Tooltip> : ''}
                        {
                            (Com.hasRole(this.props.securityKeyWord, 'node_delete', 'delete', 'node')) ?
                                <Tooltip placement="top" title='删除'><span
                                    onClick={this.showDeleteConfirm.bind(this, record)}>
                    <span className='cursor'><i
                        className='iconfont icon-shanchu'></i></span>
                </span></Tooltip> : ''}
                        {
                            (Com.hasRole(this.props.securityKeyWord, 'node_updateByCompanyId', 'update', 'node')) ?
                                <Tooltip title="分配公司"><span className='cursor'
                                                            onClick={this.props.empdepshow.bind(this, record)}><i
                                    className='iconfont icon-ziyuanfenpei'></i></span></Tooltip> : ''
                        }
                    </div>;
                }
            }];
    }

    onChange(text, record, checked) {
        let str;
        checked ? str = 0 : str = 1;
        this.setState({
            statusloading: true,
            recordid: record.id
        });
        IO.resources.setStatus({resId: record.id, status: str}).then((res) => {
            if (res.success) {
                if (this.props.Treeflag) {
                    this.props.Alldatas({
                        sortField: this.props.sortfield,
                        sortOrder: this.props.sortorder,
                        nodeName: this.props.Nameval,
                        startPage: this.props.current,
                        limit: this.state.psize
                    });
                } else {
                    this.props.chooseAll({
                        sortField: this.props.sortfield,
                        sortOrder: this.props.sortorder,
                        nodeName: this.props.Nameval,
                        id: this.props.slideID,
                        startPage: this.props.current,
                        limit: this.state.psize
                    });
                }
                this.setState({
                    statusloading: false
                });
                if (str === 1) {
                    message.success('禁用成功');
                } else {
                    message.success('启用成功');
                }
            }
        }).catch((res) => {
            this.setState({
                statusloading: false
            });
            Com.errorCatch(res);
        });
    }

    showDeleteConfirm(record,e) {
        this.props.showDeleteConfirm(record,e);
    }
    query(record,e) {
        this.props.query(record,e);
    }

    onSizeChange(current, pageSize) {
        const {chooseFlag, queryFlag, onsizeChange} = this.props;
        if (queryFlag) {
            onsizeChange('query', current, pageSize);
        } else if (chooseFlag) {
            onsizeChange('choose', current, pageSize);
        } else {
            this.props.onsizeChange('size', current, pageSize);
        }
    }

    onTableChange(pagination, filters, sorter) {
        this.props.onTableChange(pagination, filters, sorter);
    }
    onShowSizeChange(current, pageSize) {
        this.setState({
            psize:pageSize
        });
        this.props.getpsize(pageSize,current);
        if (this.props.Treeflag) {
            this.props.Alldatas({
                sortField: this.props.sortfield,
                sortOrder: this.props.sortorder,
                nodeName: this.props.Nameval,
                startPage: current,
                limit: pageSize
            });
        } else {
            this.props.chooseAll({
                sortField: this.props.sortfield,
                sortOrder: this.props.sortorder,
                nodeName: this.props.Nameval,
                id: this.props.slideID,
                startPage: current,
                limit: pageSize
            });
        }
    }
    render() {
        const {total, data, flag, current, securityKeyWord} = this.props;
        let arr;
        Com.hasRole(securityKeyWord, 'node_update', 'update', 'node') || Com.hasRole(securityKeyWord, 'node_delete', 'delete', 'node') || Com.hasRole(securityKeyWord, 'node_updateByCompanyId', 'update', 'node') ? arr = this.columns : arr = this.columns.slice(0, this.columns.length - 1);
        return (
            <div>
                <div className='res-table'>
                    <Table
                        bordered
                        onChange={this.onTableChange.bind(this)}
                        columns={arr}   dataSource={data} pagination={false} loading={flag}/>
                </div>
                <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChange.bind(this)} current={current} defaultCurrent={1}  total={total} /></LocaleProvider>
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {total, parentname, sortfield, sortorder, TreeD, slideID, flag} = state.nodeReducer;
    const {securityKeyWord} = state.initReducer;
    return {
        total: total,
        TreeD,
        parentName: parentname,
        slideID,
        flag,
        list: state.systemReducer.listdata,
        securityKeyWord,
        sortfield, sortorder
    };
};
export default connect(mapstateprops, action)(Tables);