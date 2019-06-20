import {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Base from './base/index.jsx';
import Land from "./land/index.jsx";
import Crop from "./crop/index.jsx";
import Grade from "./grade/index.jsx";
import Operations from "./operations/index.jsx";
import Category from "./category/index.jsx";
import Material from "./material/index.jsx";
import Period from "./period/index.jsx";
import Chargeunit from "./chargeunit/index.jsx";
import Temporarywages from "./temporarywages/index.jsx";
import Soultion from "./soultion/index.jsx";
import SoultionAdd from './soultion/add.jsx';
import Govermentaiddata from "./govermentaiddata/index.jsx";
import Cropyielddata from "./cropyielddata/index.jsx";
import Companyassetsdata from "./companyassetsdata/index.jsx";
import Help from "./help/index.jsx";
class MasterData extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div className='farming-admin'>
      <Switch>
        <Route path="/pages/masterdata/base" exact component={Base}/>
        <Route path="/pages/masterdata/land" exact component={Land}/>
        <Route path="/pages/masterdata/crop" exact component={Crop}/>
        <Route path="/pages/masterdata/grade" exact component={Grade}/>
        <Route path="/pages/masterdata/operations" exact component={Operations}/>
        <Route path="/pages/masterdata/category" exact component={Category}/>
        <Route path="/pages/masterdata/material" exact component={Material}/>
        <Route path="/pages/masterdata/period" exact component={Period}/>
        <Route path="/pages/masterdata/chargeunit" exact component={Chargeunit}/>
        <Route path="/pages/masterdata/temporarywages" exact component={Temporarywages}/>
          <Route path="/pages/masterdata/soultion" exact component={Soultion}/>
          <Route path="/pages/masterdata/soultion/one/:id/:type" exact component={SoultionAdd}/>
          <Route path="/pages/masterdata/cropyielddata" exact component={Cropyielddata}/>
          <Route path="/pages/masterdata/companyassetsdata" exact component={Companyassetsdata}/>
          <Route path="/pages/masterdata/govermentaiddata" exact component={Govermentaiddata}/>
          <Route path="/pages/masterdata/base/:id" component={Help}/>
        <Redirect path='/pages/masterdata' to="/pages/masterdata/base"/>
        <Redirect to="/404"/>
      </Switch>
    </div>);
  }
}

export default MasterData;