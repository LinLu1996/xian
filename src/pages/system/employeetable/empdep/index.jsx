import {Component} from 'react';
import {Button, Icon, message} from 'antd';
import './index.less';
import TransferTree from "../transferTree/index.jsx";
import {IO} from '@/app/io';
import Com from "@/component/common";

const treedata = (data) => {
  return data.map(item => {
    if (item.childrens) {
      item.childrens = treedata(item.childrens);
    }
    item.key = item.id;
    item.selectable = false;
    return item;
  });
};

class Empdep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      havedata: []
    };
  }

  componentDidMount() {
    const me = this;
    IO.roleres.gethavedata2({':id': me.props.dataid.id}).then((res) => {
      this.setState({
        havedata: res.data.map(item => item.toString())
      });
    }).catch(Com.errorCatch);
  }

  emporgChange() {
    this.setState({loading: true});
    const me = this;
    const arrres = me.organizeTransfer.getCheckedData().resultIds;
    IO.roleres.getdata2({empId: me.props.dataid.id, keys: arrres.length>0 ? JSON.stringify(arrres) : null}).then((res) => {
      if (res.success) {
        message.success('分配资产成功');
        this.setState({loading: false});
        this.props.empdephde();
      }
    }).catch((res) => {
      message.warning(res.data);
      this.setState({loading: false});
    });
  }

  render() {
    const {havedata} = this.state;
    const me = this;
    const organizeTransfer = {
      asyncParams: {
        empId: this.props.dataid.id
      },
      className: 'tree-cont-b',
      existedIds: havedata,
      treeOption: {
        left: {
          defaultExpandAll: false
        }
      },
      asyncUrl: {
        mockUrl: '/proxy/company/getCompanyConfigTreeByEmpId',
        url: '/company/getCompanyConfigTreeByEmpId'
      },
      fit: (data) => {
        return treedata(data);
      },
      ref: (self) => {
        me.organizeTransfer = self;
      }
    };
    return (
      <div className="allinfobox-j">
        <Icon className="close_btn-j" type="close" onClick={this.props.empdephde.bind(this)}/>
        <div className='system-title-div'>
          <span className='system-title'>用户：{this.props.dataid.realName}</span>
        </div>
        <div className="left_right">
          <i className="left_right_left-b">所有资产</i>
          <i className="left_right_right-b">已有资产</i>
        </div>
        <TransferTree {...organizeTransfer}/>
        <div className='system-modal-footer'>
          <Button onClick={this.props.empdephde.bind(this)}>取消</Button>
          <Button loading={this.state.loading} onClick={this.emporgChange.bind(this)} type="primary">确认</Button>
        </div>
      </div>
    );
  }
}

export default Empdep;