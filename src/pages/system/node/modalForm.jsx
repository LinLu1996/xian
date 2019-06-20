
import { Component } from 'react';
import { Modal, Input, Form, message  } from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {IO} from '@/app/io';
import Operation from '../public.js';
//import Com from '@/component/common';
import '../../index.less';
const FormItem = Form.Item;
const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      SJname:Form.createFormField({
        ...props.parentName,
        value: props.parentName
      }),
    name: Form.createFormField({
        ...props.name,
        value: props.name.value
      })
    };
  }
})((props) => {
  props.getForm(props.form);
  const { getFieldDecorator } = props.form;
  return (
    <Form layout="inline">
    <FormItem label="上级节点">
        {getFieldDecorator('SJname', {
          rules: []
        })(<Input disabled/>)}
      </FormItem>
    <FormItem label="节点名称">
        {getFieldDecorator('name', {
          rules: [{required: true, message:'请输入节点名称'}]
        })(<Input placeholder='节点名称'/>)}
      </FormItem>
    </Form>
  );
});

class modifyModal extends Component {
  constructor(props) {
      super(props);
      this.state = {
        visible: false,
        loadflag:false
      };
  }
  getForm(value) {
    this.formValitate = value;
  }
  addTreeList(data) {
    const addData = Object.assign({},data,{
      title:data.nodeName
    });
    if(data.parentId === -1) {
      const add = Object.assign({},addData,{
        key:data.id
      });
      this.props.TreeD.push(add);
    }else {
      Operation.addtree(this.props.TreeD,addData,this.props.slideID);
    }
    this.props.TreeData({tree:[...this.props.TreeD]});
  }
  TableList(ID,mes) {
    message.success(mes);
    this.setState({
      loadflag:false
    });
    this.props.modal({modalFlag:false});
    if(this.props.Treeflag) {
      this.props.Alldatas({sortField:this.props.sortfield,sortOrder:this.props.sortorder,id:ID,nodeName:this.props.Nameval,startPage:this.props.cur,limit:this.props.psize});
    }else{
      this.props.chooseAll({sortField:this.props.sortfield,sortOrder:this.props.sortorder,nodeName:this.props.Nameval,id:ID,startPage:this.props.cur,limit:this.props.psize});
    }
  }
  mapdata(ID) {
    const Data = {
      nodeName:this.props.fields.name.value,
      parentId:ID
    };
    return Data;
  }
  addmethods() {
    Operation.systemOpt(Operation.listurl(this.props.list,'node_add'));
    IO.system_opt.request(this.mapdata(this.props.slideID)).then((res) => {  //添加成功时的回调
      this.props.getNameval();
      this.addTreeList(res.data);
      if(res.success) {
        this.TableList(this.props.slideID,'添加成功！');
      } else {
        message.error(res.message);
      }
    }).catch((res) => {
        message.error(res.message);
      // Com.errorCatch(res);
      this.setState({
        loadflag:false
      });
    });
  }
  modifyTreeList() {
    const querydatas = Object.assign({},this.props.rightItem,{
      keyword: this.props.fields.word.value,
      nodeName:this.props.fields.name.value
  });
    const v = Object.assign({},querydatas,{
      title:querydatas.nodeName
    });
    const querydata = Operation.querytree(this.props.TreeD,v,this.props.modifyID);
    this.props.TreeData({tree:[...querydata]});
  }
  modifymethods() {
    const contrast = Object.keys(this.props.queryfields).map((item) => {
      return this.props.queryfields[item].value===this.props.fields[item].value;
    });
    const modifydata = Object.assign({},this.mapdata(this.props.parentID),{
      id:this.props.modifyID
    });
    if(contrast.indexOf(false)!==-1) {
      Operation.systemOpt(Operation.listurl(this.props.list,'node_update'));
      IO.system_opt.request(modifydata).then((res) => {  //修改成功时的回调
        if(res.success) {
          this.TableList(this.props.slideID,'修改成功！');
          this.modifyTreeList();
        } else {
          message.error(res.message);
        }
      }).catch((res) => {
          message.error(res.message);
        //Com.errorCatch(res);
        this.setState({
          loadflag:false
        });
      });
    }else {
      this.setState({
        loadflag:false
      });
      message.warning('请编辑后再提交');
    }
  }
  hideModal() {   //点击确定的回调
    const { modaltype } = this.props;
    this.props.RightsearchFlag({flag:true});
    this.formValitate.validateFields((err) => {
      if(err) {
        return false;
      }else {
        this.setState({
          loadflag:true
        });
        if(modaltype==='add') {
          this.addmethods(this);
        }else if(modaltype==='modify') {
          this.modifymethods();
        }
      }
  });}
  hideCancel() {   //点击关闭的回调函数
    this.props.modal({modalFlag:false,modeltype:'add'});
  }
  handleFormChange (changedFields) {
    const fields = this.props.fields;
    this.props.defaultFields( { ...fields, ...changedFields });
  }
  render() {
    const { modalflag, fields, modaltype } = this.props;
    const { loadflag } = this.state;
    let tit;
    modaltype==='add'?tit='新增节点':tit='编辑节点';
    return (
      <div>
        <Modal
          title={tit}
          visible={modalflag}
          onOk={this.hideModal.bind(this)}
          onCancel={this.hideCancel.bind(this)}
          okText='确认'
          cancelText="取消"
          confirmLoading={loadflag}
          wrapClassName='farming-admin-modal'
        >
        <CustomizedForm {...fields} onChange={this.handleFormChange.bind(this)} getForm={this.getForm.bind(this)} parentName={this.props.ModelParentName}/>
        </Modal>
      </div>
    );
  }
}
const mapstateProps = (state) => {
  const {total,Alldate, parentname, parentID, rightItem,sortfield, sortorder, fields, modalflag, modaltype, modifycode, TreeD, slideID, modifyID, queryfields} = state.nodeReducer;
  return {
    dataList:Alldate,  //列表的数据
    parentName:parentname,  //要显示的上级名字
    parentID,  //点击修改需要的上级ID
    modifyID,   //点击修改的ID
    fields:fields,  //form的数据
    modalflag,  //弹出框的显示
    modaltype,  //弹出框的类型
    TreeD,   //树的数据
    slideID,  //点击树所对应的id
    modifycode,  //修改的code码
    queryfields,
    list:state.systemReducer.listdata,
    sortfield, sortorder, total,rightItem
  };
};
export default connect(mapstateProps, action)(modifyModal);
