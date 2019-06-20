import {Component} from 'react';
import {Button, LocaleProvider, Select} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import ModalForm from './modalForm.jsx';
import Formtitle from '@/component/formtitle/index.jsx';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Empdep from './empdep/index.jsx';
import Nodedep from './nodedep/index.jsx';
import EmployeeRole from './employeerole/index.jsx';
import {IO} from '@/app/io';
import '../../index.less';
import './index.less';
import Com from '@/component/common';
import Operation from '../public.js';
const Option = Select.Option;
/*const isPlatform = 'platform' === localStorage.getItem('accountType');//是否平台类用户
const isGovernment = 'government' === localStorage.getItem('accountType');//是否政府类用户
const isMarketing = 'marketing' === localStorage.getItem('accountType');//是否营销类用户
const isCompany = 'company' === localStorage.getItem('accountType');//是否农企类用户*/
class Roles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueName: '',
            queryFlag: false,
            current: 1,
            psize: 10,
            closure: null,
            empdepisshow: false,
            positionlist: [],
            Assignroles: false,
            Assignorg: false,
            Assignnode: false,
            orgid: {},
            roleid: {},
            nodeid: {},
            treedatas: [],
            orgidquery: '',
            listCompany: [],
            governmentCompany: [],
            defaultCreate: 0,
            sex:'',
            poverty:'',
            phoneNumber:'',
            phoneclosure:null
        };
    }

    componentDidMount() {
        this.props.Alldatas({
            sortField: this.props.sortfield,
            sortOrder: this.props.sortorder,
            startPage: 1,
            sex:this.state.sex,
            poor:this.state.poverty,
            mobilePhone1:this.state.phoneNumber,
            limit: this.state.psize
        });
        IO.employee.CompanyAll().then((res) => {
            let Companydata;
            const GovernmentData = [];
            if (!res.data) {
                Companydata = [];
            } else {
                Companydata = res.data;
            }
            Companydata.map((item) => {
                if (item.companyType === 3) {
                    GovernmentData.push(item);
                }
            });
            this.setState({
                listCompany: Operation.CompanyTreelist(Companydata, {
                    props: {
                        eventKey: 0
                    }
                }),
                governmentCompany: Operation.CompanyTreelist(GovernmentData, {
                    props: {
                        eventKey: 0
                    }
                })
            });
        });
    }

    formName(val) {
        this.setState({
            queryFlag: true,
            valueName: val
        }, () => {
            if (this.state.closure) {
                clearTimeout(this.state.closure);
            }
            this.setState({
                closure: setTimeout(() => {
                    this.requerFn(val,this.state.sex,this.state.poverty);
                }, 800)
            });
        });
        this.setState({
            current: 1,
            psize: this.state.psize
        });
    }
    requerFn(val,sex,poverty,phoneNumber) {
        this.props.Alldatas({
            sortField: this.props.sortfield,
            sortOrder: this.props.sortorder,
            realName: val,
            sex:sex,
            poor:poverty,
            orgId: this.state.orgidquery,
            mobilePhone1:phoneNumber,
            startPage: 1,
            limit: this.state.psize
        });
    }
    addmodel() {
        this.props.defaultFields({
            realName: {
                value: ''
            },
            gender: {
                value: 1
            },
            creatAccount: {
                value: 1
            },
            type: {
                value: ''
            },
            phoneNumber: {
                value: ''
            },
            certificateType: {
                value: 1
            },
            certificateNumber: {
                value: ''
            },
            isPoverty: {
                value: 1
            },
            companyId: {
                value: ''
            },
            companyName: {
                value: ''
            }
        });
        this.setDefaultCreate(0);
        this.props.modal({modalFlag: true, modeltype: 'add'});
        this.setState({
            valueName: '',
            value: '全部'
        });
    }

    onTableChange(pagination, filters, sorter) {
        this.setState({
            current: 1
        });
        let s;
        let o;
        let order;
        sorter.order === 'descend' ? order = 'DESC' : order = 'ASC';
        if (sorter.field) {
            if (/[A-Z]/g.test(sorter.field)) {
                s = sorter.field.replace(/[A-Z]/g, function (r) {
                    const b = r.toLowerCase();
                    return `_${b}`;
                });
            } else if (sorter.field === 'sexx') {
                s = 'sex';
            } else if (sorter.field === 'birthda') {
                s = 'birthday';
            } else if (sorter.field === 'zhuangtai') {
                s = 'stauts';
            } else if (sorter.field === 'zhuangtai') {
                s = 'stauts';
            } else {
                s = sorter.field;
            }
            o = order;
        } else {
            s = '';
            o = '';
        }
        this.props.sorter({sortfield: s, sortorder: o});
        this.props.Alldatas({
            sortField: s,
            sortOrder: o,
            roleName: this.state.valueName,
            startPage: 1,
            sex:this.state.sex,
            mobilePhone1:this.state.phoneNumber,
            poor:this.state.poverty,
            limit: this.state.psize
        });
    }

    onsizeChange(current) {
        this.setState({
            current: current
            //psize:pageSize
        });
        const {valueName} = this.state;
        this.props.Alldatas({
            sortField: this.props.sortfield,
            sortOrder: this.props.sortorder,
            roleName: valueName,
            startPage: current,
            mobilePhone1:this.state.phoneNumber,
            sex:this.state.sex,
            poor:this.state.poverty,
            limit: this.state.psize
        });
    }

    getcurrent(num) {
        this.setState({
            current: num
        });
    }

    positionList(data) {
        this.setState({
            positionlist: data
        });
    }

    Assignroles(record) {
        this.setState({
            Assignroles: true,
            roleid: record
        });
    }

    AssignrolesHide() {
        this.setState({
            Assignroles: false
        });
    }

    Assignorg(record) {
        this.setState({
            Assignorg: true,
            orgid: record
        });
    }

    AssignorgHide() {
        this.setState({
            Assignorg: false
        });
    }

    Assignnode(record) {
        this.setState({
            Assignnode: true,
            nodeid: record
        });
    }

    AssignnodeHide() {
        this.setState({
            Assignnode: false
        });
    }

    treeNodeData(treedatas) {
        this.setState({
            listCompany: [...treedatas]
        });
    }

    addCurrent(cur) {
        this.setState({
            current: cur
        });
    }

    getpsize(num, cur) {
        this.setState({
            psize: num,
            current: cur
        });
    }

    setDefaultCreate(value) {
        this.setState({
            defaultCreate: value
        });
    }
    setSex(e) {
        this.setState({
            sex:e
        });
        this.requerFn(this.state.valueName,e,this.state.poverty,this.state.phoneNumber);
    }
    setPoverty(e) {
        this.setState({
            poverty:e
        });
        this.requerFn(this.state.valueName,this.state.sex,e,this.state.phoneNumber);
    }
    setPhoneNumber(val) {
        this.setState({
            queryFlag: true,
            phoneNumber: val
        }, () => {
            if (this.state.phoneclosure) {
                clearTimeout(this.state.phoneclosure);
            }
            this.setState({
                phoneclosure: setTimeout(() => {
                    this.requerFn(this.state.valueName,this.state.sex,this.state.poverty,val);
                }, 800)
            });
        });
        this.setState({
            current: 1,
            psize: this.state.psize
        });
        // this.setState({
        //     phoneNumber:val
        // });
        //this.requerFn(this.state.valueName,this.state.sex,this.state.poverty,val);
    }
    render() {
        const me = this;
        const {queryFlag, current, psize, Assignroles, roleid, Assignorg, orgid, Assignnode, listCompany, governmentCompany, nodeid, defaultCreate} = this.state;
        const {dataList} = this.props;
        const TableOpt = {
            onsizeChange: me.onsizeChange.bind(me),
            getcurrent: me.getcurrent.bind(me),
            queryFlag: queryFlag,
            data: dataList,
            current: current,
            psize: psize,
            Nameval: me.state.valueName,
            phoneNumber:me.state.phoneNumber,
            sex:me.state.sex,
            poverty:me.state.poverty,
            Assignroles: me.Assignroles.bind(me),
            Assignorg: me.Assignorg.bind(me),
            Assignnode: me.Assignnode.bind(me),
            onTableChange: me.onTableChange.bind(me),
            getpsize: me.getpsize.bind(me),
            setDefaultCreate: me.setDefaultCreate.bind(me)
        };
        const ModelOpt = {
            cur: current,
            psize: psize,
            query: me.formName.bind(me),
            name: me.state.valueName,
            Nameval: me.state.valueName,
            phoneNumber:me.state.phoneNumber,
            sex:me.state.sex,
            poverty:me.state.poverty,
            props: me.props,
            listCompany: listCompany,
            governmentCompany: governmentCompany,
            treeNodeData: me.treeNodeData.bind(me),
            addCurrent: me.addCurrent.bind(me),
            defaultCreate: defaultCreate
        };
        const personList=[{id:'',name:'全部'},{id:1,name:'男'},{id:0,name:'女'}];
        const accountsList=[{id:'',name:'全部'},{id:1,name:'贫困'},{id:0,name:'非贫困'}];
        return (
            <div className='farming-box master-box'>
                <div className='farming-search'>
                    <div className='farming-title'>
                        <div className='title'>账号配置</div>
                            <div className='search-layout '>
                            <div className='empsearch-row'>
                                <div className='search-col'>
                                    <Formtitle Nameval={this.state.valueName} formName={this.formName.bind(this)} querykeyword='员工名称'/>
                                </div>
                                <div className='search-col'>
                                    <Formtitle Nameval={this.state.phoneNumber} formName={this.setPhoneNumber.bind(this)} querykeyword='手机号码'/>
                                </div>
                                <div className='search-col'>
                                    <span >性别</span>
                                    <Select value={this.state.sex} onChange={this.setSex.bind(this)}
                                                showSearch
                                                placeholder="性别"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                            {(personList || []).map((item) => {
                                                return <Option key={item.id} value={item.id}>{item.name}</Option>;
                                            })}
                                    </Select>
                                </div>
                                {/* <div className='search-col'>
                                    <span >所属企业</span>
                                    <TreeSelect
                                            loadData={this.formLoadData.bind(this)}
                                            dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                            onChange={this.oncompanyChange.bind(this)}
                                        >
                                            {this.renderTreeNodes(listCompany)}
                                    </TreeSelect>
                                </div> */}
                                <div className='search-col'>
                                    <span >是否贫困</span>
                                    <Select className='e' value={this.state.poverty} onChange={this.setPoverty.bind(this)}
                                            showSearch
                                            placeholder="请选择账号类型"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {(accountsList ||[]).map((item) => {
                                                        return <Option key={item.id} value={item.id}>{item.name}</Option>;
                                                    })}
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className='table-header'><p><i className='iconfont icon-sort'></i><span>员工列表</span>
                    </p>{(Com.hasRole(this.props.securityKeyWord, 'role_add', 'insert', 'employee')) ?
                        <p><Button onClick={this.addmodel.bind(this)}>新增员工</Button></p> : ''}</div>
                    <LocaleProvider locale={zhCN}>
                        <Tables {...TableOpt}/>
                    </LocaleProvider>
                    {
                        Assignroles ? <EmployeeRole emprolehide={this.AssignrolesHide.bind(this)}
                                                    idss={roleid}/> : ''
                    }
                    {

                        Assignorg || Assignroles || Assignnode ? <div className="zhezhao"></div> : ''
                    }
                    {
                        Assignorg ?
                            <Empdep empdephde={this.AssignorgHide.bind(this)} dataid={orgid}/> : ""
                    }
                    {
                        Assignnode ? <Nodedep empdephde={this.AssignnodeHide.bind(this)} dataid={nodeid}/> : ""
                    }
                    <ModalForm {...ModelOpt}/>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, sortfield, sortorder} = state.employeeReducer;
    const {securityKeyWord} = state.initReducer;
    return {
        dataList: Alldate,
        securityKeyWord,
        sortfield, sortorder
    };
};
export default connect(mapStateprops, action)(Roles);