/* global echarts:true */

import {Component} from 'react';
import {Select, Icon, Row, Col} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import '../../index.less';
import './index.less';
import React from "react";
import Utils from "@/pages/plantingmgmt/farmingplan/util";
import {LandIOModel} from "@/pages/masterdata/land/model";
import Com from '@/component/common';

class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            baseList: [],
            landList: [],
            cropList: [],
            flag: false,
            base: -1,//基地名称
            land: -1,//地块名称
            crops: -1,//作物品种名称
            queryFlag: false, //筛选按钮
            yieldList: [],
            gradeList: [],
            currentIndex: 1,
            yielddata: [],
            gradedata: [],
            queryRole: false,
            downloadRole: false
        };
        //this.initData = this.initData.bind(this);
    }

    async componentDidMount() {
        this.props.page({current: 1, pageSize: 10});
        await LandIOModel.GetAllBase({companyId: 1}).then((res) => {
            if (res.success) {
                this.setState({
                    baseList: res.data
                });
            }
        });
        await this.props.Alldatas({companyId: 1, startPage: 1, limit: 10});
        this.props.superiorName({name: '产量分析', parentLeftID: -1});
    }

    componentWillReceiveProps(nextProps) {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'yieldanalysis_listByPage', 'show');
        if (queryRole) {
            this.initData(nextProps.cropYield, nextProps.gradeYield);
        }
    }

    async setBaseName(event) {  //查找的表单-基地名称
        this.setState({
            base: event
        });
        if (event) {
            if (event === -1) {
                event = '';
            }
            await IOModel.GetLandByBaseId({":baseId": event}).then((res) => {
                if (res.success) {
                    this.setState({
                        landList: res.data
                    });
                }
            });
            await this.query();
        } else {
            this.setState({
                landList: []
            }, () =>  {
                this.props.Alldatas({companyId: 1, startPage: 1, limit: 10});
            });
        }
        this.setState({
            land: -1,
            crops: -1
        });
    }

    async setLandName(event) {  //查找的表单-基地名称
        await this.setState({
            land: event
        });
        await this.query();
    }

    async setCropsName(event) {  //查找的表单-基地名称
        await this.setState({
            crops: event
        });
        await this.query();
    }

    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            companyId: 1,
            baseId: this.state.base === -1 ? undefined : this.state.base,
            landId: this.state.land === -1 ? undefined : this.state.land,
            cropId: this.state.crops === -1 ? undefined : this.state.crops,
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
            baseId: this.state.base === -1 ? undefined : this.state.base,
            landId: this.state.land === -1 ? undefined : this.state.land,
            cropId: this.state.crops === -1 ? undefined : this.state.crops,
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
            baseId: this.state.base === -1 ? undefined : this.state.base,
            landId: this.state.land === -1 ? undefined : this.state.land,
            cropId: this.state.crops === -1 ? undefined : this.state.crops,
            startPage: 1,
            limit: size
        };
        this.props.queryAll(vm);
    }

    onchooseChange(current, size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
    }

    downloadAnalysis() {
        console.log("下载分析详情");
    }

    //饼图生成
    initData(cropYield, gradeYield) {
        /* global echarts:true */
        const titleCrop = [];
        const dataCrop = [];
        cropYield.forEach((item) => {
            const obj = {
                value: item.cropYield,
                name: item.cropName
            };
            titleCrop.push(item.cropName);
            dataCrop.push(obj);
        });
        const titleGrade = [];
        const dataGrade = [];
        gradeYield.forEach((item) => {
            const obj = {
                value: item.gradeYield,
                name: item.gradeName
            };
            titleGrade.push(item.gradeName);
            dataGrade.push(obj);
        });
        const YieldBarChart = echarts.init(this.el);
        const GradeBarChart = echarts.init(this.el_2);
        // 绘制图表
        YieldBarChart.setOption({
            title: {
                text: dataCrop.length ? `${dataCrop[0].value}` : '',
                subtext: dataCrop.length ? dataCrop[0].name : '',
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
                y: '1%',
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 16,
                textStyle: {
                    fontSize: 12
                },
                data: titleCrop,
                formatter: function (name) {
                    if (dataCrop.length) {
                        for (let i = 0; i < dataCrop.length; i++) {
                            if (dataCrop[i].name === name) {
                                return `${name}${dataCrop[i].value}`;
                            }
                        }
                    }
                }
            },
            color: ['#9cd0a0', '#8785ce', '#edc878', '#CB8CCE'],
            series: [
                {
                    name: '产量明细',
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
                    data: dataCrop
                }
            ]
        });
        GradeBarChart.setOption({
            title: {
                text: dataGrade.length ? `${dataGrade[0].value}` : '',
                subtext: dataGrade.length ? dataGrade[0].name : '',
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
                data: titleGrade,
                formatter: function (name) {
                    if (dataGrade.length) {
                        for (let i = 0; i < dataGrade.length; i++) {
                            if (dataGrade[i].name === name) {
                                return `${name}${dataGrade[i].value}`;
                            }
                        }
                    }
                }
            },
            color: ['#9cd0a0', '#8785ce', '#edc878', '#CB8CCE'],
            series: [
                {
                    name: '等级占比',
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
                    data: dataGrade
                }
            ]
        });
        YieldBarChart.on('mouseover', function (e) {
            YieldBarChart.setOption({
                title: {
                    text: e.value,
                    subtext: e.name
                }
            });
            YieldBarChart.dispatchAction({
                type: 'highlight',
                dataIndex: e.dataIndex
            });

        });
        YieldBarChart.on('mouseout', function (e) {
            YieldBarChart.dispatchAction({type: 'highlight', dataIndex: e.dataIndex});
        });
        YieldBarChart.dispatchAction({type: 'highlight', seriesIndex: 0, dataIndex: 0});
        GradeBarChart.on('mouseover', function (e) {
            GradeBarChart.setOption({
                title: {
                    text: e.value,
                    subtext: e.name
                }
            });
            GradeBarChart.dispatchAction({
                type: 'highlight',
                dataIndex: e.dataIndex
            });

        });
        GradeBarChart.on('mouseout', function (e) {
            GradeBarChart.dispatchAction({type: 'highlight', dataIndex: e.dataIndex});
        });
        GradeBarChart.dispatchAction({type: 'highlight', seriesIndex: 0, dataIndex: 0});
    }

    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'yieldanalysis_listByPage', 'show');
        const downloadRole = Com.hasRole(securityKeyWord, 'yieldanalysis_download', 'download');
        const {queryFlag, baseList, landList} = this.state;
        const {Alldate, cropList} = this.props;
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
        const baseOptions = Utils.getOptionList(newBaseList);
        const landOptions = Utils.getOptionList(newLandList);
        const cropsOptions = Utils.getOptionList(newCropList);
        return (
            <div className='farming-box asset'>
                <div className='farming-search'>
                    <div className='assetsmgmt-search'>
                        <div className='farming-title plantingmgmt-title'>
                                <div className='title'>产量分析</div>
                            <div className='search-layout'>
                                <div className='search-row'>
                                    <div className='search-col'>
                                        <span className='label-title'>基地名称</span>
                                        <Select value={this.state.base}
                                                onChange={this.setBaseName.bind(this)}
                                                showSearch
                                                placeholder="请选择基地名称"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                            {baseOptions}
                                        </Select>
                                    </div>
                                    <div className='search-col'>
                                        <span className='label-title'>地块名称</span>
                                        <Select value={this.state.land}
                                                onChange={this.setLandName.bind(this)}
                                                showSearch
                                                placeholder="请选择地块名称"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                            {landOptions}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='yield-content'>
                    {queryRole ? <Row className="gutter-content-row" gutter={16}>
                        <Col className="gutter-row gutter-left" span={12}>
                            <div className="gutter-box">
                                <p className='chart-title'><i
                                    className='iconfont icon-shouruzhanbi'></i><span className='yield-ratio echart-span'>产量占比</span></p>
                                <div id="YieldBar" className='yield-analysis-echarts' ref={el => (this.el = el)}
                                     style={{width: '100%', height: '320px', position: 'relative'}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row gutter-right" span={12}>
                            <div className="gutter-box">
                                <p className='chart-title'><i className='iconfont icon-dengji'></i><span className='echart-span'>等级占比</span></p>
                                <div id="GradeBar" className='yield-analysis-echarts' ref={el => (this.el_2 = el)}
                                     style={{width: '100%', height: '320px', position: 'relative'}}/>
                            </div>
                        </Col>
                    </Row> : <div></div>}
                    <div className='content yield-analysis-connent'>
                        <div className='table-header'>
                            <p><i className='iconfont icon-sort'></i><span>成本明细</span></p>
                            <div className='yield-analysis-col'>
                                <span className='label-title'>作物品种</span>
                                <Select value={this.state.crops}
                                        onChange={this.setCropsName.bind(this)}
                                        showSearch
                                        placeholder="请选择作物品种"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                    {cropsOptions}
                                </Select>
                            </div>
                            {downloadRole && <div className='hidden-content yield-analysis-download-con'
                                                  onClick={this.downloadAnalysis.bind(this)}>
                                <Icon
                                    type="download" className='icon_down'/>下载
                            </div>}
                        </div>
                        {queryRole && <Tables bordered rowKey={record => record.id} data={Alldate}
                                              base={this.state.base} land={this.state.land} crops={this.state.crops}
                                              onSizeChangequery={this.onSizeChangequery.bind(this)}
                                              onShowSizeChange={this.onShowSizeChange.bind(this)}
                                              onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {cropList, cropYield, gradeYield, Alldate, slideName} = state.yieldAnalysisNewReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['yieldanalysis_listByPage', 'yieldanalysis_download'];
    return {
        cropList,
        gradeYield,
        cropYield,
        Alldate,
        slideName, securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
