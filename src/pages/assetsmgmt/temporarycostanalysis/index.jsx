import {Component} from 'react';
import {Col, DatePicker, Icon, Row, Select, LocaleProvider} from 'antd';
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
import ModalForm from './modalForm.jsx';
import {LandIOModel} from "@/pages/masterdata/land/model";
import {ProgramAddIOModel} from "@/pages/masterdata/soultion/addmodel";

class Resources extends Component {
    constructor(props) {
        super(props);
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
        this.state = {
            flag: false,
            baseId: -1,//基地名称
            landId: -1,//地块名称
            cropId: -1,//作物品种名称
            startDate: moment(start).format('YYYY/MM/DD'),//开始日期
            endDate: moment(end).format('YYYY/MM/DD'),//结束日期
            queryFlag: false, //筛选按钮
            buttonList: [],
            //currentIndex: 1,
            yeardata: [],
            baseList: [],
            landList: [],
            cropList: [],
            queryRole: false,
            downloadRole: false,
            editRole: false,
            countRole: false
        };
        this.refreshDate = this.refreshDate.bind(this);
        this.initData = this.initData.bind(this);
    }

    async componentDidMount() {
        await this.props.Alldatas({
            startPage: 1,
            limit: 10,
            startTime: moment(this.state.startDate, 'YYYY/MM/DD').valueOf(),
            endTime: moment(this.state.endDate, 'YYYY/MM/DD').valueOf()
        });  //进入页面请求列表数据
        await LandIOModel.GetAllBase({companyId: 1}).then((res) => {
            this.setState({
                baseList: res.data
            });
        });
        await ProgramAddIOModel.getBreedList({companyId: 1}).then((res) => {
            this.setState({
                cropList: res.data
            });
        });
        this.props.superiorName({name: '临时工成本分析', parentLeftID: -1});
        await this.refreshDate();
    }

    setBaseName(event) {  //查找的表单-基地名称
        this.setState({
            baseId: event,
            landList: []
        }, () => {
            this.refreshDate();
        });
        if (event === -1) {
            event = '';
        }
        IOModel.getLandsByBaseId({':baseId': event}).then((res) => {
            this.setState({
                landList: res.data
            });
        });
        this.setState({
            landId: -1,
            cropId: -1
        });
    }

    setLandName(event) {  //查找的表单-基地名称
        this.setState({
            landId: event
        }, () => {
            this.refreshDate();
        });
    }

    setCropsName(event) {  //查找的表单-基地名称
        this.setState({
            cropId: event
        }, () => {
            this.refreshDate();
        });
    }

    setDate(date, dateString) {
        this.setState({
            startDate: dateString[0],
            endDate: dateString[1]
        }, () => {
            this.refreshDate();
        });
    }

    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            companyId: 1,
            startTime: this.state.startDate ? moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            endTime: this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined,
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
            companyId: 1,
            startTime: this.state.startDate ? moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            endTime: this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined,
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
            companyId: 1,
            startTime: this.state.startDate ? moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            endTime: this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined,
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

    /* handleTask(index) {
         this.setState({
             currentIndex: index
         });
     }*/

