import {Component} from 'react';
import {Input, message,Select,Button} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import ModalForm from './modalForm.jsx';
import ModalFormLand from './modalFormLand.jsx';
import '../../index.less';
import './index.less';
import Com from "@/component/common";
import Zoomable from 'react-stretchable';
import RightSide from "./rightSides/index.jsx";
const Option = Select.Option;
class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            name: '',//地块名称
            baseName: '',//基地名称
            userId: '',//负责人
            queryFlag: false,  //筛选按钮
            queryF:false,
            chooseId: null,
            queryRole: false,
            addRole: false,
            editRole: false,
            getRole: false,
            saveFlag:true,
            personList:[],
            showAddBase:false,
            showAddLand:false,
            title:'11'
        };
    }
    async componentDidMount() {
        this.props.AlldatasLand({startPage:1,limit:10});  //进入页面请求列表数据
        this.props.getEmpListByType();
        IOModel.getEmpListByType({type: 2}).then((res) => {
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
        this.props.getSelestData({companyId: 1});
        this.props.superiorName({name:'地块',parentLeftID:-1});
        this.props.page({current: 1, pageSize: 10});
        IOModel.treeData().then((res) => {
            let treedata;
            if (!res.data) {
                treedata = [];
            } else {
                treedata = res.data;
            }
            this.props.TreeData({tree: treedata});
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
    setBaseName(event) {  //查找的表单-地块名称
        this.setState({
            baseName: event.target.value
        },() => {
            if(this.setState.baseName) {
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

    setUserId(event) {
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

    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            userId: this.state.userId,
            baseName:this.state.baseName,
            landName: this.state.name,
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
            name: this.state.name,
            startPage: current,
            limit: size
        };
        this.props.queryAll(vm);
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            userId: this.state.userId,
            name: this.state.name,
            startPage: 1,
            limit: size
        };
        this.props.queryAll(vm);
    }
    addmodel(record,e) {  //点击新增的按钮
        if(record.type==='company') {
            if(e) {
                if(this.state.queryF) {
                    if(this.state.changedata.title===record.title) {
                        e.stopPropagation();
                    }
                }
            }
            if(!e && !this.state.queryF) {
                this.props.superiorName({name: localStorage.getItem('companyName')});
                this.props.slide({num: record.id, slideName: record.title});
            }else if(this.state.queryF && !e) {
                this.props.slide({num: this.state.changedata.id, slideName: this.state.changedata.title});
                this.props.superiorName({name: this.state.changedata.title});
            }else if(e) {
                this.props.slide({num: record.id, slideName: record.title});
                this.props.superiorName({name: record.title});
            }
            this.props.modal({modalFlag: true, modeltype: 'add',modalFlag_land:false,modeltype_land:''});  //控制modal的按钮
            this.props.defaultFields({
                functionaryList: {
                    value: this.props.functionaryList
                },
                name: {
                    value: ''
                },
                code: {
                    value: ''
                },
                area: {
                    value: record.area
                },
                longitude: {
                    value: ''
                },
                latitude: {
                    value: ''
                },
                phone: {
                    value: ''
                },
                address: {
                    value: ''
                },
                createUserName: {
                    value: ''
                },
                user: {
                    value: ''
                },
                company: {
                    value:record.title
                },
                companyId:{
                    value:Number(record.id.split('|')[0])
                },
                modeltype: {
                    value: 'add'
                }
            });
        } else if(record.type==='base') {
            this.props.getOne({":id":Number(record.id.split('|')[0])});
            if(e) {
                if(this.state.queryF) {
                    if(this.state.changedata.title===record.title) {
                        e.stopPropagation();
                    }
                }
            }
            if(!e && !this.state.queryF) {
                this.props.superiorName({name: localStorage.getItem('companyName')});
                this.props.slide({num: record.id, slideName: record.title});
            }else if(this.state.queryF && !e) {
                this.props.slide({num: this.state.changedata.id, slideName: this.state.changedata.title});
                this.props.superiorName({name: this.state.changedata.title});
            }else if(e) {
                this.props.slide({num: record.id, slideName: record.title});
                this.props.superiorName({name: record.title});
            }
            this.props.modal({modalFlag: false, modeltype: '',modalFlag_land:true,modeltype_land:'add'});  //控制modal的按钮
            this.props.defaultFields({
                functionaryList: {
                    value: this.state.personList
                },
                allBase: {
                    value: ''
                },
                allLandType: {
                    value: this.props.allLandType
                },
                landName: {
                    value: ''
                },
                code: {
                    value: ''
                },
                baseName: {
                    value: record.title
                },
                baseId:{
                    value:Number(record.id.split('|')[0])
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
                company:{
                    value:record.title
                },
                modeltype_land: {
                    value: 'add'
                }
            });
        }
    }
    addmodelBase(type) {
        const {currentRecord} = this.state;
        if(type==='company') {
            this.props.modal({modalFlag: true, modeltype: 'add',modalFlag_land:false,modeltype_land:''});  //控制modal的按钮
            this.props.defaultFields({
                functionaryList: {
                    value: this.props.functionaryList
                },
                name: {
                    value: ''
                },
                code: {
                    value: ''
                },
                area: {
                    value: currentRecord.area
                },
                longitude: {
                    value: ''
                },
                latitude: {
                    value: ''
                },
                phone: {
                    value: ''
                },
                address: {
                    value: ''
                },
                createUserName: {
                    value: ''
                },
                user: {
                    value: ''
                },
                company: {
                    value:currentRecord.title
                },
                companyId:{
                    value:Number(currentRecord.id.split('|')[0])
                },
                modeltype: {
                    value: 'add'
                }
            });
        } else if(type==='base') {
            this.props.modal({modalFlag: false, modeltype: '',modalFlag_land:true,modeltype_land:'add'});  //控制modal的按钮
            this.props.defaultFields({
                functionaryList: {
                    value: this.state.personList
                },
                allBase: {
                    value: ''
                },
                allLandType: {
                    value: this.props.allLandType
                },
                landName: {
                    value: ''
                },
                code: {
                    value: ''
                },
                baseName: {
                    value: currentRecord.title.split('】')[1]
                },
                baseId:{
                    value:Number(currentRecord.id.split('|')[0])
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
                company:{
                    value:currentRecord.title
                },
                modeltype_land: {
                    value: 'add'
                }
            });
        }
    }
    async editor(record, e) {
        e.stopPropagation();
        if(record.type==='base') {
            await this.props.getOne({':id': Number(record.id.split('|')[0])});
            const row = this.props.EditData;
            console.log(row,'jjddd');
            this.props.defaultFields({
                functionaryList: {
                    value: this.props.functionaryList
                },
                id: {
                    value: row.id
                },
                companyId: {
                    value: row.companyId
                },
                name: {
                    value: row.name
                },
                code: {
                    value: row.code
                },
                area: {
                    value: row.area
                },
                functionary: {
                    value: row.functionary
                },
                longitude: {
                    value: row.longitude
                },
                latitude: {
                    value: row.latitude
                },
                phone: {
                    value: row.phone
                },
                address: {
                    value: row.address
                },
                company:{
                    value: row.companyName
                },
                createUserName: {
                    value: row.createUserName
                },
                createTime: {
                    value: row.createTime
                },
                user: {
                    value: row.userId
                },
                stauts: {
                    value: row.stauts
                },
                orgId: {
                    value: row.orgId
                },
                modeltype: {
                    value: 'modify'
                }
            });
            this.props.modal({modalFlag: true, modeltype: 'modify',modalFlag_land:false,modeltype_land:''});
        } else if(record.type==='land') {
            await this.props.getOneLand({':id': Number(record.id.split('|')[0])});
            const row = this.props.Rditdate;
            this.props.defaultFields({
                functionaryList: {
                    value: this.state.personList
                },
                allLandType: {
                    value: this.props.allLandType
                },
                id: {
                    value: row.id
                },
                landName: {
                    value: row.name
                },
                code: {
                    value: row.code
                },
                area: {
                    value: row.area
                },
                typeName: {
                    value: row.landtypeId
                },
                longitude: {
                    value: row.longitude
                },
                latitude: {
                    value: row.latitude
                },
                phone: {
                    value: row.phone
                },
                baseName: {
                    value: row.baseName
                },
                createName: {
                    value: row.createUserName
                },
                createTime: {
                    value: row.gmtCreate
                },
                baseId:{
                    value: row.baseId
                },
                user: {
                    value: row.userId
                },
                stauts: {
                    value: row.stauts
                },
                gisData: {
                    value: row.gisData
                },
                orgId: {
                    value: row.orgId
                },
                modeltype_land: {
                    value: 'modify'
                }
            });
            this.props.modal({modalFlag: false, modeltype: '',modalFlag_land:true,modeltype_land:'modify'});
        }
    }
    deleteR(record,e) {
        let tit;
        e.stopPropagation();
        if (record.childrens && record.childrens.length>0) {
            tit = '您确定连同子元素一起删除吗？';
        } else {
            tit = '是否确认删除？';
        }
        const _this = this;
        confirm({
            title: tit,
            okText: '确认',
            okType: 'primary',
            cancelText: '取消',
            confirmLoading: false,
            onOk() {
                _this.confirm(record);
            }
        });
    }
    formChange(node, selected) {  //点击每一条数据的方法
        this.setState({
            queryF:selected,
            valueName:'',
            current: 1,
            changedata:node.props
        }, () => {
            const ids = node.props.id;
            if(node.props.type==='company') {
                this.props.setId({companyId:Number(ids.split('|')[0])});
                if(!selected) {
                    this.props.AlldatasLand({startPage:1,limit:10});
                    this.setState({
                        chooseFlag: false,
                        current: 1,
                        Treeflag: true,
                        showAddBase:false,
                        showAddLand:false
                    });
                }else {
                    this.props.AlldatasLand({startPage:1,limit:10,companyId:Number(ids.split('|')[0])});
                    this.setState({
                        chooseId: ids,
                        chooseFlag: true,
                        queryFlag: false,
                        Treeflag: false,
                        showAddBase:true,
                        showAddLand:false,
                        currentRecord:node.props.title.props.item
                    });
                }
            } else if(node.props.type==='base') {
                this.props.setId({baseId:Number(ids.split('|')[0])});
                if(!selected) {
                    this.props.AlldatasLand({startPage:1,limit:10});
                    this.setState({
                        chooseFlag: false,
                        current: 1,
                        Treeflag: true,
                        showAddBase:false,
                        showAddLand:false
                    });
                }else {
                    this.props.setId({});
                    this.props.AlldatasLand({startPage:1,limit:10,baseId:Number(ids.split('|')[0])});
                    this.setState({
                        chooseId: ids,
                        chooseFlag: true,
                        queryFlag: false,
                        Treeflag: false,
                        showAddBase:false,
                        showAddLand:true,
                        currentRecord:node.props.title.props.item
                    });
                }
            }
            const {superiorName} = this.props;
            // this.props.slide({num: ids,slideName: !selected ? localStorage.getItem('companyName') : node.props.orgName, companyId: companyId});
            if (!selected) {
                superiorName({name: localStorage.getItem('companyName')});
                this.props.slide({num: -1, slideName: localStorage.getItem('companyName'), companyId: -1});
            } else {
                superiorName({name: node.props.orgName});
            }
        });
    }

    onchooseChange(current, size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
    }

    checkName(name, id,companyId) {
        if(this.state.closure) {
            clearTimeout(this.state.closure);
        }
        this.setState({
            closure : setTimeout(() => {
                if(name) {
                    if(this.props.fields.modeltype.value === 'add') {
                        IOModel.CheckName({companyId: companyId, name: name.trim()}).then((res) => {  //添加成功时的回
                            if (res.success) {
                                if (res.data === 0) {
                                    this.setState({
                                        saveFlag:false
                                    });
                                    message.warning('基地名已存在');
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
                        }).catch();
                    } else if(this.props.fields.modeltype.value === 'modify') {
                        IOModel.CheckName({companyId: companyId, name: name.trim(), id: id}).then((res) => {  //添加成功时的回
                            if (res.success) {
                                if (res.data === 0) {
                                    this.setState({
                                        saveFlag:false
                                    });
                                    message.warning('基地名已存在');
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
                        }).catch();
                    }
                }
            },800)
        });
    }
    checkLandName(name, id,baseId) {
        if(this.state.closure) {
            clearTimeout(this.state.closure);
        }
        this.setState({
            closure : setTimeout(() => {
                if(name) {
                    if(this.props.fields.modeltype_land.value === 'add') {
                        IOModel.CheckLandName({baseId: baseId, name: name}).then((res) => {  //添加成功时的回
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
                    } else if(this.props.fields.modeltype_land.value === 'modify') {
                        IOModel.CheckLandName({baseId: baseId, name: name, id: id}).then((res) => {  //添加成功时的回
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
            },800)
        });
    }
    updateTree() {
        IOModel.treeData().then((res) => {
            let treedata;
            if (!res.data) {
                treedata = [];
            } else {
                treedata = res.data;
            }
            this.props.TreeData({tree: treedata});
        });
    }
    setPosition(value) {
        if(value) {
            IOModel.setPosition({address:value}).then((res) => {  //添加成功时的回
                if (res.success) {
                    const longitude=res.data.longitude;
                    const latitude=res.data.latitude;
                    this.props.setPosi({longitude:{value:longitude},latitude:{value:latitude}});
                }else {
                    this.props.setPosi({longitude:{value:''},latitude:{value:''}});
                }
            }).catch();
        }else {
            this.props.setPosi({longitude:{value:''},latitude:{value:''}});
        }
    }
    render() {
        const me = this;
        const {securityKeyWord,TreeD} = this.props;
        const queryRole  = Com.hasRole(securityKeyWord, 'base_listByPage', 'show');
        const addRole = Com.hasRole(securityKeyWord, 'base_add', 'insert');
        const addRoleLand = Com.hasRole(securityKeyWord, 'land_add', 'insert');
        // const addRole = Com.hasRole(securityKeyWord, 'base_add', 'insert');
        const editRole = Com.hasRole(securityKeyWord, 'base_update', 'update');
        const { queryFlag, personList} = this.state;
        const {Alldate} = this.props;
        const list = [];
        list.push({id: '',name: '全部'});
        personList.forEach((item) => {
            list.push(item);
        });
        const RightSidedata = {
            TreeDatalist:TreeD,
            ref:self => {me.rightSides = self;}
        };
        const zoomableOpt = {
            draggable: {
                used: false
            },
            zoomable: {
                width: {
                    min: 150,
                    max: 300
                },
                direction: ["right"]
            },
            fixedHeight: "100%"
        };
        return (
            <div className='farming-box base-box'>
                <div className='wrap'>
                    <Zoomable {...zoomableOpt}>
                        <RightSide TreeD={TreeD} keyword='base' {...RightSidedata} add={this.addmodel.bind(this)} editor={this.editor.bind(this)} deleteR={this.deleteR.bind(this)} securityKeyWord={this.props.securityKeyWord} formChange={this.formChange.bind(this)}/>
                    </Zoomable>
                </div>
                <div className='base-rightbox'>
                    <div className='farming-search'>
                        <div className='farming-title'>
                            <div className='title'>资产维护</div>
                            <div className='basesearch-layout'>
                                <div className='search-row'>
                                    <div className='search-col'>
                                        <span className='label-title'>基地名称</span>
                                        <div className='search-input'><Input size="large" value={this.state.baseName} onChange={this.setBaseName.bind(this)}/></div>
                                    </div>
                                    <div className='search-col'>
                                        <span className='label-title'>地块名称</span>
                                        <div className='search-input'><Input size="large" value={this.state.name} onChange={this.setName.bind(this)}/></div>
                                    </div>
                                    {/*<div className='search-col'>
                                        <span className='label-title'>所属基地</span>
                                        <Input size="large" value={this.state.address} onChange={this.setAddress.bind(this)}/>
                                    </div>*/}
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
                            <p><i className='iconfont icon-sort'></i><span>资产维护列表</span></p>
                            {this.state.showAddBase && addRole && <p><Button onClick={this.addmodelBase.bind(this,'company')}>新增基地</Button></p>}
                            {this.state.showAddLand && addRoleLand && <p><Button onClick={this.addmodelBase.bind(this,'base')}>新增地块</Button></p>}
                            {/*{addRoleLand && <p><Button onClick={this.addmodel.bind(this)}>新增地块</Button></p>}*/}
                        </div>
                        <Tables data={Alldate} address={this.state.address} userId={this.state.userId} name={this.state.name} onSizeChangequery={this.onSizeChangequery.bind(this)} personList={this.state.personList}
                                              onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag} editRole={editRole} onShowSizeChange={this.onShowSizeChange.bind(this)}/>
                        <ModalForm names={this.state.name} setPosition={this.setPosition.bind(this)} updateTree={this.updateTree.bind(this)} userId={this.state.userId} props={this.props} checkName={this.checkName.bind(this)} queryRole={queryRole} saveFlag={this.state.saveFlag}/>
                        <ModalFormLand userId={this.state.userId} updateTree={this.updateTree.bind(this)} landNames={this.state.name} baseNames={this.state.address}props={this.props} checkName={this.checkLandName.bind(this)} queryRole={queryRole} saveFlag={this.state.saveFlag}/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {companyId,baseId,fields,functionaryList,TreeD,allLandType,EditData,Rditdate,Alldate} = state.baseReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['base_listByPage','base_add','base_update','base_getById'];
    return {
        companyId,baseId,
        fields,
        Alldate,
        EditData,Rditdate,
        allLandType,
        TreeD,
        functionaryList,
        securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
