
import { Component } from 'react';
import { Modal, InputNumber,Input, Radio, Form, message, Tooltip } from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {IO} from '@/app/io';
import Operation from '../public.js';
import Com from '@/component/common';
import '../../index.less';
import './index.less';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
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
      word: Form.createFormField({
        ...props.word,
        value: props.word.value
      }),
      name: Form.createFormField({
        ...props.name,
        value: props.name.value
      }),
      url: Form.createFormField({
        ...props.url,
        value: props.url.value
      }),
      sortnum:Form.createFormField({
        ...props.sortnum,
        value: props.sortnum.value
      }),
      pageurl: Form.createFormField({
        ...props.pageurl,
        value: props.pageurl.value
      }),
      model: Form.createFormField({
        ...props.model,
        value: props.model.value
      }),
      icon: Form.createFormField({
        ...props.icon,
        value: props.icon.value
      })
    };
  }
})((props) => {
  props.getForm(props.form);
  const { getFieldDecorator } = props.form;
  return (
    <Form layout="inline">
    <FormItem label="上级资源">
        {getFieldDecorator('SJname', {
          rules: []
        })(<Input disabled/>)}
      </FormItem>
    <FormItem label="资源名称">
        {getFieldDecorator('name', {
          rules: [{required: true, message: '请输入资源名称'}]
        })(<Input placeholder='资源名称'/>)}
      </FormItem>
      <FormItem label="关键字">
      <div className='tishi'>{getFieldDecorator('word', {
          rules: [{required: true, message: '请输入关键字'}]
        })(<Input placeholder='例如：reaources_add'/>)}<Tooltip autoAdjustOverflow={false} overlayClassName='toolp' placement="topRight" title={'资源标识符'}>
        <i className='iconfont icon-tishi'/>
      </Tooltip></div>
      </FormItem>
      <FormItem label="接口路径">
      <div className='tishi'>{getFieldDecorator('url', {
          rules: [{required: true, message: '请输入接口路径'}]
        })(<Input placeholder='例如：/resources'/>)}<Tooltip autoAdjustOverflow={false} overlayClassName='toolp' placement="topRight" title={'接口地址'}>
        <i className='iconfont icon-tishi'/>
      </Tooltip></div>
      </FormItem>
      <FormItem label="页面路由">
      <div className='tishi'>{getFieldDecorator('pageurl', {
          rules: []
        })(<Input placeholder='例如：/syztem/resources'/>)}<Tooltip autoAdjustOverflow={false} overlayClassName='toolp' placement="topRight" title={'路由地址'}>
        <i className='iconfont icon-tishi'/>
      </Tooltip></div>
      </FormItem>
      <FormItem label="排序">
        {getFieldDecorator('sortnum', {
          rules: []
        })(<InputNumber placeholder='资源排序' min={1}/>)}
      </FormItem>
      <FormItem label="Icon">
      <div className='tishi'>{getFieldDecorator('icon', {
          rules: []
        })(<Input placeholder='例如：icon-ziyuan'/>)}<Tooltip autoAdjustOverflow={false} overlayClassName='toolp' placement="topRight" title={'图标'}>
        <i className='iconfont icon-tishi'/>
      </Tooltip></div>
      </FormItem>
      <FormItem label="功能模块">
        {getFieldDecorator('model', {
          rules: [{required: true,message: '请选择功能模块'}]
        })(<RadioGroup>
            <Radio value={'menu'}>menu</Radio>
            <Radio value={'function'}>function</Radio>
            <Radio value={'model'}>model</Radio>
          </RadioGroup>)}
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
      title:data.resName,
      titles:data.resName
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
  TableList(IDs,mes) {
    message.success(mes);
    this.setState({
      loadflag:false
    });
    this.props.modal({modalFlag:false});
    if(this.props.Treeflag) {
      this.props.Alldatas({sortField:this.props.sortfield,sortOrder:this.props.sortorder,id:IDs,resName:this.props.Nameval,startPage:1,limit:this.props.psize});
    }else{
      this.props.chooseAll({sortField:this.props.sortfield,sortOrder:this.props.sortorder,resName:this.props.Nameval,id:IDs,startPage:1,limit:this.props.psize});
    }
  }
  mapdata(ID) {
    const Data = {
      resName:this.props.fields.name.value,
      parentId:ID,
      keyword:this.props.fields.word.value,
      resType:this.props.fields.model.value,
      resUrl:this.props.fields.url.value,
      icon:this.props.fields.icon.value,
      pageUrl:this.props.fields.pageurl.value,
      sortNum:this.props.fields.sortnum.value
    };
    return Data;
  }
  addmethods() {
    Operation.systemOpt(Operation.listurl(this.props.list,'resource_add'));
    IO.system_opt.request(this.mapdata(this.props.slideID)).then((res) => {  //添加成功时的回调
      this.addTreeList(res.data);
      if(res.success) {
        this.props.getNameval();
        this.TableList(this.props.slideID,'添加成功！');
      }
    }).catch((res) => {
      Com.errorCatch(res);
      this.setState({
        loadflag:false
      });
    });
  }
  modifyTreeList() {
    const querydatas = Object.assign({},this.props.rightItem,{
      keyword: this.props.fields.word.value,
      resName:this.props.fields.name.value,
      resUrl: this.props.fields.url.value,
      pageUrl:this.props.fields.pageurl.value,
      sort: this.props.fields.sort.value,
      resType: this.props.fields.model.value,
      sortNum: this.props.fields.sortnum.value,
      icon: this.props.fields.icon.value
  });
    const modifylist = Object.assign({},querydatas,{
      title:querydatas.resName
    });
    const querydata = Operation.querytree(this.props.TreeD,modifylist,this.props.modifyID);
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
      Operation.systemOpt(Operation.listurl(this.props.list,'resource_update'));
      IO.system_opt.request(modifydata).then((res) => {  //修改成功时的回调
        if(res.success) {
          this.TableList(this.props.slideID,'修改成功！');
          this.modifyTreeList();
        }
      }).catch((res) => {
        Com.errorCatch(res);
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
    this.formValitate.validateFields((err) => {
    const { modaltype } = this.props;
    this.props.RightsearchFlag({flag:true});
    if(err) {
      return;
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
    modaltype==='add'?tit='新增资源':tit='编辑资源';
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
          wrapClassName='farming-admin-modal resource-modal'
        >
        <CustomizedForm {...fields} onChange={this.handleFormChange.bind(this)} getForm={this.getForm.bind(this)} parentName={this.props.ModelParentName}/>
        </Modal>
      </div>
    );
  }
}
const mapstateProps = (state) => {
  const {total,Alldate, parentID, rightItem,sortfield, sortorder, fields, modalflag, modaltype, modifycode, TreeD, slideID, modifyID, queryfields} = state.resourcesReducer_;
  return {
    dataList:Alldate,  //列表的数据
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
    sortfield, sortorder, total, rightItem
  };
};
export default connect(mapstateProps, action)(modifyModal);
