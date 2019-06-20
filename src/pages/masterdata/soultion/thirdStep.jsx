import { Component } from 'react';
import {Button, message, Modal} from 'antd';
import {connect} from 'react-redux';
import {action} from './addmodel';
import './../index.less';
import './add.less';
import {OperationIOModel} from "@/pages/masterdata/operations/model";
import {ProgramIOModel} from "@/pages/masterdata/soultion/model";

class SecondStep extends Component {
    constructor(props) {
        super(props);
        const _this=this;
        this.state={
            name:'',
            taskList: []
        };
        this.tabX = false;
        this.getTip = this.getTip.bind(this);
        window.setStep = function (index) {
            if(_this.props.setStep) {
                _this.props.setStep(0);
            }
            if(_this.props.setIndex) {
                _this.props.setIndex(index);
            }
        };
    }
    getTip(params) {
        const {taskList} = this.state;
        const param = {};
        taskList.forEach((item,index) => {
            if (item.firstDay === params.data[0] + 1) {
                param.index = index;
                //param.periodName = item.periodName;
                item.periodList.forEach((i) => {
                    if (i.liveId === item.periodId) {
                        param.periodName = i.liveName;
                    }
                });
                if (item.delayType === 'week') {
                    param.periodDelay = `第${item.delay}周`;
                } else {
                    param.periodDelay = `第${item.delay}天`;
                }
                if (item.purpose) {
                    param.purpose = item.purpose;
                } else {
                    param.purpose = '无';
                }
                if (item.materialId === -1) {
                    param.materialName = '无';
                    param.plannedQty = '无';
                } else {
                    item.materialList.forEach((i) => {
                        if (i.id === item.materialId) {
                            param.materialName = i.name;
                        }
                    });
                    if (item.unitName) {
                        param.plannedQty = `${item.plannedQty}${item.unitName}/亩`;
                    } else {
                        param.plannedQty = `${item.plannedQty}`;
                    }
                }
            }
        });
        const res = '<div class=\'tip-layout\'>' +
            '<div class="tip-layout-title">任务详情</div>' +
            `<div class="top-line"><label>生长周期</label><span>${param.periodName}</span></div>` +
            `<div class="top-line"><label>执行时间</label><span>${param.periodDelay}</span></div>` +
            `<div class="top-line"><label>用途</label><span>${param.purpose}</span></div>` +
            `<div class="top-line"><label>推荐农资</label><span>${param.materialName}</span></div>` +
            `<div class="top-line"><label>农资用量</label><span>${param.plannedQty}</span></div>` +
            `<div class="top-more" onclick="window.setStep(${param.index})" ><a  class="link" >点击编辑 ></a></div>` +
            `</div>`;
        return res;
    }
    async componentDidMount() {
        // 数据整合
        const {cycleList,type,taskList}=this.props;
        // 左侧数据整合
        const workList = [];
        await OperationIOModel.GetWorkType().then((res) => {
            const list = res.data;
            if (list.length > 0) {
                for(let i = 0; i < list.length; i++) {
                    workList.push(list[i].name);
                }
            }
        }).catch();
        // 上面数据整合
        const periodsList = [];
        let allDay = 0;
        let firstDay = 1;
        let totalDay = 0;
        if(cycleList.length > 0 ) {
            for(let i = 0; i < cycleList.length; i++) {
                const count = {};
                if (type === 'week') {
                    allDay += cycleList[i].duration * 7;
                    totalDay = cycleList[i].duration * 7;
                } else {
                    allDay += cycleList[i].duration;
                    totalDay = cycleList[i].duration;
                }
                if (i > 0) {
                    if (type === 'week') {
                        firstDay += cycleList[i - 1].duration * 7;
                    } else {
                        firstDay += cycleList[i - 1].duration;
                    }
                }
                count.id = cycleList[i].liveId;
                count.firstDay = firstDay;
                count.name = cycleList[i].liveName;
                count.totalDay = totalDay;
                periodsList.push(count);
            }
        }
        // 下面数据整合
        const dayList = [];
        for (let i = 1; i <= allDay; i++) {
            dayList.push(i);
        }
        // 中间数据整合
        const wList = []; //灌溉
        const pList = []; //植保
        const fList = []; //施肥
        const gList = []; //园艺
        const hList = []; //采收
        if (taskList && taskList.length > 0) {
            for (let i = 0; i < taskList.length; i++) {
                let firstDay = 1;
                for (let k = 0; k < periodsList.length; k++) {
                    if (taskList[i].periodId === periodsList[k].id) {
                        firstDay = periodsList[k].firstDay;
                    }
                }
                if (taskList[i].delayType === 'week') {
                    firstDay += (taskList[i].delay - 1) * 7;
                } else {
                    firstDay += taskList[i].delay - 1;
                }
                taskList[i].firstDay = firstDay;
                if (taskList[i].code === 'watering') {
                    const data = [firstDay - 1,'灌溉',firstDay - 1];
                    wList.push(data);
                } else if (taskList[i].code === 'protection') {
                    const data = [firstDay - 1,'植保',firstDay - 1];
                    pList.push(data);
                } else if (taskList[i].code === 'fertilizer') {
                    const data = [firstDay - 1,'施肥',firstDay - 1];
                    fList.push(data);
                } else if (taskList[i].code === 'gardening') {
                    const data = [firstDay - 1,'园艺',firstDay - 1];
                    gList.push(data);
                } else if (taskList[i].code === 'harvest') {
                    const data = [firstDay - 1,'采收',firstDay - 1];
                    hList.push(data);
                }
            }
        }
        // 颜色整合
        const colorList = [];
        for (let i = 0; i < periodsList.length; i++) {
            if (i % 2 === 0) {
                for (let k = 0; k < periodsList[i].totalDay; k++) {
                    colorList.push('rgba(0,255,0,.1)');
                }
            } else {
                for (let k = 0; k < periodsList[i].totalDay; k++) {
                    colorList.push('transparent');
                }
            }
        }
        this.setState({
            taskList:taskList
        });
        const _this = this;
        /* global echarts:true */
        const myChart = echarts.init(document.getElementById('main'));
        /*const colorList=['rgba(0,255,0,.1)', 'rgba(0,0,0,.1)', 'rgba(0,0,0,.1)','rgba(0,0,0,.1)', 'rgba(0,0,0,.1)','transparent', 'transparent',
            'rgba(0,0,0,.1)', 'rgba(0,0,0,.1)', 'rgba(0,0,0,.1)', 'rgba(0,0,0,.1)','rgba(0,0,0,.1)', 'rgba(0,0,0,.1)','rgba(0,0,0,.1)',
            'rgba(0,0,0,.1)', 'rgba(0,0,0,.1)', 'transparent', 'transparent'
        ];*/
        const Option={
            title: '',
            tooltip: {
                triggerOn:'click',
                position: 'right',
                formatter: this.getTip,
                backgroundColor:'#fff',
                textStyle:{
                    color:"#333"
                }
            },
            xAxis:[{
                //坐标轴在 grid 区域中的分隔线。
                axisLabel:{
                    interval:0,
                    align:"right",
                    formatter:function (value) {
                        const number=Number(value);
                        if(_this.tabX) {
                            return `第${number}天`;
                        }else {
                            if( number%7===1 ) {
                                return `第${ Math.ceil(number/7)}周`;
                            }else {
                                return '';
                            }
                        }
                    }
                },
                data: dayList
            },{
                position:'top',
                axisLine: {show: false},//上线
                axisTick: {show: false},//刻度
                boundaryGap:true,
                axisLabel:{
                    interval:0,
                    textStyle: {
                        fontSize: 14
                    },
                    align:"right",
                    formatter:function (value) {
                        //let title='';
                        const number=Number(value);
                        //计算方式为第一周期天数，然后除以2，显示中间一个
                        for (let i = 0; i < periodsList.length; i++) {
                            if (periodsList[i].firstDay === number) {
                                return periodsList[i].name;
                            }
                        }
                        /*switch (number) {
                            case 1:
                                //育苗期时间长除以2，
                                title='育苗期';
                                break;
                            case 6:
                                /!*育苗期时间+1*!/
                                title='伸蔓期';
                                break;
                            case 8:
                                /!*育苗期时间+伸蔓期+1*!/
                                title='膨果期';
                                break;
                            case 17:
                                /!*膨果期时间除以2+前几期+1*!/
                                title='成熟期';
                                break;
                        }
                        return title;*/
                    }
                },
                splitArea:{
                    show:true,
                    areaStyle: {
                        color: colorList
                    }
                },
                data: dayList
            }
            ],
            yAxis: {
                axisLine: {show: false},
                axisTick: {show: false},
                splitLine:{
                    show:true
                },
                data: workList
            },
            dataZoom: [{
                type: 'inside',
                show:true,
                xAxisIndex:[0,1],
                start:0,
                end:50,
                zoomOnMouseWheel:false
            }, {
                type: 'slider',
                show:true,
                xAxisIndex:[0,1],
                start:0,
                end:50
            }],
            series: [{
                name:"采收",
                symbol:'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAgAElEQVR4Xu19C5hcVZXuWqceXVWdDjQEJAgxEpQkTJiYZIgOEJQkSIAZCIxRQQeCcAMT01XdyoBz74zt3LnXQbzpqooM9Hg1Ea4GgoAwIvJQlAgaHhJAMEwYBHkKSOfVVdX1OOt+a3eftqq6HudZdc6pvb8vXyB99tpr/3v/vV/rgSCLREAiUBcBlNhIBCQC9RGQBJGzQyLQAAFJkBZOD9q48ZBcONyjlEo9JVXtQUWJEdHBSNRDitLDf7M6hLgfVXW/+BtxD6lqJqAo+9VAYH8kn9+PAwPvtlDtjm5KEsTG4c9+4xvvo2LxRAI4AQCOAsQjgei9/DcC9NrYFBDACBC9DoivAQD/eRWJnomGQttx/fo37Wyrk2VJgpgcfbrmmp5cJHIiEC1VAT4CACci4uEmxdld7XUgehQRHwWARyO53KN41VX77W6kE+RJgugYZRocDBYOOuiEQiCwlAkBREyGuQDgFfyIiHYBwA5A3BHiP0cc8TSuWVPS0f2O/sQrA9zyQaLh4dhYLrdMJTqdAE5HxONbroSDDRLRs4h4r0J0X1c0uh3Xrcs42JxnRUuClA0dDQ+HxnK5lSWANUB0DiIe7NmRNaA4Ee0BxDsCANu6IpGf4Lp1BQPVff1pxxOkU0lRb1ZXkGXmzPs7fRvWsQSh666blikULgSA/4aIi3z9a9Bk5wjgCQD491gw+D1cv/6ASTGertZxBKF0+rCsqn6BEK9AgOmeHr0WKU8AexHg+ihREhOJP7SoWVc00zEE4TcKKJWuJoCLASDiCvS9p0QOiDZjIHBtdMOG33lPfeMa+54go5s2HamUSv9EAJ8DxKBxiGSNKQgQFQHgm1FF+TL29b3tZ4R8SxB+yMtGIv8ARHFAjPp5ENvWN6L9CPC1yNhYyq8Pkb4jCA0OhrO9vesI4B8R4LC2TZ4OapiI3gLEf46NjAzj4CCvLr4pviLIaCp1DhJdA4jH+WaEvNWRXUR0ZXci8UNvqV1fW18QZDSVWoxEKUA8yS8D4+l+ED0cUNV1XQMDz3q6Hx6yJaqJM6XTXRmiLyPAFwEg5PXB8Jn+BSK6NqYo/4x9fWNe7ZtnV5BsKnUyAXwbAD7gVfA7RO/dCHBJNB7/hRf76zmCsGlINpf73wDwBa+vgF6cMCZ1JiD6ejQa/e9es/PyFEFyQ0PHlBRlGwIsNjlQslobEWDTFUQ8N9bX92ob1TDUtGcIkk2nLySiGwBgmqEeyo9dhYDwhARY2x2P3+kqxeoo43qC8EE8q6r/FxA/4wVApY66EdgULZWuwoGBrO4abfjQ1QQRWyrEu/zmrNSGcXZlkwTwTKBUOi8yMPCCKxV08yFXPPoB/D+5pXLr1LFJLyL2lV8bSyRus0mirWJcuYJkksmrAPGrbiawraMghREBbOiOx69zGxSuIggNDiqZgw/ejIh/6zagpD4tQIDoG9E9e+I4OKi2oDVdTbiGIJROT8+o6jZE/LguzeVHvkSAiO6NqepqtxzeXUEQjiCSzeV+AgAf9uWoy04ZReCRaD5/Ol555ajRinZ/33aC0PDwQdlc7seSHHYPreflPRJV1bOwv39PO3vSVoIwOTLZ7EOIyKE6ZZEIVCBARDtjRB9rJ0naRhD6t3/rzeTzD8iIIpIVjRBg85RYKLQS/+7v+AW+5aUtBJHkaPk4e7pBQZJ8/tR2nElaThC69truTCjE2yoZi8rT07bFyhM9FC0Uzmw1SVpKEA4CnentvQcBVrQYXtmcDxAgovtje/ac2Uq/95YSZDSV2oIAF/lgrGQX2oQAAWzujscvaVXzLSPIaCo1iABfblXHZDv+RYAAvtIdjw+2ooctIUg2mfxbQvxOKzok2+gQBBDPj/X13e50bx0nSC6ZPE5F/DUAxJzujJTfUQhkAqq6pKu//7dO9tpRgtDGjdFsIMDk4GxMskgEbEWAAJ6LlUpLnLTbcpQgmVTquwBwga2oSGESgTIECOA73fE4ByR3pDhGkEw6nQCiIUe0lkIlAmUIoKqujfb3b3ECFEcIMpZOzy8RPSbPHU4MmZQ5BQGiUQwEFjiRksF2gnDcqkw2+6T0I5cTucUI/CoaiSyzO+6W7QTJpFJJAIi3GBzZnEQAgOiaWCJxtZ1Q2EqQbDp9ChE9ZKeCUpZEwAACpaCqnhju7+ebU1uKbQSZCAnK0bxlrFxbhkYKMYOAsPwdGTnRLr922wgiTUnMDKes4wgCiP2xvj7e6lsuthAkt3HjsaqiPAuIYcsaSQESAesIHIBSaW5sYOA1q6JsIchoMvljGY3E6lDI+nYiwNFRuhOJM6zKtEyQXCp1hgpwj1VFOql+4IMfBCgWofS73/HNSyd1vaV9VQBWReJxDghiulgiyETCzKf8bmuFBx0EtHevaZAnK4ZC0LV6NShHHCH+SX3rLcj/4AdAuZx12VLCFASErdbIyAIrB3ZLBMmmUlcTAIcI9W0JfexjEFywAMa2bQP1zTct9TO4cCGEli2rkMEkGbvtNoBCwZzsUAiUQw4BGh0FOnDAnAw/17J4YDdNEBEJkej3CHCQb/ENBCB6+eUAgQAUH38cCo88YqmrwY98BEJ/8RdTZJRefhnyd92le7uF3d0QOuUUUN77XuD/1gpls6C++ioUd+4E9Y03LOnql8pEtCcWjc7GdetMbQFME6QTrnVx2jSIXDLu3Vl67jnIP/BA5bxBhCBPeFUF9bXXmk5K5dBDoevCC2vOvcJjjwFGImI14NVEWxHUiZVB/P/oKGA4DJE1awAikYZzuPjkk1DYvt0v89xSP6x4IJoiSEesHjwk4fD4ClKPIADjZ4qjjxbf0J49kP/pT8Vv8erCE58Jpxx+OAT/8i9rDnj+/vshvHw5gKJYmhBa5eLTT0PhZz+zRZaXhVhZRUwRpBNWD21CRNauBezpgeJjj0Hhl7+cOk+CQeg680xQZs8e/5mqQm7LlorzgFg5PvlJsVXL//CHwIf+6rOIINi+fWKlCn7YvhDFhfvvh+JvHXW68wR3zK4ihgnSMavHxLCHTjoJgosXQ/7ee6H0/PN1J0No6dLx7ZaiQG7zZqD9nBdmvIQWL4bgSSeN/0+pJA7lgeOPh+Dxx0+Rx7/1+ZaLVxo7ijjf3OmJdIB2dLeuDLOriGGCdJojlDiHfOYzkL3xRoBMpuEg4sEHC4LQu+9WfMfnhvBf/zUoRx4p/p0yGRi79VboOv98se2qKESQv+8+CH/cniwQvO3L3XST7gsAR2dpu4WbuNEyRBDati2QfeON3wPA+Eh3SOEtVvmKYKrbgQCETz8dAh8Yt+XkWybetjFxqotYRQ47DJSZM001VV2Jt258C1d87jmxBezg8mp05szZuGZNSS8GhgiSSaU+BQBb9Qr34neB2bOh9NJLNVXnrU/wz/5MTFycPl2sFIWdO6FkYI8fnDsXgsuWiRsrvmXiVSUwZ05le4WCOFyHVq60FUJ+Jynu2AHFZ9noumPLp2Px+M16e2+MIMnkY4C4RK9wN3+nvOc94gW74oVcUSD6+c9DrSvSWo98on9EkL3+emE6oruEQuK8Epw/H/L/8R/jB/iqwofr4Kmnimtdu4v6+uvAN2a2WAfYrZzT8oh2xBIJ3bcgugmSSac/DEQ1rnGc7pEz8sNnnw2BY46B0iuvQOnZZ6H0wgti+xG94gqAUEhMXGErNVH4N71y1FGA+CfI2IqKJ5v6yiumlOStG0ajEDrttCmH8tJ//idAMCh0dKSUSmI1KTz+uCPi3Sw0qKofCvf379Sjo26C+CquLr+Qr1snJqBW+BWar0ODxx47vn3KZMRtFN86OV3EDdjSpRXN8OpW/NWvIPTRjzrafOnVV6Fwzz3A/e+UgkTD0URi/IGrSdFFEM7nkS0U+PXLF9ERA+97H4TPOacZNlC4914oNrjaZQF8C8XbL5YpjBoPHBBnGPFmotO+ig/kXZ/+9BR98j/6EYTPPLOpnlY/4F8G/D5j1dbMqh4tq080Go1GD8d16xpfS+rNQ+63q11+pONJ3ayoIyNQeuwxKO7eXXslicUg+tnPAnR1TZ3cDzwgHv30lshll4ntVnnhtxe7rnub6lEsCpKUfs+XlP4vBHBFdzx+Q7Oe6lpBMsnkrwCxcg/QTLKLfx656CLx215vEdsvPqc880zFdS+fIZhsfCOlFd4a8bmk+NRThq5UeQXhlaS8FB56SJitBE44Afj2q3xLqFd3Q9+pKuTvuQdK//Vfhqp58mOdh/WmBMml03NUot16Vxu3g6X09kIX/9Y3U4jEwb309NO2/6YNr14NgQmbLk21Al/J7tgh/pdvs/j1PcDXzL29ZrTXV6dYhLFbbgH1j3/U9713vyKlVPpgZGDghUZdaEoQv/l8BD/0IWEqbrXwC3XxmWfEDRjl81bFQXjVqslHxEmC8Pbul78Uxo3B446D0osvgvrii0CqCoH58yHIj45lFw2WlZgQwI+iObYcaMEFhV06m5GDAF+KxuP/aokgo6nUTgT4czMKuLFOrd/UlvQsFqG4axeU2AejysTEiNzwX/0VBN7//ooqTA42gw+dfvr4FkubwGNjoL78srhepmJR+IXYvQUrPvKI/6+AdWyzGq4gY5s2zS2pqn9MQYPB8XeOsrcMI5O42bfi7MGrCh/qDZp01DoX8RmEnZ/C554LgVmzajevqlB67TUgfovhNnt7IcDvNQbOWLUE09gY5L75TcP9aIaRy37edJvVkCCjqdTlCHC9yzplWp3Asce27Nq0+JvfjB/qR0eb68vvMuvXT/mOrXDZGrfWAb6eUPWdd8RWjN55R5xb8OijxdkGY8Zv6NnqmB3B/Fya3WY1JojPwvmEli+vaWLu2AQgErdZvBI0Kmz2UsvcRDObj3zucxWutXr1LTz4oFjRuLBPCjt2iT/svDV9etOVNH/HHcLSwOflzlg8fm69PtYliAglms0e8FMwuFpvDU4PvrCkfeopYcpSzyKYX8uDJ5xQoQqvPLlvfUv8W7Svz7Ca4qDNZu71bMQQxTaMTfSVGTPGCTRjBiC7/CIK78jc1q26HzsNK+iSCgSwNzYycjgODta8aalLEL/Fu2IHpK5PsTFy+4r69tugvvCCONRPkiUQAEHcKqNEzV0Wu7ogwmYxBgv7m8jADfpAaxQ/qy5B/OZWGzrxRFtdWfVBX/8rnryah2Iteytte8Ov60wgI0UGbDCCFkAjd9y6BMmkUuztf6qxptz7ddeaNZMB21qhpYhAwgdjEzdmbIae+86fsmaHliypG+ihui98SOeHPr+/Ydg8hj+PxeM1rUJrEoSIMJtOsyFX49gyNmvplDiz2xTT+hCNT/BSCTjMaHDRIkOHbHaW4i1WeWFPxPCKFcIUv15hI0k2FdFrJGm6f36rSJSNxuPdiDglDmxNguSHhhYWFeVJv+DAj2j82NaqIm6ufv5z0RyvImzawiTVW9g1ll1k+aBcXtj2i52slFmzxIGaOH7WyIh4oFRfeqnCf0VvW/K7cQTq+YjUJIjfrHfDZ5whfpO3pBQK41FNJuLtcmAGfuk2U9juK3/33X5/rDMDje116r2H1CRINpm8gRCNX53YrrY9AvkWyMhvcCutspNT4dFHhQgjZ4d6bbJPiPB2lMVRBOo5UdVeQXxk3s6usl1/8zeOgqsJL/dCFI9/n/iE5SiJTA4miSwOI1DHLmsKQSYO6Bwm3LhtgsN9MCOeLWH5N3krimbgx6tV1wUXiIiMlgsf+G+6acp5xLJcKaASAfYyjMd7qg/qUwjiNwNFnqh8oG1FKT78MBR+/etx48Iq3w4r7bPbL7v/yuIsAgFFmde1YcOu8lamEMRPsa/Ko7M7C+24dBGhXVWnBGCwo+2xrVuBX+JlcQ4BUtXV3f39P2hMkHQ6AURDzqnROsmc+IYT4LSqcNADPnuYeRxspiO/vI99//syhGgzoKz8vEZo0lorCKfPjVtpxy11azkhuUU3M3rw7RjfksniGAKpWDyeaLbF4iWmeUwcx3S0SXBZdiibJLpCTIeYoLcL6ymm71NWEL+42OqNfWVpJFRVvJiLQApVEUksyW1Qmf3f89//PrDNlSz2IkAAT3XH4xXxoKYSJJl8ExHfY2/TrZcWOvVUCP65s670mkmJlddyM8iI9Ak33yyTdpoBr9EvH6I/dCcS4ymIJ0oFQfzkJMW5Bafk3rAT0AmTEm6Dr5JbXdhOa+z22yVJ7AV+LBaPVxjoVhLkuuuOyBaLnk+Pain2lU7AJyOOrFghDAjtLHydy4dxkc32tNPqihYhQ9lvfGTEzuY7WlZUVXuxv3/SSrSCIH55JLQr9lW9mTJpUsLpEi69tKEJutHZxlFMCr/4xaSBIqeN5vTRdXUZGxuPq+vz4ApGcTT7ffVjYQVB/JLiQMSJWrJEBJR2ohQeeEBka7LbjL6WHwjrXyuoXHW/ODI9v+QzeWWxgADiR2J9fZN36RUE8ZsfuvCfWLBgPJJJVWBosxCKYAYcdZAn7llnTc0OZUYw5yXkJKGcE6RWURToOvvsP2XSrdcGZ6Z65BHgkEPSo9DMQABU+6dXEGR0aOhcVJQ7zIl2cS1FEROZr2Ot2kjl77prMkVb5PLLbckA1SyDrkBWUcZXkup0bTVgF7lFOC7Xzp1yRTE4LavNTTqDIGUgcZgbzjMoVhUDXn4sQph73HqrkIaHHgqRCy80CP/Uz8sDVDcVhgihk08GPmPpKhx1cfduKDzxhAgkJ0tzBBoSxE+Gik2hCARENqnAggWT6Zmb1eG3B/Wtt8RnfHMVYh9xC4VTG/BVrdEiIkSyC7HewNW8heOV7+WXjTbVid9XJPmsWEGyQ0MXk6Js7jRUONKg2H7Nm1fX85BD9PBWSCtW/Uw49u3YjTeaTn3GQd/YlVgYR+ooIpAcp5STpSECqKpro/39W7SPJEHK4QoExqOQ8KpyRNmDqqqKKCXlkRGt+rmLRDUc5NpKQRS3dRzzCwKBppKyHIzaplyEvIJyoh0mOjuIccYuvmrmnIdeLg0J0lFbrCajyE5WvKoE580TB17OaV5e2I2X3XnNFE5OM/bd75qpWrMOn6s4+FzdCPCcrTqbHY/WblNh8xoIh0VQCb7N02zRtCtwm5pph5j6Wyzf3mJZgTkYBFSUKUlyImvXmnaptWX1qNEnsVVctEiQutonhfOu81uJ3sIpFMpXA74YoLffnvy3RvGCtVVFxCVmE30DuRr16ufUdx1/i2UXsJFLLzWVUoCDSWeHhx19p+DI7YHZswF5m4gIpd/8pulLO68CPLGL27eLvzkSDG+heEXgokWG4YsFvv3Ta70szlpbtgiZXigN30H89lDo5ICY9XXnc4eIftjGwgSKXHyxmLRMAP5/LS0d24Hxv5WnpeaVQKRLMFG8RhBU1Y9F+/s57K4ovjQ1MTGOhqsEly6F0FLjiX/L42YZbtRiBd42qfv2CZ95sQ2rU7QtksXmRHVhW9YkP4od7dgmo5GpiV+MFW0Dq5GgYFD8Fjaauan6utgJXcVv+7ExsULwVohXALFtYn1NrgRm9eS2c1smb03NimlZvYbGiuQTc/dWoSmC0q1ereuKdVInjnPFe/L9+21Xk7dJylFHCVIIk/nt2ycfM/mwbPVh04zCnA6OLwi8cgZpaO5O6XRXloht4X0R1d3MgBqtI161V60yFMnEzvwd2grBNlrtIEAjvPhqnPvqodLYYYo7kkmlOGujuQt+DyFhp6oiNQGTRG/hmyx+kygU9Nao+E7EGe7qElsnbdtk57nBlFJVlTx39hjX//VYPF4Rady3QRvsGGQjMoQR4aJFuqtYeQvRHML4GlaPda9upWz80IsPhrqCNmRSKX+E/bFxsHWJCoVAPB5G9O1Oi88+C6Wnn4bA3LlQ2rVrStRE7eqVJ5q2f+ebJ45mwlspve8QunR34CM+e7Cno8dK87A/mVTKN4HjWj04geOPh/Dy5eIRUKRgq7oxKv32t6D+4Q/A5xb27+D9ufZAl7/99gqSaKsEk4NfsFlWq2+grOInLiP27bMqppX1dQSO81Ho0VYiq7XFASPUvXvFoV1Edpw1S/yIM9sW7rtvUiW2wlVmz558S2EiMElEoO2uLggcc4y4kfJyMWvO37Y+6wk9mkunz1KJPLc2tg3Usob5PCAm+ERK58LDD4uACzzZ87fcAsFly4QfCZ8d+NpVOeYYU4+NbuirHh14O8hRV7xyxasgnh3p67u7vG++T3+gZyDt+IbPBOXmGWLV4FyDE7ZNtRysrJhw2KGzkzLY9J3PIF4hB2OhK/2BSKCTSu0HxG4nAfSDbD4nBN7/ftGVetshYdG6c6cw72hVGjg3YMsEGbvtNjeooleHTLSvb1rTBDosLeOjFGx60Wn2nWZ3xSbj2m9+foOQpT4CYgV99FFvHNT1pmDj7votiafRScxGfVw0fwjN+lWTw4dPrx+gjWJi9nvNYpjPXW4uRpN4fh4QN7m5Q07oxlsgHlBh7bpwobhVYpsmPnzzdaws5hDwRHYsog2xROIb1T2smeU2PzS0sKgonjKiMTJ0fJhmV9HqO3r+99JTT4nbJb55YrKU2BuOfa5tjr9rRF8vf2sorFEbOxpU1Q+F+/t36iIIH9Qz6fTbCHBoG3W2vWktuACvELwy8G82YaoxYRqu3UK5za7JdiBaJFA4S23d6vozCBG9G4vHZ1Qf0BmmmisI/2A0mfwxIn68RVg60gyfHXhrxFetOGMGhJYtq2iH98V8lhBbKwtec44o7xOhHiHJFBMTDf76BEmlBhHgy14cJ36TEC/R/KdFmZ+8iJPTOrPPC3sTuv6ADvClaDz+r7XwqEsQr0V61w7Y3Mmu886Tt0xOz34d8rWgD65/LKxysy3vWl2CTGyzRhDxYB1YtP0TXinEdmnaNP2xa9uutf8V4K2ryITlUqNFAtjbHY/XneMNCZJJJm8GxE96YRiFR90pp3jO4tUL2FrV0dWehUS3xBKJT9XrY0OCeCVWr215OqzOBFl/CgJu90mvDjVa3YHGBEmlZhGAq0OC1zISlPPUHQh4wasQAd4Xjcd/b2oF4UpesMsyG8TNHdPIv1qwJYKrg1nXsb/SfUgXBPGAA5XZIG7+nZru6JnrX9FrOEgZ2mLxx3T99Ydn83mOaR9yB+xTtZAriDtHhs15XPwGUogWCkfiF7/YMPVWwzOIBrvbAznwG0j4/PPHvflkcQUCrl89AOq+nhvaYvHHbk6LoNlXBRYu7CiHJFewoIESbvdHr05zYPqQLrZZg4PBTG/v6whwmNsGhu2r2DRdFvch4FYzdyJ6J7Znz0wcHCw2Q03XFksc1l0cDkjEkFq2TNhfyeIeBFx8izUlvI+lFYQru9lHhLdZbKrutbhR7pnKzmji1hf0er4ftVDQvYKIs0gq9TgCLHYGTvNS+bEwfN558gxiHkLba7Il79j3vue6qCYE8ER3PL5Eb4cNEcTNST45HKf0+tM77M5/x4f0PIdNdZ+RYkWSzmZIGCIIbdsWyL7xxksA4JqQf+KKl7OsejwKYbOB8urPXWZu8np05sxZuGZNSS+ehggiDusufFkPrVzZMKWYXjDkd/YhIBKC7twJpZ073bPN0vFyXo2AYYLQ8HAsk82+5iY/EY5ZxeYmsrgHAbflByGiPTFVPRIHBrJGUDJMkInDumvccWuF9GQdOS4s73+1q18eMI72x3vjwPz5k1lda4HFdctf5dlku94VMstU3juec4X/u7hjh7gwMFq4Dd4uarLK69cLIsEHYezpMdqUY99X6+kmUxMC+Ep3PD5otPOmCELDwwdlstmX3LKKcKC30FlnTd5icfRDzosnrn8vuEBM2upk9lp6AQ0wJkWR/ac5DzhHs+C6HDkxnxe3Mfzfmltv4e67RXv8s9zmzaINLvwdF+3xstYE5nZYDk9sQdh9+4TfvFZX9GXlyoqJz+8JvEIyeUT9np7xmL/79lWQsbq98ncIrT/1wp8yZvxLoNbP9UR50QJVs+7aLxO3vKaz12AMcRb29RnOxWCKIG5bRVgfzaK3OnFLua969W+P8Nlni8HkycHkqPadZhJxSCAmlzbwWjA5bUvH5ONJzXU5lJBGLl6lOP+H8HTkaCrhsNiTi+8nAtHVe0gT5jNLl0Jg3jzQHI64DWXePEH88qKdv7Q+aESutcVhImpE04igpV1g3fnf2GSHzw2abdtk+xM5ELXQq6yDSCv99tuC6JpRopAxZ474ReOWGyyzq4cYS6NLjva921YRsT057DDb/Q80glWTQCOC2YAEPFGZLFZL+UQXk3bOHPFg2ih5ppjEHAgvHAb1xRenZLdiOSIyDBOyLMd5o182VvvhVH0rq4clgnDlbCp1NQF81anOSbkSAcsImLi5Km/T9ArCQmhwMJzp7X0SAeZb7ogUIBGwH4Fd0ZGR43FwUDUr2hJBuNFcKnWGCnCPWQVkPYmAUwgoAKsi8fiPrci3TBBu3A9hSq2AKOu6DwEiurc7kTjDqma2ECSXTs9RiTgy9jSrCsn6EgHLCBCNKkQnRPr7X7QqyxaCiFUklbocAa63qpCsLxGwigABXNEdj99gVQ7Xt40gLCyTSm0HgJPtUEzKkAiYQYCI7ulOJM40U7dWHVsJktu48Vg1EODEO3KrZdcISTm6ESCAfaAo87o3bHhdd6UmH9pKELnVsmtYpBwzCNi5tdLat50ggiTJ5I8QcZWZTso6EgEzCNh1a1XdtjMEGRqaiYi7Za51M0Mt6xhFgABGYsHgfFy//k2jdZt97whBuNFsKnURAWxppoD8uUTAMgKqekGsv3+rZTk1BDhGEEGSZPIGQlznhOJSpkSAEaiX39wudBwlCAecy/b2Piivfu0aLimnAgGih6N79nxUTwA4s8g5ShBWir7+9RnZYPDXgHi0WSVlPYnAFASIXokWi4uaBZ+2ipzjBGEF80NDiwqK8iACTLeqsKwvEeD3jpCqnhru72fzJkdLSwjCPZUm13AAAATsSURBVMil0ytUoh+5OY2Co0hL4XYhUECAVdF4/Cd2CWwkp2UEEYf2oaGLSVE2t6Jjsg1/IoBEF0UTiRtb1buWEoQ7NZpM/k9E/B+t6qBsxz8IENG/dCcS/9jKHrWcINy5TCp1LQB8sZUdlW15HAGirbFEYjx8TAtLWwgysZL8OyJe1sK+yqY8igAR/TB25JHnGgkZaldX20YQIsJMKjUsSWLXUPpUDtHPoopyBvb1jbWjh20jiNbZ0VTq2wiwth2dl226HAGix6PR6Apct25vuzRtO0HEmSSZ3ASIn28XCLJd9yHAjk8xVT3faCxdu3viCoJIktg9rN6WRwDfjo2MXGYlXI9dCLiGIBMkuRIQv2ZX56QcDyJA9PexRIJvOV1RXEUQQZJUajUQ3QyIYVcgJJVoDQJEeUD8VCwev6M1DeprxXUEESQZGjqJEH+AiDP0dUN+5WUEOC0zEp0b6+9/2G39cCVBGKTc0NAxqqLcDQBz3Qaa1MdWBHahqq6K9vdzaj/XFdcShJGia67pyUYiNwHAOa5DTipkBwJ3RnO5z+JVV+23Q5gTMlxNEEESIsymUl8FxKucAEDKbBsCX4v29V2NiNQ2DXQ07HqCaH3IJJOfAMRvy5hbOkbV3Z8cAKJLYonEre5Wc1w7zxBEO5eUFGUbAiz2ArhSx0oECOCJgKqusSNmbquw9RRBxJZreDiUzWb/FyCyNbDn9G/VwLqsHd5G/Z9oJPIPuG5dwWW6NVTHsxMsm0qdzC+uAPABLwHegbruRoBLovH4L7zYd88SRKwm6XRXRlX/CRGvlK68rpt+Y0j0LxFFubZdlrh2IOJpgmgAjG3atKCkqpsA4FQ7QJEyLCPwcwXgskg8vtuypDYL8AVBNAxHk8mzEZHteOTjYjsmFtHzhHhVdzx+Zzuad6JNXxFEAyiTSsUJ4GoEOMIJ0KTMqtspojcA4CvdicSw37DxJUHE+WTz5kh2795LAeDvZdA6h6Yt0SuAeG10+vRv4tq1OYdaaatY3xKkHNVsOn0JEV0tb7xsm2u7keiaaCLxLdskulRQRxBErCiDg0r2kEPOBVX9EiAucel4uFstosdBUa6Jbthwm9tNROwCsmMIUg5YLpn8uDp+NbzcLiD9LIcA7lNU9avR/v6f+bmftfrWkQTRgBA5FRXlckK8GAEO7bTBb9RfAngTAbYopdK3IgMDL3QqNh1NkIpzSjL5GRXx0whgW4ZUL04qDpaAiFti8fg2L+pvt86SIFWI0vDwQbls9hwVcQ0SrewA198CAdyvqOqtkVjsjnaG2LF7ctshTxKkAYp03XXTMvn8CkQ8HfgPwBw7QG+7DKLnAeB+UpT7YoHAg7h+/YG26+RSBSRBDAwMuwET4nJCXEEAy71ybiGAPyLRTwnxAUVV73Ore6uBoWjZp5IgFqAeTaUWI9FpgLiQAOYhwHEAELMg0o6qGQJ4Hol2AcCTFAg82L1hw+N2CO5EGZIgNo96dmhoNgYCH1SJmDBziWguIc613eyF6DVA3AW8XULcpRDtUkulXbEvfOEVm7vU0eIkQVo4/LRx4yG5cLhHKZV6Sqrag4oSI6KDkaiHFKWH/2Z1CHE/qup+8TfiHlLVTEBR9quBwP5IPr8fBwbebaHaHd2UJEhHD7/sfDMEJEGaISR/3tEISIJ09PDLzjdD4P8DkoM4qv7FLk0AAAAASUVORK5CYII=',
                type: 'scatter',
                symbolSize: 30,
                //['日期周'，'Y周'，'育苗周']
                //data: [[15,'采收',15],[16,"采收",16],[17,'采收',17]]
                data: hList
            },{
                name:"园艺",
                symbol:'image://data:image/png;base64,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',
                type: 'scatter',
                symbolSize: 30,
                data: gList
            },{
                name:"植保",
                symbol:'image://data:image/png;base64,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',
                type: 'scatter',
                symbolSize: 30,
                data: pList
            },{
                name:"施肥",
                symbol:'image://data:image/png;base64,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',
                type: 'scatter',
                symbolSize: 30,
                data: fList
            },{
                name:"灌溉",
                symbol:'image://data:image/png;base64,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',
                type: 'scatter',
                symbolSize: 30,
                data: wList
            }
            ]
        };
        myChart.setOption(Option);
        myChart.on('datazoom', function () {
            //params里面有什么，可以打印出来看一下就明白
            const startValue = myChart.getModel().option.dataZoom[0].startValue;
            const endValue = myChart.getModel().option.dataZoom[0].endValue;
            const offset =endValue-startValue+1;
            if(offset>7) {
                _this.tabX=false;
            }else {
                _this.tabX=true;
            }
        });
    }
    setPreStep() {
        if(this.props.setStep) {
            this.props.setStep(0);
        }
    }
    //   保存
    doSave() {
        const {taskList,cycleList,type,record,name,deleteList}=this.props;
        // 种植方案名称
        if (this.props.setType === 'add') {
            if (cycleList && cycleList.length > 0) {
                let duration = 0;
                if (type === 'week') {
                    duration = 1;
                }
                for (let i = 0; i < cycleList.length; i++) {
                    cycleList[i].type = duration;
                    cycleList[i].cropPeriodId = cycleList[i].id;
                    cycleList[i].periodId = cycleList[i].liveId;
                }
            }
            if (taskList && taskList.length > 0) {
                for (let i = 0; i < taskList.length; i++) {
                    let duration = 0;
                    if (taskList[i].delayType === 'week') {
                        duration = 1;
                    }
                    taskList[i].type = duration;
                    taskList[i].dosage = taskList[i].plannedQty;
                    taskList[i].periodList = [];
                    taskList[i].operationList = [];
                    taskList[i].materialList = [];
                }
            }
            const addData = {
                name:name,
                cropNo:record.no,
                cropId:record.id,
                companyId: 1,
                cropName:record.name,
                workSolutionCropPeriodList: JSON.stringify(cycleList),
                workSolutionMaterialsOperationList: JSON.stringify(taskList)
            };
            ProgramIOModel.Adddata(addData).then((res) => {
                if (res.success && res.data > 0) {
                    message.success('添加成功');
                    this.props.jumpToList();
                } else {
                  Modal.error({
                    title: '提示',
                    content:res.message
                  });
                }
            }).catch((res) => {
              Modal.error({
                title: '提示',
                content:res.message
              });
            });
        } else {
            if (cycleList && cycleList.length > 0) {
                let duration = 0;
                if (type === 'week') {
                    duration = 1;
                }
                for (let i = 0; i < cycleList.length; i++) {
                    cycleList[i].type = duration;
                    cycleList[i].periodId = cycleList[i].liveId;//周期id
                }
            }
            if (deleteList && deleteList.length > 0) {
                for (let i = 0; i < deleteList.length; i++) {
                    taskList.push(deleteList[i]);
                }
            }
            if (taskList && taskList.length > 0) {
                for (let i = 0; i < taskList.length; i++) {
                    let duration = 0;
                    if (taskList[i].delayType === 'week') {
                        duration = 1;
                    }
                    taskList[i].type = duration;
                    taskList[i].dosage = taskList[i].plannedQty;
                    taskList[i].materials = [];
                    taskList[i].operations = [];
                    taskList[i].periodList = [];
                    taskList[i].operationList = [];
                    taskList[i].materialList = [];
                }
            }
            const updateData = {
                id:record.id,
                name:name,
                workSolutionCropPeriodList: JSON.stringify(cycleList),
                workSolutionMaterialsOperationList: JSON.stringify(taskList)
            };
            ProgramIOModel.Modifydata(updateData).then((res) => {
                if (res.success && res.data > 0) {
                    message.success('修改成功');
                    this.props.jumpToList();
                } else {
                  Modal.error({
                    title: '提示',
                    content:res.message
                  });
                }
            }).catch((res) => {
              Modal.error({
                title: '提示',
                content:res.message
              });
            });
        }
    }
    render() {
        return (
            <div className='step-layout'>
                <div className='form-layout'>
                    <div className='icon-list'>
                        <div className='icon-item'><i className='iconfont  icon-jiaoshui'></i><span>灌溉</span></div>
                        <div className='icon-item'><i className='iconfont  icon-yumiao'></i><span>植保</span></div>
                        <div className='icon-item'><i className='iconfont  icon-shifei'></i><span>施肥</span></div>
                        <div className='icon-item'><i className='iconfont  icon-yuanyi'></i><span>园艺</span></div>
                        <div className='icon-item'><i className='iconfont  icon-caichu'></i><span>采收</span></div>
                    </div>
                    <div id="main" style={{ height: 450 }}></div>
                </div>
                <div className='step-foot'>
                    <Button className='form-btn-def' onClick={this.setPreStep.bind(this)}>上一步</Button>
                  {(this.props.setType === 'modify' || this.props.setType === 'add') && <Button className='form-btn' onClick={this.doSave.bind(this)}>保存</Button>}
                </div>
            </div>
        );
    }
}
const mapStateprops = (state) => {
    const {taskList,cycleList,type,record,name,deleteList} = state.programAddReducer;
    return {
        record:record,
        deleteList:deleteList,
        name:name,
        cycleList:cycleList,  //周期列表
        type:type,  //周期时长
        taskList:taskList  //任务列表
    };
};
export default connect(mapStateprops,action)(SecondStep);
