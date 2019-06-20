import {Component} from 'react';
import {Input, Button, message} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import ModalForm from './modalForm.jsx';
import ModalTwo from './modalTwo.jsx';
import './../../index.less';
import './index.less';
import Com from '@/component/common';

class CropMaintenance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',//作物大类名称
            queryFlag: false,  //筛选按钮
            chooseId: null,
            saveFlag: true,
            saveFlag2: true,
            closure:null
        };
    }

    componentDidMount() {
        this.props.Alldatas({startPage: 1, limit: 10, companyId: 1}); //进入页面请求列表数据
        this.props.superiorName({name: '作物大类', parentLeftID: -1});
    }

    setBaseName(event) {  //查找的表单-作物大类名称
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

    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            companyId: 1,
            name: this.state.name,
            startPage: 1,
            limit: 10
        };
        this.props.queryAll(vm);
        this.props.page({current:1, pageSize:10});
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        const vm = {
            companyId: 1,
            name: this.state.name,
            startPage: current,
            limit: size
        };
        this.props.queryAll(vm);
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        const vm = {
            companyId: 1,
            name: this.state.name,
            startPage: 1,
            limit: size
        };
        this.props.queryAll(vm);
    }

    addmodel() {   //增加的按钮
        this.props.defaultFields({
            name: {
                value: ''
            },
            parentId: {
                value: ''
            },
            modeltype: {
                value: 'add'
            }
        });
        this.props.modal({modalFlag: true, modeltype: 'add'});
    }

    fnondrag(num) {   //点击左侧边的id
        this.setState({
            chooseId: num
        });
    }

    onchooseChange(current, size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
        this.props.page({current:current, pageSize:size});
    }

    checkName(name, id, parentId) {
        if(this.state.closure) {
            clearTimeout(this.state.closure);
        }
        this.setState({
            closure : setTimeout(() => {
                if(name) {
                    IOModel.CheckName({parentId: parentId, companyId: 1, name: name, id: id}).then((res) => {  //添加成功时的回
                        if (res.success) {
                            if (res.data === 0) {
                                this.setState({
                                    saveFlag:false
                                });
                                message.warning('作物大类名已存在');
                            } else if (res.data === -1) {
                                message.error('验证失败');
                            }else if(res.data > 0) {
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
            },800)
        });
    }

    checkNameTwo(name, id, parentId) {
        if(name) {
          IOModel.CheckName({parentId: parentId, companyId: 1, name: name, id: id}).then((res) => {  //添加成功时的回
            if (res.success) {
              if (res.data === 0) {
                this.setState({
                  saveFlag2:false
                });
                message.warning('作物小类名已存在');
              } else if (res.data === -1) {
                message.error('验证失败');
              } else if(res.data > 0) {
                this.setState({
                  saveFlag2:true
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
        const queryRole = Com.hasRole(securityKeyWord, 'category_listByPage', 'show');
        const addRole = Com.hasRole(securityKeyWord, 'category_add', 'insert');
        const editRole = Com.hasRole(securityKeyWord, 'category_update', 'update');
        const getRole = Com.hasRole(securityKeyWord, 'category_getById', 'show');
        const gradeAddRole = Com.hasRole(securityKeyWord, 'category_grade_add', 'insert');
        const gradeQueryRole = Com.hasRole(securityKeyWord, 'category_grade_query', 'show');
        const gradeEditRole = Com.hasRole(securityKeyWord, 'category_grade_update', 'update');
        const {queryFlag, Alldate} = this.state;
        return (
            <div className='farming-box master-box'>
                <div className='farming-search'>
                    <div className='farming-title'>
                    <div className='title'>作物分类</div>
                  <div className='search-layout search-layout-1'>
                        <div className='search-row'>
                            <div className='search-col'>
                                <span className='label-title'>大类名称</span>
                                <Input size="large" value={this.state.name} onChange={this.setBaseName.bind(this)}/>
                            </div>
                        </div>
                    </div></div>
                </div>
                <div className='content categoryContent'>
                    <div className='table-header'>
                        <p><i className='iconfont icon-sort'></i><span>作物分类列表</span></p>
                        {addRole && <p><Button onClick={this.addmodel.bind(this)}>新增作物</Button></p>}
                    </div>
                    {queryRole && <Tables data={Alldate} name={this.state.name} getRole={getRole} editRole={editRole} gradeQueryRole={gradeQueryRole} gradeAddRole={gradeAddRole} gradeEditRole={gradeEditRole}
                                          onSizeChangequery={this.onSizeChangequery.bind(this)}
                                          onShowSizeChange={this.onShowSizeChange.bind(this)}
                                          onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>}
                    <ModalForm props={this.props} name={this.state.name} query={this.query.bind(this)} checkName={this.checkName.bind(this)} queryRole={queryRole} saveFlag={this.state.saveFlag}/>
                    <ModalTwo props={this.props} checkNameTwo={this.checkNameTwo.bind(this)} gradeQueryRole={gradeQueryRole} saveFlag2={this.state.saveFlag2}/>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName} = state.cropMaintenanceReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['category_listByPage', 'category_add', 'category_update', 'category_getById','category_grade_add','category_grade_query','category_grade_update'];
    return {
        Alldate,//展示列表的数据
        slideName,
        securityKeyWord
    };
};
export default connect(mapStateprops, action)(CropMaintenance);
