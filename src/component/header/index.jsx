import './index.less';
import {Component} from 'react';
import {connect} from "react-redux";
import {NavLink, Link} from "react-router-dom";
import {withRouter} from "react-router";
import {context, IO} from '@/app/io';
import {action} from '@/app/model';
import Com from '../common/index.js';

//import { message } from 'antd';
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datauser: ''
        };
    }

    async componentDidMount() {
        IO.infouser.getCurrentUserInfo().then((res) => {
            this.setState({datauser: res.data});
            localStorage.setItem('companyName', res.data.companyName);
            localStorage.setItem('accountType',res.data.accountType);
            localStorage.setItem('roleType',res.data.roleType ? res.data.roleType : 3);
        }).catch((res) => {
            Com.errorCatch(res);
        });
        this.props.getMenu();
        await this.props.getSecurityKeyword();
    }

    exit() {
        sessionStorage.removeItem('base');
        context.create('header', {
            exit: {
                mockUrl: '/proxy/sigOut',
                url: '/sigOut',
                method: 'POST'
            }
        });
        IO.header.exit().then((res) => {
            if (res.success) {
                sessionStorage.setItem('flag', false);
                //location.href=`/#/${localStorage.getItem('url')}/login`;
                location.href=`/#/portal`;
                //localStorage.removeItem('url');
                localStorage.removeItem('companyName');
                localStorage.removeItem('accountType');
            }
        });
    }

    render() {
        const {headerStyle, data} = this.props;
        const {datauser} = this.state;
        //const comlogo = datauser.companyLogo ? datauser.companyLogo.match(/\.(jpeg|jpg|gif|png)$/) : '';
        return (<header style={headerStyle && JSON.parse(headerStyle) || {}} className="body-header">
            <div className="logo-png">
                <Link to="/">
                    <img src={'https://img.alicdn.com/tfs/TB1Z_zLh4naK1RjSZFtXXbC2VXa-52-41.png'} className='logo-img'/>
                    {/*<i className='iconfont icon-nongyedanao'/>*/}
                    <span className='english-span'>ET</span><span>农业大脑</span>
                    {datauser.companyName ? <b></b> : ''}
                    {/*{
                        datauser.companyLogo ? comlogo !== null ? <img src={datauser.companyLogo}/> :
                            <span className='logo-tit'>{datauser.companyLogo}</span> : ''
                    }*/}
                    {
                        datauser.companyName ? <span className='logo-tit'>{datauser.companyName}</span> : ''
                    }
                </Link>
            </div>
            <ul className="header-menu-list">
                {data !== null && data.map(item => {
                    const url = item.pageUrl ? `${item.pageUrl}` : '/';
                    return <li key={`${item.id}`}><NavLink to={url}>{item.resName}</NavLink></li>;
                })}
            </ul>
            <div className="header-user-info">
                <NavLink target="_Blank" className="font-color-j" style={{color: '#ccc'}}
                         to={`/pages/system/employee/user/${datauser.userId}`}>你好，{datauser.userName}</NavLink>
            </div>
            <div className="header-exit" onClick={this.exit.bind(this)}>
                <a>
                    <i className="iconfont icon-exit"></i>
                    退出
                </a>
            </div>
        </header>);
    }
}

const mapStateToProps = (state) => {
    const {headerStyle, logoUrl, userInfo, menuList, logoimg} = state.initReducer;
    return {
        headerStyle, logoUrl, userInfo, menuList, logoimg
    };
};
export default withRouter(connect(mapStateToProps, action)(Header));

