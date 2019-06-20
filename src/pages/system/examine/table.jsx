import {Table, Pagination, LocaleProvider, Switch, Input, Button, Icon, message, Tooltip} from 'antd';
import {connect} from 'react-redux';
import {action, IO} from './model';
import {Component} from 'react';
import zhCN from "antd/lib/locale-provider/zh_CN";
import moment from "moment";

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailInfo: [],
            detailData: {}
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
            title: '类型',
            dataIndex: 'type',
            align: "center",
            render: () => {
                return <span>个人</span>;
            }
        }, {
            title: '姓名',
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
        this.detailColumns = [{
            title: '名称',
            dataIndex: 'title',
            align: 'left',
            width: 120
        }, {
            title: '上传内容',
            dataIndex: 'content',
            align: 'left',
            width: 180,
            render: (text) => {
                let sex = text;
                if (text === '0') {
                    sex = '女';
                } else if (text === '1') {
                    sex = '男';
                }
                return <span>{sex}</span>;
            }
        }, {
            title: '审核结果',
            dataIndex: 'approveStatus',
            align: 'center',
            width: 120,
            render: (text, record, index) => {
                let flag = false;
                if (record.approveStatus === 1) {
                    flag = true;
                }
                if (this.props.modalType === 0) {
                    return <Switch checked={flag} onChange={(e) => {this.changeInfo(index,'result',e);}}/>;
                } else {
                    return <Switch checked={flag}/>;
                }
            }
        }, {
            title: '详细原因',
            dataIndex: 'reason',
            align: 'center',
            render: (text, record, index) => {
                if (record.approveStatus === 1) {
                    return <span>/</span>;
                } else {
                    if (this.props.modalType === 0) {
                        return <Input value={text} placeholder='请输入原因' onChange={(e) => {this.changeInfo(index,'reason',e);}}/>;
                    } else {
                        return <Input value={text} placeholder='请输入原因' disabled/>;
                    }
                }
            }
        }];
    }

    changeInfo(index,text,event) {
        const {detailInfo} = this.state;
        if (text === 'reason') {
            detailInfo[index].reason = event.target.value;
        } else if (text === 'result') {
            let result = 0;
            if (event) {
                detailInfo[index].reason = '';
                result = 1;
            }
            detailInfo[index].approveStatus = result;
        }
        this.setState({
            detailInfo: [...detailInfo]
        });
    }

    async checkPerson(record) {
        let type = '';
        await IO.examine.getUserInfo({id: record.id}).then((res) => {
            if (res.success) {
                const data = res.data;
                const info = data.registerApproves||[];
                if (info.length > 0) {
                    info.sort(function (a, b) {
                        return a.sort - b.sort;
                    });
                }
                type = data.approveStatus;
                this.setState({
                    detailInfo: info,
                    detailData: data
                });
            }
        });
        this.props.modal({modalFlag: true, modalType: type});
    }

    onSizeChangeQuery(current, pageSize) {
        this.props.onSizeChangeQuery(current, pageSize);
        this.props.page({current: current, pageSize: pageSize});
    }

    onShowSizeChange(current, pageSize) {
        this.props.onShowSizeChange(current, pageSize);
        this.props.page({current: 1, pageSize: pageSize});
    }

    hideModal() {
        const {detailData, detailInfo} = this.state;
        const {Current, PageSize, startDate, endDate, mobilePhone} = this.props;
        const vm = {
            id: detailData.id,
            name: detailData.name,
            sex: detailData.sex,
            mobilePhone: detailData.mobilePhone,
            idCardNo: detailData.idCardNo,
            str: JSON.stringify(detailInfo)
        };
        IO.examine.updateUserInfo(vm).then((res) => {
            if (res.success) {
                const vm = {
                    startTime: startDate ? new Date(`${moment(startDate).format('YYYY-MM-DD')} 00:00:00`).getTime() : undefined,
                    endTime: endDate ? new Date(`${moment(endDate).format('YYYY-MM-DD')} 23:59:59`).getTime() : undefined,
                    mobilePhone: mobilePhone,
                    startPage: Current,
                    limit: PageSize
                };
                this.props.allData(vm);
                message.success('操作成功');
                this.props.modal({modalFlag: false, modalType: 0});
            } else {
                message.error(res.message);
            }
        }).catch((res) => {
            message.error(res.message);
        });
    }

    hideCancel() {
        this.props.modal({modalFlag: false, modalType: 0});
    }

    render() {
        const {detailInfo} = this.state;
        const {total, Current, PageSize, modalFlag, modalType, dataList} = this.props;
        let src = 'https://img.alicdn.com/tfs/TB1.gjxrVzqK1RjSZFvXXcB7VXa-451-146.png';
        if (modalType === 1) {
            src = 'https://img.alicdn.com/tfs/TB1dy6ur3DqK1RjSZSyXXaxEVXa-451-146.png';
        } else if (modalType === 2) {
            src = 'https://img.alicdn.com/tfs/TB1JHnrr9rqK1RjSZK9XXXyypXa-451-146.png';
        }
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
                {modalFlag && <div className='farming-admin-modal-mask'>
                    <div className='farming-admin-modal-examine' style={{width: '800px'}}>
                        <div className='ant-modal-header'>
                            {/*<Tooltip placement='right' defaultVisible={true} title={title}
                                     trigger='focus' overlayClassName={className}><span className='title'>个人信息审核</span></Tooltip>*/}
                            <div><span className='title'>个人信息审核</span><img src={src}/></div>
                            <div className='ant-modal-close' onClick={this.hideCancel.bind(this)}><Icon type='close'/>
                            </div>
                        </div>
                        <div className='ant-modal-body'>
                            <Table bordered rowKey={record => record.id} columns={this.detailColumns}
                                   dataSource={detailInfo}
                                   pagination={false}></Table>
                        </div>
                        <div className='ant-modal-footer'>
                            <Button onClick={this.hideCancel.bind(this)}>取消</Button>
                            {modalType === 0 && <Button type='primary' onClick={this.hideModal.bind(this)}>确认</Button>}
                        </div>
                    </div>
                </div>}
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {total, Current, PageSize, dataList, modalFlag, modalType} = state.examineReducer;
    return {
        Current, PageSize,
        dataList, total,
        modalFlag, modalType
    };
};
export default connect(mapstateprops, action)(Tables);