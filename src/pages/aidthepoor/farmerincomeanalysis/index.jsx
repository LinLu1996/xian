/* global echarts:true */

import {Component} from 'react';
import {Input, Button, DatePicker, Select, Col, Row,LocaleProvider} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import '../../index.less';
import './index.less';
import moment from "moment";
import Com from '@/component/common';
import zhCN from 'antd/lib/locale-provider/zh_CN';


const {RangePicker} = DatePicker;
const Option = Select.Option;
import React from "react";

class Resources extends Component {
    constructor(props) {
        super(props);
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
        this.state = {
            flag: false,
            baseId: '',
            userName: '',
            startDate: moment(start).format('YYYY/MM/DD'),//开始日期
            endDate: moment(end).format('YYYY/MM/DD'),//结束日期
            queryFlag: false, //筛选按钮
            buttonList: [0],
            yeardata: [{value:0,name:'无'}],
            baseList: [],
            queryRole: false,
            queryUserRole: false,
            downloadRole: false
        };
        this.refreshDate = this.refreshDate.bind(this);
        this.initData = this.initData.bind(this);
    }

    async componentDidMount() {
        const vm = {
            startPage: 1,
            limit: 10,
            startTime: this.state.startDate ? moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            endTime: this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined
        };
        await IOModel.getAllBase().then((res) => {
            const baseList = [];
            baseList.push({id: '', name: '全部'});
            res.data.forEach((item) => {
                baseList.push(item);
            });
            this.setState({
                baseList: baseList
            });
        });
        await this.props.Alldatas(vm);  //进入页面请求列表数据
        await this.refreshDate();
        this.props.superiorName({name: '涉贫农户受益分析', parentLeftID: -1});
    }

    setSearch(event) {
        this.setState({
            baseId: event
        },() => {
            this.refreshDate();
        });
    }

