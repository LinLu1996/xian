import {Component} from 'react';
import {Button, message, LocaleProvider, Modal} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action, IO, IOModel} from './model';
import ModalForm from './modalForm.jsx';
import ModalTable from './modalTable.jsx';
import Formtitle from '@/component/formtitle/index.jsx';
import Empdep from './empdep/index.jsx';
import './index.less';
import '../../index.less';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Com from '@/component/common';
import Zoomable from 'react-stretchable';
import RightSide from '@/component/rightSides/index.jsx';
import Operation from "@/pages/system/public";

const confirm = Modal.confirm;

class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueName: '',
            value: '',
            current: 1,
            psize: 10,
            closure: null,
            empdepisshow: false,
            emprole_: '',
            saveFlag: true,
            Treeflag: true,
            nodeTree: [],
            chooseId: null,
            queryFlag: false,
            queryF: false,
            chooseFlag: false,
            changedata: {},
            TreeParent: [],
            ModelParentName: '公司',
            fileList: [],
            fileFlag: true
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
        });
        this.props.slide({slideName: '公司'});
        IO.company.TreeData().then((res) => {  //公司树
            let treedata;
            if (!res.data) {
                treedata = [];
            } else {
                treedata = res.data;
                this.setState({
                    TreeParent: this.treedata(this.TreeParent(res.data, Treeparentdata))
                });
            }
            this.props.TreeData({tree: treedata});
        });
        IO.company.TreeNodeData({id: -1}).then((res) => {  //节点数
            let treedata;
            if (!res.data) {
                treedata = [];
            } else {
                treedata = res.data;
            }
            this.props.TreeNodeData({tree: treedata});
        });
    }

    treedata(data) {
        return data.map(item => {
            if (item.childrens) {
                item.childrens = this.treedata(item.childrens);
            }
            return Object.assign({}, item, {
                title: item.companyName,
                key: item.id
            });
        });
    }

    TreeParent(data, Treeparentdata) {
        data.map((item) => {
            let isleaf;
            item.leaf === 0 ? isleaf = false : isleaf = true;
            const d = Object.assign({}, item, {
                isLeaf: isleaf,
                childrens: []
            });
            Treeparentdata.push(d);
        });
        return Treeparentdata;
    }

    formChange(node, selected) {  //点击每一条数据的方法
        this.setState({
            value: node.props.companyName,
            queryF: selected,
            valueName: '',
            current: 1,
            changedata: node.props
        }, () => {
            const num = node.props.id;
            if (!selected) {
                this.props.Alldatas({
                    sortField: this.props.sortfield,
                    sortOrder: this.props.sortorder,
                    companyName: this.state.valueName,
                    startPage: 1,
                    limit: this.state.psize
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
                    parentId: num,
                    companyName: this.state.valueName,
                    startPage: 1,
                    limit: this.state.psize
                });
                this.setState({
                    chooseId: num,
                    chooseFlag: true,
                    queryFlag: false,
                    Treeflag: false
                });
            }
            this.props.slide({num: num, slideName: !selected ? '公司' : node.props.companyName});
            if (!selected) {
                this.setState({ModelParentName: '公司'});
                this.props.slide({num: -1, slideName: '公司'});
            } else {
                this.setState({ModelParentName: node.props.companyName});
            }
        });
    }

    formName(val) {
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
                            companyName: this.state.valueName,
                            startPage: 1,
                            limit: this.state.psize
                        });
                    } else {
                        this.props.chooseAll({
                            sortField: this.props.sortfield,
                            sortOrder: this.props.sortorder,
                            parentId: this.state.chooseId,
                            companyName: this.state.valueName,
                            startPage: 1,
                            limit: this.state.psize
                        });
                    }
                }, 800)
            });
        });
    }

    async addmodel(record, e) {
        if (e) {
            if (this.state.queryF) {
                if (this.state.changedata.companyName === record.companyName) {
                    e.stopPropagation();
                }
            }
        }
        if (!e && !this.state.queryF) {
            this.setState({ModelParentName: '公司'});
            this.props.slide({num: -1, slideName: '公司'});
            this.props.superiorName({name: '', type: ''});
        } else if (this.state.queryF && !e) {
            this.props.slide({num: this.state.changedata.id, slideName: this.state.changedata.companyName});
            await this.props.superiorName({
                name: this.state.changedata.companyName,
                type: this.state.changedata.companyType
            });
        } else if (e) {
            this.props.slide({num: record.id, slideName: record.companyName});
            await this.props.superiorName({name: record.companyName, type: record.companyType});
        }
        await this.props.defaultFields({
            id: {
                value: ''
            },
            parentName: {
                value: (this.props.parentName && this.props.parentName !== 'null') ? this.props.parentName : ''
            },
            comname: {
                value: ''
            },
            comnameEn: {
                value: ''
            },
            comtype: {
                value: (this.props.parentType && this.props.parentType !== 'null') ? this.props.parentType : ''
            },
            corpId: {
                value: ''
            },
            nodeId: {
                value: ''
            },
            nodeName: {
                value: ''
            },
            modeltype: {
                value: 'add'
            },
            fileList: {
                value: []
            }
        });
        this.setState({
            fileList: [],
            fileFlag: true
        });
        this.props.modal({modalFlag: true, modeltype: 'add'});  //控制modal的按钮
    }
    typeFn(text) {
        switch (text) {
            case '农企':
                return 1;
            case '散户':
                return 2;
            case '政府机构':
                return 3;
        }
    }

    async editor(record, e) {
        e.stopPropagation();
        await IO.company.getPhoneList({id: record.id}).then((res) => {
            if (res.success) {
                const data = res.data || [];
                data.map((item, index) => {
                    item.uid = index;
                    item.status = 'done';
                });
                this.setState({
                    fileList: data,
                    fileFlag: true
                });
            }
        });
        let type = '';
        if (typeof record.companyType === 'number') {
            type = record.companyType;
        } else {
            type = this.typeFn(record.companyType);
        }
        await this.props.superiorName({name: record.parentName, type: type});
        this.props.rightqueryItem(record);
        this.props.parentId({parentID: record.parentId, modifyid: record.id, modifycode: record.companyCode});
        record.parentId === -1 ? this.setState({ModelParentName: '公司'}) : this.setState({ModelParentName: record.parentName});
        const querydata = {
            id: {
                value: record.id
            },
            parentName: {
                value: this.props.parentName
            },
            comname: {
                value: record.companyName
            },
            comnameEn: {
                value: record.companyNameEn
            },
            comtype: {
                value: (this.props.parentType && this.props.parentType !== 'null') ? this.props.parentType : ''
            },
            corpId: {
                value: record.corpId
            },
            nodeId: {
                value: record.nodeId
            },
            nodeName: {
                value: record.nodeName
            },
            modeltype: {
                value: 'modify'
            },
            oldComnameEn: {
                value: record.companyNameEn
            }
        };
        await this.props.defaultFields(querydata);
        this.props.querydefaultfields(querydata);
        this.props.modal({modalFlag: true, modeltype: 'modify'});
    }

    deleteR(record, e) {
        let tit;
        e.stopPropagation();
        if (record.childrens && record.childrens.length > 0) {
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
            confirmLoading: false,
            onOk() {
                _this.confirm(record);
            }
        });
    }

    async confirm(record) {
        const {Alldatas, chooseAll} = this.props;
        const {current} = this.state;
        const deleteID = record.id;
        this.props.RightsearchFlag({flag:true});
        await Operation.systemDelete(Operation.listurl(this.props.list, 'company_delete'));
        const deletedata = Operation.deletetree(this.props.TreeD, record);
        await this.props.TreeData({tree: [...deletedata]});
        await IO.system_Delete.deleteData({':id': deleteID}).then((res) => {
            if (res.success) {
                let lencurrent;
                if (this.props.dataList.length === 1) {
                    lencurrent = current - 1;
                    this.getcurrent(current - 1);
                } else {
                    lencurrent = current;
                }
                if (!this.state.queryF) {
                    Alldatas({
                        sortField: this.props.sortfield,
                        sortOrder: this.props.sortorder,
                        companyName: this.props.Nameval,
                        startPage: lencurrent,
                        limit: 10
                    });
                } else {
                    chooseAll({
                        sortField: this.props.sortfield,
                        sortOrder: this.props.sortorder,
                        companyName: this.props.Nameval,
                        parentId: this.props.slideID,
                        startPage: lencurrent,
                        limit: 10
                    });
                }
                message.success('删除成功！');
            }
        }).catch((() => {
            this.setState({
                loadflag: false
            });
        }));
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
                companyName: valueName,
                parentId: chooseId,
                startPage: current,
                limit: size
            });
        } else {
            this.props.Alldatas({
                sortField: this.props.sortfield,
                sortOrder: this.props.sortorder,
                companyName: valueName,
                startPage: current,
                limit: size
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
                companyName: this.state.valueName,
                startPage: 1,
                limit: this.state.psize
            });
        } else {
            chooseAll({
                sortField: s,
                sortOrder: o,
                companyName: this.state.valueName,
                parentId: this.props.slideID,
                startPage: 1,
                limit: this.state.psize
            });
        }
    }

    empdephde() {
        this.setState({
            empdepisshow: false
        });
    }

    empdepshow(record) {
        this.setState({
            empdepisshow: true,
            emprole_: record
        });
    }

    getcurrent(num) {
        this.setState({
            current: num
        });
    }

    checkName(corpId, id) {
        if (this.state.closure) {
            clearTimeout(this.state.closure);
        }
        this.setState({
            closure: setTimeout(() => {
                if (corpId) {
                    IOModel.CheckName({corpId: corpId, id: id}).then((res) => {
                        if (res.success) {
                            if (res.data === 0) {
                                this.setState({
                                    saveFlag: false
                                });
                                message.warning('钉钉名已存在');
                            } else if (res.data === -1) {
                                message.error('验证失败');
                            } else if (res.data > 0) {
                                this.setState({
                                    saveFlag: true
                                });
                            }
                        }
                    }).catch();
                }
            }, 800)
        });
    }

    getNameval() {
        this.setState({
            valueName:''
        });
    }

    changeFileFlag() {
        this.setState({
            fileFlag: false
        });
    }

    getpsize(num,cur) {
        this.setState({
            psize:num,
            current:cur
        });
    }

    render() {
        const {current, psize, empdepisshow, emprole_, value, valueName, Treeflag, queryFlag, chooseFlag} = this.state;
        const {dataList, securityKeyWord, TreeD, TreeNodeD, searchflag} = this.props;
        const me = this;
        const RightSideOpt = {
            TreeDatalist: TreeD,
            TreeParent:this.state.TreeParent,
            searchflag:searchflag,
            add: me.addmodel.bind(me),
            editor: me.editor.bind(me),
            deleteR: me.deleteR.bind(me),
            keyword: 'company',
            securityKeyWord: securityKeyWord,
            formChange: me.formChange.bind(me),
            ref: self => {
                me.rightSides = self;
            }
        };
        const TableOpt = {
            data: dataList,
            showDeleteConfirm: me.deleteR.bind(me),
            query: me.editor.bind(me),
            onTableChange: me.onTableChange.bind(me),
            keydata: me.props.securityKeyWord,
            Treeflag: Treeflag,
            Nameval: me.state.valueName,
            current: current,
            queryFlag: queryFlag,
            chooseFlag: chooseFlag,
            onsizeChange: me.onsizeChange.bind(me),
            getpsize:me.getpsize.bind(me),
            empdepshow:me.empdepshow.bind(me)
        };
        const modelFormOpt = {
            cur: current,
            psize: psize,
            Treeflag: Treeflag,
            Nameval: valueName,
            props: me.props,
            val: me.state.value,
            ModelParentName: me.state.ModelParentName,
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
            <div className='system-box node-box'>
                <div className='wrap'>
                    <Zoomable {...zoomableOpt}>
                        <RightSide {...RightSideOpt}/>
                    </Zoomable>
                </div>
                <div className='system-tree-rightbox'>
                    <div className='title'>
                        <b>公司配置</b>
                        <Formtitle value={value} Nameval={valueName} keyword='公司配置' querykeyword='公司名称'
                                   formChange={this.formChange.bind(this)} formName={this.formName.bind(this)}/>
                    </div>
                    <div className='content'>
                        <div className='table-header'><p><i className='iconfont icon-sort'></i><span>公司列表</span>
                        </p>{(Com.hasRole(securityKeyWord, 'company_add', 'insert', 'company')) ?
                            <p><Button onClick={this.addmodel.bind(this)}>新增公司</Button></p> : ''}</div>
                        {
                            empdepisshow ? <div className="zhezhao"></div> : ''
                        }
                        {
                            empdepisshow ? <Empdep emprole_={emprole_} empdephde={this.empdephde.bind(this)}/> : ''
                        }
                        <LocaleProvider locale={zhCN}>
                            <Tables {...TableOpt} getcurrent={this.getcurrent.bind(this)}/>
                        </LocaleProvider>
                        <ModalForm {...modelFormOpt} name={this.state.valueName}
                                   fileList={this.state.fileList} fileFlag={this.state.fileFlag}
                                   checkName={this.checkName.bind(this)} saveFlag={this.state.saveFlag}
                                   TreeNodeD={TreeNodeD} changeFileFlag={this.changeFileFlag.bind(this)}/>
                        <ModalTable></ModalTable>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName, TreeD, TreeNodeD, searchflag, slideID, total, parentname, parenttype, parentID, sortfield, sortorder, fields, modalflag, modaltype} = state.companyReducer;
    const {securityKeyWord} = state.initReducer;
    return {
        TreeNodeD,
        slideName,
        searchflag,
        securityKeyWord,
        sortfield,
        sortorder,
        dataList: Alldate,  //列表的数据
        parentName: parentname,  //要显示的上级名字
        parentType: parenttype,  //要显示的上级类型
        parentID,  //点击修改需要的上级ID
        fields: fields,  //form的数据
        modalflag,  //弹出框的显示
        modaltype,  //弹出框的类型
        TreeD,   //树的数据
        slideID,  //点击树所对应的id
        list: state.systemReducer.listdata, total
    };
};
export default connect(mapStateprops, action)(Resources);