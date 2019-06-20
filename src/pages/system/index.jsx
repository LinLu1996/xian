import {Component} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Resources from './resources/index.jsx';
import Company from './company/index.jsx';
import Role from './role/index.jsx';
import EmployeeTable from './employeetable/index.jsx';
import Detail from './employeetable/detail/index.jsx';
import Account from './account/index.jsx';
import Node from './node/index.jsx';
import Examine from './examine/index.jsx';
import Enterprise from './enterprise/index.jsx';
import {connect} from 'react-redux';
import {action} from './model';
class Page extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.listAll();
  }
  render() {
    return (
      <div className='system'>
          <div className='conentBox'>
            <Switch>
              <Route path="/pages/system/resources" exact component={Resources}/>
              <Route path='/pages/system/company' exact component={Company}/>
              <Route path="/pages/system/employee" exact component={EmployeeTable}/>
              <Route path='/pages/system/employee/:number' component={Detail}/>
              <Route path='/pages/system/employee/user/:number' component={Detail}/>
              <Route path="/pages/system/role" exact component={Role}/>
              <Route path="/pages/system/account" exact component={Account}/>
                <Route path="/pages/system/node" exact component={Node}/>
                <Route path="/pages/system/examine" exact component={Examine}/>
                <Route path="/pages/system/enterprise" exact component={Enterprise}/>
              <Redirect path='/pages/system' to="/pages/system/company"/>
              <Redirect to="/404"/>
            </Switch>
          </div>
      </div>
    );
  }
}
export default connect(null, action )(Page);
