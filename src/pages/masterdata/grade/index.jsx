import {Component} from 'react';
import {Input, Button, message} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import ModalForm from './modalForm.jsx';
import GradeModalForm from './gradeModalForm.jsx';
import './../../index.less';
import Com from "@/component/common";
import Public from "@/pages/masterdata/public";

class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gradeName: '',//等级组名称
            queryFlag: false,  //筛选按钮
            chooseId: null,
            queryRole: false,
            addRole: false,
            editRole: false,
            gradeAddRole: false,
            gradeQueryRole: false,
            gradeEditRole:false,
            saveFlag: true,
            saveGradeFlag: true,
            closure:null
        };
    }

    componentDidMount() {
        this.props.Alldatas({startPage: 1, limit: 10, companyId: 1}); //进入页面请求列表数据
        this.props.superiorName({name: '作物等级', parentLeftID: -1});
        this.props.page({current: 1, pageSize: 10});
    }

    setGradeName(event) {  //查找的表单-用户名称
        this.setState({
            gradeName: event.target.value
        },() => {
          if(this.setState.gradeName) {
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
            name: this.state.gradeName,
            startPage: 1,
            limit: 10,
            companyId: 1
        };
        this.props.queryAll(vm);
        this.props.page({current: 1, pageSize: 10});
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        this.setState({
            queryFlag: true
        });
        const vm = {
            name: this.state.gradeName,
            startPage: current,
            limit: size,
            companyId: 1
        };
        this.props.queryAll(vm);
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        this.setState({
            queryFlag: true
        });
        const vm = {
            name: this.state.gradeName,
            startPage: 1,
            limit: size,
            companyId: 1
        };
        this.props.queryAll(vm);
    }

    addmodel() {   //增加的按钮
        this.props.modal({modalFlag: true, modeltype: 'add'});
        this.props.defaultFields({
            gradeName: {
                value: ''
            },
            functionary: {
                value: ''
            },
            createName: {
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

    checkGrade(name, id, gradeGroupId) {
        if(this.state.closure) {
            clearTimeout(this.state.closure);
        }
        this.setState({
            closure : setTimeout(() => {
                if(name) {
                    IOModel.CheckGrade({companyId: 1, name: name, id: id, gradeGroupId}).then((res) => {  //添加成功时的回
                        if (res.success) {
                            if (res.data === 0) {
                                this.setState({
                                    saveGradeFlag: false
                                });
                                message.warning('等级名已存在');
                            } else if (res.data === -1) {
                                message.error('验证失败');
                            } else if(res.data > 0) {
                                this.setState({
                                    saveGradeFlag: true
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

    checkName(name, id,type) {
        if(this.state.closure) {
            clearTimeout(this.state.closure);
        }
        this.setState({
            closure : setTimeout(() => {
                const saveFlag = Public.checkName(name,id,type);
                saveFlag.then((resolve) => {
                    this.setState({
                        saveFlag:resolve
                    });
                });
            },800)
        });
    }

    render() {
        const {queryFlag} = this.state;
        const {dataList} = this.props;
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'grade_listByPage', 'show');
        const addRole = Com.hasRole(securityKeyWord, 'grade_add', 'insert');
        const editRole = Com.hasRole(securityKeyWord, 'grade_update', 'update');
        const gradeAddRole = Com.hasRole(securityKeyWord, 'grade_grade_add', 'insert');
        const gradeQueryRole = Com.hasRole(securityKeyWord, 'grade_grade_query', 'show');
        const gradeEditRole = Com.hasRole(securityKeyWord, 'grade_grade_update', 'update');
        return (
            <div className='farming-box master-box'>
                <div className='farming-search'>
                    <div className='farming-title'>
                  <div className='title'>作物等级</div>
                  <div className='search-layout search-layout-1'>
                        <div className='search-row'>
                            <div className='search-col'>
                                <span className='label-title'>等级组名称</span>
                                <Input size="large" value={this.state.gradeName}
                                       onChange={this.setGradeName.bind(this)}/>
                            </div>
                        </div>
                    </div> </div>
                </div>
                <div className='content gradeContent'>
                    <div className='table-header'>
                        <p><i className='iconfont icon-sort'></i><span>作物等级列表</span></p>
                        {addRole && <p><Button onClick={this.addmodel.bind(this)}>新增等级组</Button></p>}
                    </div>
                    {queryRole && <Tables name={this.state.gradeName} data={dataList} onSizeChangequery={this.onSizeChangequery.bind(this)}
                                          onShowSizeChange={this.onShowSizeChange.bind(this)}
                            onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag} editRole={editRole} gradeEditRole={gradeEditRole} gradeAddRole={gradeAddRole}  gradeQueryRole={gradeQueryRole}/>}
                    <ModalForm gradeNames={this.state.gradeName} props={this.props} checkName={this.checkName.bind(this)} queryRole={queryRole} saveFlag={this.state.saveFlag}/>
                    <GradeModalForm props={this.props} checkName={this.checkGrade.bind(this)} gradeQueryRole={gradeQueryRole} saveGradeFlag={this.state.saveGradeFlag}/>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['grade_listByPage','grade_grade_update', 'grade_grade_query', 'grade_add', 'grade_grade_add', 'grade_update'];
    const {Alldate, slideName} = state.cropGradeReducer;
    return {
        dataList: Alldate,//展示列表的数据
        slideName,
        securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
