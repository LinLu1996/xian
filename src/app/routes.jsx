import {Component} from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { combineReducers, createStore, applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import {action} from './model';
import {connect} from 'react-redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import Home from '@/home/homerouter.jsx';
import Pages from '@/pages/index.jsx';
import Login from '@/login/index.jsx';
import Portal from '@/loginStart/index.jsx';
import UndefinedPage from '@/error/404/index.jsx';
import Register from '@/register/index.jsx';
import UserRegister from '@/register/user.jsx';
import CompanyRegister from '@/register/company.jsx';

const todos = combineReducers(reducers.assemble);
const store = createStore(todos, applyMiddleware(thunk));
class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact component={Home}/>
          <Route path='/pages' component={Pages}/>
          <Route path='/:id/login' exact component={Login}/>
          <Route path='/Portal' exact component={Portal}/>
            <Route path='/register' exact component={Register}/>
            <Route path='/user/register' exact component={UserRegister}/>
            <Route path='/company/register' exact component={CompanyRegister}/>
            <Route path='/404' exact component={UndefinedPage}/>
          <Redirect to="/404" />
        </Switch>
      </Router>);
  }
}
const Apps = connect(null, action)(App);
export default <Provider store={store}><Apps /></Provider>;