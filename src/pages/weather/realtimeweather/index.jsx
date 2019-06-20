import {Component} from 'react';
import {Card, Button, Select, message, Row, Col} from 'antd';
import {action} from './model';
import '../../index.less';
import './weather.less';
import connect from "react-redux/es/connect/connect";
import moment from 'moment';
import Com from '@/component/common';

const Option = Select.Option;
import {IOModel} from "./model";

let analyzeChart = null;
const weatherList = [
    {
        'key': 0,
        'title': '气温',
        'url': '/'
    },
    {
        'key': 1,
        'title': '风向风力',
        'url': '/'
    },
    {
        'key': 2,
        'title': '降雨',
        'url': '/'
    },
    {
        'key': 3,
        'title': '相对湿度',
        'url': '/'
    }
];

class WeatherOnline extends Component {
    constructor(props) {
        super(props);
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
        this.state = {
            timeNav: 0, // 0:24小时 1:15天
            showChartsType: 'temperature', // 当前nav
            activeNav: 0,// 当前nav
            currentType: 'line', //默认柱状图
            title: '温度', //echarts title
            baseLand: null,//基地
            workWeatherHistory: {},
            workWeatherTwentyFourHours: [],
            MinAndMax: {},
            hourWindD: [],
            chartData: {
                hourData: [],
                dayData: []
            }, //hourData:24小时  dayData:15天数据
            showCharLoading: false, //echarts loading显示是否
            loadingOption: {
                text: '加载中',
                color: '#6699cc',
                textColor: '#999',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0
            },  //loading 配置
            descriptionDay: [],
            descriptionNight: [],
            fifteenTemperatrueDay: [],
            fifteenTemperatrueNight: [],
            queryRole: false,
            weatherRole: false,
            queryFRole: false,
            weatherIcon:{
                0: 'icon-W',
                1: 'icon-W1',
                2: 'icon-W2',
                3: 'icon-W9',
                4: 'icon-W3',
                5: 'icon-W4',
                6: 'icon-W10',
                7: 'icon-W11',
                8: 'icon-W12',
                9: 'icon-W13',
                10: 'icon-W14',
                13: 'icon-W5',
                14: 'icon-W5',
                15: 'icon-W7',
                16: 'icon-W8',
                17: 'icon-W15',
                18: 'icon-W16',
                19: 'icon-W17',
                20: 'icon-W18',
                29: 'icon-W19',
                30: 'icon-W20',
                31: 'icon-W21',
                32: 'icon-W22',
                33: 'icon-W23',
                34: 'icon-W24',
                35: 'icon-W25',
                36: 'icon-W26',
                44: 'icon-W27',
                45: 'icon-W28',
                46: 'icon-W28'
            }
        };
    }

    getAfterDate() {
        // 未来15天
        const normalList = this.state.descriptionDay;
        if (normalList.length > 0) {
            for (let i = 0; i < this.state.descriptionDay.length; i++) {
                const s = moment().add('days', i).format('MM/DD');
                normalList[i].date = s;
            }
        }
        return normalList;
    }

    getAfterDate1() {
        const normalList = this.state.descriptionNight;
        if (normalList.length > 0) {
            for (let i = 1; i <= this.state.descriptionNight; i++) {
                normalList[i - 1].wind = this.state.descriptionNight[i - 1].wind;
                normalList[i - 1].windState = this.state.descriptionNight[i - 1].windState;
            }
        }
        return normalList;
    }


    componentDidMount() {
        this.handleTime();
        this.props.superiorName({name: '气象', parentLeftID: -1});
        this.props.AllDicPull();
    }

    componentWillUnMount() {
        clearTimeout(this.handleTime.bind(this));
    }

