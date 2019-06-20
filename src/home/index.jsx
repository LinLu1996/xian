import {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Col, Icon, Progress,  Select, message} from 'antd';
import {NavLink} from 'react-router-dom';
import {action} from './model';
import './index.less';
import moment from "moment";
import {OperationIOModel} from "@/pages/masterdata/operations/model";
import {IO} from "@/app/io";
import Gis from './gis.jsx';

class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dates: '',
            name: '',//基地名称
            functionary: '',//负责人
            queryFlag: false,  //筛选按钮
            allBase: [],//所有基地
            MinAndMax: {},
            workWeatherHistory: {},
            chooseId: null,
            landList: [],
            taskNum: {},
            base:(isNaN(sessionStorage.getItem('base')) || sessionStorage.getItem('base')===null)? -1:Number(sessionStorage.getItem('base'))
        };
    }

    handleTime() {
        //const vWeek = ['周天', '周一', '周二', '周三', '周四', '周五', '周六'];
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let hour = date.getHours();
        hour = hour < 10 ? `0${hour}` : hour;
        let minute = date.getMinutes();
        minute = minute < 10 ? `0${minute}` : minute;
        let second = date.getSeconds();
        second = second < 10 ? `0${second}` : second;
        /*const vWeek_s = date.getDay();
        const week = vWeek[vWeek_s];
        let morning = '';
        if (hour <= 12) {
            morning = '上午';
        } else {
            morning = '下午';
        }*/
        const datess = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        this.setState({
            dates: datess
        });
        setTimeout(this.handleTime.bind(this), 800);
        // return setTimeout(this.handleTime.bind(this),500);
    }

    componentDidMount() {
        console.log(this.state.base,'hhhhh');
        const workTaskBoardQuery = {
            baseId: this.state.base,
            beginTime: moment(new Date()).format('YYYY-MM-DD'),
            endTime: moment(new Date()).add(1, 'days').format('YYYY-MM-DD')
        };
        //进入页面请求报表数据
        let baseId = this.state.base;
        if(baseId && (baseId === '-1' || baseId === -1)) {
            baseId = null;
        }
        this.props.getDashReport({baseId: baseId});
        //进入页面请求农事看板数据
        this.props.getTaskBoard({str: JSON.stringify(workTaskBoardQuery)});
        this.handleTime();
        OperationIOModel.GetAllBase().then((res) => {
            if(res.success) {
                const allBase = res.data || [];
                allBase.unshift({id: -1, name: '全部基地'});
                this.setState({
                    allBase: allBase
                });
            }
        }).catch();
    }

    componentWillUnMount() {
        clearTimeout(this.handleTime.bind(this));
        this.setState({
                taskNum: this.props.taskNum
            }
        );
    }

    async setBase(event) {  //查找的表单-基地名称
        // await this.setState({
        //     base: event
        // });
        sessionStorage.setItem('base', event);
        this.setState({
            base:event
        });
        await this.query(event);
    }

    async query(event) {  //
        let baseId = -1;
        if(event !== null) {
            baseId = event;
        }
        await this.props.pageFlag({flag: true});
        this.props.getLandsByBaseId({':baseId': baseId});
        if (!isNaN(this.state.base) && this.state.base !== null && this.state.base !== undefined && this.state.base !== -1) {
            this.queryWeather(this.state.base);
        }
        /*await IOModel.getLandsByBaseId({':baseId': baseId}).then((res) => {
           this.setState({
                landList: res.data
           });
        });*/
        const vm = {
            baseId: this.state.base
        };
        const workTaskBoardQuery = {
            baseId: this.state.base,
            beginTime: moment(new Date()).format('YYYY-MM-DD'),
            endTime: moment(new Date()).add(1, 'days').format('YYYY-MM-DD')
        };
        //根据条件请求报表数据
        this.props.getDashReport(vm);
        //根据条件请求农事看板数据
        this.props.getTaskBoard({str: JSON.stringify(workTaskBoardQuery)});
    }

    //表格
    getTip(params) {
        const taskNum = params.data.taskNum;
        let title = '待执行';
        let list = taskNum.workTaskDTOTodos;
        if(params.data.code === 'overtime') {
            title = '超时';
            list = taskNum.workTaskDTOOvertimes;
        }else if(params.data.code === 'done') {
            title = '完成';
            list = taskNum.workTaskDTODones;
        }
        let res = `<div class='index-tip-layout'><div class="tip-title">${title}</div>` +
            `<table>` +
            `  <thead>` +
            `    <tr><th>序号</th><th>大棚</th><th>任务</th><th>责任人</th></tr>` +
            ` </thead>` +
            ` <tbody>`;
        for(let i = 0; i<list.length; i++) {
            res += `   <tr><td>${i+1}</td><td>${list[i].landName}</td><td>${list[i].taskName}</td><td>${list[i].supervisor}</td></tr>`;
            if(i === 3) {
                break;
            }
        }
        res += `</tbody>` + `</table>` + `</div>`;
        return res;
    }
    componentWillReceiveProps(nextProps) {
        if (!isNaN(this.state.base) && this.state.base !== null && this.state.base !== undefined && this.state.base !== -1) {
            /* global echarts:true */
            const myChart = echarts.init(document.getElementById('myChart'));
            myChart.setOption({
                /*title: {
                    text: nextProps.taskNum.all,
                    textStyle: {
                        color: "#9cd0a0",
                        fontSize: 50
                    },
                    itemGap: 5,
                    subtext: '任务数',
                    subtextStyle: {
                        color: '#000',
                        fontSize: 20
                    },
                    x: 'center',
                    y: 'center'
                },*/
                graphic: [{
                    type: 'text',
                    z: 100,
                    left: 'center',
                    top: '38%',
                    style: {
                        fill: '#9cd0a0',
                        text: nextProps.taskNum.all,
                        font: 'bolder 60px "STHeiti", sans-serif',
                        textAlign:'center'
                    }
                },{
                    type: 'text',
                    z: 100,
                    left: 'center',
                    top: '58%',
                    style: {
                        fill: '#000',
                        text: '任务数',
                        font: '20px "STHeiti", sans-serif',
                        textAlign:'center'
                    }
                }],
                tooltip: {
                    triggerOn:'click',
                    position: ['55%','10%'],
                    formatter: this.getTip,
                    backgroundColor:'#fff',
                    textStyle:{
                        color:"#333"
                    }
                },
                color: ['#9cd0a0', '#edc878', '#8683cb'],
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        center: ['50%', '50%'],
                        avoidLabelOverlap: false,
                        data: [
                            {value: nextProps.taskNum.todoCount, name: `待执行 ${nextProps.taskNum.todoCount}`,code: 'todo',taskNum:nextProps.taskNum},
                            {value: nextProps.taskNum.overtimeCount, name: `已超时 ${nextProps.taskNum.overtimeCount}`,code: 'overtime',taskNum:nextProps.taskNum},
                            {value: nextProps.taskNum.doneCount, name: `已完成 ${nextProps.taskNum.doneCount}`, code: 'done',taskNum:nextProps.taskNum}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
            setTimeout(function() {
                myChart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,  // 显示第几个series
                    dataIndex: 0 // 显示第几个数据
                });
            },500);
        } else {
            console.log('未选中基地，农事看板和天气不显示');
        }
    }

    queryWeather(baseId) {
        IO.analyze.getWeatherHistoryByBaseId({":baseId": baseId}).then((res) => {
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

    render() {
        const {baseNum, pageF} = this.props;
        const {dates,base} = this.state;
        return (
                <div className='content-box home-box'>
                    <div className='content-wrapper'>
                        <div className='farming-index'>
                            <Row className='index-layout' gutter={16}>
                                <Col span={24}>
                                    <div className="gutter-box">
                                        <div className="index-title">
                                            <div className="title-info">
                                                <i className='iconfont icon-jidi'></i>
                                                <span className='title'>基地总览</span>
                                                <span className='time'>{dates}</span>
                                                {/*<span className='time'>{new Date().toLocaleTimeString()}</span>*/}
                                            </div>
                                            {/*<div className='title-operation' style={{alignItems: "center"}}>*/}
                                                {/*<Icon type="left"/>*/}
                                                {/*<Icon type="right"/>*/}
                                            {/*</div>*/}
                                        </div>
                                        <Row className="gutter-count">
                                            <Col className="gutter-item gutter-item-green" span={8}>
                                                <div className='title'>地块数量</div>
                                                <div className='item-info'>
                                                    <div className='item-count'>
                                                        <div className='count-info'><span
                                                            className='number'>{baseNum.nowLands === undefined ? 0 : baseNum.nowLands}</span><span
                                                            className='company'>个</span></div>
                                                        <div
                                                            className='count-tip'>同比去年{baseNum.oldLands === 0 ? 100 : ((baseNum.nowLands - baseNum.oldLands) / baseNum.oldLands * 100).toFixed(0)}%
                                                        </div>
                                                    </div>
                                                    <div
                                                        className='count-i'>{(baseNum.nowLands - baseNum.oldLands) > 0 ?
                                                        <Icon type="arrow-up"/> : <Icon type="arrow-down"/>}</div>
                                                </div>
                                                <div className='item-progress'>
                                                    <Progress showInfo={false} strokeColor={'#9cd0a0'} strokeWidth={3}
                                                              percent={baseNum.oldLands === 0 ? 100 : (((baseNum.nowLands - baseNum.oldLands) / baseNum.oldLands * 100).toFixed(0) > 0 ? ((((baseNum.nowLands - baseNum.oldLands) / baseNum.oldLands) / parseInt((baseNum.nowLands - baseNum.oldLands) / baseNum.oldLands + 1)) * 100).toFixed(0) : Math.abs(((((baseNum.nowLands - baseNum.oldLands) / baseNum.oldLands) / parseInt(Math.abs((baseNum.nowLands - baseNum.oldLands) / baseNum.oldLands) + 1)) * 100).toFixed(0)))}/>
                                                <h2 style={{color:'#9cd0a0'}}>{baseNum.oldLands === 0 ? 100 : (((baseNum.nowLands - baseNum.oldLands) / baseNum.oldLands * 100).toFixed(0) > 0 ? ((((baseNum.nowLands - baseNum.oldLands) / baseNum.oldLands) / parseInt((baseNum.nowLands - baseNum.oldLands) / baseNum.oldLands + 1)) * 100).toFixed(0) : Math.abs(((((baseNum.nowLands - baseNum.oldLands) / baseNum.oldLands) / parseInt(Math.abs((baseNum.nowLands - baseNum.oldLands) / baseNum.oldLands) + 1)) * 100).toFixed(0)))}%</h2>
                                                </div>
                                            </Col>
                                            <Col className="gutter-item gutter-item-blue" span={8}>
                                                <div className='title'>种植面积</div>
                                                <div className='item-info'>
                                                    <div className='item-count'>
                                                        <div className='count-info'><span
                                                            className='number'>{!baseNum.nowAreas ? 0 : baseNum.nowAreas}</span><span
                                                            className='company'>亩</span></div>
                                                        <div
                                                            className='count-tip'>同比去年{baseNum.oldAreas === 0 ? 100 : ((baseNum.nowAreas - baseNum.oldAreas) / baseNum.oldAreas * 100).toFixed(0)}%
                                                        </div>
                                                    </div>
                                                    <div
                                                        className='count-i'>{(baseNum.nowAreas - baseNum.oldAreas) > 0 ?
                                                        <Icon type="arrow-up"/> : <Icon type="arrow-down"/>}</div>
                                                </div>
                                                <div className='item-progress'>
                                                    <Progress showInfo={false} strokeColor={'#8261C6'} strokeWidth={3} percent={baseNum.oldAreas === 0 ? 100 : (((baseNum.nowAreas - baseNum.oldAreas) / baseNum.oldAreas * 100).toFixed(0) > 0 ? (((baseNum.nowAreas - baseNum.oldAreas) / baseNum.oldAreas) / parseInt((baseNum.nowAreas - baseNum.oldAreas) / baseNum.oldAreas + 1) * 100).toFixed(0) : Math.abs((((baseNum.nowAreas - baseNum.oldAreas) / baseNum.oldAreas) / parseInt(Math.abs((baseNum.nowAreas - baseNum.oldAreas) / baseNum.oldAreas) + 1) * 100).toFixed(0)))}/>
                                                    <h2 style={{color:'#8261C6'}}>{baseNum.oldAreas === 0 ? 100 : (((baseNum.nowAreas - baseNum.oldAreas) / baseNum.oldAreas * 100).toFixed(0) > 0 ? (((baseNum.nowAreas - baseNum.oldAreas) / baseNum.oldAreas) / parseInt((baseNum.nowAreas - baseNum.oldAreas) / baseNum.oldAreas + 1) * 100).toFixed(0) : Math.abs((((baseNum.nowAreas - baseNum.oldAreas) / baseNum.oldAreas) / parseInt(Math.abs((baseNum.nowAreas - baseNum.oldAreas) / baseNum.oldAreas) + 1) * 100).toFixed(0)))}%</h2>
                                                </div>
                                            </Col>
                                            <Col className="gutter-item  gutter-item-yellow" span={8}>
                                                <div className='title'>品种数量</div>
                                                <div className='item-info'>
                                                    <div className='item-count'>
                                                        <div className='count-info'><span className='number'>{baseNum.nowCrops === undefined ? 0 : baseNum.nowCrops}</span><span className='company'>个</span></div>
                                                        <div className='count-tip'>同比去年{baseNum.oldCrops === 0 ? 100 : ((baseNum.nowCrops - baseNum.oldCrops) / baseNum.oldCrops * 100).toFixed(0)}%
                                                        </div>
                                                    </div>
                                                    <div className='count-i'>{(baseNum.nowCrops - baseNum.oldCrops) > 0 ?
                                                        <Icon type="arrow-up"/> : <Icon type="arrow-down"/>}</div>
                                                </div>
                                                <div className='item-progress'>
                                                    <Progress showInfo={false} strokeColor={'#edc870'} strokeWidth={3} percent={baseNum.oldCrops === 0 ? 100 : (((baseNum.nowCrops - baseNum.oldCrops) / baseNum.oldCrops * 100).toFixed(0) > 0 ? (((baseNum.nowCrops - baseNum.oldCrops) / baseNum.oldCrops) / parseInt((baseNum.nowCrops - baseNum.oldCrops) / baseNum.oldCrops + 1) * 100) : Math.abs((((baseNum.nowCrops - baseNum.oldCrops) / baseNum.oldCrops) / parseInt(Math.abs((baseNum.nowCrops - baseNum.oldCrops) / baseNum.oldCrops) + 1) * 100).toFixed(0)))}/>
                                                    <h2 style={{color:'#edc870'}}>{baseNum.oldCrops === 0 ? 100 : (((baseNum.nowCrops - baseNum.oldCrops) / baseNum.oldCrops * 100).toFixed(0) > 0 ? (((baseNum.nowCrops - baseNum.oldCrops) / baseNum.oldCrops) / parseInt((baseNum.nowCrops - baseNum.oldCrops) / baseNum.oldCrops + 1) * 100) : Math.abs((((baseNum.nowCrops - baseNum.oldCrops) / baseNum.oldCrops) / parseInt(Math.abs((baseNum.nowCrops - baseNum.oldCrops) / baseNum.oldCrops) + 1) * 100).toFixed(0)))}%</h2>
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className='distribution'>
                                            <div className='distribution-title'>
                                                <div className='h1'>地区分布</div>
                                                {/*<div className='h3'>ET农业大脑目前覆盖全国<span>100</span>多个地区</div>*/}
                                            </div>
                                            <div className='search distribution-title'>
                                                <Row className='index-layout' gutter={16}>
                                                    {/*<span className='label-title'> </span>*/}
                                                    <Select className='select-layout' style={{paddingLeft:0,paddingRight:0}} value={this.state.base} allowClear={true} onChange={this.setBase.bind(this)}>
                                                        {this.state.allBase.length !== 0 && this.state.allBase.map((item) => {
                                                            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>;
                                                        })}
                                                    </Select>
                                                    {/*<div className='form-col' hidden={true}>
                                                        <Button className='form-btn' onClick={() => {
                                                            this.query();
                                                        }}>确认</Button>
                                                    </div>*/}
                                                </Row>
                                            </div>
                                            {/*<div className='distribution-map'>地图</div>*/}
                                            <Gis baseId={this.state.base} pageF={pageF}/>
                                        </div>
                                    </div>

                                </Col>
                            </Row>
                            {(!isNaN(base) && base && base !== -1) &&
                            <Row className='index-layout' gutter={16}>
                                <Col className="gutter-row" span={12}>
                                    <div className="gutter-box">
                                        <div className="index-title">
                                            <div className="title-info">
                                                <i className='iconfont icon-nongshikanban'></i>
                                                <span className='title'>农事看板</span>
                                            </div>
                                            <div className='title-operation'>
                                                <NavLink to={'/pages/plantingmgmt/tasklist'}>任务管理 ></NavLink>
                                            </div>
                                        </div>
                                        <div className="gutter-echart">
                                            <div id="myChart" className='myChart' style={{height: '300px',width: '300px'}}></div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <div className="gutter-box">
                                        <div className="index-title">
                                            <div className="title-info">
                                                <i className='iconfont icon-tianqikanban'></i>
                                                <span className='title'>天气看板</span>
                                            </div>
                                            <div className='title-operation'>
                                                <NavLink to={'/pages/weather/realtimeweather'}>实时气象 ></NavLink>
                                            </div>
                                        </div>
                                        <div className='gutter-content'>
                                            <Row gutter={20}>
                                                <Col span={8}>
                                                    <div className="weather-layout">
                                                        <div className="weather-icon"><i
                                                            className="iconfont icon-wendu"></i></div>
                                                        <div className="weather-new">{this.state.workWeatherHistory.temperature || '--'}<span>℃</span></div>
                                                        <div className="weather-range">{this.state.MinAndMax.minTemperature || '--'}℃~{this.state.MinAndMax.maxTemperature || '--'}℃</div>
                                                    </div>
                                                    <div className='name'>温度</div>
                                                </Col>
                                                <Col span={8}>
                                                    <div className="weather-layout weather-wind">
                                                        <div className="weather-icon"><i
                                                            className="iconfont icon-feng"></i></div>
                                                        <div className="weather-new">{this.state.workWeatherHistory.windDirection || '--'}</div>
                                                        <div className="weather-range">{this.state.MinAndMax.minWindLevel || '--'}级~{this.state.MinAndMax.maxWindLevel || '--'}级</div>
                                                    </div>
                                                    <div className='name'>风向风力</div>
                                                </Col>
                                                <Col span={8}>
                                                    <div className="weather-layout weather-rain">
                                                        <div className="weather-icon"><i
                                                            className="iconfont icon-jiangyu"></i></div>
                                                        <div className="weather-new">{this.state.workWeatherHistory.rainfall || '--'}mm</div>
                                                        <div className="weather-range">累积{this.state.MinAndMax.sumRainfall || '--'}mm</div>
                                                    </div>
                                                    <div className='name'>降雨</div>
                                                </Col>
                                            </Row>
                                            {this.state.workWeatherHistory.description && <div className='box-tip'><Icon type="exclamation-circle"/> {this.state.workWeatherHistory.description}</div>}
                                        </div>
                                    </div>
                                </Col>
                            </Row>}
                        </div>
                    </div>
                    <div className='content-bottom'>
                        Copyright © 2018-2019 阿里ET农业大脑.com All Rights Reserved.
                    </div>
                </div>
        );
    }
}

const mapStateprops = (state) => {
    const {slideName, baseNum, taskNum, pageF,base} = state.indexReducer;
    const {menuData} = state.initReducer;
    return {
        base,
        slideName,
        baseNum,
        taskNum,
        menuData,
        pageF
    };
};
export default connect(mapStateprops, action)(Resources);
