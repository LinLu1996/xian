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
            quantity: Form.createFormField({
                value: props.quantity.value
            })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    return (
        <Form layout="inline">
            <FormItem label="生成数量">
                {getFieldDecorator('quantity', {
                    rules: [{required: true}]
                })(<Input/>)}
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

    hideModal() {   //点击确定的回调
        const {quantity, gradeId, gradeNo} = this.props.fields;
        const {Cur, Psize, modaltype} = this.props;
        const val = /^[0-9]*$/;
        if (!quantity.value) {
            message.warning('带*号的为必填的哦！');
            return;
        } else if (!val.test(quantity.value)) {
            message.warning('只允许填写数字！');
            return;
        } else if (quantity.value <= 0) {
            message.warning('数量需大于0！');
            return;
        }
        if (modaltype === 'add') {
            const addData = {
                num: quantity.value,
                gradeBatchId: gradeId.value,
                gradeBatchNo: gradeNo.value,
                companyId: 1
            };
            IOModel.addQrCode(addData).then((res) => {  //添加成功时的回
                if (res.success && res.data > 0) {
                    message.success('生成成功');
                    this.props.modal({modalFlag: false});
                } else {
                    Modal.error({
                        title: '提示',
                        content: res.message
                    });
                }
            }).catch((res) => {
                Modal.error({
                    title: '提示',
                    content: res.message
                });
            });

        } else if (modaltype === 'modify') {
            const modifydata = {
                quantity: quantity.value
            };
            IOModel.Modifydata(modifydata).then((res) => {  //修改成功时的回调
                if (res.success) {
                    message.success('修改成功');
                    this.props.Alldatas({startPage: Cur, limit: Psize});
                }
            }).catch();
        }
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
        let title = "";
        if (modaltype === 'add') {
            title = "生成唯一码";
        }
        return (
            <div>
                <Modal
                    title={title}
                    visible={modalflag}
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideCancel.bind(this)}
                    okText="生成"
                    cancelText="取消"
                    wrapClassName='farming-admin-modal'
                >
                    <CustomizedForm {...fields} onChange={this.handleFormChange.bind(this)} parentName={parentName}/>
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {Alldate, isOk, parentname, parentID, Cur, Psize, fields, modalflag, chooseCUR, chooseSIZE, modaltype, TreeD, slideID, modifyID, slideparentID, slideName} = state.batchtracingReducer;
    return {
        isok: isOk,
        parentName: parentname,
        parentID, modifyID,
        Cur,
        Psize,
        fields: fields,
        dataList: Alldate,
        modalflag, modaltype, TreeD, slideID,
        chooseCUR, chooseSIZE, slideparentID, slideName
    };
};
export default connect(mapstateProps, action)(modifyModal);
