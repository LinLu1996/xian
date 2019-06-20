/* global echarts:true */

import {Component} from 'react';
import {Icon, Row, Col, Progress, Table, Select, Pagination,LocaleProvider} from 'antd';
import Tables from './table.jsx';
import Com from '@/component/common';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import '../../index.less';
import './index.less';
import React from "react";
import {LandIOModel} from "@/pages/masterdata/land/model";
import Utils from "@/pages/plantingmgmt/farmingplan/util";

const Option = Select.Option;
class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            baseList: [],
            landList: [],
            flag: false,
            base: '',//基地名称
            crop: '',
            land: '',//地块名称
            cropList: [],//作物品种名称
            queryFlag: true, //筛选按钮
            queryCropFlag: true,
            queryLandFlag: true,
            currentIndex: 1,
            activeNav: 0,
            queryRole: false,
            downloadRole: false
        };
        this.greenhouseCol = [
            {
                title: '排名',
                dataIndex: 'key',
                key: 'key',
                width:100,
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '地块',
                dataIndex: 'name',
                align: "left"
            }, {
                title: '数量',
                dataIndex: 'num',
                align: "right",
                width: 100
            }, {
                title: '占比',
                dataIndex: 'per',
                align: "center",
                render: (record) => {
                    return (
                        <div style={{width: '100%'}}>
                            <Progress strokeWidth={6} showInfo={true} percent={Number(record)}
                                      format={percent => `${percent}%`}/>
                        </div>
                    );
                }
            }];
        this.varietiesCol = [
            {
                title: '排名',
                dataIndex: 'key',
                key: 'key',
                width:100,
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '作物',
                dataIndex: 'name',
                align: "left"
            }, {
                title: '数量',
                dataIndex: 'num',
                align: "right",
                width: 100
            }, {
                title: '占比',
                dataIndex: 'per',
                align: "center",
                render: (record) => {
                    return (
                        <div style={{width: '100%'}}>
                            <Progress strokeWidth={6} showInfo={true} percent={Number(record)}
                                      format={percent => `${percent}%`}/>
                        </div>
                    );
                }
            }
        ];
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
        await IOModel.getCrops().then((res) => {
            if (res.success && res.data.length > 0) {
                this.setState({
                    cropList: res.data
                });
            } else {
                this.setState({
                    cropList: []
                });
            }
        });
        //请求接口渲染地块和作物
        await this.props.Alldatas({companyId: 1, startPage: 1, limit: 10, type: this.state.activeNav});  //进入页面请求列表数据
        this.props.superiorName({name: '资产概况', parentLeftID: -1});
    }

    componentWillReceiveProps(nextProps) {
        // 地块占比
        const landList = [];
        if ((nextProps.used + nextProps.free) !== 0) {
            const used = {};
            const free = {};
            const usedTip = {};
            const freeTip = {};
            const usedPer = Math.round(nextProps.used / (nextProps.used + nextProps.free) * 100);
            const freePer = Math.round(nextProps.free / (nextProps.free + nextProps.used) * 100);
            used.name = '使用中';
            used.value = usedPer;
            free.name = '闲置中';
            free.value = freePer;
            usedTip.name = '使用中';
            usedTip.value = nextProps.used;
            freeTip.name = '闲置中';
            freeTip.value = nextProps.free;
            landList.push(used);
            landList.push(free);
            landList.push(usedTip);
            landList.push(freeTip);
        }
        // 作物大类占比
        const category = nextProps.category;
        const categoryList = [];
        if (category && category.length > 0) {
            for (let i = 0; i < category.length; i++) {
                const cate = {};
                cate.name = category[i].categoryName;
                cate.value = category[i].lands;
                categoryList.push(cate);
            }
        }
        // 作物占比
        const crop = nextProps.crop;
        const cropList = [];
        if (crop && crop.length > 0) {
            for (let i = 0; i < crop.length; i++) {
                const cr = {};
                cr.name = crop[i].cropName;
                cr.value = crop[i].lands;
                cropList.push(cr);
            }
        }
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'assetsoverview_listByPage', 'show');
        if (queryRole) {
            this.initData(landList, categoryList, cropList);
        }
    }

    async setBaseName(event) {  //查找的表单-基地名称
        await this.setState({
            landList: [],
            base: event
        });
        if (event !== undefined) {
            IOModel.getLandsByBaseId({":baseId": event}).then((res) => {
                if (res.success && res.data.length > 0) {
                    this.setState({
                        landList: res.data
                    });
                } else {
                    this.setState({
                        landList: []
                    });
                }
            });
        } else {
            this.setState({
                landList: []
            });
        }
        const vm = {
            companyId: 1,
            baseId: this.state.base,
            landId: this.state.land,
            cropId: this.state.crop,
            type: this.state.activeNav,
            startPage: 1,
            limit: 10
        };
        this.props.queryAll(vm);
        this.setState({
            crop: '',
            land: ''
        });
    }

    async setCropName(event) {  //查找的表单-基地名称
        await this.setState({
            crop: event
        });
        this.queryData();
    }

    async setLandName(value) {  //查找的表单-基地名称
        await this.setState({
            land: value
        });
        this.queryData();
    }

    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            companyId: 1,
            baseId: this.state.base,
            type: this.state.activeNav,
            startPage: 1,
            limit: 10
        };
        this.props.queryType(vm);
        //this.props.page({current: 1, pageSize: 10});
    }
    queryData() {
        this.setState({
            queryFlag: true
        });
        const vm = {
            companyId: 1,
            baseId: this.state.base,
            landId: this.state.land,
            cropId: this.state.crop,
            startPage: 1,
            limit: 10
        };
        this.props.queryData(vm);
        this.props.page({current: 1, pageSize: 10});
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            companyId: 1,
            baseId: this.state.base,
            landId: this.state.land,
            cropId: this.state.crop,
            startPage: current,
            limit: size
        };
        this.props.queryDetail(vm);
    }
    onShowSizeChangeMoney(current, size) {  //点击筛选的分页按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            companyId: 1,
            baseId: this.state.base,
            landId: this.state.land,
            cropId: this.state.crop,
            startPage: 1,
            limit: size
        };
        this.props.queryDetail(vm);
    }
    onLandChangequery(current, size) {
        this.setState({
            queryLandFlag: true //控制分页的展示
        });
        const vm = {
            companyId: 1,
            baseId: this.state.base,
            startPage: current,
            limit: size
        };
        this.props.landPage({current:current, pageSize: size});
        this.props.queryLand(vm);
    }
    onShowSizeChange(current, size) {
        this.setState({
            queryLandFlag: true //控制分页的展示
        });
        const vm = {
            companyId: 1,
            baseId: this.state.base,
            startPage: 1,
            limit: size
        };
        this.props.landPage({current:1, pageSize: size});
        this.props.queryLand(vm);
    }
    onCropChangequery(current, size) {
        this.setState({
            queryCropFlag: true //控制分页的展示
        });
        const vm = {
            companyId: 1,
            baseId: this.state.base,
            startPage: current,
            limit: size
        };
        this.props.cropPage({current:current, pageSize: size});
        this.props.queryCrop(vm);
    }
    onShowSizeChangeCrop(current, size) {
        this.setState({
            queryCropFlag: true //控制分页的展示
        });
        const vm = {
            companyId: 1,
            baseId: this.state.base,
            startPage: 1,
            limit: size
        };
        this.props.cropPage({current:1, pageSize: size});
        this.props.queryCrop(vm);
    }

    onchooseChange(current, size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
    }

    downloadAnalysis() {
        console.log("下载分析详情");
    }

    getOption(seriesData, pieIndex) {
        let title = '';
        if (pieIndex === 1) {
            title = '地块占比';
        }
        if (pieIndex === 2) {
            title = '资产占比';
        }
        if (pieIndex === 3) {
            title = '品种占比';
        }
        // const labelFromatter = {
        //     normal: {
        //         label: {
        //             formatter: function (params) {
        //                 return `${params.value}%\n${params.name}`;
        //             },
        //             textStyle: {
        //                 baseline: 'top'
        //             }
        //         }
        //     }
        // };
        // const labelBottom = {
        //         normal: {
        //             formatter: '{d} %',
        //             textStyle: {
        //                 fontSize: 14
        //             }
        //         }
        // };
        const copySeriesData = [];
        if (seriesData.length) {
            let count = 0;
            seriesData.forEach((item) => {
                if (count > 1) {
                    copySeriesData.push(item);
                } else {
                    count++;
                }
            });
        }
        const lengendList = [];
        if (pieIndex === 1 && seriesData.length) {
            let count = 0;
            seriesData.forEach((item) => {
                if (count > 1) {
                    const obj = {
                        value: item.value,
                        name: item.name,
                        icon: 'circle'
                    };
                    lengendList.push(obj);
                } else {
                    count++;
                }
            });
        } else if (seriesData.length) {
            seriesData.forEach((item) => {
                const obj = {
                    value: item.value,
                    name: item.name,
                    icon: 'circle'
                };
                lengendList.push(obj);
            });
        }
        const dataNew = [];
        if (pieIndex === 1 && seriesData.length) {
            let count = 0;
            seriesData.forEach((item) => {
                if (count > 1) {
                    const obj = {
                        value: item.value,
                        name: item.name
                    };
                    dataNew.push(obj);
                } else {
                    count++;
                }
            });
            seriesData = dataNew;
        } else if (seriesData.length) {
            seriesData.forEach((item) => {
                const obj = {
                    value: item.value,
                    name: item.name
                };
                dataNew.push(obj);
            });
            seriesData = dataNew;
        }
        const colorList = ['#9cd0a0', '#8785ce', '#edc878', '#CB8CCE'];
        const label1 = {
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
        };
        const opitons = {
            color: colorList,
            title: {
                text: seriesData.length ? (pieIndex === 1 ? `${copySeriesData[0].value}` : `${seriesData[0].value}`) : '',
                subtext: seriesData.length ? (pieIndex === 1 ? `${copySeriesData[0].name}` : `${seriesData[0].name}`) : '',
                x: 'center',
                y: 'center',
                textStyle: {
                    color: colorList[0],
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
                x: 'left',
                y: '5%',
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 16,
                textStyle: {
                    fontSize: 12
                },
                data: lengendList,
                formatter: function (name) {
                    if (lengendList.length) {
                        for (let i = 0; i < lengendList.length; i++) {
                            if (lengendList[i].name === name) {
                                return `${name}${lengendList[i].value}`;
                            }
                        }
                    }
                }
            },
            series: [
                {
                    name: title,
                    type: 'pie',
                    clockWise: true, // 顺时针
                    radius: ['60%', '84%'],
                    center: ['50%', '50%'],
                    // itemStyle: labelFromatter,
                    // selectedMode: 'single',
                    // selectedOffset: 10,   //选中是扇区偏移量
                    avoidLabelOverlap: false,
                    itemStyle: {
                        normal: {
                            label: {show: false},
                            labelLine: {show: false}
                        }
                    },
                    label: label1,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: pieIndex === 1 ? copySeriesData : seriesData
                }
            ]
        };
        return opitons;
    }

    //饼图生成
    initData(landList, categoryList, cropList) {
        /* global echarts:true */
        const YieldBarChart = echarts.init(this.el);
        const GradeBarChart = echarts.init(this.el_2);
        const KindChart = echarts.init(this.el_3);
        // 绘制图表
        YieldBarChart.setOption(this.getOption(landList, 1));
        GradeBarChart.setOption(this.getOption(categoryList, 2));
        KindChart.setOption(this.getOption(cropList, 3));
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

        KindChart.on('mouseover', function (e) {
            KindChart.setOption({
                title: {
                    text: e.value,
                    subtext: e.name
                }
            });
            KindChart.dispatchAction({
                type: 'highlight',
                dataIndex: e.dataIndex
            });

        });
        KindChart.on('mouseout', function (e) {
            KindChart.dispatchAction({type: 'highlight', dataIndex: e.dataIndex});
        });

        YieldBarChart.dispatchAction({type: 'highlight', seriesIndex: 0, dataIndex: 0});
        GradeBarChart.dispatchAction({type: 'highlight', seriesIndex: 0, dataIndex: 0});
        KindChart.dispatchAction({type: 'highlight', seriesIndex: 0, dataIndex: 0});

    }

    // 点击菜单事件
    async handleChangeNav(index) {
        await this.setState({
            activeNav: index
        });
        //重新请求数据
        await this.query();
    }

    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'assetsoverview_listByPage', 'show');
        //const downloadRole = Com.hasRole(securityKeyWord, 'assetsoverview_download');
        const {queryFlag, baseList, landList, cropList} = this.state;
        const {Alldate, landAndArea, cropAndYield, landAndAreaTotal, landAndAreaCur, cropAndYieldTotal, cropAndYieldCur} = this.props;
        const newBaseList = [];
        const newLandList = [];
        const newCropList = [];
        newBaseList.push({id: '', name: '全部'});
        baseList.forEach((item) => {
            newBaseList.push(item);
        });
        newLandList.push({id: '', name: '全部'});
        landList.forEach((item) => {
            newLandList.push(item);
        });
        newCropList.push({id: '', name: '全部'});
        cropList.forEach((item) => {
            newCropList.push(item);
        });
        const baseOptions = Utils.getOptionList(newBaseList);
        const nav = [
            {
                'key': 0,
                'title': '地块数量',
                'url': '/'
            },
            {
                'key': 1,
                'title': '种植面积',
                'url': '/'
            }
        ];
        return (
            <div className='farming-box asset'>
                <div className='chart-con'>
                    <div className='asset-nav farming-search'>
                        <div className='title'>资产概况</div>
                        <div className='title-serch'>
                            <div className='assetsmgmt-search'>
                                <div className='search-layout'>
                                    <div className='search-row'>
                                        <div className='search-col'>
                                            <span className='label-title'>基地</span>
                                            <Select value={this.state.base}
                                                    onChange={this.setBaseName.bind(this)}
                                                    showSearch
                                                    placeholder="请选择基地"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                                {baseOptions}
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {queryRole && <div className='nav-ul'>
                            <ul>
                                {nav.map((item, index) => {
                                    return <li key={index}
                                               className={item.key === this.state.activeNav ? 'active-nav' : ''}
                                               onClick={this.handleChangeNav.bind(this, index)}><Icon
                                        type={index === 0 ? "pie-chart" : "appstore-o"}/><span>{item.title}</span></li>;
                                })}
                            </ul>
                        </div>}
                    </div>
                    {queryRole ? <Row gutter={16}>
                        <Col className="gutter-row" span={12} style={{padding:'0 10px'}}>
                            <div className="gutter-box">
                                <p className='chart-title'><i className='iconfont icon-dapeng'></i><span>地块占比</span></p>
                                <div id="YieldBar" className='asset-analysis-echarts' ref={el => (this.el = el)}
                                     style={{width: '100%', height: '320px', position: 'relative'}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={12} style={{padding:'0 10px'}}>
                            <div className="gutter-box">
                                <p className='chart-title'><i className='iconfont icon-zichan'></i><span>资产占比</span></p>
                                <div id="GradeBar" className='asset-analysis-echarts' ref={el => (this.el_2 = el)}
                                     style={{width: '100%', height: '320px', position: 'relative'}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={12} style={{padding:'0 10px'}}>
                            <div className="gutter-box" style={{margin : '20px 0 0 0'}}>
                                <p className='chart-title'><i
                                    className='iconfont icon-pinzhongzhanbi'></i><span>品种占比</span></p>
                                <div id="GradeBar" className='asset-analysis-echarts' ref={el => (this.el_3 = el)}
                                     style={{width: '100%', height: '320px', position: 'relative'}}/>
                            </div>
                        </Col>
                    </Row> : <div></div>}
                    {queryRole && <div className='content asset-analysis-connent' style={{margin: '0'}}>
                        <Row gutter={16} className='table-row'>
                            <Col className="gutter-row" span={12} style={{padding:'0 10px'}}>
                                <div className="gutter-box">
                                    <p className='chart-title'><i className='iconfont icon-sort'></i><span>资产分布-地块分布</span></p>
                                   <div>
                                        <div className='two-table res-table three-table'>
                                            <LocaleProvider locale={zhCN}>
                                                <Table bordered  className='asset-analysis-td' rowKey={record => record.key}
                                                       columns={this.greenhouseCol}
                                                       dataSource={landAndArea}
                                                       pagination={false}/>
                                            </LocaleProvider>
                                        </div>
                                        {
                                            <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onLandChangequery.bind(this)} current={landAndAreaCur} defaultCurrent={1}  total={landAndAreaTotal} /></LocaleProvider>
                                            // <Pagination className='res-pagination asset' defaultCurrent={1} current={landAndAreaCur} total={landAndAreaTotal}
                                            //                           onChange={this.onLandChangequery.bind(this)}
                                            // />
                                        }
                                    </div>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={12} style={{padding:'0 10px'}}>
                                <div className="gutter-box">
                                    <p className='chart-title'><i className='iconfont icon-sort'></i><span>资产分布-品种分布</span></p>
                                    <div>
                                        <div className='two-table res-table'>
                                            <LocaleProvider locale={zhCN}>
                                                <Table bordered  className='asset-analysis-td' rowKey={record => record.key}
                                                       columns={this.varietiesCol}
                                                       dataSource={cropAndYield} pagination={false}/>
                                            </LocaleProvider>
                                        </div>
                                        {
                                            <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChangeCrop.bind(this)}  onChange={this.onCropChangequery.bind(this)} current={cropAndYieldCur} defaultCurrent={1}  total={cropAndYieldTotal} /></LocaleProvider>
                                            // <Pagination className='res-pagination asset' defaultCurrent={1} current={cropAndYieldCur} total={cropAndYieldTotal}
                                            //                                      onChange={this.onCropChangequery.bind(this)}
                                            // />
                                        }
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className='table-header -header' style={{margin:'0px 0 0 0'}}>
                            <p><i className='iconfont icon-zichanmingxi'></i><span>资产明细</span></p>
                           {<div className='asset-search'>
                                <div className='search-col'>
                                    <span className='label-title'>作物名称</span>
                                    <Select className='asset-select' value={this.state.crop}
                                            onChange={this.setCropName.bind(this)}
                                            showSearch
                                            placeholder="请选择作物名称"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {newCropList.map((item) => {
                                            return <Option key={item.id} value={item.id}>{item.name}</Option>;
                                        })}
                                    </Select>
                                </div>
                                <div className='search-col'>
                                    <span className='label-title'>地块</span>
                                    <Select className='asset-select' value={this.state.land}
                                            onChange={this.setLandName.bind(this)}
                                            showSearch
                                            placeholder="请选择地块"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {newLandList.map((item) => {
                                            return <Option key={item.id} value={item.id}>{item.name}</Option>;
                                        })}
                                    </Select>
                                </div>
                            </div>}
                        </div>
                        <Tables bordered data={Alldate} rowKey={record => record.key}
                                onSizeChangequery={this.onSizeChangequery.bind(this)}
                                onShowSizeChangeMoney={this.onShowSizeChangeMoney.bind(this)}
                                onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>
                    </div>}
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {cropYield, cropAndYieldCur, cropAndYieldTotal, landAndAreaCur, landAndAreaTotal, gradeYield, Alldate, slideName, ListData, used, free, category, crop, landAndArea, cropAndYield} = state.assetProfileReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['assetsoverview_listByPage', 'assetsoverview_download'];
    return {
        gradeYield,
        cropYield,
        Alldate,
        slideName,
        ListData,
        used,
        free,
        category,
        crop,
        landAndArea,
        landAndAreaTotal,
        landAndAreaCur,
        cropAndYield,
        cropAndYieldTotal,
        cropAndYieldCur,
        securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
