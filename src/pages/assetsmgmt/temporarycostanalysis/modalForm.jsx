import {Component} from 'react';
import {connect} from 'react-redux';
import {action} from './model';
import './index.less';
import {Modal, Form, Table, Button, LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
const FormItem = Form.Item;
const CustomizedForm = Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            typeName: Form.createFormField({
                value: props.typeName.value
            }),
            plannedTime: Form.createFormField({
                value: props.plannedTime.value
            }),
            baseName: Form.createFormField({
                value: props.baseName.value
            }),
            landName: Form.createFormField({
                value: props.landName.value
            }),
            cropName: Form.createFormField({
                value: props.cropName.value
            }),
            supervisor: Form.createFormField({
                value: props.supervisor.value
            }),
            dataList: Form.createFormField({
                value: props.dataList.value
            }),
            countList: Form.createFormField({
                value: props.countList.value
            })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    const columns = [
        {
            title: '临时工姓名',
            dataIndex: 'employeeName',
            align: "center"
        }, {
            title: '计数',
            dataIndex: 'duration',
            align: "center"
        }, {
            title: '计量单位',
            dataIndex: 'unitName',
            align: "center"
        },{
            title: '酬薪（元）',
            dataIndex: 'pay',
            align: "center"
        }];
    const columns1 = [
        {
            title: '总人数',
            dataIndex: 'numTotal',
            align: "center"
        },{title: '',
            dataIndex: '',
            align: "center",
            width:80
        },{title: '',
            dataIndex: '',
            align: "center",
            width: 118
        },{
            title: '总酬薪',
            dataIndex: 'wagesTotal',
            align: "center"
        }];
    return (<div className='temCost-res-pagination'>
            <Form layout="inline">
                <div className='temCost-form-layout'>
                    <FormItem label="农事任务">
                        {getFieldDecorator('typeName', {})(<div>{<div>{props.typeName.value}</div>}</div>)}
                    </FormItem>
                    <FormItem label="执行日期">
                        {getFieldDecorator('plannedTime', {})(<div>{<div>{props.plannedTime.value}</div>}</div>)}
                    </FormItem>
                </div>
                <div className='temCost-form-layout'>
                    <FormItem label="基地">
                        {getFieldDecorator('baseName', {})(<div>{<div>{props.baseName.value}</div>}</div>)}
                    </FormItem>
                    <FormItem label="地块">
                        {getFieldDecorator('landName', {})(<div>{<div>{props.landName.value}</div>}</div>)}
                    </FormItem>
                </div>
                <div className='temCost-form-layout'>
                    <FormItem label="种植作物">
                        {getFieldDecorator('cropName', {})(<div>{<div>{props.cropName.value}</div>}</div>)}
                    </FormItem>
                    <FormItem label="负责人">
                        {getFieldDecorator('supervisor', {})(<div>{<div>{props.supervisor.value}</div>}</div>)}
                    </FormItem>
                </div>
            </Form>
                <div className='tem-table'>
                    <LocaleProvider locale={zhCN}>
                        <Table bordered rowKey={record => record.employeeName} columns={columns} dataSource={props.dataList.value} pagination={false}/>
                    </LocaleProvider>
                </div>
                <div className='tem-table'>
                    <LocaleProvider locale={zhCN}>
                        <Table className='tem-table' bordered columns={columns1} dataSource={props.countList.value} pagination={false}/>
                    </LocaleProvider>
                </div>
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

    hideCancel() {   //点击关闭的回调函数
        this.props.modal({modalFlag: false, modeltype: 'add'});
    }

    handleFormChange(changedFields) {
        const fields = this.props.fields;
        this.props.defaultFields({...fields, ...changedFields});
    }

    render() {
        const {modalflag, parentName, fields} = this.props;
        return (
            <div>
                <Modal className='temCost-modal-button'
                       title='详情'
                       visible={modalflag}
                       onCancel={this.hideCancel.bind(this)}
                       footer={[
                           <Button className='temporary-submit' key="submit" type="primary" onClick={this.hideCancel.bind(this)}>
                               关闭
                           </Button>
                       ]}
                       wrapClassName='res-modal'
                >
                    <CustomizedForm {...fields} onChange={this.handleFormChange.bind(this)} parentName={parentName}
                                    checkName={this.props.checkName}/>
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {Alldate, isOk, parentname, parentID, Cur, Psize, fields, modalflag, chooseCUR, chooseSIZE, modaltype, slideID, modifyID, slideparentID, slideName} = state.temporarycostanalysisReducer;
    return {
        dataList: Alldate,
        parentName: parentname,
        parentID, modifyID,
        Cur,
        Psize,
        fields: fields,
        isok: isOk,
        modalflag, modaltype, slideID,
        chooseCUR, chooseSIZE, slideparentID, slideName
    };
};
export default connect(mapstateProps, action)(modifyModal);
