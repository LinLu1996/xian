import {Table, Pagination,LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {Component} from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
        const {total, Alldate, columns, Cur} = this.props;
        return (
            <div>
                <div className='res-table'>
                    <Table bordered  rowKey={record => record.id} columns={columns} dataSource={Alldate} pagination={false}/>
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
    const {Cur, Psize} = state.farmoverviewReducer;
    return {
        Cur,
        Psize
    };
};
export default connect(mapstateprops, action)(Tables);