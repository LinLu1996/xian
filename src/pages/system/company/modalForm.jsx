import {Component} from 'react';
import {Modal, Input, Form, Select, message, Upload, Icon} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import Operation from '../public.js';
import {IO} from '@/app/io';
import moment from 'moment';
// import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import FormField from '@/component/formfield/index.jsx';
moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;
const CustomizedForm = Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            parentName: Form.createFormField({
                value: (props.parentName && props.parentName !== 'null') ? props.parentName : ''
            }),
            comname: Form.createFormField({
                ...props.comname,
                value: props.comname.value
            }),
            comnameEn: Form.createFormField({
                ...props.comnameEn,
                value: props.comnameEn.value
            }),
            comtype: Form.createFormField({
                ...props.comtype,
                value: props.comtype.value
            }),
            corpId: Form.createFormField({
                ...props.cropId,
                value: props.corpId.value
            }),
            nodeId: Form.createFormField({
                ...props.nodeId,
                value: props.nodeId.value
            }),
            nodeName: Form.createFormField({
                ...props.nodeName,
                value: props.nodeName.value
            })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    props.getForm(props.form);
    const {modeltype} = props;
    let id = "-1";
    const propsUpload = {
        name: 'file',
        accept: 'image/jpg,image/jpeg,image/png,image/bmp',
        action: '/company/file',
        //multiple: true,
        fileList: props.fileList,
        listType: "picture-card",
        headers: {
            authorization: 'authorization-text'
        },
        beforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('图片小于2MB!');
            }
            return isLt2M;
        },
        async onChange(info) {
            if (info.file.status === 'uploading') {
                await props.handleState(info.fileList);
            }
            if (info.file.status === 'done') {
                if(info.file.response.success) {
                    const data = info.file.response.data || {};
                    data.status = 'done';
                    await props.handleChange(data);
                } else {
                    message.error(info.file.response.message);
                }
            } else if (info.file.status === 'error') {
                message.error('上传失败');
            }
        },
        onPreview(file) {  //展示
            props.handlePreview(file);
        },
        onRemove(file) {  //删除
            if (file.status === 'removed') {
                props.handleRemove(file);
            } else if (file.status === 'error') {
                message.error('删除失败');
            }
        }
    };
    if (modeltype.value === 'modify') {
        id = props.id.value;
    }
    return (
        <Form layout="inline">
            <FormItem label="上级公司">
                {getFieldDecorator('parentName', {
                    rules: []
                })(<Input disabled/>)}
            </FormItem>
            <FormItem label="公司名称">
                {getFieldDecorator('comname', {
                    rules: [{required: true, message: '请输入公司名称'}]
                })(<Input/>)}
            </FormItem>
            <FormItem label="英文名称">
                {getFieldDecorator('comnameEn', {
                    rules: [{required: true, message: '请输入英文名称'},
                        {pattern: /^[0-9a-zA-Z]*$/, message: '只能输入英文和数字'}]
                })(<Input disabled={props.oldComnameEn && (props.oldComnameEn.value === 'system2register' || props.oldComnameEn.value === 'system2virtual')}/>)}
            </FormItem>
            {(props.parentName && props.parentName !== 'null') ? <FormItem label="公司类型">
                {getFieldDecorator('comtype', {
                    rules: [{required: true, message: '请选择公司类型'}]
                })(<Select disabled>
                    <Option value={1}>农企</Option>
                    <Option value={2}>散户</Option>
                    <Option value={3}>政府机构</Option>
                </Select>)}
            </FormItem> : <FormItem label="公司类型">
                {getFieldDecorator('comtype', {
                    rules: [{required: true, message: '请选择公司类型'}]
                })(<Select>
                    <Option value={1}>农企</Option>
                    <Option value={2}>散户</Option>
                    <Option value={3}>政府机构</Option>
                </Select>)}
            </FormItem>}
            {(props.parentName === null || props.parentName === '') && <FormItem label="所属节点">
                {getFieldDecorator('nodeId', {})(<FormField TreeD={props.TreeNodeD} valueName={props.valueName}
                                                            keyword={'所属节点'}
                                                            formLoadData={props.formLoadData}
                                                            formChange={props.formChange}/>)}
            </FormItem>}
            <FormItem label="钉钉号">
                {getFieldDecorator('corpId', {})(<Input onChange={(e) => {
                    props.checkName(e.target.value, id);
                }}/>)}
            </FormItem>
            <FormItem label="营业执照" className="phone-list">
                {getFieldDecorator('fileList', {})(<div className="clearfix">
                    <Upload {...propsUpload}>
                        {props.fileList.length >= 6 ? null :
                            <div>
                                <Icon type="plus" /><div className="ant-upload-text">图片上传</div>
                            </div>
                        }
                    </Upload>
                    <Modal visible={props.previewVisible} footer={null} onCancel={props.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={props.previewImage} />
                    </Modal>
                </div>)}
            </FormItem>
        </Form>
    );
});

class LocalizedModal extends Component {
    constructor(props) {
        super(props);
        this.flag = true;
        this.state = {
            visible: false,
            loadflag: false,
            fileList: [],
            uploading: false,
            valueName: '',
            nodeId: '',
            previewVisible: false,  //照片弹出框
            previewImage: '',   //弹出的照片
            files: [] //照片数组
        };
    }

