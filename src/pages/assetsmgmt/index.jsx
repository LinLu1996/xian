import {Component} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import YieldanAlysis from './yieldanalysis/index.jsx';
import AssetSoverView from './assetsoverview/index.jsx';
import Materialcostanalysis from "./materialcostanalysis/index.jsx";
import Temporarycostanalysis from "./temporarycostanalysis/index.jsx";

class Page extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div className='farming-admin'>
      <Switch>
          <Route path="/pages/assetsmgmt/yieldanalysis" exact component={YieldanAlysis}/>
          <Route path="/pages/assetsmgmt/assetsoverview" exact component={AssetSoverView}/>
          <Route path="/pages/assetsmgmt/materialcostanalysis" exact component={Materialcostanalysis}/>
          <Route path="/pages/assetsmgmt/temporarycostanalysis" exact component={Temporarycostanalysis}/>
          <Redirect path="/pages/assetsmgmt" to="/pages/assetsmgmt/assetsoverview"/>
          <Redirect to="/404"/>
      </Switch></div>);
  }
}

export default Page;