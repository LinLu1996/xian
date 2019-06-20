/* global echarts:true */

import {Component} from 'react';
import {Icon, Input, Row, Col, Progress, Table, Select, Tooltip} from 'antd';
import Tables from './table.jsx';

const Search = Input.Search;
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import './../index.less';
import './index.less';
import React from "react";
import {LandIOModel} from "@/pages/masterdata/land/model";
import Utils from "@/pages/plantingmgmt/farmingplan/util";


class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            baseList: [],
            landList: [],
            flag: false,
            base: '',//基地名称
            land: '',//地块名称
            crops: '',//作物品种名称
            queryFlag: false, //筛选按钮
            yieldList: ['脆梨', '千玉一号', '千玉二号'],
            gradeList: ['一级果', '二级果', '三级果'],
            currentIndex: 1,
            yielddata: [
                {value: 560, name: '脆梨'},
                {value: 220, name: '千玉一号'},
                {value: 480, name: '千玉二号'}
            ],
            gradedata: [
                {value: 560, name: '一级果'},
                {value: 220, name: '二级果'},
                {value: 480, name: '三级果'}
            ],
            activeNav: 0
        };
        this.greenhouseCol = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width:90,
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '地块',
                dataIndex: 'landName',
                align: "left",
                width:289,
                render: (text) => {
                    return <Tooltip title={text}><span style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>{text}</span></Tooltip>;
                }
            }, {
                title: '数量',
                dataIndex: 'num',
                align:"right",
                width:147,
                render: (text) => {
                    return <Tooltip title={text}><span style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>{text}</span></Tooltip>;
                }
            }, {
                title: '占比',
                dataIndex: 'percent',
                align: "center",
                width:249,
                render: (record) => {
                    return (
                        <div style={{width: '100%'}}>
                            <Progress strokeWidth={4} showInfo={true} percent={Number(record)}
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
                width:90,
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '作物',
                dataIndex: 'crops',
                align: "left",
                width:210,
                render: (text) => {
                    return <Tooltip title={text}><span style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>{text}</span></Tooltip>;
                }
            }, {
                title: '数量',
                dataIndex: 'num',
                align: "right",
                width:187,
                render: (text) => {
                    return <Tooltip title={text}><span style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>{text}</span></Tooltip>;
                }
            }, {
                title: '占比',
                dataIndex: 'percent',
                align: "center",
                width: 249,
                render: (record) => {
                    return (
                        <div style={{width: '100%'}}>
                            <Progress strokeWidth={4} showInfo={true} percent={Number(record)}
                                      format={percent => `${percent}%`}/>
                        </div>
                    );
                }
            }
        ];
    }

    async componentDidMount() {
        await LandIOModel.GetAllBase({companyId: 1}).then((res) => {
            if (res.success) {
                this.setState({
                    baseList: res.data
                });
            }
        });
        await this.props.Alldatas({companyId: 1, startPage: 1, limit: 10});  //进入页面请求列表数据
        await this.props.Listdatas({base: 1});
        this.props.superiorName({name: '农资成本分析', parentLeftID: -1});
    }

    componentWillReceiveProps(nextProps) {
        this.initData(nextProps.ListData.list3, nextProps.ListData.list4, nextProps.ListData.list5);
    }

    setBaseName(event) {  //查找的表单-基地名称
        this.setState({
            base: event
        });
        IOModel.GetLandByBaseId({":baseId": event}).then((res) => {
            if (res.success) {
                this.setState({
                    landList: res.data
                });
            }
        });
    }

    setLandName(event) {  //查找的表单-基地名称
        this.setState({
            land: event
        });
    }

    setCropsName(event) {  //查找的表单-基地名称
        this.setState({
            crops: event
        });
    }

    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            companyId: 1,
            baseId: this.state.base,
            landId: this.state.land,
            cropId: this.state.crops,
            startPage: 1,
            limit: 10
        };
        this.props.queryAll(vm);
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        const vm = {
            companyId: 1,
            userId: 1,
            functionary: this.state.functionary,
            name: this.state.name,
            startPage: current,
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

    getOption(seriesData, pieIndex) {
        let title = '';
        if (pieIndex === 1) {
            title = '大棚占比';
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
        const lengendList = [];
        if (seriesData.length) {
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
        if (seriesData.length) {
            seriesData.forEach((item) => {
                const obj = {
                    value: item.value,
                    name: item.name
                };
                dataNew.push(obj);
            });
            seriesData = dataNew;
        }

        const colorList = ['#9cd0a0', '#8785ce', '#edc878', 'a2a0f7'];
        const opitons = {
            color: colorList,
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
                    clockwise: true,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            formatter: function(param) {
                                return `${param.value}\n${param.name}`;
                            },
                            textStyle: {
                                fontSize: '20'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: seriesData
                }
            ]
        };
        return opitons;
    }

    //饼图生成
    initData(cropYield, gradeYield, list5) {
        /* global echarts:true */
        const dataCrop = [];
        cropYield.forEach((item) => {
            const obj = {
                value: item.cropYield,
                name: item.cropName
            };
            dataCrop.push(obj);
        });
        const dataGrade = [];
        gradeYield.forEach((item) => {
            const obj = {
                value: item.cropYield,
                name: item.cropName
            };
            dataGrade.push(obj);
        });
        const dataKind = [];
        list5.forEach((item) => {
            const obj = {
                value: item.cropYield,
                name: item.cropName
            };
            dataKind.push(obj);
        });
        const YieldBarChart = echarts.init(this.el);
        const GradeBarChart = echarts.init(this.el_2);
        const KindChart = echarts.init(this.el_3);
        // 绘制图表
        YieldBarChart.setOption(this.getOption(dataCrop, 1));
        GradeBarChart.setOption(this.getOption(dataGrade, 2));
        KindChart.setOption(this.getOption(dataKind, 3));
    }

    // 点击菜单事件
    async handleChangeNav(index) {
        await this.setState({
            activeNav: index
        });
        //重新请求数据
    }

    render() {
        const {queryFlag, baseList} = this.state;
        const {Alldate, ListData} = this.props;
        const baseOptions = Utils.getOptionList(baseList);
        const {list1, list2} = ListData;
        const nav = [
            {
                'key': 0,
                'title': '大棚数量',
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
                <div className='title'>资产概况</div>
                <div className='chart-con'>
                    <div className='asset-nav'>
                        <div className='title'>资产总览</div>
                        <div className='title-serch'>
                            <div className='farming-search'>
                                <div className='search-layout'>
                                    <div className='search-row'>
                                        <div className='search-col'>
                                            <span className='label-title'>基地</span>
                                            <Select value={this.state.base} onChange={this.setBaseName.bind(this)}>
                                                {baseOptions}
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='nav-ul'>
                            <ul>
                                {nav.map((item, index) => {
                                    return <li key={index}
                                               className={item.key === this.state.activeNav ? 'active-nav' : ''}
                                               onClick={this.handleChangeNav.bind(this, index)}><Icon
                                        type={index === 0 ? "pie-chart" : "appstore-o"}/><span>{item.title}</span></li>;
                                })}
                            </ul>
                        </div>
                    </div>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={12}>
                            <div className="gutter-box">
                                <p className='chart-title'><Icon type="pie-chart"/><span>大棚占比</span></p>
                                <div id="YieldBar" className='asset-analysis-echarts' ref={el => (this.el = el)}
                                     style={{width: '100%', height: '320px', position: 'relative'}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div className="gutter-box">
                                <p className='chart-title'><Icon type="bank"/><span>资产占比</span></p>
                                <div id="GradeBar" className='asset-analysis-echarts' ref={el => (this.el_2 = el)}
                                     style={{width: '100%', height: '320px', position: 'relative'}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div className="gutter-box">
                                <p className='chart-title'><Icon type="appstore-o"/><span>品种占比</span></p>
                                <div id="GradeBar" className='asset-analysis-echarts' ref={el => (this.el_3 = el)}
                                     style={{width: '100%', height: '320px', position: 'relative'}}/>
                            </div>
                        </Col>
                    </Row>
                    <div className='content asset-analysis-connent'>
                        <Row gutter={16} className='table-row'>
                            <Col className="gutter-row" span={12}>
                                <div className="gutter-box">
                                    <p className='chart-title'>资产分布-大棚分布</p>
                                    <div className='res-table'>
                                        <Table className='asset-analysis-td' rowKey={record => record.key}
                                               columns={this.greenhouseCol}
                                               dataSource={list1}
                                               pagination={false}/>
                                    </div>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <div className="gutter-box">
                                    <p className='chart-title'>资产分布-品种分布</p>
                                    <div className='res-table'>
                                        <Table className='asset-analysis-td' rowKey={record => record.key}
                                               columns={this.varietiesCol}
                                               dataSource={list2} pagination={false}/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className='table-header'>
                            <p><Icon type="profile"/><span>资产明细</span></p>
                            <div className='search-con'>
                                <Search
                                    placeholder="请输入查询内容"
                                    onSearch={value => console.log(value)}
                                    style={{width: 200}}
                                />
                                <div className='download-con' onClick={this.downloadAnalysis.bind(this)}><Icon
                                    type="download" className='icon_down'/>下载
                                </div>
                            </div>
                        </div>
                        <Tables  bordered rowKey={record => record.id} data={Alldate}
                                onSizeChangequery={this.onSizeChangequery.bind(this)}
                                onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {cropYield, gradeYield, Alldate, slideName, ListData} = state.assetProfileReducer;
    return {
        gradeYield,
        cropYield,
        Alldate,
        slideName,
        ListData
    };
};
export default connect(mapStateprops, action)(Resources);
