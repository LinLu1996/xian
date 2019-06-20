import {Table, Pagination, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {Component} from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            columnsFinal: []
        };
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 100,
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '地块',
                dataIndex: 'landName',
                align: "left"
            }, {
                title: '品种',
                dataIndex: 'cropName',
                align: "left"
            }, {
                title: '所属大类',
                dataIndex: 'categoryName',
                align: "left"
            }, {
                title: '定植时间',
                dataIndex: 'plantingDate',
                align: "center"
            }, {
                title: '预估开始采收时间',
                dataIndex: 'plannedTime',
                align: "center",
                width: 160
            }, {
                title: '预估产量',
                dataIndex: 'expYield',
                align: "right"
            }, {
                title: '负责人',
                dataIndex: 'userName',
                align: "left"
            }];
    }

    componentWillReceiveProps(nextProps) {
        const columnsFinal = [];
        this.columns.forEach((item) => {
            const obj = item;
            columnsFinal.push(obj);
        });
        let flag = false;
        const addColums = nextProps.gradeColoumn[nextProps.Cur];
        if (addColums !== undefined && addColums.length > 0) {
            addColums.forEach((item) => {
                columnsFinal.forEach((item1) => {
                    if (item1.title !== item) {
                        flag = true;
                    } else {
                        flag = false;
                    }
                });
                if (flag) {
                    columnsFinal.push(
                        {
                            title: item,
                            dataIndex: item,
                            align: "right"
                        });
                }
            });
        }
        this.setState({
            columnsFinal: columnsFinal
        });
    }

    onSizeChange(current, pageSize) {
        this.props.Alldatas({companyId: 1, startPage: current, limit: pageSize});
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
                        <Table bordered className='yield-analysis-td' columns={this.state.columnsFinal}
                               dataSource={data} pagination={false}/>
                        {/*{
              queryFlag?<Pagination defaultCurrent={1} current={Cur} total={total} onChange={this.onSizeChangequery.bind(this)} className='res-pagination'/>:chooseFlag?
              <Pagination className='res-pagination' current={Cur} defaultCurrent={1} total={total} onChange={this.onchooseChange.bind(this)}/>:
              <Pagination className='res-pagination' current={Cur} defaultCurrent={1} total={total} onChange={this.onSizeChange.bind(this)}/>
            }*/}
                    </LocaleProvider>
                </div>
                {/*{*/}
                    {/*<Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total}*/}
                                {/*onChange={this.onSizeChangequery.bind(this)}*/}
                    {/*/>*/}
                {/*}*/}
                {
                    <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={Cur} defaultCurrent={1}  total={total} /></LocaleProvider>
                }
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {gradeColoumn, total, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.yieldAnalysisNewReducer;
    return {
        gradeColoumn,
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