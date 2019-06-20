import 'nprogress/nprogress.css';
import './app.less';
import NProgress from 'nprogress';
import { render } from 'react-dom';
import Routes from './routes.jsx';

NProgress.start();
window.onload = () => {
  NProgress.done();
};
document.title = "ET农业大脑";
render(Routes, document.getElementById('App'));