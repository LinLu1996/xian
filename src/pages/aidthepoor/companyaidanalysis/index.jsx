/* global echarts:true */

import {Component} from 'react';
import {Button, DatePicker, Select, Card,LocaleProvider} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import '../../index.less';
import './index.less';
import moment from "moment";
import zhCN from 'antd/lib/locale-provider/zh_CN';

const {RangePicker} = DatePicker;
const Option = Select.Option;
import React from "react";
import {LandIOModel} from "@/pages/aidthepoor/farmerincomeanalysis/model";
import {IOModel} from "@/pages/aidthepoor/companyaidanalysis/model";
import Com from '@/component/common';

class Resources extends Component {
    constructor(props) {
        super(props);
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
        this.state = {
            flag: false,
            baseId: '',
            startDate: moment(start).format('YYYY/MM/DD'),//开始日期
            endDate: moment(end).format('YYYY/MM/DD'),//结束日期
            queryFlag: false, //筛选按钮
            person: [],
            money: [],
            time: [],
            month: [],
            baseList: [],
            queryRole: false,
            downloadRole: false
        };
        this.refreshDate = this.refreshDate.bind(this);
        this.initData = this.initData.bind(this);
    }

    async componentDidMount() {
        await LandIOModel.getAllBase().then((res) => {
            const baseList = [];
            baseList.push({id: '', name: '全部'});
            res.data.forEach((item) => {
                baseList.push(item);
            });
            this.setState({
                baseList: baseList
            });
        });
        await this.props.Alldatas({
            startPage: 1,
            limit: 10,
            startTime: this.state.startDate ? moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            endTime: this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined
        });  //进入页面请求列表数据
        await this.refreshDate();
        this.props.superiorName({name: '企业扶贫效力分析', parentLeftID: -1});
    }

    setSearch(event) {
        this.setState({
            baseId: event
        },() => {
            this.refreshDate();
        });
    }

