import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import '../../index.less';
//import moment from 'moment';
import {Modal, Input, Form, message} from 'antd';

const FormItem = Form.Item;
const CustomizedForm = Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            gradeName: Form.createFormField({
                ...props.gradeName,
                value: props.gradeName.value
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
    // let isEdit = false;
    // let createTime = "";
    // let stauts = "";
    let id = "-1";
    if (modeltype.value === 'modify') {
        // isEdit = true;
        // createTime = moment(props.createTime.value).format('YYYY-MM-DD HH:mm:ss');
        // stauts = props.stauts.value;
        id = props.id.value;
    }
    return (
        <Form layout="inline">
            <FormItem label="等级组名称">
                {getFieldDecorator('gradeName', {
                    rules: [{required: true, message: '请输入等级组名称'}]
                })(<Input onChange={(e) => {
                    props.checkName(e.target.value, id,'checkName_grade');
                }}/>)}
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
        const {gradeName,stauts} = this.props.fields;
        const {Cur, Psize, modaltype,gradeNames} = this.props;
        e.preventDefault();
        this.formValitate.validateFields((err) => {
            if (!err) {
                if(this.props.saveFlag) {
                  if (modaltype === 'add') {
                    const addData = {
                      name: gradeName.value,
                      companyId: 1,
                      userid: 1
                    };
                    IOModel.Adddata(addData).then((res) => {  //添加成功时的回
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('添加成功');
                          if (this.props.queryRole) {
                            this.props.Alldatas({startPage: 1, limit: Psize, companyId: 1,name:gradeNames});
                            this.props.page({current: 1, pageSize: Psize});
                          }
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
                    const modifydata = {
                      id: this.props.fields.id.value,
                      companyId: 1,
                      userId: 1,
                      stauts:stauts.value === '正常'?0:1,
                      name: gradeName.value
                    };
                    IOModel.Modifydata(modifydata).then((res) => {  //修改成功时的回调
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('修改成功');
                          this.props.Alldatas({startPage: Cur, limit: Psize, companyId: 1,name:gradeNames});
                        } else {
                          message.warning('修改失败');
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
                  message.warning('等级组名已存在');
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
        let title = "编辑作物等级组";
        if (modaltype === 'add') {
            title = "新增作物等级组";
        }
        return (
            <div>
                <Modal
                    visible={modalflag}
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    title={title}
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
    const {Alldate, isOk, parentname, parentID, Cur, Psize, fields, modalflag, chooseCUR, chooseSIZE, modaltype, TreeD, slideID, modifyID, slideparentID, slideName} = state.cropGradeReducer;
    return {
        isok: isOk,
        dataList: Alldate,
        parentName: parentname,
        parentID, modifyID,
        Cur,
        Psize,
        fields: fields,
        modalflag, modaltype, TreeD, slideID,
        chooseCUR, chooseSIZE, slideparentID, slideName
    };
};
export default connect(mapstateProps, action)(modifyModal);
