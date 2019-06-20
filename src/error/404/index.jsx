import './index.less';
import {Component} from 'react';

class UndefinedPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div className="undefined-page-bg">
      <a className="button" href="/">返回首页</a>
    </div>;
  }
}
export default UndefinedPage;