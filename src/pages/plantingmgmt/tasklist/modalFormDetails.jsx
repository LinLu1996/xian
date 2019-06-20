import { Component } from 'react';
import {connect} from 'react-redux';
import {action,IOModel} from './model';
import { Modal, InputNumber, message, Button } from 'antd';
import moment from "moment";
import './index.less';
class CustomizedForm extends Component {
    constructor(props) {
        super(props);
        this.state={
            actualQty: this.props.actualQty
        };
    }
    componentWillReceiveProps(nextProps) {
      this.setState({
        actualQty: nextProps.actualQty
      });
      /*if(nextProps.workTypeCode.value === 'harvest') {
      }
      if(nextProps.materialName.value) {
        this.setState({
          actualQty: nextProps.actualQty
        });
      }*/
    }
    handleActualQtyChange(event) {
        this.setState({
            actualQty: event
        });
        // this.props.actualQty = event.target.value;
        this.props.changeProps(event);
    }
    //const {ag_code,varieties,plantingBase,plantingLand,task,plan_time,use,dosage,realDosage} =props;
    render() {
        const planTimeFormat = moment(this.props.planTime.value).format('YYYY-MM-DD');
        return (
            <ul>
                <li><b>农事计划编号：</b><span>{this.props.planNo.value}</span></li>
                <li><b>种植作物：</b><span>{this.props.cropName.value}</span></li>
                <li><b>种植基地：</b><span>{this.props.baseName.value}</span></li>
                <li><b>种植地块：</b><span>{this.props.landName.value}</span></li>
                <li><b>农事任务：</b><span>{this.props.name.value}</span></li>
                <li><b>计划时间：</b><span>{planTimeFormat}</span></li>
                {(this.props.workTypeCode.value !== 'harvest' && this.props.materialName.value && this.props.materialName.value !=='---') && <li><b>使用农资：</b><span>{this.props.materialName.value}</span></li>}
                {(this.props.workTypeCode.value !== 'harvest' && this.props.materialName.value && this.props.materialName.value !=='---') &&<li><b>计划用量：</b><span>{this.props.planQty.value}{this.props.dosageUnit.value}</span></li>}
                {(this.props.workTypeCode.value !== 'harvest' && this.props.materialName.value && this.props.materialName.value !=='---') &&
                        <li>
                            <b>实际用量：</b>
                            {this.props.modeltype.value !== 'modify' ? <span>{this.props.actualQty.value}{this.props.dosageUnit.value}</span> :
                                <span><InputNumber style={{width:100}} min={0} value={this.state.actualQty}  onChange={this.handleActualQtyChange.bind(this)}/>{this.props.dosageUnit.value}</span>
                            }
                        </li>}
                {this.props.workTypeCode.value === 'harvest' &&
                    <li>
                        <b>采收数量：</b>
                        {this.props.modeltype.value !== 'modify' ? <span>{this.props.recoveryQty.value}{this.props.unit.value}</span>  :
                            <span><InputNumber style={{width:100}} min={0} value={this.state.actualQty}  onChange={this.handleActualQtyChange.bind(this)}/>{this.props.unit.value}</span>
                        }
                    </li>
                }
            </ul>
            /*<div>
                <div className='agr-detail'>
                    <span className='agr-detail-listl'>农事计划编号：</span>
                    <span className='agr-detail-listr'>{this.props.planNo.value}</span>
                </div>
                <div className='agr-detail'>
                    <span className='agr-detail-listl'>种植作物：</span>
                    <span className='agr-detail-listr'>{this.props.cropName.value}</span>
                </div>
                <div className='agr-detail'>
                    <span className='agr-detail-listl'>种植基地：</span>
                    <span className='agr-detail-listr'>{this.props.baseName.value}</span>
                </div>
                <div className='agr-detail'>
                    <span className='agr-detail-listl'>种植地块：</span>
                    <span className='agr-detail-listr'>{this.props.landName.value}</span>
                </div>
                <div className='agr-detail'>
                    <span className='agr-detail-listl'>农事任务：</span>
                    <span className='agr-detail-listr'>{this.props.name.value}</span>
                </div>
                <div className='agr-detail'>
                    <span className='agr-detail-listl'>计划时间：</span>
                    <span className='agr-detail-listr'>{planTimeFormat}</span>
                </div>
                {(this.props.workTypeCode.value !== 'harvest' && this.props.materialName.value && this.props.materialName.value !=='---') && <div>
                    <div className='agr-detail'>
                        <span className='agr-detail-listl'>使用农资：</span>
                        <span className='agr-detail-listr'>{this.props.materialName.value}</span>
                    </div>
                    <div className='agr-detail'>
                        <span className='agr-detail-listl'>计划用量：</span>
                        <span className='agr-detail-listr'>{this.props.planQty.value}{this.props.dosageUnit.value}</span>
                    </div>
                  {
                    this.props.materialName.value ?
                      <div className='agr-detail'>
                        <span className='agr-detail-listl'>实际用量：</span>
                        {this.props.modeltype.value !== 'modify'?<span className='agr-detail-listr'>{this.props.actualQty.value}{this.props.dosageUnit.value}</span> :
                          <div className='agr-detail-listr'><InputNumber style={{width:100}} min={0} value={this.state.actualQty}  onChange={this.handleActualQtyChange.bind(this)}/>{this.props.dosageUnit.value}</div>}
                      </div>:''
                  }
                </div>}
                {this.props.workTypeCode.value === 'harvest' && <div>
                    <div className='agr-detail'>
                        <span className='agr-detail-listl'>采收数量：</span>
                        {this.props.modeltype.value !== 'modify'?<span className='agr-detail-listr'>{this.props.recoveryQty.value}{this.props.unit.value}</span> :
                            <div className='agr-detail-listr'><InputNumber style={{width:100}} min={0} value={this.state.actualQty}  onChange={this.handleActualQtyChange.bind(this)}/>{this.props.unit.value}</div>}
                    </div>
                </div>}
            </div>*/
        );
    }
}

