import {Component} from 'react';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import './../../index.less';
import './index.less';
import {DatePicker, Input, LocaleProvider} from "antd";
import zhCN from "antd/lib/locale-provider/zh_CN";
import moment from "moment";

const {RangePicker} = DatePicker;

class Resources extends Component {
    constructor(props) {
        super(props);
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
        this.state = { //查询条件
            queryFlag: false,  //筛选按钮
            closure: null,
            mobilePhone: '',
            startDate: moment(start), //开始日期
            endDate: moment(end) //结束日期
        };
    }

    componentDidMount() {
        const startTime = new Date(`${moment(this.state.startDate).format('YYYY-MM-DD')} 00:00:00`).getTime();
        const endTime = new Date(`${moment(this.state.endDate).format('YYYY-MM-DD')} 23:59:59`).getTime();
        this.props.page({current: 1, pageSize: 10});
        this.props.allData({startPage: 1, limit: 10, startTime: startTime, endTime: endTime});
    }

    query() {  //查询按钮
        this.setState({
            queryFlag: true
        }, () => {
            if (this.state.closure) {
                clearTimeout(this.state.closure);
            }
            const vm = {
                startTime: this.state.startDate ? new Date(`${moment(this.state.startDate).format('YYYY-MM-DD')} 00:00:00`).getTime() : undefined,
                endTime: this.state.endDate ? new Date(`${moment(this.state.endDate).format('YYYY-MM-DD')} 23:59:59`).getTime() : undefined,
                mobilePhone: this.state.mobilePhone,
                startPage: 1,
                limit: this.props.PageSize
            };
            this.setState({
                closure: setTimeout(() => {
                    this.props.allData(vm);
                    this.props.page({current: 1, pageSize: this.props.PageSize});
                }, 800)
            });
        });
    }

    setDate(date) {
        if (date && date.length > 0) {
            this.setState({
                startDate: date[0],
                endDate: date[1]
            });
        } else {
            this.setState({
                startDate: null,
                endDate: null
            });
        }
        this.query();
    }

    onSizeChangeQuery(current, size) {  //第几页
        const vm = {
            startTime: this.state.startDate ? new Date(`${moment(this.state.startDate).format('YYYY-MM-DD')} 00:00:00`).getTime() : undefined,
            endTime: this.state.endDate ? new Date(`${moment(this.state.endDate).format('YYYY-MM-DD')} 23:59:59`).getTime() : undefined,
            mobilePhone: this.state.mobilePhone,
            startPage: current,
            limit: size
        };
        this.props.allData(vm);
    }

    onShowSizeChange(current, size) {  //每页数量
        const vm = {
            startTime: this.state.startDate ? new Date(`${moment(this.state.startDate).format('YYYY-MM-DD')} 00:00:00`).getTime() : undefined,
            endTime: this.state.endDate ? new Date(`${moment(this.state.endDate).format('YYYY-MM-DD')} 23:59:59`).getTime() : undefined,
            mobilePhone: this.state.mobilePhone,
            startPage: 1,
            limit: size
        };
        this.props.allData(vm);
    }

    setMobilePhone(event) {
        const value = event.target.value;
        this.setState({
            mobilePhone: value
        });
        this.query();
    }

    render() {
        const {queryFlag, startDate, endDate, mobilePhone} = this.state;
        const {dataList} = this.props;
        const dateFormat = 'YYYY-MM-DD';
        return (
            <div className='farming-box'>
                <div className='farming-search'>
                    <div className='farming-title'>
                        <div className='title'>个人账号审核</div>
                        <div className='right-search-col'>
                            <div className='right-search'>
                                <span className='search-title'>手机号</span>
                                <Input value={mobilePhone} onChange={this.setMobilePhone.bind(this)}/>
                            </div>
                            <div className='right-data-range'>
                                <span className='data-label'>日期选择</span>
                                <LocaleProvider locale={zhCN}>
                                    <RangePicker defaultValue={[this.state.startDate, this.state.endDate]}
                                                 format={dateFormat} onChange={this.setDate.bind(this)}/>
                                </LocaleProvider>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className='table-header'>
                        <p><i className='iconfont icon-sort'></i><span>审核列表</span></p>
                    </div>
                    <Tables data={dataList} onSizeChangeQuery={this.onSizeChangeQuery.bind(this)} queryFlag={queryFlag}
                            onShowSizeChange={this.onShowSizeChange.bind(this)} startDate={startDate}
                            endDate={endDate} mobilePhone={mobilePhone}/>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {dataList, Current, PageSize} = state.examineReducer;
    return {
        dataList,
        Current,
        PageSize
    };
};
export default connect(mapStateprops, action)(Resources);
