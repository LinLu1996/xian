import {Form, Input, Button,Radio} from 'antd';
import {Component} from 'react';
import './index.less';
import {connect} from 'react-redux';
import {action} from "@/register/model";
const RadioGroup = Radio.Group;
import {IO} from './model';
import React from "react";

const FormItem = Form.Item;
class UserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navList: ['个人注册', '企业注册'],
            stepList: [{id: '01', name: '设置个人信息'}, {id: '02', name: '申请成功'}],
            step: 1,
            closure: null,
            openFlag: false
        };
    }

    componentDidMount() {
        if (!this.props.phone) {
            this.props.history.push(`/register`);
        }
        IO.register.getUserInfo({mobilePhone: this.props.phone}).then((res) => {
            if (res.success && res.data) {
                const data = res.data.registerEmployee;
                const fields = {
                    name: data.name,
                    sex: data.sex,
                    mobilePhone: data.mobilePhone,
                    idCardNo: data.idCardNo
                };
                this.props.form.setFieldsValue(fields);
            }
        });

    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const vm = {
                    name: values.name,
                    sex: values.sex,
                    idCardNo: values.idCardNo,
                    mobilePhone: values.mobilePhone,
                    password: values.password
                };
                IO.register.postUserForm(vm).then((res) => {
                    if (res.success) {
                        this.setState({
                            step: 2
                        });
                    }
                });
            }
        });
    }

    handlePrev() {
        this.props.history.push(`/register`);
    }

    changeEye(flag) {
        this.setState({
            openFlag: flag
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {activeNav, phone} = this.props;
        const {navList, stepList, step, openFlag} = this.state;
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
                        {/*<Steps labelPlacement='vertical' current={step}>
                        <Step title="表单信息" />
                        <Step title="申请成功" />
                    </Steps>*/}
                        <div className='register-step-list' style={{width: '520px'}}>
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
                            step===1 && <div className='enterprise'>
                                <Form onSubmit={this.handleSubmit.bind(this)} className="user-form" style={{marginTop: '25px'}}>
                                    <FormItem label="姓名">
                                        {getFieldDecorator('name', {
                                            rules: [{required: true, message: '请输入姓名'},
                                                {pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '请输入2-6位汉字'}]
                                        })(<Input placeholder='请输入2-6位汉字'/>)}
                                    </FormItem>
                                    <FormItem label="性别">
                                        {getFieldDecorator('sex',{
                                            initialValue: 1,
                                            rules: [{required: true}]
                                        })(<RadioGroup>
                                            <Radio value={1}>男</Radio>
                                            <Radio value={0}>女</Radio>
                                        </RadioGroup>)}
                                    </FormItem>
                                    <FormItem label="身份证">
                                        {getFieldDecorator('idCardNo', {
                                            rules: [{required: true, message: '请输入身份证'},
                                                {pattern: /^((\d{15})|(\d{17}([0-9]|X)))$/, message: '请输入正确的身份证'}
                                            ]
                                        })(<Input/>)}
                                    </FormItem>
                                    <FormItem label="手机号">
                                        {getFieldDecorator('mobilePhone',{
                                            initialValue: phone,
                                            rules: []
                                        })(<Input disabled/>)}
                                    </FormItem>
                                    {openFlag ? <FormItem label="登录密码设置">
                                        {getFieldDecorator('password', {
                                            rules: [{required: true, message: '请输入登录密码'},
                                                {pattern: /^[0-9a-zA-Z]{6,12}$/,message: '请输入6-12位密码，只能是字母和数字'}]
                                        })(<div className='password-input'><Input placeholder='请输入6-12位密码，只能是字母和数字'/>
                                            <i className='iconfont icon-yanjing' onClick={this.changeEye.bind(this,false)}></i></div>)}
                                    </FormItem> : <FormItem label="登录密码设置">
                                        {getFieldDecorator('password', {
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
                        {step === 2 && <div className='application-box' style={{marginTop: '100px'}}>
                            <div className='application-page'>
                                <div>
                                    <img width={150} src='https://img.alicdn.com/tfs/TB153RsrmzqK1RjSZFjXXblCFXa-205-205.png'/>
                                    {/*<Progress type="circle" percent={100} />*/}
                                </div>
                                <div className='success'>申请成功</div>
                                <div className='info'>正在审核中，请耐心等待~~</div>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        );
    }
}

const WrappedUserForm = Form.create()(UserForm);
const mapStateprops = (state) => {
    const {phone, activeNav} = state.registerReducer;
    return {
        phone,
        activeNav
    };
};
export default connect(mapStateprops, action)(WrappedUserForm);

