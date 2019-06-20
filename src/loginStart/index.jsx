import {Component} from 'react';
import {Button} from 'antd';
import './index.less';

class LoginStart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountType: 'company',
            accountText: '农企'
        };
    }
    handleLogin() {
        let url = localStorage.getItem('url');
        if(!url) {
            url = "platform";
        }
        this.props.history.push(`/${url}/login`);
    }
    handleRegister() {
        this.props.history.push('/register');
    }

    render() {
        return (
            <div className='login-page-start login-page-company'>
                <div className='login-page-top'>
                    <div className='login-page-text'>
                        <span className='login-page-first'>AI</span>
                        <span className='login-page-second'>种植</span>
                        <div className='login-page-con'>
                            <span className='login-page-con-top'>就是爱种植</span>
                            <span className='login-page-con-bottom'></span>
                        </div>
                        <div className='login-page-top-btn'>
                            <Button className="login-form-button" onClick={this.handleLogin.bind(this)}>立即登录</Button>
                            <Button className="login-form-button" onClick={this.handleRegister.bind(this)}>立即注册</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginStart;
