import {Component} from 'react';
import {Button, Icon, message} from 'antd';
import './index.less';
import {IOModel,action} from '../model';
import Com from "@/component/common";
import TransferTree from "@/component/transfer/index.jsx";
import connect from "react-redux/es/connect/connect";

class Empdep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            havedata: []
        };
    }

    componentDidMount() {
        const me = this;
        //角色默认已拥有资源
        IOModel.getCompany({':id':me.props.emprole_.id}).then((res) => {
            this.setState({
                havedata: me.changeArr(res.data)
            });
            // const arrhave = me.changeArr(res.data);
            // me.resourceTransfer.group.state.checkedDatas = arrhave;//请求默认员工已拥有组织
        }).catch(Com.errorCatch);
    }

    getArr(arr) {
        const target = [];
        arr.forEach(item => {
            target.push({
                id: item.id
            });
        });
        return target;
    }

    changeArr(arr) {
        const target = [];
        arr.forEach(item => {
            target.push({
                key: item.id,
                title: item.title
            });
        });
        return target;
    }

    emporgChange() {
        const me = this;
        const arrres = me.getArr(me.resourceTransfer.group.state.checkedDatas);
        IOModel.updateByCompanyId({nodeId: this.props.emprole_.id, data: JSON.stringify(arrres)}).then((res) => {
            if (res.success) {
                message.success('分配成功');
                this.setState({loading: false});
                this.props.empdephde();
            }
        }).catch(Com.errorCatch);
    }

    render() {
        const {havedata} = this.state;
        const me = this;
        const resourceOption = {
            className: 'tree-cont-b',
            checkedDatas: havedata,
            type: 'resource',
            async: {
                mockUrl: '/proxy/company/listAll',
                url: '/company/listAll'
            },
            fit: (data) => {
                return data.map(item => {
                    item.title = item.companyName;
                    item.key = item.id;
                    return item;
                });
            },
            ref: (self) => {
                me.resourceTransfer = self;
            }
        };
        return (
            <div className="allinfobox-j">
                <Icon className="close_btn-j" type="close" onClick={this.props.empdephde.bind(this)}/>
                <div className='system-title-div'>
                    <span className='system-title'>公司：{this.props.emprole_.companyName}</span>
                </div>
                <div className="left_right">
                    <i className="left_right_left-b">所有公司</i>
                    <i className="left_right_right-b">已有公司</i>
                </div>

                <TransferTree {...resourceOption}/>
                <Button style={{marginTop: '20px'}} className="posibutton-l-j" loading={this.state.loading}
                        onClick={this.emporgChange.bind(this)} type="primary">确定</Button>
                <Button style={{marginTop: '20px'}} className="posibutton" type="primary"
                        onClick={this.props.empdephde.bind(this)}>取消</Button>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName, TreeD, sortfield, sortorder, slideID} = state.nodeReducer;
    const {securityKeyWord} = state.initReducer;
    return {
        dataList: Alldate,//展示列表的数据
        slideName, TreeD,
        securityKeyWord,
        sortfield,
        sortorder,
        slideID
    };
};
export default connect(mapStateprops, action)(Empdep);