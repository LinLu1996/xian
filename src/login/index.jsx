import {Form, Input, Button, message} from 'antd';
import {Component} from 'react';
import './index.less';
import {IO} from './model';
import _ from "lodash";

const FormItem = Form.Item;

class NormalLoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountType: 'company',
            accountText: '农企'
        };
    }

    componentDidMount() {
        const params = _.replace(this.props.location.pathname, '/', '');
        let accountType = '';
        let text = '';
        let accountText = '';
        if (params && params.trim() !== '') {
            text = params.split("/")[0];
        }
        if (text === 'platform') {
            accountType = text;
            accountText = '平台';
        } else if (text === 'government') {
            accountType = text;
            accountText = '政府';
        } else if (text === 'marketing') {
            accountType = text;
            accountText = '营销';
        } else if (text === 'company') {
            accountType = text;
            accountText = '农企';
        } else {
            accountType = 'company';
            accountText = '农企';
        }
        this.setState({accountType,accountText});
    }

    handleSubmit(e) {
        const params = _.replace(this.props.location.pathname, '/', '');
        let accountType = '';
        if (params && params.trim() !== '') {
            accountType = params.split("/")[0];
        }
        localStorage.setItem('url', accountType);
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const userName = `${values.userName}|${accountType}`;
                IO.login.loginRequest({
                    username: userName,
                    password: values.password,
                    imageCode: values.text
                }).then((res) => {
                    if (res.code === 1001) {
                        location.href = '/#/';
                        sessionStorage.setItem('token', res.data.token);
                        sessionStorage.setItem('flag', true);
                    }
                }).catch((res) => {
                    message.error(res.message);
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {accountType, accountText} = this.state;
        return (
            <div className={`login-page login-page-${accountType}`}>
                <div className='login-page-top'>
                    <div className='login-page-text'>
                        <span className='login-page-first'>ET农业大脑-</span>
                        <span className='login-page-second'>{`${accountText}登录`}</span>
                    </div>
                    <div className='login-con'>
                        <div className='title'>{/*<i className='iconfont icon-nongyedanao'></i>*/}<img src={'https://img.alicdn.com/tfs/TB1Z_zLh4naK1RjSZFtXXbC2VXa-52-41.png'} className='login-con-img'/> 账号密码登录</div>
                        <Form onSubmit={this.handleSubmit.bind(this)} className="login-form" name='x-csrf-token' value=''>
                            <FormItem>
                                {getFieldDecorator('userName', {
                                    rules: [{required: true, message: '请输入用户名!'}]
                                })(
                                    <Input prefix={<i className="iconfont icon-yonghuming"
                                                      style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder={'请输入用户名'}/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: '请输入密码!'}]
                                })(
                                    <Input prefix={<i className="iconfont icon-mima" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                           type="password" placeholder={'请输入密码'}/>
                                )}
                            </FormItem>
                            <FormItem className='sub'>
                                <Button type="primary" htmlType="submit" className="login-form-button"
                                        style={{marginTop: '30px'}}>
                                    确认登录
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
export default WrappedNormalLoginForm;