    downloadAnalysis() {
        console.log("下载分析详情");
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
            companyId: 1,
            startTime: this.state.startDate ? moment(this.state.startDate, 'YYYY/MM/DD').valueOf() : undefined,
            endTime: this.state.endDate ? moment(this.state.endDate, 'YYYY/MM/DD').valueOf() : undefined,
            baseId: this.state.baseId === -1 ? undefined : this.state.baseId,
            landId: this.state.landId === -1 ? undefined : this.state.landId,
            cropId: this.state.cropId === -1 ? undefined : this.state.cropId
        };
        const buttonList = [];
        const yeardata = [];
        await IOModel.getWorkHireTaskByCodeReport(vm).then((res) => {
            const data = res.data;
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const year = {};
                    year.value = data[i].sumPay;
                    year.name = data[i].typeName;
                    buttonList.push(data[i].typeName);
                    yeardata.push(year);
                }
                const yeardataf = yeardata.filter((item, index) => {
                    if (item.value === null) {
                        buttonList.splice(index, 1);
                    }
                    return item.value !== null;
                });
                this.setState({
                    buttonList: buttonList,
                    yeardata: yeardataf
                });
            } else {
                this.setState({
                    buttonList: [],
                    yeardata: []
                });
            }
        });
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
                    if (yeardata.length) {
                        for (let i = 0; i < yeardata.length; i++) {
                            if (yeardata[i].name === name) {
                                return `${name}${yeardata[i].value}`;
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
        const queryRole = Com.hasRole(securityKeyWord, 'temporarycostanalysis_listByPage', 'show');
        const downloadRole = Com.hasRole(securityKeyWord, 'temporarycostanalysis_download', 'download');
        const editRole = Com.hasRole(securityKeyWord, 'temporarycostanalysis_getById', 'show');
        const countRole = Com.hasRole(securityKeyWord, 'temporarycostanalysis_count', 'show');
        const {queryFlag, flag, baseList, landList, cropList, baseId, landId, cropId} = this.state;
        const {Alldate} = this.props;
        const dateFormat = 'YYYY/MM/DD';
        const date = new Date();
        date.setMonth(date.getMonth() - 3);
        const newBaseList = [];
        const newLandList = [];
        const newCropList = [];
        newBaseList.push({id: -1, name: '全部'});
        baseList.forEach((item) => {
            newBaseList.push(item);
        });
        newLandList.push({id: -1, name: '全部'});
        landList.forEach((item) => {
            newLandList.push(item);
        });
        newCropList.push({id: -1, name: '全部'});
        cropList.forEach((item) => {
            newCropList.push(item);
        });
        return (
                <div className='farming-box asset'>
                    <div className='farming-search'>
                        <div className='farming-title plantingmgmt-title'>
                            <div className='title'>临时工成本</div>
                            <div className='search-layout '>
                                <div className='search-row'>
                                    <div className='search-col'>
                                        <span className='label-title'>基地</span>
                                        <Select value={baseId} onChange={this.setBaseName.bind(this)}
                                                showSearch
                                                placeholder="请选择基地"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                            {newBaseList.map((item) => {
                                                return <Option key={item.id} value={item.id}>{item.name}</Option>;
                                            })}
                                        </Select>
                                    </div>
                                    <div className='search-col'>
                                        <span className='label-title'>地块</span>
                                        <Select value={landId} onChange={this.setLandName.bind(this)}
                                                showSearch
                                                placeholder="请选择地块"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                            {newLandList.map((item) => {
                                                return <Option key={item.id} value={item.id}>{item.name}</Option>;
                                            })}
                                        </Select>
                                    </div>
                                    <div className='search-col'>
                                        <span className='label-title'>作物</span>
                                        <Select value={cropId} onChange={this.setCropsName.bind(this)}
                                                showSearch
                                                placeholder="请选择作物"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                            {newCropList.map((item) => {
                                                return <Option key={item.id} value={item.id}>{item.name}</Option>;
                                            })}
                                        </Select>
                                    </div>
                                    <LocaleProvider locale={zhCN}>
                                        <div className='search-col -temporacy'>
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
                        flag === true && <div>{countRole && <Row gutter={16}>
                            <Col className="farmAnalysis-gutter-row" span={12} style={{padding: '0 10px'}}>
                                <div className="gutter-box">
                                    <div id="ProjectBar" ref={el => (this.el = el)}
                                         style={{width: '100%', height: '320px', position: 'relative'}}/>
                                </div>
                            </Col>
                        </Row>}
                            {queryRole && <div className='content'>
                                <div className='table-header'>
                                    <p><i className='iconfont icon-sort'></i><span>成本明细</span></p>
                                    {downloadRole && <p><span className='hidden-content download-icon'
                                                              onClick={this.downloadAnalysis.bind(this)}><Icon
                                            style={{fontSize: 24, color: '#08c'}} type="download"/></span></p>}
                                </div>
                                <Tables bordered rowKey={record => record.id} data={Alldate} editRole={editRole}
                                        onSizeChangequery={this.onSizeChangequery.bind(this)}
                                        onShowSizeChange={this.onShowSizeChange.bind(this)}
                                        onchooseChange={this.onchooseChange.bind(this)}
                                        queryFlag={queryFlag}/>
                                <ModalForm props={this.props}/>
                            </div>}
                        </div>
                    }
                </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName} = state.temporarycostanalysisReducer;
    const {securityKeyWord} = state.initReducer;
    //const securityKeyWord = ['temporarycostanalysis_listByPage','temporarycostanalysis_count','temporarycostanalysis_getById', 'temporarycostanalysis_download'];
    return {
        Alldate,
        slideName, securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