    handleTime() {
        const vWeek = ['周天', '周一', '周二', '周三', '周四', '周五', '周六'];
        const date = new Date();
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = month < 10? `0${month}` : month;
        let day = date.getDate();
        day = day < 10? `0${day}`: day;
        let hour = date.getHours();
        hour = hour <10 ?`0${hour}`:hour;
        let minute = date.getMinutes();
        minute = minute < 10 ? `0${minute}` : minute;
        let second = date.getSeconds();
        if(second < 10) {
            second = `0${second}`;
        }
        const vWeek_s = date.getDay();
        const week = vWeek[vWeek_s];
        let morning = '';
        if (hour <= 12) {
            morning = '上午';
        } else {
            morning = '下午';
        }
        const datess = `${year}-${month}-${day} ${week} ${morning} ${hour}:${minute}:${second}`;
        this.setState({
            now: datess
        });
        setTimeout(this.handleTime.bind(this), 800);
    }

    async componentWillReceiveProps(nextProps) {
        this.baseLandOptions = await nextProps.dicList.length > 0 && this.getOptionList(nextProps.dicList);
        if (nextProps.dicList[0]) {
            await this.setState({
                baseLand: nextProps.dicList[0].id
            });
            await this.query(nextProps.dicList[0].id);
            await this.queryHour(nextProps.dicList[0].id);
        }
    }

