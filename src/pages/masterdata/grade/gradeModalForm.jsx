import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
//import moment from 'moment';
import '../../index.less';
import {Modal, Input, Form, message,InputNumber} from 'antd';

const FormItem = Form.Item;
const CustomizedForm = Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            gradeGroupName: Form.createFormField({
                value: props.gradeGroupName.value
            }),
            gradeName: Form.createFormField({
                ...props.gradeName,
                value: props.gradeName.value
            }),
            sortNum: Form.createFormField({
                ...props.sortNum,
                value: props.sortNum.value
            })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    props.getForm(props.form);
    const {modeltype} = props;
    let isEdit = false;
    // let createTime = "";
    // let stauts = "";
    let id = -1;
    if (modeltype.value === 'modify') {
        isEdit = true;
        // createTime = moment(props.createTime.value).format('YYYY-MM-DD HH:mm:ss');
        // stauts = props.stauts.value;
        id = props.id.value;
    }
    return (
        <Form layout="inline">
            {!isEdit && <FormItem label="等级组名称">
                {getFieldDecorator('gradeGroupName', {
                    rules: []
                })(<div>{<div>{props.gradeGroupName.value}</div>}</div>)}
            </FormItem>}
            <FormItem label="等级名称">
                {getFieldDecorator('gradeName', {
                    rules: [{required: true, message: '请输入等级名称'}]
                })(<Input onChange={(e) => {
                    props.checkName(e.target.value, id, props.gradeGroupId.value);
                }}/>)}
            </FormItem>
            <FormItem label="排序">
                {getFieldDecorator('sortNum', {
                    rules: [{required: true, message: '请输入排序'}]
                })(<InputNumber placeholder="数值越大排序越低"/>)}
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
        const {gradeName, sortNum} = this.props.fields;
        const {Cur, Psize, modaltype} = this.props;
        e.preventDefault();
        this.formValitate.validateFields((err) => {
            if (!err) {
                if(this.props.saveGradeFlag) {
                  if (modaltype === 'add') {
                    const addData = {
                      gradeGroupId: this.props.fields.gradeGroupId.value,
                      name: gradeName.value,
                      sortNum: sortNum.value,
                      companyId: 1
                    };
                    IOModel.AddGradeData(addData).then((res) => {  //添加成功时的回
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('添加成功');
                          this.props.modal({gradeModalFlag: false});
                          //this.props.Alldatas({startPage: Cur, limit: Psize, companyId: 1});
                          if (this.props.gradeQueryRole) {
                            IOModel.ListInGroup({
                              'companyId': 1,
                              'gradeGroupId': this.props.fields.gradeGroupId.value
                            }).then((res) => {
                              const Data2 = Object.assign({},this.props.Data2);
                              if (res.success) {
                                Data2[this.props.fields.gradeGroupId.value] = res.data;
                                this.props.changeData2(Data2);
                              }
                            }).catch();
                          }
                        } else {
                          message.error('修改失败');
                        }
                      } else {
                        message.error('修改失败');
                      }
                      this.props.modal({gradeModalFlag: false});
                    }).catch(() => {
                      message.error("修改失败");
                    });
                  } else if (modaltype === 'modify') {
                    const modifydata = {
                      gradeGroupId: this.props.fields.gradeGroupId.value,
                      id: this.props.fields.id.value,
                      createUserName: this.props.fields.createName.value,
                      companyId: 1,
                      name: gradeName.value,
                      sortNum: sortNum.value
                    };
                    IOModel.ModifyGradeData(modifydata).then((res) => {  //修改成功时的回调
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('修改成功');
                          this.props.Alldatas({startPage: Cur, limit: Psize, companyId: 1});
                          const data2 = this.props.Data2;
                          let index = 0;
                          for(let i = 0; i < data2[this.props.fields.gradeGroupId.value].length; i ++) {
                            if(data2[this.props.fields.gradeGroupId.value][i].id === this.props.fields.id.value) {
                              index = i;
                              break;
                            }
                          }
                          data2[this.props.fields.gradeGroupId.value][index] = modifydata;
                          data2[this.props.fields.gradeGroupId.value].sort((a,b) => {
                             return a.sortNum - b.sortNum;
                          });
                          this.props.changeData2(data2);
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
                }else {
                  message.warning('等级名已存在');
                }
            }
        });
    }

    hideCancel() {   //点击关闭的回调函数
        this.props.modal({gradeModalFlag: false, modeltype: 'add'});
    }

    handleFormChange(changedFields) {
        const fields = this.props.fields;
        this.props.defaultFields({...fields, ...changedFields});
    }

    render() {
        const {gradeModalFlag, parentName, modaltype, fields} = this.props;
        let title = "编辑作物等级";
        if (modaltype === 'add') {
            title = "新增作物等级";
        }
        return (
            <div>
                <Modal
                    title={title}
                    visible={gradeModalFlag}
                    onOk={this.hideModal.bind(this)}
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
    const {Alldate, Data2, isOk, parentname, parentID, Cur, Psize, fields, gradeModalFlag, chooseCUR, chooseSIZE, modaltype, TreeD, slideID, modifyID, slideparentID, slideName} = state.cropGradeReducer;
    return {
        Data2,
        dataList: Alldate,
        isok: isOk,
        parentName: parentname,
        parentID, modifyID,
        Cur,
        Psize,
        fields: fields,
        gradeModalFlag, modaltype, TreeD, slideID,
        chooseCUR, chooseSIZE, slideparentID, slideName
    };
};
export default connect(mapstateProps, action)(modifyModal);
