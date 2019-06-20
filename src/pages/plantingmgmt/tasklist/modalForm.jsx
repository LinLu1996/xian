
import { Component } from 'react';
import {connect} from 'react-redux';
import {action,IOModel} from './model';
import moment from 'moment';
import { Modal, Input, Form, message} from 'antd';
const FormItem = Form.Item;
const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
      return {
        id: Form.createFormField({
            value: props.id.value
        }),
        ag_code: Form.createFormField({
            value: props.ag_code.value
        }),
        varieties: Form.createFormField({
            value: props.varieties.value
        }),
        crop_name: Form.createFormField({
            value: props.crop_name.value
        }),
        plantingBase: Form.createFormField({
            value: props.plantingBase.value
        }),
        plantingLand: Form.createFormField({
            value: props.plantingLand.value
        }),
        task: Form.createFormField({
            value: props.task.value
        }),
        plan_time: Form.createFormField({
            value: props.plan_time.value
        }),
        use: Form.createFormField({
            value: props.use.value
        }),
        dosage: Form.createFormField({
            value: props.dosage.value
        }),
        realDosage: Form.createFormField({
            value: props.realDosage.value
        })
      };
    }
})((props) => {
  const { getFieldDecorator } = props.form;
  const { modeltype,ag_code,varieties,plantingBase,plantingLand,task,plan_time,use,dosage,realDosage,handleC } = props;
  let isEdit=false;
  let createTime="";
  let stauts="";
  if( modeltype.value==='modify') {
    isEdit=true;
    createTime= moment(props.createTime.value).format('YYYY-MM-DD HH:mm:ss');
    stauts=props.stauts.value===0?"正常":"禁止";
  }
  return (
    <Form layout="inline">
       <FormItem label="农事计划编号">
        {getFieldDecorator('ag_code', {
          rules: [{required: true}]
        })(<Input value={ag_code.value} onChange={handleC(event)}/>)}
      </FormItem>
      <FormItem label="种植品种">
        {getFieldDecorator('varieties', {
          rules: []
        })(<Input value={varieties.value} />)}
      </FormItem>
      <FormItem label="种植基地">
        {getFieldDecorator('plantingBase', {
          rules: [{required: true}]
        })(<Input value={plantingBase.value} />)}
      </FormItem>
      <FormItem label="种植地块">
        {getFieldDecorator('plantingLand', {
          rules: [{required: true}]
        })(<Input value={plantingLand.value} />)}
      </FormItem>
      <FormItem label="农事任务">
        {getFieldDecorator('task', {
          rules: []
        })(<Input value={task.value} />)}
      </FormItem>
      <FormItem label="计划时间">
        {getFieldDecorator('plan_time', {
          rules: []
        })(<Input value={plan_time.value} />)}
      </FormItem>
      <FormItem label="使用农资">
          {getFieldDecorator('use', {
            rules: []
          })(<Input value={use.value} />)}
      </FormItem>
      <FormItem label="计划用量">
        {getFieldDecorator('dosage', {
          rules: []
        })(<Input value={dosage.value} />)}
      </FormItem>
      <FormItem label="实际用量">
          {getFieldDecorator('realDosage', {
            rules: []
          })(<Input value={realDosage.value} />)}
      </FormItem>
      { isEdit&&<FormItem label="创建时间">
        {getFieldDecorator('createTime', {
          rules: []
        })(<div>{<div>{createTime}</div>}</div>)}
      </FormItem>}
      { isEdit&&<FormItem label="状态">
        {getFieldDecorator('stauts', {
          rules: []
        })(<div>{stauts}</div>)}
      </FormItem>}
    </Form>
  );
});

class modifyModal extends Component {
  constructor(props) {
      super(props);
      this.state={
        visible: false
      };
  }
  hideModal() {   //点击确定的回调
    const {name,longitude,latitude,phone,address} = this.props.fields;
    const {Cur, Psize,modaltype} = this.props;

    if(!name.value || !longitude.value || !latitude.value) {
      message.warning('带*号的为必填的哦！');
      return;
    }
     this.props.modal({modalFlag:false});
    if(modaltype==='add') {
     const addData = {
        companyId:1,
        userId:1,
        name:name.value,
        longitude:longitude.value,
        latitude:latitude.value,
        phone:phone.value,
        address:address.value
      };
      IOModel.Adddata(addData).then((res) => {  //添加成功时的回
        if(res.success) {
          message.success('添加成功😯');
          this.props.Alldatas({startPage:1,limit:Psize});
            this.props.page({current: 1, pageSize: Psize});
        }
      }).catch();

    }else if(modaltype==='modify') {
      const modifydata = {
        id: this.props.fields.id.value,
        companyId:1,
        createUserId:1,
        userId:1,
        name:name.value,
        longitude:longitude.value,
        latitude:latitude.value,
        phone:phone.value,
        address:address.value
      };
      IOModel.Modifydata(modifydata).then((res) => {  //修改成功时的回调
        if(res.success) {
          message.success('修改成功');
             this.props.Alldatas({startPage:Cur,limit:Psize});
        }
      }).catch();
    }
  }
  hideCancel() {   //点击关闭的回调函数
    this.props.modal({modalFlag:false,modeltype:'add'});
  }
  handleFormChange (changedFields) {
    const fields = this.props.fields;
    this.props.defaultFields( { ...fields, ...changedFields });
  }
  render() {
    const { modalflag, parentName,modaltype,fields } = this.props;
    let title="编辑基地";
    if( modaltype==='add') {
        title="新增基地";
    }
    return (
      <div>
        <Modal
          title={title}
          visible={modalflag}
          onOk={this.hideModal.bind(this)}
          onCancel={this.hideCancel.bind(this)}
          okText="确认"
          cancelText="取消"
          wrapClassName='res-modal'
        >
        <CustomizedForm {...fields} onChange={this.handleFormChange.bind(this)} parentName={parentName} handleC={this.props.handleC}/>
        </Modal>
      </div>
    );
  }
}
const mapstateProps = (state) => {
  const {Alldate,isOk,parentname,parentID,Cur,Psize,fields,modalflag,chooseCUR, chooseSIZE,modaltype, TreeD, slideID,modifyID,slideparentID,slideName} = state.agriculturalTaskReducer;
  return {
    dataList:Alldate,
    parentID,modifyID,
      isok:isOk,
      parentName:parentname,
    Cur,
    Psize,
    fields:fields,
    modalflag,modaltype,TreeD,slideID,
    chooseCUR, chooseSIZE,slideparentID,slideName
  };
};
export default connect(mapstateProps, action)(modifyModal);
