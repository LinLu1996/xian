import { Component } from 'react';
import {connect} from 'react-redux';
import {action} from './model';
import {Modal, Button} from 'antd';
import moment from "moment";
class CustomizedForm extends Component {
    constructor(props) {
        super(props);
        this.state={
            actualQty: ''
        };
    }
    handleActualQtyChange(event) {
        this.setState({
            actualQty: event.target.value
        });
        // this.props.actualQty = event.target.value;
        this.props.changeProps(event.target.value);
    }
    //const {ag_code,varieties,plantingBase,plantingLand,task,plan_time,use,dosage,realDosage} =props;
    render() {
        const planTimeFormat = moment(this.props.planTime.value).format('YYYY-MM-DD');
        return (
            <ul>
                <li><b>农事计划编号：</b><span>{this.props.planNo.value}</span></li>
                <li><b>种植作物：</b><span>{this.props.cropName.value}</span></li>
                <li><b>种植基地：</b><span>{this.props.baseName.value}</span></li>
                <li><b>种植地块：</b><span>{this.props.landName.value}</span></li>
                <li><b>农事任务：</b><span>{this.props.name.value}</span></li>
                <li><b>计划时间：</b><span>{planTimeFormat}</span></li>
                {this.props.workTypeCode.value !== 'harvest' && <li><b>使用农资：</b><span>{this.props.materialName.value}</span></li>}
                {this.props.workTypeCode.value !== 'harvest' && <li><b>计划用量：</b><span>{this.props.planQty.value}{this.props.dosageUnit.value}</span></li>}
                {(this.props.workTypeCode.value !== 'harvest' && this.props.actualQty.value !== null && this.props.actualQty.value !==undefined) &&
                <li>
                    <b>实际用量：</b>
                    <span>{this.props.actualQty.value}{this.props.dosageUnit.value}</span>
                </li>}
                {this.props.workTypeCode.value === 'harvest' &&
                <li>
                    <b>采收数量：</b>
                    <span>{this.props.recoveryQty.value}{this.props.unit.value}</span>
                </li>
                }
            </ul>
        );
    }
}

class modifyModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false,
            actualQty: ''
        };
    }
    componentDidMount() {
        this.setState({
            actualQty: ''
        });
    }
    changeProps(val) {
        this.setState({
            actualQty: val
        });
    }
    hideModal() {   //点击确定的回调

        this.props.modal({modalFlagDetails:false,modeltype:'detail'});

    }
    hideCancel() {   //点击关闭的回调函数
        this.props.modal({modalFlagDetails:false,modeltype:'detail'});
    }
    afterClose() {
        this.setState({
            actualQty: ''
        });
    }
    handleFormChange (changedFields) {  //表单变化时
        const fields = this.props.fields;
        this.props.defaultFields( { ...fields, ...changedFields });
    }
    render() {
        const { modalflagDetails,fields,modaltype } = this.props;
        let title="任务详情";
        if(modaltype === 'modify') {
            title="任务结果上报";
        }
        return (
            <div>
                {modaltype === 'modify' ? <Modal
                        title={title}
                        visible={modalflagDetails}
                        onOk={this.hideModal.bind(this)}
                        onCancel={this.hideCancel.bind(this)}
                        cancelText="取消"
                        wrapClassName='farming-admin-modal'
                        afterClose={this.afterClose.bind(this)}
                    >
                        <CustomizedForm {...fields} changeProps={this.changeProps.bind(this)}/>
                    </Modal> :
                    <Modal className='close-button-modal'
                           title={title}
                           visible={modalflagDetails}
                           footer={[
                               <Button key="submit" type="primary" onClick={this.hideCancel.bind(this)}>
                                   关闭
                               </Button>
                           ]}
                           onCancel={this.hideCancel.bind(this)}
                           wrapClassName='farming-admin-modal'
                    >
                        <CustomizedForm {...fields} changeProps={this.changeProps.bind(this)}/>
                    </Modal>
                }
            </div>
        );
    }
}
const mapstateProps = (state) => {
    const {Alldate,isOk,parentname,parentID,Cur,Psize,fields,modalflag,modalflagDetails,chooseCUR, chooseSIZE,modaltype, TreeD, slideID,modifyID,slideparentID,slideName} = state.taskCalendarReducer;
    return {
        dataList:Alldate,
        isok:isOk,
        parentName:parentname,
        parentID,modifyID,
        Cur,
        Psize,
        fields:fields,
        modalflag,
        modalflagDetails,modaltype,TreeD,slideID,
        chooseCUR, chooseSIZE,slideparentID,slideName
    };
};
export default connect(mapstateProps, action)(modifyModal);
