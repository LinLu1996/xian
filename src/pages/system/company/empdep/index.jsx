import {Component} from 'react';
import {Button, Icon, message} from 'antd';
import './index.less';
import {IO} from '@/app/io';
import Com from "@/component/common";
import TransferTree from "@/component/transferTree/index.jsx";

const treedata = (data) => {
  return data.map(item => {
    if (item.childrens) {
      item.childrens = treedata(item.childrens);
    }
    item.title = item.resName;
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
    //角色默认已拥有资源
    IO.comres.gethavedata({':id': me.props.emprole_.id}).then((res) => {
      this.setState({
        havedata: res.data.map(item => item.toString())
      });
      // const arrhave = me.changeArr(res.data);
      // me.resourceTransfer.group.state.checkedDatas = arrhave;//请求默认员工已拥有组织
    }).catch(Com.errorCatch);
  }

  emporgChange() {
    this.setState({loading: true});
    const me = this;
    const arrres = me.resourceTransfer.getCheckedData().resultIds;
    IO.comres.getdata({companyId: this.props.emprole_.id, resIds: JSON.stringify(arrres)}).then((res) => {
      if (res.success) {
        message.success('分配成功');
        this.setState({loading: false});
        this.props.empdephde();
      }
    }).catch(Com.errorCatch);
  }

  render() {
    const {havedata} = this.state;
    const me = this;
    const resourceOption = {
      className: 'tree-cont-b',
      existedIds: havedata,
      treeOption: {
        left: {
          search: {
            placeholder: "资源搜索"
          },
          defaultExpandAll: false
        },
        right: {
          search: {
            placeholder: "已选资源搜索"
          }
        }
      },
      asyncUrl: {
        mockUrl: '/proxy/resource/getResourceConfigTree',
        url: '/resource/getResourceConfigTree'
      },
      fit: (data) => {
        return treedata(data);
      },
      ref: (self) => {
        me.resourceTransfer = self;
      }
    };
    return (
      <div className="allinfobox-j">
        <Icon className="close_btn-j" type="close" onClick={this.props.empdephde.bind(this)}/>
        <div className='system-title-div'>
          <span className='system-title'>公司：{this.props.emprole_.companyName}</span>
        </div>
        <div className="left_right">
          <i className="left_right_left-b">所有资源</i>
          <i className="left_right_right-b">已有资源</i>
        </div>

        <TransferTree {...resourceOption}/>
        <div className='system-modal-footer'>
          <Button onClick={this.props.empdephde.bind(this)}>取消</Button>
          <Button loading={this.state.loading} onClick={this.emporgChange.bind(this)} type="primary">确认</Button>
        </div>
      </div>
    );
  }
}

export default Empdep;