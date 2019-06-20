import './index.less';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';
import { IO, context } from '@/app/io';
import LeftTree from './leftTree.jsx';
import RightTree from './rightTree.jsx';
import _ from 'lodash';

const TreeNode = Tree.TreeNode;
const searchTreeData = (value, treeData) => {
  const tree = _.cloneDeep(treeData);
  return tree.filter(item => {
    if(item.title.indexOf(value) > -1) {
      return true;
    }
    if(item.childrens) {
      item.childrens = searchTreeData(value, item.childrens);
      if(item.childrens.length > 0) {
        return true;
      }
      return false;
    }else {
      return false;
    }

  });
};

class TransferTree extends Component {
  constructor(props) {
    super(props);
    const existedIds = (props.existedIds || []).map(item => item.toString());
    this.state = {
      treeData: [],
      leftCheckedIds: [],
      rightCheckedIds: [],
      resultIds: existedIds
    };
  }
  componentDidMount() {
    const me = this;
    const {asyncUrl, fit, asyncParams} = me.props;
    context.create('getTree', {
      data: asyncUrl
    });
    IO.getTree.data(asyncParams || {}).then((res) => {
      const data = fit ? fit(res.data) : res.data;
      me.setState({
        treeData: data
      });
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.existedIds !== nextProps.existedIds) {
      this.setState({
        resultIds: nextProps.existedIds
      });
    }
  }
  //父组件直接
  getCheckedData() {
    return {
      tree: this.rightTree.idsToTree(this.state.resultIds, this.state.treeData),
      resultIds: this.state.resultIds
    };
  }
  renderTreeNodes(data, searchValue) {
    return data.map((item) => {
      const data = _.cloneDeep(item);
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      if(index > -1) {
        data.title = <span>
          {beforeStr}
          <i className="search-value">{searchValue}</i>
          {afterStr}
        </span>;
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
  addHandle() {
    this.setState({
      resultIds:_.uniq(this.state.resultIds.concat(this.state.leftCheckedIds)),
      leftCheckedIds: []
    });
  }
  delHandle() {
    const delIds = this.state.rightCheckedIds;
    const resultIds = _.cloneDeep(this.state.resultIds);
    this.setState({
      resultIds: resultIds.filter(id => {
        if(delIds.indexOf(id) > -1) {
          return false;
        }
        return true;
      }),
      rightCheckedIds: []
    });
  }
  onLeftCheck(checked) {
    this.setState({
      leftCheckedIds: checked
    });
  }
  onRightCheck(checked) {
    this.setState({
      rightCheckedIds: checked
    });
  }
  render() {
    const me = this;
    const {treeData, resultIds, leftCheckedIds, rightCheckedIds} = me.state;
    const { className, treeOption={} } = me.props;
    const leftOpt = {
      parentClass: me,
      treeData: treeData,
      resultIds: resultIds,
      searchTreeData,
      option: treeOption.left || {},
      checkedIds: rightCheckedIds,
      onCheck: me.onLeftCheck.bind(me),
      renderTreeNodes: me.renderTreeNodes.bind(me),
      ref: self => {me.leftTree = self;}
    };
    const rightOpt = {
      parentClass: me,
      treeData: treeData,
      resultIds: resultIds,
      searchTreeData,
      option: treeOption.right || {},
      checkedIds: leftCheckedIds,
      onCheck: me.onRightCheck.bind(me),
      renderTreeNodes: me.renderTreeNodes.bind(me),
      ref: self => {me.rightTree = self;}
    };
    return (<div className={`${className || ''} transfer-tree`}>
      {treeData.length > 0 && <LeftTree {...leftOpt} />}
      <div className="transfer-tree-center">
        <a onClick={me.addHandle.bind(me)}><i className='iconfont icon-jiantou-copy-copy'></i></a>
        <a className='second' onClick={me.delHandle.bind(me)}><i className='iconfont icon-jiantou-copy-copy'></i></a>
      </div>
      {treeData.length > 0 && <RightTree {...rightOpt} />}
    </div>);
  }
}

TransferTree.propTypes = {
  className: PropTypes.string,//修改组件样式
  asyncUrl: PropTypes.shape({//接口地址
    mockUrl: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }),
  asyncParams: PropTypes.object,//接口入参
  treeOption: PropTypes.shape({//树配置
    left: PropTypes.shape({//左侧树配置
      draggable: PropTypes.bool,//树节点是否可拖拽，默认false
      search: PropTypes.shape({
        visible:PropTypes.bool,//树是否可搜索，默认true
        placeholder: PropTypes.string //默认"search"
      }),
      defaultExpandAll: PropTypes.bool//树是否默认全部展开，默认true
    }),
    right: PropTypes.object//右侧树配置,同左侧
  }),
  existedIds: PropTypes.array,//默认选择的数据
  fit: PropTypes.func
  /*  格式化接口返回数据，现在必须有2个参数
      @param title 显示的名称
      @param key 树节点id
      例：
    fit: (data) => {     /////////////// data 为 response.data
      return data.map(item => {
        if(item.childrens) {
          item.childrens = treedata(item.childrens);
        }
        item.title = item.resName;
        item.key = item.id.toString();
        item.selectable = false;
        return item;
      });
    }
   */
};

export default TransferTree;