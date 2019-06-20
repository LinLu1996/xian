import {Component} from 'react';
import {TreeSelect} from 'antd';
import './index.less';
const TreeNode = TreeSelect.TreeNode;
//const Search = Input.Search;
class FormField extends Component {
  constructor(props) {
    super(props);
  }
  onChange(value,label, extra) {
    const { formChange } = this.props;
    formChange(value,label, extra);
  }
  onLoadData(node) {
    return new Promise((resolve) => {
      const { formLoadData } = this.props;
      formLoadData(node, resolve);
    });
  }
  formName(event) {
    const { formName } = this.props;
    formName(event.target.value);
  }
  renderTreeNodes (data) {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title}  value={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} value={item.title} dataRef={item}/>;
    });
  }
  render() {
    const {valueName, TreeD, keyword} = this.props;
    const list = [];
    if (TreeD && TreeD.length > 0) {
        /*let flag = false;
        TreeD.forEach((item) => {
            if (item.title === '全部') {
              flag = true;
            }
        });
        if (!flag) {
            list.push({id: -1,isLeaf: true,key: "-1-0",resName: "全部",title: "全部"});
        }*/
        TreeD.forEach((item) => {
            list.push(item);
        });
    }
    return (
      <div className='select-input'>
        {
         TreeD?<div className='treebox'>
            <TreeSelect
                value={valueName}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                loadData={this.onLoadData.bind(this)}
                onChange={this.onChange.bind(this)}
                placeholder={`请选择${keyword}`}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {this.renderTreeNodes(list)}
            </TreeSelect>
          </div>:''
        }
      </div>
    );
  }
}
export default FormField;

