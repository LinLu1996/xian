import {Component} from 'react';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import Formtitle from '@/component/formtitle/index.jsx';
import Operation from '../public.js';
import './../../index.less';
import './index.less';
import {IO} from '@/app/io';
import {Select, TreeSelect} from "antd";

const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueName: '',
            queryFlag: false,
            current: 1,
            closure: null,
            employee: '',  //员工
            company: '',//所属企业
            accountType: '', //企业类型
            listCompany: [],
            companyid: ''
        };
    }

    componentDidMount() {
        this.props.Alldatas({
            startPage: 1,
            limit: 10,
            sortField: this.props.sortfield,
            sortOrder: this.props.sortorder
        });
        this.props.employeeListAll();
        IO.account.CompanyAll().then((res) => {
            let Companydata;
            if (!res.data) {
                Companydata = [];
            } else {
                Companydata = res.data;
            }
            this.setState({
                listCompany: Operation.CompanyTreelist(Companydata, {
                    props: {
                        eventKey: 0
                    }
                })
            });
        });
        //this.props.accountTypeList();
    }

    oncompanyChange(value, label, extra) {
        this.setState({
            company: extra.triggerNode.props.dataRef.id
        }, () => {
            if (this.setState.company) {
                this.setState({
                    queryFlag: true
                });
            } else {
                this.setState({
                    queryFlag: false
                });
            }
            if (this.state.closure) {
                clearTimeout(this.state.closure);
            }
            this.setState({
                closure: setTimeout(() => {
                    this.query();
                }, 800)
            });
        });
    }

    setEmployee(event) {
        this.setState({
            employee: event
        }, () => {
            if (this.setState.employee) {
                this.setState({
                    queryFlag: true
                });
            } else {
                this.setState({
                    queryFlag: false
                });
            }
            if (this.state.closure) {
                clearTimeout(this.state.closure);
            }
            this.setState({
                closure: setTimeout(() => {
                    this.query();
                }, 800)
            });
        });
    }

    setAccountType(event) {
        this.setState({
            accountType: event
        }, () => {
            if (this.setState.accountType) {
                this.setState({
                    queryFlag: true
                });
            } else {
                this.setState({
                    queryFlag: false
                });
            }
            if (this.state.closure) {
                clearTimeout(this.state.closure);
            }
            this.setState({
                closure: setTimeout(() => {
                    this.query();
                }, 800)
            });
        });
    }

    setcurrent(val) {
        this.setState({current: val});
    }

    formName(val) {
        this.setState({
            valueName: val,
            current: 1
        }, () => {
            if (this.setState.valueName) {
                this.setState({
                    queryFlag: true
                });
            } else {
                this.setState({
                    queryFlag: false
                });
            }
            if (this.state.closure) {
                clearTimeout(this.state.closure);
            }
            this.setState({
                closure: setTimeout(() => {
                    this.props.queryAll({
                        accountName: this.state.valueName,
                        companyId: this.state.company,
                        accountType: this.state.accountType,
                        empRealName: this.state.employee,
                        startPage: 1,
                        limit: 10
                    });
                }, 800)
            });
        });
    }

    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            companyId: this.state.company,
            userId: this.state.userId,
            name: this.state.name,
            accountType: this.state.accountType,
            empRealName: this.state.employee,
            startPage: 1,
            limit: 10
        };
        this.props.queryAll(vm);
        this.props.page({current: 1, pageSize: 10});
    }

    onsizeChange(type, current, pageSize) {
        this.setState({
            current: current
        });
        const {valueName} = this.state;
        if (type === 'query') {
            this.props.queryAll({
                accountName: valueName,
                companyId: this.state.company,
                accountType: this.state.accountType,
                empRealName: this.state.employee,
                startPage: current,
                limit: pageSize,
                sortField: this.props.sortfield,
                sortOrder: this.props.sortorder
            });
        } else {
            this.props.Alldatas({
                startPage: current,
                limit: pageSize,
                sortField: this.props.sortfield,
                accountName: this.state.valueName,
                companyId: this.state.company,
                accountType: this.state.accountType,
                empRealName: this.state.employee,
                sortOrder: this.props.sortorder
            });
        }
    }

    renderTreeNodes(data) {
        return data.map((item) => {
            if (item.children) {
                return (
                        <TreeNode title={item.title} value={item.title} key={item.key} dataRef={item}>
                            {this.renderTreeNodes(item.children)}
                        </TreeNode>
                );
            }
            return <TreeNode {...item} value={item.title} dataRef={item}/>;
        });
    }

