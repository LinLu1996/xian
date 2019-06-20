import {Component} from 'react';
import {Route, Switch, Redirect } from 'react-router-dom';
import Homes from './index.jsx';
import {action} from '@/app/model';
import {connect} from 'react-redux';
import Header from '@/component/header/index.jsx';
class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { menuData } = this.props;
    const menuFlag = JSON.parse(sessionStorage.getItem('flag'));
    //const urlLogin = `/${localStorage.getItem('url')}/login`;
    const urlLogin = '/portal';
    return (
        <div className="content-body">
        {menuFlag?<Header data={menuData}/>:''}
          {
            menuFlag?<Switch>
              <Route path='/' component={Homes}/>
            </Switch>:<Redirect to={urlLogin} />
          }
       </div>
    );
  }
}
const mapstateProps=(state) => {
    const { menuData } = state.initReducer;
    return {
      menuData
    };
  };
  export default connect(mapstateProps,action)(Home);