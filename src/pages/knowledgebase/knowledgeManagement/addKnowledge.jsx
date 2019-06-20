 import {Component} from 'react';
 import ReactDOM from 'react-dom';
import {Input,message,Button,Icon,Upload,Progress } from 'antd';
 import Editor from 'wangeditor';
 import _ from "lodash";
// import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import ModalForm from './modalForm.jsx';
import '../../index.less';
import './index.less';

class KnowledgeManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:'',
            allLabel:[],
            fileList:[],
            path:'',
            fileName:'',
            videoId:'',
            actionType:'add',
            percent:0,
            canUpload:true,
            timeKey:''
        };
        this.content='';
        this.getP=null;
    }

    async componentDidMount() {
        let actionType='add';
        let id=-1;
        const params = _.replace(this.props.location.pathname, '/pages/knowledgebase/', '');
        if(params==='add') {
            actionType='add';
        } else {
            actionType = params.split("/")[0];
            id = params.split("/")[1];
        }
        this.setState({
            id,actionType
        },() => {
            if(this.state.actionType==='edit') {
                IOModel.getOne({id:this.state.id}).then((res) => {
                    if(res.success) {
                        const data=res.data.article || {};
                        const title=data.title;
                        const tags=data.tags;
                        const content=data.content;
                        const defaultFileList=data.articleFiles && data.articleFiles[0] || [];
                        const fileName=defaultFileList.fileName;
                        const videoId=defaultFileList.videoId;
                        let percent=0;
                        if(fileName) {
                            percent=100;
                        }
                        this.content=content;
                        // document.getElementById('div3').innerHTML=content;
                        this.editor.txt.html(content);
                        this.setState({
                            title,allLabel:tags,fileName,videoId,percent
                        });
                    }
                }).catch();
            }
        });
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
        this.editor = new Editor(ReactDOM.findDOMNode(document.getElementById('div3')));
        this.editor.customConfig.uploadImgShowBase64 = true;
        this.editor.create();
        // this.editor.txt.html()=this.content;
        // this.content=document.getElementById('div3').innerHTML;
    }
    setTitle(e) {
        this.setState({
            title: e.target.value
        });
    }
    addLabel() {
        this.props.modal({modalFlag: true, modaltype: 'add'});
    }
    selectLabel(tag) {
        this.setState({
            allLabel:tag
        });
    }
    deleteSelectedCate(item,index) {
        const {allLabel} = this.state;
        allLabel.splice(index,1);
        this.setState({
            allLabel
        });
    }
    handleError() {
        // document.getElementsByClassName('ant-upload-list')[0].innerHTML='';
        const arr=document.getElementsByClassName('ant-upload-list-item');
        if(arr.length>0) {
            for(let i=0; i<arr.length; i++) {
                document.getElementsByClassName('ant-upload-list-item')[i].style.display='none';
            }
        }
        // document.getElementsByClassName('ant-upload-list-item')[document.getElementsByClassName('ant-upload-list-item').length-1].style.display='none';
        this.setState({
            isClick:false
        });
    }
    handleError2() {
        const arr = document.getElementsByClassName('ant-upload-list-item');
        if(arr.length>0) {
            for(let i=0; i<arr.length - 1; i++) {
                document.getElementsByClassName('ant-upload-list-item')[i].style.display='none';
            }
        }
        this.setState({
            isClick:true
        });
    }
    handleToIndex() {
        this.props.history.push('/pages/knowledgebase');
    }
    handleUpload() {
        // this.content=this.editor.txt.html();
        this.content=document.getElementsByClassName('w-e-text-container')[0].innerHTML;
        const _this=this;
        const {allLabel,title,videoId,fileName,actionType,id} = this.state;
        if(!title) {
            message.warning('请输入标题');
            return;
        }
        if(allLabel.length===[]) {
            message.warning('请选择标签');
            return;
        }
        // if(!path || !fileName) {
        //     message.warning('请上传视频');
        //     return;
        // }
        if(!this.content) {
            message.warning('请输入内容');
            return;
        }
        let targetId=[];
        targetId=allLabel.map((item) => {
            return item.id;
        });
        const data1= {
            videoId,fileName,
            title,content:this.content,
            tagIds: JSON.stringify(targetId)
        };
        const data2= {
            videoId,fileName,
            title,content:this.content,
            tagIds: JSON.stringify(targetId),
            id:id
        };
        if(actionType==='add') {
            IOModel.sendFile(data1).then(res => {
                if(res.success) {
                    message.success(res.message);
                    _this.props.history.push('/pages/knowledgebase');
                } else {
                    message.warning(res.message);
                }
            })
                    .catch(res => {
                        message.warning(res.message);
                    });
        } else if(actionType==='edit') {
            IOModel.editFile(data2).then(res => {
                if(res.success) {
                    message.success(res.message);
                    _this.props.history.push('/pages/knowledgebase');
                } else {
                    message.warning(res.message);
                }
            }).catch(res => {
                        message.warning(res.message);
                    });
        }
    }
    componentWillUnmount() {
        clearInterval(this.getP);
    }
    async handleCancel() {
        await clearInterval(this.getP);
        await this.setState({
            percent:0,
            timeKey:'',
            fileName:'',
            videoId:'',
            canUpload:true
        });
    }
    render() {
        const {allLabel,fileName,actionType} = this.state;
        const _this=this;
        const propsUpload = {
            name: 'files',
            accept:'.avi,.mp4',
            action: '/article/file',
            data:{},
            // multiple:true,
            headers: {
                authorization: 'authorization-text',
                enctype:'multipart/form-data'
            },
            beforeUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 300;
                if (!isLt2M) {
                    message.error('视频不得大于300MB!');
                    return false;
                }
                _this.setState({
                    fileName:file.name
                });
                if( _this.getP) {
                    clearInterval( _this.getP);
                }
                let i=0;
                _this.getP=setInterval(() => {
                    IOModel.getProgress({i:i}).then((res) => {
                        i++;
                        if(res.success) {
                            const percent=res.data.percent;
                            const timeKey=res.data.key;
                            if(percent>0) {
                                _this.setState({
                                    percent,
                                    timeKey
                                });
                            }
                            if(_this.state.fileName==='' && _this.state.canUpload===true) {
                                _this.setState({
                                    percent:0
                                });
                            }
                        }
                    }).catch();
                },500);
                _this.setState({
                    canUpload:false
                });
            },
            onChange(info) {
                if (info.file.status === 'done') {
                    if((info.file.response.success && info.file.response.data.key===_this.state.timeKey) || _this.state.percent===100) {
                        const videoId=info.file.response.data.videoId || '';
                        const fileName=info.file.response.data.fileName || '';
                        _this.setState({
                            videoId,fileName
                        });
                        _this.handleError2(info.fileList);
                        clearInterval(_this.getP);
                    } else {
                        // clearInterval(_this.getP);
                        if(_this.state.fileName==='' && _this.state.canUpload===true) {
                            _this.setState({
                                percent:0
                            });
                        }
                        _this.handleError();
                    }
                    _this.setState({
                        canUpload:true
                    });
                } else if (info.file.status === 'error') {
                    message.error('上传失败');
                    _this.setState({
                        canUpload:true,
                        path:'',
                        fileName:''
                    });
                    _this.handleError();
                    clearInterval(_this.getP);
                } else if (status === 'uploading') {
                    _this.setState({
                        canUpload:true
                    });
                }
            }
        };
        return (
            <div className='farming-box addKnowledge-box'>
                <div className='farming-search'>
                    <div className='farming-title'>
                        <div className='title'>{actionType==='add' ? '新增知识' : '编辑知识'}</div>
                    </div>
                </div>
                <div className='content'>
                    <div>
                        <div className='content-list'>
                            <span className='content-list-title'>标题：</span>
                                <div className='list-title'><Input value={this.state.title} onChange={this.setTitle.bind(this)}/></div>
                        </div>
                        <div className='content-list'>
                            <div>
                                <span className='content-list-title'>标签：</span>
                                <div className='list-label'>
                                    <ul className='knowledge-tag-list-ul add-knowledge-tag-list'>
                                        {allLabel.map((item,index) => {
                                            return <li key={item.id}>
                                                <Icon className='delete' type="close-circle" theme="outlined" onClick={this.deleteSelectedCate.bind(this,item,index)} />
                                                {item.name}</li>;
                                        })}
                                    </ul>
                                    <Button className='hidden-content' onClick={this.addLabel.bind(this)}>添加标签  +</Button>
                                </div>
                            </div>
                            <div className='list-label-limit'>标签上传不能超过5个</div>
                        </div>
                        <div className='content-list'>
                            <span className='content-list-title'>视频：</span>
                            <div className='list-video'>
                                <div className='list-video-all'>
                                    <div className='list-video-top'>
                                        <div className='list-video-t'>
                                            <Upload {...propsUpload} showUploadList={false}>
                                                <Button disabled={!this.state.canUpload} className={!this.state.canUpload ? 'upload-dis' : ''}>点击上传视频</Button>
                                            </Upload>
                                            <span className='list-video-tips'>视频不得大于300M，格式可上传：avi、mp4</span>
                                        </div>
                                    </div>
                                    {
                                        fileName && <div className='video-list'>
                                            <span>{fileName && fileName}</span>
                                            {
                                                this.state.percent===0 && fileName ? <span className='upload-wait'>上传中</span> : ''
                                            }
                                            {
                                                this.state.percent>0 && fileName ? <span className='upload-wait' onClick={this.handleCancel.bind(this)}>取消上传</span> : ''
                                            }
                                        </div>
                                    }
                                    {
                                        this.state.percent > 0 && <Progress percent={this.state.percent} strokeColor='#9cd0a0'/>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='addKnowledge-edit' id='div3'></div>
                    </div>
                    <div className='addKnowledge-bottom'>
                        <Button className='addKnowledge-sure' onClick={this.handleUpload.bind(this)}>确认</Button>
                        <Button onClick={this.handleToIndex.bind(this)}>取消</Button>
                    </div>
                    {
                        this.props.modalflag && <ModalForm props={this.props} selectLabel={this.selectLabel.bind(this)}/>
                    }
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate,modalflag,AllTag,childCount, parentCount, category, tags, id, diseasePests, diseasePestsCn, total, slideName, modeltype, chooseId, queryFlag} = state.knowledgeManagementReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['cropdata_listByPage','cropdata_add','cropdata_delete','cropdata_update','cropdata_getById'];
    return {
        modalflag,
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
