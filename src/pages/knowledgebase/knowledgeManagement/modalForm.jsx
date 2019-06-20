import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import {Modal, message, Input,Icon} from 'antd';


class modifyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputVisible: false,
            inputValue: '',
            inputValue2: '',
            categoryList:[],
            currentCategory:0,
            current1: 1,
            current2: 1,
            selectedTag:[],
            selectedCategory:-1,
            tags:[],
            category:[],
            currentCategoryAll:[],
            currentTagsAll:[],
            currentTag:0,
            parentCount:0
        };
    }
    async componentDidMount() {
        const data1={startPage: 1, limit: 10,tagIds:JSON.stringify([])};
        this.props.page({current: 1, pageSize: 10});
        this.props.Alldatas(data1); //进入页面请求列表数据
        this.getTag();
        // IOModel.getTag().then((res) => {
        //     const data = res.data || [];
        //     const childCount = data.childCount || 0;
        //     const parentCount = data.parentCount || 0;
        //     const all = data.tags || [];
        //     const category = [];
        //     const tags = [];
        //     for(let i=0; i<all.length; i++) {
        //         if(all[i].parentId===-1) {
        //             category.push(all[i]);
        //         } else {
        //             tags.push(all[i]);
        //         }
        //     }
        //     this.setState({
        //         childCount,parentCount,category,tags,currentCategoryAll:category.slice(0,5),currentTagsAll:tags.slice(0,5)
        //     });
        // }).catch();
    }
    hideModal(e) {   //点击确定的回调
        e.preventDefault();
        const {selectedCategory,selectedTag,category,tags,currentTag} = this.state;
        const cate={};
        const tag=[];
        if(selectedCategory!==-1) {
            for(let i=0; i<category.length; i++) {
                if(selectedCategory===category[i].id) {
                    cate.id=category[i].id;
                    cate.name=category[i].name;
                    tag.push(cate);
                    break;
                }
            }
        }
        if(currentTag!==0) {
            selectedTag.forEach((item) => {
                for(let i=0; i<tags.length; i++) {
                    const currentTag={};
                    if(item===tags[i].id) {
                        currentTag.id=tags[i].id;
                        currentTag.name=tags[i].name;
                        tag.push(currentTag);
                        break;
                    }
                }
            });
        }
        if(tag.length<=5) {
            this.props.modal({modalFlag: false, modeltype: 'add'});
            this.props.selectLabel(tag);
        } else {
            message.warning('标签选择不能超过5个');
        }
    }

    hideCancel() {   //点击关闭的回调函数
        this.props.modal({modalFlag: false, modeltype: 'add'});
    }
    showInput() {
        this.setState({ inputVisible: true },() => {this.input.focus();});
    }
    showInput2() {
        this.setState({ inputVisible2: true },() => {this.input2.focus();});
    }
    handleInputChange(e) {
        this.setState({ inputValue: e.target.value });
    }
    handleInputChange2(e) {
        this.setState({ inputValue2: e.target.value });
    }
    getTag() {
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
                childCount,parentCount,category,tags,currentCategoryAll:category.slice(0,5),currentTagsAll:tags.slice(0,5)
            });
        }).catch();
    }
    categoryClick(item,index) {
        const _this=this;
        let {selectedCategory} =this.state;
        if(index===0) {
            selectedCategory=-1;
        } else {
            selectedCategory=item.id;
        }
        this.setState({
            currentCategory:index,
            selectedCategory,
            currentTag:0,
            selectedTag:[]
        },() => {
            if(index===0) {
                _this.getTag();
                // IOModel.getTag().then((res) => {
                //     const data = res.data || [];
                //     const childCount = data.childCount || 0;
                //     const parentCount = data.parentCount || 0;
                //     const all = data.tags || [];
                //     const category = [];
                //     const tags = [];
                //     for(let i=0; i<all.length; i++) {
                //         if(all[i].parentId===-1) {
                //             category.push(all[i]);
                //         } else {
                //             tags.push(all[i]);
                //         }
                //     }
                //     this.setState({
                //         childCount,parentCount,category,tags,currentCategoryAll:category.slice(0,5),currentTagsAll:tags.slice(0,5)
                //     });
                // }).catch();
            } else {
                IOModel.getChildTag({parentId:item.id}).then((res) => {
                    const data = res.data || [];
                    const childCount = data.childCount || 0;
                    const all = data.tags || [];
                    const tags = [];
                    for(let i=0; i<all.length; i++) {
                        tags.push(all[i]);
                    }
                    this.setState({
                        childCount,tags,currentTagsAll:tags.slice(0,5)
                    });
                }).catch();
            }
        });
    }
    deleteCate(item,index) {
        const {category} =this.state;
        let {selectedCategory,currentCategoryAll}=this.state;
        selectedCategory=-1;
        category.splice(index,1);
        currentCategoryAll=category.slice(0,this.state.currentCategoryAll.length);
        this.setState({
            category,
            selectedCategory,
            currentCategoryAll,
            currentCategory:0
        },() => {
            IOModel.Delete({id:item.id,deleted:1}).then((res) => {
                if(res.success) {
                    message.success('删除成功');
                }
                // IOModel.getTag().then((res) => {
                //     const data = res.data || [];
                //     const childCount = data.childCount || 0;
                //     const parentCount = data.parentCount || 0;
                //     const all = data.tags || [];
                //     const category = [];
                //     const tags = [];
                //     for(let i=0; i<all.length; i++) {
                //         if(all[i].parentId===-1) {
                //             category.push(all[i]);
                //         } else {
                //             tags.push(all[i]);
                //         }
                //     }
                //     this.setState({
                //         childCount,parentCount,category,tags,currentCategoryAll:category.slice(0,5),currentTagsAll:tags.slice(0,5)
                //     });
                // }).catch();
            }).catch();
        });
    }
    tagClick(item,index) {
        const {tags} =this.state;
        let {selectedTag} = this.state;
        let currentTag=1;
        if(index===0) {
            currentTag=0;
            tags.forEach((it) => {
                it.isClicked=false;
            });
            selectedTag=[];
        } else{
            if(item.isClicked) {
                item.isClicked=false;
                selectedTag.forEach((it,ii) => {
                    if(it===item.id) {
                        selectedTag.splice(ii,1);
                    }
                });
            } else {
                item.isClicked=true;
                selectedTag.push(item.id);
            }
            currentTag=selectedTag.length===0? 0:1;
        }
        this.setState({
            tags,
            selectedTag,
            currentTag
        });
    }
    checkName(e) {
        if(e.target.value) {
            IOModel.CheckName({name: e.target.value}).then((res) => {  //添加成功时的回
                if (res.success) {
                    const data=res.data || {};
                    message.success('添加成功');
                    const {category,currentCategoryAll}=this.state;
                    const index=currentCategoryAll.length;
                    category.splice(index,0,data);
                    currentCategoryAll.splice(index,0,data);
                    this.setState({
                        category,currentCategoryAll,inputVisible:false,inputValue:''
                    });
                } else {
                    message.error(res.message);
                    this.setState({
                        inputVisible:false,
                        inputValue:''
                    });
                }
            }).catch((res) => {
                message.error(res.message);
                this.setState({
                    inputVisible:false,
                    inputValue:''
                });
            });
        }
    }
    checkName2(e) {
        if(e.target.value) {
            IOModel.CheckName({name: e.target.value,parentId:this.state.selectedCategory}).then((res) => {  //添加成功时的回
                if (res.success) {
                    const data=res.data || {};
                    message.success('添加成功');
                    const {tags,currentTagsAll}=this.state;
                    const index=currentTagsAll.length;
                    tags.splice(index,0,data);
                    currentTagsAll.splice(index,0,data);
                    this.setState({
                        tags,currentTagsAll,inputVisible2:false,inputValue2:''
                    });
                } else {
                    message.error(res.message);
                    this.setState({
                        inputVisible2:false,
                        inputValue2:''
                    });
                }
            }).catch((res) => {
                message.error(res.message);
                this.setState({
                    inputVisible2:false,
                    inputValue2:''
                });
            });
        }
    }
    downPage() {
        const {parentCount,category} = this.state;
        let {currentCategoryAll}=this.state;
        let maxPage =  0;
        if (parseInt(parentCount)%5 === 0) {
            maxPage = parseInt(parentCount/5);
        } else {
            maxPage = parseInt(parentCount/5) + 1;
        }
        const current = this.state.current1;
        if (current < maxPage) {
            currentCategoryAll=category.slice(0,this.state.currentCategoryAll.length+5);
            this.setState({
                current1: current + 1,
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
        if (parseInt(childCount)%5 === 0) {
            maxPage = parseInt(childCount/5);
        } else {
            maxPage = parseInt(childCount/5) + 1;
        }
        const current = this.state.current2;
        if (current < maxPage) {
            currentTagsAll=tags.slice(0,this.state.currentTagsAll.length+5);
            this.setState({
                current2: current + 1,
                currentTagsAll
            });
        } else {
            message.warning('标签已经全部加载完毕');
        }
    }
    deleteTag(item,index) {
        const _this=this;
        const {tags,selectedTag} =this.state;
        let {currentTag} = this.state;
        let {currentTagsAll} =this.state;
        selectedTag.map((it,i) => {
            if(it===item.id) {
                selectedTag.splice(i,1);
                item.isClicked=false;
                if(selectedTag.length===0) {
                    currentTag=0;
                } else {
                    currentTag=1;
                }
                return;
            }
        });
        tags.splice(index,1);
        // currentTagsAll.splice(index,1);
        currentTagsAll=tags.slice(0,this.state.currentTagsAll.length);
        IOModel.Delete({id:item.id,deleted:1}).then((res) => {
                if(res.success) {
                    message.success('删除成功');
                    _this.setState({
                        tags,
                        selectedTag,
                        currentTagsAll,
                        currentTag
                    });
                }
            }).catch();
    }
    render() {
        const {currentCategory,tags,currentCategoryAll,currentTagsAll,category,currentTag,inputVisible,inputVisible2,inputValue,inputValue2} =this.state;
        const {modalflag} = this.props;
        const title = "标签选择";
        return (
            <div>
                <Modal
                    title={title}
                    visible={modalflag}
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName='farming-admin-modal knowledge-box-modal'
                >
                    <div className='knowledge-content-left'>
                        <div className='knowledge-tag-arr'>
                            <div className='knowledge-tag-list'>
                                <p>类别</p>
                                <ul className='knowledge-tag-list-ul modal-knowledge-ul'>
                                    <li className={currentCategory===0?'knowledge-tag-list-checked':''} onClick={this.categoryClick.bind(this,{},0)}>全部
                                    </li>
                                    {currentCategoryAll.map((item,index) => {
                                        return <li className={currentCategory===index+1?'knowledge-tag-list-checked':''} key={item.id} onClick={this.categoryClick.bind(this,item,index+1)}>
                                                {item.name || '无标签名'}
                                            {
                                                currentCategory===index+1 && <Icon className='delete' type="close-circle" theme="outlined" onClick={this.deleteCate.bind(this,item,index)} />
                                            }
                                            </li>;
                                    })}
                                    {inputVisible && (
                                            <Input
                                                    ref={refs => this.input=refs}
                                                    type="text"
                                                    style={{ width: 78 }}
                                                    value={inputValue}
                                                    onChange={this.handleInputChange.bind(this)}
                                                    onBlur={this.checkName.bind(this)}
                                            />
                                    )}
                                    {!inputVisible && (
                                            <li className='last-li' onClick={() => {this.showInput();}} style={{ background: '#fff' }}>
                                                +
                                            </li>
                                    )}
                                </ul>
                                {
                                    category.length>5?<div className='knowledge-modal-more' onClick={() => {this.downPage();}}>+更多</div>:''
                                }
                            </div>
                            <div className='knowledge-tag-list'>
                                <p>标签</p>
                                <ul className='knowledge-tag-list-ul modal-knowledge-ul'>
                                    <li className={currentTag===0?'knowledge-tag-list-checked':''} onClick={this.tagClick.bind(this,{},0)}>全部
                                    </li>
                                    {currentTagsAll.length>0 && currentTagsAll.map((item,index) => {
                                        return <li className={item.isClicked && item.isClicked===true?'knowledge-tag-list-checked':''} key={item.id} onClick={this.tagClick.bind(this,item,index+1)}>
                                                {item.name}
                                            {
                                                item.isClicked===true && <Icon className='delete' type="close-circle" theme="outlined" onClick={this.deleteTag.bind(this,item,index)} />
                                            }
                                            </li>;
                                    })}
                                    {inputVisible2 && (
                                            <Input
                                                    ref={refs => {this.input2=refs;}}
                                                    type="text"
                                                    style={{ width: 78 }}
                                                    value={inputValue2}
                                                    onChange={this.handleInputChange2.bind(this)}
                                                    onBlur={this.checkName2.bind(this)}
                                            />
                                    )}
                                    {!inputVisible2 && currentCategory? (
                                            <li className='last-li' onClick={() => {this.showInput2();}} style={{ background: '#fff' }}>
                                                +
                                            </li>
                                    ):''}
                                </ul>
                                {
                                    tags.length>5?<div className='knowledge-modal-more' onClick={() => {this.downPageTag();}}>+更多</div>:''
                                }
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {Alldate, id, title, isOk, Cur, typeMark, typeName, parentname, parentID, Psize, cropCn, cropType, description, fields, modeltype, modalflag, chooseCUR, chooseSIZE, TreeD, slideID, modifyID, slideparentID, slideName} = state.knowledgeManagementReducer;
    return {
        dataList: Alldate,
        isok: isOk,
        parentname: parentname,
        parentID, modifyID,
        Cur,
        Psize,
        id,
        typeMark, typeName,
        cropCn, cropType, description,
        fields: fields,
        modalflag, modeltype, TreeD, slideID,
        chooseCUR, chooseSIZE, slideparentID, slideName, title
    };
};
export default connect(mapstateProps, action)(modifyModal);
