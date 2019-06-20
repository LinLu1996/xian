import {Component} from 'react';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import ModalForm from './modalForm.jsx';
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
        this.state = {
            queryFlag: false,
            closure: null,
            mobilePhone: '',
            startDate: moment(start),
            endDate: moment(end)
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
            queryFlag: true //控制分页的展示
        }, () => {
            if (this.state.closure) {
                clearTimeout(this.state.closure);
            }
            const vm = {
                startTime: this.state.startDate ? new Date(`${moment(this.state.startDate).format('YYYY-MM-DD')} 00:00:00`).getTime() : undefined,
                endTime: this.state.endDate ? new Date(`${moment(this.state.endDate).format('YYYY-MM-DD')} 23:59:59`).getTime() : undefined,
                mobilePhone: this.state.mobilePhone,
                startPage: 1,
                limit: 10
            };
            this.setState({
                closure: setTimeout(() => {
                    this.props.allData(vm);
                    this.props.page({current: 1, pageSize: 10});
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

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        const vm = {
            startPage: current,
            limit: size,
            mobilePhone: this.state.mobilePhone,
            startTime: this.state.startDate ? new Date(`${moment(this.state.startDate).format('YYYY-MM-DD')} 00:00:00`).getTime() : undefined,
            endTime: this.state.endDate ? new Date(`${moment(this.state.endDate).format('YYYY-MM-DD')} 23:59:59`).getTime() : undefined
        };
        this.props.allData(vm);
    }

    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        const vm = {
            startPage: 1,
            limit: size,
            mobilePhone: this.state.mobilePhone,
            startTime: this.state.startDate ? new Date(`${moment(this.state.startDate).format('YYYY-MM-DD')} 00:00:00`).getTime() : undefined,
            endTime: this.state.endDate ? new Date(`${moment(this.state.endDate).format('YYYY-MM-DD')} 23:59:59`).getTime() : undefined
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
        const {queryFlag, mobilePhone,startDate,endDate} = this.state;
        const {dataList} = this.props;
        const dateFormat = 'YYYY-MM-DD';
        return (
            <div className='farming-box'>
                <div className='farming-search'>
                    <div className='farming-title'>
                        <div className='title'>企业账号审核</div>
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
                    <Tables data={dataList} onSizeChangequery={this.onSizeChangequery.bind(this)} queryFlag={queryFlag}
                            onShowSizeChange={this.onShowSizeChange.bind(this)}/>
                    {
                        this.props.modalflag && <ModalForm props={this.props} mobilePhone={mobilePhone} startDate={startDate} endDate={endDate}/>
                    }
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {dataList,modalflag} = state.enterpriseReducer;
    return {
        modalflag,
        dataList
    };
};
export default connect(mapStateprops, action)(Resources);
