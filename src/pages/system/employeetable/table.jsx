import { Table, Pagination,message, Modal, Tooltip, LocaleProvider } from 'antd';
import { Component } from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {action} from './model';
import Com from '@/component/common';
const confirm = Modal.confirm;
import {IO} from '@/app/io';
import Operation from '../public.js';
import zhCN from 'antd/lib/locale-provider/zh_CN';
class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusloading:false,
      psize:10,
      recordid:-1
    };
    this.columns = [{
        title: '序号',
        dataIndex: 'key',
        width: 100,
        key: 'key',
        render: (text, record, index) => {
            return <span>{index + 1}</span>;
        }
    },{
        title: '姓名',
        dataIndex: 'realName',
        sorter: true,
        align: 'center'
    },{
        title: '性别',
        dataIndex: 'sexx',
        sorter: true,
        align: 'center'
    },{
        title: '是否创建账号',
        dataIndex: 'creatAccount_',
        width:120,
        align: 'center'
    },{
        title: '类型',
        dataIndex: 'type_',
        width:120,
        align: 'center'
    },{
        title: '手机',
        dataIndex: 'mobilePhone1',
        width:120,
        align: 'center'
    },{
        title: '所属公司',
        dataIndex: 'companyName',
        width:120,
        align: 'center'
    },{
        title: '身份证号',
        dataIndex: 'idCardNo',
        width:120,
        align: 'left'
    },{
        title: '是否贫困',
        dataIndex: 'poor_',
        width:120,
        align: 'center'
    }
        , {
            title: '操作',
            dataIndex: 'xiugai',
            width:220,
            render: (text, record) => {
                // 权限
                const securityKeyWord = this.props.securityKeyWord;
                return <div>
                    <Tooltip title="详情"><span className='cursor'>
                      <NavLink className=" iconfont icon-xiangqing" to={`/pages/system/employee/${record.id}`}></NavLink></span></Tooltip>
                    {
                        (Com.hasRole(securityKeyWord, 'employee_update', 'update','employee')) ?
                            <Tooltip title="编辑"> <span className='cursor'
                                                       onClick={this.query.bind(this, record)}><i
                                className='iconfont icon-xiugai07'></i></span></Tooltip> : ''
                    }
                    {
                        (Com.hasRole(securityKeyWord, 'employee_delete', 'delete','employee')) ?
                            <Tooltip title="删除"><span className='cursor'
                                                      onClick={this.showDeleteConfirm.bind(this, record)}
                                                     ><i
                                className='iconfont icon-shanchu'></i></span></Tooltip> : ''
                    }
                    {
                        (Com.hasRole(securityKeyWord, 'empRole_updateByEmpId', 'update','employee')) ?
                            <Tooltip title="分配角色"><span className='cursor'
                            onClick={this.props.Assignroles.bind(this, record)}
                                                        ><i
                                className='iconfont icon-fenpeijiaose'></i></span></Tooltip> : ''
                    }
                    {record.type !== 3 &&
                        (Com.hasRole(securityKeyWord, 'empOrg_updateByEmpId', 'update','employee')) ?
                            <Tooltip title="分配资产"><span className='cursor'
                            onClick={this.props.Assignorg.bind(this, record)}
                                                        ><i
                                className='iconfont icon-fenpeizuzhi'></i></span></Tooltip> : ''
                    }
                    {record.type === 3 &&
                    (Com.hasRole(securityKeyWord, 'empOrg_updateByEmpId', 'update','employee')) ?
                        <Tooltip title="不可分配资产"><span className='cursor-disabled'
                                                   ><i
                            className='iconfont icon-fenpeizuzhi'></i></span></Tooltip> : ''
                    }
                    {'platform' === localStorage.getItem('accountType') && <span>{
                        (Com.hasRole(securityKeyWord, 'node_insertUseAndNode', 'update','employee') && record.type === 4) ?
                            <Tooltip title="分配节点"><span className='cursor'
                            onClick={this.props.Assignnode.bind(this, record)}
                                                        ><i
                                className='iconfont icon-ziyuanfenpei'></i></span></Tooltip> :
                            <Tooltip title="不可分配节点"><span className='cursor-disabled'
                                                        ><i
                                className='iconfont icon-ziyuanfenpei'></i></span></Tooltip>}</span>
                    }
                </div>;
            }
        }
    ];
  }
  showDeleteConfirm(record) {
    const _this = this;
    confirm({
        title: '是否确认删除?',
        okText: '确认',
        okType: 'primary',
        cancelText: '取消',
        onOk() {
            _this.delete(record);
        }
    });
}

