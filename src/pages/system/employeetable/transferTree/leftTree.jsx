import { Component } from 'react';
import _ from 'lodash';
import { Tree, Input } from 'antd';
import Com from '@/component/common';
const Search = Input.Search;

//子节点是否全部选中
const stayAllChecked = (ids, treeData) => {
  let flag = true;
  const loop = (tree) => {
    tree.forEach(item => {
      if (ids.indexOf(item.id.toString()) < 0) {
        flag = false;
        return;
      }else if(item.childrens) {
        loop(item.childrens);
      }
    });
  };
  loop(treeData);
  return flag;
};
//找出checked里面halfChecked的id,如果有返回true,没有返回false
const findHalfChecked = (ids, treeData=[]) => {
  let flag = false;
  const loop = (tree) => {
    tree.forEach(item => {
      if (ids.indexOf(item.id.toString()) > -1) {
        flag = !stayAllChecked(ids, tree);
        return;
      }else if (item.childrens) {
        loop(item.childrens);
      }
    });
  };
  loop(treeData);
  return flag;
};
const leftCheckedIds = (ids, treeData=[]) => {
  const data = _.cloneDeep(treeData);
  return ids.filter(id => {
    let flag = true;
    const loop = (tree) => {
      tree.forEach(item => {
        if (item.childrens) {
          if (id === item.id.toString()) {
            flag = !findHalfChecked(ids, item.childrens);
          }
          loop(item.childrens);
        }
      });
    };
    loop(data);
    return flag;
  });
};
//在所有资源里面去除已选中资源部分，剩余未选资源在左侧展示
const leftTree = (ids, treeData=[]) => {
  const data = _.cloneDeep(treeData);
  return data.filter(item => {
    if (item.childrens) {
      item.childrens = leftTree(ids, item.childrens);
    }
    return ids.indexOf(item.id.toString()) < 0;
  });
};
class LeftTree extends Component {
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
  onCheck(checkedKeys, props) {
    this.props.onCheck(_.uniq(checkedKeys.concat(props.halfCheckedKeys)));
  }
  onDrop(e) {
    if (this.props.checkedIds.length > 0 && Com.closest(e.event.target, ".transfer-tree-left")) {
      this.props.parentClass.delHandle();
    }
  }
  render() {
    const me = this;
    const { search, showTreeData } = me.state;
    const { treeData, resultIds, renderTreeNodes, option } = me.props;
    const draggable = option.draggable || false;
    const {visible=true, placeholder="search"} = option.search || {};
    const defaultExpandAll = option.defaultExpandAll || (option.defaultExpandAll === undefined);
    const treeOption = {
      checkable: true,
      defaultExpandAll: defaultExpandAll,
      onCheck: me.onCheck.bind(me),
      draggable: draggable,
      onDrop: me.onDrop.bind(me)
    };
    return <div className="transfer-tree-left">
      {visible && <Search placeholder={placeholder} onChange={me.search.bind(me)} />}
      <div className="tree-data">
        <Tree {...treeOption}>
          {renderTreeNodes(leftTree(leftCheckedIds(resultIds, treeData), showTreeData), search)}
        </Tree>
      </div>
    </div>;
  }
}

export default LeftTree;