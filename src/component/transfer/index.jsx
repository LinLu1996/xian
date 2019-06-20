import './index.less';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';
import { IO, context } from '@/app/io';
import Com from "@/component/common";
import _ from "lodash";
import CheckboxGroup from './checkboxGroup.jsx';

const TreeNode = Tree.TreeNode;

class TransferTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      checkedKeys: [],
      checkedNodes: [],
      halfCheckedNodes: []
    };
  }
  componentDidMount() {
    this.getData(-1, {
      props: {
        eventKey: 0
      }
    });
  }
  getCheckedData() {
    return this.group.state.checkedDatas;
  }
  getData(id, treeNode, resolve) {
    const me = this;
    const {treeData, checkedKeys, checkedNodes} = me.state;
    const {async, fit, roleId} = me.props;
    context.create('getTree', {
      data: async
    });
    IO.getTree.data({
      id: id,
      roleId: roleId
    }).then((res) => {
      const rows = fit ? fit(res.data) : res.data;
      const data = rows.map((item) => {
        const isLeaf = item.leaf !== 0;
        return _.assign({}, item, {
          key: `${treeNode.props.eventKey}-${item.id}`,
          isLeaf: isLeaf,
          selectable: false
        });
      });
      if(resolve) {
        treeNode.props.dataRef.children = data;
        const newCheckedKeys = [];
        const newCheckedNodes = [];
        if(treeNode.props.checked) {
          data.map(item => {
            newCheckedKeys.push(item.key);
            newCheckedNodes.push({
              id: item.id,
              key: item.key,
              title: item.title
            });
          });
        }
        me.setState({
          treeData: [...treeData],
          checkedKeys: checkedKeys.concat(newCheckedKeys),
          checkedNodes: checkedNodes.concat(newCheckedNodes)
        });
        resolve();
      } else {
        me.setState({
          treeData: data
        });
      }
    }).catch(Com.errorCatch);
  }
  getHalfCheckedNodes(key) {
    const treeData = this.state.treeData;
    let node = {};
    const loop = (data) => {
      data.map(item => {
        if(item.key === key) {
          node = item;
          return;
        }else if(item.children) {
          loop(item.children);
        }
      });
    };
    loop(treeData);
    return node;
  }
  onCheck(checkedKeys, props) {
    const halfCheckedKeys = props.halfCheckedKeys;
    const halfCheckedNodes = halfCheckedKeys.map(item => {
      return this.getHalfCheckedNodes(item);
    });
    this.setState({
      checkedKeys,
      halfCheckedNodes,
      checkedNodes: props.checkedNodes.map((item) => {
        return {
          id: item.props.id,
          key: item.key,
          title: item.props.title
        };
      })
    });
  }
  onLoadData(treeNode) {
    const me = this;
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      me.getData(treeNode.props.id, treeNode, resolve);
    });
  }
  renderTreeNodes(data) {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode {...item} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });
  }
  addHandle() {
    this.group.add();
  }
  delHandle() {
    this.group.del();
  }
  render() {
    const me = this;
    const {treeData, checkedKeys, checkedNodes, halfCheckedNodes} = me.state;
    const {className, treeProps, type ,checkedDatas=[]} = me.props;
    const option = _.assign({}, {
      checkable: true,
      checkedKeys,
      loadData: me.onLoadData.bind(me),
      onCheck: me.onCheck.bind(me)
    }, (treeProps || {}));
    const checkboxOpt = {
      checkedNodes,
      type,
      checkedDatas,
      halfCheckedNodes,
      ref: (self) => {this.group = self;}
    };
    return (<div className={`${className || ''} transfer-tree`}>
      <div className="transfer-tree-left">
        <Tree {...option} >
          {this.renderTreeNodes(treeData)}
        </Tree>
      </div>
      <div className="transfer-tree-center">
        <a onClick={me.addHandle.bind(me)}><i className='iconfont icon-jiantou-copy-copy'></i></a>
        <a className='second' onClick={me.delHandle.bind(me)}><i className='iconfont icon-jiantou-copy-copy'></i></a>
      </div>
      <div className="transfer-tree-right">
        <CheckboxGroup {...checkboxOpt} />
      </div>
    </div>);
  }
}

TransferTree.propTypes = {
  className: PropTypes.string,//修改组件样式
  type: PropTypes.string,//组件数据模式，默认tree格式，另有resource和organize模式
  async: PropTypes.shape({//接口地址
    mockUrl: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }),
  checkedDatas: PropTypes.array,//默认选择的数据（树节点暂时不能默认选中）
  fit: PropTypes.func
  /*  格式化接口返回数据，现在必须有2个参数
      @param title 显示的名称
      @param leaf 判断是否是叶子节点，如果是为1不是为0
      例：
    fit: (data) => {     /////////////// data 为 response.data.rows
      return data.map(item => {
        item.title = item.xxx;
        item.leaf = item.xxx;
      });
    }
   */
};

export default TransferTree;