import {Table, Pagination, Button, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {Component} from 'react';
import './index.less';
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
            title: '采购计划编号',
            dataIndex: 'plan_number',
            align: "center"
        }, {
            title: '创建时间',
            dataIndex: 'plan_time',
            align: "center"
        }, {
            title: '创建人',
            dataIndex: 'createName',
            align: "left"
        }, {
            title: '完成日期',
            dataIndex: 'finishDate',
            align: "left"
        }, {
            title: '状态',
            dataIndex: 'stauts',
            align: "center"
        }, {
            title: '操作',
            dataIndex: 'caozuo',
            align: "center",
            render: (text, record) => {
                return (
                    <div>
                        <Button className='btn' onClick={this.query.bind(this, record)}>详情</Button>
                        <span className='cursor' onClick={this.query.bind(this, record)}><i
                            className='iconfont icon-xiugai07'></i></span>
                    </div>
                );
            }
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

    onSizeChange(current, pageSize) {
        this.props.Alldatas({startPage: current, limit: pageSize});
        this.props.page({current: current, pageSize: pageSize});
    }

    onSizeChangequery(current, pageSize) {
        const {onSizeChangequery} = this.props;
        onSizeChangequery(current, pageSize);
    }

    onchooseChange(current, pageSize) {
        const {onchooseChange} = this.props;
        onchooseChange(current, pageSize);
        this.props.choosepage({current: current, pageSize: pageSize});
    }

    render() {
        const {total, data} = this.props;
        return (
            <div className='res-table'>
                <LocaleProvider locale={zhCN}>
                    <Table bordered columns={this.columns} dataSource={data} pagination={false}/>
                </LocaleProvider>
                <Pagination className='res-pagination' defaultCurrent={1} total={total}
                            onChange={this.onSizeChangequery.bind(this)}/>
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