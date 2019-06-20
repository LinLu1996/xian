import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import {Switch, Input,Table,Icon,Button,Upload,Modal,message } from 'antd';
import moment from "moment";

class modifyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailInfo: [],
            dataAll: {},
            previewVisible:false,
            previewImage:{}
        };
        const propsUpload = {
            name: 'file',
            accept: 'image/jpg,image/jpeg,image/png,image/bmp',
            action: '/company/file',
            listType: "picture-card",
            headers: {
                authorization: 'authorization-text'
            }
        };
        this.columns1 = [
            {
                title: '名称',
                dataIndex: 'title',
                align: 'left',
                width: 140
            }, {
                title: '上传内容',
                dataIndex: 'content',
                align: 'center',
                width: 300,
                render:(text,record) => {
                    if(record.approveAttr==='img') {
                        text.map((item,index) => {
                            item.uid=index;
                        });
                        return <div className={text.length>0? 'img-list':'img-list-all'}>
                                    <Upload {...propsUpload} fileList={text} onPreview={this.handlePicturePreview.bind(this)}>
                                    </Upload>
                                    <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handlePictureCancel.bind(this)}>
                                        <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                                    </Modal>
                            </div>;
                    } else if(text==='1') {
                        return <span>男</span>;
                    } else if(text==='0') {
                        return <span>女</span>;
                    } else {
                        return <span>{text}</span>;
                    }
                }
            }, {
                title: '审核结果',
                dataIndex: 'approveStatus',
                align: 'center',
                width: 120,
                render: (text, record,index) => {
                    let flag = false;
                    if (record.approveStatus === 1) {
                        flag = true;
                    } else {
                        flag = false;
                    }
                    return this.state.dataAll.approveStatus===0? <Switch checked={flag} onChange={this.changeStatus.bind(this,record,index)}/>:<Switch checked={flag} />;
                }
            }, {
                title: '详细原因',
                dataIndex: 'reason',
                align: 'center',
                render: (text, record,index) => {
                    if (record.approveStatus === 1) {
                        return <span>/</span>;
                    } else {
                        return this.state.dataAll.approveStatus === 0 ? <Input value={text} placeholder='请输入原因' onChange={this.handleReason1.bind(this,record,index)}/> :
                            <Input value={text} placeholder='请输入原因' disabled/>;
                    }
                }
            }];
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
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.currentMessage) {
            this.setState({
                dataAll:nextProps.currentMessage,
                detailInfo:nextProps.currentTable || []
            });
        }
    }
    changeStatus(record,index) {
        const {detailInfo} = this.state;
        if(record.approveStatus===0 || record.approveStatus===2) {
            record.approveStatus= 1;
            detailInfo[index+1].approveStatus=1;
        } else {
            record.approveStatus=0;
            detailInfo[index+1].approveStatus=0;
        }
        this.setState({
            detailInfo
        });
    }
    handleReason1(record,index,e) {
        const {detailInfo} = this.state;
        e.preventDefault();
        record.reason=e.target.value;
        detailInfo[index+1].reason=e.target.value;
        this.setState({
            detailInfo
        });
    }

    getForm(value) {
        this.formValitate = value;
    }

    hideModal() {   //点击确定的回调
        if(this.state.dataAll.approveStatus!==0) {
            this.props.modal({modalFlag: false, modeltype: 'add'});
            return;
        }
        const {Current,PageSize,startDate,endDate,mobilePhone} = this.props;
        const {detailInfo,dataAll} = this.state;
        const vm = {
            id: dataAll.id,
            name: dataAll.name,
            creditCode:dataAll.creditCode,
            address:dataAll.address,
            dingtalkId: dataAll.dingtalkId
        };
        const str=detailInfo.slice(1);
        const vm1={
            id:dataAll.registerEmploye.id,
            name:dataAll.registerEmploye.name,
            sex:dataAll.registerEmploye.sex,
            idCardNo:dataAll.registerEmploye.idCardNo,
            mobilePhone:dataAll.registerEmploye.mobilePhone
        };
        IOModel.EnterpriseSubmit({registerCompany:JSON.stringify(vm),employee:JSON.stringify(vm1),companyStr:JSON.stringify(str)}).then(res => {
            if(res.success) {
                message.success('操作成功');
                const vm = {
                    startTime: startDate ? new Date(`${moment(startDate).format('YYYY-MM-DD')} 00:00:00`).getTime() : undefined,
                    endTime: endDate ? new Date(`${moment(endDate).format('YYYY-MM-DD')} 23:59:59`).getTime() : undefined,
                    mobilePhone: mobilePhone,
                    startPage: Current,
                    limit: PageSize
                };
                this.props.allData(vm);
                this.props.modal({modalFlag: false, modalType: 'add'});
            } else {
                message.warning(res.message);
            }
        }).catch((res) => {
            message.error(res.message);
        });
    }

    hideCancel() {   //点击关闭的回调函数
        this.props.modal({modalFlag: false, modeltype: 'add'});
    }

    handleFormChange(changedFields) {
        const fields = this.props.fields;
        this.props.defaultFields({...fields, ...changedFields});
    }

    render() {
        const {detailInfo,dataAll} = this.state;
        let src = 'https://img.alicdn.com/tfs/TB1.gjxrVzqK1RjSZFvXXcB7VXa-451-146.png';
        if (dataAll.approveStatus &&  dataAll.approveStatus === 1) {
            src = 'https://img.alicdn.com/tfs/TB1dy6ur3DqK1RjSZSyXXaxEVXa-451-146.png';
        } else if (dataAll.approveStatus &&  dataAll.approveStatus === 2) {
            src = 'https://img.alicdn.com/tfs/TB1JHnrr9rqK1RjSZK9XXXyypXa-451-146.png';
        }
        return (
            <div>
                <div className='farming-admin-modal-mask'>
                    <div className='farming-admin-modal-examine' style={{width: '1000px'}}>
                        <div className='ant-modal-header'>
                            {/*<Tooltip placement='right' defaultVisible={true} title={title}
                                     trigger='focus' overlayClassName={className}><span className='title'>个人信息审核</span></Tooltip>*/}
                            <div><span className='title'>个人信息审核</span><img src={src}/></div>
                            <div className='ant-modal-close' onClick={this.hideCancel.bind(this)}><Icon type='close'/>
                            </div>
                        </div>
                        <div className='ant-modal-body enterprise-modal-body'>
                            <div className='enterprise-modal-body-table'>
                                <div className='enterprise-modal-left'>
                                    <ul className='enterprise-modal-ul'>
                                        <li>企业信息</li>
                                        <li>管理员信息</li>
                                    </ul>
                                </div>
                                <Table rowKey={record => record.id} columns={this.columns1}
                                               dataSource={detailInfo}
                                               pagination={false}></Table>
                            </div>
                        </div>
                        <div className='ant-modal-footer'>
                            <Button onClick={this.hideCancel.bind(this)}>取消</Button>
                            {dataAll.approveStatus === 0 && <Button type='primary' onClick={this.hideModal.bind(this)}>确认</Button>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {currentMessage,currentTable,Alldate, Cur, Psize, fields, modalflag, modaltype} = state.enterpriseReducer;
    return {
        currentMessage,
        currentTable,
        Cur,
        Psize,
        dataList: Alldate,
        fields: fields,
        modalflag, modaltype
    };
};
export default connect(mapstateProps, action)(modifyModal);