    setFarmName(event) {  //查找的表单-基地名称
        this.setState({
            userName: event.target.value
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

    query() {  //分析按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            startTime: this.state.startDate ? moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            endTime: this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined,
            baseId: this.state.baseId,
            userName: this.state.userName,
            startPage: 1,
            limit: 10
        };
        this.props.queryAll(vm);
        this.props.page({current: 1, pageSize: 10});
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        const vm = {
            startTime: this.state.startDate ? moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            endTime: this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined,
            baseId: this.state.baseId,
            companyId: 1,
            userName: this.state.userName,
            startPage: current,
            limit: size
        };
        this.props.queryAll(vm);
        this.props.page({current: current, pageSize: size});
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        const vm = {
            startTime: this.state.startDate ? moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            endTime: this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined,
            companyId: 1,
            baseId: this.state.baseId,
            userName: this.state.userName,
            startPage: 1,
            limit: size
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
        const vm = {
            startTime: this.state.startDate ? moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            companyId: 1,
            endTime: this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined,
            baseId: this.state.baseId,
            userName: this.state.userName
        };
        const yeardata = [];
        const buttonList = [];
        await IOModel.poorUserReport(vm).then((res) => {
            const data = res.data;
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const year = {};
                    year.value = data[i].pay;
                    const button = data[i].userName;
                    year.name = button;
                    yeardata.push(year);
                    buttonList.push(button);
                }
                this.setState({
                    yeardata: yeardata,
                    buttonList: buttonList
                });
            } else {
                this.setState({
                    yeardata: [{value:0,name:'无'}],
                    buttonList: [0]
                });
            }
        });
        const data = this.state.yeardata;
        // 绘制图表
        ProjectBarChart.setOption({
            title: {
                text: this.state.yeardata.length ?  `${this.state.yeardata[0].value}` : '',
                subtext: this.state.yeardata.length ? this.state.yeardata[0].name : '',
                x: 'center',
                y: 'center',
                itemGap: 20,
                textStyle: {
                  color: '#9cd0a0',
                  fontSize: 24
                },
                subtextStyle: {
                  color: '#666',
                  fontSize: 16
               }
            },
            tooltip: {
                show: true,
                formatter: '{a} <br/>{b}: {c} ({d}%) '
            },
            legend: {
                orient: 'vertical',
                //icon: 'circle',
                // 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
                x: 'left',
                y: '5%',
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 16,
                textStyle: {
                    fontSize: 12
                },
                data: this.state.buttonList,
                formatter: function (name) {
                    if (data.length) {
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].name === name) {
                                return `${name}  ${data[i].value}`;
                            }
                        }
                    }
                }
            },
            color: ['#9cd0a0', '#8786ce', '#FF8040', '#0072E3', '#9cb032'],
            series: [
                {
                    name: '涉贫农户受益分析',
                    type: 'pie',
                    clockWise: true, // 顺时针
                    radius: ['60%', '84%'],
                    avoidLabelOverlap: false,
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            label: {show: false},
                            labelLine: {show: false}
                        }
                    },
                  label: {
                    normal: {
                      show: true,
                      position: 'inner',
                      formatter: `{d}%`
                    },
                    emphasis: {
                      label: {
                        show: true,
                        position: 'center',
                        textStyle: {
                          fontSize: '30',
                          fontWeight: 'bold'
                        }
                      }
                    }
                  },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: this.state.yeardata
                }
            ]
        });
        ProjectBarChart.on('mouseover', function (e) {
        ProjectBarChart.setOption({
          title: {
            text: e.value,
            subtext: e.name
          }
        });
        ProjectBarChart.dispatchAction({
          type: 'highlight',
          dataIndex: e.dataIndex
        });

      });
        ProjectBarChart.on('mouseout', function (e) {
        ProjectBarChart.dispatchAction({type: 'highlight', dataIndex: e.dataIndex});
      });
        ProjectBarChart.dispatchAction({type: 'highlight', seriesIndex: 0, dataIndex: 0});
    }

    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'farmerincomeanalysis_listByPage', 'show');
        const queryUserRole = Com.hasRole(securityKeyWord, 'farmerincomeanalysis_user', 'show');
        const downloadRole = Com.hasRole(securityKeyWord, 'farmerincomeanalysis_download', 'download');
        const {queryFlag, flag, baseList} = this.state;
        const {Alldate} = this.props;
        const dateFormat = 'YYYY/MM/DD';
        const date = new Date();
        date.setMonth(date.getMonth() - 3);
        return (
            <div className='farming-box asset farmer-box'>
                <div className='farming-search'>
                    <div className='farming-title '>
                        <div className='title'>涉贫农户受益分析</div>
                        <div className='search-layout '>
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
                                <div className='search-col'>
                                    <span className='label-title'>涉贫农户</span>
                                    <Input size="large" value={this.state.userName} onChange={this.setFarmName.bind(this)}/>
                                </div>
                                <LocaleProvider locale={zhCN}>
                                    <div className='search-col'>
                                        <span className='label-title'>日期范围</span>
                                        <RangePicker className='rangePicker-farmAnalysis'
                                                     defaultValue={[moment(date, dateFormat), moment(new Date(), dateFormat)]}
                                                     format={dateFormat} onChange={this.setDate.bind(this)}/>
                                    </div>
                                </LocaleProvider>
                            </div>
                    </div>
                    </div>
                </div>
                {
                    queryRole && flag === true && <Row gutter={16}>
                        <Col className="farmerincomean-gutter-row" span={12} style={{padding:'0 10px'}}>
                            <div className="gutter-box">
                                <div id="ProjectBar" ref={el => (this.el = el)}
                                     style={{width: '100%', height: '320px', position: 'relative'}}/>
                            </div>
                        </Col>
                    </Row>
                }
                {queryUserRole && <div className='content'>
                    <div className='farmtable'>
                        <div className='table-header farmerheader'>
                            <p><i className='iconfont icon-sort'></i><span>明细</span></p>
                            {downloadRole &&  <p><Button className='hidden-content'>下载</Button></p>}
                        </div>
                        <Tables data={Alldate}
                                onSizeChangequery={this.onSizeChangequery.bind(this)} Cur={this.props.Cur}
                                onShowSizeChange={this.onShowSizeChange.bind(this)}
                                onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>
                    </div>
                </div>}
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['farmerincomeanalysis_listByPage','farmerincomeanalysis_user', 'farmerincomeanalysis_download'];
    const {Alldate, slideName} = state.farmBenefitAnalysisReducer;
    return {
        Alldate,
        slideName,securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
