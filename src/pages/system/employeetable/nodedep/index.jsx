import {Component} from 'react';
import {Button, Icon, message} from 'antd';
import './index.less';
import TransferTree from "@/component/transfer/index.jsx";
import {IO} from '@/app/io';
import Com from "@/component/common";
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
        IO.employee.getNodeByUser({':id': me.props.dataid.id}).then((res) => {
            this.setState({
                havedata: me.changeArr(res.data)
            });
        }).catch(Com.errorCatch);
    }

    getArr(arr) {
        const target = [];
        arr.forEach(item => {
            target.push({
                id: item.id,
                treekey: item.key
            });
        });
        return target;
    }

    changeArr(arr) {
        const target = [];
        arr.forEach(item => {
            target.push({
                id: item.id,
                key: item.treeKey,
                title: item.nodeName
            });
        });
        return target;
    }

    emporgChange() {
        this.setState({loading: true});
        const me = this;
        const data = me.getArr(me.organizeTransfer.group.state.checkedDatas);
        IO.employee.insertUseAndNode({userId: me.props.dataid.id, data:  JSON.stringify(data)}).then((res) => {
            if (res.success) {
                message.success('分配节点成功');
                this.setState({loading: false});
                this.props.empdephde();
            }
        }).catch((res) => {
            message.warning(res.data);
            this.setState({loading: false});
        });
    }

    render() {
        const {havedata} = this.state;
        const me = this;
        const organizeTransfer = {
            className: 'tree-cont-b',
            type: 'organize',
            checkedDatas: havedata,
            async: {
                mockUrl: `/proxy/node/getChilds`,
                url: `/node/getChilds`
            },
            fit: (data) => {
                return data.map(item => {
                    item.title = item.nodeName;
                    return item;
                });
            },
            ref: (self) => {
                me.organizeTransfer = self;
            }
        };
        return (
            <div className="allinfobox-j">
                <Icon className="close_btn-j" type="close" onClick={this.props.empdephde.bind(this)}/>
                <div className='system-title-div'>
                    <span className='system-title'>用户：{this.props.dataid.realName}</span>
                </div>
                <div className="left_right">
                    <i className="left_right_left-b">所有节点</i>
                    <i className="left_right_right-b">已有节点</i>
                </div>
                <TransferTree {...organizeTransfer}/>
                <div className='system-modal-footer'>
                    <Button onClick={this.props.empdephde.bind(this)}>取消</Button>
                    <Button loading={this.state.loading} onClick={this.emporgChange.bind(this)} type="primary">确认</Button>
                </div>
            </div>
        );
    }
}

export default Empdep;