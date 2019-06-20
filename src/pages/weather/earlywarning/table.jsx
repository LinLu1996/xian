import {Table, Pagination, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {Component} from 'react';
import moment from "moment";
import '../../index.less';
import './index.less';
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
            width: 100,
            key: 'key',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        }, {
            title: '预警时间',
            dataIndex: 'warningDate',
            align: "center",
            render(warningDate) {
                return moment(warningDate).format('YYYY-MM-DD');
            }
        }, {
            title: '基地',
            dataIndex: 'baseName',
            align: "left"
        }, {
            title: '品种',
            dataIndex: 'cropName',
            align: "left"
        }, {
            title: '物候期',
            dataIndex: 'cropPeriod',
            align: "left"
        }, {
            title: '潜在灾害',
            dataIndex: 'disaster',
            align: "left"
        }, {
            title: '灾害等级',
            dataIndex: 'disasterGrade',
            align: "center"
        }, {
            title: '灾害预测',
            dataIndex: 'disasterForecast',
            align: "left"
        }, {
            title: '灾害发生率',
            dataIndex: 'generationRate',
            align: "right"
        }];
    }

    query(record) {
        this.props.defaultFields({
            id: {
                value: record.id
            },
            operationName: {
                value: record.operationName
            },
            crop_name: {
                value: record.crop_name
            },
            createName: {
                value: record.createName
            },
            createTime: {
                value: record.createTime
            },
            stauts: {
                value: record.stauts
            },
            modeltype: {
                value: 'mopageSeconddify'
            }
        });
        this.props.modal({modalFlag: true, modeltype: 'modify'});
    }

    onSizeChange(current, pageSize) {
        this.props.AlldatasS({startPage: current, limit: pageSize, companyId: 1});
        this.props.pageSecond({current: current, pageSize: pageSize});
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

    render() {
        const {total, data,Cur} = this.props;
        return (
            <div>
                <div className='res-table'>
                    <LocaleProvider locale={zhCN}>
                        <Table bordered rowKey={record => record.id} columns={this.columns} dataSource={data}
                               pagination={false}/>
                    </LocaleProvider>
                </div>
                <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={Cur} defaultCurrent={1}  total={total} /></LocaleProvider>
                {/*<Pagination className='res-pagination' defaultCurrent={1} total={total}*/}
                            {/*onChange={this.onSizeChangequery.bind(this)}*/}
                {/*/>*/}
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {totalS, Alldata, Alldate, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.earlyWarningListReducer;
    return {
        total: totalS,
        Cur,
        Psize,
        Alldata, Alldate,
        chooseFlag: chooseflag,
        deleteok: deleteOK,
        TreeD,
        parentName: parentname,
        slideID, chooseSIZE, chooseCUR
    };
};
export default connect(mapstateprops, action)(Tables);