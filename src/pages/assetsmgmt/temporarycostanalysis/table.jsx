import {Table, Pagination, Tooltip,LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import moment from "moment";
import {Component} from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import React from "react";

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: []
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'key',
            width: 100,
            key: 'key',
            render: (text, record, index) => {
                if (record.id !== -1) {
                    return <span>{index + 1}</span>;
                }
            }
        }, {
            title: '农事计划编号',
            dataIndex: 'planCode',
            align: "center",
            width: 140
        }, {
            title: '任务时间',
            dataIndex: 'plannedTime',
            align: "center",
            width: 100,
            render(plannedTime, record) {
                if (record.id !== -1) {
                    return moment(plannedTime).format('YYYY-MM-DD');
                }
            }
        }, {
            title: '作物品种',
            dataIndex: 'cropName',
            align: "left"
        }, {
            title: '农事任务',
            dataIndex: 'taskName',
            align: "left"
        }, {
            title: '种植基地',
            dataIndex: 'baseName',
            align: "left"
        }, {
            title: '种植地块',
            dataIndex: 'landName',
            align: "left"
        }, {
            title: '农事类型',
            dataIndex: 'typeName',
            align: "left"
        }, {
            title: '负责人',
            dataIndex: 'supervisor',
            align: "left"
        }, {
            title: '用工人数',
            dataIndex: 'qty',
            align: "right",
            render(text, record) {
                if (record.id !== -1) {
                    return <span>{text}</span>;
                } else {
                    return <span className='bold-span'>{text}</span>;
                }
            }
        }, /*{
            title: '用工总时长',
            dataIndex: 'sumDuration',
            align: "right",
            width: 110,
            render(text, record) {
                if (record.id !== -1) {
                    return <span>{text}</span>;
                } else {
                    return <span className='bold-span'>{text}</span>;
                }
            }
        },*/ {
            title: '用工总成本',
            dataIndex: 'sumPay',
            align: "right",
            width: 110,
            render(text, record) {
                if (record.id !== -1) {
                    return <span>{text}</span>;
                } else {
                    return <span className='bold-span'>{text}</span>;
                }
            }
        }];
        if(this.props.editRole) {
            this.columns.push({
                title: '操作',
                dataIndex: 'caozuo',
                align: "center",
                render: (text, record) => {
                    if (record.id !== -1) {
                        return <div>
                            <Tooltip title="详情"><span className='cursor' onClick={this.query.bind(this, record)}><i
                                className='iconfont icon-xiangqing'></i></span></Tooltip>
                        </div>;
                    }
                }
            });
        }
    }
    onchooseChange(current, pageSize) {
        const {onchooseChange} = this.props;
        onchooseChange(current, pageSize);
        this.props.choosepage({current: current, pageSize: pageSize});
        this.props.page({current: current, pageSize: pageSize});
    }
    async query(record) {
        let numTotal = 0;
        let timeTotal = 0;
        let wagesTotal = 0;
        const dataList = [];
        const countList = [];
        let title = {};
        await IOModel.getByIdReport({':id': record.id}).then((res) => {
            title = res.data.title;
            const hires = res.data.hires;
            const count = {};
            if (hires && hires.length > 0) {
                numTotal = hires.length;
                for (let i = 0; i < hires.length; i++) {
                    dataList.push(hires[i]);
                    timeTotal = timeTotal + parseInt(hires[i].duration);
                    wagesTotal = wagesTotal + parseInt(hires[i].pay);
                }
                count.numTotal = numTotal;
                count.wagesTotal = wagesTotal;
                count.timeTotal = timeTotal;
                countList.push(count);
            }
        });
        this.props.defaultFields({
            typeName: {
                value: title[0].workTypeName
            },
            plannedTime: {
                value: moment(title[0].plannedTime).format('YYYY-MM-DD')
            },
            baseName: {
                value: title[0].baseName
            },
            landName: {
                value: title[0].landName
            },
            cropName: {
                value: title[0].cropName
            },
            supervisor: {
                value: title[0].supervisor
            },
            dataList: {
                value: dataList
            },
            countList: {
                value: countList
            },
            modeltype: {
                value: 'detail'
            }
        });
        this.props.modal({modalFlag: true, modeltype: 'detail'});
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

    render() {
        const {total, Alldate, Cur} = this.props;
        return (
            <div>
                <div className='res-table'>
                    <LocaleProvider locale={zhCN}>
                        <Table bordered  rowKey={record => record.id} columns={this.columns} dataSource={Alldate} pagination={false}/>
                    </LocaleProvider>
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
    const {total, allDuration, allPay, Alldate, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.temporarycostanalysisReducer;
    return {
        total: total,
        allDuration: allDuration,
        allPay: allPay,
        Alldate: Alldate,
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