import {Component} from 'react';
import {Table, Pagination, Tooltip,LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import moment from "moment";
import {action} from './model';
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
            key: 'key',
            width:100,
            render: (text, record, index) => {
                if (record.id !== -1) {
                    return <span>{index + 1}</span>;
                }
            }
        }, {
            title: '农户姓名',
            dataIndex: 'userName',
            align: "left",
            render: (text) => {
                return <Tooltip title={text}><span style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}>{text}</span></Tooltip>;
            }
        }, {
            title: '任务时间',
            dataIndex: 'plannedTime',
            align: "center",
            render(plannedTime, record) {
                if (record.id !== -1) {
                    return <Tooltip title={plannedTime}><span style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>{moment(plannedTime).format('YYYY-MM-DD')}</span></Tooltip>;
                }
            }
        }, {
            title: '作物品种',
            dataIndex: 'cropName',
            align: "left",
            render: (text) => {
                return <Tooltip title={text}><span style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}>{text}</span></Tooltip>;
            }
        }, {
            title: '农事任务',
            dataIndex: 'taskName',
            align: "left",
            render: (text) => {
                return <Tooltip title={text}><span style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}>{text}</span></Tooltip>;
            }
        }, {
            title: '种植基地',
            dataIndex: 'baseName',
            align: "left",
            render: (text) => {
                return <Tooltip title={text}><span style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}>{text}</span></Tooltip>;
            }
        }, {
            title: '种植地块',
            dataIndex: 'landName',
            align: "left",
            render: (text) => {
                return <Tooltip title={text}><span style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}>{text}</span></Tooltip>;
            }
        }, {
            title: '农事类型',
            dataIndex: 'typeName',
            align: "left",
            render: (text, record) => {
                if (record.id !== -1) {
                    return <Tooltip title={text}><span style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>{text}</span></Tooltip>;
                } else {
                    return <Tooltip title={text}><span  className='bold-span' style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>{text}</span></Tooltip>;
                }
            }
        }, /*{
            title: '用工时长',
            dataIndex: 'duration',
            align: "right",
            render: (text, record) => {
                if (record.id !== -1) {
                    return <Tooltip title={text}><span style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>{text}</span></Tooltip>;
                } else {
                    return <Tooltip title={text}><span  className='bold-span' style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>{text}</span></Tooltip>;
                }
            }
        },*/ {
            title: '薪酬',
            dataIndex: 'pay',
            align: "right",
            render: (text, record) => {
                if (record.id !== -1) {
                    return <Tooltip title={text}><span style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>{text}</span></Tooltip>;
                } else {
                    return <Tooltip title={text}><span  className='bold-span' style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>{text}</span></Tooltip>;
                }
            }
        }];
    }

    onSizeChange(current, pageSize) {
        this.props.Alldatas({startPage: current, limit: pageSize});
        this.props.page({current: current, pageSize: pageSize});
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
        const {total, Alldate, Cur} = this.props;
        return (
            <div>
                <div className='res-table'>
                    <LocaleProvider locale={zhCN}>
                        <Table bordered rowKey={record => record.id} columns={this.columns} dataSource={Alldate} pagination={false}/>
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
    const {total, Alldate, sumDuration, sumPay, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.farmBenefitAnalysisReducer;
    return {
        total: total,
        sumDuration: sumDuration,
        sumPay: sumPay,
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