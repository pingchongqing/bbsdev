import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';

import MySupcon from '../components/MySupcon.jsx'; //首页组件
import Uc from '../components/Uc.jsx'; //个人中心
import CreatTopic from '../components/CreatTopic.jsx';  //发布主题
import Topic from '../components/Topic.jsx';  //主题详情
import Search from '../components/Search.jsx';  //搜索

/**
 * (路由根目录组件，显示当前符合条件的组件)
 *
 * @class Roots
 * @extends {Component}
 */
class Roots extends Component {

  constructor(props){
    super(props);
    //console.log(this.props.children);
  }
    render() {
        return (
            <div>{this.props.children}</div>
        );
    }
}
var history = window.APP_ENV == 'html5plus' ? hashHistory : browserHistory;
const RouteConfig = (
    <Router history={browserHistory}>
        <Route path="/" component={Roots}>
            <IndexRoute component={MySupcon} />
            <Route path="/bbs" component={MySupcon} />
            <Route path="/uc" component={Uc} />
            <Route path="/creat" component={CreatTopic} />
            <Route path="/topic" component={Topic} />
            <Route path="/search" component={Search} />
        </Route>
    </Router>
);

export default RouteConfig;
