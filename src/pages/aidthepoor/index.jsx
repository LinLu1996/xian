import {Component} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import FarmBenefitAnalysis from '../aidthepoor/farmerincomeanalysis/index.jsx';
import GovermentAidAnalysis from '../aidthepoor/govermentAidAnalysis/index.jsx';
import EnterprisePovertyAnalysis from "@/pages/aidthepoor/companyaidanalysis/index.jsx";

class Reportdatamgmt extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div className='farming-admin'>
            <Switch>
                <Route path="/pages/aidthepoor/govermentaidanalysis" exact component={GovermentAidAnalysis}/>
                <Route path="/pages/aidthepoor/farmerincomeanalysis" exact component={FarmBenefitAnalysis}/>
                <Route path="/pages/aidthepoor/companyaidanalysis" exact
                       component={EnterprisePovertyAnalysis}/>
                <Redirect path="/pages/aidthepoor" to="/pages/aidthepoor/farmerincomeanalysis"/>
                <Redirect  to="/404"/>
            </Switch></div>);
    }
}

export default Reportdatamgmt;