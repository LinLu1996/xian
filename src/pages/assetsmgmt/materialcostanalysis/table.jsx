import { Table, Pagination,LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import { Component } from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
class Tables extends Component {
  constructor(props) {
    super(props);
    this.state={
      selectedRowKeys:[]
    };
      this.columns = [{
          title: '序号',
          dataIndex: 'key',
          key: 'key',
          width:100,
          render: (text, record, index) => {
              return <span>{index + 1}</span>;
          }
      },{
          title: '农事计划编号',
          dataIndex: 'code',
          align:"center",
          width: 140
      },{
          title: '任务时间',
          dataIndex: 'plannedTime',
          align:"center",
          width: 100
      },{
          title: '作物品种',
          dataIndex: 'cropName',
          align:"left"
      },{
          title: '农事任务',
          dataIndex: 'taskName',
          align:"left"
      },{
          title: '种植基地',
          dataIndex: 'baseName',
          align:"left"
      },{
          title: '种植地块',
          dataIndex: 'landName',
          align:"left"
      },{
          title: '农事类型',
          dataIndex: 'workTypeName',
          align:"left"
      },{
          title: '负责人',
          dataIndex: 'createName',
          align:"left"
      },{
          title: '使用农资',
          dataIndex: 'materialName',
          align:"left"
      },{
          title: '实际用量',
          dataIndex: 'actualQty',
          align:"right"
      },{
          title: '农资成本',
          dataIndex: 'cost',
          align:"right"
      }];
  }
  farmingTypeFn(text) {
    switch (text) {
      case 1:
      return '灌溉';
      case 2:
      return '植保';
      case 3:
      return '施肥';
      case 4:
      return '园艺';
      case 5:
      return '采收';
    }
  }
  onSizeChange(current, pageSize) {
    this.props.Alldatas({startPage:current,limit:pageSize,baseId:this.props.baseId.id,cropId:this.props.cropId,landId:this.props.landId});
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
    const { total, data, Cur} = this.props;
    return (
        <div>
          <div className='res-table'>
              <LocaleProvider locale={zhCN}>
                    <Table bordered  columns={this.columns}  dataSource={data} pagination={false}/>
            {/*{
              queryFlag?<Pagination defaultCurrent={1}  current={Cur} total={total} onChange={this.onSizeChangequery.bind(this)} className='res-pagination'/>:chooseFlag?
              <Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total} onChange={this.onchooseChange.bind(this)}/>:
              <Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total} onChange={this.onSizeChange.bind(this)}/>
            }*/}
              </LocaleProvider>
          </div>
          {
               <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={Cur} defaultCurrent={1}  total={total} /></LocaleProvider>
          }
       </div>
    );
  }
}
const mapstateprops = (state) => {
  const { total, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR  } = state.materialcostanalysisReducer;
  return {
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