import {Component} from 'react';
import {Input, Button, message} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action,IOModel} from './model';
import ModalTable from './modalForm.jsx';
import ModalAdd from './modalAdd.jsx';
//import {govermentaiddata} from './govermentaiddata';
import './../index.less';
import Com from '@/component/common';


class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: '',//年份
            data:[],
            queryFlag: false,  //筛选按钮
            chooseId: null,
            saveFlag: true,
            queryRole: false,
            addRole: false,
            editRole: false,
            closure:null
        };
    }

    componentDidMount() {
        this.props.Alldatas({startPage: 1, limit: 10});  //进入页面请求列表数据
        this.props.superiorName({name: '政府扶贫投入', parentLeftID: -1});
    }

    setYear(event) {  //查找的表单-用户名称
        this.setState({
            year: event.target.value
        },() => {
          if(this.setState.year) {
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
          year: this.state.year,
          startPage: 1,
          limit: 10
        };
        this.props.queryAll(vm);
        this.props.page({current: 1, pageSize: 10});
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        const vm = {
          year: this.state.year,
            startPage: current,
            limit: size
        };
        this.props.queryAll(vm);
        this.props.page({current: current, pageSize: size});
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        const vm = {
          year: this.state.year,
            startPage: 1,
            limit: size
        };
        this.props.queryAll(vm);
        this.props.page({current: 1, pageSize: size});
    }

    addmodel() {   //增加的按钮
        this.props.modal({modalFlag: true, modeltype: 'add'});
        this.props.defaultFields({
            year: {
                value: ''
            },
            modeltype: {
                value: 'add'
            }
        });
    }

    checkName(year) {
        if(this.state.closure) {
            clearTimeout(this.state.closure);
        }
        this.setState({
            closure : setTimeout(() => {
                if(year) {
                    IOModel.CheckName({companyId: 1, year: year}).then((res) => {  //添加成功时的回
                        if (res.success) {
                            if (res.data === 0) {
                                this.setState({
                                    saveFlag: false
                                });
                                message.warning('该年份已存在');
                            } else if (res.data === -1) {
                                message.error('验证失败');
                            } else if(res.data > 0) {
                                this.setState({
                                    saveFlag: true
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
    onchooseChange(current, size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
        this.props.page({current: current, pageSize: size});
    }

    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'govermentaiddata_listByPage', 'show');
        const addRole = Com.hasRole(securityKeyWord, 'govermentaiddata_add', 'insert');
        const editRole = Com.hasRole(securityKeyWord, 'govermentaiddata_update', 'update');
        const {queryFlag} = this.state;
        const {dataList} = this.props;
        return (
            <div className='farming-box master-box'>
                <div className='farming-search'>
                <div className='farming-title'>
                  <div className='title'>扶贫投入</div>
                  <div className='search-layout search-layout-1'>
                        <div className='search-row'>
                            <div className='search-col'>
                                <span className='label-title'>年份</span>
                                <Input size="large" value={this.state.year} onChange={this.setYear.bind(this)}/>
                            </div>
                        </div>
                  </div></div>
                </div>
                <div className='content'>
                    <div className='table-header'>
                        <p><i className='iconfont icon-sort'></i><span>扶贫投入列表</span></p>
                        {addRole && <p><Button onClick={this.addmodel.bind(this)}>新增扶贫年份</Button></p>}
                    </div>
                    {queryRole && <Tables data={dataList} onSizeChangequery={this.onSizeChangequery.bind(this)} editRole={editRole}  year={this.state.year}
                                          onShowSizeChange={this.onShowSizeChange.bind(this)}
                                          onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>}
                    <ModalTable year={this.state.year}  props={this.props}/>
                    <ModalAdd props={this.props} year={this.state.year} checkName={this.checkName.bind(this)} saveFlag={this.state.saveFlag}/>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName, allBase, allLandType} = state.govermentaiddataReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['govermentaiddata_listByPage','govermentaiddata_add','govermentaiddata_update'];
    return {
        allBase: allBase,
        allLandType: allLandType,
        dataList: Alldate,//展示列表的数据
        slideName,securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
