import { Component } from 'react';
import _ from 'lodash';
import { Tree, Input } from 'antd';
import Com from '@/component/common';
const Search = Input.Search;

class RightTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      showTreeData: props.treeData
    };
  }
  search(e) {
    const value = e.target.value;
    const tree = _.cloneDeep(this.props.treeData);
    const newTree = this.props.searchTreeData(value, tree);
    this.setState({
      showTreeData: newTree,
      search: value
    });
  }
  idsToTree(ids, treeData=[]) {
    const data = _.cloneDeep(treeData);
    return data.filter(item => {
      if (item.childrens) {
        item.childrens = this.idsToTree(ids, item.childrens);
        if(item.childrens.length > 0) return true;
      }
      return ids.indexOf(item.id.toString()) > -1;
    });
  }
  onCheck(checkedKeys) {
    this.props.onCheck(_.uniq(checkedKeys));
  }
  onDrop(e) {
    if (this.props.checkedIds.length > 0 && Com.closest(e.event.target, ".transfer-tree-right")) {
      this.props.parentClass.addHandle();
    }
  }
  render() {
    const me = this;
    const { search, showTreeData } = me.state;
    const { resultIds, renderTreeNodes, option } = me.props;
    const draggable = option.draggable || false;
    const {visible=true, placeholder="search"} = option.search || {};
    const defaultExpandAll = option.defaultExpandAll || true;
    const treeOption = {
      checkable: true,
      defaultExpandAll: defaultExpandAll,
      onCheck: me.onCheck.bind(me),
      draggable: draggable,
      onDrop: me.onDrop.bind(me)
    };
    return <div className="transfer-tree-right">
      {visible && <Search placeholder={placeholder} onChange={me.search.bind(me)} />}
      <div className="tree-data">
        <Tree {...treeOption} >
          {renderTreeNodes(me.idsToTree(resultIds, showTreeData), search)}
        </Tree>
      </div>
    </div>;
  }
}

export default RightTree;