import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import {Modal, Input, Form, message} from 'antd';

const FormItem = Form.Item;
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
            /*sort: Form.createFormField({
                value: props.sort.value
            }),*/
            parentId: Form.createFormField({
                value: props.parentId.value
            })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    props.getForm(props.form);
    const {modeltype} = props;
    //let isEdit=false;
    let id = "-1";
    if (modeltype.value === 'modify') {
        //isEdit=true;
        id = props.id.value;
    }
    return (
        <Form layout="inline">
            <FormItem label="小类名称">
                {getFieldDecorator('name', {
                    rules: [{required: true, message: '请输入作物小类'}]
                })(<Input onBlur={() => {
                    props.checkNameTwo(props.name.value, id, props.parentId.value);
                }}/>)}
            </FormItem>
            {/*<FormItem label="排序">
                {getFieldDecorator('sort', {
                    rules: [{required: true, message: '请输入排序'}]
                })(<Input/>)}
            </FormItem>*/}
            {/*{ isEdit&&<FormItem label="创建人">
        {getFieldDecorator('createName', {
          rules: []
        })(<div>{<div>{props.createName.value}</div>}</div>)}
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
        const {name,parentId} = this.props.fields;
        const {Cur, Psize, modalTwotype} = this.props;
        e.preventDefault();
        this.formValitate.validateFields((err) => {
            if (!err) {
                if(this.props.saveFlag2) {
                  if (modalTwotype === 'add') {
                    const addData = {
                      companyId: 1,
                      parentId: parentId.value,
                      name: name.value
                    };
                    IOModel.Adddata(addData).then((res) => {  //添加成功时的回
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('添加成功');
                          this.props.modalTwo({modalflag: false});
                          this.props.Alldatas({startPage: Cur, limit: Psize});
                          const data = Object.assign({},this.props.Data2);
                          IOModel.ListInGroupAll({companyId: 1, parentId: this.props.fields.categoryOne.value}).then((res) => {
                            if (res.success) {
                              data[this.props.fields.categoryOne.value] = res.data;
                              this.props.changeData2(data);
                            }
                          }).catch();
                        } else {
                          message.error('添加失败');
                        }
                      } else {
                        message.error('添加失败');
                      }
                    }).catch(() => {
                      message.error('添加失败');
                    });

                  } else if (modalTwotype === 'modify') {
                    const modifydata = {
                      id: this.props.fields.id.value,
                      companyId: 1,
                      parentId: parentId.value,
                      name: name.value
                    };
                    IOModel.Modifydata(modifydata).then((res) => {  //修改成功时的回调
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('修改成功');
                          this.props.modalTwo({modalflag: false});
                          this.props.Alldatas({startPage: Cur, limit: Psize});
                          const data2 = this.props.Data2;
                          let index = 0;
                          for(let i = 0; i < data2[this.props.fields.parentId.value].length; i ++) {
                            if(data2[this.props.fields.parentId.value][i].id === this.props.fields.id.value) {
                              index = i;
                              break;
                            }
                          }
                          data2[this.props.fields.parentId.value][index] = modifydata;
                          this.props.changeData2(data2);
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
                  message.warning('作物小类名已存在');
                }
            }
        });
    }

    hideCancel() {   //点击关闭的回调函数
        this.props.modalTwo({modalflag: false, modeltype: 'add'});
    }

    handleFormChange(changedFields) {
        const fields = this.props.fields;
        this.props.defaultFields({...fields, ...changedFields});
    }

    render() {
        const {modalTwoflag, parentName, modalTwotype, fields} = this.props;
        let title = "编辑作物小类";
        if (modalTwotype === 'add') {
            title = "新增作物小类";
        }
        return (
            <div>
                <Modal
                    title={title}
                    visible={modalTwoflag}
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName='farming-admin-modal'
                >
                    <CustomizedForm {...fields} onChange={this.handleFormChange.bind(this)} parentName={parentName}
                                    getForm={this.getForm.bind(this)} checkNameTwo={this.props.checkNameTwo}/>
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {Alldate, Data2,isOk, parentname, parentID, Cur, Psize, fields, modalTwoflag, chooseCUR, chooseSIZE, modalTwotype, TreeD, slideID, modifyID, slideparentID, slideName} = state.cropMaintenanceReducer;
    return {
      Data2,
        dataList: Alldate,
        isok: isOk,
        parentName: parentname,
        parentID, modifyID,
        Cur,
        Psize,
        fields: fields,
        modalTwoflag, modalTwotype, TreeD, slideID,
        chooseCUR, chooseSIZE, slideparentID, slideName
    };
};
export default connect(mapstateProps, action)(modifyModal);
