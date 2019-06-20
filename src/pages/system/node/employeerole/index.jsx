import {Component} from 'react';
import {Button, Icon, message} from 'antd';
// import {IO} from '@/app/io';
import './index.less';
import {action} from './model';
import {connect} from 'react-redux';
import Com from "@/component/common";
import {IOModel} from '../model';
import ChuanSuo from './chuansuo.jsx';

class EmployeeRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            targetKeys: [],
            loading: false
        };
    }
    changekey(targetKeys) {
        this.setState({targetKeys});
    }

    sendrole() {
        this.setState({loading: true});
        const {targetKeys} = this.state;
        IOModel.updateByCompanyId({nodeId: this.props.idss.id, data: targetKeys}).then((res) => {
            if (res.success) {
                message.success('分配公司成功');
                this.setState({loading: false});
                this.props.emprolehide();
            }
        }).catch((res) => {
            this.setState({loading: false});
            Com.errorCatch(res);
        });
    }

    render() {
        const {dataList_, idss} = this.props;
        const {targetKeys} = this.state;
        return (
            <div className="allinfobox-j">
                <Icon className="close_btn-j" type="close" onClick={this.props.emprolehide.bind(this)}/>
                <div className='system-title-div'>
                    <span className='system-title'>节点：{this.props.idss.nodeName}</span>
                </div>
                <div className="left_right">
                    <i className="left_right_left-b">所有公司</i>
                    <i className="left_right_right-b">已有公司</i>
                </div>
                <ChuanSuo changekey={this.changekey.bind(this)} targetKeys={targetKeys} jdata={dataList_}
                          idss={this.props.idss} idds={idss}/>
                <div className='system-modal-footer'>
                    <Button onClick={this.props.emprolehide.bind(this)}>取消</Button>
                    <Button loading={this.state.loading} onClick={this.sendrole.bind(this)} type="primary">确认</Button>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const _roleReducer = state._roleReducer;
    return {
        dataList_: _roleReducer.did,
        queryAlls_: _roleReducer.queryAlls
    };
};
export default connect(mapStateprops, action)(EmployeeRole);