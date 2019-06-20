import {Component} from 'react';
import {Modal, Input, Form, message, Select, Radio, TreeSelect} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {IO} from '@/app/io';
import Operation from '../public.js';
import Com from '@/component/common';
import '../../index.less';
import 'moment/locale/zh-cn';

const Option2 = Select.Option;
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const RadioGroup = Radio.Group;
const CustomizedForm = Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            realName: Form.createFormField({
                ...props.realName,
                value: props.realName.value
            }),
            gender: Form.createFormField({
                ...props.gender,
                value: props.gender.value
            }),
            creatAccount: Form.createFormField({
                ...props.creatAccount,
                value: props.creatAccount.value
            }),
            type: Form.createFormField({
                ...props.type,
                value: props.type.value
            }),
            phoneNumber: Form.createFormField({
                ...props.phoneNumber,
                value: props.phoneNumber.value
            }),
            certificateNumber: Form.createFormField({
                ...props.certificateNumber,
                value: props.certificateNumber.value
            }),
            isPoverty: Form.createFormField({
                ...props.isPoverty,
                value: props.isPoverty.value
            }),
            companyId: Form.createFormField({
                ...props.companyId,
                value: props.companyId.value
            }),
            companyName: Form.createFormField({
                ...props.companyName,
                value: props.companyName.value
            })
        };
    }
})((props) => {
    props.getForm(props.form);
    const {getFieldDecorator} = props.form;
    const {listCompany, modaltype, defaultCreate, governmentCompany} = props;
    const type = props.type.value;
    const isGovernment = 'government' === localStorage.getItem('accountType');//是否政府类用户
    const isCompany = 'company' === localStorage.getItem('accountType');//是否农企类用户
    const isMarketing = 'marketing' === localStorage.getItem('accountType');//是否营销类用户
    const isPlatform = 'platform' === localStorage.getItem('accountType');//是否平台类用户
    return (
        <Form layout="inline">
        <FormItem label="类型">
                {getFieldDecorator('type', {
                    rules: []
                })(<Select disabled={modaltype !== 'add'} onChange={props.that.ontypeChange.bind(props.that)}>
                    {isPlatform && <Option2 key='3' value={3}>平台用户</Option2>}
                    {(isPlatform || isGovernment) && <Option2 key='4' value={4}>政府用户</Option2>}
                    {false && (isPlatform || isMarketing) && <Option2 key='5' value='5'>营销用户</Option2>}
                    {(isPlatform || isCompany) && <Option2 key='1' value={1}>临时工</Option2>}
                    {(isPlatform || isCompany) && <Option2 key='2' value={2}>社员</Option2>}
                </Select>)}
            </FormItem>
        {(type !== 3 && type !== 5) && <FormItem label="公司名称">
                {getFieldDecorator('companyName', {
                    rules: [{required: true, message: '请选择公司'}]
                })(<TreeSelect
                    loadData={props.that.formLoadData.bind(props.that)}
                    dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                    onChange={props.that.oncompanyChange.bind(props.that)}
                >
                    {props.that.renderTreeNodes(type !== 4 ? listCompany : governmentCompany)}
                </TreeSelect>)}
            </FormItem>}
            <FormItem label="真实姓名">
                {getFieldDecorator('realName', {
                    rules: [{required: true, pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '请输入2-6位的汉字'}]
                })(<Input placeholder='真实姓名'/>)}
            </FormItem>
            <FormItem label="手机号码">
                {getFieldDecorator('phoneNumber', {
                    rules: [{
                        required: true,
                        pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/,
                        message: '请输入正确格式手机号码'
                    }]
                })(<Input placeholder='手机号码'/>)}
            </FormItem>
            <FormItem label="身份证号码">
                {getFieldDecorator('certificateNumber', {
                    rules: []
                })(<Input placeholder='身份证号码'/>)}
            </FormItem>
            <FormItem label="性别">
                {getFieldDecorator('gender', {
                    rules: [{required: true, message: '请选择性别'}]
                })(<RadioGroup>
                    <Radio value={1}>男</Radio>
                    <Radio value={0}>女</Radio>
                </RadioGroup>)}
            </FormItem>
            {defaultCreate === 0 && <FormItem label="是否创建账号">
                {getFieldDecorator('creatAccount', {
                    rules: [{required: true, message: '请选择是否创建账号'}]
                })(<RadioGroup>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                </RadioGroup>)}
            </FormItem>}
            {(type === 1 || type === 2) && <FormItem label="是否贫穷">
                {getFieldDecorator('isPoverty', {
                    rules: []
                })(<RadioGroup>
                    <Radio value={1}>贫困</Radio>
                    <Radio value={0}>非贫困</Radio>
                </RadioGroup>)}
            </FormItem>}
        </Form>
    );
});

class modifyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loadflag: false,
            companyid: null
        };
    }

    getForm(value) {
        this.formValitate = value;
    }

    requestFn(obj, keyword, mes) {
        Operation.systemOpt(Operation.listurl(this.props.list, keyword));
        IO.system_opt.request(obj).then((res) => {
            if (res.success) {
                message.success(mes);
                this.setState({
                    loadflag: false
                });
                this.props.modal({modalFlag: false});
                if (keyword === 'employee_add') {
                    this.props.addCurrent(1);
                    this.props.Alldatas({
                        sortField: this.props.sortfield,
                        sortOrder: this.props.sortorder,
                        name: this.props.Nameval,
                        startPage: 1,
                        poor:this.props.poverty,
                        sex:this.props.sex,
                        mobilePhone1:this.props.phoneNumber,
                        limit: 10
                    });
                } else {
                    this.props.Alldatas({
                        sortField: this.props.sortfield,
                        sortOrder: this.props.sortorder,
                        name: this.props.Nameval,
                        startPage: this.props.cur,
                        poor:this.props.poverty,
                        sex:this.props.sex,
                        mobilePhone1:this.props.phoneNumber,
                        limit: this.props.psize
                    });
                }
            }
        }).catch((res) => {
            Com.errorCatch(res);
            this.setState({
                loadflag: false
            });
        });
    }

    oncompanyChange(value, label, extra) {
        this.setState({companyid: extra.triggerNode.props.dataRef.id});
    }

    ontypeChange(value) {
        if (value === 4) {
            this.props.fields.companyName.value = '';
            this.props.fields.companyName.touched = undefined;
            this.props.fields.companyName.errors = [{required: true, message: '请选择公司'}];
            this.setState({
                companyid: null
            });
        }
    }

    DataFn(type) {
        const obj = {
            realName: this.props.fields.realName.value,
            sex: this.props.fields.gender.value,
            createAccount: this.props.fields.creatAccount.value,
            type: this.props.fields.type.value,
            mobilePhone1: this.props.fields.phoneNumber.value,
            idCardType: this.props.fields.certificateType.value,
            idCardNo: this.props.fields.certificateNumber.value,
            poor: this.props.fields.isPoverty.value
        };
        if (this.state.companyid) {
            if (this.props.fields.type.value !== 3 || this.props.fields.type.value !== 5) {
                obj.companyId = this.state.companyid;
            } else {
                obj.companyId = -1;
            }
        } else {
            obj.companyId = this.props.fields.companyId.value;
        }
        if (type === 'add') {
            this.requestFn(obj, 'employee_add', '添加成功');
        } else if (type === 'modify') {
            const contrast = Object.keys(this.props.queryfields).map((item) => {
                return this.props.queryfields[item].value === this.props.fields[item].value;
            });
            obj.id = this.props.parentId;
            if (contrast.indexOf(false) !== -1) {
                this.requestFn(obj, 'employee_update', '修改成功');
            } else {
                this.setState({
                    loadflag: false
                });
                message.warning('请修改后再提交');
            }
        }
    }

    hideModal() {
        this.formValitate.validateFields((err) => {
            const {modaltype} = this.props;
            if (err) {
                this.setState({
                    loadflag: false
                });
                return false;
            } else {
                this.setState({
                    loadflag: true
                });
                this.DataFn(modaltype);
            }
        });
    }

    hideCancel() {
        this.props.modal({modalFlag: false});
    }

    handleFormChange(changedFields) {
        const fields = this.props.fields;
        this.props.defaultFields({...fields, ...changedFields});
    }

    renderTreeNodes(data) {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} value={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} value={item.title} dataRef={item}/>;
        });
    }

    formLoadData(treeNode) {  //点击展开时的调用
        const listCompany = this.props.listCompany;
        return new Promise((resolve) => {
            IO.employee.CompanyChild({id: treeNode.props.dataRef.id}).then((res) => {
                const Treedata = Operation.CompanyTreelist(res.data, treeNode);
                treeNode.props.dataRef.children = Treedata;
                this.props.treeNodeData(listCompany);
            });
            resolve();
        });
    }

    render() {
        const me = this;
        const {modalflag, fields, modaltype, listCompany, governmentCompany, defaultCreate} = this.props;
        const {loadflag} = this.state;
        let tit;
        let comname;
        (localStorage.getItem('companyName') && localStorage.getItem('companyName') !== 'null') ? comname = `${localStorage.getItem('companyName')} / ` : comname = '';
        modaltype === 'add' ? tit = '新增员工' : tit = '编辑员工';
        //const isPlatform = 'platform' === localStorage.getItem('accountType');//是否平台类用户
        const ModalOpt = {
            //isPlatform: isPlatform,
            getForm: me.getForm.bind(me),
            modaltype: modaltype,
            onChange: me.handleFormChange.bind(me),
            listCompany: listCompany,
            governmentCompany: governmentCompany,
            defaultCreate: defaultCreate,
            that: me
        };
        return (
            <div>
                <Modal
                    title={`${comname}${tit}`}
                    visible={modalflag}
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    confirmLoading={loadflag}
                    wrapClassName='system-modal farming-admin-modal'
                >
                    <CustomizedForm {...fields} {...ModalOpt}/>
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {Alldate, fields, modalflag, sortfield, sortorder, modaltype, parentid, queryfields} = state.employeeReducer;
    return {
        dataList: Alldate,
        fields,
        modalflag,
        modaltype,
        parentId: parentid,
        queryfields,
        list: state.systemReducer.listdata,
        sortfield, sortorder
    };
};
export default connect(mapstateProps, action)(modifyModal);