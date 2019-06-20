
import { Component } from 'react';
import { Modal,Input, Radio, Form, message,TreeSelect} from 'antd';
const RadioGroup = Radio.Group;
import {connect} from 'react-redux';
import {action} from './model';
import {IO} from '@/app/io';
import Operation from '../public.js';
import Com from '@/component/common';
import '../../index.less';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
       roleCode:Form.createFormField({
        ...props.roleCode,
        value: props.roleCode.value
      }),
      roleName: Form.createFormField({
        ...props.roleName,
        value: props.roleName.value
      }),
      roleState: Form.createFormField({
        ...props.roleState,
        value: props.roleState.value
      }),
      roleType: Form.createFormField({
        ...props.roleType,
        value: props.roleType.value
      }),
      companyId: Form.createFormField({
        ...props.companyId,
        value: props.companyId.value
      })
    };
  }
})((props) => {
  props.getForm(props.form);
  const { getFieldDecorator } = props.form;
  const {isPlatform,listCompany,modaltype} = props;
  return (
    <Form layout="inline">
    <FormItem label="角色编码">
        {getFieldDecorator('roleCode', {
          rules: [{required: true, message: '请输入角色编码'}]
        })(<Input placeholder='角色编码' disabled={props.oldRoleCode && (props.oldRoleCode.value === 'system2company' || props.oldRoleCode.value === 'system2user')}/>)}
      </FormItem>
    <FormItem label="角色名称">
        {getFieldDecorator('roleName', {
          rules: [{required: true, message: '请输入角色名称'}]
        })(<Input placeholder='角色名称'/>)}
      </FormItem>
      <FormItem label="角色状态">
        {getFieldDecorator('roleState', {
          rules: [{required: true,message: '请选择角色状态'}]
        })(<RadioGroup>
            <Radio value={0}>正常</Radio>
            <Radio value={1}>禁用</Radio>
          </RadioGroup>)}
      </FormItem>
      {isPlatform && modaltype==='add' && <FormItem label="角色类型">
        {getFieldDecorator('roleType', {
            rules: [{required: true,message: '请选择角色类型'}]
            })(<RadioGroup>
                <Radio value={2}>通用角色</Radio>
                <Radio value={3}>企业角色</Radio>
            </RadioGroup>)}
      </FormItem>}
      {isPlatform && modaltype==='add' && props.roleType.value===3 && <FormItem label="公司名称">
            {getFieldDecorator('companyId', {
                rules: [{required: true,message:'请选择公司'}]
            })(<TreeSelect
              dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
              onChange={props.that.oncompanyChange.bind(props.that)}
          >
              {props.that.renderTreeNodes(listCompany)}
          </TreeSelect>)}
      </FormItem>}
    </Form>
  );
});

class modifyModal extends Component {
  constructor(props) {
      super(props);
      this.state = {
        visible: false,
        loadflag:false,
        companyid:''
      };
  }
  getForm(value) {
    this.formValitate = value;
  }
  requestFn(obj,keyword,mes) {
    Operation.systemOpt(Operation.listurl(this.props.list,keyword));
    IO.system_opt.request(obj).then((res) => {
      if(res.success) {
        message.success(mes);
        this.setState({
          loadflag:false
        });
        this.props.modal({modalFlag:false});
        this.props.Alldatas({sortField:this.props.sortfield,sortOrder:this.props.sortorder,roleName:this.props.Nameval,startPage:this.props.cur,limit:this.props.psize});
      }
    }).catch((res) => {
      Com.errorCatch(res);
      this.setState({
        loadflag:false
      });
    });
  }
  DataFn(type) {
    const obj = {
      roleName:this.props.fields.roleName.value,
      roleCode:this.props.fields.roleCode.value,
      roleType:this.props.fields.roleType.value,
      stauts:this.props.fields.roleState.value
    };
    if('platform' === localStorage.getItem('accountType')) {
      obj.companyId = this.state.companyid;
    }else {
      obj.roleType = 3;
    }
    if(type==='add') {
      this.props.emptyName();
      this.requestFn(obj,'role_add','添加成功');
    }else if(type==='modify') {
      const contrast = Object.keys(this.props.queryfields).map((item) => {
        return this.props.queryfields[item].value===this.props.fields[item].value;
      });
      obj.id = this.props.parentId;
      if(contrast.indexOf(false)!==-1) {
        this.requestFn(obj,'role_update','修改成功');
      }else {
        this.setState({
          loadflag:false
        });
        message.warning('请修改后再提交');
      }
    }
  }
  oncompanyChange(value, label, extra) {
    this.setState({companyid:extra.triggerNode.props.dataRef.id});
  }
  hideModal() {
    this.formValitate.validateFields((err) => {
    const { modaltype } = this.props;
    if(err) {
      this.setState({
        loadflag:false
      });
    }else {
      this.setState({
        loadflag:true
      });
      this.DataFn(modaltype);
    }
  });}
  /*formLoadData(treeNode) {  //点击展开时的调用
    const listCompany = this.props.listCompany;
    return new Promise((resolve) => {
        IO.employee.CompanyChild({id: treeNode.props.dataRef.id}).then((res) => {
            const Treedata = Operation.CompanyTreelist(res.data, treeNode);
            treeNode.props.dataRef.children = Treedata;
            this.props.treeNodeData(listCompany);
        });
        resolve();
    });
  }*/
  renderTreeNodes(data) {
    return data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title = {item.title} value={item.title} key={item.key} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} value={item.title} dataRef={item}/>;
    });
  }
  hideCancel() {
    this.props.modal({modalFlag:false});
  }
  handleFormChange (changedFields) {
    const fields = this.props.fields;
    this.props.defaultFields( { ...fields, ...changedFields });
  }
  render() {
    const me = this;
    const { modalflag, fields, modaltype, listCompany } = this.props;
    const { loadflag } = this.state;
    let tit;
    let comname;
    (localStorage.getItem('companyName') && localStorage.getItem('companyName') !== 'null') ? comname=`${localStorage.getItem('companyName')} / `:comname='';
    modaltype==='add'?tit='新增角色':tit='编辑角色';
    const isPlatform = 'platform' === localStorage.getItem('accountType');//是否平台类用户
    const ModalOpt = {
      isPlatform: isPlatform,
      getForm:me.getForm.bind(me),
      modaltype:modaltype,
      onChange:me.handleFormChange.bind(me),
      listCompany:listCompany,
      that:me
    };
    return (
      <div>
        <Modal
          title={`${comname}${tit}`}
          visible={modalflag}
          onOk={this.hideModal.bind(this)}
          onCancel={this.hideCancel.bind(this)}
          okText="确认"
          cancelText="取消"
          confirmLoading={loadflag}
          wrapClassName='farming-admin-modal'
        >
        <CustomizedForm {...fields} {...ModalOpt}/>
        </Modal>
      </div>
    );
  }
}
const mapstateProps = (state) => {
  const { Alldate, fields, modalflag, sortfield, sortorder, modaltype, parentid, queryfields,allCompany  } = state.roleReducer;
  return {
    dataList:Alldate,
    fields,
    modalflag,
    modaltype,
    parentId:parentid,
    queryfields,
    list:state.systemReducer.listdata,
    sortfield, sortorder,allCompany
  };
};
export default connect(mapstateProps, action)(modifyModal);
