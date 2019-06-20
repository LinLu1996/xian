import { Table, Pagination,message, Modal, Tooltip, LocaleProvider } from 'antd';
import { Component } from 'react';
import {connect} from 'react-redux';
import {action} from './model';
import Com from '@/component/common';
const confirm = Modal.confirm;
import {IO} from '@/app/io';
import Operation from '../public.js';
import moment from "moment";
import zhCN from 'antd/lib/locale-provider/zh_CN';
class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusloading:false,
      psize:10
    };
    this.columns = [
        {
            title: '序号',
            dataIndex: 'key',
            width: 100,
            key: 'key',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        },{
            title: '角色编码',
            dataIndex: 'roleCode',
            sorter: true,
            align: 'left'
        }, {
            title: '角色名',
            dataIndex: 'roleName',
            sorter: true,
            align: 'left'
        }, {
            title: '角色类型',
            dataIndex: 'roleType',
            sorter: false,
            align: 'left',
            render: (text) => {
                if(1 === text) {
                    return "平台角色";
                }else if(2 === text) {
                    return "通用角色";
                }else {
                    return "企业角色";
                }
            }
        }, {
            title: '创建人',
            dataIndex: 'createUserName',
            align: 'left'
        }, {
            title: '创建时间',
            dataIndex: 'gmtCreate',
            sorter: true,
            render: (text) => {
                return moment(text).format('YYYY-MM-DD');
            }
        }, {
            title: '操作',
            dataIndex: 'xiugai',
            render: (text, record) => {
                //权限
                const securityKeyWord = this.props.securityKeyWord;
                return <div>
                    {
                        (Com.hasRole(securityKeyWord, 'role_update', 'update', 'role')) ?
                            <span>{(securityKeyWord.indexOf('platform_all') !== -1 || record.roleType === 3) ? <Tooltip title="编辑"><span className='cursor'
                            onClick={this.query.bind(this,record)}><i
                                className='iconfont icon-xiugai07'></i></span></Tooltip> :
                                <Tooltip title="不可编辑"><span className='cursor-disabled'><i
                                    className='iconfont icon-xiugai07'></i></span></Tooltip>}</span> :
                            ''
                    }
                    {
                        (Com.hasRole(securityKeyWord, 'role_delete', 'delete', 'role')) ?
                            <span>{((record.roleCode !== 'system2company' && record.roleCode !== 'system2user') && (securityKeyWord.indexOf('platform_all') !== -1 || record.roleType === 3)) ? <Tooltip title="删除"><span className='cursor'
                                                      onClick={this.showDeleteConfirm.bind(this, record)}
                                                      ><i
                                className='iconfont icon-shanchu'></i></span></Tooltip> : <Tooltip title="不可删除"><span className='cursor-disabled'
                            ><i
                                className='iconfont icon-shanchu'></i></span></Tooltip>}</span> :
                            ''
                    }
                    {
                        (Com.hasRole(securityKeyWord, 'roleResource_updateByRoleId', 'update', 'role')) ?
                            <span>{(securityKeyWord.indexOf('platform_all') !== -1 || record.roleType === 3) ? <Tooltip title="分配资源"><span className='cursor'
                            onClick={this.props.empdepshow.bind(this, record)}><i
                                className='iconfont icon-ziyuanfenpei'></i></span></Tooltip> :
                                <Tooltip title="不可分配资源"><span className='cursor-disabled'><i
                                    className='iconfont icon-ziyuanfenpei'></i></span></Tooltip>}</span> :
                            ''
                    }
                </div>;
            }
        }
    ];
    if ('platform' === localStorage.getItem('accountType')) {
        this.columns.splice(1, 0, {
            title: '公司名称',
            dataIndex: 'companyName',
            sorter: true,
            align: 'left'
        });
    }
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
    Operation.systemDelete(Operation.listurl(this.props.list, 'role_delete'));
    IO.system_Delete.deleteData({':id': ids}).then((res) => {
        if (res.success) {
          message.success('删除成功');
          let len;
          this.props.data.length===1 ? len=current - 1 : len=current;
          if(this.props.data.length===1)this.props.getcurrent(current - 1);
          this.props.Alldatas({
            roleName: Nameval,
            startPage: len,
            limit: this.state.psize,
            sortField: this.props.sortfield,
            sortOrder: this.props.sortorder
          });
        }
    }).catch((res) => {
        Com.errorCatch(res);
        this.setState({loading: false});
    });
}
  query(record) {
    const querydata = {
      roleCode: {
        value: record.roleCode
      },
      roleName: {
        value: record.roleName
      },
      roleState: {
        value: record.stauts
      },
      roleType: {
        value: record.roleType
      },
      companyId: {
          value: record.companyId
      },
      oldRoleCode: {
          value: record.roleCode
      }
    };
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
    this.props.getpsize(pageSize);
    this.props.Alldatas({
        roleName: this.props.Nameval,
        startPage: current,
        limit: pageSize,
        sortField: this.props.sortfield,
        sortOrder: this.props.sortorder
      });
}
  render() {
    const { total, data, flag, current, securityKeyWord } = this.props;
    let arr;
      (Com.hasRole(securityKeyWord, 'role_update', 'update', 'role') || Com.hasRole(securityKeyWord, 'role_delete', 'delete', 'role') || Com.hasRole(securityKeyWord, 'roleResource_updateByRoleId', 'update', 'role'))?arr=this.columns:arr = this.columns.slice(0,this.columns.length-1);
    return (
        <div>
            <div className='res-table'>
                <Table bordered columns={arr} onChange={this.onTableChange.bind(this)} dataSource={data} pagination={false} loading={flag}/>
            </div>
            <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChange.bind(this)} current={current} defaultCurrent={1}  total={total} /></LocaleProvider>
        </div>
    );
  }
}
const mapstateprops = (state) => {
  const {total, deleteOK, flag, sortfield, sortorder } = state.roleReducer;
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