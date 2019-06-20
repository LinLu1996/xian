import {Table, Pagination, Modal, Tooltip, message, Upload} from 'antd';
import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IO} from './model';
import Com from '@/component/common';
import moment from 'moment';

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            psize: 10,
            cont: '',
            detailsVisible: true,
            record: null,
            selectedRowKeys: [],
            statusloading: false,
            recordid: -1,
            previewImage: '',
            previewVisible: false,
            modalflag: false
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
            },{
                title: '上级公司',
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
            },{
                title: '公司名称',
                dataIndex: 'companyName',
                sorter: true,
                align: 'left'
            }, {
                title: '公司编码',
                dataIndex: 'companyCode',
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
                title: '公司类型',
                dataIndex: 'companyType',
                align: 'left',
                width: 90
            }, {
                title: '基地数量',
                dataIndex: 'baseCount',
                align: 'right',
                width: 90,
                render: (text,record) => {
                    return <div className="hand-point"><Tooltip title='基地详情'>
                        <a onClick={this.openTable.bind(this,record,'base')}>{text}</a>
                    </Tooltip></div>;
                }
            }, {
                title: '地块数量',
                dataIndex: 'landCount',
                align: 'right',
                width: 90,
                render: (text, record) => {
                    return <div className="hand-point"><Tooltip title='地块详情'>
                        <a onClick={this.openTable.bind(this,record,'land')}>{text}</a>
                    </Tooltip></div>;
                }
            }, {
                title: '创建时间',
                dataIndex: 'gmtCreate',
                sorter: true,
                render: (text) => {
                    return moment(text).format('YYYY-MM-DD');
                }
            }, {
                title: '创建人',
                dataIndex: 'createUserName',
                align: 'left',
                width: 80
            }, {
                title: '操作',
                dataIndex: 'operation',
                width: 180,
                render: (text, record) => {
                    return <div>
                        <Tooltip placement="top" title='详情'><span className='cursor'
                                                                  onClick={this.details.bind(this, record)}><i
                            className='iconfont icon-xiangqing'></i></span></Tooltip>
                        {
                            (Com.hasRole(this.props.securityKeyWord, 'company_update', 'update','company')) ?
                                <Tooltip placement="top" title='编辑'><span className='cursor'
                                                                          onClick={this.query.bind(this, record)}
                                                                          ><i
                                    className='iconfont icon-xiugai07'></i></span></Tooltip> : ''}
                        {
                            (Com.hasRole(this.props.securityKeyWord, 'company_delete', 'delete','company')) ?
                                <span>{(record.companyNameEn !== 'system2register' && record.companyNameEn !== 'system2virtual') ? <Tooltip placement="top" title='删除'><span
                                    onClick={this.showDeleteConfirm.bind(this, record)}>
                        <span className='cursor'><i
                            className='iconfont icon-shanchu'></i></span>
                    </span></Tooltip> : <Tooltip placement="top" title='不可删除'><span>
                        <span className='cursor-disabled'><i
                            className='iconfont icon-shanchu'></i></span>
                                </span></Tooltip>}</span> : ''}
                        {
                            (Com.hasRole(this.props.securityKeyWord, 'companyResource_updateByCompanyId', 'update', 'company')) ?
                                <Tooltip placement="top" title='分配资源'><span className='cursor'
                                                                            onClick={this.props.empdepshow.bind(this, record)}
                                                                            ><i
                                    className='iconfont icon-ziyuanfenpei'></i></span></Tooltip>
                                : ''}
                    </div>;
                }
            }];
    }

    openTable(record,type) {
        if (type === 'base') {
            if (record.baseCount <= 0) {
                message.warning('没有可查看的基地');
                return false;
            }
        } else {
            if (record.landCount <= 0) {
                message.warning('没有可查看的地块');
                return false;
            }
        }
        const {tableCur, tableSize} = this.props;
        this.props.tableSearch({type: type, id: record.id, startPage: tableCur, limit: tableSize});
        this.props.tableModal({tableCur: 1, tableSize: 10, tableFlag: true, tableType: type, tableId: record.id});
    }

    async handlePicturePreview(file) {
        await this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        });
    }

    handlePictureCancel() {
        this.setState({previewVisible: false });
    }

    query(record,e) {
        this.props.query(record,e);
    }

    showDeleteConfirm(record,e) {
        this.props.showDeleteConfirm(record,e);
    }

    handleCancel() {
        //this.detailsCont(false, this.state.record);
        this.setState({
            modalflag: false
        });
    }

    handleOk() {
        //this.detailsCont(false, this.state.record);
        this.setState({
            modalflag: false
        });
    }

    async details(record) {
        const fileList = [];
        await IO.company.getPhoneList({id: record.id}).then((res) => {
            if (res.success) {
                const data = res.data || [];
                data.map((item, index) => {
                    item.uid = index;
                    item.status = 'done';
                    fileList.push(item);
                });
            }
        });
        this.setState({
            record: record,
            modalflag: true,
            fileList: fileList
        });
       /* this.detailsCont(true, record);*/
    }

    onSizeChange(current, pageSize) {
        const {queryFlag, chooseFlag, onsizeChange} = this.props;
        if (queryFlag) {
            onsizeChange('query', current, pageSize);
        } else if (chooseFlag) {
            onsizeChange('choose', current, pageSize);
        } else {
            onsizeChange('size', current, pageSize);
        }
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
                companyName: this.props.Nameval,
                startPage: current,
                limit: pageSize
            });
        } else {
            this.props.chooseAll({
                sortField: this.props.sortfield,
                sortOrder: this.props.sortorder,
                companyName: this.props.Nameval,
                parentId: this.props.slideID,
                startPage: current,
                limit: pageSize
            });
        }
    }

    onTableChange(pagination, filters, sorter) {
        this.props.onTableChange(pagination, filters, sorter);
    }

    render() {
        const {record, fileList, previewVisible, previewImage, modalflag} = this.state;
        const {total, data, flag, current,securityKeyWord} = this.props;
        const propsUpload = {
            name: 'file',
            accept: 'image/jpg,image/jpeg,image/png,image/bmp',
            action: '/company/file',
            fileList: fileList,
            listType: "picture-card",
            headers: {
                authorization: 'authorization-text'
            }
        };
        let arr;
        const me = this;
        Com.hasRole(securityKeyWord, 'company_update', 'update','company') || Com.hasRole(securityKeyWord, 'company_delete', 'delete','company') ? arr = this.columns : arr = this.columns.slice(0, this.columns.length - 1);
        const PaginOpt = {
            defaultPageSize: me.state.psize,
            defaultCurrent:1,
            total:total,
            current:current,
            onChange:me.onSizeChange.bind(me),
            onShowSizeChange:me.onShowSizeChange.bind(me)
        };
        return (
            <div>
                <div className='res-table'>
                    <Table bordered   columns={arr} onChange={this.onTableChange.bind(this)}
                           dataSource={data} pagination={false} loading={flag}/>
                    { modalflag && <Modal
                        title="公司详情"
                        visible={modalflag}
                        okText="确认"
                        cancelText="取消"
                        onOk={this.handleOk.bind(this)}
                        onCancel={this.handleCancel.bind(this)}
                        wrapClassName='farming-admin-modal company-modal'
                    >
                        <ul>
                            <li><b>上级公司：</b><span>{record.parentName}</span></li>
                            <li><b>公司名称：</b><span>{record.companyName}</span></li>
                            <li><b>公司类型：</b><span>{record.companyType}</span></li>
                            <li><b>所属节点：</b><span>{record.nodeName}</span></li>
                            <br/>
                            <li><b>营业执照：</b></li>
                        </ul>
                        {fileList && fileList.length > 0 && <div className="show-picture">
                            <Upload {...propsUpload} onPreview={this.handlePicturePreview.bind(this)}>
                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handlePictureCancel.bind(this)}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </div>}
                    </Modal>}
                </div>
                <Pagination className='XGres-pagination' showSizeChanger showQuickJumper {...PaginOpt}/>
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {total, deleteOK, flag, sortfield, sortorder, slideID, tableCur, tableSize} = state.companyReducer;
    const {securityKeyWord} = state.initReducer;
    return {
        total,
        deleteok: deleteOK,
        flag, slideID,
        list: state.systemReducer.listdata,
        securityKeyWord,
        sortfield, sortorder, tableCur, tableSize
    };
};
export default connect(mapstateprops, action)(Tables);