import {Table, Pagination, Switch, message, Tooltip, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {Component} from 'react';
import {IOModel} from "./model";
import zhCN from "antd/lib/locale-provider/zh_CN";

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: []
        };
        this.query = this.query.bind(this);
        this.columns = [{
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            width:100,
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        },
          {
            title: '年份',
            dataIndex: 'year',
            align: "center"
          }, {
            title: '扶贫金额（元）',
            dataIndex: 'amountYear',
            align: "right"
            }, {
            title: '创建人',
            dataIndex: 'createUserName',
            align: "left"
            },{
            title: '状态',
            dataIndex: 'stauts',
            align: "center",
                render: (text, record) => {
              let flag = false;
              if (record.stauts === 1) {
                flag = false;
              } else {
                flag = true;
              }
              if(!this.props.editRole) {
                  return flag ? '正常' : '禁用';
              }else {
                  return <Switch checked={flag} onChange={() => {
                      this.changeStatus(record);
                  }}/>;
              }
            }
          }];
        if(this.props.editRole) {
            this.columns.push({
                title: '操作',
                dataIndex: 'caozuo',
                align: "center",
                render: (text, record) => {
                    return <div>
                        <Tooltip title="编辑"><span className='cursor' onClick={this.query.bind(this, record)}><i
                            className='iconfont icon-xiugai07'></i></span></Tooltip>
                    </div>;
                }
            });
        }
    }
    changeStatus(record) {
      const {Cur, Psize} = this.props;
      IOModel.ChangeStatus({year: record.year, stauts: record.stauts, companyId: 1}).then((res) => {
        if (res.success) {
          if (record.stauts === 0) {
            message.success('禁用成功');
          } else {
            message.success('启用成功');
          }
          this.props.Alldatas({startPage: Cur, limit: Psize,year:this.props.year});
        }
      }).catch(() => {
        message.error("验证失败");
      });
  }
    async query(record) {
        await this.props.getOne({year: record.year,companyId:1});
        const row = this.props.Rditdate;
        this.props.defaultFields({
            year: {
                value: record.year
            },
            detail: {
                value: row
            },
            modeltype: {
                value: 'modify'
            }
        });
      this.props.modalTable({modalFlag: true, modeltype: 'modify'});
    }

    onSizeChange(current, pageSize) {
        this.props.Alldatas({startPage: current, limit: pageSize});
        this.props.page({current: current, pageSize: pageSize});
    }

    onSizeChangequery(current, pageSize) {
        const {onSizeChangequery} = this.props;
        onSizeChangequery(current, pageSize);
        this.props.page({current: current, pageSize: pageSize});
    }
    onShowSizeChange(current, pageSize) {
        const {onShowSizeChange} = this.props;
        onShowSizeChange(current, pageSize);
        this.props.page({current: 1, pageSize: pageSize});
    }

    onchooseChange(current, pageSize) {
        const {onchooseChange} = this.props;
        onchooseChange(current, pageSize);
        this.props.choosepage({current: current, pageSize: pageSize});
        this.props.page({current: current, pageSize: pageSize});
    }

    render() {
        const {total, data, Cur} = this.props;
        return (
            <div>
            <div className='res-table'>
                <LocaleProvider locale={zhCN}>
                <Table  bordered  rowKey={record => record.year} columns={this.columns} dataSource={data} pagination={false}/>
                {/*{
                    queryFlag ?
                        <Pagination defaultCurrent={1} total={total} onChange={this.onSizeChangequery.bind(this)} current={Cur}
                                    className='res-pagination'/> : chooseFlag ?
                        <Pagination className='res-pagination' defaultCurrent={1} total={total}  current={Cur}
                                    onChange={this.onchooseChange.bind(this)}/> :
                        <Pagination className='res-pagination' defaultCurrent={1} total={total}  current={Cur}
                                    onChange={this.onSizeChangequery.bind(this)}/>
                }*/}</LocaleProvider>
            </div>
                <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={Cur} defaultCurrent={1}  total={total} /></LocaleProvider>
                {/*<Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total}*/}
                                              {/*onChange={this.onSizeChangequery.bind(this)}*/}
                    {/*/>*/}
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {Rditdate, allBase, allLandType, total, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.govermentaiddataReducer;
    return {
        Rditdate: Rditdate,
        allBase: allBase,
        allLandType: allLandType,
        total: total,
        Cur,
        Psize,
        chooseFlag: chooseflag,
        deleteok: deleteOK,
        TreeD,
        parentName: parentname,
        slideID, chooseSIZE, chooseCUR
    };
};
export default connect(mapstateprops, action)(Tables);