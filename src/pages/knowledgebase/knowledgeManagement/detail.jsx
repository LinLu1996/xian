 import {Component} from 'react';
 import _ from "lodash";
// import Tables from './table.jsx';
 import {Button} from 'antd';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
 import moment from "moment";
import '../../index.less';
import './index.less';

class KnowledgeManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags:[],
            id:-1,
            title:'',
            file:{filePath:''}
        };
    }

    async componentDidMount() {
        let id=-1;
        const params = _.replace(this.props.location.pathname, '/pages/knowledgebase/detail', '');
        id=params.split('/')[1];
        this.setState({
            id
        },() => {
            IOModel.getOne({id:this.state.id}).then((res) => {
                if(res.success) {
                    const data=res.data.article || {};
                    const title=data.title;
                    const createUserName=data.createUserName;
                    const gmtCreate=moment(data.gmtCreate).format('YYYY/MM/DD');
                    const tags=data.tags;
                    const content=data.content;
                    const prev=res.data.lastArticle || {};
                    const prevTitle=prev.title || '';
                    const prevID=prev.id || '';
                    const next=res.data.nextArticle || {};
                    const nextTitle=next.title || '';
                    const nextID=next.id || '';
                    const file={};
                    const defaultFileList=data.articleFiles[0] || [];
                    file.name=defaultFileList.fileName || '';
                    file.filePath=defaultFileList.filePath || '';
                    document.getElementsByClassName('knowledge-result-con')[0].innerHTML=content;
                    if((file.filePath!=='undefined' || file.filePath!=='') && document.getElementById('video1')) {
                        document.getElementById('video1').src=file.filePath;
                    }
                    this.setState({
                        title,createUserName,gmtCreate,tags,file,prevTitle,nextTitle,prevID,nextID
                    });
                }
            }).catch();
        });
        this.props.superiorName({name: '作物知识库', parentLeftID: -1});
    }
    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        const vm = {
            cropCn: this.state.cropCn,
            startPage: current,
            limit: size
        };
        this.props.queryAll(vm);
    }
    onchooseChange(current, size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
    }
    handleToPrev() {
        IOModel.getOne({id:this.state.prevID}).then((res) => {
            if(res.success) {
                const data=res.data.article || {};
                const title=data.title;
                const createUserName=data.createUserName;
                const gmtCreate=moment(data.gmtCreate).format('YYYY/MM/DD');
                const tags=data.tags;
                const content=data.content;
                const prev=res.data.lastArticle || {};
                const prevTitle=prev.title || '';
                const prevID=prev.id || '';
                const next=res.data.nextArticle || {};
                const nextTitle=next.title || '';
                const nextID=next.id || '';
                const file={};
                const defaultFileList=data.articleFiles[0] || [];
                file.name=defaultFileList.fileName || '';
                file.filePath=defaultFileList.filePath || '';
                document.getElementsByClassName('knowledge-result-con')[0].innerHTML=content;
                // if(file.filePath!=='') {
                //     document.getElementById('video1').src=file.filePath;
                // }
                this.setState({
                    title,createUserName,gmtCreate,tags,file,prevTitle,nextTitle,prevID,nextID
                });
            }
        }).catch();
    }
    handleToNext() {
        IOModel.getOne({id:this.state.nextID}).then((res) => {
            if(res.success) {
                const data=res.data.article || {};
                const title=data.title;
                const createUserName=data.createUserName;
                const gmtCreate=moment(data.gmtCreate).format('YYYY/MM/DD');
                const tags=data.tags;
                const content=data.content;
                const prev=res.data.lastArticle || {};
                const prevTitle=prev.title || '';
                const prevID=prev.id || '';
                const next=res.data.nextArticle || {};
                const nextTitle=next.title || '';
                const nextID=next.id || '';
                const file={};
                const defaultFileList=data.articleFiles[0] || [];
                file.name=defaultFileList.fileName || '';
                file.filePath=defaultFileList.filePath || '';
                document.getElementsByClassName('knowledge-result-con')[0].innerHTML=content;
                this.setState({
                    title,createUserName,gmtCreate,tags,file,prevTitle,nextTitle,prevID,nextID
                });
            }
        }).catch();
    }
    handleToList() {
        this.props.history.push(`/pages/knowledgebase`);
    }
    componentDidUpdate() {
        if(this.state.file.filePath!=='') {
            document.getElementById('video1').src=this.state.file.filePath;
        }
        if(document.getElementsByClassName('w-e-text')[0]) {
            document.getElementsByClassName('w-e-text')[0].contentEditable='false';
        }
    }
    render() {
        const {tags,title,gmtCreate,createUserName,prevTitle,nextTitle,file} = this.state;
        return (
            <div className='farming-box knowledge-deatil'>
                <div className='content'>
                    <div className='detail-left'>
                       <div className='knowledge-result'>
                                <div className='knowledge-result-left'>
                                    <p className='knowledge-result-title'>{title}</p>
                                    <span className='knowledge-result-time'>TIME:{gmtCreate}</span>
                                    <span>创建人:{createUserName}</span>
                                </div>
                            </div>
                        <div className='knowledge-result-con' contentEditable={false}>
                        </div>
                        <div className='detail-next'>
                            <div className='detail-next-left'>
                                {prevTitle!=='' && <p onClick={this.handleToPrev.bind(this)}><a>上一篇：{prevTitle}</a></p>}
                                {nextTitle!=='' && <p onClick={this.handleToNext.bind(this)}><a>下一篇：{nextTitle}</a></p>}
                            </div>
                            <Button className='detail-next-return' onClick={this.handleToList.bind(this)}>返回列表</Button>
                        </div>
                    </div>
                    <div className='detail-right'>
                        <div className='detail-right-top'>
                            <div className='detail-right-title'>相关标签</div>
                            <div className='detail-right-tag'>
                                <ul className='knowledge-tag-list-ul'>
                                    {tags.length>0 && tags.map((item) => {
                                        return <li key={item.id}>{item.name}</li>;
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className='detail-right-bottom'>
                            <div className='detail-right-video'>视频</div>
                            {
                                file.filePath!=='' ? <div className='detail-video'>
                                    <video id="video1" width="100%" height="100%" controls="controls" name="media">
                                        <source src={file.filePath} type="video/mp4"/>
                                        您的浏览器不支持 HTML5 video  标签。
                                    </video>
                                </div> : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {AllDetaildata} = state.knowledgeManagementReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['cropdata_listByPage','cropdata_add','cropdata_delete','cropdata_update','cropdata_getById'];
    return {
        AllDetaildata,
        securityKeyWord
    };
};
export default connect(mapStateprops, action)(KnowledgeManagement);
