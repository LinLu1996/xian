import { Component } from 'react';
import { Button, LocaleProvider} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import ModalForm  from './modalForm.jsx';
import Formtitle from '@/component/formtitle/index.jsx';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {IO} from '@/app/io';
import '../../index.less';
import Empdep from './empdep/index.jsx';
import Com from '@/component/common';
import Operation from '../public.js';
class Roles extends Component {
  constructor(props) {
    super(props);
    this.state={
      valueName:'',
      current:1,
      psize:10,
      closure:null,
      empdepisshow: false,
      listCompany:[]
    };
  }
  componentDidMount() {
    this.props.Alldatas({sortField:this.props.sortfield,sortOrder:this.props.sortorder,startPage:1,limit:this.state.psize});
      if(localStorage.getItem("accountType") === 'platform') {
        IO.role.CompanyAll().then((res) => {
            let Companydata;
            if (!res.data) {
                Companydata = [];
            } else {
                Companydata = res.data;
            }
            this.setState({
                 listCompany: Operation.CompanyTreelist(Companydata, {
                    props: {
                        eventKey: 0
                    }
                })
            });
        });
      }
  }
  formName(val) {
    this.setState({
      valueName:val,
      current:1
    }, () => {
      if(this.state.closure) {
        clearTimeout(this.state.closure);
      }
      this.setState({
        closure : setTimeout(() => {
          this.props.Alldatas({sortField:this.props.sortfield,sortOrder:this.props.sortorder,roleName:this.state.valueName,startPage:1,limit:this.state.psize});
        },800)
      });
    });
  }
  addmodel() {
    this.props.defaultFields({
      roleCode: {
        value: ''
      },
      roleName: {
        value: ''
      },
      roleState: {
        value: 0
      },
      roleType: {
        value: 2
      },
      companyId: {
        value: ''
      }
    });
    this.props.modal({modalFlag:true,modeltype:'add'});
  }
  onTableChange(pagination, filters, sorter) {
    this.setState({
      current:1
    });
    let s;
    let o;
    let order;
    sorter.order==='descend'?order='DESC':order='ASC';
    if(sorter.field) {
      if(/[A-Z]/g.test(sorter.field)) {
        s = sorter.field.replace(/[A-Z]/g,function(r) {
          const b = r.toLowerCase();
          return `_${b}`;
        });
      }else {
        s=sorter.field;
      }
        o=order;
      }else {
        s='';
        o='';
      }
    this.props.sorter({sortfield:s,sortorder:o});
    this.props.Alldatas({sortField:s,sortOrder:o,roleName:this.state.valueName,startPage:1,limit:this.state.psize});
  }
  empdepshow(record) {
    this.setState({
      empdepisshow: true,
      emprole_: record
    });
  }
  empdephde() {
    this.setState({
      empdepisshow: false
    });
  }
  treeNodeData(treedatas) {
    this.setState({
      listCompany:[...treedatas]
    });
  }
  onsizeChange(current) {
    this.setState({
        current:current
    });
    const { valueName }=this.state;
    this.props.Alldatas({sortField:this.props.sortfield,sortOrder:this.props.sortorder,roleName:valueName,startPage:current,limit:this.state.psize});
  }
  getcurrent(num) {
    this.setState({
      current:num
    });
  }
  emptyName() {
    if(this.state.valueName) {
      this.setState({
        valueName:''
      });
    }
  }
  getpsize(num) {
      this.setState({
          psize:num,
          current:1
      });
  }
  render() {
    const me = this;
    const {current, psize, empdepisshow,valueName, emprole_, listCompany} = this.state;
    const { dataList } = this.props;
    const TableOpt = {
        onsizeChange:me.onsizeChange.bind(me),
        getcurrent:me.getcurrent.bind(me),
        empdepshow:me.empdepshow.bind(me),
        data:dataList,
        current:current,
        psize:psize,
        Nameval:valueName,
        onTableChange:me.onTableChange.bind(this),
        getpsize:me.getpsize.bind(me)
    };
    const ModelOpt = {
        cur:current,
        psize:psize,
        emptyName:me.emptyName.bind(me),
        Nameval:valueName,
        listCompany:listCompany,
        treeNodeData:me.treeNodeData.bind(me)
    };
    return (
      <div className='system-box'>
        <div className='title'>
        <b>角色配置</b>
          <Formtitle Nameval={this.state.valueName} formName = {this.formName.bind(this)} querykeyword='角色名称'/>
        </div>
        <div className='content'>
          <div className='table-header'><p><i className='iconfont icon-sort'></i><span>角色列表</span></p>{(Com.hasRole(this.props.securityKeyWord, 'role_add', 'insert','role'))?<p><Button onClick={this.addmodel.bind(this)}>新增角色</Button></p>:''}</div>
            <LocaleProvider locale={zhCN}>
                <Tables {...TableOpt}/>
            </LocaleProvider>
            {
                empdepisshow ? <div className="zhezhao"></div> : ''
            }
            {
                empdepisshow ? <Empdep emprole_={emprole_} empdephde={this.empdephde.bind(this)}/> : ''
            }
          <ModalForm {...ModelOpt}/>
        </div>
      </div>
    );
  }
}
const mapStateprops = (state) => {
  const {Alldate, sortfield, sortorder} = state.roleReducer;
  const { securityKeyWord } = state.initReducer;
  return {
    dataList:Alldate,
    securityKeyWord,
    sortfield, sortorder
  };
};
export default connect(mapStateprops,action)(Roles);