import {Form, Input, Button, message} from 'antd';
import {Component} from 'react';
import './index.less';
import {connect} from 'react-redux';
import {action} from "@/register/model";
import {IO} from './model';
import React from "react";
// import _ from "lodash";

const FormItem = Form.Item;

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navList: ['个人注册', '企业注册'],
            activeNav: 0,
            closure: null,
            countDown: 120,
            codeFlag: false
        };
    }

    componentDidMount() {
        this.props.setRecord({phone: '', nav: 0});
    }

    handleSubmit(e) {
        const {activeNav} = this.state;
        e.preventDefault();
        this.props.form.validateFields((err) => {
            if (!err) {
                const phone = this.props.form.getFieldValue('phone');
                const code = this.props.form.getFieldValue('code');
                IO.register.checkRegisterCode({mobilePhone: phone, code: code,type:activeNav}).then((res) => {
                    if (res.success) {
                        if(this.state.closure) {
                            clearTimeout(this.state.closure);
                        }
                        this.props.setRecord({phone, activeNav});
                        if (activeNav === 0) {
                            this.props.history.push(`/user/register`);
                        } else {
                            this.props.history.push(`/company/register`);
                        }
                    } else {
                        message.error(res.message);
                    }
                }).catch((res) => {
                    message.error(res.message);
                });
            }
        });
    }

    handleChangeNav(index) {
        this.setState({
            activeNav: index
        });
    }

    countDown() {
        const time = this.state.countDown;
        this.setState({
            countDown: time - 1
        }, () => {
            if(this.state.closure) {
                clearTimeout(this.state.closure);
            }
            this.setState({
                closure : setTimeout(() => {
                    if (time > 1) {
                        this.countDown();
                    } else {
                        this.setState({
                            countDown: 120,
                            codeFlag: false
                        });
                    }
                },1000)
            });
        });
    }

    getCode() {
        this.props.form.validateFields((['phone']),(err) => {
            if (!err) {
                const phone = this.props.form.getFieldValue('phone');
                IO.register.getRegisterCode({mobilePhone: phone}).then((res) => {
                    if (res.success) {
                        this.setState({
                            codeFlag: true
                        });
                        this.countDown();
                    } else {
                        message.error(res.message);
                    }
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {navList, activeNav, countDown, codeFlag} = this.state;
        return (
            <div className='register-page'>
                <div className='register-box'>
                    <div className='register-header' style={{borderBottom: '1px solid #ccc'}}>
                        <div className='register-title'>账号注册</div>
                        <div className='register-nav-list'>
                            <ul>
                                {navList.map((item, index) => {
                                    return <li key={index} className={index === activeNav ? 'active-nav point' : 'point'} onClick={this.handleChangeNav.bind(this, index)}>
                                        <i className={index === 0 ? 'iconfont icon-yonghuming' : 'iconfont icon-zufang'}></i><span>{item}</span></li>;
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className='register-content'>
                        <Form onSubmit={this.handleSubmit.bind(this)} className="register-form" layout="inline" style={{marginTop: '150px'}}>
                            <FormItem label='手机号'>
                                {getFieldDecorator('phone', {
                                    rules: [{required: true, message: '请输入手机号'},
                                        {pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/, message: '请输入正确的手机号'}]
                                })(
                                    <Input placeholder='请输入手机号' style={{width: '300px'}}/>
                                )}
                            </FormItem>
                            <FormItem label='短信验证码'>
                                {getFieldDecorator('code', {
                                    rules: [{required: true, message: '请输入短信验证码'}]
                                })(
                                    <div>
                                        <Input placeholder={'请输入短信验证码'} style={{width: '150px'}}/>
                                        {codeFlag ? <Button className='code-button' type='primary' style={{color: '#fff'}} disabled>{countDown}秒</Button> :
                                            <Button className='code-button' type='primary' onClick={this.getCode.bind(this)}>获取验证码</Button>}
                                    </div>
                                )}
                            </FormItem>
                            <FormItem className='sub'>
                                {getFieldDecorator('submit', {
                                    rules: []
                                })(
                                    <Button type="primary" htmlType="submit" className="register-form-button">
                                        下一步
                                    </Button>
                                )}
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}
const WrappedRegisterForm = Form.create()(RegisterForm);
const mapStateprops = (state) => {
    const {phone, activeNav} = state.registerReducer;
    return {
        phone,
        activeNav
    };
};
export default connect(mapStateprops, action)(WrappedRegisterForm);
