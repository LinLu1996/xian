import {Component} from 'react';
import {Card, Row, Col, Button, Select, DatePicker, Modal, LocaleProvider} from 'antd';

const Option = Select.Option;
import {action, IOModel} from './model';
import {chartLegend} from './list';
import './analyze.less';
import '../../index.less';
import Tables from './table.jsx';
import {LandIOModel} from "@/pages/masterdata/land/model";
import zhCN from 'antd/lib/locale-provider/zh_CN';

const {RangePicker} = DatePicker;
import moment from "moment";
import connect from "react-redux/es/connect/connect";
import Com from '@/component/common';


let analyzeChart = null;

class AnalyzeBar extends Component {
    constructor(props) {
        super(props);
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
        this.state = {
            data1: {},
            baseList: [],
            landList: [],
            cropList: [],
            activeNav: 0,
            queryFlag: true,//控制分页的展示
            tableTotal: 0,
            showChartsType: 'watering',
            startDate: moment(start).format('YYYY-MM-DD'),//开始日期
            endDate: moment(end).format('YYYY-MM-DD'),//结束日期
            land: -1,//地块
            baseLand: -1,//基地
            cropType: -1, //作物品种
            chartData: [
                {
                    title: '实际灌溉量',
                    dataList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                {
                    title: '计划灌溉量',
                    dataList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                }
            ],
            tableData: [],
            type: 'watering',
            landChild: '',//地块
            baseLandChild: '',//基地
            cropTypeChild: '', //作物品种
            startDateChild: '',//开始日期
            endDateChild: '',//结束日期
            queryRole: false,
            planRole: false
        };
    }

    componentWillMount() {
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
        await IOModel.GetAllCrops({companyId: 1}).then((res) => {
            if (res.success) {
                this.setState({
                    cropList: res.data
                });
            }
        });
        const param = {
            startTime: moment(this.state.startDate).format('YYYY-MM-DD'),
            endTime: moment(this.state.endDate).format('YYYY-MM-DD'),
            startPage: 1,
            companyId: 1,
            limit: 10
        };
        const str = JSON.stringify(param);
        await IOModel.AllCountDatas({str: str}).then((res) => {
            if (res.success) {
                const data1 = res.data || [];
                const dataList = [];
                if (data1 && data1.length > 0) {
                    for (let i = 0; i < data1.length; i++) {
                        const data = {};
                        let count = 0;
                        let qty = 0;
                        for (let k = 0; k < data1.length; k++) {
                            if (data1[i].code === data1[k].code) {
                                qty += data1[k].qty;
                                count += data1[k].count;
                            }
                        }
                        data.code = data1[i].code;
                        data.qty = qty;
                        data.unitName = data1[i].unitName;
                        data.count = count;
                        dataList.push(data);
                    }
                }
                const data2 = {};
                dataList.forEach((item) => {
                    data2[item.code] = item;
                });
                this.setState({
                    data1: data2
                });
            }
        });
        await IOModel.waterBarDatas({str: str}).then((res) => {
            if (res.success) {
                const realList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                const planList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let title = '';
                if (this.state.showChartsType === 'watering') {
                    title = '灌溉量';
                    res.data.forEach((item) => {
                        if (item.month === 1) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 2) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 3) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 4) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 5) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 6) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 7) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 8) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 9) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 10) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 11) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 12) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                    });
                }
                this.setState({
                    chartData: [
                        {
                            title: `实际${title}`,
                            dataList: realList
                        },
                        {
                            title: `计划${title}`,
                            dataList: planList
                        }
                    ]
                });
            } else {
                Modal.error({
                    title: '提示',
                    content: res.message
                });
            }
        }).catch();
        await IOModel.waterTableDatas({str: str}).then((res) => {
            if (res.success) {
                res.data.rows.forEach((item, index) => {
                    item.id = index;
                    return item;
                });
                if (this.state.showChartsType === 'watering') {
                    this.setState({
                        tableData: res.data.rows,
                        tableTotal: res.data.total
                    });
                }
            } else {
                Modal.error({
                    title: '提示',
                    content: res.message
                });
            }
        }).catch();
        await this.setState({
            startDateChild: new Date(this.state.startDate).getTime(),//开始日期
            endDateChild: new Date(this.state.endDate).getTime()//结束日期
        });
        this.props.superiorName({name: '分析', parentLeftID: -1});
    }

    async query() {
        this.setState({
            activeNav: 0,
            showChartsType: 'watering',
            queryFlag: true //控制分页的展示
        }, () => {
            if (this.state.closure) {
                clearTimeout(this.state.closure);
            }
            const param = {
                startTime: this.state.startDate,
                endTime: this.state.endDate,
                baseId: this.state.baseLand === -1 ? undefined : this.state.baseLand,
                landId: this.state.land === -1 ? undefined : this.state.land,
                cropId: this.state.cropType === -1 ? undefined : this.state.cropType,
                startPage: 1,
                companyId: 1,
                limit: 10
            };
            this.setState({
                closure: setTimeout(() => {
                    this.props.page({current: 1, pageSize: 10});
                    const str = JSON.stringify(param);
                    IOModel.AllCountDatas({str: str}).then((res) => {
                        if (res.success) {
                            const data1 = res.data || [];
                            const dataList = [];
                            if (data1 && data1.length > 0) {
                                for (let i = 0; i < data1.length; i++) {
                                    const data = {};
                                    let count = 0;
                                    let qty = 0;
                                    for (let k = 0; k < data1.length; k++) {
                                        if (data1[i].code === data1[k].code) {
                                            qty += data1[k].qty;
                                            count += data1[k].count;
                                        }
                                    }
                                    data.code = data1[i].code;
                                    data.qty = qty;
                                    data.unitName = data1[i].unitName;
                                    data.count = count;
                                    dataList.push(data);
                                }
                            }
                            const data2 = {};
                            dataList.forEach((item) => {
                                data2[item.code] = item;
                            });
                            this.setState({
                                data1: data2
                            });
                        }
                    });
                    IOModel.waterBarDatas({str: str}).then((res) => {
                        if (res.success) {
                            const realList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            const planList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            let title = '';
                            if (this.state.showChartsType === 'watering') {
                                title = '灌溉量';
                                res.data.forEach((item) => {
                                    if (item.month === 1) {
                                        if (item.actualQty) {
                                            realList[parseInt(item.month) - 1] = item.actualQty;
                                        }
                                        if (item.plannedQty) {
                                            planList[parseInt(item.month) - 1] = item.plannedQty;
                                        }
                                    }
                                    if (item.month === 2) {
                                        if (item.actualQty) {
                                            realList[parseInt(item.month) - 1] = item.actualQty;
                                        }
                                        if (item.plannedQty) {
                                            planList[parseInt(item.month) - 1] = item.plannedQty;
                                        }
                                    }
                                    if (item.month === 3) {
                                        if (item.actualQty) {
                                            realList[parseInt(item.month) - 1] = item.actualQty;
                                        }
                                        if (item.plannedQty) {
                                            planList[parseInt(item.month) - 1] = item.plannedQty;
                                        }
                                    }
                                    if (item.month === 4) {
                                        if (item.actualQty) {
                                            realList[parseInt(item.month) - 1] = item.actualQty;
                                        }
                                        if (item.plannedQty) {
                                            planList[parseInt(item.month) - 1] = item.plannedQty;
                                        }
                                    }
                                    if (item.month === 5) {
                                        if (item.actualQty) {
                                            realList[parseInt(item.month) - 1] = item.actualQty;
                                        }
                                        if (item.plannedQty) {
                                            planList[parseInt(item.month) - 1] = item.plannedQty;
                                        }
                                    }
                                    if (item.month === 6) {
                                        if (item.actualQty) {
                                            realList[parseInt(item.month) - 1] = item.actualQty;
                                        }
                                        if (item.plannedQty) {
                                            planList[parseInt(item.month) - 1] = item.plannedQty;
                                        }
                                    }
                                    if (item.month === 7) {
                                        if (item.actualQty) {
                                            realList[parseInt(item.month) - 1] = item.actualQty;
                                        }
                                        if (item.plannedQty) {
                                            planList[parseInt(item.month) - 1] = item.plannedQty;
                                        }
                                    }
                                    if (item.month === 8) {
                                        if (item.actualQty) {
                                            realList[parseInt(item.month) - 1] = item.actualQty;
                                        }
                                        if (item.plannedQty) {
                                            planList[parseInt(item.month) - 1] = item.plannedQty;
                                        }
                                    }
                                    if (item.month === 9) {
                                        if (item.actualQty) {
                                            realList[parseInt(item.month) - 1] = item.actualQty;
                                        }
                                        if (item.plannedQty) {
                                            planList[parseInt(item.month) - 1] = item.plannedQty;
                                        }
                                    }
                                    if (item.month === 10) {
                                        if (item.actualQty) {
                                            realList[parseInt(item.month) - 1] = item.actualQty;
                                        }
                                        if (item.plannedQty) {
                                            planList[parseInt(item.month) - 1] = item.plannedQty;
                                        }
                                    }
                                    if (item.month === 11) {
                                        if (item.actualQty) {
                                            realList[parseInt(item.month) - 1] = item.actualQty;
                                        }
                                        if (item.plannedQty) {
                                            planList[parseInt(item.month) - 1] = item.plannedQty;
                                        }
                                    }
                                    if (item.month === 12) {
                                        if (item.actualQty) {
                                            realList[parseInt(item.month) - 1] = item.actualQty;
                                        }
                                        if (item.plannedQty) {
                                            planList[parseInt(item.month) - 1] = item.plannedQty;
                                        }
                                    }
                                });
                            }
                            this.setState({
                                chartData: [
                                    {
                                        title: `实际${title}`,
                                        dataList: realList
                                    },
                                    {
                                        title: `计划${title}`,
                                        dataList: planList
                                    }
                                ]
                            });
                        } else {
                            Modal.error({
                                title: '提示',
                                content: res.message
                            });
                        }
                    }).catch();
                    IOModel.waterTableDatas({str: str}).then((res) => {
                        if (res.success) {
                            res.data.rows.forEach((item, index) => {
                                item.id = index;
                                return item;
                            });
                            if (this.state.showChartsType === 'watering') {
                                this.setState({
                                    tableData: res.data.rows,
                                    tableTotal: res.data.total
                                });
                            }
                        } else {
                            Modal.error({
                                title: '提示',
                                content: res.message
                            });
                        }
                    }).catch();
                    const {baseLand, land, cropType} = this.state;
                    this.setState({
                        baseLandChild: baseLand,
                        landChild: land,
                        cropTypeChild: cropType,
                        startDateChild: param.startTime,//开始日期
                        endDateChild: param.endTime//结束日期
                    });
                }, 800)
            });
        });
    }

    queryWaterQty() {
        const param = {
            startTime: this.state.startDateChild,
            endTime: this.state.endDateChild,
            landId: this.state.landChild === -1 ? undefined : this.state.landChild,
            startPage: 1,
            cropId: this.state.cropTypeChild === -1 ? undefined : this.state.cropTypeChild,
            companyId: 1,
            baseId: this.state.baseLandChild === -1 ? undefined : this.state.baseLandChild,
            limit: 10
        };
        const str = JSON.stringify(param);
        IOModel.waterBarDatas({str: str}).then((res) => {
            if (res.success) {
                const realList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                const planList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let title = '';
                if (this.state.showChartsType === 'watering') {
                    title = '灌溉量';
                    res.data.forEach((item) => {
                        if (item.month === 1) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 2) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 3) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 4) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 5) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 6) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 7) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 8) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 9) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 10) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 11) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 12) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                    });
                }
                this.setState({
                    chartData: [
                        {
                            title: `实际${title}`,
                            dataList: realList
                        },
                        {
                            title: `计划${title}`,
                            dataList: planList
                        }
                    ]
                    /*tableData: res.data.tableData.list,
                    tableTotal: res.data.tableData.total*/
                });
            }
        }).catch();
    }

    queryWaterCount() {
        const param = {
            startTime: this.state.startDateChild,
            endTime: this.state.endDateChild,
            baseId: this.state.baseLandChild === -1 ? undefined : this.state.baseLandChild,
            landId: this.state.landChild === -1 ? undefined : this.state.landChild,
            startPage: 1,
            companyId: 1,
            cropId: this.state.cropTypeChild === -1 ? undefined : this.state.cropTypeChild,
            limit: 10
        };
        const str = JSON.stringify(param);
        IOModel.waterBarDatas({str: str}).then((res) => {
            if (res.success) {
                const realList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                const planList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let title = '';
                if (this.state.showChartsType === 'wateringTimes') {
                    title = '灌溉次数';
                    res.data.forEach((item) => {
                        if (item.month === 1) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                                //realList.push(item.actualCount);
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 2) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 3) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 4) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 5) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 6) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 7) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 8) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 9) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 10) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 11) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 12) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                    });
                }
                this.setState({
                    chartData: [
                        {
                            title: `实际${title}`,
                            dataList: realList
                        },
                        {
                            title: `计划${title}`,
                            dataList: planList
                        }
                    ]
                    /*tableData: res.data.tableData.list,
                    tableTotal: res.data.tableData.total*/
                });
            }
        }).catch();
    }

    queryWaterTable(param) {
        const str = JSON.stringify(param);
        IOModel.waterTableDatas({str: str}).then((res) => {
            if (res.success) {
                res.data.rows.forEach((item, index) => {
                    item.id = index;
                    return item;
                });
                if (this.state.showChartsType === 'watering') {
                    this.setState({
                        tableData: res.data.rows,
                        tableTotal: res.data.total
                    });
                }
            } else {
                Modal.error({
                    title: '提示',
                    content: res.message
                });
            }
        }).catch();
    }

    queryFeitilizerQty() {
        const param = {
            startTime: this.state.startDateChild,
            endTime: this.state.endDateChild,
            landId: this.state.landChild === -1 ? undefined : this.state.landChild,
            cropId: this.state.cropTypeChild === -1 ? undefined : this.state.cropTypeChild,
            startPage: 1,
            companyId: 1,
            limit: 10,
            baseId: this.state.baseLandChild === -1 ? undefined : this.state.baseLandChild
        };
        const str = JSON.stringify(param);
        IOModel.feitilizerBarDatas({str: str}).then((res) => {
            if (res.success) {
                const realList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                const planList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let title = '';
                if (this.state.showChartsType === 'fertilization') {
                    title = '施肥量';
                    res.data.forEach((item) => {
                        if (item.month === 1) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 2) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 3) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 4) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 5) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 6) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 7) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 8) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 9) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 10) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 11) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                        if (item.month === 12) {
                            if (item.actualQty) {
                                realList[parseInt(item.month) - 1] = item.actualQty;
                            }
                            if (item.plannedQty) {
                                planList[parseInt(item.month) - 1] = item.plannedQty;
                            }
                        }
                    });
                }
                this.setState({
                    chartData: [
                        {
                            title: `实际${title}`,
                            dataList: realList
                        },
                        {
                            title: `计划${title}`,
                            dataList: planList
                        }
                    ]
                    /*tableData: res.data.tableData.list,
                    tableTotal: res.data.tableData.total*/
                });
            }
        }).catch();
        IOModel.feitilizerTableDatas({str: str}).then((res) => {
            if (res.success) {
                res.data.rows.forEach((item, index) => {
                    item.id = index;
                    return item;
                });
                if (this.state.showChartsType === 'fertilizationTimes') {
                    this.setState({
                        tableData: res.data.rows,
                        tableTotal: res.data.total
                    });
                }
            } else {
                Modal.error({
                    title: '提示',
                    content: res.message
                });
            }
        }).catch();
    }

    queryFeitilizerCount() {
        const param = {
            startTime: this.state.startDateChild,
            endTime: this.state.endDateChild,
            cropId: this.state.cropTypeChild === -1 ? undefined : this.state.cropTypeChild,
            startPage: 1,
            companyId: 1,
            baseId: this.state.baseLandChild === -1 ? undefined : this.state.baseLandChild,
            landId: this.state.landChild === -1 ? undefined : this.state.landChild,
            limit: 10
        };
        const str = JSON.stringify(param);
        IOModel.feitilizerBarDatas({str: str}).then((res) => {
            if (res.success) {
                const realList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                const planList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let title = '';
                if (this.state.showChartsType === 'fertilizationTimes') {
                    title = '施肥次数';
                    res.data.forEach((item) => {
                        if (item.month === 1) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                                //realList.push(item.actualCount);
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 2) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 3) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 4) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 5) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 6) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 7) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 8) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 9) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 10) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 11) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                        if (item.month === 12) {
                            if (item.actualCount) {
                                realList[parseInt(item.month) - 1] = item.actualCount;
                            }
                            if (item.planCount) {
                                planList[parseInt(item.month) - 1] = item.planCount;
                            }
                        }
                    });
                }
                this.setState({
                    chartData: [
                        {
                            title: `实际${title}`,
                            dataList: realList
                        },
                        {
                            title: `计划${title}`,
                            dataList: planList
                        }
                    ]
                    /*tableData: res.data.tableData.list,
                    tableTotal: res.data.tableData.total*/
                });
            }
        }).catch();
    }

    queryFeitilizerTable(param) {
        const str = JSON.stringify(param);
        IOModel.feitilizerTableDatas({str: str}).then((res) => {
            if (res.success) {
                res.data.rows.forEach((item, index) => {
                    item.id = index;
                    return item;
                });
                if (this.state.showChartsType === 'fertilization') {
                    this.setState({
                        tableData: res.data.rows,
                        tableTotal: res.data.total
                    });
                }
            } else {
                Modal.error({
                    title: '提示',
                    content: res.message
                });
            }
        }).catch();
    }

    queryPlant(param) {
        const str = JSON.stringify(param);
        IOModel.proctectionTableDatas({str: str}).then((res) => {
            if (res.success) {
                if (this.state.showChartsType === 'plantProtect') {
                    res.data.rows.forEach((item) => {
                        if (item.actualQty && item.unitName) {
                            item.actualQty = `${item.actualQty}${item.unitName}`;
                        }
                        item.time = moment(item.time).format("YYYY-MM-DD");
                        return item;
                    });
                    this.setState({
                        tableData: res.data.rows,
                        tableTotal: res.data.total
                    });
                }
            } else {
                Modal.error({
                    title: '提示',
                    content: res.message
                });
            }
        }).catch();
    }

    queryGarden(param) {
        const str = JSON.stringify(param);
        IOModel.gardeningTableDatas({str: str}).then((res) => {
            if (res.success) {
                if (this.state.showChartsType === 'garden') {
                    res.data.rows.forEach((item) => {
                        item.time = moment(item.time).format("YYYY-MM-DD");
                        return item;
                    });
                    this.setState({
                        tableData: res.data.rows,
                        tableTotal: res.data.total
                    });
                }
            } else {
                Modal.error({
                    title: '提示',
                    content: res.message
                });
            }
        }).catch();
    }

    componentDidUpdate() {
        // this.showChart(this.state.chartData);
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'farmoverview_listByPage', 'show');
        if (this.state.activeNav === 0 || this.state.activeNav === 1) {
            if (queryRole) {
                this.showChart(this.state.chartData);
            }
        }
    }

    showChart(data) {
        /* global echarts:true */
        analyzeChart = echarts.init(document.getElementById('main'));
        analyzeChart.setOption(this.getOption(data));
    }

    getOption(data) {
        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: chartLegend[this.state.showChartsType],
                left: 30
            },
            grid: {
                left: '3%',
                bottom: '3%',
                right: '3%',
                top: '10%',
                containLabel: true
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    axisLine: {
                        lineStyle: {
                            color: '#999'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#999'
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
                        color: '#999'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#999'
                    }
                }
            }
            ],
            series: [
                {
                    name: data[0].title,
                    type: 'bar',
                    barWidth: 8,
                    itemStyle: {
                        normal: {
                            color: '#9cd0a0'
                        }
                    },
                    data: data[0].dataList
                },
                {
                    name: data[1].title,
                    type: 'bar',
                    barWidth: 8,
                    itemStyle: {
                        normal: {
                            color: '#8583cc'
                        }
                    },
                    data: data[1].dataList
                }
            ]
        };
        return option;
    }


    handleChangeWater(index) {
        // 异步请求 重新赋值  watering:'实际灌溉量', '计划灌溉量' ,wateringTimes:'实际灌溉次数', '计划灌溉次数'
        if (this.state.activeNav === 0) {
            if (index === 0) {
                this.setState({
                    showChartsType: 'watering'
                });
                this.queryWaterQty();
            } else {
                this.setState({
                    showChartsType: 'wateringTimes'
                });
                this.queryWaterCount();
            }
        }
        // 异步请求 重新赋值  fertilization:'实际施肥量', '计划施肥量' ,fertilizationTimes:'实际施肥次数', '计划施肥次数'
        if (this.state.activeNav === 1) {
            if (index === 0) {
                this.setState({
                    showChartsType: 'fertilization'
                });
                this.queryFeitilizerQty();
            } else {
                this.setState({
                    showChartsType: 'fertilizationTimes'
                });
                this.queryFeitilizerCount();
            }
        }
    }

    // 点击四个菜单事件
    handleChangeNav(index) {
        let type = '';
        switch (index) {
            case 0:
                type = 'watering';
                break;
            case 1:
                type = 'fertilization';
                break;
            case 2:
                type = 'plantProtect';
                break;
            case 3:
                type = 'garden';
                break;
        }
        this.setState({
            activeNav: index,
            showChartsType: type
        });
        const param = {
            baseId: this.state.baseLandChild === -1 ? undefined : this.state.baseLandChild,
            landId: this.state.landChild === -1 ? undefined : this.state.landChild,
            cropId: this.state.cropTypeChild === -1 ? undefined : this.state.cropTypeChild,
            startPage: 1,
            startTime: this.state.startDateChild,
            endTime: this.state.endDateChild,
            companyId: 1,
            limit: 10
        };
        //次数用两个方法为了测试显示数据问题，后期请修改
        if (index === 0) {
            this.queryWaterQty();
            this.queryWaterTable(param);
            //this.showChart(this.state.chartData);
        } else if (index === 1) {
            this.queryFeitilizerQty();
            this.queryFeitilizerTable(param);
            //this.showChart(this.state.chartData);
        } else if (index === 2) {
            this.queryPlant(param);
        } else {
            this.queryGarden(param);
        }
    }

    // 点击侧边的分页按钮
    onchooseChange(current, size) {
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
    }

    setDate(date, dateString) {
        this.setState({
            startDate: dateString[0],
            endDate: dateString[1]
        });
        this.query();
    }

    //点击分页
    onSizeChangequery(current, size) {
        const param = {
            startTime: this.state.startDateChild,
            endTime: this.state.endDateChild,
            cropId: this.state.cropTypeChild === -1 ? undefined : this.state.cropTypeChild,
            companyId: 1,
            activeNav: this.state.activeNav,
            startPage: current,
            limit: size,
            baseId: this.state.baseLandChild === -1 ? undefined : this.state.baseLandChild,
            landId: this.state.landChild === -1 ? undefined : this.state.landChild
        };
        this.queryTable(param);
    }
    onShowSizeChange(current, size) {
        const param = {
            startTime: this.state.startDateChild,
            endTime: this.state.endDateChild,
            cropId: this.state.cropTypeChild === -1 ? undefined : this.state.cropTypeChild,
            companyId: 1,
            activeNav: this.state.activeNav,
            startPage: 1,
            limit: size,
            baseId: this.state.baseLandChild === -1 ? undefined : this.state.baseLandChild,
            landId: this.state.landChild === -1 ? undefined : this.state.landChild
        };
        this.queryTable(param);
    }

    queryTable(param) {
        if (param.activeNav === 0) {
            this.queryWaterTable(param);
            this.props.page({current: 1, pageSize: 10});
        } else if (param.activeNav === 1) {
            this.queryFeitilizerTable(param);
            this.props.page({current: 1, pageSize: 10});
        } else if (param.activeNav === 2) {
            this.queryPlant(param);
            this.props.page({current: 1, pageSize: 10});
        } else {
            this.queryGarden(param);
            this.props.page({current: 1, pageSize: 10});
        }
    }

    // 选择基地
    onBaseLandChange(val) {
        this.setState({
            baseLand: val
        });
        this.setState({
            land: ''
        });
        if (val !== undefined && val !== -1) {
            IOModel.GetLandByBaseId({":baseId": val}).then((res) => {
                if (res.success) {
                    this.setState({
                        landList: res.data
                    });
                }
            });
        } else {
            this.setState({
                landList: []
            });
        }
        this.setState({
            land: -1,
            cropType: -1
        });
        this.query();
    }

    // 选择地块
    onLandChange(val) {
        this.setState({
            land: val
        });
        this.query();
    }

    // 选择作物
    onCropChange(val) {
        this.setState({
            cropType: val
        });
        this.query();
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

    render() {
        // const navNew = nav;
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'farmoverview_listByPage', 'show');
        const planRole = Com.hasRole(securityKeyWord, 'farmoverview_plan', 'show');
        const { baseList, landList, cropList, activeNav} = this.state;
        const wateringColumnsList = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 100,
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '时间',
                dataIndex: 'month',
                align: "center",
                render: (text) => {
                    return <span>{text}月</span>;
                }
            }, {
                title: '基地',
                dataIndex: 'baseName',
                align: "left"
            }, {
                title: '品种',
                dataIndex: 'cropName',
                align: "left"
            }, {
                title: '地块',
                dataIndex: 'landName',
                align: "left"
            }, {
                title: '计划灌溉量',
                dataIndex: 'plannedQty',
                align: "right"
            }, {
                title: '完成灌溉量',
                dataIndex: 'actualQty',
                align: "right"

            }, {
                title: '计划次数',
                dataIndex: 'planCount',
                align: "right"

            }, {
                title: '完成次数',
                dataIndex: 'actualCount',
                align: "right"

            }, {
                title: '降雨量',
                dataIndex: 'rainAmount',
                align: "right"

            }];
        const fertilizationColumnsList = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 100,
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '时间',
                dataIndex: 'month',
                align: "center",
                render: (text) => {
                    return <span>{text}月</span>;
                }
            }, {
                title: '基地',
                dataIndex: 'baseName',
                align: "left"
            }, {
                title: '品种',
                dataIndex: 'cropName',
                align: "left"
            }, {
                title: '地块',
                dataIndex: 'landName',
                align: "left"
            }, {
                title: '面积（亩）',
                dataIndex: 'area',
                align: "right"
            }, {
                title: '计划施肥量',
                dataIndex: 'plannedQty',
                align: "right"

            }, {
                title: '完成施肥量',
                dataIndex: 'actualQty',
                align: "right"

            }, {
                title: '计划次数',
                dataIndex: 'planCount',
                align: "right"

            }, {
                title: '完成次数',
                dataIndex: 'actualCount',
                align: "right"

            }];
        const plantProtect = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 100,
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '时间',
                dataIndex: 'time',
                align: "center"
            }, {
                title: '基地',
                dataIndex: 'baseName',
                align: "left"
            }, {
                title: '作物品种',
                dataIndex: 'cropName',
                align: "left"
            }, {
                title: '地块',
                dataIndex: 'landName',
                align: "left"
            }, {
                title: '地块面积',
                dataIndex: 'area',
                align: "right"
            }, {
                title: '农事操作',
                dataIndex: 'workOperationName',
                align: "left"
            }, {
                title: '使用农资',
                dataIndex: 'materialName',
                align: "left"
            }, {
                title: '使用量',
                dataIndex: 'actualQty',
                align: "right"
            }, {
                title: '抑制期',
                dataIndex: 'containment',
                align: "right"
            }, {
                title: '植保用途',
                dataIndex: 'purpose',
                align: "left"
            }];
        const garden = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 100,
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '时间',
                dataIndex: 'time',
                align: "center"
            }, {
                title: '基地',
                dataIndex: 'baseName',
                align: "left"
            }, {
                title: '作物品种',
                dataIndex: 'cropName',
                align: "left"
            }, {
                title: '地块',
                dataIndex: 'landName',
                align: "left"
            }, {
                title: '地块面积',
                dataIndex: 'area',
                align: "right"
            }, {
                title: '农事操作',
                dataIndex: 'workOperationName',
                align: "left"
            }, {
                title: '使用农资',
                dataIndex: 'materialName',
                align: "left"
            }, {
                title: '使用量',
                dataIndex: 'actualQty',
                align: "right"
            }, {
                title: '用量单位',
                dataIndex: 'unitName',
                align: "left"
            }];
        const dateFormat = 'YYYY-MM-DD';
        const date = new Date();
        date.setMonth(date.getMonth() - 3);
        const {queryFlag} = this.state;
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
        const baseLandOptions = this.getOptionList(newBaseList);
        const landOptions = this.getOptionList(newLandList);
        const cropOptions = this.getOptionList(newCropList);
        return (
            <div className='farming-box'>
                <div className='farming-search'>
                    <div className='farming-title'>
                        <div className='title'>农事分析</div>
                        {(queryRole || planRole) && <div className='search-layout farmover-search-layout'>
                            <div className='search-row'>
                                <div className='search-col'>
                                    <span className='label-title'>日期</span>
                                    <LocaleProvider locale={zhCN}>
                                        <RangePicker
                                            defaultValue={[moment(date, dateFormat), moment(new Date(), dateFormat)]}
                                            format={dateFormat} onChange={this.setDate.bind(this)}/>
                                    </LocaleProvider>
                                </div>
                                <div className='search-col'>
                                    <span className='label-title'>基地</span>
                                    <Select value={this.state.baseLand}
                                            onChange={this.onBaseLandChange.bind(this)}
                                            showSearch
                                            placeholder="请选择基地"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {baseLandOptions}
                                    </Select>
                                </div>
                                <div className='search-col'>
                                    <span className='label-title'>地块</span>
                                    <Select value={this.state.land}
                                            onChange={this.onLandChange.bind(this)}
                                            showSearch
                                            placeholder="请选择地块"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {landOptions}
                                    </Select>
                                </div>
                                <div className='search-col'>
                                    <span className='label-title'>作物品种</span>
                                    <Select value={this.state.cropType}
                                            onChange={this.onCropChange.bind(this)}
                                            showSearch
                                            placeholder="请选择作物品种"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {cropOptions}
                                    </Select>
                                </div>
                            </div>
                        </div>}
                        {/*<div className='right-data-range'>
                            <span>日期</span>
                            <LocaleProvider locale={zhCN}>
                                <RangePicker style={{border: '1px solid #ccc'}}
                                             defaultValue={[moment(date, dateFormat), moment(new Date(), dateFormat)]}
                                             format={dateFormat} onChange={this.setDate.bind(this)}/>
                            </LocaleProvider>
                        </div>*/}
                    </div>
                </div>
                {queryRole && <div className='card-four'>
                <Row>
                    <Col span={6}>
                        <Card className='number-card' bordered={false} bodyStyle={{padding: 0}}
                              onClick={this.handleChangeNav.bind(this, 0)}>
                            <i className='icon-warp iconfont icon-jiaoshui'></i>
                            <div className='content-analyze'>
                                <div className='item'>
                                    <p className='title-analyze'>灌溉</p>
                                    {this.state.data1["watering"] ?
                                        <p className='number'>{this.state.data1["watering"].qty}
                                            <span className='unit'>{this.state.data1["watering"].unitName}</span></p> :
                                        <p className='number'>0
                                            <span className='unit'>升</span></p>}
                                </div>
                                <div className='item'>
                                    <p className='title-analyze'>灌溉次数</p>
                                    {this.state.data1["watering"] ?
                                        <p className='number'>{this.state.data1["watering"].count}<span
                                            className='unit'>次</span></p> :
                                        <p className='number'>0
                                            <span className='unit'>次</span></p>}
                                </div>
                            </div>
                            <div className='border-right'></div>
                            {activeNav === 0 && <div className='border-bottom'></div>}
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className='number-card' bordered={false} bodyStyle={{padding: 0}}
                              onClick={this.handleChangeNav.bind(this, 1)}>
                            <i className='icon-warp iconfont icon-shifei'></i>
                            <div className='content-analyze'>
                                <div className='item'>
                                    <p className='title-analyze'>施肥</p>
                                    {this.state.data1["fertilizer"] ?
                                        <p className='number'>{this.state.data1["fertilizer"].qty}
                                            <span className='unit'>{this.state.data1["fertilizer"].unitName}</span>
                                        </p> :
                                        <p className='number'>0
                                            <span className='unit'>公斤</span></p>}
                                </div>
                                <div className='item'>
                                    <p className='title-analyze'>施肥次数</p>
                                    {this.state.data1["fertilizer"] ?
                                        <p className='number'>{this.state.data1["fertilizer"].count}<span
                                            className='unit'>次</span></p> :
                                        <p className='number'>0<span className='unit'>次</span></p>}
                                </div>
                            </div>
                            <div className='border-right'></div>
                            {activeNav === 1 && <div className='border-bottom'></div>}
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className='number-card' bordered={false} bodyStyle={{padding: 0}}
                              onClick={this.handleChangeNav.bind(this, 2)}>
                            <i className='icon-warp iconfont icon-yumiao'></i>
                            <div className='content-analyze'>
                                <div className='item'>
                                    <p className='title-analyze'>植保次数</p>
                                    {this.state.data1["protection"] ?
                                        <p className='number'>{this.state.data1["protection"].count}<span
                                            className='unit'>次</span></p> :
                                        <p className='number'>0<span className='unit'>次</span></p>}
                                </div>
                            </div>
                            <div className='border-right'></div>
                            {activeNav === 2 && <div className='border-bottom'></div>}
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className='number-card' bordered={false} bodyStyle={{padding: 0}}
                              onClick={this.handleChangeNav.bind(this, 3)}>
                            <i className='icon-warp iconfont icon-yuanyi'></i>
                            <div className='content-analyze'>
                                <div className='item'>
                                    <p className='title-analyze'>园艺次数</p>
                                    {this.state.data1["gardening"] ?
                                        <p className='number'>{this.state.data1["gardening"].count}<span
                                            className='unit'>次</span></p> :
                                        <p className='number'>0<span className='unit'>次</span></p>}
                                </div>
                            </div>
                            <div className='border-right' style={{width: '0'}}></div>
                            {activeNav === 3 && <div className='border-bottom'></div>}
                        </Card>
                    </Col>
                </Row></div>}
                {
                    (this.state.activeNav === 0 || this.state.activeNav === 1) && queryRole &&
                    <Card className='analyze-chart white-card' style={{marginBottom: '20px'}}>
                        <div className='table-header'>
                            <p><i className='iconfont icon-sort'></i><span>计划监控</span></p>
                            {(this.state.showChartsType === 'watering' || this.state.showChartsType === 'wateringTimes') ?
                                <p><Button
                                    className={this.state.showChartsType === 'wateringTimes' ? 'btn-common' : 'btn-common red-btn'}
                                    onClick={this.handleChangeWater.bind(this, 1)}>灌溉次数</Button>
                                    <Button
                                        className={this.state.showChartsType === 'watering' ? 'btn-common' : 'btn-common red-btn'}
                                        onClick={this.handleChangeWater.bind(this, 0)}>灌溉量</Button></p> : <p><Button
                                    className={this.state.showChartsType === 'fertilizationTimes' ? 'btn-common' : 'btn-common red-btn'}
                                    onClick={this.handleChangeWater.bind(this, 1)}>施肥次数</Button>
                                    <Button
                                        className={this.state.showChartsType === 'fertilization' ? 'btn-common' : 'btn-common red-btn'}
                                        onClick={this.handleChangeWater.bind(this, 0)}>施肥量</Button></p>}
                        </div>
                        <div id="main" style={{height: 400}}></div>
                    </Card>
                }
                <div className='content farmover-content'>
                    <div className='table-header'>
                        <p><i className='iconfont icon-sort'></i><span>农事分析列表</span></p>
                    </div>
                    {planRole && <LocaleProvider locale={zhCN}>
                        <Tables total={this.state.tableTotal} Alldate={this.state.tableData}
                                columns={this.state.activeNav === 0 ? wateringColumnsList : this.state.activeNav === 1 ? fertilizationColumnsList : this.state.activeNav === 2 ? plantProtect : garden}
                                queryFlag={queryFlag}
                                onSizeChangequery={this.onSizeChangequery.bind(this)}
                                onShowSizeChange={this.onShowSizeChange.bind(this)}
                        />
                    </LocaleProvider>}
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {slideName, Alldic} = state.farmoverviewReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['farmoverview_listByPage', 'farmoverview_plan'];
    return {
        slideName,
        dicList: Alldic, securityKeyWord
    };
};
export default connect(mapStateprops, action)(AnalyzeBar);