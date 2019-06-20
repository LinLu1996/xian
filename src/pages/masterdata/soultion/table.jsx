import {Table, Pagination, Switch, Tooltip, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import { NavLink } from 'react-router-dom';
import {action} from './model';
import {Component} from 'react';
import moment from 'moment';
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
            title: '方案名称',
            dataIndex: 'name',
            align: "left"
        }, {
            title: '作物品种',
            dataIndex: 'cropName',
            align: "left"
        }, {
            title: '创建时间',
            dataIndex: 'gmtCreate',
            align: "center",
            render: (text) => {
                return moment(text).format('YYYY-MM-DD');
            }
        }, {
            title: '创建人',
            dataIndex: 'createUserName',
            align: "left"
        }, {
            title: '修改时间',
            dataIndex: 'gmtModified',
            align: "center",
            render: (text) => {
                return moment(text).format('YYYY-MM-DD');
            }
        }, {
            title: '修改人',
            dataIndex: 'modifyUserName',
            align: "left"
        }, {
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
        if(this.props.editRole||this.props.getRole) {
            this.columns.push({
                title: '操作',
                dataIndex: 'caozuo',
                align: "center",
                render: (text, record) => {
                    return <div>
                        {this.props.editRole && <Tooltip title="编辑">
                            <span className='cursor'><NavLink  to ={`/pages/masterdata/soultion/one/${record.id}/modify`}><i className='iconfont icon-xiugai07'></i></NavLink></span>
                        </Tooltip>}
                        {this.props.getRole && <Tooltip title="查看详情">
                            <span className='cursor'><NavLink  to ={`/pages/masterdata/soultion/one/${record.id}/detail`}><i className='iconfont icon-xiangqing'></i></NavLink></span>
                        </Tooltip>}
                    </div>;
                }
            });
        }
    }

    changeStatus(record) {
        const {Cur, Psize} = this.props;
        const flag=Public.changeStatus(record,'solution_status');
        flag.then((resolve) => {
            if(resolve===true) {
                this.props.Alldatas({startPage: Cur, limit: Psize,name:this.props.name,cropName:this.props.cropName,createUserName:this.props.createUserName,modifyUserName:this.props.modifyUserName});
            }
        });
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

    /*async query(record) {
        await this.props.getOne({id: record.id});
        const row = this.props.EditData;
        this.props.defaultFields({
            id: {
                value: row.id
            },
            name: {
                value: row.name
            },
            createUserName: {
                value: row.createUserName
            },
            createTime: {
                value: row.createTime
            },
            stauts: {
                value: row.stauts
            },
            modeltype: {
                value: 'modify'
            }
        });
        this.props.history.push('/masterdata/soultion/programAdd/modify');
    }*/

    onSizeChange(current, pageSize) {
        this.props.Alldatas({startPage: current, limit: pageSize});
        this.props.page({current: current, pageSize: pageSize});
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
                <Table  bordered  rowKey={record => record.id}  columns={this.columns} dataSource={Alldate} pagination={false}/>
                {/*{
                    queryFlag ?
                        <Pagination defaultCurrent={1} current={Cur} total={total} onChange={this.onSizeChangequery.bind(this)}
                                    className='res-pagination'/> : chooseFlag ?
                        <Pagination className='res-pagination' current={Cur} defaultCurrent={1} total={total}
                                    onChange={this.onchooseChange.bind(this)}/> :
                        <Pagination className='res-pagination' current={Cur} defaultCurrent={1} total={total}
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
    const {EditData, Alldate, total, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.programReducer;
    return {
        EditData: EditData,
        Alldate: Alldate,
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