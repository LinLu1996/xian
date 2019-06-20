import {Component} from 'react';
import {Modal, Table, Pagination, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import zhCN from "antd/lib/locale-provider/zh_CN";
class modalTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadFlag: false
        };
        this.baseColumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 100,
                key: 'key',
                align: 'center',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            },{
                title: '基地名称',
                dataIndex: 'name',
                align: 'left'
            },{
                title: '基地地址',
                dataIndex: 'address',
                align: 'left'
            },{
                title: '负责人',
                dataIndex: 'userName',
                align: 'left'
            },{
                title: '创建人',
                dataIndex: 'createUserName',
                align: 'left'
            }
        ];
        this.landColumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 100,
                key: 'key',
                align: 'center',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            },{
                title: '地块名称',
                dataIndex: 'name',
                align: 'left'
            },{
                title: '所属基地',
                dataIndex: 'baseName',
                align: 'left'
            },{
                title: '地块类型',
                dataIndex: 'typeName',
                align: 'left'
            },{
                title: '地块面积',
                dataIndex: 'area',
                align: 'right',
                width: 80
            }, {
                title: '负责人',
                dataIndex: 'userName',
                align: 'left',
                width: 85
            },{
                title: '创建人',
                dataIndex: 'createUserName',
                align: 'left',
                width: 85
            }
        ];
    }

    onSizeChange(current, pageSize) {
        const {tableId, tableFlag, tableType} = this.props;
        this.props.tableModal({tableFlag, tableCur: current, tableSize: pageSize, tableType, tableId});
        this.props.tableSearch({type: tableType, id: tableId, startPage: current, limit: pageSize});
    }

    onShowSizeChange(current, pageSize) {
        const {tableId, tableFlag, tableType} = this.props;
        this.props.tableModal({tableFlag, tableCur: current, tableSize: pageSize, tableType, tableId});
        this.props.tableSearch({type: tableType, id: tableId, startPage: current, limit: pageSize});
    }

    hideModal() {
        this.props.tableModal({tableCur: 1, tableSize: 10, tableFlag: false});
    }

    hideCancel() {
        this.props.tableModal({tableCur: 1, tableSize: 10, tableFlag: false});
    }

    render() {
        const {tableFlag, tableCur, tableSize, tableType, tableTotal, tableList} = this.props;
        let title;
        let columns;
        if (tableType === 'base') {
            title = '基地详情';
            columns = this.baseColumns;
        } else {
            title = '地块详情';
            columns = this.landColumns;
        }
        const me = this;
        const PaginOpt = {
            defaultPageSize: 10,
            defaultCurrent: 1,
            total: tableTotal,
            current: tableCur,
            pageSize: tableSize,
            onChange: me.onSizeChange.bind(me),
            onShowSizeChange: me.onShowSizeChange.bind(me)
        };
        return (
            <div>
                <Modal
                    title={title}
                    visible={tableFlag}
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName='company-table-modal'
                    width={800}
                >
                    <div className='res-table'>
                        <LocaleProvider locale={zhCN}>
                        <Table rowKey={record => record.id} bordered columns={columns}
                               dataSource={tableList} pagination={false}/>
                        </LocaleProvider>
                    </div>
                    <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper{...PaginOpt}/></LocaleProvider>
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const { tableFlag, tableCur, tableSize, tableTotal, tableList, tableType, tableId} = state.companyReducer;
    return {
        tableFlag,
        tableCur,
        tableSize,
        tableTotal,
        tableList,
        tableType,
        tableId
    };
};
export default connect(mapstateProps, action)(modalTable);
