import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
//import moment from 'moment';

import './index.less';
import {Modal, InputNumber, message, Table} from 'antd';


class modifyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data:[],
            visible: false
        };
    }

    componentWillReceiveProps(nextProps) {
      if(nextProps.fields.detail) {
        this.setState({
          data: nextProps.fields.detail.value
        });
      }
    }
    hideModal() {   //点击确定的回调
        const {Cur, Psize, modalTableType} = this.props;
        if (modalTableType === 'modify') {
            const modifydata = this.state.data;
            IOModel.Modifydata({reportPovertyjson:JSON.stringify(modifydata)}).then((res) => {  //修改成功时的回调
                if (res.success) {
                    if (res.data > 0) {
                        message.success('修改成功');
                        this.props.Alldatas({startPage: Cur, limit: Psize, year: this.props.year});
                    } else {
                        message.error('修改失败');
                    }
                } else {
                    message.error('修改失败');
                }
                this.props.modalTable({modalFlag: false});
            }).catch(() => {
                message.error('修改失败');
            });
        }
    }

    hideCancel() {   //点击关闭的回调函数
        this.props.modalTable({modalFlag: false, modeltype: 'add'});
    }

    handleFormChange(changedFields) {
        const fields = this.props.fields;
        this.props.defaultFields({...fields, ...changedFields});
    }

    change(index,record,value) {
      const {data} = this.state;
      if(data[index].month === record.month) {
        data[index].amount = value;
      }
      this.setState({
        data: data
      });
    }
    render() {
        const { modalTableflag} = this.props;
        const {data} = this.state;
        const title = "编辑扶贫投入";
        let detail = [];
        if(data) {
          detail = data;
        }
      this.columns = [
        {
          title: '月份',
          dataIndex: 'month',
          align: "center"
        },
        {
          title: '金额',
          dataIndex: 'amount',
          align: "center",
          render:(text,record,index) => {
              return <InputNumber defaultValue={record.amount} value={record.amount} onChange={this.change.bind(this,index,record)}/>;
          }
        }
      ];
        return (
            <div>
                <Modal
                    title={title}
                    visible={modalTableflag}
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName='farming-admin-modal'
                >
                  {/*<div className='gover-aid-date-title'>扶贫金额维护</div>*/}
                  <Table bordered rowKey={record => record.month} columns={this.columns} dataSource={detail} total={detail.length} pagination={false}/>
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {Alldate, isOk, parentname, parentID, Cur, Psize, fields, modalTableType, chooseCUR, chooseSIZE, modalTableflag, TreeD, slideID, modifyID, slideparentID, slideName} = state.govermentaiddataReducer;
    return {
        dataList: Alldate,
        isok: isOk,
        parentName: parentname,
        parentID, modifyID,
        Cur,
        Psize,
        fields: fields,
      modalTableType, modalTableflag, TreeD, slideID,
        chooseCUR, chooseSIZE, slideparentID, slideName
    };
};
export default connect(mapstateProps, action)(modifyModal);
