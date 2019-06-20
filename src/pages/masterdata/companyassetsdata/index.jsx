import {Component} from 'react';
import {Input, Button, message} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import ModalForm from './modalForm.jsx';
import './../index.less';
import Com from '@/component/common';


class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: '',//年份
            data: [],
            allBase: [],
            queryFlag: false,  //筛选按钮
            chooseId: null,
            flag: true,
            queryRole: false,
            addRole: false,
            editRole: false,
            closure: null
        };
    }

    componentDidMount() {
        this.props.getAllBase();
        this.props.Alldatas({startPage: 1, limit: 10});
        this.setState({
            data: this.props.Alldate
        });
        this.props.superiorName({name: '地块', parentLeftID: -1});
    }

    setYear(event) {  //查找的表单-用户名称
        this.setState({
            year: event.target.value
        }, () => {
            if (this.setState.year) {
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
            id: {
                value: ''
            },
            baseName: {
                value: ''
            },
            allBase: {
                value: this.props.allBase
            },
            recordingTime: {
                value: new Date().getTime()
            },
            landQty: {
                value: ''
            },
            area: {
                value: ''
            },
            cropQty: {
                value: ''
            },
            modeltype: {
                value: 'add'
            }
        });
    }

    onchooseChange(current, size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
        this.props.page({current: current, pageSize: size});
    }

    async checkName(baseId, recordTime, id) {
        if(this.state.closure) {
            clearTimeout(this.state.closure);
        }
        this.setState({
            closure : setTimeout(() => {
                if (baseId && recordTime && id) {
                   IOModel.CheckName({baseId: baseId, recordingTime: recordTime, id: id}).then((res) => {  //添加成功时的回
                        if (res.success) {
                            if (res.data === 0) {
                                this.setState({
                                    flag: false
                                });
                                message.warning('已存在');
                            } else if (res.data === -1) {
                                message.error('验证失败');
                            } else {
                                this.setState({
                                    flag: true
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
        const queryRole = Com.hasRole(securityKeyWord, 'companyassetsdata_listByPage', 'show');
        const addRole = Com.hasRole(securityKeyWord, 'companyassetsdata_add', 'insert');
        const editRole = Com.hasRole(securityKeyWord, 'companyassetsdata_update', 'update');
        const {queryFlag, data} = this.state;
        const {allBase} = this.props;
        return (
            <div className='farming-box master-box'>
                <div className='farming-search'>
                    <div className='farming-title'>
                        <div className='title'>企业资产</div>
                        <div className='search-layout search-layout-1'>
                            <div className='search-row'>
                                <div className='search-col'>
                                    <span className='label-title'>年份</span>
                                    <Input size="large" value={this.state.year} onChange={this.setYear.bind(this)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className='table-header'>
                        <p><i className='iconfont icon-sort'></i><span>企业资产列表</span></p>
                        {addRole && <p><Button onClick={this.addmodel.bind(this)}>新增资产详情</Button></p>}
                    </div>
                    {queryRole && <Tables rowKey={record => record.id} data={data}
                                          onSizeChangequery={this.onSizeChangequery.bind(this)} editRole={editRole}
                                          onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag} onShowSizeChange={this.onShowSizeChange.bind(this)}/>}
                    <ModalForm year={this.state.year} props={this.props}
                               checkName={this.checkName.bind(this)} allBase={allBase} flag={this.state.flag}/>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName, allBase, allLandType} = state.companyassetsdataReducer;
    const {securityKeyWord} = state.initReducer;
    return {
        allLandType: allLandType,
        dataList: Alldate,//展示列表的数据
        slideName, allBase, securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
