import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
//import moment from 'moment';
import {Modal, Input, Form, message, Select} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const CustomizedForm = Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            name: Form.createFormField({
                ...props.name,
                value: props.name.value
            }),
            farmingType: Form.createFormField({
                ...props.farmingType,
                value: props.farmingType.value
            }),
            createName: Form.createFormField({
                value: props.createName.value
            })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    props.getForm(props.form);
    const {modeltype} = props;
    //let isEdit = false;
    // let createTime="";
    // let stauts="";
    let id = "-1";
    if (modeltype.value === 'modify') {
        //isEdit = true;
        // createTime= moment(props.createTime.value).format('YYYY-MM-DD HH:mm:ss');
        // stauts=props.stauts.value === 0 ? "正常":"禁用";
        id = props.id.value;
    }
    return (
        <Form layout="inline">
            <FormItem label="操作名称">
                {getFieldDecorator('name', {
                    rules: [{required: true, message: '请输入操作名称'}]
                })(<Input onChange={(e) => {
                    props.checkName(e.target.value, id);
                }}/>)}
            </FormItem>
            <FormItem label="农事类型">
                {getFieldDecorator('farmingType', {
                    rules: [{required: true, message: '请选择农事类型'}]
                })(<Select style={{width: 300}}>
                    {
                        props.allWorkType.value.map((item) => {
                            if(item.name==='采收') {
                                return '';
                            }else {
                                return <Option key={item.id} value={item.id}>{item.name}</Option>;
                            }
                    })}
                </Select>)}
            </FormItem>
            {/*{isEdit && <FormItem label="创建时间">
                {getFieldDecorator('createTime', {
                    rules: []
                })(<div>{<div>{createTime}</div>}</div>)}
            </FormItem>}
            {isEdit && <FormItem label="创建人">
                {getFieldDecorator('createName', {
                    rules: []
                })(<div>{<div>{props.createName.value}</div>}</div>)}
            </FormItem>}
            {isEdit && <FormItem label="状态">
                {getFieldDecorator('stauts', {
                    rules: []
                })(<div>{stauts}</div>)}
            </FormItem>}*/}
        </Form>
    );
});

class modifyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    getForm(value) {
        this.formValitate = value;
    }

    hideModal(e) {   //点击确定的回调
        const {name, farmingType} = this.props.fields;
        const {Cur, Psize, modaltype,names,agriculturalType} = this.props;
        e.preventDefault();
        this.formValitate.validateFields((err) => {
            if (!err) {
                if(this.props.saveFlag) {
                  if (modaltype === 'add') {
                    const addData = {
                      name: name.value,
                      companyId: 1,
                      workTypeId: farmingType.value
                    };
                    IOModel.Adddata(addData).then((res) => {  //添加成功时的回
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('添加成功');
                          if (this.props.queryRole) {
                              if(agriculturalType === -1) {
                                  this.props.Alldatas({startPage: 1, limit: Psize,name:names});
                              }else{
                                  this.props.Alldatas({startPage: 1, limit: Psize,name:names,workTypeId:agriculturalType});
                              }
                              this.props.page({current:1, pageSize:10});
                          }
                          this.props.modal({modalFlag: false});
                        } else {
                          message.error('添加失败');
                        }
                      } else {
                        message.error('添加失败');
                      }
                    }).catch(() => {
                      message.error('添加失败');
                    });
                  } else if (modaltype === 'modify') {
                    const modifydata = {
                      name: name.value,
                      id: this.props.fields.id.value,
                      workTypeId: farmingType.value
                    };
                    IOModel.Modifydata(modifydata).then((res) => {  //修改成功时的回调
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('修改成功');
                          this.props.Alldatas({startPage: Cur, limit: Psize,name:names,workTypeId:agriculturalType});
                          this.props.modal({modalFlag: false});
                        } else {
                          message.error('修改失败');
                        }
                      } else {
                        message.error('修改失败');
                      }
                    }).catch(() => {
                      message.error('修改失败');
                    });
                  }
                }else{
                  message.warning('农事操作名已存在');
                }
            }
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
        const {modalflag, parentName, modaltype, fields} = this.props;
        let title = "编辑农事操作";
        if (modaltype === 'add') {
            title = "新增农事操作";
        }
        return (
            <div>
                <Modal
                    visible={modalflag}
                    onOk={this.hideModal.bind(this)}
                    title={title}
                    onCancel={this.hideCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName='farming-admin-modal'
                >
                    <CustomizedForm {...fields} onChange={this.handleFormChange.bind(this)} parentName={parentName}
                                    getForm={this.getForm.bind(this)} checkName={this.props.checkName}/>
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {Alldate, isOk, parentname, parentID, Cur, Psize, fields, modalflag, chooseCUR, chooseSIZE, modaltype, TreeD, slideID, modifyID, slideparentID, slideName} = state.farmingOperationsReducer;
    return {
        isok: isOk,
        parentName: parentname,
        parentID, modifyID,
        Cur,
        dataList: Alldate,
        Psize,
        fields: fields,
        modalflag, modaltype, TreeD, slideID,
        chooseCUR, chooseSIZE, slideparentID, slideName
    };
};
export default connect(mapstateProps, action)(modifyModal);