class modifyModal extends Component {
  constructor(props) {
      super(props);
      this.state={
        visible: false,
          actualQty: ''
      };
  }
    componentDidMount() {
        this.setState({
            actualQty: ''
        });
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.fields) {
          if(nextProps.fields.workTypeCode && nextProps.fields.workTypeCode.value === 'harvest') {
            this.setState({
              actualQty: nextProps.fields.recoveryQty
            });
          }
          if(nextProps.fields.materialName && nextProps.fields.materialName.value) {
            this.setState({
              actualQty: nextProps.fields.actualQty
            });
          }
        }
    }
  changeProps(val) {
      this.setState({
          actualQty: val
      });
  }
  hideModal() {   //点击确定的回调
      const {fields} = this.props;
      if(fields.modeltype.value === 'modify') {
          if(this.props.fields.materialName.value && this.props.fields.materialName.value !=='---' && (this.state.actualQty === null || this.state.actualQty === '')) {
              message.warning("请输入实际数量");
              return;
          }
          /*if (!this.state.actualQty.match(/^[0-9]*$/)) {
              message.warning("实际数量为数字");
              return;
          }*/

          const vm = {
              baseId: fields.baseId.value,
              companyId: 1,
              landId: fields.landId.value,
              qty: this.state.actualQty,
              taskId: fields.id.value,
              workTypeCode: fields.workTypeCode.value,
              userId: 1,
              employeeId: fields.employeeId.value,
              supervisor: fields.supervisor.value,
              cropId: fields.cropId.value,
              planId: fields.planId.value,
              unitName: (fields.workTypeCode.value === 'harvest') ? fields.unit.value : fields.dosageUnit.value
          };
          IOModel.FinishTask(vm).then((res) => {
              if(res.success) {
                  if(res.data > 0) {
                      message.success("上报成功");
                      this.props.modalDetails({modalFlagDetails:false,modeltype:'modify'});
                      const search = fields.search;
                      search.startPage = 1;
                      search.limit = 10;
                      search.pageSize=10;
                      search.taskStatus = fields.taskStatus.value;
                      const str = JSON.stringify(search);
                      this.props.queryAll({str:str});
                      this.props.page({current: 1, pageSize: 10});
                      //this.props.Alldatas({startPage:1,limit:10,userId: 1,companyId: 1,taskStatus: fields.taskStatus.value});
                  }else{
                    Modal.error({
                      title: '提示',
                      content:res.message
                    });
                  }
              }
          }).catch((res) => {
            Modal.error({
              title: '提示',
              content:res.message
            });
          });
      }else{
          this.props.modalDetails({modalFlagDetails:false,modeltype:'modify'});
      }
  }
  hideCancel() {   //点击关闭的回调函数
    this.props.modalDetails({modalFlagDetails:false,modeltype:'add'});
    this.setState({
      actualQty: ''
    });
  }
    afterClose() {
      this.setState({
          actualQty: ''
      });
    }
    handleFormChange (changedFields) {  //表单变化时
        const fields = this.props.fields;
        this.props.defaultFields( { ...fields, ...changedFields });
    }
  render() {
    const { modalflagDetails,fields,modaltype } = this.props;
    let title="任务详情";
    if(modaltype === 'modify') {
        title="任务结果上报";
    }
    return (
      <div>
          {modaltype === 'modify' ? <Modal
          title={title}
          visible={modalflagDetails}
          destroyOnClose={true}
          onOk={this.hideModal.bind(this)}
          onCancel={this.hideCancel.bind(this)}
          okText="完成"
          cancelText="取消"
          wrapClassName='farming-admin-modal'
          afterClose={this.afterClose.bind(this)}
        >
        <CustomizedForm {...fields} changeProps={this.changeProps.bind(this)} actualQty={this.state.actualQty}/>
        </Modal> :
              <Modal className='close-button-modal'
                  title={title}
                  visible={modalflagDetails}
                  footer={[
                      <Button className='tasklist-modal-close' key="submit" type="primary" onClick={this.hideCancel.bind(this)}>
                          关闭
                      </Button>
                  ]}
                  onCancel={this.hideCancel.bind(this)}
                  wrapClassName='farming-admin-modal'
              >
                  <CustomizedForm {...fields} changeProps={this.changeProps.bind(this)}/>
              </Modal>
          }
      </div>
    );
  }
}
const mapstateProps = (state) => {
  const {Alldate,isOk,parentname,parentID,Cur,Psize,fields,modalflag,modalflagDetails,chooseCUR, chooseSIZE,modaltype, TreeD, slideID,modifyID,slideparentID,slideName} = state.agriculturalTaskReducer;
  return {
    dataList:Alldate,
    isok:isOk,
    parentName:parentname,
    parentID,modifyID,
    Cur,
    Psize,
    fields:fields,
    modalflag,
    modalflagDetails,modaltype,TreeD,slideID,
    chooseCUR, chooseSIZE,slideparentID,slideName
  };
};
export default connect(mapstateProps, action)(modifyModal);
