import {Table, Pagination,LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {Component} from 'react';
import moment from "moment";
import zhCN from 'antd/lib/locale-provider/zh_CN';

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: []
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            width: 100,
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        }, {
            title: '计划使用时间',
            dataIndex: 'plannedTime',
            align: "center",
            render(plannedTime) {
                return moment(plannedTime).format('YYYY-MM-DD');
            }
        }, {
            title: '种植计划编号',
            dataIndex: 'workPlanCode',
            align: "center"
        }, {
            title: '农事任务',
            dataIndex: 'name',
            align: "left"
        }, {
            title: '农资名称',
            dataIndex: 'materialName',
            align: "left"
        }, {
            title: '计划用量',
            dataIndex: 'plannedQty',
            align: "right"
        }, {
            title: '用量单位',
            dataIndex: 'unitName',
            align: "left"
        }, {
            title: '基地',
            dataIndex: 'baseName',
            align: "left"
        }, {
            title: '地块',
            dataIndex: 'landName',
            align: "left"
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

    query(record) {
        this.props.defaultFields({
            id: {
                value: record.id
            },
            plan_number: {
                value: record.plan_number
            },
            plan_time: {
                value: record.plan_time
            },
            createName: {
                value: record.createName
            },
            stauts: {
                value: record.stauts
            },
            modeltype: {
                value: 'modify'
            }
        });
        this.props.modal({modalFlag: true, modeltype: 'modify'});
    }

    queryDetails(record) {
        this.props.defaultFields({
            id: {
                value: record.id
            },
            plan_number: {
                value: record.plan_number
            },
            inhibitionPeriod: {
                value: record.inhibitionPeriod
            },
            plan_time: {
                value: record.plan_time
            },
            createName: {
                value: record.createName
            },
            stauts: {
                value: record.stauts
            },
            modeltype: {
                value: 'modify'
            }
        });
        this.props.modalDetails({modalFlagDetails: true, modeltype: 'modify'});
    }

    onSizeChange(current, pageSize) {
        this.props.Alldatas({startPage: current, limit: pageSize});
        this.props.page({current: current, pageSize: pageSize});
    }

    onSizeChangequery(current, pageSize) {
        const {onSizeChangequery} = this.props;
        onSizeChangequery(current, pageSize);
    }
    onShowSizeChange(current, pageSize) {
        const {onShowSizeChange} = this.props;
        onShowSizeChange(current, pageSize);
    }

    onchooseChange(current, pageSize) {
        const {onchooseChange} = this.props;
        onchooseChange(current, pageSize);
        this.props.choosepage({current: current, pageSize: pageSize});
    }

    onSelectChange(selectedRowKeys, selectedRows) {
        this.setState({selectedRowKeys});
        const {onSelectChange} = this.props;
        onSelectChange(selectedRowKeys, selectedRows);
    }

    render() {
        const {data, total, Cur} = this.props;
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange.bind(this)
        };
        return (
            <div>
                <div className='res-table'>
                    <Table bordered rowKey={record => record.id} rowSelection={rowSelection} columns={this.columns}
                           dataSource={data} pagination={false}/>
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
    const {total, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.procurementplanReducer;
    return {
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