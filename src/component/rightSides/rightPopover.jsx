import { Component } from 'react';
import { Popover, Tooltip} from 'antd';
import Com from '@/component/common';
import {connect} from 'react-redux';
import {action} from './model';
class RightPopover extends Component {
    constructor(props) {
        super(props);
    }
    editor(record, e) {
        this.props.editor(record,e);
    }
    deleteR(record,e) {
        this.props.deleteR(record,e);
    }
    addmodel(record,e) {   //增加的按钮
        this.props.add(record,e);
    }
    onmouseenter(e) {
      const len = e.target.parentNode.parentNode.parentNode.parentNode.offsetWidth;
      if(e.target.offsetWidth+(e.target.offsetLeft-this.props.scrollnum)>150 && this.props.scrollnum<10) {
        e.target.parentNode.parentNode.parentNode.style.maxWidth='100%';
      }else if(e.target.offsetWidth+(e.target.offsetLeft-this.props.scrollnum)>150 && this.props.scrollnum>10) {
        e.target.parentNode.parentNode.parentNode.style.width=`${len+this.props.scrollnum-10}px`;
      }
    }
    onmouseleave(e) {
      e.target.parentNode.parentNode.parentNode.style.width='';
      e.target.parentNode.parentNode.parentNode.style.maxWidth='';
   }
  render() {
    let itemTitle;
    let itemEnName = "";
    if (this.props.keyword === 'base') {
        itemTitle = this.props.item.title;
    } else if (this.props.keyword === 'org') {
        itemTitle = this.props.item.orgName;
    } else if (this.props.keyword === 'node') {
        itemTitle = this.props.item.nodeName;
    } else if (this.props.keyword === 'company') {
        itemTitle = this.props.item.companyName;
        itemEnName = this.props.item.companyNameEn;
    } else {
        itemTitle = this.props.item.resName;
    }
    return (
        <div>{(Com.hasRole(this.props.securityKeyWord, `${this.props.keyword}_update`, 'update',this.props.keyword) || Com.hasRole(this.props.securityKeyWord, `${this.props.keyword}_delete`, 'delete', this.props.keyword) || Com.hasRole(this.props.securityKeyWord, `${this.props.keyword}_add`, 'insert', this.props.keyword))?<Popover ref='Popovers' content={
                <div className='sildemenu'>
                {(Com.hasRole(this.props.securityKeyWord, `${this.props.keyword}_add`, 'insert', this.props.keyword) && itemEnName !== 'system2register' && itemEnName !== 'system2virtual') ? <Tooltip placement="top" title='新增'><span
                                        onClick={this.addmodel.bind(this,this.props.item)}><i
                                    className='iconfont icon-jiahao'></i></span></Tooltip>:''}
                {Com.hasRole(this.props.securityKeyWord, `${this.props.keyword}_update`, 'update', this.props.keyword) ?<Tooltip placement="top" title='编辑'><span
                                        onClick={this.editor.bind(this,this.props.item)}><i
                                    className='iconfont icon-xiugai07'></i></span></Tooltip>:''}
                {(Com.hasRole(this.props.securityKeyWord, `${this.props.keyword}_delete`, 'delete', this.props.keyword) && itemEnName !== 'system2register' && itemEnName !== 'system2virtual')?<Tooltip placement="top" title='删除'><span
                                    onClick={this.deleteR.bind(this, this.props.item)}>
                    <span><i
                        className='iconfont icon-shanchu'></i></span>
                </span></Tooltip>:''}
                </div>
            } title={false} trigger="hover" placement="right" onMouseEnter={this.onmouseenter.bind(this)} onMouseLeave={this.onmouseleave.bind(this)}>
            {this.props.searchValue?<p>{this.props.beforeStr}<i className="search-value" style={{color:'#9cd0a0'}}>{this.props.searchValue}</i>{this.props.afterStr}</p>:<Tooltip title={itemTitle}><p>{itemTitle}</p></Tooltip>}
        </Popover>:<Tooltip title={itemTitle}><p>{itemTitle}</p></Tooltip>}
           </div>
    );
  }
}
const mapStateprops = (state) => {
    const {scrollnum} = state.rightSideModel;
    return {
        scrollnum
    };
};
export default connect(mapStateprops, action)(RightPopover);
