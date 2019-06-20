import { Component } from 'react';
import {Input, Button, Modal, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import Tables  from './table.jsx';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './../index.less';
import './index.less';
class Resources extends Component {
    constructor(props) {
        super(props);
        this.state={
            start:'',
            end:'',
            queryFlag:false,  //筛选按钮
            initFlag: false,
            total: 0,
            allData: [],
            gradeBatchNo: ''
        };
        this.isFirst=true;
    }
    componentDidMount() {
        //this.props.uniqueCodeByBatch({id:1,companyId:1,userId:1,startPage:1,limit:10});  //进入页面请求列表数据
        this.props.superiorName({name:'唯一码库',parentLeftID:-1});
    }
    componentWillReceiveProps(nextProps) {
        const fields = nextProps.props.fields;
        if(fields && fields.gradeBatchNo && fields.gradeBatchNo.value ) {
            this.setState({
                gradeBatchNo: fields.gradeBatchNo.value
            });
            const vm = {
                companyId: 1,
                gradeBatchNo: fields.gradeBatchNo.value,
                startPage: 1,
                limit: 10
            };
            if (nextProps.codeflag === true && this.isFirst === true) {
                nextProps.innerpage({current: 1, pageSize: 10});
                this.isFirst = false;
            }
            IOModel.getQrcodeList(vm).then((res) => {
                if (res.success) {
                    const data = res.data.row || [];
                    const total = res.data.total;
                    this.setState({
                        allData: data,
                        total: total
                    });
                }
            }).catch();
        }
    }
    print() {  //打印
        // this.setState({
        //     queryFlag:true //控制分页的展示
        // });
        // const vm={
        //     companyId:1,
        //     userId:1,
        //     functionary:this.state.functionary,
        //     name: this.state.name,
        //     startPage:1,
        //     limit:10
        // };
        // this.props.queryAll(vm);
    }
    setStart(event) {
        this.setState({
            start: event.target.value
        });
    }
    setEnd(event) {
        this.setState({
            end: event.target.value
        });
    }
    onSizeChangequery(current,size) {  //点击筛选的分页按钮
        const vm = {
            companyId: 1,
            gradeBatchNo: this.state.gradeBatchNo,
            startPage: current,
            limit: size
        };
        IOModel.getQrcodeList(vm).then((res) => {
            if(res.success) {
                const data = res.data.row || [];
                const total = res.data.total;
                this.setState({
                    allData: data,
                    total: total
                });
            }
        }).catch();
        this.props.innerpage({current: current, pageSize: size});
    }

    onchooseChange(current,size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.innerpage({current: current, pageSize: size});
        this.props.chooseAll({id:chooseId,startPage:current,limit:size});
    }
    hideModal() {
    }
    hideCancel() {   //点击关闭的回调函数
        this.props.codemodal({codeFlag:false,modeltype:'add'});
    }
    handleFormChange (changedFields) {
        const fields = this.props.fields;
        this.props.defaultFields( { ...fields, ...changedFields });
    }
    render() {
        const {  queryFlag,allData,total,Curs} = this.state;
        const { codeflag } = this.props;
        return (
            <Modal width={1000}
                   title='唯一码库'
                   visible={codeflag}
                   onOk={this.hideCancel.bind(this)}
                   onCancel={this.hideCancel.bind(this)}
                   okText="确认"
                   cancelText="取消"
                   wrapClassName='farming-admin-modal'
            >
                <div className='batch-code-box'>
                    <div className='farming-search'>
                        <div className='search-layout'>
                            <div className='search-row'>
                                <div className='search-col'>
                                    <span className='label-title'>二维码生成总数</span>
                                    <span>{total}</span>
                                </div>
                                <div className='search-col'>
                                    <span className='label-title'>打印范围</span>
                                    <Input value={this.state.start} placeholder='开始序号' onChange={this.setStart.bind(this)}/>-
                                    <Input value={this.state.end} placeholder='结束序号' onChange={this.setEnd.bind(this)}/>
                                    <Button type="primary" style={{marginLeft: '10px'}} onClick={() => {this.print();}}>打印</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='content'>
                        <LocaleProvider locale={zhCN}>
                            <Tables data={allData} current={Curs} total={total} onSizeChangequery={this.onSizeChangequery.bind(this)}
                                    queryFlag={queryFlag} />
                        </LocaleProvider>
                    </div>
                </div>
            </Modal>
        );
    }
}
const mapStateprops = (state) => {
    const {codeflag,Alldate,total, slideName,Cur,Curs} = state.batchtracingReducer;
    return {
        Cur,
        Curs,
        codeflag,
        total,
        Alldate,
        slideName
    };
};
export default connect(mapStateprops,action)(Resources);
