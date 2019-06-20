import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
//import moment from 'moment';
import {Modal, Input, Form, message, Select, Icon, Table, LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

const FormItem = Form.Item;
const Option = Select.Option;

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
            no: Form.createFormField({
                value: props.no.value
            }),
            unit: Form.createFormField({
                ...props.unit,
                value: props.unit.value
            }),
            categoryOne: Form.createFormField({
                ...props.categoryOne,
                value: props.categoryOne.value
            }),
            categoryTwo: Form.createFormField({
                ...props.categoryTwo,
                value: props.categoryTwo.value
            }),
            grade: Form.createFormField({
                ...props.grade,
                value: props.grade.value
            }),
            createUserName: Form.createFormField({
                value: props.createUserName.value
            }),
            OKlist: Form.createFormField({
                ...props.OKlist,
                value: props.OKlist
            }),
            deleteList: Form.createFormField({
                value: props.deleteList
            }),
            periodList: Form.createFormField({
                value: props.keyList
            }),
            modeltype: Form.createFormField({
                value: props.modeltype
            })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    props.getForm(props.form);
    const {modeltype} = props;
    let isEdit = false;
    // let createTime = "";
    // let stauts = "";
    let id = "-1";
    if (modeltype.value === 'modify') {
        isEdit = true;
        // createTime = moment(props.createTime.value).format('YYYY-MM-DD HH:mm:ss');
        // stauts = props.stauts.value;
        id = props.id.value;
    }
    const columns = [
        {
            title: '生长周期',
            dataIndex: 'liveName',
            align: "center"
        }, {
            title: '操作',
            dataIndex: 'caozuo',
            align: "center",
            render: (text, index, record) => {
                return <div>
                <span className='cursor' onClick={props.handleUp.bind(this, index, props.OKlist, record)}><Icon
                    type="arrow-up"/></span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span className='cursor' onClick={props.handleDown.bind(this, index, props.OKlist, record)}><Icon
                        type="arrow-down"/></span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span className='cursor' onClick={props.handleDelete.bind(this, index, props.OKlist, record)}><i
                        className='iconfont icon-shanchu'></i></span>
                </div>;
            }
        }];
    return (
        <Form layout="inline">
            <FormItem label="作物品种">
                {getFieldDecorator('name', {
                    rules: [{required: true, message: '请填写作物品种'}]
                })(<Input onChange={(e) => {
                    props.checkName(e.target.value, id,'checkName_crop');
                }}/>)}
            </FormItem>
            {isEdit && <FormItem label="作物编号">
                {getFieldDecorator('no', {
                    rules: []
                })(<div>{<div>{props.no.value}</div>}</div>)}
            </FormItem>}
            <FormItem label="采收单位">
                {getFieldDecorator('unit', {
                    rules: [{required: true, message: '请填写采收单位'}]
                })(<Select style={{width: 300}}>
                    {props.allUnit.value && props.allUnit.value.map((item) => {
                        return <Option key={item.key} value={item.key}>{item.value}</Option>;
                    })}
                </Select>)}
            </FormItem>
            <FormItem label="作物大类">
                {getFieldDecorator('categoryOne', {
                    rules: [{required: true, message: '请选择作物大类'}]
                })(<Select style={{width: 300}} onChange={(e) => {
                    props.selectSmall(e);
                }}>
                    {props.allCategory.value && props.allCategory.value.map((item) => {
                        return <Option key={item.id} value={item.id}>{item.name}</Option>;
                    })}
                </Select>)}
            </FormItem>
            <FormItem label="作物小类">
                {getFieldDecorator('categoryTwo', {
                    rules: [{required: true, message: '请选择作物小类'}]
                })(<Select style={{width: 300}} onChange={(e) => {
                    props.changeSmall(e);
                }}>
                    {props.smallList && props.smallList.map((item) => {
                        return <Option key={item.id} value={item.id}>{item.name}</Option>;
                    })}
                </Select>)}
            </FormItem>
            <FormItem label="所属等级组">
                {getFieldDecorator('grade', {
                    rules: [{required: true, message: '请填写所属等级组'}]
                })(<Select style={{width: 300}}>
                    {props.allGrade.value && props.allGrade.value.map((item) => {
                        return <Option key={item.id} value={item.id}>{item.name}</Option>;
                    })}
                </Select>)}
            </FormItem>
            <div className='crops-div'>
                <div>
                    <div className='crops-cycles'>
                        <span className='crops-cycles-span'>生长周期</span><span className='crops-cycles-last-span'>:</span>
                        <Select mode="multiple" value={props.periodList} defaultValue={props.periodList}
                                style={{width: 300}} onChange={props.selectedList.bind(this)}>
                            {props.allPeriod.value && props.allPeriod.value.map((item) => {
                                return <Option key={item.id} value={item.id}>{item.name}</Option>;
                            })}
                        </Select>
                    </div>
                </div>
                <div className='res-table'>
                    <LocaleProvider locale={zhCN}>
                        <Table bordered rowKey={record => record.liveId} columns={columns} dataSource={props.OKlist}
                               pagination={false}/>
                    </LocaleProvider>
                </div>
            </div>
        </Form>
    );
});

