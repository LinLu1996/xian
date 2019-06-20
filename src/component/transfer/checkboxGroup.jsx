import './index.less';
import { Component } from 'react';
import { Checkbox } from 'antd';
import _ from 'lodash';
const CheckboxGroup = Checkbox.Group;

class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedDatas: [],
      checkedValues: []
    };
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.checkedDatas !== nextProps.checkedDatas) {
      this.setState({
        checkedDatas: this.state.checkedDatas.concat(nextProps.checkedDatas)
      });
    }
  }
  changeCheckedKeys(checkedValues) {
    this.setState({
      checkedValues
    });
  }
  resourceRule(checkedNodes) {
    const { halfCheckedNodes } = this.props;
    return checkedNodes.concat(halfCheckedNodes);
  }
  organizeRule(checkedNodes) {
    const checkedDatas = _.assign([],checkedNodes);
    checkedNodes.map((item) => {
      const key = item.key;
      _.remove(checkedDatas, (n) => {
        const filterRule = new RegExp(`^(${key}).`);
        return n.key.match(filterRule);
      });
    });
    return checkedDatas;
  }
  removeSame(datas, name) {
    const hash = {};
    return datas.reduce((item, next) => {
      hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
      return item;
    }, []);
  }
  add() {
    const {state, props, removeSame} = this;
    const { checkedDatas } = state;
    const { type, checkedNodes} = props;
    let addDatas = checkedNodes;
    switch (type) {
      case 'resource':
        addDatas = this.resourceRule(checkedNodes);
        break;
      case 'organize':
        addDatas = this.organizeRule(checkedNodes);
        break;
    }
    this.setState({
      checkedDatas: removeSame(_.concat(checkedDatas, addDatas), 'key')
    });
  }
  del() {
    const me = this;
    const {checkedValues, checkedDatas} = me.state;
    const {type} = me.props;
    const newDatas = _.assign([],checkedDatas);
    _.remove(newDatas, (n) => {
      if(type === 'resource') {
        checkedValues.map(item => {
          if(n.key.match(`${item}-`)) {
            checkedValues.push(n.key);
          }
        });
      }
      return checkedValues.indexOf(n.key) > -1;
    });
    me.setState({
      checkedDatas: newDatas
    });
  }
  render() {
    const me = this;
    const {checkedDatas} = me.state;
    return <CheckboxGroup options={checkedDatas.map((item) => {
      return {
        label: item.title,
        value: item.key
      };
    })} onChange={me.changeCheckedKeys.bind(me)} />;
  }
}

export default Group;