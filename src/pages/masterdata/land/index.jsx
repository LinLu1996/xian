import {Component} from 'react';
import {Input, Button, message, Select} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import ModalForm from './modalForm.jsx';
import '../../index.less';
import Com from "@/component/common";
import {BaseIOModel} from "@/pages/masterdata/base/model";
const Option = Select.Option;
class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',//地块名称
            address: '',//所属基地
            userId: '',//负责人
            personList: [],
            queryFlag: false,  //筛选按钮
            chooseId: null,
            queryRole: false,
            addRole: false,
            editRole: false,
            saveFlag: true,
          closure:null
        };
    }
    async componentDidMount() {
        this.props.Alldatas({startPage:1,limit:10});  //进入页面请求列表数据
        this.props.getSelestData({companyId: 1});  //进入页面请求列表数据
        this.props.page({current: 1, pageSize: 10});
        this.props.superiorName({name:'地块',parentLeftID:-1});
        BaseIOModel.getEmpListByType({type: 2}).then((res) => {
            const data = res.data;
            const personList = [];
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const person = {};
                    person.id = data[i].id;
                    person.name = data[i].realName;
                    personList.push(person);
                }
                this.setState({
                    personList: personList
                });
            }
        });
    }
    setUserId(event) {  //查找的表单-用户名称
        this.setState({
            userId: event
        },() => {
          if(this.setState.userId) {
            this.setState({
              queryFlag:true
            });
          } else {
            this.setState({
              queryFlag:false
            });
          }
          if(this.state.closure) {
            clearTimeout(this.state.closure);
          }
          this.setState({
            closure : setTimeout(() => {
              this.query();
            },800)
          });
        });
    }

    setName(event) {  //查找的表单-地块名称
        this.setState({
            name: event.target.value
        },() => {
          if(this.setState.name) {
            this.setState({
              queryFlag:true
            });
          } else {
            this.setState({
              queryFlag:false
            });
          }
          if(this.state.closure) {
            clearTimeout(this.state.closure);
          }
          this.setState({
            closure : setTimeout(() => {
              this.query();
            },800)
          });
        });
    }

    setAddress(event) {  //查找的表单-地块名称
        this.setState({
            address: event.target.value
        },() => {
          if(this.setState.address) {
            this.setState({
              queryFlag:true
            });
          } else {
            this.setState({
              queryFlag:false
            });
          }
          if(this.state.closure) {
            clearTimeout(this.state.closure);
          }
          this.setState({
            closure : setTimeout(() => {
              this.query();
            },800)
          });
        });
    }

    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            userId: this.state.userId,
            landName: this.state.name,
            baseName: this.state.address,//所属基地
            startPage: 1,
            limit: 10
        };
        this.props.queryAll(vm);
        this.props.page({current: 1, pageSize: 10});
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            userId: this.state.userId,
            landName: this.state.name,
            baseName: this.state.address,//所属基地
            startPage: current,
            limit: size
        };
        this.props.queryAll(vm);
    }

    addmodel() {   //增加的按钮
        this.props.modal({modalFlag: true, modeltype: 'add'});
        this.props.defaultFields({
            functionaryList: {
                value: this.state.personList
            },
            allBase: {
                value: this.props.allBase.data
            },
            allLandType: {
                value: this.props.allLandType.data
            },
            landName: {
                value: ''
            },
            code: {
                value: ''
            },
            baseName: {
                value: ''
            },
            typeName: {
                value: ''
            },
            area: {
                value: ''
            },
            longitude: {
                value: ''
            },
            latitude: {
                value: ''
            },
            user:{
                value: ''
            },
            createName: {
                value: ''
            },
            gisData: {
                value: ''
            },
            modeltype: {
                value: 'add'
            }
        });
    }

    fnondrag(num) {   //点击左侧边的id
        this.setState({
            chooseId: num
        });
    }

    onchooseChange(current, size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
    }

    checkName(name, id) {
        if(name) {
          IOModel.CheckName({companyId: 1, name: name, id: id}).then((res) => {  //添加成功时的回
            if (res.success) {
              if (res.data === 0) {
                this.setState({
                  saveFlag:false
                });
                message.warning('地块名已存在');
              } else if (res.data === -1) {
                message.error('验证失败');
              } else if(res.data > 0) {
                this.setState({
                  saveFlag:true
                });
              }
            } else {
              message.error('验证失败');
            }
          }).catch(() => {
            message.error('验证失败');
          });
        }
    }

    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'land_listByPage', 'show');
        const addRole = Com.hasRole(securityKeyWord, 'land_add', 'insert');
        const editRole = Com.hasRole(securityKeyWord, 'land_update', 'update');
        const { queryFlag, personList} = this.state;
        const {dataList} = this.props;
        const list = [];
        list.push({id: '',name: '全部'});
        personList.forEach((item) => {
            list.push(item);
        });
        return (
            <div className='farming-box master-box'>
                <div className='farming-search'>
                    <div className='farming-title'>
                  <div className='title'>地块维护</div>
                        <div className='search-layout '>
                        <div className='search-row'>
                            <div className='search-col'>
                                <span className='label-title'>地块名称</span>
                                <Input size="large" value={this.state.name} onChange={this.setName.bind(this)}/>
                            </div>
                            <div className='search-col'>
                                <span className='label-title'>所属基地</span>
                                <Input size="large" value={this.state.address} onChange={this.setAddress.bind(this)}/>
                            </div>
                            <div className='search-col'>
                                <span className='label-title'>负责人</span>
                                <Select value={this.state.userId} onChange={this.setUserId.bind(this)}
                                        showSearch
                                        placeholder="请选择负责人"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                    {list.map((item) => {
                                        return <Option key={item.id} value={item.id}>{item.name}</Option>;
                                    })}
                                </Select>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className='content'>
                    <div className='table-header'>
                        <p><i className='iconfont icon-sort'></i><span>地块维护列表</span></p>
                        {addRole && <p><Button onClick={this.addmodel.bind(this)}>新增地块</Button></p>}
                    </div>
                    {queryRole && <Tables data={dataList} address={this.state.address} userId={this.state.userId} name={this.state.name} onSizeChangequery={this.onSizeChangequery.bind(this)} personList={this.state.personList}
                            onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag} editRole={editRole}/>}
                    <ModalForm userId={this.state.userId} landNames={this.state.name} baseNames={this.state.address}props={this.props} checkName={this.checkName.bind(this)} queryRole={queryRole} saveFlag={this.state.saveFlag}/>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName, allBase, allLandType} = state.farmingLandReducer;
    const { securityKeyWord } = state.initReducer;
   // const securityKeyWord = ['land_listByPage','land_add','land_update'];
    return {
        allBase: allBase,
        allLandType: allLandType,
        dataList: Alldate,//展示列表的数据
        slideName,
        securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