    getForm(value) {
        this.formValitate = value;
    }

    addTreeList(data) {
        const addData = Object.assign({},data,{
            title:data.companyName
        });
        if(data.parentId === -1) {
            const add = Object.assign({},addData,{
                key: data.id
            });
            this.props.TreeD.push(add);
        }else {
            Operation.addtree(this.props.TreeD,addData,this.props.slideID);
        }
        this.props.TreeData({tree:[...this.props.TreeD]});
    }

    TableList(ID,mes) {
        this.props.modal({modalFlag:false});
        if(this.props.Treeflag) {
            this.props.Alldatas({sortField:this.props.sortfield,sortOrder:this.props.sortorder,companyName:this.props.Nameval,startPage:this.props.cur,limit:this.props.psize});
        }else{
            this.props.chooseAll({sortField:this.props.sortfield,sortOrder:this.props.sortorder,companyName:this.props.Nameval,parentId:ID,startPage:this.props.cur,limit:this.props.psize});
        }
        message.success(mes);
        this.setState({
            loadflag:false
        });
    }

    mapdata(ID) {
        const Data = {
            id: this.props.fields.id.value,
            parentId: ID,
            parentName: this.props.fields.parentName.value,
            companyName: this.props.fields.comname.value,
            companyNameEn: this.props.fields.comnameEn.value,
            companyType: Number(this.props.fields.comtype.value),
            corpId: this.props.fields.corpId.value,
            nodeId: this.props.fields.nodeId.value,
            workFiles: JSON.stringify(this.state.fileList)
        };
        return Data;
    }

    mapdataModify(ID) {
        const {fields} = this.props;
        const Data = {
            id: fields.id.value,
            parentId: ID,
            parentName: fields.parentName.value,
            companyName: fields.comname.value,
            companyNameEn: fields.comnameEn.value,
            companyType: Number(fields.comtype.value),
            corpId: fields.corpId.value,
            nodeId: fields.nodeId.value,
            workFiles: JSON.stringify(this.state.fileList)
        };
        return Data;
    }

    addmethods() {
        Operation.systemOpt(Operation.listurl(this.props.list,'company_add'));
        if (this.state.nodeId) {
            this.props.fields.nodeId.value = this.state.nodeId;
            this.props.fields.nodeName.value = this.state.valueName;
        }
        IO.system_opt.request(this.mapdata(this.props.slideID)).then((res) => {  //添加成功时的回调
            this.props.getNameval();
            this.addTreeList(res.data);
            if(res.success) {
                this.TableList(this.props.slideID,'添加成功！');
                //this.addTreeList(res.data);
            } else {
                message.error(res.message);
            }
        }).catch((res) => {
            message.error(res.message);
            // Com.errorCatch(res);
            this.setState({
                loadflag:false
            });
        });
    }

    modifymethods() {
        let modifylist;
        const contrast = Object.keys(this.props.queryfields).map((item) => { //判断值有没有修改
            if (item === 'regZB') {
                modifylist = Number(this.props.fields[item].value) === this.props.queryfields[item].value;
            }if (item === 'nodeId') {
                modifylist = Number(this.props.fields[item].value) === this.props.queryfields[item].value;
            } else {
                modifylist = this.props.fields[item].value === this.props.queryfields[item].value;
            }
            return modifylist;
            //return this.props.queryfields[item].value===this.props.fields[item].value;
        });
        let flag = false;
        if (this.state.nodeId !== this.props.fields.nodeId.value) {
            flag = true;
        }
        if (this.state.nodeId) {
            this.props.fields.nodeId.value = this.state.nodeId;
            this.props.fields.nodeName.value = this.state.valueName;
        }
        const modifydata = Object.assign({},this.mapdataModify(this.props.parentID),{
            id:this.props.modifyID
        });
        if (contrast.indexOf(false) !== -1 || flag) {
            Operation.systemOpt(Operation.listurl(this.props.list, 'company_update'));
            IO.system_opt.request(modifydata).then((res) => {
                if (res.success) {
                    this.TableList(this.props.slideID, '修改成功！');
                    this.modifyTreeList();
                }
            }).catch((res) => {
                message.error(res.data);
                //Com.errorCatch(res);
                this.setState({
                    loadflag: false
                });
            });
        } else {
            this.setState({
                loadflag: false
            });
            message.warning('请修改后再提交');
        }
    }

    modifyTreeList() {
        const querydatas = Object.assign({},this.props.rightItem, this.mapdataModify(this.props.slideID));
        const v = Object.assign({},querydatas,{
            title:querydatas.companyName
        });
        const querydata = Operation.querytree(this.props.TreeD,v,this.props.modifyID);
        this.props.TreeData({tree:[...querydata]});
    }

    querytree(arr,data,modifyID) {  //筛选增加树的节点
        return arr.map((item) => {
            if(item.id===modifyID) {
                return data;
            }else {
                if(item.children) {
                    return Object.assign({},item,{
                        children:this.querytree(item.children,data,modifyID)
                    });
                }else {
                    return item;
                }
            }
        });
    }

