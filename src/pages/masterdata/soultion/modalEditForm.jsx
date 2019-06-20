import {Component} from 'react';
import {connect} from 'react-redux';
import {action} from './addmodel';
import {IOModelOut} from "@/pages/masterdata/crop/model";
import {Modal, Input, Form, message, Select, Icon, Table, LocaleProvider} from 'antd';
import {IOModel} from "@/pages/masterdata/soultion/addmodel";
const FormItem = Form.Item;
const Option = Select.Option;
import zhCN from 'antd/lib/locale-provider/zh_CN';
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
            periodList: Form.createFormField({
                value: props.allPeriod.value
            }),
            modeltype: Form.createFormField({
                value: props.modeltype
            })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    props.getForm(props.form);
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
                    rules: [{required: true,message:'请填写作物品种'}]
                })(<Input readOnly='true'/>)}
            </FormItem>
            <div className='crops-div'>
                <div>
                    <div className='crops-cycles'>
                        <span className='crops-cycles-span'>生长周期</span><span className='crops-cycles-last-span'>:</span>
                        <Select mode="multiple" value={props.periodList} defaultValue={props.periodList} style={{width: 300}} onChange={props.selectedList.bind(this)}>
                            {props.allPeriod.value.map((item) => {
                                return <Option key={item.id} value={item.id}>{item.name}</Option>;
                            })}
                        </Select>
                    </div>
                </div>
                <div className='res-table'>
                    <LocaleProvider locale={zhCN}>
                        <Table bordered rowKey={record => record.liveId} columns={columns} dataSource={props.OKlist} pagination={false}/>
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
            periodList:[],
            deleteList:[],
            // 是否可见
            visible: false
        };
    }
    getForm(value) {
        this.formValitate = value;
    }
    async selectedList(value) {
        await this.setState({
            periodList:value
        });
        const list = [];
        this.props.fields.allPeriod.value.forEach((item) => {
            this.state.periodList.forEach((item1) => {
                if(item1 === item.id) {
                    let type = 'insert';
                    let id = '';
                    for(let i = 0; i < this.props.oldPeriod.length; i++) {
                        if(item1 === this.props.oldPeriod[i].liveId) {
                            type = 'update';
                            id = this.props.oldPeriod[i].id;
                            break;
                        }
                    }
                    const vm = {
                        companyId:1,
                        cropId:this.props.fields.id.value,
                        liveId:item.id,
                        type:type,
                        duration:0,
                        id:id,
                        liveName:item.name
                    };
                    list.push(vm);
                }
            });
        });
        await this.setState({
            list:list
        });
    }
    async hideModal() {
        const {list} = this.state;
        this.formValitate.validateFields((err) => {
          if (err) {
            // 新增
          }else{
            return;
          }
        });
        let count = 1;
        if (list && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            list[i].sortNum = count;
            count++;
          }
        }
        if(!list || list.length < 1) {
          message.warning("生长周期配置不能为空");
          return;
        }
        const finalList = [];
        list.forEach((item) => {
          finalList.push(item);
        });
        const {deleteList} = this.state;
        let flag = true;
        const delList = [];
        for(let i = 0; i < this.props.oldPeriod.length; i++) {
          for(let j = 0; j < finalList.length; j++) {
            if(finalList[j].liveId === this.props.oldPeriod[i].liveId) {
              flag = false;
              break;
            }else {
              flag = true;
            }
          }
          if(flag) {
            delList.push(this.props.oldPeriod[i]);
          }
        }
        for(let i = 0; i < deleteList.length; i++) {
          for(let j = 0; j < finalList.length; j++) {
            if(finalList[j].liveId === deleteList[i].liveId) {
              flag = false;
              break;
            }else {
              flag = true;
            }
          }
          if(flag) {
            delList.push(deleteList[i]);
          }
        }
        delList.forEach((item) => {
          const vm = {
            companyId:1,
            cropId:this.props.fields.id.value,
            liveId:item.liveId,
            type:'delete',
            id:item.id,
            liveName:item.liveName
          };
          finalList.push(vm);
        });
        const modifydata = {
          id: this.props.fields.id.value,
          companyId: 1,
          name: this.props.fields.name.value,
          cropPeriodsjson:JSON.stringify(finalList)
        };
        await IOModelOut.Modifydata(modifydata).then((res) => {  //修改成功时的回调（更新接口）
          if (res.success) {
            if (res.data > 0) {
              message.success('修改成功');
              const list = this.props.taskList;
              list.forEach((item) => {
                item.periodList = this.state.list;
                return item;
              });
              this.props.onChooseTaskList(list);
              this.props.modal({modalFlag: false, modeltype: 'add'});
            } else {
              message.error('修改失败');
            }
          } else {
            message.error('修改失败');
          }
        }).catch(() => {
          message.error('修改失败');
        });
        const cycleList = [];
        await IOModel.listCycleData({':id': this.props.fields.id.value}).then((res) => {
          if(res.success) {
            const list = res.data.astCropPeriods || [];
            if (list.length > 0) {
              for (let i = 0; i < list.length; i++) {
                list[i].duration = 0;
                cycleList.push(list[i]);
              }
            }
          }
        }).catch();
        await this.props.setCycleValue(cycleList);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.editFlag) {
            this.setState({
                periodList:nextProps.fields.keyList,
                list: nextProps.fields.OKlist,
                deleteList:nextProps.fields.deleteList
            });
            this.props.modal({modalFlag: true, modeltype: 'modify',editFlag:false});
        }
    }

    hideCancel() {   //点击关闭的回调函数
        this.props.modal({modalFlag: false, modeltype: 'add'});
    }

    handleFormChange(changedFields) {  //表单变化时
        const fields = this.props.fields;
        this.props.defaultFields({...fields, ...changedFields});
    }

    handleUp(record, list, index) {
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
            this.setState({
                list: list
            });
        } else {
            message.warning("已经是第一行咯");
        }
    }

    handleDelete(record, list, index) {
        const { deleteList,periodList } = this.state;
        if (record.type === 'insert') {
            console.log('物理删除',index);
        } else if (record.type === 'update') {
            record.type = 'delete';
            if(deleteList.length > 0) {
                for(let i = 0; i < deleteList.length; i++) {
                    if(record.id === deleteList[i].id) {
                        break;
                    }else{
                        deleteList.push(record);
                    }
                }
            }else{
                deleteList.push(record);
            }
        }
      list.splice(index,1);
      for(let i = 0; i < periodList.length; i++) {
        if(periodList[i] === record.liveId) {
          periodList.splice(i,1);
        }
      }
        this.setState({
            list: list,
            deleteList:deleteList
        });
    }

    handleDown(record, list, index) {
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
            this.setState({
                list: list
            });
        } else {
            message.warning("已经是最后一行咯");
        }
    }

    render() {
        const {modalflag, parentName, fields} = this.props;
        // 模态框标题
        return (
            <div>
                <Modal
                    title='编辑周期'
                    visible={modalflag}
                    destroyOnClose={true}
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName='farming-admin-modal'
                >
                    <CustomizedForm {...fields} onChange={this.handleFormChange.bind(this)} parentName={parentName}
                                    OKlist={this.state.list} periodList={this.state.periodList}
                                    selectedList={this.selectedList.bind(this)} getForm={this.getForm.bind(this)}
                                    handleUp={this.handleUp.bind(this)}
                                    handleDelete={this.handleDelete.bind(this)}
                                    handleDown={this.handleDown.bind(this)}/>
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {editFlag,taskList,addFlag,Alldate,oldPeriod, isOk, parentname, parentID, Cur, Psize,
        fields, modalflag, chooseCUR, chooseSIZE, TreeD, slideID,
        modifyID, slideparentID, slideName} = state.programAddReducer;
    return {
        editFlag,addFlag,oldPeriod,taskList,
        dataList: Alldate,
        isok: isOk,
        parentName: parentname,
        parentID, modifyID,
        Cur,
        Psize,
        fields: fields,
        modalflag, TreeD, slideID,
        chooseCUR, chooseSIZE, slideparentID, slideName
    };
};
export default connect(mapstateProps, action)(modifyModal);