class modifyModal extends Component {
    // 构造器
    constructor(props) {
        super(props);
        this.state = {
            periodList: [],
            smallList: [],
            // 是否可见
            visible: false
        };
    }

    getForm(value) {
        this.formValitate = value;
    }

    changeSmall(e) {
        this.setState({
            categorySmallId: {value: e}
        });
    }

    selectSmall(e) {
        this.setState({
            categorySmallId: {value: ''},
            categoryId: {value: e}
        });
        IOModel.getByCategoryId({parentId: e, companyId: 1}).then((res) => {
            if (res.success) {
                this.setState({
                    smallList: res.data
                });
            }
        }).catch(() => {
            message.warning("获取失败");
        });
    }

    async selectedList(value) {
        const {modaltype} = this.props;
        await this.setState({
            periodList: value
        });
        const list = [];
        this.props.fields.allPeriod.value.forEach((item) => {
            this.state.periodList.forEach((item1) => {
                if (item1 === item.id) {
                    let type = 'insert';
                    let id = '';
                    for (let i = 0; i < this.props.oldPeriod.length; i++) {
                        if (item1 === this.props.oldPeriod[i].liveId) {
                            type = 'update';
                            id = this.props.oldPeriod[i].id;
                            break;
                        }
                    }
                    let vm = {};
                    if (modaltype === 'add') {
                        vm = {
                            companyId: 1,
                            liveId: item.id,
                            type: type,
                            liveName: item.name
                        };
                    } else {
                        vm = {
                            companyId: 1,
                            cropId: this.props.fields.id.value,
                            liveId: item.id,
                            type: type,
                            id: id,
                            liveName: item.name
                        };
                    }
                    list.push(vm);
                }
            });
        });
        await this.setState({
            list: list
        });
    }