    hideModal() {
        const {modaltype} = this.props;
        this.formValitate.validateFields((err) => {
            this.setState({
                loadflag: false
            });
            this.props.RightsearchFlag({flag:true});
            if (!this.props.saveFlag) {
                message.warning('钉钉名已存在');
                return false;
            }
            if (!err) {
                this.setState({
                    loadflag:true
                });
                if (modaltype === 'add') {
                    this.addmethods();
                } else if (modaltype === 'modify') {
                    this.modifymethods();
                }
            }
        });
    }

    hideCancel() {
        this.props.modal({modalFlag: false, modeltype: 'add'});
    }

    handleFormChange(changedFields) {
        const fields = this.props.fields;
        this.props.defaultFields({...fields, ...changedFields});
    }

    formChange(value, label, extra) {  //点击每一条数据的方法
        this.setState({
            valueName: extra.triggerValue
        }, () => {
            if (this.state.valueName) {
                const num = extra.triggerNode.props.dataRef.id;
                this.setState({
                    nodeId: num
                });
            }
        });
    }

    Treelist(data, treeNode) {  //对左侧数据进行操作
        const datas = data.map((item, i) => {
            if (item.leaf === 0) {
                return Object.assign({}, item, {
                    title: item.nodeName,
                    key: `${treeNode.props.eventKey}-${i}`
                });
            } else {
                return Object.assign({}, item, {
                    title: item.nodeName,
                    isLeaf: true,
                    key: `${treeNode.props.eventKey}-${i}`
                });
            }
        });
        return datas;
    }

    formLoadData(treeNode, resolve) {  //点击展开时的调用
        if (treeNode.props.children && treeNode.props.children.length > 0) {
            resolve();
            return;
        } else {
            IO.company.TreeNodeData({id: treeNode.props.dataRef.id}).then((res) => {
                const Treedata = this.Treelist(res.data, treeNode);
                treeNode.props.dataRef.children = Treedata;
                this.props.TreeNodeData({tree: [...this.props.TreeNodeD]});
            });
            resolve();
        }
    }

    handlePreview(file) { //弹出照片
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        });
    }

    handleState(fileList) {
        this.setState({
            fileList: fileList
        });
    }

    handleChange(file) {  //改变照片数组
        const files_ = this.state.fileList;
        const index = files_.length - 1;
        file.uid = index;
        files_.splice(index, 1);
        files_.push(file);
        this.setState({
            fileList: files_
        });
    }

    handleRemove(file) {
        const files_ = this.state.fileList;
        files_.map((item,index) => {
            if (item.path === file.path) {
                files_.splice(index,1);
            }
        });
        this.setState({
            fileList: files_
        });
    }

    handleCancel() {  //关闭弹出照片
        this.setState({previewVisible: false });
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.fields.nodeName !== undefined && nextProps.fields.nodeName.value !== null) {
            await this.setState({
                valueName: nextProps.fields.nodeName.value
            });
        } else {
            await this.setState({
                valueName: ''
            });
        }
        if (nextProps.fileFlag) {
            this.setState({
                fileList: nextProps.fileList
            });
            this.props.changeFileFlag();
        }
    }

    render() {
        const {modalflag, fields, modaltype, TreeNodeD, parentName, parentType} = this.props;
        const {loadflag, valueName, previewVisible, previewImage, fileList} = this.state;
        let tit;
        modaltype === 'add' ? tit = '新增公司' : tit = '编辑公司';
        return (
            <div>
                <Modal
                    title={tit}
                    visible={modalflag}
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    confirmLoading={loadflag}
                    wrapClassName='system-modal farming-admin-modal'
                    width={550}
                >
                    {modalflag && <CustomizedForm {...fields} onChange={this.handleFormChange.bind(this)}
                                                  checkName={this.props.checkName}
                                                  getForm={this.getForm.bind(this)} TreeNodeD={TreeNodeD}
                                                  formLoadData={this.formLoadData.bind(this)}
                                                  formChange={this.formChange.bind(this)}
                                                  valueName={valueName} parentName={parentName} parentType={parentType}
                                                  previewVisible={previewVisible} previewImage={previewImage} fileList={fileList}
                                                  handleCancel={this.handleCancel.bind(this)} handleChange={this.handleChange.bind(this)}
                                                  handleRemove={this.handleRemove.bind(this)} handlePreview={this.handlePreview.bind(this)}
                                                  handleState={this.handleState.bind(this)}/>}
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {Alldate, sortfield, sortorder, fields, modalflag, modaltype, queryfields, str,
    rightItem, modifyID, parentID, slideID, TreeD, TreeNodeD, parentname, parenttype} = state.companyReducer;
    return {
        dataList: Alldate,
        parentName: parentname,
        parentType: parenttype,
        fields,
        modalflag,
        modaltype,
        queryfields, str,
        list: state.systemReducer.listdata,
        sortfield, sortorder,
        rightItem, modifyID, parentID, slideID, TreeD, TreeNodeD
    };
};
export default connect(mapstateProps, action)(LocalizedModal);
