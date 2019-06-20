/* global echarts:true */

import {Component} from 'react';
import {DatePicker, Select, Icon, Col, Row, LocaleProvider} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import '../../index.less';
import './index.less';
import moment from "moment";

const {RangePicker} = DatePicker;
import React from "react";
import Utils from "@/pages/plantingmgmt/farmingplan/util";
import Com from '@/component/common';
import zhCN from "antd/lib/locale-provider/zh_CN";


class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: true,
            base: '',//基地名称
            baseId: -1,
            landId: -1,//地块id
            cropId: -1,//作物id
            startDate: moment(new Date(), 'YYYY/MM/DD').add(-3, 'months'),//开始日期
            endDate: moment(new Date(), 'YYYY/MM/DD'),//结束日期
            queryFlag: false, //筛选按钮
            currentIndex: 1,
            workTypeCode: 'watering',
            yeardata: [
                {value: 0, name: '灌溉成本'},
                {value: 0, name: '施肥成本'},
                {value: 0, name: '植保成本'},
                {value: 0, name: '园艺成本'}
            ],
            //Tag标签上的文本
            tagButtons: [
                {code: "watering", name: '灌溉成本'},
                {code: "fertilizer", name: '施肥成本'},
                {code: "protection", name: '植保成本'},
                {code: "gardening", name: '园艺成本'}
            ],
            queryRole: false,
            downloadRole: false,
            countRole: false
        };
        this.refreshDate = this.refreshDate.bind(this);
        const {securityKeyWord} = this.props;
        if (Com.hasRole(securityKeyWord, 'materialcostanalysis_count', 'show')) {
            this.initData = this.initData.bind(this);
        }
    }

    handleBase(value) {
        this.setState({
            baseId: value
        },() => {
            this.hunsubmit();
        });
        const {baseList} = this.props;
        if (baseList && baseList.length > 0) {
            const bases = baseList.filter((item) => {
                return item.id === value;
            });
            if (bases && bases.length > 0) {
                this.setState({
                    base: bases[0]
                });
            }
        }
        if (value) {
            this.props.getBaseLand(value);
        }
        this.setState({
            landId: -1,
            cropId: -1
        });
    }

    async hunsubmit() {
        await IOModel.QueryProportion({
            companyId: 1,
            userId: 1,
            startPage: 1,
            limit: 10,
            baseId: this.state.baseId === -1 ? undefined : this.state.baseId,
            landId: this.state.landId === -1 ? undefined : this.state.landId,
            cropId: this.state.cropId === -1 ? undefined : this.state.cropId,
            startTime: this.state.startDate ? moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            endTime:this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined
        }).then((res) => {
            const ProportionData = res.data.percent;
            let dataList = [];
            if(ProportionData.length > 0) {
                for (let j = 0; j < ProportionData.length; j++) {
                    const data = {};
                    if (ProportionData[j].code === 'watering') {
                        data.value = ProportionData[j].costAll;
                        data.name = '灌溉成本';
                    }
                    if (ProportionData[j].code === 'fertilizer') {
                        data.value = ProportionData[j].costAll;
                        data.name = '施肥成本';
                    }
                    if (ProportionData[j].code === 'protection') {
                        data.value = ProportionData[j].costAll;
                        data.name = '植保成本';
                    }
                    if (ProportionData[j].code === 'gardening') {
                        data.value = ProportionData[j].costAll;
                        data.name = '园艺成本';
                    }
                    dataList.push(data);
                }
            } else {
                dataList=[
                    {value: 0, name: '灌溉成本'},
                    {value: 0, name: '施肥成本'},
                    {value: 0, name: '植保成本'},
                    {value: 0, name: '园艺成本'}
                ];
            }
            this.setState({
                yeardata: dataList
            });
        });


        //进入页面请求列表数据
        await this.props.Alldatas({
            companyId: 1,
            userId: 1,
            startPage: 1,
            limit: 10,
            baseId: this.state.baseId === -1 ? undefined : this.state.baseId,
            landId: this.state.landId === -1 ? undefined : this.state.landId,
            cropId: this.state.cropId === -1 ? undefined : this.state.cropId,
            workTypeCode: this.state.workTypeCode,
            startTime: this.state.startDate ? moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            endTime: this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined
        });  //进入页面请求列表数据
        // this.props.superiorName({name:'农资成本分析',parentLeftID:-1});
        this.refreshDate();//初始化图表
        this.props.page({current: 1, pageSize: 10});
    }

    async componentDidMount() {
        this.props.page({current: 1, pageSize: 10});
        this.props.getCompanyBase();
        this.props.getCompanyCrop();
        this.hunsubmit();
    }


    setLandName(event) {  //查找的表单-基地名称
        this.setState({
            landId: event
        },() => {
            this.hunsubmit();
        });
    }

    setCropsName(event) {  //查找的表单-基地名称
        this.setState({
            cropId: event
        },() => {
            this.hunsubmit();
        });
    }

    setDate(date) {
        if (date && date.length > 0) {
            this.setState({
                startDate: date[0],
                endDate: date[1]
            },() => {
                this.hunsubmit();
            });
        } else {
            this.setState({
                startDate: '',
                endDate: ''
            },() => {
                this.hunsubmit();
            });
        }
    }
    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            baseId: this.state.baseId === -1 ? undefined : this.state.baseId,
            landId: this.state.landId === -1 ? undefined : this.state.landId,
            cropId: this.state.cropId === -1 ? undefined : this.state.cropId,
            startPage: 1,
            limit: 10
        };
        this.props.queryAll(vm);
        this.props.page({current: 1, pageSize: 10});
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            baseId: this.state.baseId === -1 ? undefined : this.state.baseId,
            landId: this.state.landId === -1 ? undefined : this.state.landId,
            cropId: this.state.cropId === -1 ? undefined : this.state.cropId,
            startPage: current,
            limit: size
        };
        this.props.queryAll(vm);
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            baseId: this.state.baseId === -1 ? undefined : this.state.baseId,
            landId: this.state.landId === -1 ? undefined : this.state.landId,
            cropId: this.state.cropId === -1 ? undefined : this.state.cropId,
            startPage: 1,
            limit: size
        };
        this.props.queryAll(vm);
    }
    onchooseChange(current, size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
    }

    handleTask(index, code) {
        this.setState({
            currentIndex: index,
            workTypeCode: code
        });
        this.props.Alldatas({
            companyId: 1,
            userId: 1,
            startPage: 1,
            limit: 10,
            baseId: this.state.baseId === -1 ? undefined : this.state.baseId,
            landId: this.state.landId === -1 ? undefined : this.state.landId,
            cropId: this.state.cropId === -1 ? undefined : this.state.cropId,
            startTime: this.state.startDate ?  moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            endTime: this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined,
            workTypeCode: code
        });  //进入页面请求列表数据
    }

    downloadAnalysis() {
        console.log("下载分析详情");
    }

    //饼图生成
    async refreshDate() {
        const {securityKeyWord} = this.props;
        if (Com.hasRole(securityKeyWord, 'materialcostanalysis_count', 'show')) {
            this.initData();
        }
    }

    initData() {
        /* global echarts:true */
        const data = this.state.yeardata;
        const ProjectBarChart = echarts.init(this.el);
        // 绘制图表
        ProjectBarChart.setOption({
            title: {
                text: this.state.yeardata.length ? `${this.state.yeardata[0].value}` : '',
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
                                return `${name}${data[i].value}`;
                            }
                        }
                    }
                }
            },
            color: ['#9cd0a0', '#8785ce', '#edc878', 'a2a0f7'],
            series: [
                {
                    name: '成本分析',
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
        const queryRole = Com.hasRole(securityKeyWord, 'materialcostanalysis_listByPage', 'show');
        const countRole = Com.hasRole(securityKeyWord, 'materialcostanalysis_count', 'show');
        const downloadRole = Com.hasRole(securityKeyWord, 'materialcostanalysis_download', 'download');
        const {queryFlag, currentIndex, flag, baseId, landId, cropId} = this.state;
        const {Alldate} = this.props;
        const dateFormat = 'YYYY/MM/DD';
        const date = new Date();
        date.setMonth(date.getMonth() - 3);
        const {baseList, cropList, landList} = this.props;
        let list = [];
        if (this.state.baseId) {
            list = landList;
        }
        const newBaseList = [];
        const newLandList = [];
        const newCropList = [];
        newBaseList.push({id: -1, name: '全部'});
        baseList.forEach((item) => {
            newBaseList.push(item);
        });
        newLandList.push({id: -1, name: '全部'});
        list.forEach((item) => {
            newLandList.push(item);
        });
        newCropList.push({id: -1, name: '全部'});
        cropList.forEach((item) => {
            newCropList.push(item);
        });
        const landOptions = Utils.getOptionList(newLandList);
        const baseOptions = Utils.getOptionList(newBaseList);
        const cropsOptions = Utils.getOptionList(newCropList);
        return (
            <div className='farming-box asset material-box'>
                <div className='farming-search'>
                    <div className='farming-title plantingmgmt-title'>
                    <div className='title'>农资成本</div>
                       <div className='search-layout '>
                            <div className='search-row'>
                                <div className='search-col'>
                                    <span className='label-title'>基地</span>
                                    <Select value={baseId} onChange={this.handleBase.bind(this)}
                                            showSearch
                                            placeholder="请选择基地"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {baseOptions}
                                    </Select>
                                </div>
                                <div className='search-col'>
                                    <span className='label-title'>地块</span>
                                    <Select value={landId} onChange={this.setLandName.bind(this)}
                                            showSearch
                                            placeholder="请选择地块"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {landOptions}
                                    </Select>
                                </div>
                                <div className='search-col'>
                                    <span className='label-title'>作物</span>
                                    <Select value={cropId}
                                            onChange={this.setCropsName.bind(this)}
                                            showSearch
                                            placeholder="请选择作物"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {cropsOptions}
                                    </Select>
                                </div>
                                <LocaleProvider locale={zhCN}>
                                    <div className='search-col -material'>
                                        <span className='label-title'>日期范围</span>
                                        <RangePicker className='rangePicker-farmAnalysis'
                                                     defaultValue={[moment(date, dateFormat), moment(new Date(), dateFormat)]}
                                                     format={dateFormat} onChange={this.setDate.bind(this)}
                                                     allowClear
                                        />
                                    </div>
                                </LocaleProvider>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    queryRole && flag === true && <div>{countRole && <Row gutter={16} style={{marginLeft:0,marginRight:0}}>
                        <Col className="farmAnalysis-gutter-row" span={12} style={{padding:'0 10px'}}>
                            <div className="gutter-box">
                                <div id="ProjectBar" ref={el => (this.el = el)}
                                     style={{width: '100%', height: '320px', position: 'relative'}}/>
                            </div>
                        </Col>
                    </Row>}
                    </div>
                }
                {queryRole && <div className='content'>
                    <div className='matable'>
                        <div className='farming-table-header'>
                            <div className='table-header-analysis'>
                                {
                                    this.state.tagButtons.map((item, index) => {
                                        return <span key={index}
                                                     onClick={this.handleTask.bind(this, index + 1, item.code)}
                                                     className={currentIndex === index + 1 ? 'checked' : ''}>{item.name}</span>;
                                    })
                                }
                                {downloadRole &&
                                <i className='hidden-content download-icon' onClick={this.downloadAnalysis.bind(this)}><Icon
                                    style={{fontSize: 24, color: '#08c'}} type="download"/></i>}
                            </div>
                        </div>
                    <div className='table-header  header'>
                        <p><i className='iconfont icon-sort'></i><span>成本明细</span></p>
                    </div>
                    {
                        currentIndex === 1 && <Tables bordered scroll={{x:1200}} rowKey={record => record.id} data={Alldate.report} baseId={this.state.base} landId={this.state.landId} cropId={this.state.cropId}
                                                      onSizeChangequery={this.onSizeChangequery.bind(this)}
                                                      onShowSizeChange={this.onShowSizeChange.bind(this)}
                                                      onchooseChange={this.onchooseChange.bind(this)}
                                                      props={this.props}
                                                      queryFlag={queryFlag}/>
                    }
                    {
                        currentIndex === 2 && <Tables bordered scroll={{x:1200}}  rowKey={record => record.id} data={Alldate.report} baseId={this.state.base} landId={this.state.landId} cropId={this.state.cropId}
                                                      onSizeChangequery={this.onSizeChangequery.bind(this)}
                                                      onShowSizeChange={this.onShowSizeChange.bind(this)}
                                                      onchooseChange={this.onchooseChange.bind(this)}
                                                      props={this.props}
                                                      queryFlag={queryFlag}/>
                    }
                    {
                        currentIndex === 3 && <Tables bordered scroll={{x:1200}} rowKey={record => record.id} data={Alldate.report} baseId={this.state.base} landId={this.state.landId} cropId={this.state.cropId}
                                                      onSizeChangequery={this.onSizeChangequery.bind(this)}
                                                      onShowSizeChange={this.onShowSizeChange.bind(this)}
                                                      onchooseChange={this.onchooseChange.bind(this)}
                                                      props={this.props}
                                                      queryFlag={queryFlag}/>
                    }
                    {
                        currentIndex === 4 && <Tables bordered scroll={{x:1200}} rowKey={record => record.id} data={Alldate.report} baseId={this.state.base} landId={this.state.landId} crops={this.state.cropId}
                                                      onSizeChangequery={this.onSizeChangequery.bind(this)}
                                                      onShowSizeChange={this.onShowSizeChange.bind(this)}
                                                      onchooseChange={this.onchooseChange.bind(this)}
                                                      props={this.props}
                                                      queryFlag={queryFlag}/>
                    }
                </div>
                </div>}
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, ProportionData, baseList, cropList, landList} = state.materialcostanalysisReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['materialcostanalysis_listByPage', 'materialcostanalysis_count', 'materialcostanalysis_download'];
    return {
        Alldate,
        ProportionData,
        baseList,
        cropList,
        landList,
        securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
