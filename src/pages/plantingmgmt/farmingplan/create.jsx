import {Component} from 'react';
import {Form, DatePicker, Button, Select, Transfer, Modal, LocaleProvider} from 'antd';
import {NavLink} from 'react-router-dom';
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
import connect from "react-redux/es/connect/connect";
import {action, IOModel} from "@/pages/plantingmgmt/farmingplan/model";
import './index.less';
import Utils from './util';
import Com from '@/component/common';
import zhCN from 'antd/lib/locale-provider/zh_CN';
moment.locale('zh-cn');
const FormItem = Form.Item;

class FarmPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cropId: '',
            planId: '',
            plantingBase: '',
            beginDate: moment(new Date(), 'YYYY-MM-DD'),
            land: [],
            planListChild: [],
            landListChild: []
        };
    }

    componentDidMount() {
        //获取字典列表
        this.props.AllDicPull();
        this.props.superiorName({name: '新增农事计划', parentLeftID: -1});
    }

    handleChange(targetKeys) {
        this.setState({land: targetKeys});
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.cropId) {
            return Modal.error({
                title: '提示',
                content: '请选择种植作物',
                okText: '确认'
            });
        }
        if (!this.state.planId) {
            return Modal.error({
                title: '提示',
                content: '请选择种植方案',
                okText: '确认'
            });
        }
        if (!this.state.plantingBase) {
            return Modal.error({
                title: '提示',
                content: '请选择基地',
                okText: '确认'
            });
        }
        if (this.state.beginDate === null) {
            return Modal.error({
                title: '提示',
                content: '请选择计划开始日期',
                okText: '确认'
            });
        }
        if (!this.state.land.length) {
            return Modal.error({
                title: '提示',
                content: '请选择地块',
                okText: '确认'
            });
        }
        const {securityKeyWord} = this.props;
        const getRole = Com.hasRole(securityKeyWord, 'farmingplan_getById', 'show');
        const params = {};
        params.companyId = 1;
        params.baseId = this.state.plantingBase;
        params.solutionId = this.state.planId;
        if (this.state.beginDate) {
            params.startTime = new Date(this.state.beginDate).getTime();
        }
        params.cropId = this.state.cropId;
        params.landIdsJson = JSON.stringify(this.state.land);
        IOModel.CreateWorkPlan(params).then((res) => {
            if (res.success) {
                if (res.data && res.data > 0) {
                    const id = res.data;
                    if (getRole) {
                        this.props.history.push(`/pages/plantingmgmt/farmingplan/detail/${id}/modify`);
                    } else {
                        this.props.history.push(`/pages/plantingmgmt/farmingplan/index`);
                    }
                } else {
                    Modal.error({
                        title: '提示',
                        content: '新增农事计划失败',
                        okText: '确认'
                    });
                    //message.error("创建农事任务计划失败");
                }
            }
        }).catch((res) => {
            Modal.error({
                title: '提示',
                content: res.message,
                okText: '确认'
            });
            //message.error("创建农事任务计划失败");
        });
    }

    handleCropChange(value) {
        // const crop = _.find(this.props.cropDicList, function (chr) {
        //     return chr.id === value;
        // });
        const me = this;
        if (value && value !== '') {
            //根据种植询作物查种植方案
            IOModel.GetSolutionByCropNo({cropId: value}).then((res) => {
                if (res.success) {
                    const data = res.data || [];
                    me.setState({
                        cropId: value,
                        planListChild: data,
                        planId: (data !== null && data.length > 0) ? data[0].id : ''
                    });
                }
            }).catch((res) => {
                Modal.error({
                    title: '提示',
                    content: res.message,
                    okText: '确认'
                });
                //message.error("获取种植方案失败");
            }).finally(() => {
                me.setState({
                    cropId: value
                });
            });
        }
    }

    onPlanChange(value) {
        this.setState({
            planId: value
        });
    }

    onBaseLandChange(val) {
        const me = this;
        this.setState({
            land: []
        });
        if (val !== null && val !== '') {
            //获取基地下面所有未使用地块
            IOModel.GetUnuseLandInBase({'baseId': val}).then((res) => {
                if (res.success) {
                    const data = res.data || [];
                    const transData = [];
                    if (data !== null && data.length > 0) {
                        data.forEach((item) => {
                            transData.push({
                                "key": item.id,
                                "title": item.name,
                                "id": item.id,
                                "chosen": false
                            });
                        });
                    }
                    me.setState({
                        plantingBase: val,
                        landListChild: transData
                    });
                }
            }).catch((res) => {
                Modal.error({
                    title: '提示',
                    content: res.message,
                    okText: '确认'
                });
                //message.error("获取可用地块失败");
            }).finally(() => {
                me.setState({
                    plantingBase: val
                });
            });
        }
    }

    onTimeChange(val) {
        if (val) {
            this.setState({
                beginDate: moment(val, 'YYYY-MM-DD')
            });
        } else {
            this.setState({
                beginDate: null
            });
        }
    }

    disabledDate(current) {
        return current && new Date(current).getTime() <= Date.now();
    }

    render() {
        const {cropDicList, baseDicList} = this.props;
        const baseList = [];
        if (baseDicList && baseDicList.length) {
            for (let i = 0; i < baseDicList.length; i++) {
                const base = {};
                base.id = baseDicList[i].id;
                base.name = `${baseDicList[i].name}---闲置地块数${baseDicList[i].nums}`;
                baseList.push(base);
            }
        }
        const landOptions = Utils.getOptionList(baseList);
        const cropOptions = Utils.getOptionList(cropDicList);
        const cropOptionsChild = Utils.getOptionList(this.state.planListChild);
        const landAll = this.state.landListChild;
        return (
            <div className='farming-box farming-plan-box'>
                <div className='farming-search'>
                    <div className='farming-title'>
                        <div className='title big-title'>新增农事计划</div>
                    </div>
                </div>
                <div className='content'>
                    <Form className='farm-plan-con' layout='inline'>
                        <div>
                            <FormItem label='选择种植作物'>
                                <Select value={this.state.cropId} onChange={this.handleCropChange.bind(this)}>
                                    {cropOptions}
                                </Select>
                            </FormItem>
                            <FormItem label='选择种植方案'>
                                <Select value={this.state.planId} onChange={this.onPlanChange.bind(this)}>
                                    {cropOptionsChild}
                                </Select>
                            </FormItem>
                        </div>

                        <div>
                            <FormItem label='选择基地'>
                                <Select value={this.state.plantingBase} onChange={this.onBaseLandChange.bind(this)}>
                                    {landOptions}
                                </Select>
                            </FormItem>
                            <FormItem label='计划开始日期'>
                                <LocaleProvider locale={zhCN}>
                                    <DatePicker defaultValue={this.state.beginDate} onChange={this.onTimeChange.bind(this)}
                                                disabledDate={this.disabledDate}/>
                                </LocaleProvider>
                            </FormItem>
                        </div>
                        <div className='plan-transfer'>
                            <FormItem label='选择地块'>
                                <LocaleProvider locale={zhCN}>
                                    <Transfer
                                        titles={['可选', '已 选']}
                                        listStyle={{
                                            width: 300,
                                            height: 300,
                                            background: '#fff'
                                        }}
                                        operations={['选择', '取消']}
                                        dataSource={landAll}
                                        targetKeys={this.state.land}
                                        onChange={this.handleChange.bind(this)}
                                        render={item => item.title}/>
                                </LocaleProvider>
                            </FormItem>
                        </div>
                        <div className='content-button-list'>
                            <Button className='page-foot-btn' type="primary"
                                    onClick={this.handleSubmit.bind(this)}>确认</Button>
                            <NavLink to={`/pages/plantingmgmt/farmingplan`}><Button className='page-foot-btn red-btn'
                                                                                    type="primary"
                            >取消</Button></NavLink>
                        </div>
                    </Form>
                </div>
            </div>

        );
    }
}

const mapStateprops = (state) => {
    const {Alldic, AllCropDic, AllBaseDic, slideName} = state.farmingplanReducer;
    const {securityKeyWord} = state.initReducer;
    //const securityKeyWord = ['farmingplan_listByPage','farmingplan_add','farmingplan_update','farmingplan_getById'];
    return {
        dicList: Alldic,//数据字典
        cropDicList: AllCropDic, //种植作物数据字典
        baseDicList: AllBaseDic, //基地数据字典
        slideName, securityKeyWord
    };
};
export default connect(mapStateprops, action)(FarmPlan);