//   oncompanyChange(value, label, extra) {
//     this.setState({companyid:extra.triggerNode.props.dataRef.id});
// }
    formLoadData(treeNode) {  //点击展开时的调用
        const listCompany = this.state.listCompany;
        return new Promise((resolve) => {
            IO.employee.CompanyChild({id: treeNode.props.dataRef.id}).then((res) => {
                const Treedata = Operation.CompanyTreelist(res.data, treeNode);
                treeNode.props.dataRef.children = Treedata;
                this.setState({
                    listCompany: [...listCompany]
                });
            });
            resolve();
        });
    }

    render() {
        const {queryFlag, current, listCompany} = this.state;
        const {dataList, functionaryList, companyList, accountList} = this.props;
        const personList = [];
        const companysList = [];
        const accountsList = [];
        if (functionaryList && functionaryList.length > 0) {
            personList.push({id: '', name: '全部'});
            functionaryList.forEach((item) => {
                personList.push(item);
            });
        }
        if (companyList && companyList.length > 0) {
            companysList.push({id: '', name: '全部'});
            companyList.forEach((item) => {
                companysList.push(item);
            });
        }
        if (accountList && accountList.length > 0) {
            accountsList.push({id: '', name: '全部'});
            accountList.forEach((item) => {
                accountsList.push(item);
            });
        }
        return (
                <div className='farming-box master-box'>
                    <div className='farming-search'>
                        <div className='farming-title'>
                            <div className='title'>账号配置</div>
                            <div className='search-layout '>
                                <div className='search-row'>
                                    <div className='search-col'>
                                        <span>员工姓名</span>
                                        <Select value={this.state.employee} onChange={this.setEmployee.bind(this)}
                                                showSearch
                                                placeholder="请选择员工名"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                            {(personList || []).map((item) => {
                                                return <Option key={item.id} value={item.name}>{item.name}</Option>;
                                            })}
                                        </Select>
                                    </div>
                                    <div className='search-col'>
                                        <span>所属企业</span>
                                        <TreeSelect
                                                loadData={this.formLoadData.bind(this)}
                                                dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                                onChange={this.oncompanyChange.bind(this)}
                                        >
                                            {this.renderTreeNodes(listCompany)}
                                        </TreeSelect>
                                    </div>
                                    <div className='search-col'>
                                        <span>账号类型</span>
                                        <Select className='e' value={this.state.accountType}
                                                onChange={this.setAccountType.bind(this)}
                                                showSearch
                                                placeholder="请选择账号类型"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                            {(accountsList || []).map((item) => {
                                                return <Option key={item.id} value={item.id}>{item.name}</Option>;
                                            })}
                                        </Select>
                                    </div>
                                    <div className='search-col'>
                                        <Formtitle Nameval={this.state.valueName} formName={this.formName.bind(this)}
                                                   querykeyword='账户名称'/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='content'>
                        <div className='table-header'>
                            <p><i className='iconfont icon-sort'></i><span>账号列表</span></p>
                        </div>
                        <Tables current={current} setcurrent={this.setcurrent.bind(this)}
                                valueName={this.state.valueName} company={this.state.company}
                                accountType={this.state.accountType} employee={this.state.employee} data={dataList}
                                current={current} onsizeChange={this.onsizeChange.bind(this)} queryFlag={queryFlag}/>
                    </div>
                </div>
        );
    }
}

const mapStateprops = (state) => {
    const {sortfield, sortorder} = state.accountReducer;
    const {Alldate} = state.accountReducer;
    const {functionaryList, companyList, accountList} = state.accountReducer;
    return {
        dataList: Alldate,
        sortfield, sortorder,
        functionaryList,
        companyList,
        accountList
    };
};
export default connect(mapStateprops, action)(Resources);