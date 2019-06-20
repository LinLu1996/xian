import {Component} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import TaskList from './tasklist/index.jsx';
import ProcurementPlan from './procurementplan/index.jsx';
import FarmingPlan from './farmingplan/index.jsx';
import FarmingPlanCreate from './farmingplan/create.jsx';
import FarmingPlanDetail from './farmingplan/planDetail.jsx';
import BatchTracing from './batchtracing/index.jsx';
import NniqueCode from './batchtracing/uniqueCode.jsx';
import ProcurementPlanDetail from './procurementplan/detailIndex.jsx';
import Farmoverview from './farmoverview/analyzeCommon.jsx';
import TaskCalendar from './taskcalendar/index.jsx';

class Page extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div className='farming-admin'>
      <Switch>
          <Route path="/pages/plantingmgmt/farmingplan" exact component={FarmingPlan}/>
          <Route path="/pages/plantingmgmt/farmingplan/create" exact component={FarmingPlanCreate}/>
          <Route path="/pages/plantingmgmt/farmingplan/detail/:id/:type" exact component={FarmingPlanDetail}/>
          <Route path="/pages/plantingmgmt/tasklist" exact component={TaskList}/>
          <Route path="/pages/plantingmgmt/taskcalendar" exact component={TaskCalendar}/>
          <Route path="/pages/plantingmgmt/procurementplan" exact component={ProcurementPlan}/>
          <Route path="/pages/plantingmgmt/procurementplan/:index" exact component={ProcurementPlan}/>
          <Route path="/pages/plantingmgmt/procurementplan/detail/:category/:id" exact component={ProcurementPlanDetail}/>
          <Route path="/pages/plantingmgmt/batchtracing" exact component={BatchTracing}/>
          <Route path="/pages/plantingmgmt/batchtracing/uniqueCode/:code" exact component={NniqueCode}/>
          <Route path="/pages/plantingmgmt/farmoverview" exact component={Farmoverview}/>
          <Redirect path="/pages/plantingmgmt" to="/pages/plantingmgmt/farmingplan"/>
          <Redirect to="/404"/>
      </Switch></div>);
  }
}

export default Page;