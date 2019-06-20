import {Component} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import KnowledgeManagement from './KnowledgeManagement/index.jsx';
import AddKnowledge from './KnowledgeManagement/addKnowledge.jsx';
import DetailKnowledge from './KnowledgeManagement/detail.jsx';

class Knowledgebase extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div className='farming-admin'>
      <Switch>
      <Route path="/pages/knowledgebase/knowledgeManagement" exact component={KnowledgeManagement}/>
      <Route path="/pages/knowledgebase/detail/:id" exact component={DetailKnowledge}/>
      <Route path="/pages/knowledgebase/:type/:id" exact component={AddKnowledge}/>
      <Redirect path="/pages/knowledgebase" to="/pages/knowledgebase/knowledgeManagement"/>
      <Redirect to="/404"/>
      </Switch></div>);
  }
}

export default Knowledgebase;