    componentDidUpdate() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'realtimeweather_listByPage', 'show');
        const queryFRole = Com.hasRole(securityKeyWord, 'realtimeweather_F_listByPage', 'show');
        if (queryRole || queryFRole) {
            this.showChart(this.state.chartData, this.state.currentType);
        }
    }

    query(baseId) {
        IOModel.getWeatherHistoryByBaseId({":baseId": baseId}).then((res) => {
            if (res.success) {
                this.setState({
                    MinAndMax: res.data.MinAndMax || {},
                    workWeatherHistory: res.data.workWeatherHistory || {}
                });
            } else {
                message.error('查询失败');
            }
        }).catch();
    }

    queryHour(baseId) {
        IOModel.weatherTwentyFourHours({":baseId": baseId}).then((res) => {
            if (res.success) {
                const datas = this.state.chartData;
                datas.hourData = res.data.workWeatherTwentyFourHours;
                this.setState({
                    chartData: datas
                });
                const s = [];
                for (let i = 0; i < datas.hourData.length; i++) {
                    const sa = datas.hourData[i].windDirection;
                    s.push(sa);
                }
                this.setState({
                    hourWindD: s
                });
            } else {
                message.error('查询失败');
            }
        }).catch();
    }

    // componentDidUpdate() {
    //     this.showChart(this.state.chartData, this.state.currentType);
    // }

    showChart(data, currentType) {
        /* global echarts:true */
        analyzeChart = echarts.init(document.getElementById('main'));
        analyzeChart.setOption(this.getOption(data, currentType), true);
        analyzeChart.off('magicTypeChanged');
        analyzeChart.on('magicTypeChanged', this.bindMagicType.bind(this));
    }

    // 柱状图和折线图切换
    bindMagicType(params) {
        const that = this;
        that.setState({
            currentType: params.currentType
        });
        that.showChart(that.state.chartData, params.currentType);
    }

    getOption(data, currentType) {
        let dataList = [];
        const windH = this.state.hourWindD;
        const type = this.state.activeNav;
        const that = this;
        let maxTime = 24;
        if (this.state.timeNav === 1) {
            maxTime = 15;
        }
        for (let i = 0; i < maxTime; i++) {
            dataList.push(i);
        }
        let title = '';
        switch (this.state.activeNav) {
            case 0:
                title = '温度';
                break;
            case 1:
                title = '风向';
                break;
            case 2:
                title = '降雨';
                break;
            case 3:
                title = '湿度';
                break;
        }
        let dataAll = [];
        let arrOld = [];
        let arrNew = [];
        let dataNew = [];
        const hourNow = new Date().getHours();
        if (this.state.currentType === 'line') {
            if (this.state.timeNav === 0) {
                if(data.hourData && data.hourData.length > 0) {
                    dataList = [];
                    dataAll = [];
                    for (let i = 0; i < data.hourData.length; i++) {
                        dataList.push(data.hourData[i].forecastHour);
                        if (this.state.showChartsType === 'temperature') {
                            dataAll.push(data.hourData[i].temperature);
                        } else if (this.state.showChartsType === 'windLevel') {
                            dataAll.push(data.hourData[i].windLevel);
                        } else if (this.state.showChartsType === 'rainfall') {
                            dataAll.push(data.hourData[i].rainfall);
                        } else {
                            dataAll.push(data.hourData[i].humidity);
                        }
                    }
                }
                const dataLine = dataAll;
                arrOld = dataLine.slice(0, hourNow+1);
                arrNew = dataLine.slice(hourNow+1);
                arrNew.fill('-');
                dataNew = [...arrOld, ...arrNew];
            } else {
                dataAll = data.dayData;
                const dataLine1 = dataAll;
                arrOld = dataLine1.slice(0);
                arrOld.fill('-');
                dataNew = arrOld;
            }
        } else {
            if (this.state.timeNav === 0) {
                for (let i = 0; i < data.hourData.length; i++) {
                    if (this.state.showChartsType === 'temperature') {
                        dataAll.push(data.hourData[i].temperature);
                    } else if (this.state.showChartsType === 'windLevel') {
                        dataAll.push(data.hourData[i].windLevel);
                    } else if (this.state.showChartsType === 'rainfall') {
                        dataAll.push(data.hourData[i].rainfall);
                    } else {
                        dataAll.push(data.hourData[i].humidity);
                    }
                }
            } else {
                dataAll = data.dayData;
            }
        }
        let s = "";
        if (this.state.activeNav === 0) {
            s = `当天最高气温${this.state.MinAndMax.maxTemperature || '--'}℃，最低气温${this.state.MinAndMax.minTemperature || '--'}℃`;
        } else if (this.state.activeNav === 1) {
            s = `当天最大风级${this.state.MinAndMax.maxWindLevel || '--'}级，最小风级${this.state.MinAndMax.minWindLevel || '--'}级`;
        } else if (this.state.activeNav === 2) {
            s = `当天均降雨量${this.state.MinAndMax.sumRainfall || '--'}mm`;
        } else {
            s = `当天平均湿度${this.state.MinAndMax.avgHumidity || '--'}%`;
        }
        const optionLine = {
            title: {
                text: s,
                x:20,
                y:10,
                textStyle: {
                  color: '#7c807e',
                    fontWeight:null,
                  fontSize: 14
                }
            },
            grid:{
                x: 20,
                y :60,
                x2:0,
                y2:0,
                containLabel:true
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#fff',
                textStyle: {
                    color: '#999'
                },
                axisPointer: {
                    lineStyle: {
                        color: '#999',
                        type: 'dotted'
                    }
                },
                extraCssText: 'box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.2);',
                padding: 10,
                formatter: function (params) {
                    let htmlStr = '';
                    const valMap = {};
                    for (let i = 0; i < params.length; i++) {
                        const param = params[i];
                        const xName = param.name;//x轴的名称
                        const seriesName = param.seriesName;//图例名称
                        const value = param.value;//y轴
                        let unit = '', timeUnit = '';
                        if (that.state.activeNav === 0) unit = '℃';
                        if (that.state.activeNav === 1) unit = '级';
                        if (that.state.activeNav === 2) unit = 'mm';
                        if (that.state.activeNav === 3) unit = '%';
                        if (that.state.timeNav === 0) {
                            timeUnit = '点';
                        } else {
                            timeUnit = '天';
                        }
                        //过滤无效值
                        if (value === '-') {
                            continue;
                        }
                        //过滤重叠值
                        if (valMap[seriesName] === value) {
                            continue;
                        }
                        const windDE = windH[xName - 1];
                        if (i === 0 && type === 1) {
                            htmlStr += `<div>${xName}${timeUnit}-${seriesName}${windDE}<br/><div style="color: #8583cc;margin-top: 5px">${value}${unit}</div></div>`;
                        } else {
                            htmlStr += `<div>${xName}${timeUnit}-${seriesName}<br/><div style="color: #8583cc;margin-top: 5px">${value}${unit}</div></div>`;
                        }
                        valMap[seriesName] = value;
                    }
                    return htmlStr;
                }
            },
            toolbox: {
                right: '1%',
                top: '1%',
                feature: {
                    magicType: {
                        show: true, type: ['line', 'bar']
                        // iconStyle: {
                        //     normal: {
                        //         borderColor: '#ef3c4b'
                        //     }
                        // }
                    }
                    ,
                    saveAsImage: {
                        show: true
                    }
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: dataList,
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#333'
                        }
                    }
                }
            ],
            yAxis: [{
                type: 'value',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#eee'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#333'
                    }
                }
            }
            ],
            series: [
                {
                    name: title,
                    type: 'line',
                    stack: 'lineOne',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#8583CC',
                            lineStyle: {
                                width: 1,
                                type: 'dotted', //'dotted'虚线 'solid'实线
                                color: '#8583CC'
                            }
                        }
                    },
                    data: dataAll
                },
                {
                    name: title,
                    type: 'line',
                    stack: 'lineTwo',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#8583CC',
                            lineStyle: {
                                width: 1,
                                type: 'solid', //'dotted'虚线 'solid'实线
                                color: '#8583CC'
                            }
                        }
                    },
                    data: dataNew
                }
            ]
        };
        const optionBar = {
            title: {
                x:20,
                y:10,
                text: s
            },
            grid:{
                x: 20,
                y :60,
                x2:0,
                y2:0,
                containLabel:true
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#fff',
                textStyle: {
                    color: '#999'
                },
                extraCssText: 'box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.2);',
                padding: 10,
                formatter: function (params) {
                    let htmlStr = '';
                    const valMap = {};
                    for (let i = 0; i < params.length; i++) {
                        const param = params[i];
                        const xName = param.name;//x轴的名称
                        const seriesName = param.seriesName;//图例名称
                        const value = param.value;//y轴
                        let unit = '', timeUnit = '';
                        if (that.state.activeNav === 0) unit = '℃';
                        if (that.state.activeNav === 1) unit = '级';
                        if (that.state.activeNav === 2) unit = 'cm';
                        if (that.state.activeNav === 3) unit = '%';
                        if (that.state.timeNav === 0) {
                            timeUnit = '点';
                        } else {
                            timeUnit = '天';
                        }
                        //过滤无效值
                        if (value === '-') {
                            continue;
                        }
                        //过滤重叠值
                        if (valMap[seriesName] === value) {
                            continue;
                        }
                        const windDE = windH[xName - 1];
                        if (i === 0 && type === 1) {
                            htmlStr += `<div>${xName}${timeUnit}-${seriesName}${windDE}<br/><div style="color: #8583cc;margin-top: 5px">${value}${unit}</div></div>`;
                        } else {
                            htmlStr += `<div>${xName}${timeUnit}-${seriesName}<br/><div style="color: #8583cc;margin-top: 5px">${value}${unit}</div></div>`;
                        }
                        valMap[seriesName] = value;
                    }
                    return htmlStr;
                }
            },
            toolbox: {
                right: '1%',
                top: '1%',
                feature: {
                    magicType: {
                        show: true, type: ['line', 'bar']
                    }
                    ,
                    saveAsImage: {
                        show: true
                    }
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: dataList,
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#333'
                        }
                    }
                }
            ],
            yAxis: [{
                type: 'value',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#eee'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#333'
                    }
                }
            }
            ],
            series: [
                {
                    name: title,
                    type: 'bar',
                    stack: 'temperature',
                    barWidth: 8,
                    itemStyle: {
                        normal: {
                            color: '#8583CC',
                            lineStyle: {
                                width: 1,
                                type: 'solid', //'dotted'虚线 'solid'实线
                                color: '#8583CC'
                            }
                        }
                    },
                    data: dataAll
                }
            ]
        };
        switch (this.state.activeNav) {
            case 0:
                if (currentType === 'line') {
                    return optionLine;
                }
                return optionBar;
            case 1:
                if (currentType === 'line') {
                    return optionLine;
                }
                return optionBar;
            case 2:
                if (currentType === 'line') {
                    return optionLine;
                }
                return optionBar;
            case 3:
                if (currentType === 'line') {
                    return optionLine;
                }
                return optionBar;
        }

    }

    // 点击四个菜单事件
    handleChangeNav(index) {
        this.setState({
            activeNav: index
        });
        if (index === 0) {
            this.setState({
                showChartsType: 'temperature'
            });
        } else if (index === 1) {
            this.setState({
                showChartsType: 'windLevel'
            });
        } else if (index === 2) {
            this.setState({
                showChartsType: 'rainfall'
            });
        } else {
            this.setState({
                showChartsType: 'humidity'
            });
        }
        this.showChart(this.state.chartData, this.state.currentType);
    }

    // 选择基地
    async onBaseLandChange(val) {
        this.setState({
            baseLand: val
        });
        await this.setState({
            baseLand: val
        });
        await this.query(val);
        await this.queryHour(val);
        const s = [];
        for (let i = 0; i < this.props.dicList.length; i++) {
            await s.push(this.props.dicList[i].windDirection);
        }
        this.setState({
            hourWindD: s
        });
        await this.showChart(this.state.chartData, this.state.currentType);

    }


    handleChange(targetKeys) {
        this.setState({baseLand: targetKeys});
    }

    getOptionList(data, method) {
        if (!data) {
            return [];
        }
        const options = [];
        data.map(item => {
            options.push(<Option value={item.id} key={item.id}
                                 onChange={method ? this.method : this.handleChange}>{item.name}</Option>);
        });
        return options;
    }

    async handleChangeTime(index) {
        // 0:'24小时数据' ,1:'15天预报'
        this.setState({
            timeNav: index
        });
        if (index === 1) {
            /* global echarts:true */
            const descriptionDay = [];
            const descriptionNight = [];
            const temperatureDay = [];
            const temperatureNight = [];
            await IOModel.GetFifteenDayWeather({':baseId': this.state.baseLand}).then((res) => {
                if (res.success) {
                    res.data.forEach((item) => {
                        const vm = {
                            title: item.descriptionDay,
                            descriptionIdDay: item.descriptionIdDay,
                            icon: this.state.weatherIcon[item.descriptionIdDay]
                        };
                        const vm1 = {
                            title: item.descriptionNight,
                            descriptionIdNight: item.descriptionIdNight,
                            wind: item.windDirectionNight,
                            windState: `${item.windLevelNight}级`,
                            icon: this.state.weatherIcon[item.descriptionIdNight]
                        };
                        descriptionDay.push(vm);
                        descriptionNight.push(vm1);
                        temperatureDay.push(item.temperatureDay);
                        temperatureNight.push(item.temperatureNight);
                    });
                } else {
                    message.error("获取失败");
                }
            }).catch(() => {
                message.error("获取失败");
            });
            await this.setState({
                descriptionDay: descriptionDay,
                descriptionNight: descriptionNight,
                fifteenTemperatrueDay: temperatureDay,
                fifteenTemperatrueNight: temperatureNight
            });
            const weatherDayChart = echarts.init(document.getElementById('weatherChart'));
            weatherDayChart.setOption(this.setWeatherOption());
        }
    }

    setWeatherOption() {
        return {
            xAxis: {
                show: false,
                type: 'category',
                splitLine: {
                    show: true
                }
            },
            yAxis: {
                show: false,
                type: 'value'
            },
            grid: {
                x: 0,
                x2: 0,
                y: 20,
                y2: 15
            },

            series: [{
                data: this.state.fifteenTemperatrueDay,
                type: 'line',
                symbol: "circle",
                symbolSize: 2,
                smooth: true,
                itemStyle: {
                    normal: {
                        color: "#fff",
                        borderColor: "#666",
                        lineStyle: {color: "#8583CC"},
                        label: {show: true, color: '#8583CC', formatter: '{c}°C'}
                    }
                }
            }, {
                data: this.state.fifteenTemperatrueNight,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: "#fff",
                        borderColor: "#666",
                        lineStyle: {color: "#86b589"},
                        label: {show: true, color: '#86b589', position: 'bottom', formatter: '{c}°C'}
                    }
                }
            }]
        };
    }
    getIcon(index) {
        const weatherName=`iconfont weather-ico weather-normal ${this.state.weatherIcon[index]}`;
        return weatherName;
    }
    getIconNight(index) {
        const weatherName=`iconfont weather-ico weather-night ${this.state.weatherIcon[index]}`;
        return weatherName;
    }
    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'realtimeweather_listByPage', 'show');
        const weatherRole = Com.hasRole(securityKeyWord, 'realtimeweather_weather', 'show');
        const queryFRole = Com.hasRole(securityKeyWord, 'realtimeweather_F_listByPage', 'show');
        const navNew = weatherList;
        const normalList = this.getAfterDate(15);
        const nightList = this.getAfterDate1(15);
        return (
            <div className='farming-box weather-box weather'>
                <div className='farming-search'>
                    <div className='farming-title title-other'>
                        <span className='title'>实时气象</span>
                        <div className='title-search'>
                            <div className='weather-search base-select'>
                                <div className='search-layout'>
                                    <div className='search-row'>
                                        <div className='search-col'>
                                            <span className='label-title'>基地</span>
                                            <Select value={this.state.baseLand} onChange={this.onBaseLandChange.bind(this)}
                                                    showSearch
                                                    placeholder="请选择基地"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                                {this.baseLandOptions}
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='time'>{this.state.now}</div>
                        </div>
                    </div>
                </div>
                <div className='content'>
                    {weatherRole && <Card className='analyze-chart'>
                        <div className='table-header-other'>
                            <div><i className='iconfont icon-tianqikanban'></i><span>天气看板</span></div>
                        </div>
                        <div className='weather-con'>
                            <div className='gutter-content'>
                                <Row gutter={20}>
                                    <Col span={5}>
                                        <div className="weather-layout">
                                            <div className="weather-icon"></div>
                                            <div
                                                    className="weather-new">{this.state.workWeatherHistory.temperature || '--'}<span>℃</span>
                                            </div>
                                            <div
                                                    className="weather-range">{this.state.MinAndMax.minTemperature || '--'}℃-{this.state.MinAndMax.maxTemperature || '--'}℃
                                            </div>
                                        </div>
                                        <div className='name'>温度</div>
                                    </Col>
                                    <Col span={5}>
                                        <div className="weather-layout weather-wind">
                                            <div className="weather-icon"></div>
                                            <div
                                                    className="weather-new">{this.state.workWeatherHistory.windDirection || '--'}{this.state.workWeatherHistory.windLevel}级
                                            </div>
                                            <div
                                                    className="weather-range">{this.state.MinAndMax.minWindLevel || '--'}级~{this.state.MinAndMax.maxWindLevel || '--'}级
                                            </div>
                                        </div>
                                        <div className='name'>风向风力</div>
                                    </Col>
                                    <Col span={5}>
                                        <div className="weather-layout weather-rain">
                                            <div className="weather-icon"></div>
                                            <div
                                                    className="weather-new">{this.state.workWeatherHistory.rainfall || '--'}mm
                                            </div>
                                            <div className="weather-range">累积{this.state.MinAndMax.sumRainfall || '--'}mm
                                            </div>
                                        </div>
                                        <div className='name'>降雨</div>
                                    </Col>
                                    <Col span={5}>
                                        <div className="weather-layout weather-wet">
                                            <div className="weather-icon"></div>
                                            <div className="weather-new">{this.state.workWeatherHistory.humidity || '--'}%
                                            </div>
                                            <div className="weather-range">平均{this.state.MinAndMax.avgHumidity || '--'}%
                                            </div>
                                        </div>
                                        <div className='name'>湿度</div>
                                    </Col>
                                </Row>
                                {this.state.workWeatherHistory.description && <div className='box-tip'><i
                                        className='iconfont icon-lingdang'></i> {this.state.workWeatherHistory.description}</div>}
                            </div>
                        </div>
                    </Card>}
                    <div className='space'></div>
                    {(queryRole || queryFRole) && <Card className='analyze-chart analyze-chart-two'>
                        <div className='table-header-other'>
                            <div><i className='iconfont icon-shishiqixiang'></i><span>实时气象</span>
                                {this.state.timeNav === 0 ? <ul className='tempreture-ul'>
                                    {navNew.map((item, index) => {
                                        return <li key={index}
                                                   className={item.key === this.state.activeNav ? 'active-nav' : ''}
                                                   onClick={this.handleChangeNav.bind(this, index)}>{item.title}</li>;
                                    })}
                                </ul> : <ul></ul>}
                            </div>
                            <p className='nav-con'>
                                {queryRole &&
                                <Button className={this.state.timeNav === 0 ? 'btn-common' : 'btn-common gray'}
                                        onClick={this.handleChangeTime.bind(this, 0)}>24小时预报</Button>}
                                {queryFRole &&
                                <Button className={this.state.timeNav === 1 ? 'btn-common' : 'btn-common gray'}
                                        onClick={this.handleChangeTime.bind(this, 1)}>未来15天预报</Button>}
                            </p>
                        </div>

                        <div id="main" style={{width:'100%',height: '420px', display: this.state.timeNav === 1 ? 'none' : 'block'}}></div>
                        <div className='weatherDay' style={{display: this.state.timeNav === 0 ? 'none' : 'block'}}>
                            <div className="gutter-day" style={{flex: 1}}>
                                <Row>
                                    {normalList.map((item, index) => {
                                        return (
                                                <Col className="gutter-row" span={1} key={index}>
                                                    <div className="gutter-box">{item.date}</div>
                                                    <div className="gutter-box weather-normal">{item.title}</div>
                                                    <i className={this.getIcon(item.descriptionIdDay)} type={item.icon}></i>
                                                </Col>
                                        );
                                    })}
                                </Row>
                                <Row>
                                    <Col style={{margin: '20px 0'}}>
                                        <div id='weatherChart' style={{width: "1200px", height: "150px"}}></div>
                                    </Col>
                                </Row>
                                <Row>
                                    {nightList.map((item, index) => {
                                        return (
                                                <Col className="gutter-row" span={1} key={index}>
                                                    <i className={this.getIconNight(item.descriptionIdNight)} type={item.icon}></i>
                                                    <div className="gutter-box weather-night">{item.title}</div>
                                                    <div className="gutter-box weather-wind">{item.wind}</div>
                                                    <div className="gutter-box weather-wind">{item.windState}</div>
                                                </Col>
                                        );
                                    })}
                                </Row>
                            </div>
                        </div>
                    </Card>}
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {slideName, Alldic} = state.analyzeReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['realtimeweather_listByPage', 'realtimeweather_F_listByPage', 'realtimeweather_weather'];
    return {
        slideName,
        dicList: Alldic, securityKeyWord
    };
};
export default connect(mapStateprops, action)(WeatherOnline);