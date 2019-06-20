 import {Component} from 'react';
import {Input, Button, message,Tooltip,Pagination,Modal,LocaleProvider} from 'antd';
// import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
 import zhCN from 'antd/lib/locale-provider/zh_CN';
// import ModalForm from './modalForm2.jsx';
import '../../index.less';
import './index.less';
import moment from "moment";
import Com from '@/component/common';
 const Search = Input.Search;
 const confirm = Modal.confirm;

class KnowledgeManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Alldate:[],
            total:null,
            categoryList:[],
            currentCategory:0,
            search:'',
            current1:1,
            current2:1,
            selectedTag:[],
            selectedCategory:[],
            tags:[],
            category:[],
            currentCategoryAll:[],
            currentTagsAll:[],
            closure:null,
            showSearch:false
        };
    }

    async componentDidMount() {
        const data1={startPage: 1, limit: 10,tagIds:JSON.stringify([])};
        this.props.page({current: 1, pageSize: 10});
        // this.props.Alldatas(data1); //进入页面请求列表数据
        IOModel.Alldatas(data1).then((res) => {
            const data = res.data.res || [];
            const total = res.data.totalCount;
            this.setState({
                Alldate: data,
                total: total
            });
        }).catch();
        IOModel.getTag().then((res) => {
            const data = res.data || [];
            const childCount = data.childCount || 0;
            const parentCount = data.parentCount || 0;
            const all = data.tags || [];
            const category = [];
            const tags = [];
            for(let i=0; i<all.length; i++) {
                if(all[i].parentId===-1) {
                    category.push(all[i]);
                } else {
                    tags.push(all[i]);
                }
            }
            this.setState({
                childCount,parentCount,category,tags,currentCategoryAll:category.slice(0,5),currentTagsAll:tags.slice(0,6)
            });
        }).catch();
        this.props.superiorName({name: '作物知识库', parentLeftID: -1});
    }
    handleSearch(e) {
        this.setState({
            search: e.target.value
        },() => {
            const target=[].concat(this.state.selectedCategory,this.state.selectedTag);
            const data1={startPage: 1, limit: 10,name:this.state.search,tagIds:JSON.stringify(target)};
            if(this.state.closure) {
                clearTimeout(this.state.closure);
            }
            this.setState({
                closure :
                    setTimeout(() => {
                        this.props.page({current: 1, pageSize: 10});
                        IOModel.Alldatas(data1).then((res) => {
                            const total = res.data.totalCount;
                            const data = res.data.res || [];
                            if(this.state.search) {
                                data.forEach((item) => {
                                    // console.log('aaaaaaa',item.title,item.content);
                                    const html = `<span class="keyword">${this.state.search}</span>`;
                                    item.title = item.title.replace(new RegExp(this.state.search,'g'), html);
                                    item.content = item.content.replace(new RegExp(this.state.search,'g'), html);
                                });
                            }
                            this.setState({
                                Alldate: data,
                                total: total
                            });
                        }).catch();
                        if(this.state.search) {
                            this.setState({
                                showSearch: true
                            });
                        }else {
                            this.setState({
                                showSearch: false
                            });
                        }
                    },800)
            });
        });
    }
    categoryClick(item,index) {
        let {selectedCategory} =this.state;
        if(index===0) {
            selectedCategory=[];
        } else {
            selectedCategory=[];
            selectedCategory.push(item.id);
        }
        this.setState({
            currentCategory:index,
            selectedCategory,
            selectedTag:[]
        },() => {
            if(index===0) {
                IOModel.getTag().then((res) => {
                    const data = res.data || [];
                    const childCount = data.childCount || 0;
                    const parentCount = data.parentCount || 0;
                    const all = data.tags || [];
                    const category = [];
                    const tags = [];
                    for(let i=0; i<all.length; i++) {
                        if(all[i].parentId===-1) {
                            category.push(all[i]);
                        } else {
                            tags.push(all[i]);
                        }
                    }
                    this.setState({
                        childCount,parentCount,category,tags,currentCategoryAll:category.slice(0,5),currentTagsAll:tags.slice(0,6)
                    });
                }).catch();
            } else {
                IOModel.getChildTag({parentId:item.id}).then((res) => {
                    const data = res.data || [];
                    const childCount = data.childCount || 0;
                    const parentCount = data.parentCount || 0;
                    const all = data.tags || [];
                    const tags = [];
                    for(let i=0; i<all.length; i++) {
                        tags.push(all[i]);
                    }
                    this.setState({
                        childCount,parentCount,tags,currentTagsAll:tags.slice(0,6)
                    });
                }).catch();
            }
            const data1={startPage: 1, limit: 10,name:this.state.search,tagIds:JSON.stringify(this.state.selectedCategory)};
            IOModel.Alldatas(data1).then((res) => {
                const data = res.data.res || [];
                const total = res.data.totalCount;
                if(this.state.search) {
                    data.forEach((item) => {
                        const html = `<span class="keyword">${this.state.search}</span>`;
                        item.title = item.title.replace(new RegExp(this.state.search,'g'), html);
                        item.content = item.content.replace(new RegExp(this.state.search,'g'), html);
                    });
                }
                this.setState({
                    Alldate: data,
                    total: total
                });
            }).catch(); //进入页面请求列表数据
        });
    }
    tagClick(item) {
        const {tags,selectedTag} =this.state;
        if(item.isClicked) {
            item.isClicked=false;
            selectedTag.splice(selectedTag.length-1,1);
        } else {
            item.isClicked=true;
            selectedTag.push(item.id);
        }
        this.setState({
            tags,
            selectedTag
        },() => {
            const target=[].concat(this.state.selectedCategory,this.state.selectedTag);
            const data1={startPage: 1, limit: 10,name:this.state.search,tagIds:JSON.stringify(target)};
            IOModel.Alldatas(data1).then((res) => {
                const data = res.data.res || [];
                const total = res.data.totalCount;
                if(this.state.search) {
                    data.forEach((item) => {
                        item.content = item.content.replace(new RegExp(this.state.search,'g'), html);
                        const html = `<span class="keyword">${this.state.search}</span>`;
                        item.title = item.title.replace(new RegExp(this.state.search,'g'), html);
                    });
                }
                this.setState({
                    Alldate: data,
                    total: total
                });
            }).catch(); //进入页面请求列表数据
        });
    }
    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        const vm = {
            cropCn: this.state.cropCn,
            startPage: current,
            limit: size
        };
        this.props.queryAll(vm);
    }

    addKnowledge() {   //增加的按钮
        this.props.history.push(`/pages/knowledgebase/add/-1`);
    }
    onchooseChange(current, size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
    }
    onSizeChange(current, size) {  //点击筛选的分页按钮
        this.props.page({current: current, pageSize: size});
        const target=[].concat(this.state.selectedCategory,this.state.selectedTag);
        const data1={startPage: current, limit: 10,name:this.state.search,tagIds:JSON.stringify(target)};
        IOModel.Alldatas(data1).then((res) => {
            const data = res.data.res || [];
            const total = res.data.totalCount;
            if(this.state.search) {
                data.forEach((item) => {
                    const html = `<span class="keyword">${this.state.search}</span>`;
                    item.content = item.content.replace(new RegExp(this.state.search,'g'), html);
                    item.title = item.title.replace(new RegExp(this.state.search,'g'), html);
                });
            }
            this.setState({
                Alldate: data,
                total: total
            });
        }).catch(); //进入页面请求列表数据
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        this.props.page({current: 1, pageSize: size});
        const target=[].concat(this.state.selectedCategory,this.state.selectedTag);
        const data1={startPage: 1, limit: size,name:this.state.search,tagIds:JSON.stringify(target)};
        IOModel.Alldatas(data1).then((res) => {
            const data = res.data.res || [];
            const total = res.data.totalCount;
            if(this.state.search) {
                data.forEach((item) => {
                    const html = `<span class="keyword">${this.state.search}</span>`;
                    item.title = item.title.replace(new RegExp(this.state.search,'g'), html);
                    item.content = item.content.replace(new RegExp(this.state.search,'g'), html);
                });
            }
            this.setState({
                Alldate: data,
                total: total
            });
        }).catch(); //进入页面请求列表数据
    }
    downPage() {
        const {parentCount,category} = this.state;
        let {currentCategoryAll}=this.state;
        let maxPage =  0;
        if (parseInt(parentCount -1)%6 === 0) {
            maxPage = parseInt(parentCount/6);
        } else {
            maxPage = parseInt(parentCount/6) + 1;
        }
        const current = this.state.current1;
        if (current < maxPage) {
            currentCategoryAll=category.slice(0,this.state.currentCategoryAll.length+6);
            this.setState({
                current: current + 1,
                currentCategoryAll
            });
        } else {
            message.warning('类别已经全部加载完毕');
        }
    }
    downPageTag() {
        const {childCount,tags} = this.state;
        let {currentTagsAll}=this.state;
        let maxPage =  0;
        if (parseInt(childCount)%6 === 0) {
            maxPage = parseInt(childCount/6);
        } else {
            maxPage = parseInt(childCount/6) + 1;
        }
        const current = this.state.current2;
        if (current < maxPage) {
            currentTagsAll=tags.slice(0,this.state.currentTagsAll.length+6);
            this.setState({
                current: current + 1,
                currentTagsAll
            });
        } else {
            message.warning('标签已经全部加载完毕');
        }
    }
    handleEdit(id) {
        // event.preventDefault();
        this.props.history.push(`/pages/knowledgebase/edit/${id}`);
    }
    handleDelete(id) {
        const _this = this;
        confirm({
            title: '你确定要删除这条信息吗?',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            className: 'ant-confirm-btns',
            onOk() {
                _this.confirm(id);
            }
        });
    }
    confirm(id) {
        IOModel.editFile({id:id,deleted:1}).then((res) => {
            if(res.success) {
                message.success(res.message);
                const data1={startPage: this.props.current, limit: 10,tagIds:JSON.stringify([])};
                this.props.page({current: this.props.current, pageSize: 10});
                IOModel.Alldatas(data1).then((res) => {
                    const data = res.data.res || [];
                    const total = res.data.totalCount;
                    this.setState({
                        Alldate: data,
                        total: total
                    });
                }).catch();
            } else {
                message.error(res.message);
            }
        }).catch((res) => {
            message.error(res.message);
        });
    }
    handleDetail(id) {
        this.props.history.push(`/pages/knowledgebase/detail/${id}`);
    }
    componentWillUnmount() {
        if(this.state.closure) {
            clearTimeout(this.state.closure);
        }
    }
    render() {
        const {securityKeyWord} = this.props;
        const addRole = Com.hasRole(securityKeyWord, 'knowledgebase_add', 'insert', 'knowledgebase');
        const editRole = Com.hasRole(securityKeyWord, 'knowledgebase_update', 'update', 'knowledgebase');
        const {currentCategory,tags,currentCategoryAll,currentTagsAll,category,showSearch,Alldate,total} =this.state;
        const {current} =this.props;
        return (
            <div className='farming-box knowledge-box'>
                <div className='farming-search'>
                    <div className='farming-title'>
                        <div className='title'>知识管理</div>
                        <div className='search-top'>
                            <div className='search-row'>
                                <div className='search-col'>
                                    <Search
                                            placeholder="可输入关键词"
                                            onChange={value => this.handleSearch(value)}
                                            style={{ width: 300,height:'40px',marginRight:'10px'}}
                                    />
                                    {addRole && <Button className='add-knowledge' onClick={this.addKnowledge.bind(this)}>新增知识</Button>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className='knowledge-content-left'>
                        <div className='knowledge-tag'>标签</div>
                        <div className='knowledge-tag-arr'>
                            <div className='knowledge-tag-list'>
                                <p>类别</p>
                                <ul className='knowledge-tag-list-ul'>
                                    <li className={currentCategory===0?'knowledge-tag-list-checked':''} onClick={this.categoryClick.bind(this,{},0)}>全部
                                    </li>
                                    {currentCategoryAll.map((item,index) => {
                                            return <li className={currentCategory===index+1?'knowledge-tag-list-checked':''} key={item.id} onClick={this.categoryClick.bind(this,item,index+1)}>
                                                        {/*{currentCategory===index+1 && <i className='iconfont icon-asmkticon0246' onClick={this.deleteCate.bind(this,item,index)}></i>}*/}
                                                        {item.name}</li>;
                                        })}
                                </ul>
                                {
                                    category.length>5?<div className='knowledge-tag-more' onClick={() => {this.downPage();}}>+更多</div>:''
                                }
                            </div>
                            <div className='knowledge-tag-list'>
                                <p>标签</p>
                                <ul className='knowledge-tag-list-ul'>
                                    {currentTagsAll.map((item,index) => {
                                            return <li className={tags[index].isClicked===true?'knowledge-tag-list-checked':''} key={item.id} onClick={this.tagClick.bind(this,item,index)}>
                                                        {/*{tags[index].isClicked===true && <i className='iconfont icon-asmkticon0246' onClick={this.deleteTag.bind(this,item,index)}></i>}*/}
                                                        {item.name}</li>;
                                        })}
                                </ul>
                                {
                                    tags.length>6?<div className='knowledge-tag-more' onClick={() => {this.downPageTag();}}>+更多</div>:''
                                }
                            </div>
                        </div>
                    </div>
                    {
                        !showSearch && <div className='knowledge-content-right'>
                            {
                                Alldate.length>0 && Alldate.map((item) => {
                                    return <div className='knowledge-result' key={item.id}>
                                        <div className='knowledge-result-left' onClick={this.handleDetail.bind(this,item.id)}>
                                            <p className='knowledge-result-title' dangerouslySetInnerHTML={{ __html: item.title }}></p>
                                            <span className='knowledge-result-time'>TIME：{moment(item.gmtCreate).format('YYYY/MM/DD')}</span>
                                            <span>创建人：{item.createUserName}</span>
                                        </div>
                                        {(editRole) && <div className='knowledge-result-right'>
                                            <Tooltip placement="top" title='删除'>
                                            <span className='cursor' onClick={this.handleDelete.bind(this,item.id)}>
                                                <i className='iconfont icon-shanchu'></i>
                                            </span>
                                            </Tooltip>
                                            <Tooltip placement="top" title='编辑'>
                                                        <span className='cursor' onClick={this.handleEdit.bind(this,item.id)}>
                                                            <i className='iconfont icon-xiugai07'></i>
                                                        </span>
                                            </Tooltip>
                                        </div>}
                                    </div>;
                                })
                            }
                            <div className='res-table'>
                                <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChange.bind(this)} current={current} defaultCurrent={1}  total={total} /></LocaleProvider>
                                {/*<Pagination className='res-pagination' defaultPageSize={10} defaultCurrent={1} total={total}*/}
                                            {/*current={current} onChange={this.onSizeChange.bind(this)}/>*/}
                            </div>
                        </div>
                    }
                    {
                        showSearch && <div className='knowledge-content-right'>
                            <p>为您搜索到相关结果{total}个</p>
                        {
                            Alldate.map((item) => {
                                return <div className='knowledge-result' key={item.id}>
                                    <div className='knowledge-result-left' onClick={this.handleDetail.bind(this,item.id)}>
                                        <p className='knowledge-result-title' dangerouslySetInnerHTML={{ __html: item.title }}></p>
                                        <p className='knowledge-result-dis' dangerouslySetInnerHTML={{ __html: item.content }}></p>
                                        <span className='knowledge-result-time'>TIME：{moment(item.gmtCreate).format('YYYY/MM/DD')}</span>
                                        <span>创建人：{item.createUserName}</span>
                                    </div>
                                    {(editRole) && <div className='knowledge-result-right'>
                                        <Tooltip placement="top" title='删除'>
                                            <span className='cursor' onClick={this.handleDelete.bind(this,item.id)}>
                                                <i className='iconfont icon-shanchu'></i>
                                            </span>
                                        </Tooltip>
                                        <Tooltip placement="top" title='编辑'>
                                                        <span className='cursor' onClick={this.handleEdit.bind(this,item.id)}>
                                                            <i className='iconfont icon-xiugai07'></i>
                                                        </span>
                                        </Tooltip>
                                    </div>}
                                </div>;
                            })
                        }
                        <div className='res-table'>
                        <Pagination className='res-pagination' defaultPageSize={10} defaultCurrent={1} total={total}
                        current={current} onChange={this.onSizeChange.bind(this)}/>
                        </div>
                        </div>
                    }
                    {/*<ModalForm props={this.props} />*/}
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate,AllTag,childCount, Cur,parentCount, category, tags, id, diseasePests, diseasePestsCn, total, slideName, modeltype, chooseId, queryFlag} = state.knowledgeManagementReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['cropdata_listByPage','cropdata_add','cropdata_delete','cropdata_update','cropdata_getById'];
    return {
        current:Cur,
        AllTag,
        Alldate: Alldate,
        securityKeyWord,
        slideName,
        total,
        modeltype: modeltype,
        queryFlag: queryFlag,
        chooseId: chooseId, id, diseasePests, diseasePestsCn,childCount, parentCount, category, tags
    };
};
export default connect(mapStateprops, action)(KnowledgeManagement);