delete(record) {
    const ids = record.id;
    const {current, Nameval} = this.props;
    Operation.systemDelete(Operation.listurl(this.props.list, 'employee_delete'));
    IO.system_Delete.deleteData({':id': ids}).then((res) => {
        if (res.success) {
            message.success('删除成功');
            if (this.props.data.length === 1) {
                this.props.setstartPage(current - 1);
                this.props.Alldatas({
                    roleName: Nameval,
                    startPage: current - 1,
                    poor:this.props.poverty,
                    sex:this.props.sex,
                    mobilePhone1:this.props.phoneNumber,
                    limit: this.state.psize,
                    sortField: this.props.sortfield,
                    sortOrder: this.props.sortorder
                });
            } else {
                this.props.Alldatas({
                    roleName: Nameval,
                    startPage: current,
                    poor:this.props.poverty,
                    sex:this.props.sex,
                    mobilePhone1:this.props.phoneNumber,
                    limit: this.state.psize,
                    sortField: this.props.sortfield,
                    sortOrder: this.props.sortorder
                });
            }
        }
    }).catch((res) => {
        Com.errorCatch(res);
        this.setState({loading: false});
    });
}
  query(record) {
    const querydata = {
      realName: {
        value: record.realName
      },
      gender: {
        value: record.sex
      },
      creatAccount: {
        value: record.createAccount
      },
      type: {
        value: record.type
      },
      phoneNumber: {
        value: record.mobilePhone1
      },
      certificateType: {
          value:record.idCardType
      },
      certificateNumber: {
          value:record.idCardNo
      },
      isPoverty: {
          value: record.poor
      },
      companyId: {
        value: record.companyId
      },
      companyName: {
        value: record.companyName
      }
    };
    this.props.setDefaultCreate(record.createAccount);
    this.props.defaultFields(querydata);
    this.props.querydefaultfields(querydata);
    this.props.modal({modalFlag:true,modeltype:'modify'});
    this.props.parentID(record.id);
  }
  onSizeChange(current, pageSize) {
    const { onsizeChange } = this.props;
    onsizeChange(current,pageSize);
  }
  onTableChange(pagination, filters, sorter) {
    this.props.onTableChange(pagination, filters, sorter);
  }
  onShowSizeChange(current, pageSize) {
    this.setState({
        psize:pageSize
    });
    this.props.getpsize(pageSize, current);
    this.props.Alldatas({
        roleName: this.props.Nameval,
        startPage: current,
        poor:this.props.poverty,
        sex:this.props.sex,
        mobilePhone1:this.props.phoneNumber,
        limit: pageSize,
        sortField: this.props.sortfield,
        sortOrder: this.props.sortorder
    });
}
  render() {
    const me = this;
    const { total, data, flag, current, securityKeyWord } = this.props;
    let arr;
    Com.hasRole(securityKeyWord, 'role_update', 'update','employee') || Com.hasRole(securityKeyWord, 'role_delete', 'delete','employee')?arr=this.columns:arr = this.columns.slice(0,this.columns.length-1);
    const TableOpt = {
        columns: arr,
        onChange: me.onTableChange.bind(me),
        dataSource:data,
        pagination:false,
        loading:flag
    };
    const PaginOpt = {
        defaultPageSize: me.state.psize,
        defaultCurrent:1,
        total:total,
        current:current,
        onChange:me.onSizeChange.bind(me),
        onShowSizeChange:me.onShowSizeChange.bind(me)
    };
    return (
        <div>
            <div className='res-table'>
                <Table bordered {...TableOpt}/>
            </div>
            <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper {...PaginOpt} /></LocaleProvider>
        </div>
    );
  }
}
const mapstateprops = (state) => {
  const {total, deleteOK, flag, sortfield, sortorder } = state.employeeReducer;
  const { securityKeyWord } = state.initReducer;
  return {
    total,
    deleteok:deleteOK,
    flag,
    list:state.systemReducer.listdata,
    securityKeyWord,
    sortfield, sortorder
  };
};
export default connect(mapstateprops,action)(Tables);