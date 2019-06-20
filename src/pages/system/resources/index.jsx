import {Component} from 'react';
import { Button, message,Modal} from 'antd';
import Operation from '../public.js';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action, IO} from './model';
import ModalForm from './modalForm.jsx';
import Formtitle from '@/component/formtitle/index.jsx';
import RightSide from '@/component/rightSides/index.jsx';
import Zoomable from 'react-stretchable';
import '../../index.less';
import './index.less';
import Com from '@/component/common';
const confirm = Modal.confirm;
class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueName: '',//筛选的条件
            chooseId: null,
            tree:[],
            ModelParentName:'资源',
            value: '全部',
            current: 1,
            psize: 10,
            queryFlag: false,
            chooseFlag: false,
            closure: null,
            Treeflag: true,
            queryF:false,
            changedata:{},
            TreeParent:[]
        };
    }
    componentDidMount() {
        const Treeparentdata = [];
        this.props.TreeData({tree: []});
        this.props.Alldatas({
            sortField: this.props.sortfield,
            sortOrder: this.props.sortorder,
            startPage: 1,
            limit: this.state.psize
        });  //进入页面请求列表数据
        this.props.slide({num: -1,slideName: '资源'});
        IO.resources.TreeData().then((res) => {  //请求侧边树的数据
            let treedata;
            if (!res.data) {
                treedata = [];
            } else {
                treedata = res.data;
                this.setState({
                    TreeParent:this.treedata(this.TreeParent(res.data,Treeparentdata))
                });
                this.props.TreeData({tree: treedata});
            }
        });
    }
    treedata(data) {
        return data.map(item => {
          if (item.childrens) {
            item.childrens = this.treedata(item.childrens);
          }
          return Object.assign({},item,{
            title : item.resName,
            key : item.id
          });
        });
      }
    TreeParent(data,Treeparentdata) {
        data.map((item) => {
            let isleaf;
            item.leaf===0?isleaf=false:isleaf=true;
            const d = Object.assign({},item,{
                childrens:[],
                isLeaf:isleaf
            });
            Treeparentdata.push(d);
        });
        return Treeparentdata;
    }
    formName(val) {  //查找的表单
        this.setState({
            valueName: val,
            current: 1
        }, () => {
            if (this.state.valueName) {
                if (this.state.queryF) {
                    this.setState({
                        chooseFlag: true,
                        queryFlag: false
                    });
                } else {
                    this.setState({
                        queryFlag: true,
                        chooseFlag: false
                    });
                }
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
                    if (!this.state.queryF) {
                        this.props.Alldatas({
                            sortField: this.props.sortfield,
                            sortOrder: this.props.sortorder,
                            resName: this.state.valueName,
                            startPage: 1,
                            limit: this.state.psize
                        });
                    } else {
                        this.props.chooseAll({
                            sortField: this.props.sortfield,
                            sortOrder: this.props.sortorder,
                            resName: this.state.valueName,
                            startPage: 1,
                            limit: this.state.psize,
                            id: this.state.chooseId
                        });
                    }
                }, 800)
            });
        });
    }
    formChange(node,selected) {  //点击每一条数据的方法
        this.setState({
            value: node.props.resName,
            valueName:'',
            current: 1,
            queryF:selected,
            changedata:node.props
        }, () => {
            const num = node.props.id;
            if (!selected) {
                this.props.Alldatas({
                    sortField: this.props.sortfield,
                    sortOrder: this.props.sortorder,
                    startPage: 1,
                    limit: this.state.psize,
                    resName: this.state.valueName
                });
                this.setState({
                    chooseFlag: false,
                    queryFlag: true,
                    chooseId: null,
                    current: 1,
                    Treeflag: true
                });
            } else {
                this.props.chooseAll({
                    sortField: this.props.sortfield,
                    sortOrder: this.props.sortorder,
                    id: num,
                    resName: this.state.valueName,
                    limit: this.state.psize,
                    startPage: 1
                });
                this.setState({
                    chooseId: num,
                    chooseFlag: true,
                    queryFlag: false,
                    Treeflag: false
                });
            }
            this.props.slide({num: num, slideName: !selected ? '资源' : node.props.resName});
            if (!selected) {
                this.setState({ModelParentName: '资源'});
                this.props.slide({num: -1, slideName: '资源'});
            } else {
                this.setState({ModelParentName: node.props.resName});
            }
        });
    }
    editor(record, e) {
        e.stopPropagation();
        const querydata = {
            word: {
                value: record.keyword
            },
            name: {
                value: record.resName
            },
            url: {
                value: record.resUrl
            },
            pageurl: {
                value: record.pageUrl
            },
            sort: {
                value: `${record.sortNum}`
            },
            model: {
                value: record.resType
            },
            sortnum: {
                value: record.sortNum
            },
            icon: {
                value: record.icon
            }
        };
        this.props.rightqueryItem(record);
        this.props.defaultFields(querydata);
        this.props.querydefaultfields(querydata);
        this.props.querylist({parentID: record.parentId, modifyid: record.id, modifycode: record.resourceCode});
        record.parentId === -1 ? this.setState({ModelParentName: '资源'}) : this.setState({ModelParentName: record.parentName});
        this.props.modal({modalFlag: true, modeltype: 'modify'});
    }
    deleteR(record,e) {
        let tit;
        e.stopPropagation();
        if ((record.leaf===0 && record.childrens && record.isLeaf===false) || (record.childrens && record.childrens.length>0)) {
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
            onOk() {
                _this.confirm(record);
            }
        });
    }
    confirm(record) {
        const {Alldatas, chooseAll} = this.props;
        const deleteID = record.id;
        this.props.RightsearchFlag({flag:true});
        Operation.systemDelete(Operation.listurl(this.props.list, 'resource_delete'));
        IO.system_Delete.deleteData({':id': deleteID}).then((res) => {
            if (res.success) {
                const deletedata = Operation.deletetree(this.props.TreeD, record);
                this.props.TreeData({tree: [...deletedata]});
                let lencurrent;
                if (this.props.dataList.length === 1) {
                    lencurrent = this.state.current - 1;
                    this.setState({
                        current:this.state.current - 1
                    });
                } else {
                    lencurrent = this.state.current;
                }
                if (!this.state.queryF) {
                    Alldatas({
                        sortField: this.props.sortfield,
                        sortOrder: this.props.sortorder,
                        resName: this.props.Nameval,
                        startPage: lencurrent,
                        limit: this.state.psize
                    });
                } else {
                    chooseAll({
                        sortField: this.props.sortfield,
                        sortOrder: this.props.sortorder,
                        resName: this.props.Nameval,
                        id: this.props.slideID,
                        startPage: lencurrent,
                        limit: this.state.psize
                    });
                }
                message.success('删除成功');
            }
        }).catch(() => {
            this.setState({
                loadflag: false
            });
        });
    }
    addmodel(record,e) {   //增加的按钮
        if(e) {
            if(this.state.queryF) {
                if(this.state.changedata.resName===record.resName) {
                    e.stopPropagation();
                }
            }
        }
        if(!e && !this.state.queryF) {
            this.setState({ModelParentName: '资源'});
            this.props.slide({num: -1, slideName: '资源'});
        }else if(this.state.queryF && !e) {
            this.props.slide({num: this.state.changedata.id, slideName: this.state.changedata.resName});
            this.setState({ModelParentName: this.state.changedata.resName});
        }else if(e) {
            this.props.slide({num: record.id, slideName: record.resName});
            this.setState({ModelParentName: record.resName});
        }
        this.props.modal({modalFlag: true, modeltype: 'add'});
        this.props.defaultFields({
            word: {
                value: ''
            },
            name: {
                value: ''
            },
            url: {
                value: ''
            },
            model: {
                value: 'menu'
            },
            icon: {
                value: ''
            },
            pageurl: {
                value: ''
            },
            sortnum: {
                value: ''
            }
        });
    }

    onsizeChange(type, current, size) {  //点击筛选的分页按钮
        const {valueName, chooseId} = this.state;
        this.setState({
            current: current,
            psize: size
        });
        if (type === 'choose') {
            this.props.chooseAll({
                sortField: this.props.sortfield,
                sortOrder: this.props.sortorder,
                resName: valueName,
                id: chooseId,
                startPage: current,
                limit: this.state.psize
            });
        } else {
            this.props.Alldatas({
                sortField: this.props.sortfield,
                sortOrder: this.props.sortorder,
                resName: valueName,
                startPage: current,
                limit: this.state.psize
            });
        }
    }

    onTableChange(pagination, filters, sorter) {
        this.setState({
            current: 1
        });
        const {Alldatas, chooseAll} = this.props;
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
            } else {
                s = sorter.field;
            }
            o = order;
        } else {
            s = '';
            o = '';
        }
        this.props.sorter({sortfield: s, sortorder: o});
        if (this.state.Treeflag) {
            Alldatas({
                sortField: s,
                sortOrder: o,
                resName: this.state.valueName,
                startPage: 1,
                limit: this.state.psize
            });
        } else {
            chooseAll({
                sortField: s,
                sortOrder: o,
                resName: this.state.valueName,
                id: this.props.slideID,
                startPage: 1,
                limit: this.state.psize
            });
        }
    }
    getNameval() {
        this.setState({
            valueName:'',
            current:1
        });
    }
    getpsize(num,cur) {
        this.setState({
            psize:num,
            current:cur
        });
    }
    render() {
        const me = this;
        const {queryFlag, value, current, psize, chooseFlag, valueName, Treeflag, TreeParent} = this.state;
        const {dataList, TreeD, securityKeyWord, searchflag} = this.props;
        const RightSideOpt = {
            TreeDatalist:TreeD,
            add:me.addmodel.bind(me),
            editor:me.editor.bind(me),
            deleteR:me.deleteR.bind(me),
            keyword:'resource',
            securityKeyWord:securityKeyWord,
            formChange:me.formChange.bind(me),
            ref:self => {me.rightSides = self;},
            TreeParent:TreeParent,
            searchflag:searchflag
        };
        const TableOpt = {
            data:dataList,
            showDeleteConfirm:me.deleteR.bind(me),
            query:me.editor.bind(me),
            onTableChange:me.onTableChange.bind(me),
            keydata:me.props.securityKeyWord,
            Treeflag:Treeflag,
            Nameval:me.state.valueName,
            current: current,
            queryFlag:queryFlag,
            chooseFlag:chooseFlag,
            onsizeChange:me.onsizeChange.bind(me),
            getpsize:me.getpsize.bind(me)
        };
        const modelFormOpt = {
            cur:current,
            psize:psize,
            Treeflag:Treeflag,
            Nameval:valueName,
            props:me.props,
            val:me.state.value,
            ModelParentName:me.state.ModelParentName,
            getNameval:me.getNameval.bind(me)
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
            <div className='resources-box system-box'>
                <div className='wrap' ref='wrap'>
                  <Zoomable {...zoomableOpt}>
                    <RightSide {...RightSideOpt}/>
                  </Zoomable>
                </div>
                <div className='resources-rightbox'>
                <div className='title'>
                    <b>资源配置</b>
                    <Formtitle value={value} Nameval={valueName} keyword='资源配置' querykeyword='资源名称'
                               formChange={this.formChange.bind(this)}
                               formName={this.formName.bind(this)}/>
                </div>
                <div className='content'>
                    <div className='table-header'><p><i
                        className='iconfont icon-sort'></i><span>资源列表</span>
                    </p>
                    {Com.hasRole(this.props.securityKeyWord, 'resource_add', 'insert', 'resource') ?
                    <p><Button onClick={this.addmodel.bind(this)}>新增资源</Button></p>:''}</div>
                    <Tables {...TableOpt}/>
                    <ModalForm {...modelFormOpt}/>
                </div>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName, TreeD, slideID, total, searchflag, parentID, sortfield, sortorder, fields, modalflag, modaltype, modifycode, modifyID, queryfields} = state.resourcesReducer_;
    const {securityKeyWord} = state.initReducer;
    return {
        slideName,
        securityKeyWord,
        sortfield,
        sortorder,
        dataList:Alldate,  //列表的数据
        parentID,  //点击修改需要的上级ID
        modifyID,   //点击修改的ID
        fields:fields,  //form的数据
        modalflag,  //弹出框的显示
        modaltype,  //弹出框的类型
        TreeD,   //树的数据
        slideID,  //点击树所对应的id
        modifycode,  //修改的code码
        queryfields,
        list:state.systemReducer.listdata, total, searchflag
    };
};
export default connect(mapStateprops, action)(Resources);
