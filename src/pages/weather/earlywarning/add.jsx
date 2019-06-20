import {Component} from 'react';
import {Select, Form, Input, Button, message, Row} from 'antd';
// import Tables from './table.jsx';
import _ from "lodash";
import {connect} from 'react-redux';
import {action, IOModel} from './model';
// import ModalForm  from './modalForm2.jsx';
import '../../index.less';
import './index.less';
const Option = Select.Option;
const FormItem = Form.Item;

class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dates: '',
            search_value: '基地',
            cropId: '',
            baseId: '',
            crop: '',
            disaster: '',
            disasterGrade: '',
            period: [],
            temperature: '',
            temperature_val: '',
            humidity: '',
            humidity_val: '',
            windSpeed: '',
            windSpeed_val: '',
            queryFlag: false,
            chooseId: null,
            title: '新增'
        };
    }

    handleTime() {
        const vWeek = ['周天', '周一', '周二', '周三', '周四', '周五', '周六'];
        const date = new Date();
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        month<10?month=`0${month}`:month=`${month}`;
        const day = date.getDate();
        let hour = date.getHours();
        hour<10?hour=`0${hour}`:hour=`${hour}`;
        let minute = date.getMinutes();
        minute<10?minute=`0${minute}`:minute=`${minute}`;
        let second = date.getSeconds();
        second<10?second=`0${second}`:second=`${second}`;
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
            dates: datess
        });
        setTimeout(this.handleTime.bind(this), 800);
        // return setTimeout(this.handleTime.bind(this),500);
    }

    async componentDidMount() {
        this.props.getAllDic();
        this.props.getCompanyBase();
        this.handleTime();
        this.props.superiorName({name: '气象', parentLeftID: -1});
        const params = _.replace(this.props.location.pathname, '/pages/weather/earlywarning/add/', '');
        const id = params.split("/")[0];
        const actionType = params.split("/")[1];
        if (actionType === 'modify') {
            IOModel.getOneWarning({id: id}).then((res) => {
                if (res.success) {
                    const data = res.data;
                    const rules = res.data.workRules;
                    this.handleCrop(data.cropId);
                    let temperature = '';
                    let temperature_val = '';
                    let humidity = '';
                    let humidity_val = '';
                    let windSpeed = '';
                    let windSpeed_val = '';
                    if (rules && rules.length > 0) {
                        for (let i = 0; i < rules.length; i++) {
                            if (rules[i].code === 'tmp') {
                                temperature = rules[i].type;
                                temperature_val = rules[i].maxValue;
                            } else if (rules[i].code === 'hum') {
                                humidity = rules[i].type;
                                humidity_val = rules[i].maxValue;
                            } else if (rules[i].code === 'spd') {
                                windSpeed = rules[i].type;
                                windSpeed_val = rules[i].maxValue;
                            }
                        }
                        this.setState({
                            cropId: data.cropId,
                            disaster: data.disaster,
                            baseId: data.baseId,
                            disasterGrade: data.disasterGrade,
                            period: data.periodIds,
                            temperature: temperature,
                            temperature_val: temperature_val,
                            humidity: humidity,
                            humidity_val: humidity_val,
                            windSpeed: windSpeed,
                            windSpeed_val: windSpeed_val
                        });
                    }
                }
            });
            this.setState({
                title: '编辑',
                id: id,
                actionType: actionType
            });
        }
    }

    componentWillUnMount() {
        clearTimeout(this.handleTime.bind(this));
    }

    setDisasterGrade(event) {
        this.setState({
            disasterGrade: event
        });
    }

    setDisaster(event) {
        this.setState({
            disaster: event.target.value
        });
    }

    setPeriod(event) {
        this.setState({
            period: event
        });
    }

    setTemperature(event) {
        this.setState({
            temperature: event
        });
    }

    setTemperatureVal(event) {
        this.setState({
            temperature_val: event.target.value
        });
    }

    setHumidity(event) {
        this.setState({
            humidity: event
        });
    }

    setHumidityVal(event) {
        this.setState({
            humidity_val: event.target.value
        });
    }

    setBaseId(value) {
        this.setState({
            baseId: value
        });
    }

    setWindSpeed(event) {
        this.setState({
            windSpeed: event
        });
    }

    handleCrop(value) {
        this.setState({
            cropId: value
        });
        const {cropDicList} = this.props;
        if (cropDicList && cropDicList.length > 0) {
            const crops = cropDicList.filter((item) => {
                return item.id === value;
            });
            if (crops && crops.length > 0) {
                this.setState({
                    crop: crops[0]
                });
            }
        }
        this.props.getAllPeriod(value);
    }

    setWindSpeedVal(event) {
        this.setState({
            windSpeed_val: event.target.value
        });
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        const vm = {
            operationName: this.state.operationName,
            farmingType: this.state.farmingType,
            startPage: current,
            limit: size
        };
        this.props.queryAll(vm);
    }

    fnondrag(num) {   //点击左侧边的id
        this.setState({
            chooseId: num
        });
    }

    handleReturn() {
        this.props.history.push('/pages/weather/earlywarning');
    }

    handleSubmit(e) {
        const {id, actionType} = this.state;
        e.preventDefault();
        if (!this.state.baseId) {
            return message.error('请选择基地');
        }
        if (!this.state.cropId) {
            return message.error('请选择作物');
        }
        if (!this.state.disaster) {
            return message.error('请选择潜在灾害');
        }
        if (!this.state.disasterGrade) {
            return message.error('请选择灾害等级');
        }
        if (this.state.period.length <= 0) {
            return message.error('请选择监测期');
        }
        if (!this.state.temperature_val && !this.state.humidity_val && !this.state.windSpeed_val) {
            return message.error('温度湿度风速不能全为空');
        }
        const periodList = [];
        let i = 0;
        for (i; i < this.state.period.length; i++) {
            const per = {
                periodId: this.state.period[i]
            };
            periodList[i] = per;
        }
        const rules = [{
            code: 'tmp',
            type: this.state.temperature,
            minValue: this.state.temperature_val,
            maxValue: this.state.temperature_val
        }, {
            code: 'hum',
            type: this.state.humidity,
            minValue: this.state.humidity_val,
            maxValue: this.state.humidity_val
        }, {
            code: 'spd',
            type: this.state.windSpeed,
            minValue: this.state.windSpeed_val,
            maxValue: this.state.windSpeed_val
        }];
        const rulesend = [];
        for(i = 0; i<3; i++) {
            if(rules[i].minValue !== null && rules[i].minValue !== '') {
                rulesend.push(rules[i]);
            }
        }
        if (actionType === 'modify') {
            const params = {
                id: id,
                cropId: this.state.cropId,
                cropName: this.state.crop.name,
                disaster: this.state.disaster,
                baseId: this.state.baseId,
                disasterGrade: this.state.disasterGrade,
                workWeatherWarningPeriodJson: JSON.stringify(periodList),
                workRuleJson: JSON.stringify(rulesend)
            };
            IOModel.updateWarning(params).then((res) => {
                if (res.success && res.data > 0) {
                    message.success('修改成功');
                    this.props.history.push('/pages/weather/earlywarning');
                } else {
                    message.warning('修改失败');
                }
            }).catch(() => {
                message.error("修改失败");
            });
        } else {
            const params = {
                cropId: this.state.cropId,
                cropName: this.state.crop.name,
                disaster: this.state.disaster,
                baseId: this.state.baseId,
                disasterGrade: this.state.disasterGrade,
                workWeatherWarningPeriodJson: JSON.stringify(periodList),
                workRuleJson: JSON.stringify(rulesend)
            };
            IOModel.AddWarning(params).then((res) => {
                if (res.success && res.data > 0) {
                    message.success('新增成功');
                    this.props.history.push('/pages/weather/earlywarning');
                } else {
                    message.warning('新增失败');
                }
            }).catch(() => {
                message.error("新增失败");
            });
        }
    }
    onchooseChange(current, size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
    }

    render () {
        const {dates, disasterGrade, temperature, humidity, windSpeed, title, cropId, disaster, period} = this.state;
        const {windSpeed_val,temperature_val,humidity_val} = this.state;
        const {periodArr, cropDicList, baseList} = this.props;
        return (
            <div className='farming-box weather-box'>
                <div className='farming-search'>
                    <div className='farming-title title-other'>
                        <div className='title'>气象预警</div>
                        <div className='title-search'>
                            <div className='weather-search early-select'>
                                <div className='search-layout'>
                                    <div className='search-row'>
                                        <div className='search-col'>
                                            <span className='label-title'>基地</span>
                                            <Select placeholder='请选择基地' onChange={this.setBaseId.bind(this)}>
                                                {
                                                    baseList.map((item) => {
                                                        return <Option value={item.id} key={item.id}>{item.name}</Option>;
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='warning-title-r'>{dates}</div>
                        </div>
                    </div>
                </div>
                <div className='content' style={{background: '#ffffff'}}>
                    <div className='table-header' style={{background: '#ffffff'}}>
                        <p><i className='iconfont icon-yujing1'></i><span>{title}预警</span></p>
                    </div>
                    <div className='add-list' style={{background: '#ffffff'}}>
                        <Form className='add-warning-con' layout='inline'>
                            <div className='add-warning-list'>
                                <FormItem label='作物'>
                                    <Select style={{width: 300}} value={cropId}
                                            onChange={this.handleCrop.bind(this)}>
                                        {
                                            cropDicList.map((item) => {
                                                return <Option value={item.id} key={item.id}>{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem label='潜在灾害'>
                                    <Input value={disaster} onChange={this.setDisaster.bind(this)} style={{width: 300,marginLeft:0}}></Input>
                                </FormItem>
                            </div>
                            <div className='add-warning-list'>
                                <FormItem label='灾害等级'>
                                    <Select style={{width: 300}} value={disasterGrade} onChange={this.setDisasterGrade.bind(this)}>
                                        <Option value="低">低</Option>
                                        <Option value="中">中</Option>
                                        <Option value="高">高</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label='监测期'>
                                    <Select mode="multiple" value={period} style={{width: 300}} onChange={this.setPeriod.bind(this)}>
                                        {
                                            periodArr.map((item) => {
                                                return <Option value={item.liveId} key={item.liveId}>{item.liveName}</Option>;
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </div>
                            <div className='add-warning-list-a'>
                                <div className='add-warning-list-last'>
                                    <FormItem label='温度'>
                                        <Select value={temperature} style={{width: 140}}
                                                onChange={this.setTemperature.bind(this)}>
                                            <Option value={3}>小于</Option>
                                            <Option value={2}>大于</Option>
                                            <Option value={1}>等于</Option>
                                        </Select>
                                        <Input value={temperature_val} type='number' style={{width: 150,marginTop:'4px',marginLeft:'10px'}}
                                               onChange={this.setTemperatureVal.bind(this)}/>
                                    </FormItem>
                                    {/*<FormItem className='add-input'>*/}
                                    {/*<Input value={temperature_val} type='number' style={{width: 200}}*/}
                                    {/*onChange={this.setTemperatureVal.bind(this)}/>*/}
                                    {/*</FormItem>*/}
                                </div>
                                <div className='add-warning-list-last'>
                                    <FormItem label='相对湿度(%)'>
                                        <Select value={humidity} style={{width: 140}}
                                                onChange={this.setHumidity.bind(this)}>
                                            <Option value={3}>小于</Option>
                                            <Option value={2}>大于</Option>
                                            <Option value={1}>等于</Option>
                                        </Select>
                                        <Input value={humidity_val} type='number' style={{width: 150,marginTop:'4px',marginLeft:'10px'}}
                                               onChange={this.setHumidityVal.bind(this)}/>
                                    </FormItem>
                                    {/*<FormItem className='add-input'>*/}
                                    {/*<Input value={humidity_val} type='number' style={{width: 200}}*/}
                                    {/*onChange={this.setHumidityVal.bind(this)}/>*/}
                                    {/*</FormItem>*/}
                                </div>
                            </div>
                            <div className='add-warning-list add-warning-list-last'>
                                <FormItem label='风速(m/s)'>
                                    <Select value={windSpeed} style={{width: 140}}
                                            onChange={this.setWindSpeed.bind(this)}>
                                        <Option value={3}>小于</Option>
                                        <Option value={2}>大于</Option>
                                        <Option value={1}>等于</Option>
                                    </Select>
                                    <Input value={windSpeed_val} type='number' style={{width: 150,marginTop:'4px',marginLeft:'10px'}}
                                           onChange={this.setWindSpeedVal.bind(this)}/>
                                </FormItem>
                                {/*<FormItem className='add-input'>*/}
                                    {/*<Input value={windSpeed_val} type='number' style={{width: 200}}*/}
                                           {/*onChange={this.setWindSpeedVal.bind(this)}/>*/}
                                {/*</FormItem>*/}
                            </div>
                        </Form>
                        <Row className='center-btn'>
                            <Button  className='add-warning-btn' onClick={this.handleSubmit.bind(this)}>确定</Button>
                            <Button   style={{marginLeft:20}} className='add-warning-btn red-btn' onClick={this.handleReturn.bind(this)}>返回</Button>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName, periodArr, fields, cropDicList, baseList} = state.earlyWarningListReducer;
    return {
        fields,
        periodArr,
        dataList: Alldate,//展示列表的数据
        slideName,
        cropDicList,
        baseList

    };
};
export default connect(mapStateprops, action)(Resources);
