import { Component } from 'react';
import { Select } from 'antd';
import './index.less';
const Option = Select.Option;
class Selecttit extends Component {
  constructor(props) {
    super(props);
  }
  handleChange(label,value) {
    this.props.handleChange(label,value);
  }
  render() {
    const { selectdata } = this.props;
    return (
        <div className='selectbox'>
          {
            selectdata.map((item,i) => {
              return <div key={i} className='select'>
                <span className='label'>{item.label}</span>
                <Select label='地址' defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange.bind(this,item.label)}>
                  {
                    item.opt.map((text) => {
                      return  <Option  key={text} value={text}>{text}</Option>;
                    })
                  }
                </Select></div>;
            })
          }
      </div>);
  }
}
export default Selecttit;