    hideModal() {
        //点击确定的回调
        // props中的字段(传参字段)
        const {name, unit, grade, categoryTwo} = this.props.fields;
        // props中的全局变量
        const {Cur, Psize, modaltype, names, nos} = this.props;
        const {list} = this.state;
        // 不为空的验证
        this.formValitate.validateFields((err) => {
            if (!err) {
                if (this.props.saveFlag) {
                    // 新增
                    let count = 1;
                    if (list && list.length > 0) {
                        for (let i = 0; i < list.length; i++) {
                            list[i].sortNum = count;
                            count++;
                        }
                    }
                    if (!list || list.length < 1) {
                        message.warning("生长周期配置不能为空");
                        return;
                    }
                    if (modaltype === 'add') {
                        // 新增的参数
                        const addData = {
                            companyId: 1,
                            name: name.value,
                            unitId: unit.value,
                            categoryId: categoryTwo.value,
                            gradeGroupId: grade.value,
                            cropPeriodsjson: JSON.stringify(list)
                        };
                        IOModel.Adddata(addData).then((res) => {  //添加成功时的回调（新增接口）
                            if (res.success) {
                                if (res.data > 0) {
                                    message.success('添加成功');
                                    if (this.props.queryRole) {
                                        this.props.Alldatas({startPage: 1, limit: Psize, name: names, no: nos});
                                        this.props.page({current: 1, pageSize: Psize});
                                    }
                                    this.setState({
                                        categorySmallId: {value: ''},
                                        categoryId: {value: ''},
                                        smallList: []
                                    });
                                    this.props.modal({modalFlag: false});
                                } else {
                                    message.error('添加失败');
                                }
                            } else {
                                message.error('添加失败');
                            }
                        }).catch(() => {
                            message.error('添加失败');
                        });
                        // 更新
                    } else if (modaltype === 'modify') {
                        /*if (deleteList && deleteList.length > 0) {
                            for (let i = 0; i < deleteList.length; i++) {
                                list.push(deleteList[i]);
                            }
                        }*/
                        const {deleteList} = this.state;
                        let flag = true;
                        const delList = [];
                        for (let i = 0; i < this.props.oldPeriod.length; i++) {
                            for (let j = 0; j < list.length; j++) {
                                if (list[j].liveId === this.props.oldPeriod[i].liveId) {
                                    flag = false;
                                    break;
                                } else {
                                    flag = true;
                                }
                            }
                            if (flag) {
                                delList.push(this.props.oldPeriod[i]);
                            }
                        }
                        for (let i = 0; i < deleteList.length; i++) {
                            for (let j = 0; j < list.length; j++) {
                                if (list[j].liveId === deleteList[i].liveId) {
                                    flag = false;
                                    break;
                                } else {
                                    flag = true;
                                }
                            }
                            if (flag) {
                                delList.push(deleteList[i]);
                            }
                        }
                        delList.forEach((item) => {
                            const vm = {
                                companyId: 1,
                                cropId: this.props.fields.id.value,
                                liveId: item.liveId,
                                type: 'delete',
                                id: item.id,
                                liveName: item.liveName
                            };
                            list.push(vm);
                        });
                        const modifydata = {
                            id: this.props.fields.id.value,
                            companyId: 1,
                            name: name.value,
                            unitId: unit.value,
                            categoryId: categoryTwo.value,
                            gradeGroupId: grade.value,
                            cropPeriodsjson: JSON.stringify(list)
                        };
                        IOModel.Modifydata(modifydata).then((res) => {  //修改成功时的回调（更新接口）
                            if (res.success) {
                                if (res.data > 0) {
                                    message.success('修改成功');
                                    this.props.Alldatas({startPage: Cur, limit: Psize, name: names, no: nos});
                                    this.setState({
                                        categorySmallId: {value: ''},
                                        categoryId: {value: ''},
                                        smallList: []
                                    });
                                    this.props.modal({modalFlag: false});
                                } else {
                                    message.error('修改失败');
                                }
                            } else {
                                message.error('修改失败');
                            }
                        }).catch(() => {
                            message.error('修改失败');
                        });
                    }
                } else {
                    message.warning("作物名已存在");
                }
            } else {
                return;
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editFlag) {
            this.selectSmall(nextProps.fields.categoryOne.value);
            this.setState({
                categoryId: {value: nextProps.fields.categoryOne.value},
                categorySmallId: {value: nextProps.fields.categoryTwo.value},
                periodList: nextProps.fields.keyList,
                list: nextProps.fields.OKlist,
                deleteList: nextProps.fields.deleteList
            });
            this.props.modal({modalFlag: true, modeltype: 'modify', editFlag: false});
        }
        if (nextProps.addFlag) {
            this.setState({
                categoryId: {value: ''},
                categorySmallId: {value: ''},
                smallList: [],
                periodList: [],
                list: [],
                deleteList: []
            });
            this.props.modal({modalFlag: true, modeltype: 'add', addFlag: false});
        }
    }

    hideCancel() {   //点击关闭的回调函数
        this.setState({
            categorySmallId: {value: ''},
            categoryId: {value: ''},
            smallList: []
        });
        this.props.modal({modalFlag: false, modeltype: 'add'});
    }

    handleFormChange(changedFields) {  //表单变化时
        const fields = this.props.fields;
        this.props.defaultFields({...fields, ...changedFields});
    }

    async handleUp(record, list, index) {
        if (index > 0) {
            const item1 = list[index];
            const item2 = list[index - 1];
            list.splice(index, 1, {
                ...item1,
                ...item2
            });
            list.splice(index - 1, 1, {
                ...item2,
                ...item1
            });
            await this.setState({
                list: list
            });
        } else {
            message.warning("已经是第一行咯");
        }
    }

    async handleDelete(record, list, index) {
        const {deleteList, periodList} = this.state;
        if (record.type === 'insert') {
            list.splice(index, 1);
            for (let i = 0; i < periodList.length; i++) {
                if (periodList[i] === record.liveId) {
                    periodList.splice(i, 1);
                }
            }
        } else if (record.type === 'update') {
            record.type = 'delete';
            if (deleteList.liveId > 0) {
                for (let i = 0; i < deleteList.length; i++) {
                    if (record.id === deleteList[i].id) {
                        break;
                    } else {
                        deleteList.push(record);
                    }
                }
            } else {
                deleteList.push(record);
            }
            list.splice(index, 1);
            for (let i = 0; i < periodList.length; i++) {
                if (periodList[i] === record.liveId) {
                    periodList.splice(i, 1);
                }
            }
        }
        await this.setState({
            list: list,
            deleteList: deleteList
        });
    }

    async handleDown(record, list, index) {
        if (index < list.length - 1) {
            const item1 = list[index];
            const item2 = list[index + 1];
            list.splice(index, 1, {
                ...item1,
                ...item2
            });
            list.splice(index + 1, 1, {
                ...item2,
                ...item1
            });
            await this.setState({
                list: list
            });
        } else {
            message.warning("已经是最后一行咯");
        }
    }

    render() {
        const {modalflag, parentName, modaltype, fields} = this.props;
        // 模态框标题
        let title = "编辑作物";
        if (modaltype === 'add') {
            title = "新增作物";
        }
        return (
            <div>
                <Modal
                    title={title}
                    visible={modalflag}
                    destroyOnClose={true}
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName='farming-admin-modal'
                >
                    <CustomizedForm {...fields} onChange={this.handleFormChange.bind(this)} parentName={parentName}
                                    checkName={this.props.checkName}
                                    OKlist={this.state.list} periodList={this.state.periodList}
                                    smallList={this.state.smallList}
                                    selectedList={this.selectedList.bind(this)} getForm={this.getForm.bind(this)}
                                    categoryTwoId={this.state.categorySmallId}
                                    handleUp={this.handleUp.bind(this)} selectSmall={this.selectSmall.bind(this)}
                                    categoryOneId={this.state.categoryId}
                                    handleDelete={this.handleDelete.bind(this)}
                                    changeSmall={this.changeSmall.bind(this)}
                                    handleDown={this.handleDown.bind(this)}/>
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {editFlag, addFlag, Alldate, oldPeriod, isOk, parentname, parentID, Cur, Psize, fields, modalflag, chooseCUR, chooseSIZE, modaltype, TreeD, slideID, modifyID, slideparentID, slideName} = state.cropReducer;
    return {
        editFlag, addFlag, oldPeriod,
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
