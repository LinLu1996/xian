import { Component } from 'react';
import { Input, Button, Select } from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import {OperationIOModel} from '../operations/model';
import {IOModelOut} from '../crop/model';
import ModalForm  from './modalForm.jsx';
import '../../index.less';
import './index.less';
import Com from "@/component/common";
import Public from "@/pages/masterdata/public";
const Option = Select.Option;
class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operationName: '',//操作名称
            allDosageUnit: [],//所有类型
            allWorkType: [],//所有类型
            agriculturalType: '',//农事类型
            queryFlag: false,  //筛选按钮
            chooseId: null,
            queryRole: false,
            addRole: false,
            editRole: false,
            getRole: false,
            saveFlag: true,
          closure:null
        };
    }

    async componentDidMount() {
        this.props.Alldatas({startPage: 1, limit: 10});  //进入页面请求列表数据
        OperationIOModel.GetWorkType().then((res) => {
            const allWorkType = res.data || [];
            allWorkType.forEach((item,index) => {
                if(item.name==='采收') {
                    allWorkType.splice(index,1);
                }
            });
            this.setState({
                allWorkType: allWorkType
            });
        }).catch();
        IOModelOut.allDosageUnit().then((res) => {
            this.setState({
                allDosageUnit: res.data
            });
        }).catch();
        this.props.superiorName({name: '农资', parentLeftID: -1});
    }

  setOperationName(event) {  //查找的表单-基地名称
    this.setState({
      operationName:event.target.value
    },() => {
      if(this.setState.operationName) {
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
  setAgriculturalType(event) {  //查找的表单-基地名称
    this.setState({
      agriculturalType:event
    },() => {
      if(this.setState.agriculturalType) {
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
      queryFlag:true //控制分页的展示
    });
    const vm={
        name:this.state.operationName,
        workTypeId:this.state.agriculturalType,
        startPage:1,
        limit:10
    };
    this.props.queryAll(vm);
    this.props.page({current: 1, pageSize: 10});
  }
   onSizeChangequery(current,size) {  //点击筛选的分页按钮
       this.setState({
           queryFlag:true //控制分页的展示
       });
       const vm={
           name:this.state.operationName,
           workTypeId:this.state.agriculturalType,
           startPage:current,
           limit:size
       };
       this.props.queryAll(vm);
   }
    onShowSizeChange(current,size) {  //点击筛选的分页按钮
       this.setState({
           queryFlag:true //控制分页的展示
       });
       const vm={
           name:this.state.operationName,
           workTypeId:this.state.agriculturalType,
           startPage:1,
           limit:size
       };
       this.props.queryAll(vm);
   }

  addmodel() {   //增加的按钮
    this.props.modal({modalFlag:true,modeltype:'add'});
    this.props.defaultFields({
        allDosageUnit: {
        value: this.state.allDosageUnit
      },
      AllWorkType: {
        value: this.state.allWorkType
      },
      operationName: {
        value: ''
      },
      id: {
         value: ''
      },
      name: {
        value: ''
      },
      workTypeName: {
        value:''
      },
      containment: {
        value:''
      },
      purpose: {
        value:''
      },
      dosageUnit: {
        value:''
      },
      stauts: {
        value:''
      },
      createName: {
        value:''
      },
      modeltype:{
         value:'add'
       }
    });
}

  fnondrag(num) {   //点击左侧边的id
    this.setState({
      chooseId:num
    });
  }
  onchooseChange(current,size) {  //点击侧边的分页按钮
    const {chooseId} = this.state;
    this.props.chooseAll({id:chooseId,startPage:current,limit:size});
  }
  checkName(name,id,type) {
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
      const {securityKeyWord} = this.props;
      const queryRole = Com.hasRole(securityKeyWord, 'material_listByPage', 'show');
      const addRole = Com.hasRole(securityKeyWord, 'material_add', 'insert');
      const editRole = Com.hasRole(securityKeyWord, 'material_update', 'update');
      const getRole = Com.hasRole(securityKeyWord, 'material_getById', 'show');
      const { dataList} = this.props;
      const { queryFlag, allWorkType} = this.state;
      const list = [];
      list.push({id: '',name: '全部'});
      allWorkType.forEach((item) => {
          list.push(item);
      });
    return (
      <div className='farming-box master-box'>
          <div className='farming-search'>
              <div className='farming-title'>
                  <div className='title'>农资维护</div>
            <div className='search-layout search-layout-2'>
            <div className='search-row'>
               <div className='search-col'>
                  <span className='label-title'>农资名称</span>
                    <Input  size="large" value={this.state.operationName} onChange={this.setOperationName.bind(this)}/>
               </div>
               <div className='search-col'>
                 <span className='label-title'>农资类型</span>
                 <Select value={this.state.agriculturalType} onChange={this.setAgriculturalType.bind(this)}
                         showSearch
                         placeholder="请选择农资类型"
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
             <p><i className='iconfont icon-sort'></i><span>农资维护列表</span></p>
              {addRole && <p><Button onClick={this.addmodel.bind(this)}>新增农资</Button></p>}
           </div>
            {queryRole && <Tables data={dataList} operationName={this.state.operationName} agriculturalType={this.state.agriculturalType} onSizeChangequery={this.onSizeChangequery.bind(this)}
                                  onShowSizeChange={this.onShowSizeChange.bind(this)}
             onchooseChange={this.onchooseChange.bind(this)} name={this.state.name} queryFlag={queryFlag} AllWorkType={this.state.allWorkType}
                                  allDosageUnit={this.state.allDosageUnit} editRole={editRole} getRole={getRole}/>}
          <ModalForm operationNames={this.state.operationName} agriculturalTypes={this.state.agriculturalType}props={this.props} checkName={this.checkName.bind(this)} queryRole={queryRole} saveFlag={this.state.saveFlag}/>
        </div>
      </div>
    );
  }
}
const mapStateprops = (state) => {
  const { Alldate,slideName} = state.agriculturalMaintenanceReducer;
   const { securityKeyWord } = state.initReducer;
   // const securityKeyWord = ['material_listByPage','material_add','material_update','material_getById'];
    return {
        dataList:Alldate,//展示列表的数据
        slideName,
        securityKeyWord
  };
};
export default connect(mapStateprops,action)(Resources);
