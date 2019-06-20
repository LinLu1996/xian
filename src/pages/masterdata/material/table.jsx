import {Table, Pagination, Switch, Tooltip, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import { Component } from 'react';
import zhCN from "antd/lib/locale-provider/zh_CN";
import Public from "@/pages/masterdata/public";
class Tables extends Component {
  constructor(props) {
    super(props);
    this.state={
      selectedRowKeys:[]
    };
    this.columns = [    {
       title: '序号',
       dataIndex: 'key',
        width: 100,
       key: 'key',
       render: (text, record, index) => {
        return <span>{index + 1}</span>;
        }
     },{
      title: '农资名称',
      dataIndex: 'name',
        align:"left"
    },{
      title: '农资类型',
      dataIndex: 'workTypeName',
        align:"center"
    },{
      title: '抑制期(天)',
      dataIndex: 'containment',
        align:"right"
    },
    {
       title: '默认用量单位',
       dataIndex: 'dosageUnit',
        align:"left"
     },
    {
      title: '创建人',
      dataIndex: 'createUserName',
        align:"left"
     },
    {
        title: '状态',
        dataIndex: 'stauts',
        align:"center",
        render: (text, record) => {
            if(this.props.editRole) {
                let flag = false;
                if(record.stauts === 1) {
                    flag = false;
                    }else{
                        flag = true;
                    }
                    return <Switch checked={flag} onChange={() => { this.changeStatus(record);}} />;
                }else {
                    return record.stauts === 1 ? '禁用' : '正常';
                }
            }
        }];
       if(this.props.editRole) {
          this.columns.push({
              title: '操作',
              dataIndex: 'caozuo',
              align:"center",
              render: (text, record) => {
                  return <div>
                      <Tooltip title="编辑">
                          <span className='cursor' onClick={this.query.bind(this,record)}><i className='iconfont icon-xiugai07'></i></span></Tooltip>
                  </div>;
              }
          });
      }
  }

  changeStatus(record) {
    const { Cur,Psize} = this.props;
    const flag=Public.changeStatus(record,'material_status');
      flag.then((resolve) => {
          if(resolve===true) {
              this.props.Alldatas({startPage:Cur,limit:Psize,workTypeId:this.props.agriculturalType,name:this.props.operationName});
          }
      });
  }
  async query(record) {
    await this.props.getOne({id:record.id});
    const row = this.props.EditData;
    this.props.defaultFields({
        allDosageUnit: {
         value: this.props.allDosageUnit
       },
       AllWorkType: {
         value: this.props.AllWorkType
       },
       id: {
        value:row.id
       },
       name: {
         value:row.name
       },
       workTypeName: {
         value: row.workTypeName
       },
       containment: {
         value:row.containment
       },
       purpose: {
         value:row.purpose
       },
       dosageUnit: {
         value:row.dosageUnitId
       },
       createName: {
         value:row.createUserName
       },
       createTime: {
         value:row.createTime
       },
       stauts: {
         value:row.stauts
       },
       modeltype: {
         value:'modify'
       }
    });
      this.props.modal({modalFlag:true,modeltype:'modify'});
  }
  onSizeChange(current, pageSize) {
    this.props.Alldatas({startPage:current,limit:pageSize});
    this.props.page({current:current, pageSize:pageSize});
  }
  onSizeChangequery(current, pageSize) {
    const { onSizeChangequery } = this.props;
    onSizeChangequery(current, pageSize);
      this.props.page({current:current, pageSize:pageSize});
  }
    onShowSizeChange(current, pageSize) {
    const { onShowSizeChange } = this.props;
        onShowSizeChange(current, pageSize);
      this.props.page({current:1, pageSize:pageSize});
  }
  onchooseChange(current, pageSize) {
    const { onchooseChange } = this.props;
    onchooseChange(current, pageSize);
    this.props.page({current:current, pageSize:pageSize});
    this.props.choosepage({current:current, pageSize:pageSize});
  }
  render() {
    const { total, data, Cur } = this.props;
    return (
        <div>
      <div className='res-table'>
          <LocaleProvider locale={zhCN}>
        <Table  bordered rowKey={record => record.id} columns={this.columns}  dataSource={data} pagination={false}/>
        {/*{
          queryFlag?<Pagination defaultCurrent={1} current={Cur} total={total} onChange={this.onSizeChangequery.bind(this)} className='res-pagination'/>:chooseFlag?
          <Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total} onChange={this.onchooseChange.bind(this)}/>:
          <Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total} onChange={this.onSizeChange.bind(this)}/>
        }*/}</LocaleProvider></div>
            <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={Cur} defaultCurrent={1}  total={total} /></LocaleProvider>
            {/*<Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total}*/}
                                        {/*onChange={this.onSizeChangequery.bind(this)}*/}
              {/*/>*/}
      </div>
    );
  }
}
const mapstateprops = (state) => {
  const { EditData,total, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR  } = state.agriculturalMaintenanceReducer;
  return {
    EditData:EditData,
    total:total,
    Cur,
    Psize,
    chooseFlag:chooseflag,
    deleteok:deleteOK,
    TreeD,
    parentName:parentname,
    slideID, chooseSIZE, chooseCUR
  };
};
export default connect(mapstateprops,action)(Tables);