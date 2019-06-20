import {Table, Pagination, Tooltip,LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {Component} from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from "moment";

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
            width: 100,
            key: 'key',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        },
            {
                title: '基地',
                dataIndex: 'baseName',
                align: "left"
            }, {
                title: '数据时间',
                dataIndex: 'recordingTime',
                align: "center",
                render(recordingTime) {
                    return moment(recordingTime).format('YYYY-MM');
                }
            }, {
                title: '地块数量',
                dataIndex: 'landQty',
                align: "right"
            }, {
                title: '种植面积',
                dataIndex: 'area',
                align: "right"
            }, {
                title: '作物数量',
                dataIndex: 'cropQty',
                align: "right"
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
    async query(record) {
        await this.props.getOne({':id': record.id});
        const row = this.props.Rditdate;
        this.props.defaultFields({
            id: {
                value: row.id
            },
            allBase: {
                value: this.props.allBase
            },
            baseName: {
                value: row.baseId
            },
            recordingTime: {
                value: row.recordingTime
            },
            area: {
                value: row.area
            },
            landQty: {
                value: row.landQty
            },
            cropQty: {
                value: row.cropQty
            },
            modeltype: {
                value: 'modify'
            }
        });
        this.props.modal({modalFlag: true, modeltype: 'modify'});
    }

    onchooseChange(current, pageSize) {
        const {onchooseChange} = this.props;
        onchooseChange(current, pageSize);
        this.props.choosepage({current: current, pageSize: pageSize});
        this.props.page({current: current, pageSize: pageSize});
    }

    render() {
        const {total, Alldate,Cur} = this.props;
        return (
            <div>
            <div className='res-table'>
                <LocaleProvider locale={zhCN}>
                    <Table  bordered rowKey={record => record.id} columns={this.columns} dataSource={Alldate} pagination={false}/></LocaleProvider>
                {/*{
                    queryFlag ?
                        <Pagination defaultCurrent={1} total={total} onChange={this.onSizeChangequery.bind(this)} current={Cur}
                                    className='res-pagination'/> : chooseFlag ?
                        <Pagination className='res-pagination' defaultCurrent={1} total={total} current={Cur}
                                    onChange={this.onchooseChange.bind(this)}/> :
                        <Pagination className='res-pagination' defaultCurrent={1} total={total} current={Cur}
                                    onChange={this.onSizeChangequery.bind(this)}/>
                }*/} </div>
                <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={Cur} defaultCurrent={1}  total={total} /></LocaleProvider>
                {/*<Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total}*/}
                                              {/*onChange={this.onSizeChangequery.bind(this)}*/}
                    {/*/>*/}
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {Rditdate, Alldate,allBase, allLandType, total, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.companyassetsdataReducer;
    return {
        Rditdate: Rditdate,
        allBase: allBase,
        allLandType: allLandType,
        total: total,
        Alldate,
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