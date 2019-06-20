import {Component} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import EarlyWarning from './earlywarning/index.jsx';
import EarlyWarningAdd from './earlywarning/add.jsx';
import WeatherHistory from './weatherhistory/index.jsx';
import RealtimeWeather from './realtimeweather/index.jsx';


class Page extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div className='farming-admin'>
      <Switch>
          <Route path="/pages/weather/realtimeweather" exact component={RealtimeWeather}/>
          <Route path="/pages/weather/earlywarning" exact component={EarlyWarning}/>
          <Route path="/pages/weather/earlywarning/add/:id/:type" exact component={EarlyWarningAdd}/>
          <Route path="/pages/weather/weatherhistory" exact component={WeatherHistory}/>
          <Redirect path="/pages/weather" to="/pages/weather/realtimeweather"/>
          <Redirect to="/404"/>
      </Switch></div>);
  }
}

export default Page;