    setDate(date, dateString) {
        this.setState({
            startDate: dateString[0],
            endDate: dateString[1]
        },() => {
            this.refreshDate();
        });
    }

    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            startTime: this.state.startDate ? moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            endTime: this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined,
            baseId: this.state.baseId,
            startPage: 1,
            limit: 10
        };
        this.props.queryAll(vm);
        this.props.page({current: 1, pageSize: 10});
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        const vm = {
            startPage: current,
            companyId: 1,
            startTime: this.state.startDate ? moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            endTime: this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined,
            baseId: this.state.baseId,
            limit: size
        };
        this.props.queryAll(vm);
        this.props.page({current: current, pageSize: size});
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        const vm = {
            startTime: this.state.startDate ? moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            endTime: this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined,
            baseId: this.state.baseId,
            startPage: 1,
            limit: size,
            companyId: 1
        };
        this.props.queryAll(vm);
        this.props.page({current: 1, pageSize: size});
    }

    onchooseChange(current, size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
        this.props.page({current: current, pageSize: size});
    }

    handleTask(index) {
        this.setState({
            currentIndex: index
        });
    }


    //饼图生成
    async refreshDate() {
        await this.setState({
            flag: true
        });
        await this.query();
        await this.initData();
    }

    async initData() {
        /* global echarts:true */
        const ProjectBarChart = echarts.init(this.el);
        const ProjectBarChart_2 = echarts.init(this.el_2);
        //const ProjectBarChart_3 = echarts.init(this.el_3);
        const vm = {
            startTime: this.state.startDate ? moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            endTime: this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined,
            baseId: this.state.baseId,
            companyId: 1
        };
        const personList = [];
        const moneyList = [];
        const timeList = [];
        const monthList = [];
        await IOModel.poorListByMonthAndCompanyReport(vm).then((res) => {
            const data = res.data;
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const month = `${data[i].month}月`;
                    monthList.push(month);
                    personList.push(data[i].times);
                    moneyList.push(data[i].sumPay);
                    timeList.push(data[i].sumDuration);
                    this.setState({
                        month: monthList,
                        person: personList,
                        money: moneyList,
                        time: timeList
                    });
                }
            } else {
                this.setState({
                    month: [],
                    person: [],
                    money: [],
                    time: []
                });
            }
        });
        // 绘制图表
        const option1 = {
            title: {
                text: '扶贫人次'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params) {
                    return `${params[0].name}<br/>${params[0].value}`;
                }
            },
            legend: {
                selectedMode: false,
                data: ['扶贫人次']
            },
            toolbox: {
                show: false,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: this.state.month
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    boundaryGap: [0, 0.1]
                }
            ],
            series: [
                {
                    name: 'Acutal',
                    type: 'bar',
                    stack: 'sum',
                    barCategoryGap: '80%',
                    itemStyle: {
                        normal: {
                            color: '#9cd0a0',
                            barBorderRadius: 0,
                            label: {
                                show: true, position: 'insideTop'
                            }
                        }
                    },
                    data: this.state.person
                }
            ]
        };
        const option2 = {
            title: {
                text: '扶贫金额(元)'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params) {
                    return `${params[0].name}<br/>${params[0].value}`;
                }
            },
            legend: {
                selectedMode: false,
                data: ['扶贫人次']
            },
            toolbox: {
                show: false,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: this.state.month
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    boundaryGap: [0, 0.1]
                }
            ],
            series: [
                {
                    name: 'Acutal',
                    type: 'bar',
                    stack: 'sum',
                    barCategoryGap: '80%',
                    itemStyle: {
                        normal: {
                            color: '#9cd0a0',
                            barBorderRadius: 0,
                            label: {
                                show: true, position: 'insideTop'
                            }
                        }
                    },
                    data: this.state.money
                }
            ]
        };
        /*const option3 = {
            title: {
                text: '扶贫人员工作时长(小时)'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params) {
                    return `${params[0].name}<br/>${params[0].value}`;
                }
            },
            legend: {
                selectedMode: false,
                data: ['扶贫人次']
            },
            toolbox: {
                show: false,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: this.state.month
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    boundaryGap: [0, 0.1]
                }
            ],
            series: [
                {
                    name: 'Acutal',
                    type: 'bar',
                    stack: 'sum',
                    barCategoryGap: '80%',
                    itemStyle: {
                        normal: {
                            color: '#9cd0a0',
                            barBorderRadius: 0,
                            label: {
                                show: true, position: 'insideTop'
                            }
                        }
                    },
                    data: this.state.time
                }
            ]
        };*/
        ProjectBarChart.setOption(option1);
        ProjectBarChart_2.setOption(option2);
    }

    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'companyaidanalysis_listByPage', 'show');
        const downloadRole = Com.hasRole(securityKeyWord, 'companyaidanalysis_download', 'download');
        const {queryFlag, flag, baseList} = this.state;
        const {Alldate} = this.props;
        const dateFormat = 'YYYY/MM/DD';
        const date = new Date();
        date.setMonth(date.getMonth() - 3);
        return (
            <div className='farming-box farmer-box'>
                <div className='farming-search'>
                    <div className='farming-title plantingmgmt-title'>
                        <div className='title'>企业扶贫效力分析</div>
                        <div className='search-layout'>
                        <div className='search-row'>
                            <div className='search-col'>
                                <span className='label-title'>基地名称</span>
                                <Select value={this.state.baseId}
                                        onChange={this.setSearch.bind(this)}
                                        showSearch
                                        placeholder="请选择基地名称"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                    {baseList.map((item) => {
                                        return <Option key={item.id} value={item.id}>{item.name}</Option>;
                                    })}
                                </Select>
                            </div>
                            <LocaleProvider locale={zhCN}>
                                <div className='search-col'>
                                    <span className='label-title'>日期范围</span>
                                    <RangePicker className='rangePicker-farmAnalysis' style={{marginRight: '10px'}}
                                                 defaultValue={[moment(date, dateFormat), moment(new Date(), dateFormat)]}
                                                 format={dateFormat} onChange={this.setDate.bind(this)}/>
                                </div>
                            </LocaleProvider>
                        </div>
                    </div>
                    </div>
                </div>
                {queryRole && <div className='content'>
                    <Card className='-card1'>
                        {
                            queryRole && flag === true && <div className='echarts'>
                                <div id="ProjectBar" className='echart1' ref={el => (this.el = el)}
                                     style={{width: '50%', height: '350px', position: 'relative'}}/>
                                <div id="ProjectBar2" className='echart1' ref={el => (this.el_2 = el)}
                                     style={{width: '50%', height: '350px', position: 'relative'}}/>
                                {/*<div id="ProjectBar3" className='echart1' ref={el => (this.el_3 = el)}*/}
                                     {/*style={{width: '30%', height: '350px', position: 'relative'}}/>*/}
                            </div>
                        }
                    </Card>
                    <div className='space'></div>
                    <div className='governtable'>
                    <div className='table-header govenheader'>
                        <p><i className='iconfont icon-sort'></i><span>明细</span></p>
                        {downloadRole && <p><Button className='hidden-content'>下载</Button></p>}
                    </div>
                    <Tables data={Alldate}
                            onSizeChangequery={this.onSizeChangequery.bind(this)}
                            onShowSizeChange={this.onShowSizeChange.bind(this)}
                            onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>
                </div>
                </div>}
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName} = state.enterPrisePovertyAnalysisReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['companyaidanalysis_listByPage', 'companyaidanalysis_download'];
    return {
        Alldate,
        slideName, securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
