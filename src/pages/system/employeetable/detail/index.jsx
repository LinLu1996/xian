import { Component } from 'react';
import './index.less';
import { IO} from '@/app/io';
import _ from "lodash";
import {Input,Modal, Button,message} from 'antd';
import Com from "@/component/common";
class Detail extends Component {
  constructor (props) {
    super(props);
    this.state = {
        data :'',
        visible:false,
        sex__:'',
        loading:false,
        moredata:'',
        oldpassword:'',
        newpassword1:'',
        newpassword2:'',
        moreflag:false,
        namechang:true,
        empname:'',
        empsex:'',
        empmobilePhone:'',
        empnation:'',
        empemail:'',
        empremark:'',
        sexchang:true,
        remarkchang:true,
        emailchang:true,
        nationchang:true,
        mobilePhonechang:true
    };
  }
  setname () {
    if(this.state.namechang) {
      this.setState({namechang:false});
    }else {
      this.setState({namechang:true});
    }
  }
  setsex() {
    if(this.state.sexchang) {
      this.setState({sexchang:false});
    }else {
      this.setState({sexchang:true});
    }
  }
  setemail() {
    if(this.state.emailchang) {
      this.setState({emailchang:false});
    }else {
      this.setState({emailchang:true});
    }
  }
  setmobilePhone() {
    if(this.state.mobilePhonechang) {
      this.setState({mobilePhonechang:false});
    }else {
      this.setState({mobilePhonechang:true});
    }
  }
  setremark() {
    if(this.state.remarkchang) {
      this.setState({remarkchang:false});
    }else {
      this.setState({remarkchang:true});
    }
  }
  setnation() {
    if(this.state.nationchang) {
      this.setState({nationchang:false});
    }else {
      this.setState({nationchang:true});
    }
  }
  setnamep () {
    ///Operation.systemOpt(Operation.listurl(this.props.list,'employee_update'));
    IO.employee.xiugaiuser({
      key:'realName',
      value:this.state.empname
    }).then((res) => {
      if(res.success) {
        message.success('修改成功');
        this.setname();
        this.getuserinfo();
      }
    }).catch((res) => {
      Com.errorCatch(res);
    });
  }
  setmobilePhonep () {
    ///Operation.systemOpt(Operation.listurl(this.props.list,'employee_update'));
    IO.employee.xiugaiuser({
      key:'mobilePhone1',
      value:this.state.empmobilePhone
    }).then((res) => {
      if(res.success) {
        message.success('修改成功');
        this.setmobilePhone();
        this.getuserinfo();
      }
    }).catch((res) => {
      Com.errorCatch(res);
    });
  }
  setnationp () {
    IO.employee.xiugaiuser({
      key:'nation',
      value:this.state.empnation
    }).then((res) => {
      if(res.success) {
        message.success('修改成功');
        this.setnation();
        this.getuserinfo();
      }
    }).catch((res) => {
      Com.errorCatch(res);
    });
  }
  setemailp () {
    IO.employee.xiugaiuser({
      key:'email',
      value:this.state.empemail
    }).then((res) => {
      if(res.success) {
        message.success('修改成功');
        this.setemail();
        this.getuserinfo();
      }
    }).catch((res) => {
      Com.errorCatch(res);
    });
  }
  setremarkp () {
    ///Operation.systemOpt(Operation.listurl(this.props.list,'employee_update'));
    IO.employee.xiugaiuser({
      key:'remark',
      value:this.state.empremark
    }).then((res) => {
      if(res.success) {
        message.success('修改成功');
        this.setremark();
        this.getuserinfo();
      }
    }).catch((res) => {
      Com.errorCatch(res);
    });
  }
  setsexp () {
    if(this.state.empsex==='男') {
        IO.employee.xiugaiuser({
        key:'sex',
        value:1
      }).then((res) => {
        if(res.success) {
          message.success('修改成功');
          this.setsex();
          this.getuserinfo();
        }
      });
    }else if(this.state.empsex==='女') {
      IO.employee.xiugaiuser({
        key:'sex',
        value:0
      }).then((res) => {
        if(res.success) {
          message.success('修改成功');
          this.setsex();
          this.getuserinfo();
        }
      }).catch((res) => {
        Com.errorCatch(res);
      });
    } else {
      message.warning('性别只能是男或女');
    }
  }
  empname (event) {
    this.setState({empname:event.target.value});
  }
  empsex (event) {
    this.setState({empsex:event.target.value});
  }
  empmobilePhone (event) {
    this.setState({empmobilePhone:event.target.value});
  }
  empnation (event) {
    this.setState({empnation:event.target.value});
  }
  empemail (event) {
    this.setState({empemail:event.target.value});
  }
  empremark (event) {
    this.setState({empremark:event.target.value});
  }
  getuserinfo () {
    if(this.props.location.pathname.search("user/") !== -1) {
      this.setState({moreflag:true});
      IO.infouser.getCurrentUserInfo().then((res) => {
        if (res.success) {
          this.setState({moredata:res.data});
        }
      });
      IO.employee.huoquuserinfo().then((res) => {
        this.typeSex(res.data.sex);
        this.setState({
          data:res.data
        });
      }).catch(Com.errorCatch);
    }else{
      const id_ =  _.replace(this.props.location.pathname, '/pages/system/employee/', '');
      IO.employee.iduserinfo({':id':id_}).then((res) => {
        this.typeSex(res.data.sex);
        this.setState({
          data:res.data
        });
      }).catch(Com.errorCatch);
    }
  }
  componentDidMount () {
    this.getuserinfo();
  }
  typeidtype (val) {
    if(val ===1) {
      return '身份证';
    } else if(val ===2) {
      return '军官证';
    } else {
      return '学生证';
    }
  }
  typeSex (val) {
    if(val ===1) {
      this.setState({sex__:'男'});
    } else {
      this.setState({sex__:'女'});
    }
  }
  typest (val) {
    if(val ===0) {
      return '正常';
    } else {
      return '禁用';
    }
  }
  showModal() {
    this.setState({
      visible: !this.state.visible
    });
  }
  setoldpassword (e) {
    this.setState({oldpassword:e.target.value});
  }
  setnewpassword1 (e) {
    this.setState({newpassword1:e.target.value});
  }
  setnewpassword2 (e) {
    this.setState({newpassword2:e.target.value});
  }
  showModalenter () {
    this.setState({loading:true});
    const {newpassword1,newpassword2,oldpassword}=this.state;
    if(newpassword1===newpassword2) {
      IO.detailpassword.passwordc({oldPassword:oldpassword,newPassword:newpassword1}).then((res) => {
        if(res.success) {
          this.showModal();
          message.success('修改密码成功');
          this.setState({loading:false});
        }
      }).catch((res) => {
        this.setState({loading:false});
        Com.errorCatch(res);
      });
    } else {
      this.setState({loading:false});
      message.warning('两次密码不一致');
    }
  }
  render () {
      const {data,moreflag, moredata,namechang,sexchang,mobilePhonechang} = this.state;
      const {sex__}=this.state;
      return (
        <div className='system-modal'>
          <div className="user-info">
            <div className='user-title'><i className="iconfont icon-jichuxinxi"></i>  基础信息</div>
            <div className="user-info-title-j">
              <h4 className="user-info-one-box-j">
                <em>真实姓名</em>
                {
                  moreflag&&namechang ? <i className='iconfont icon-bianji' onClick={this.setname.bind(this)}></i> : ''
                }
                {
                  namechang ? <i>{data.realName}</i>
                  : <div className='jbl-con-dui'>
                    <Input className='jbl-ipt' defaultValue={data.realName}  onChange={this.empname.bind(this)}/>
                    <i className='iconfont icon-iconcuo' onClick={this.setname.bind(this)}></i>
                    <i className='iconfont icon-dui' onClick = {this.setnamep.bind(this)}></i>
                  </div>
                }
              </h4>
              <h4 className="user-info-one-box-j">
                <em>性别</em>
                {
                  moreflag&&sexchang ? <i className='iconfont icon-bianji' onClick={this.setsex.bind(this)}></i> : ''
                }
                {
                  sexchang ? <i>{sex__}</i>
                  : <div className='jbl-con-dui'>
                    <Input className='jbl-ipt' defaultValue={sex__}  onChange={this.empsex.bind(this)}/>
                    <i className='iconfont icon-iconcuo' onClick={this.setsex.bind(this)}></i>
                    <i className='iconfont icon-dui' onClick = {this.setsexp.bind(this)}></i>
                  </div>
                }
                </h4>
              <h4 className="user-info-one-box-j">
                <em>手机号码</em>
                {
                  moreflag&&mobilePhonechang ? <i className='iconfont icon-bianji' onClick={this.setmobilePhone.bind(this)}></i> : ''
                }
                {
                  mobilePhonechang ? <i>{data.mobilePhone1}</i>
                  : <div className='jbl-con-dui'>
                    <Input className='jbl-ipt' defaultValue={data.mobilePhone1}  onChange={this.empmobilePhone.bind(this)}/>
                    <i className='iconfont icon-iconcuo' onClick={this.setmobilePhone.bind(this)}></i>
                    <i className='iconfont icon-dui' onClick = {this.setmobilePhonep.bind(this)}></i>
                  </div>
                }
              </h4>
            </div>
            <div className="user-info-title-j">
              <h4 className="user-info-one-box-j"><em>证件号码</em><i>{data.idCardNo}</i></h4>
               <h4 className="user-info-one-box-j"><em>状态</em><i>{this.typest(data.stauts)}</i></h4>
               <h4 className="user-info-one-box-j"><em>创建人</em><i>{data.createUserName}</i></h4>
            </div>
            <div className="user-info-title-j">
              <h4 className="user-info-one-box-j"><em>修改人</em><i>{data.modifyUserName}</i></h4>
            </div>
            {
              moreflag ?
              <div className='zhanghu-j'>
                <div className='user-title'><i className="iconfont icon-jichuxinxi"></i>  账号信息
                    <Button className='jbl-btn-password-changge' type="primary" onClick={this.showModal.bind(this)}>修改密码</Button>
                    <Modal
                      title="修改密码"
                      confirmLoading={this.state.loading}
                      visible={this.state.visible}
                      className='farming-admin-modal'
                      onOk={this.showModalenter.bind(this)}
                      onCancel={this.showModal.bind(this)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <i className='jbl-detail-label'>原密码：</i><Input className='jbl-detail-password' onChange={this.setoldpassword.bind(this)}></Input><br/>
                      <i className='jbl-detail-label'>新密码：</i><Input className='jbl-detail-password' onChange={this.setnewpassword1.bind(this)} type="password"></Input><br/>
                      <i className='jbl-detail-label'>确认密码：</i><Input className='jbl-detail-password' onChange={this.setnewpassword2.bind(this)} type="password"></Input>
                    </Modal>
                </div>
                <div className="user-info-title-j">
                  <h4 className="user-info-one-box-j"><em>账号名</em><i>{moredata.accountName}</i></h4>
                </div>
              </div>
              :''
            }
          </div>
        </div>
      );
  }
}

export default Detail;