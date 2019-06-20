import {Component} from 'react';
import {Select, Icon} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import '../../index.less';
import './index.less';
import React from "react";
import Utils from "../../plantingmgmt/farmingplan/util";
import Com from '@/component/common';


class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: false,
            year: "",//选择的年份
            queryFlag: false, //筛选按钮
            totalcontractkey: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            zxtotalcontractvalue: [],
            fxtotalcontractvalue: [],
            maxmoney: 10000,
            currregion: '',
            showdetail: false,
            content: [],
            yearList: [],
            queryRole: false,
            downloadRole: false
        };
        this.refreshDate = this.refreshDate.bind(this);
        this.initData = this.initData.bind(this);
    }

    componentDidMount() {
        //this.props.Alldatas({companyId:1});  //进入页面请求列表数据
            IOModel.poorYear({':companyId': 1}).then((res) => {
                const data = res.data;
                const yearList = [];
                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const year = {};
                        year.id = data[i].key;
                        year.name = data[i].value;
                        yearList.push(year);
                    }
                    this.setState({
                        yearList: yearList
                    });
                    this.setState({
                        year: yearList[yearList.length - 1].id
                    });
                    this.refreshDate();
                }
            });
        this.props.superiorName({name: '政府扶贫效力分析', parentLeftID: -1});
    }
    setYear(event) {
        this.setState({
            year: event
        },() => {
            if(this.state.year) {
                this.refreshDate();
            }
        });
    }

    downloadAnalysis() {
        console.log("下载分析详情");
    }
    //柱图生成
    async refreshDate() {
        await this.props.Alldatas({year: this.state.year});
        this.setState({
            flag: true
        });
        /*await this.setState({
            zxtotalcontractvalue: this.props.GoBar,
            fxtotalcontractvalue: this.props.EntBar
        });*/
        await this.initData();
    }

    async initData() {
        /* global echarts:true */
        const ProjectBarChart = echarts.init(this.el);
        const go = [];
        const ent = [];
        await IOModel.PoorListByMonth({year: this.state.year,companyId: 1}).then((res) => {
            const goverment = res.data.rowGovernment;
            const company = res.data.rowCompany;
            if (goverment && goverment.length > 0) {
                for (let i = 1; i <= 12; i++) {
                    let bool = false;
                    let temp = 0;
                    for (let k = 0; k < goverment.length; k++) {
                        if (goverment[k].month === `${i}`) {
                            bool = true;
                            temp = k;
                        }
                    }
                    if (bool) {
                        go.push(goverment[temp].sumPay);
                    } else {
                        go.push(0);
                    }
                }
            }
            if (company && company.length > 0) {
                for (let i = 1; i <= 12; i++) {
                    let bool = false;
                    let temp = 0;
                    for (let k = 0; k < company.length; k++) {
                        if (company[k].month === `${i}`) {
                            bool = true;
                            temp = k;
                        }
                    }
                    if (bool) {
                        ent.push(company[temp].sumPay);
                    } else {
                        ent.push(0);
                    }
                }
            }
            this.setState({
                zxtotalcontractvalue: go,
                fxtotalcontractvalue: ent
            });
        });
        // 绘制图表
        ProjectBarChart.setOption({
            title: {
                text: '政府扶贫效力',
                left: 'center',
                y: '10px'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                x: '10px',
                y: '10px',
                icon: 'circle',
                data: [`政府扶贫投入(总计：${this.props.goTotal}元)`, `企业扶贫支出(总计：${this.props.entTotal}元)`]
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    splitLine: {
                        show: false
                    },
                    endOnTick: true,
                    data: this.state.totalcontractkey
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    boundaryGap: [0, 0.1]
                    /*min: 0,
                    max: this.state.maxmoney,
                    splitLine: {
                        show: true
                    }*/
                }
            ],
            series: [
                {
                    name: `政府扶贫投入(总计：${this.props.goTotal}元)`,
                    type: 'bar',
                    itemStyle: {
                        normal:
                            {
                                label:
                                    {
                                        show: false
                                    },
                                color: '#9cd0a0'
                            }
                    },
                    barCategoryGap: '80%',
                    data: this.state.zxtotalcontractvalue
                },
                {
                    name: `企业扶贫支出(总计：${this.props.entTotal}元)`,
                    type: 'bar',
                    itemStyle: {
                        normal:
                            {
                                label:
                                    {
                                        show: false
                                    },
                                color: '#8786ce'
                            }
                    },
                    barCategoryGap: '80%',
                    data: this.state.fxtotalcontractvalue
                }
            ]

        });
    }

    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'govermentaidanalysis_listByPage', 'show');
        const downloadRole = Com.hasRole(securityKeyWord, 'govermentaidanalysis_download', 'download');
        const {queryFlag, flag, yearList} = this.state;
        const {Alldate} = this.props;
        const yearOptions = Utils.getOptionList(yearList);
        return (
            <div className='farming-box gover-box' style={{height:'100%'}}>
                <div className='farming-search'>
                    <div className='farming-title'>
                    <div className='title'>政府扶贫效力分析</div>
                    <div className='search-layout' style={{width:'30%'}}>
                    <div className='search-row'>
                            <div className='search-col'>
                                <span className='label-title'>年份</span>
                                <Select className='goverment-year' value={this.state.year} onChange={this.setYear.bind(this)}
                                        showSearch
                                        placeholder="请选择年份"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                    {yearOptions}
                                </Select>
                            </div>
                        </div>
                </div>
                    </div>
                 </div>
                {
                   queryRole && flag === true && <div> <div id="ProjectBar" className='Project' ref={el => (this.el = el)}
                                                            style={{width: '100%', height: '450px', position: 'relative', background: '#FFFFFF'}}/>
                       <div className='content'>
                        <div className='table-header'>
                            <p><i className='iconfont icon-sort'></i><span>明细</span></p>
                            {downloadRole && <p><span className='hidden-content download-icon' onClick={this.downloadAnalysis.bind(this)}><Icon
                                style={{fontSize: 24, color: '#08c'}} type="download"/></span></p>}
                        </div>
                        <Tables rowKey={record => record.id} data={Alldate} queryFlag={queryFlag}/>
                           </div>
                    </div>

                }
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, GoBar, EntBar, goTotal, entTotal, slideName} = state.govAidAnalysisReducer;
    const { securityKeyWord } = state.initReducer;
    return {
        goTotal,
        entTotal,
        GoBar,
        EntBar,
        Alldate,
        slideName,securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
