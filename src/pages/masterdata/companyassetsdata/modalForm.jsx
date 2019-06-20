import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import {Modal, Input, Form, message, Select, DatePicker, LocaleProvider} from 'antd';
import moment from 'moment';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './index.less';
const {MonthPicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const CustomizedForm = Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            baseName: Form.createFormField({
                ...props.baseName,
                value: props.baseName.value
            }),
            id: Form.createFormField({
                value: props.id.value
            }),
            recordingTime: Form.createFormField({
                ...props.recordingTime,
                value: moment(new Date(props.recordingTime.value), 'YYYY-MM')
            }),
            landQty: Form.createFormField({
                ...props.landQty,
                value: props.landQty.value
            }),
            area: Form.createFormField({
                ...props.area,
                value: props.area.value
            }),
            cropQty: Form.createFormField({
                ...props.cropQty,
                value: props.cropQty.value
            })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    props.getForm(props.form);
    const {modeltype} = props;
    let isAdd = false;
    let isEdit = false;
    let id = "-1";
    if (modeltype.value === 'add') {
        isAdd = true;
    }
    if (modeltype.value === 'modify') {
        isEdit = true;
        id = props.id.value;
    }
    const dateFormat = 'YYYY-MM';
    const recordedTime = moment(new Date(props.recordingTime.value), 'YYYY-MM');
    // const time = moment(new Date(props.recordingTime.value)).format(dateFormat);
    return (
        <Form layout="inline">
            {isAdd && <FormItem label="基地">
                {getFieldDecorator('baseName', {
                    rules: [{required: true, message: '请选择基地'}]
                })(<Select style={{width: 300}}
                           onChange={(e) => {props.checkName(e, new Date(props.recordingTime.value).getTime(),id);}}>
                    {props.allBase.map((item) => {
                        return <Option key={item.id} value={item.id}>{item.name}</Option>;
                    })}
                </Select>)}
            </FormItem>}
            {isAdd && <FormItem label="数据时间">
                {getFieldDecorator('recordingTime', {
                    rules: [{required: true, message: '请选择数据时间'}]
                })(<LocaleProvider locale={zhCN}>
                    <MonthPicker value={recordedTime} format={dateFormat} allowClear={false}
                                 onChange={(e) => {props.checkName(props.baseName.value, new Date(e).getTime(),id);}}/>
                </LocaleProvider>)}
            </FormItem>}
            {isAdd && <FormItem label="地块数量">
                {getFieldDecorator('landQty', {
                    rules: [{required: true, message: '请输入地块数量'}]
                })(<Input/>)}
            </FormItem>}
            {isAdd && <FormItem label="种植面积">
                {getFieldDecorator('area', {
                    rules: [{required: true, message: '请输入种植面积'}]
                })(<Input/>)}
            </FormItem>}
            {isAdd && <FormItem label="作物数量">
                {getFieldDecorator('cropQty', {
                    rules: [{required: true, message: '请输入作物数量'}]
                })(<Input/>)}
            </FormItem>}
            {isEdit && <FormItem label="基地">
                {getFieldDecorator('baseName',{
                    rules: [{required: true, message: '请选择基地'}]
                })(<Select style={{width: 300}} onChange={(e) => {props.checkName(e.target.value,new Date(props.recordingTime.value).getTime(),id);}}>
                    {props.allBase.map((item) => {
                        return <Option key={item.id} value={item.id}>{item.name}</Option>;
                    })}
                </Select>)}
            </FormItem>}
            {isEdit && <FormItem label="数据时间">
                {getFieldDecorator('recordingTime',{
                    rules: [{required: true, message: '请选择数据时间'}]
                })(<LocaleProvider locale={zhCN}>
                    <MonthPicker value={recordedTime} allowClear={false} format={dateFormat} onChange={(e) => {props.checkName(props.baseName.value, new Date(e).getTime(),id);}}/>
                </LocaleProvider>)}
            </FormItem>}
            {isEdit && <FormItem label="地块数量">
                {getFieldDecorator('landQty', {
                    rules: [{required: true, message: '请输入地块数量'}]
                })(<Input/>)}
            </FormItem>}
            {isEdit && <FormItem label="种植面积">
                {getFieldDecorator('area', {
                    rules: [{required: true, message: '请输入种植面积'}]
                })(<Input/>)}
            </FormItem>}
            {isEdit && <FormItem label="作物数量">
                {getFieldDecorator('cropQty', {
                    rules: [{required: true, message: '请输入作物数量'}]
                })(<Input/>)}
            </FormItem>}
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
        const {id, landQty, area, cropQty, recordingTime, baseName} = this.props.fields;
        const {Cur, Psize, modaltype,year} = this.props;
        e.preventDefault();
        this.formValitate.validateFields((err) => {
            if (!err) {
                if(this.props.flag) {
                  if (modaltype === 'add') {
                    const addData = {
                      companyId: 1,
                      landQty: landQty.value,
                      area: area.value,
                      cropQty: cropQty.value,
                      recordingTime: new Date(recordingTime.value).getTime(),
                      baseId: baseName.value
                    };
                    IOModel.Adddata(addData).then((res) => {  //添加成功时的回
                      if (res.success) {
                        if (res.data !== {}) {
                          message.success('添加成功');
                          this.props.Alldatas({startPage: Cur, limit: Psize,year: year});
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
                      id: id.value,
                      companyId: 1,
                      landQty: landQty.value,
                      area: area.value,
                      cropQty: cropQty.value,
                      recordingTime: new Date(recordingTime.value).getTime(),
                      baseId: baseName.value
                    };
                    IOModel.Modifydata(modifydata).then((res) => {  //修改成功时的回调
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('修改成功');
                          this.props.Alldatas({startPage: Cur, limit: Psize,year:this.props.year});
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
                    message.warning("已存在");
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
    checkName(baseId,recordTime,id) {
        const {fields} = this.props;
        this.props.defaultFields({
            id: {
                value: fields['id'].value
            },
            baseName: {
                value: fields['baseName'].value
            },
            allBase: {
                value: fields['allBase'].value
            },
            recordingTime: {
                value: recordTime
            },
            landQty: {
                value: fields['landQty'].value
            },
            area: {
                value: fields['area'].value
            },
            cropQty: {
                value: fields['cropQty'].value
            },
            modeltype: {
                value: fields['modeltype'].value
            }
        });
        this.props.checkName(baseId,recordTime,id);
    }

    render() {
        const {modalflag, parentName, modaltype, fields} = this.props;
        let title = "编辑资产详情";
        if (modaltype === 'add') {
            title = "新增资产详情";
        }
        return (
            <div>
                <Modal
                    title={title}
                    onCancel={this.hideCancel.bind(this)}
                    visible={modalflag}
                    onOk={this.hideModal.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName='farming-admin-modal'
                >
                    <CustomizedForm {...fields} allBase={this.props.allBase} checkName={this.checkName.bind(this)} onChange={this.handleFormChange.bind(this)}
                                    getForm={this.getForm.bind(this)} parentName={parentName}/>
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {Alldate, isOk, parentname, parentID, Cur, Psize, fields, modalflag, chooseSIZE, modaltype, slideID, modifyID, slideparentID, slideName} = state.companyassetsdataReducer;
    return {
        dataList: Alldate,
        parentName: parentname,
        isok: isOk,
        parentID, modifyID,
        Cur,
        Psize,
        fields: fields,
        modalflag, modaltype, slideID,
        chooseSIZE, slideparentID, slideName
    };
};
export default connect(mapstateProps, action)(modifyModal);
