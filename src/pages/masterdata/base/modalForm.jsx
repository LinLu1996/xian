import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import {Radio,InputNumber} from 'antd';
const RadioGroup = Radio.Group;
import {Modal, Input, Form, message,Select} from 'antd';
import './index.less';
const Option = Select.Option;
const FormItem = Form.Item;
const CustomizedForm = Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            name: Form.createFormField({
                ...props.name,
                value: props.name.value
            }),
            code: Form.createFormField({
                value: props.code.value
            }),
            area: Form.createFormField({
                ...props.area,
                value: props.area.value
            }),
            longitude: Form.createFormField({
                ...props.longitude,
                value: props.longitude.value
            }),
            latitude: Form.createFormField({
                ...props.latitude,
                value: props.latitude.value
            }),
            phone: Form.createFormField({
                ...props.phone,
                value: props.phone.value
            }),
            address: Form.createFormField({
                value: props.address.value
            }),
            createUserName: Form.createFormField({
                value: props.createUserName.value
            }),
            user: Form.createFormField({
                ...props.user,
                value:props.user.value
            }),
            company: Form.createFormField({
                ...props.company,
                value:props.company.value
            })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    props.getForm(props.form);
    const {modeltype} = props;
    let isEdit = false;
   // let id = "-1";
    if (modeltype.value === 'modify') {
        isEdit = true;
        //id = props.id.value;
    }
    return (
        <Form layout="inline">
            <FormItem label="所属公司">
                {getFieldDecorator('company', {
                    rules: []
                })(<Input readOnly={true}/>)}
            </FormItem>
            {isEdit && <FormItem label="基地编码">
                {getFieldDecorator('code', {
                    rules: []
                })(<div>{<div>{props.code.value}</div>}</div>)}
            </FormItem>}
            <FormItem label="基地名称">
                {getFieldDecorator('name', {
                    rules: [{required: true, message: '请输入基地名称'}]
                })(<Input/>)}
            </FormItem>
            <FormItem label="基地面积(亩)">
                {getFieldDecorator('area', {
                    rules: [{required: true, message: '请输入基地面积'},
                        {pattern: /^(((([1-9]\d*)|0)(.\d+))|((([1-9]\d*)|0)))$/, message: '请输入非负数'}]
                })(<InputNumber/>)}
            </FormItem>
            <div className='selectInput'><FormItem label="基地地址">
                {getFieldDecorator('address', {
                    rules: [{required: true, message: '请输入基地地址'}]
                })(
                  <Select
                    showSearch
                    open={props.openflag}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    notFoundContent={null}
                  >
                    {props.options}
                  </Select>)}
            </FormItem>
            <FormItem label="">
                {getFieldDecorator('address', {
                    rules: [{required: true, message: '请输入基地地址'}]
                })(<Input onChange={props.that.handleSearch.bind(props.that)}
                          onBlur={props.that.setPosition.bind(props.that)}
                          onFocus={props.that.setFocus.bind(props.that)}></Input>)}
            </FormItem>
           </div>
            <FormItem label="经度">
                {getFieldDecorator('longitude', {
                    rules: [{required: true, message: '请输入经度'},{pattern: /^([+-]?\d*\.\d*$)|(^-?\d+$)/, message:'请输入数字'}]
                })(<Input/>)}
            </FormItem>
            <FormItem label="纬度">
                {getFieldDecorator('latitude', {
                    rules: [{required: true, message: '请输入纬度'},{pattern: /^([+-]?\d*\.\d*$)|(^-?\d+$)/, message:'请输入数字'}]
                })(<Input/>)}
            </FormItem>
            <FormItem label="基地电话">
                {getFieldDecorator('phone', {
                    rules: [{pattern: /^((\d{2,5}-\d{7,8})||(\d{2,5} \d{7,8})||(\d{7,8})||(((13[0-9])|(14[579])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199)\d{8}))$/, message: '请输入正确的基地电话'}]
                })(<Input/>)}
            </FormItem>
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
            visible: false,
            userName: {},
            size:'default',
            data: [],
            value: undefined,
            timeout:'',
            currentValue:'',
            openflag:false
        };
    }
    fetch(value, callback) {
        const that = this;
        if (this.state.timeout) {
          clearTimeout(this.state.timeout);
          this.state.timeout = null;
        }
        this.state.currentValue = value;
        function fake() {
        IOModel.getAddress({"address":value})
            .then((d) => {
              if (that.state.currentValue === value) {
                let result;
                d.data && d.data.length>0? result= d.data : result=[];
                const data = [];
                result.forEach((r) => {
                  data.push({
                    value: r,
                    text: r
                  });
                });
                callback(data);
              }
            });
        }
        this.state.timeout = setTimeout(fake, 300);
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

    hideModal() {   //点击确定的回调
        const {name, longitude, latitude, phone, address, user,companyId,area} = this.props.fields;
        const {modaltype,updateTree,Cur,Psize,userId,names,companyIds,baseId} = this.props;
        //e.preventDefault();
        this.formValitate.validateFields((err) => {
            if(name.value === null || name.value.trim() === '') {
                message.warning('名称不能为空');
                return;
            }
            if (!err) {
                /*if (!record || !record.id) {
                    message.warning('请选择负责人');
                    return;
                }*/
                if(this.props.saveFlag) {
                  if (modaltype === 'add') {
                    const addData = {
                      companyId: companyId.value,
                      name: name.value,
                      longitude: longitude.value,
                      latitude: latitude.value,
                      phone: phone.value,
                      address: address.value,
                      userId: user.value,
                      area: area.value
                    };
                    IOModel.Adddata(addData).then((res) => {  //添加成功时的回调
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('添加成功');
                            this.props.Alldatas({startPage: 1, limit: Psize,name:names,userId:userId,companyId:companyIds,baseId});
                            this.props.page({current: 1, pageSize: Psize});
                              updateTree();
                          this.props.modal({modalFlag:false});
                        } else {
                          message.warning('添加失败');
                        }
                      } else {
                        message.error('添加失败');
                      }
                      this.props.modal({modalFlag: false});
                    }).catch(() => {
                      message.error('添加失败');
                    });
                  } else if (modaltype === 'modify') {
                    const modifydata = {
                      id: this.props.fields.id.value,
                      companyId: 1,
                      userId: user.value,
                      name: name.value,
                      longitude: longitude.value,
                      latitude: latitude.value,
                      phone: phone.value,
                      address: address.value,
                        area: area.value,
                        orgId: this.props.fields.orgId.value
                    };
                    IOModel.Modifydata(modifydata).then((res) => {  //修改成功时的回调
                      if (res.success) {
                        if (res.data > 0) {
                          message.success('修改成功');
                          this.props.Alldatas({startPage: Cur, limit: Psize,name:names,userId:userId,companyId:companyIds,baseId});
                          updateTree();
                        } else {
                          message.warning('修改失败');
                        }
                      } else {
                        message.error('修改失败');
                      }
                      this.props.modal({modalFlag: false});
                    }).catch(() => {
                      message.error('修改失败');
                    });
                  }
                }else{
                  message.warning('基地名已存在');
                }
            }
        });
    }

    async setRecord(record) {
        await this.setState({
            record: record
        });
    }
    handleSearch (e) {
        let val;
        e.target?val=e.target.value:val=e;
        this.fetch(val, data => this.setState({ data }));
    }
    handleChange(value) {
        this.props.fields.address.value=value;
        this.setState({ value });
        this.props.setPosition(value);
    }
    setPosition(e) {
        this.setState({
            openflag:false
        });
       this.props.fields.address.value=e.target.value;
        this.props.setPosition(e.target.value);
    }
    setFocus() {
        this.setState({
            //value:this.props.fields.address.value,
            openflag:true
        });
    }
    hideCancel() {   //点击关闭的回调函数
        this.props.modal({modalFlag: false, modeltype: 'add',modalFlag_land:false,modeltype_land:''});
    }
    handleFormChange(changedFields) {
        const fields = this.props.fields;
        this.props.defaultFields({...fields, ...changedFields});
    }
    render() {
        const {modalflag, parentName, modaltype, fields} = this.props;
        const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
        let title = "编辑基地";
        if (modaltype === 'add') {
            title = "新增基地";
        }
        return (
            <div>
                <Modal
                    title={`${title}`}
                    visible={modalflag}
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName='farming-admin-modal'
                >
                    <CustomizedForm {...fields} onChange={this.handleFormChange.bind(this)}
                                    openModalTable={this.openModalTable.bind(this)}
                                    parentName={parentName} getForm={this.getForm.bind(this)}
                                    that={this}
                                    options={options}
                                    value={this.state.value}
                                    that={this}
                                    openflag={this.state.openflag}
                                    checkName={this.props.checkName} record={this.state.record} />

                </Modal>
                {/*<ModalTable props={this.props} setRecord={this.setRecord.bind(this)}/>*/}
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {companyId,baseId,firstFlag, Alldate, isOk, parentname, parentID, Cur, Psize, fields, modalflag, chooseCUR, chooseSIZE, modaltype, TreeD, slideID, modifyID, slideparentID, slideName} = state.baseReducer;
    return {
        companyIds:companyId,baseId,
        firstFlag,
        dataList: Alldate,
        isok: isOk,
        parentName: parentname,
        parentID, modifyID,
        Cur,
        Psize,
        fields: fields,
        modalflag, modaltype, TreeD, slideID,
        chooseCUR, chooseSIZE, slideparentID, slideName
    };
};
export default connect(mapstateProps, action)(modifyModal);
