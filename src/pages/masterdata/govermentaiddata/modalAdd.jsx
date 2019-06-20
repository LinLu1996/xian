import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
//import moment from 'moment';
import {Modal, InputNumber, Form, message} from 'antd';

const FormItem = Form.Item;
const CustomizedForm = Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            year: Form.createFormField({
                ...props.year,
                value: props.year.value
            })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    props.getForm(props.form);
    const {modeltype} = props;
    //let isEdit = false;
    // createTime = "";
    if (modeltype.value === 'modify') {
        //isEdit = true;
        //createTime = moment(props.createTime.value).format('YYYY-MM-DD HH:mm:ss');
    }
    return (
        <Form layout="inline">
            <FormItem label="年份">
                {getFieldDecorator('year', {
                   rules: [{required: true, message: '请输入年份'}]
                })(<InputNumber style={{width:'300px'}} onChange={(e) => {props.checkName(e);}}/>)}
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
        const {year} = this.props.fields;
        const {Cur, Psize, modaltype} = this.props;
        e.preventDefault();
        this.formValitate.validateFields((err) => {
            if (!err) {
                if(this.props.saveFlag) {
                  if (modaltype === 'add') {
                    const addData = {
                      companyId: 1,
                      year: year.value
                    };
                    IOModel.Adddata(addData).then((res) => {  //添加成功时的回
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('添加成功');
                          this.props.Alldatas({startPage: Cur, limit: Psize, year: this.props.year});
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
                  }
                }else {
                  message.warning('该年份已存在');
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
        let title = "编辑扶贫年份";
        if (modaltype === 'add') {
            title = "新增扶贫年份";
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
                    <CustomizedForm {...fields}  onChange={this.handleFormChange.bind(this)} parentName={parentName}
                                    getForm={this.getForm.bind(this)} checkName={this.props.checkName}/>
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {Alldate, isOk, parentname, parentID, Cur, Psize, fields, modalflag, modaltype, modifyID, slideparentID, slideName} = state.govermentaiddataReducer;
    return {
        dataList: Alldate,
        parentName: parentname,
        isok: isOk,
        parentID, modifyID,
        Cur,
        Psize,
        fields: fields,
        modalflag, modaltype,
        slideparentID, slideName
    };
};
export default connect(mapstateProps, action)(modifyModal);
