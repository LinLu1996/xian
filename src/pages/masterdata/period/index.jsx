import {Component} from 'react';
import {Input, Button} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import ModalForm from './modalForm.jsx';
import './../../index.less';
import Com from "@/component/common";
import Public from "@/pages/masterdata/public";

class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = { //查询条件
            name: '',//周期名称
            queryFlag: false,  //筛选按钮
            chooseId: null,
            addRole: false,
            queryRole: false,
            editRole: false,
            stautsRole: false,
            saveFlag:true,
          closure:null
        };
    }

    componentDidMount() {
        this.props.Alldatas({startPage: 1, limit: 10}); //进入页面请求列表数据(第1页，每页10条)
        this.props.superiorName({name: '生长周期', parentLeftID: -1});
    }

    setName(event) {  //查询条件-生长周期名称
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
            name: this.state.name,
            startPage: 1,
            limit: 10
        };
        this.props.queryAll(vm);
        this.props.page({current:1, pageSize:10});
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        const vm = {
            name: this.state.name,
            startPage: current,
            limit: size
        };
        this.props.queryAll(vm);
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        const vm = {
            name: this.state.name,
            startPage: 1,
            limit: size
        };
        this.props.queryAll(vm);
    }

    addmodel() {   //增加的按钮
        this.props.modal({modalFlag: true, modeltype: 'add'});
        this.props.defaultFields({
            name: {
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
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'period_listByPage', 'show');
        const addRole = Com.hasRole(securityKeyWord, 'period_add', 'insert');
        const editRole = Com.hasRole(securityKeyWord, 'period_update', 'update');
        const stautsRole = Com.hasRole(securityKeyWord, 'period_stauts', 'update');
        const {dataList} = this.props;
        return (
            <div className='farming-box master-box'>
                <div className='farming-search'>
                    <div className='farming-title'>
                  <div className='title'>生长周期</div>
                  <div className='search-layout search-layout-1'>
                    <div className='search-row'>
                    <div className='search-col'>
                    <span className='label-title'>周期名称</span>
                    <Input size="large" value={this.state.name} onChange={this.setName.bind(this)}/>
                    </div>
                    </div>
                    </div></div>
                    </div>
                <div className='content'>
                    <div className='table-header'>
                        <p><i className='iconfont icon-sort'></i><span>生长周期列表</span></p>
                        {addRole && <p><Button onClick={this.addmodel.bind(this)}>新增周期</Button></p>}
                    </div>
                    {queryRole && <Tables data={dataList} onSizeChangequery={this.onSizeChangequery.bind(this)} name={this.state.name}
                                          onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}
                                          onShowSizeChange={this.onShowSizeChange.bind(this)}
                                          editRole={editRole}   stautsRole={stautsRole}/>}
                    < ModalForm props={this.props} name={this.state.name} query={this.query.bind(this)} checkName={this.checkName.bind(this)}  queryRole={queryRole} saveFlag={this.state.saveFlag}/>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName} = state.growthReducer;
    const { securityKeyWord } = state.initReducer;
   // const securityKeyWord = ['period_listByPage', 'period_add', 'period_update', 'period_stauts'];
    return {
        dataList: Alldate,//展示列表的数据
        slideName,
        securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
