import {Form, Input, Button, message, Upload, Icon, Modal, Radio} from 'antd';
import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IO, IOModel} from "./model";
import './index.less';
import React from "react";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class CompanyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            registerCompany:{companyName:'',creditCode:'',address:'',dingtalkId:''},
            employee:{},
            previewVisible: false,
            previewImage: '',
            step: 1,
            openFlag: false,
            navList: ['个人注册', '企业注册'],
            stepList: [{id: '01', name: '设置企业信息'}, {id: '02', name: '设置管理员信息'}, {id: '03', name: '申请成功'}]
        };
        this.handleState=this.handleState.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.handlePreview=this.handlePreview.bind(this);
        this.handleRemove=this.handleRemove.bind(this);
    }

    componentDidMount() {
        if (!this.props.phone) {
            this.props.history.push(`/register`);
        }
        IO.register.getCompanyInfo({mobilePhone: this.props.phone}).then((res) => {
            if (res.success && res.data) {
                const company = res.data.registerCompany || {};
                const employee = company.registerEmploye || {};
                const fileList = company.workFiles || [];
                fileList.length > 0 && fileList.map((item) => {
                    item.uid = item.id;
                });
                const fields = {
                    companyName: company.name,
                    creditCode: company.creditCode,
                    dingtalkId: company.dingtalkId,
                    fileList: fileList,
                    address: company.address
                };
                this.setState({employee, fileList});
                this.props.form.setFieldsValue(fields);
            }
        });
    }
    checkName(e) {
        if(e.target.value) {
            IOModel.CheckName({name:e.target.value}).then((res) => {  //添加成功时的回
                if (res.success) {
                    return;
                } else {
                    message.warning(res.message);
                }
            }).catch((res) => {
                message.warning(res.message);
                this.props.form.setFieldsValue({
                    companyName:''
                });
            });
        }
    }
    handleSubmit(e) {
        e.preventDefault();
        const {step} = this.state;
        if (step === 1) {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    const list = Object.assign({}, values);
                    this.setState({
                        registerCompany: list,
                        step: 2
                    });
                }
            });
        } else if (step === 2) {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    const list = Object.assign({}, values);
                    this.setState({
                        employee: list
                    });
                    const company = this.state.registerCompany;
                    company.name = company.companyName;
                    const vm={
                        registerCompany: JSON.stringify(company),
                        employee: JSON.stringify(list),
                        workFiles: JSON.stringify(this.state.fileList)
                    };
                    IOModel.CompanySubmit(vm).then((res) => {
                        if(res.success) {
                            message.success('注册成功');
                            this.setState({
                                step: 3
                            });
                        } else {
                            message.error(res.message);
                        }
                    }).catch((res) => {
                        message.error(res.message);
                    });
                }
            });
        }
    }

    handleCancel() {  //关闭弹出照片
        this.setState({previewVisible: false});
    }

    handleState(fileList) {
        this.setState({
            fileList: fileList
        });
    }

    handleChange(file) {  //改变照片数组
        const files_ = this.state.fileList;
        const index = files_.length - 1;
        file.uid = index;
        files_.splice(index, 1);
        files_.push(file);
        this.setState({
            fileList: files_
        });
    }

    handlePreview(file) { //弹出照片
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        });
    }

    handleRemove(file) {
        const files_ = this.state.fileList;
        files_.map((item, index) => {
            if (item.path === file.path) {
                files_.splice(index, 1);
            }
        });
        this.setState({
            fileList: files_
        });
    }

    handlePrev() {
        const step = this.state.step;
        if (step === 1) {
            this.props.history.push(`/register`);
        } else {
            this.setState({
                step: step - 1
            });
        }
    }

    handleNext() {
        const step = this.state.step;
        this.props.form.validateFields((err) => {
            if (!err) {
                this.setState({
                    step: step + 1
                });
            }
        });
    }

    changeEye(flag) {
        this.setState({
            openFlag: flag
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const _this = this;
        const {fileList, previewVisible, previewImage,step, stepList, navList,registerCompany,employee,openFlag} = this.state;
        const {activeNav,phone} = this.props;
        // this.props.form.setFieldsValue({
        //     mobilePhone: phone
        // });
        const propsUpload = {
            name: 'file',
            accept: 'image/jpg,image/jpeg,image/png,image/bmp',
            action: '/register/file',
            //multiple: true,
            fileList: fileList,
            listType: "picture-card",
            headers: {
                authorization: 'authorization-text'
            },
            beforeUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    message.error('图片小于2MB!');
                }
                return isLt2M;
            },
            async onChange(info) {
                if (info.file.status === 'uploading') {
                    await _this.handleState(info.fileList);
                }
                if (info.file.status === 'done') {
                    if (info.file.response.success) {
                        const data = info.file.response.data || {};
                        data.status = 'done';
                        await _this.handleChange(data);
                    } else {
                        message.error(info.file.response.message);
                    }
                } else if (info.file.status === 'error') {
                    message.error('上传失败');
                }
            },
            onPreview(file) {  //展示
                _this.handlePreview(file);
            },
            onRemove(file) {  //删除
                if (file.status === 'removed') {
                    _this.handleRemove(file);
                } else if (file.status === 'error') {
                    message.error('删除失败');
                }
            }
        };
        return (
            <div className='register-page'>
                <div className='register-box'>
                    <div className='register-header'>
                        <div className='register-title'>账号注册</div>
                        <div className='register-nav-list'>
                            <ul>
                                {navList.map((item, index) => {
                                    return <li key={index} className={index === activeNav ? 'active-nav' : ''}>
                                        <i className={index === 0 ? 'iconfont icon-yonghuming' : 'iconfont icon-zufang'}></i><span>{item}</span></li>;
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className='register-step'>
                        <div className='register-step-list'>
                            <ul>
                                {stepList.map((item, index) => {
                                    return <li key={index} className={index < step ? 'active-step' : ''}>
                                        <span className='step-index'>{item.id}</span>
                                        <span className='step-title'>{item.name}</span>
                                    </li>;
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className='register-content register-step-content'>
                        {
                            step === 1 && <div className='enterprise' style={{width: '500px'}}>
                                <Form onSubmit={this.handleSubmit.bind(this)} className="enterprise-form" style={{marginTop: '25px'}}>
                                    <FormItem label="企业名称">
                                        {getFieldDecorator('companyName',{
                                            initialValue: registerCompany.companyName?registerCompany.companyName:'',
                                            rules: [{required: true, message: '请输入企业名称'}]
                                        })(<Input onBlur={(e) => {this.checkName(e);}}/>)}
                                    </FormItem>
                                    <FormItem label="社会信用代码（注册号）">
                                        {getFieldDecorator('creditCode', {
                                            initialValue: registerCompany.creditCode?registerCompany.creditCode:'',
                                            rules: [{required: true, message: '请输入社会信用代码'}]
                                        })(<Input/>)}
                                    </FormItem>
                                    <FormItem label="注册地点">
                                        {getFieldDecorator('address', {
                                            initialValue: registerCompany.address?registerCompany.address:'',
                                            rules: [{required: true, message: '请输入注册地点'}]
                                        })(<Input/>)}
                                    </FormItem>
                                    <FormItem label="企业钉钉号">
                                        {getFieldDecorator('dingtalkId',{
                                            initialValue: registerCompany.dingtalkId?registerCompany.dingtalkId:'',
                                            rules: []
                                        })(<Input placeholder={'例：ding11caab4ba'}/>)}
                                    </FormItem>
                                    <FormItem label="营业执照" className='image-box'>
                                        {getFieldDecorator('fileList', {rules: []})(<div className="clearfix">
                                            <Upload {...propsUpload}>
                                                {fileList.length >= 6 ? null :
                                                    <div>
                                                        <Icon type="plus"/>
                                                        <div className="ant-upload-text">点击上传</div>
                                                    </div>
                                                }
                                            </Upload>
                                            <Modal visible={previewVisible} footer={null}
                                                   onCancel={this.handleCancel.bind(this)}>
                                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                                            </Modal>
                                        </div>)}
                                    </FormItem>
                                    <FormItem className='sub'>
                                        <Button type="primary" className="login-form-button" onClick={this.handlePrev.bind(this)}>
                                            上一步
                                        </Button>
                                        <Button type="primary" htmlType="submit" className="login-form-button">
                                            下一步
                                        </Button>
                                    </FormItem>
                                </Form>
                            </div>
                        }
                        {
                            step === 2 && <div className='enterprise'>
                                <Form onSubmit={this.handleSubmit.bind(this)} className="login-form" style={{marginTop: '25px'}}>
                                    <FormItem label="管理员姓名">
                                        {getFieldDecorator('name',{
                                            initialValue:employee.name?employee.name:'',
                                            rules: [{required: true, message: '请输入管理员姓名'},
                                                {pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '请输入2-6位汉字'}]
                                        })(<Input placeholder='请输入2-6位汉字'/>)}
                                    </FormItem>
                                    <FormItem label="性别">
                                        {getFieldDecorator('sex',{
                                            initialValue:employee.sex===0 ?employee.sex : 1,
                                            rules: [{required: true, message: '请选择性别'}]
                                        })(<RadioGroup>
                                            <Radio value={1}>男</Radio>
                                            <Radio value={0}>女</Radio>
                                        </RadioGroup>)}
                                    </FormItem>
                                    <FormItem label="身份证">
                                        {getFieldDecorator('idCardNo', {
                                            initialValue:employee.idCardNo?employee.idCardNo:'',
                                            rules: [{required: true, message: '请输入身份证'},
                                                {pattern: /^((\d{15})|(\d{17}([0-9]|X)))$/, message: '请输入正确的身份证'}]
                                        })(<Input/>)}
                                    </FormItem>
                                    <FormItem label="手机号">
                                        {getFieldDecorator('mobilePhone',{
                                            initialValue:phone,
                                            rules: []
                                        })(<Input disabled/>)}
                                    </FormItem>
                                    {openFlag ? <FormItem label="登录密码设置">
                                        {getFieldDecorator('password', {
                                            initialValue:employee.password?employee.password:'',
                                            rules: [{required: true, message: '请输入登录密码'},
                                                {pattern: /^[0-9a-zA-Z]{6,12}$/,message: '请输入6-12位密码，只能是字母和数字'}]
                                        })(<div className='password-input'><Input placeholder='请输入6-12位密码，只能是字母和数字'/>
                                            <i className='iconfont icon-yanjing' onClick={this.changeEye.bind(this,false)}></i></div>)}
                                    </FormItem> : <FormItem label="登录密码设置">
                                        {getFieldDecorator('password', {
                                            initialValue:employee.password?employee.password:'',
                                            rules: [{required: true, message: '请输入登录密码'},
                                                {pattern: /^[0-9a-zA-Z]{6,12}$/,message: '请输入6-12位密码，只能是字母和数字'}]
                                        })(<div className='password-input'><Input type='password' placeholder='请输入6-12位密码，只能是字母和数字'/>
                                            <i className='iconfont icon-yanjing-bi' onClick={this.changeEye.bind(this,true)}></i></div>)}
                                    </FormItem>}
                                    <FormItem className='sub'>
                                        <Button type="primary" className="login-form-button" onClick={this.handlePrev.bind(this)}>
                                            上一步
                                        </Button>
                                        <Button type="primary" htmlType="submit" className="login-form-button">
                                            提交注册申请
                                        </Button>
                                    </FormItem>
                                </Form>
                            </div>
                        }
                        {
                            step === 3 && <div className='application-box' style={{marginTop: '100px'}}>
                                <div className='application-page'>
                                    <div>
                                        <img width={150}
                                             src='https://img.alicdn.com/tfs/TB153RsrmzqK1RjSZFjXXblCFXa-205-205.png'/>
                                    </div>
                                    <div className='success'>申请成功</div>
                                    <div className='info'>正在审核中，请耐心等待~~</div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const WrappedCompanyForm = Form.create()(CompanyForm);
const mapStateprops = (state) => {
    const {phone, activeNav} = state.registerReducer;
    return {
        phone,
        activeNav
    };
};
export default connect(mapStateprops, action)(WrappedCompanyForm);
