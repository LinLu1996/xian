import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
//import moment from 'moment';
import {Modal, Input, Form, message, Select,InputNumber,Radio, Tooltip} from 'antd';
const RadioGroup = Radio.Group;
//import ModalTable from "./modalTable.jsx";

const {TextArea} = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const CustomizedForm = Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            landName: Form.createFormField({
                ...props.landName,
                value: props.landName.value
            }),
            code: Form.createFormField({
                value: props.code.value
            }),
            baseName: Form.createFormField({
                ...props.baseName,
                value: props.baseName.value
            }),
            typeName: Form.createFormField({
                ...props.typeName,
                value: props.typeName.value
            }),
            area: Form.createFormField({
                ...props.area,
                value: props.area.value
            }),
            longitude: Form.createFormField({
                value: props.longitude.value
            }),
            latitude: Form.createFormField({
                value: props.latitude.value
            }),
            createName: Form.createFormField({
                value: props.createName.value
            }),
            user: Form.createFormField({
                ...props.user,
                value:props.user.value
            }),
            gisData: Form.createFormField({
                ...props.gisData,
                value:props.gisData.value
            }),
            baseId: Form.createFormField({
                ...props.baseId,
                value:props.baseId.value
            })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    props.getForm(props.form);
    const {modeltype_land,EditData} = props;
    let isEdit = false;
    let latitude;
    let longitude;
    JSON.stringify(EditData)!=='{}' && EditData?latitude=EditData.latitude : latitude='';
    JSON.stringify(EditData)!=='{}' && EditData?longitude=EditData.longitude : longitude='';
    const GIS = `http://geojson.io/#map=10/${latitude}/${longitude}`;
    //let createTime = "";
    //let stauts = "";http://geojson.io/#map=10/30.1577/120.0888
    let id = "-1";
    if (modeltype_land.value === 'modify') {
        isEdit = true;
        //createTime = moment(props.createTime.value).format('YYYY-MM-DD HH:mm:ss');
        //stauts = props.stauts.value;
        id = props.id.value;
    }
    return (
        <Form layout="inline">
            <FormItem label="所属基地">
                {getFieldDecorator('baseName', {
                    rules: []
                })(<Input readOnly={true}/>)}
            </FormItem>
            {isEdit && <FormItem label="地块编码">
                {getFieldDecorator('code', {
                    rules: []
                })(<div>{<div>{props.code.value}</div>}</div>)}
            </FormItem>}
            <FormItem label="地块名称">
                {getFieldDecorator('landName', {
                    rules: [{required: true, message: '请输入地块名称'}]
                })(<Input onChange={(e) => {
                    props.checkName(e.target.value, id,props.baseId.value);
                }}/>)}
            </FormItem>
            <FormItem label="地块类型">
                {getFieldDecorator('typeName', {
                    rules: [{required: true, message: '请选择地块类型'}]
                })(<Select style={{width: 300}}>
                    {props.allLandType.value.map((item) => {
                        return <Option key={item.id} value={item.id}>{item.name}</Option>;
                    })}
                </Select>)}
            </FormItem>
            <FormItem label="地块面积(亩)">
                {getFieldDecorator('area', {
                    rules: [{required: true, message: '请输入地块面积'},
                        {pattern: /^(((([1-9]\d*)|0)(.\d+))|((([1-9]\d*)|0)))$/, message: '请输入非负数'}]
                })(<InputNumber/>)}
            </FormItem>
            {/*<FormItem label="经度">
                {getFieldDecorator('longitude', {
                    rules: []
                })(<InputNumber/>)}
            </FormItem>
            <FormItem label="纬度">
                {getFieldDecorator('latitude', {
                    rules: []
                })(<InputNumber/>)}
            </FormItem>*/}
            <FormItem label="负责人">
                {getFieldDecorator('user', {
                    rules: [{required: true, message: '请选择负责人'}]
                })(<Select style={{width: 300}} showSearch
                           placeholder="请选择负责人"
                           optionFilterProp="children"
                           filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                    {props.functionaryList.value.map((item) => {
                        return <Option key={item.id} value={item.id}>{item.name}</Option>;
                    })}
                </Select>)}
            </FormItem>
            <FormItem label="GIS坐标">
            <div className='tishi'>{getFieldDecorator('gisData', {
                    rules: []
                })(<TextArea autosize={{minRows: 2, maxRows: 6}} style={{width: '300px'}}/>)}
                <Tooltip autoAdjustOverflow={false} overlayClassName='toolp' placement="topRight" title={'路由地址'}>
                <i className='iconfont icon-tishi' onClick={props.that.GIShelp.bind(props.that)}/>
                </Tooltip>
                <div style={{width:'100%',textAlign:'left',fontSize:'12px', marginTop:'-5px'}}><a style={{color:'red'}}>{GIS}</a></div>
                </div>
            </FormItem>
            {isEdit && <FormItem label="状态">
                {getFieldDecorator('stauts', {
                    rules: []
                })(<div>
                    <RadioGroup value={Number(props.stauts.value)}>
                        <Radio value={1}>禁用</Radio>
                        <Radio value={0}>启用</Radio>
                    </RadioGroup>
                </div>)}
            </FormItem>}
        </Form>
    );
});

class modifyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    async setRecord(record) {
        await this.setState({
            record: record
        });
    }

    openModalTable() {
        this.props.modalTable({modalFlag: true, modeltype: 'add'});
        this.props.tableFields({
            modeltype: {
                value: 'add'
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.firstFlag) {
            this.setState({
                record: nextProps.fields.record
            });
            this.props.modal({modalFlag: true, modeltype: 'modify',first:false});
        }
    }

    getForm(value) {
        this.formValitate = value;
    }

    hideModal(e) {   //点击确定的回调
        const {id, landName, area, typeName, longitude, latitude, user, gisData,baseId,stauts} = this.props.fields;
        const {Cur, Psize, modaltype_land,landNames,baseNames,userId,updateTree,companyId,baseIds} = this.props;
        e.preventDefault();
        this.formValitate.validateFields((err) => {
            if (!err) {
                if(this.props.saveFlag) {
                  if (modaltype_land === 'add') {
                    const addData = {
                      name: landName.value,
                      area: area.value,
                      landtypeId: typeName.value,
                      longitude: longitude.value,
                      latitude: latitude.value,
                      baseId: baseId.value,
                      userId: user.value,
                      gisData: gisData.value
                    };
                    IOModel.AdddataLand(addData).then((res) => {  //添加成功时的回调
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('添加成功');
                              updateTree();
                            this.props.AlldatasLand({startPage: 1, limit: Psize,userId:userId,baseName:baseNames,landName:landNames,companyId,baseId:baseIds});
                            this.props.page({current: 1, pageSize: Psize});
                          this.props.modal({modalFlag:false});
                        } else {
                          message.error('添加失败');
                        }
                      } else {
                        message.error('添加失败');
                      }
                      this.props.modal({modalFlag: false});
                    }).catch(() => {
                      message.error('添加失败');
                    });

                  } else if (modaltype_land === 'modify') {
                    const modifydata = {
                      id: id.value,
                      name: landName.value,
                      modifyUserId: 1,
                      area: area.value,
                      landtypeId: parseInt(typeName.value),
                      longitude: longitude.value,
                      latitude: latitude.value,
                      baseId: parseInt(baseId.value),
                      userId: user.value,
                      gisData: gisData.value,
                        orgId: this.props.fields.orgId.value,
                        stauts:stauts.value
                    };
                    IOModel.ModifydataLand(modifydata).then((res) => {  //修改成功时的回调
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('修改成功');
                            updateTree();
                          this.props.AlldatasLand({startPage: Cur, limit: Psize,userId:userId,baseName:baseNames,landName:landNames,companyId,baseId:baseIds});
                        } else {
                          message.error('修改失败');
                        }
                      } else {
                        message.error('修改失败');
                      }
                      this.props.modal({modalFlag_land: false});
                    }).catch(() => {
                      message.error('修改失败');
                    });
                  }
                }else{
                  message.warning('地块名已存在');
                }
            }
        });
    }

    hideCancel() {   //点击关闭的回调函数
        this.props.modal({modalFlag_land: false, modeltype_land: 'add'});
    }

    handleFormChange(changedFields) {
        const fields = this.props.fields;
        this.props.defaultFields({...fields, ...changedFields});
    }
    GIShelp() {
        const d = 12;
        location.href=`/#/pages/masterdata/base/${d}`;
    }
    render() {
        const {modalflag_land, parentName, modaltype_land, fields} = this.props;
        let title = "编辑地块";
        if (modaltype_land === 'add') {
            title = "新增地块";
        }
        return (
            <div>
                <Modal
                    title={title}
                    visible={modalflag_land}
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName='farming-admin-modal farming-base-modal'
                >
                    <CustomizedForm {...fields} openModalTable={this.openModalTable.bind(this)}
                                    onChange={this.handleFormChange.bind(this)} parentName={parentName}
                                    getForm={this.getForm.bind(this)}
                                    checkName={this.props.checkName} record={this.state.record} that={this} EditData={this.props.EditData}/>
                </Modal>
                {/*<ModalTable props={this.props} setRecord={this.setRecord.bind(this)}/>*/}
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {companyId,baseId,Alldate, isOk, parentname, parentID, Cur, Psize, chooseCUR, chooseSIZE, TreeD, slideID, modifyID, slideparentID, slideName} = state.farmingLandReducer;
    const {modalflag_land,modaltype_land,EditData,fields,allLandType} = state.baseReducer;
    return {
        companyId,baseIds:baseId,
        allLandType,
        dataList: Alldate,
        isok: isOk,
        parentName: parentname,
        parentID, modifyID,
        Cur,
        EditData,
        Psize,
        fields: fields,
        modalflag_land, modaltype_land, TreeD, slideID,
        chooseCUR, chooseSIZE, slideparentID, slideName
    };
};
export default connect(mapstateProps, action)(modifyModal);
