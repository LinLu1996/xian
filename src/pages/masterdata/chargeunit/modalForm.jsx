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
            })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    props.getForm(props.form);
    const {modeltype} = props;
    let id = -1;
    if (modeltype.value === 'modify') {
        id = props.id.value;
    }
    return (
        <Form layout="inline">
            <FormItem label="计量单位名称">
                {getFieldDecorator('name', {
                    rules: [{required: true, message: '请输入计量单位名称'}]
                })(<Input onChange={(e) => {
                    props.checkName(e.target.value, id);
                }}/>)}
            </FormItem>
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
        const {name} = this.props.fields;
        const {Cur, Psize, modaltype} = this.props;
        e.preventDefault();
        this.formValitate.validateFields((err) => {
            if (!err) {
                if(this.props.saveFlag) {
                  if (modaltype === 'add') {
                    const addData = {
                       unitName: name.value
                    };
                    IOModel.Adddata(addData).then((res) => {  //添加成功时的回
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('添加成功');
                          this.props.query();
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
                    let stautsId = 0;
                    if (this.props.fields.stauts.value === '正常') {
                      stautsId = 1;
                    } else {
                      stautsId = 0;
                    }
                    const modifydata = {
                      id: this.props.fields.id.value,
                      unitName: name.value,
                      stauts: stautsId
                    };
                    IOModel.ModifydataName(modifydata).then((res) => {  //修改成功时的回调
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('修改成功');
                            this.props.Alldatas({startPage: Cur, limit: Psize,name:this.props.name});
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
                  message.warning('计量单位名称已存在');
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
        let title = "编辑计量单位";
        if (modaltype === 'add') {
            title = "新增计量单位";
        }
        return (
            <div>
                <Modal
                    title={title}
                    visible={modalflag}
                    okText="确认"
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideCancel.bind(this)}
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
    const {Alldate, isOk, parentname, parentID, Cur, Psize, fields, modalflag, chooseCUR, chooseSIZE, modaltype, slideID, modifyID, slideparentID, slideName} = state.growthReducer;
    return {
        dataList: Alldate,
        parentName: parentname,
        parentID, modifyID,
        isok: isOk,
        Cur,
        Psize,
        fields: fields,
        modalflag, modaltype, slideID,
        chooseCUR, chooseSIZE, slideparentID, slideName
    };
};
export default connect(mapstateProps, action)(modifyModal);
