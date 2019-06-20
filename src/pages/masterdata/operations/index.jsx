import { Component } from 'react';
import { Input, Button, Select, message } from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action,IOModel} from './model';
import ModalForm  from './modalForm.jsx';
import './../../index.less';
import Com from "@/component/common";
const Option = Select.Option;
class Resources extends Component {
  constructor(props) {
    super(props);
    this.state={
      operationName:'',//操作名称
      allWorkType:[],//所有类型
      farmingType: '',//农事类型
      queryFlag:false,  //筛选按钮
      chooseId:null,
      queryRole: false,
      addRole: false,
      editRole: false,
      getRole: false,
      saveFlag:true,
      closure:null
    };
  }
  async componentDidMount() {
      await this.props.getAllWorkType();
      this.props.Alldatas({startPage:1,limit:10});  //进入页面请求列表数据
      this.props.superiorName({name:'农事操作',parentLeftID:-1});
  }
  setOperationName(event) {  //查找的表单-操作名称
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
  setFarmingType(event) {  //查找的表单-农事类型
    this.setState({
      farmingType:event
    },() => {
      if(this.setState.farmingType) {
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
        workTypeId: this.state.farmingType,
        startPage:1,
        limit:10
    };
    this.props.queryAll(vm);
      this.props.page({current:1, pageSize:10});
  }
   onSizeChangequery(current,size) {  //点击筛选的分页按钮
       const vm={
          name:this.state.operationName,
           workTypeId: this.state.farmingType,
          startPage:current,
          limit:size
       };
       this.props.queryAll(vm);
       this.props.page({current:current, pageSize:size});
   }
    onShowSizeChange(current,size) {  //点击筛选的分页按钮
       const vm={
          name:this.state.operationName,
           workTypeId: this.state.farmingType,
          startPage:1,
          limit:size
       };
       this.props.queryAll(vm);
       this.props.page({current:1, pageSize:size});
   }

  addmodel() {   //增加的按钮
    this.props.modal({modalFlag:true,modeltype:'add'});
    this.props.defaultFields({
      allWorkType: {
        value: this.props.AllWorkType
      },
      name: {
        value: ''
      },
      farmingType: {
        value: ''
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
      this.props.page({current:current, pageSize:size});
  }
   checkName(name,id) {
       if(this.state.closure) {
           clearTimeout(this.state.closure);
       }
       this.setState({
           closure : setTimeout(() => {
               if(name) {
                   IOModel.CheckName({companyId:1,name:name,id:id}).then((res) => {  //添加成功时的回
                       if (res.success) {
                           if  (res.data === 0) {
                               this.setState({
                                   saveFlag:false
                               });
                               message.warning('农事操作名已存在');
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
           },800)
       });
    }
  render() {
      const {securityKeyWord} = this.props;
      const queryRole = Com.hasRole(securityKeyWord, 'operations_listByPage', 'show');
      const addRole = Com.hasRole(securityKeyWord, 'operations_add', 'insert');
      const editRole = Com.hasRole(securityKeyWord, 'operations_update', 'update');
      const getRole = Com.hasRole(securityKeyWord, 'operations_getById', 'show');
      const { queryFlag } = this.state;
      const { dataList, AllWorkType} = this.props;
      const list = [];
      list.push({id: '',name: '全部'});
      AllWorkType.forEach((item) => {
          list.push(item);
      });
    return (
        <div className='farming-box master-box'>
          <div className='farming-search'>
              <div className='farming-title'>
            <div className='title'>农事操作</div>
            <div className='search-layout search-layout-2'>
            <div className='search-row'>
               <div className='search-col'>
                  <span className='label-title'>操作名称</span>
                    <Input size="large" value={this.state.operationName} onChange={this.setOperationName.bind(this)}/>
               </div>
               <div className='search-col'>
                 <span className='label-title'>农事类型</span>
                 <Select value={this.state.farmingType} onChange={this.setFarmingType.bind(this)}
                         showSearch
                         placeholder="请选择农事类型"
                         optionFilterProp="children"
                         filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                    {list.map((item) => {
                        return <Option key={item.id} value={item.id}>{item.name}</Option>;
                    })}
                 </Select>
               </div>
            </div>
            </div></div>
        </div>
        <div className='content'>
          <div className='table-header'>
             <p><i className='iconfont icon-sort'></i><span>农事操作列表</span></p>
              {addRole && <p><Button onClick={this.addmodel.bind(this)}>新增农事操作</Button></p>}
           </div>
            {queryRole && <Tables data={dataList} onSizeChangequery={this.onSizeChangequery.bind(this)}  operationName={this.state.operationName} agriculturalType={this.state.farmingType}
                                  onShowSizeChange={this.onShowSizeChange.bind(this)} onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag} editRole={editRole} getRole={getRole}/>}
          <ModalForm props={this.props} names={this.state.operationName} agriculturalType={this.state.farmingType} query={this.query.bind(this)} checkName={this.checkName.bind(this)} queryRole={queryRole} saveFlag={this.state.saveFlag}/>
        </div>
      </div>
    );
  }
}
const mapStateprops = (state) => {
  const { Alldate,slideName,AllWorkType} = state.farmingOperationsReducer;
  const { securityKeyWord } = state.initReducer;
  //const securityKeyWord = ['operations_listByPage','operations_add','operations_update','operations_getById'];
  return {
    AllWorkType:AllWorkType,
    dataList:Alldate,//展示列表的数据
    slideName,
    securityKeyWord
  };
};
export default connect(mapStateprops,action)(Resources);
