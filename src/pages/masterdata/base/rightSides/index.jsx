import { Component } from 'react';
import { Tree, Input } from 'antd';
import RightPopover from './rightPopover.jsx';
import {action} from './model';
import {connect} from 'react-redux';
import _ from 'lodash';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
let dataList = [];
class SearchTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            showTreeData:[],
            closure:null
        };
    }
    onExpand(expandedKeys) {
        if(this.state.searchValue) {
            this.setState({
                expandedKeys,
                showTreeData:this.state.showTreeData,
                autoExpandParent: false
              });
        }else {
            this.setState({
                expandedKeys,
                showTreeData:this.props.TreeDatalist,
                autoExpandParent: false
              });
        }
      }
      datakey(data) {
          data.map((item) => {
              dataList.push(item.id);
              if(item.childrens) {
                  this.datakey(item.childrens);
              }
          });
      }
      onChange(e) {
        const value = e.target.value;
        const tree = _.cloneDeep(this.props.TreeDatalist);
        const newTree = this.searchTreeData(value, tree);
        this.datakey(newTree);
        if(value) {
            this.setState({
                searchValue:value,
                autoExpandParent: false,
                expandedKeys:dataList.map(String),
                showTreeData:newTree
            });
        }else {
            dataList = [];
            this.setState({
                searchValue:value,
                autoExpandParent: false,
                expandedKeys:[],
                showTreeData:this.props.TreeDatalist
              });
        }
        }
    add(record,e) {
        this.props.add(record,e);
    }
    deleteR(record,e) {
        this.props.deleteR(record,e);
    }
    editor(record,e) {
        this.props.editor(record,e);
    }
  renderTreeNodes(data, searchValue) {
    return data.map((item) => {
      const data = _.cloneDeep(item);
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      if(index > -1) {
        data.title = <RightPopover item={item} keyword={this.props.keyword} securityKeyWord={this.props.securityKeyWord} beforeStr={beforeStr} add={this.add.bind(this)} editor={this.editor.bind(this)} deleteR={this.deleteR.bind(this)} afterStr={afterStr} searchValue={searchValue}/>;
      }else {
        data.title = <RightPopover item={item} keyword={this.props.keyword} securityKeyWord={this.props.securityKeyWord} add={this.add.bind(this)} deleteR={this.deleteR.bind(this)} editor={this.editor.bind(this)}/>;
      }
      if (item.childrens) {
        return (
          <TreeNode {...data}>
            {this.renderTreeNodes(item.childrens, searchValue)}
          </TreeNode>
        );
      }
      return <TreeNode {...data}/>;
    });
  }
  searchTreeData(value, treeData) {
    const tree = _.cloneDeep(treeData);
    return tree.filter(item => {
      if(item.title.indexOf(value) > -1) {
        return true;
      }
      if(item.childrens) {
        item.childrens = this.searchTreeData(value, item.childrens);
        if(item.childrens.length > 0) {
          return true;
        }
        return false;
      }else {
        return false;
      }
    });
  }
  onSelect(vselectedKeys, {selected: bool, node}) {
  const { formChange } = this.props;
    formChange(node,bool);
  }
  onwheel() {
    this.props.getScroll(this.refs.wrap.scrollLeft);
  }
  render() {
    let data = [];
    const { searchValue, expandedKeys, showTreeData, autoExpandParent } = this.state;
    searchValue ? data = showTreeData : data=this.props.TreeDatalist;
    return (
      <div className="wrap-scroll">
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange.bind(this)} />
        <div className="wrap-scroll-con">
          <div className="wrap-scroll-con-tree" ref='wrap' onWheel={this.onwheel.bind(this)}>
            <Tree
              onExpand={this.onExpand.bind(this)}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onSelect={this.onSelect.bind(this)}
            >
              {this.renderTreeNodes(data,searchValue)}
            </Tree>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(null, action)(SearchTree);