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
            id: Form.createFormField({
                value: props.id.value
            }),
            name: Form.createFormField({
                ...props.name,
                value: props.name.value
            }),
            workTypeName: Form.createFormField({
                ...props.workTypeName,
                value: props.workTypeName.value
            }),
            containment: Form.createFormField({
                ...props.containment,
                value: props.containment.value
            }),
            purpose: Form.createFormField({
                ...props.purpose,
                value: props.purpose.value
            }),
            createName: Form.createFormField({
                value: props.createName.value
            }),
            dosageUnit: Form.createFormField({
                ...props.dosageUnit,
                value: props.dosageUnit.value
            })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    props.getForm(props.form);
    const {modeltype} = props;
    // let isEdit = false;
    // let createTime = "";
    // let stauts = "";
    let id = -1;
    if (modeltype.value === 'modify') {
        // isEdit = true;
        // createTime = moment(props.createTime.value).format('YYYY-MM-DD HH:mm:ss');
        // stauts = props.stauts.value === 0 ? "正常" : "禁止";
        id = props.id.value;
    }

    return (
        <div className='agr-maintenace'>
            <Form layout="inline">
                <FormItem label="农资名称">
                    {getFieldDecorator('name', {
                        rules: [{required: true, message: '请输入农资名称'}]
                    })(<Input onChange={(e) => {
                        props.checkName(e.target.value, id,'checkName_material');
                    }}/>)}
                </FormItem>
                <FormItem label="农资类型">
                    {getFieldDecorator('workTypeName', {
                        rules: [{required: true, message: '请选择农资类型'}]
                    })(<Select style={{width: 300}}>
                        {props.AllWorkType.value.map((item) => {
                            return <Option key={item.code} value={item.code}>{item.name}</Option>;
                        })}
                    </Select>)}
                </FormItem>
                {
                    props.workTypeName.value === 'protection' && <FormItem label="植保用途">
                        {getFieldDecorator('purpose', {
                            rules: [{required: true, message: '请输入植保用途'}]
                        })(<Input/>)}
                    </FormItem>
                }
                {
                    props.workTypeName.value === 'protection' && <FormItem label="抑制期">
                        {getFieldDecorator('containment', {
                            rules: [{required: true, message: '请输入抑制期'}]
                        })(<Input/>)}
                    </FormItem>
                }
                <FormItem label="默认用量单位（每亩）">
                    {getFieldDecorator('dosageUnit', {
                        rules: [{required: true, message: '请选择用量单位'}]
                    })(<Select style={{width: 300}}>
                        {props.allDosageUnit.value.map((item) => {
                            return <Option key={item.key} value={item.key}>{item.value}</Option>;
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
        </div>
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
        const {name, workTypeName, dosageUnit, purpose, containment} = this.props.fields;
        const {Cur, Psize, modaltype,operationNames,agriculturalTypes} = this.props;
        const {AllWorkType} = this.props.fields;
        e.preventDefault();
        this.formValitate.validateFields((err) => {
            if (!err) {
                if(this.props.saveFlag) {
                  let workTypeId = 0;
                  for (let i = 0; i < AllWorkType.value.length; i++) {
                    if (workTypeName.value === AllWorkType.value[i].code) {
                      workTypeId = AllWorkType.value[i].id;
                    }
                  }
                  if (modaltype === 'add') {
                    let addData = {};
                    if (workTypeName.value === 'protection') {
                      addData = {
                        companyId: 1,
                        name: name.value,
                        workTypeId: workTypeId,
                        dosageUnitId: dosageUnit.value,
                        purpose: purpose.value,
                        containment: containment.value
                      };
                    } else {
                      addData = {
                        companyId: 1,
                        name: name.value,
                        workTypeId: workTypeId,
                        dosageUnitId: dosageUnit.value
                      };
                    }
                    IOModel.Adddata(addData).then((res) => {  //添加成功时的回调
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('添加成功');
                          if (this.props.queryRole) {
                            this.props.Alldatas({startPage: 1, limit: Psize,name:operationNames,workTypeId:agriculturalTypes});
                              this.props.page({current: 1, pageSize: Psize});
                          }
                          this.props.modal({modalFlag: false});
                        } else {
                          message.error('添加失败');
                        }
                      } else {
                        message.error('添加失败');
                      }
                      this.props.modal({modalFlag: false});
                    }).catch(() => {
                      message.error('添加失败');
                    });
                  } else if (modaltype === 'modify') {
                    let modifydata = {};
                    if (workTypeName.value === 'protection') {
                      modifydata = {
                        id: this.props.fields.id.value,
                        companyId: 1,
                        name: name.value,
                        workTypeId: workTypeId,
                        dosageUnitId: dosageUnit.value,
                        purpose: purpose.value,
                        containment: containment.value
                      };
                    } else {
                      modifydata = {
                        id: this.props.fields.id.value,
                        companyId: 1,
                        name: name.value,
                        workTypeId: workTypeId,
                        dosageUnitId: dosageUnit.value
                      };
                    }
                    IOModel.Modifydata(modifydata).then((res) => {  //修改成功时的回调
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('修改成功');
                          this.props.Alldatas({startPage: Cur, limit: Psize,name:operationNames,workTypeId:agriculturalTypes});
                        } else {
                          message.error('修改失败');
                        }
                      } else {
                        message.error('修改失败');
                      }
                      this.props.modal({modalFlag: false});
                    }).catch(() => {
                      message.error('修改失败');
                    });
                  }
                }else{
                  message.warning('农资名已存在');
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
        let title = "编辑农资";
        if (modaltype === 'add') {
            title = "新增农资";
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
                    wrapClassName='farming-admin-modal material-modal'
                >
                    <CustomizedForm {...fields} onChange={this.handleFormChange.bind(this)} parentName={parentName}
                                    getForm={this.getForm.bind(this)} checkName={this.props.checkName}/>
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {Alldate, isOk, parentname, parentID, Cur, Psize, fields, modalflag, chooseCUR, chooseSIZE, modaltype, TreeD, slideID, modifyID, slideparentID, slideName} = state.agriculturalMaintenanceReducer;
    return {
        isok: isOk,
        parentName: parentname,
        parentID, modifyID,
        dataList: Alldate,
        Cur,
        Psize,
        fields: fields,
        modalflag, modaltype, TreeD, slideID,
        chooseCUR, chooseSIZE, slideparentID, slideName
    };
};
export default connect(mapstateProps, action)(modifyModal);
