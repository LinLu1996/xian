import {Table, Pagination, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {Component} from 'react';
import moment from "moment";
import zhCN from "antd/lib/locale-provider/zh_CN";

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
        },
            {
                title: '日期',
                dataIndex: 'publishTime',
                align: "center",
                render: (publishTime) => {
                    if (publishTime) {
                        return moment(publishTime).format('YYYY-MM-DD');
                    } else {
                        return '';
                    }
                }
            }, {
                title: '基地',
                dataIndex: 'baseName',
                align: "left"
            }, {
                title: '天气',
                dataIndex: 'description',
                align: "left"
            }, {
                title: '温度',
                dataIndex: 'temperature',
                align: "right"
            }, {
                title: '紫外线强度',
                dataIndex: 'uvIntensity',
                width: 144,
                align: "right"
            }, {
                title: '湿度',
                dataIndex: 'humidity',
                align: "right"
            }, {
                title: '降雨量',
                dataIndex: 'rainfall',
                align: "right"
            }, {
                title: '气压',
                dataIndex: 'airpressure',
                align: "right"
            },
            {
                title: '风向',
                dataIndex: 'windDirection',
                align: "left"
            },
            {
                title: '风级',
                dataIndex: 'windLevel',
                align: "center"
            },
            {
                title: '风速',
                dataIndex: 'windSpeed',
                align: "right"
            }];
    }

    onSizeChange(current, pageSize) {
        this.props.listByPage({startPage: current, limit: pageSize});
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
        const {total, data} = this.props;
        const dataFormat = data;
        return (
            <div>
            <div className='res-table'>
                <LocaleProvider locale={zhCN}>
                    <Table bordered  rowKey={record => record.id} columns={this.columns} dataSource={dataFormat} pagination={false}/>
                </LocaleProvider>
            </div>
                <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={this.props.Cur} defaultCurrent={1}  total={total} /></LocaleProvider>
                {/*<Pagination className='res-pagination' defaultCurrent={1} current={this.props.Cur} total={total}*/}
                                              {/*onChange={this.onSizeChangequery.bind(this)}*/}
                    {/*/>*/}
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {Rditdate, allBase, allLandType, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR, weatherHistory} = state.historicalMeteorologicalReducer;
    return {
        Rditdate: Rditdate,
        allBase: allBase,
        allLandType: allLandType,
        total: weatherHistory.totalCount,
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