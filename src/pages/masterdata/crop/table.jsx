import {Table, Pagination, Switch, Tooltip, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {Component} from 'react';
import zhCN from "antd/lib/locale-provider/zh_CN";
import Public from "@/pages/masterdata/public";

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: []
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'key',
            width:100,
            key: 'key',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        }, {
            title: '作物品种',
            dataIndex: 'name',
            align: "left"
        }, {
            title: '作物编号',
            dataIndex: 'no',
            align: "center"
        }, {
            title: '采收单位',
            dataIndex: 'unitName',
            align: "left"
        }, {
            title: '创建人',
            dataIndex: 'createUserName',
            align: "left"
        },
            {
                title: '状态',
                dataIndex: 'stauts',
                align: "center",
                render: (text, record) => {
                    if(this.props.editRole) {
                        let flag = false;
                        if (record.stauts === 1) {
                            flag = false;
                        } else {
                            flag = true;
                        }
                        return <Switch checked={flag} onChange={() => {
                            this.changeStatus(record);
                        }}/>;
                    }else{
                        return record.stauts === 1 ? '禁用' : '正常';
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
                        <Tooltip title="编辑">
                            <span className='cursor' onClick={this.query.bind(this, record)}><i
                            className='iconfont icon-xiugai07'></i></span>
                        </Tooltip>
                    </div>;
                }
            });
        }
    }

    changeStatus(record) {
        const {Cur, Psize} = this.props;
        const flag=Public.changeStatus(record,'crop_status');
        flag.then((resolve) => {
            if(resolve===true) {
                this.props.Alldatas({startPage: Cur, limit: Psize,name:this.props.name,no:this.props.no});
            }
        });
    }

    unitFn(text) {
        const {allUnit} = this.props;
        if (allUnit !== undefined) {
            for (let i = 0; i < allUnit.data.length; i++) {
                if (text === allUnit.data[i].key) {
                    return allUnit.data[i].value;
                }
            }
        }
    }

    async query(record) {  // 编辑
        await this.props.getOne({':id': record.id});
        const row = this.props.crop;
        const periods = this.props.periods;
        const periodList = [];
        const keyList = [];
        if (periods) {
            for (let i = 0; i < periods.length; i++) {
                const period = {};
                period.id = periods[i].id;
                period.liveId = periods[i].liveId;
                period.liveName = periods[i].liveName;
                period.type = 'update';
                period.sortNum = i + 1;
                periodList.push(period);
                keyList.push(periods[i].liveId);
            }
        }
        this.props.defaultFields({
            allGrade: {
                value: this.props.allGrade.data
            },
            allUnit: {
                value: this.props.allUnit.data
            },
            allCategory: {
                value: this.props.allCategory.data
            },
            allPeriod: {
                value: this.props.allPeriod.data
            },
            id: {
                value: row.id
            },
            name: {
                value: row.name
            },
            no: {
                value: row.no
            },
            unit: {
                value: row.unitId
            },
              categoryOne: {
                value: row.categoryId
              },
              categoryTwo: {
                value: row.categorySmallId
              },
            grade: {
                value: row.gradeGroupId
            },
            createUserName: {
                value: row.createUserName
            },
            createTime: {
                value: row.gmtCreate
            },
            OKlist: periodList,
            deleteList: [],
            stauts: {
                value: row.stauts
            },
          keyList:keyList,
            modeltype: {
                value: 'modify'
            }
        });
        this.props.modal({modalFlag: true, modeltype: 'modify',editFlag:true,oldPeriod:periodList});
        this.props.old({oldPeriod:periodList});
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
                <Table  bordered  rowKey={record => record.id} columns={this.columns} dataSource={data} pagination={false}/>
                {/*{
                    queryFlag ?
                        <Pagination defaultCurrent={1} current={Cur} total={total} onChange={this.onSizeChangequery.bind(this)}
                                    className='res-pagination'/> : chooseFlag ?
                        <Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total}
                                    onChange={this.onchooseChange.bind(this)}/> :
                        <Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total}
                                    onChange={this.onSizeChange.bind(this)}/>
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
    const { firstFlag,crop, periods, allUnit, allCategory, allPeriod, allGrade, total, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.cropReducer;
    return {
        firstFlag,
        crop: crop,
        periods: periods,
        allUnit: allUnit,
        allPeriod: allPeriod,
        allCategory: allCategory,
        allGrade: allGrade,
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