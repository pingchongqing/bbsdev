import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import ConfigBBS from '../config/ConfigBBS';
import * as bAction from '../actions';
var $ = require('jquery');
import { Link } from 'react-router';
import TransitionGroup from 'react-addons-transition-group';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isfreeze: props.isfreeze
    }
  }
  handleFreeze(e) {
    let ec = e.currentTarget;
    $.ajax({
      type: 'POST',
      url: ConfigBBS.Host+'/list/freeze',
      data: {
        topicid:this.props.topicid,
        isfreeze:this.state.isfreeze
      },
      success: function (data) {
        if(data.ok===1){
          this.setState({
            isfreeze: this.state.isfreeze===0?1:0
          });
        } else {
          console.log('冻结失败！');
        }
      }.bind(this)
    });
  }
  handleDel(e) {
    this.refs.confirm.className = 'confirm alert alert-danger alert-dismissable';
    this.refs.confirm.style.top = 0;
    this.refs.confirm.style.right = '10%';
  }
  handleAlertDismiss() {
    this.refs.confirm.className = 'hidden';
  }
  handleYes() {
    this.refs.yes.className = 'btn btn-danger deling';
    this.refs.yes.innerText = '正在删除';
    $.ajax({
      type: 'POST',
      url: ConfigBBS.Host+'/list/del',
      data: {
        _id: this.props.topicid
      },
      success: function (data) {
        console.log(data);
        if(data.ok===1&&data.n===1) {
          this.refs.yes.className = 'btn btn-success';
          this.refs.yes.innerText = '删除成功';
        }
      }.bind(this)
    });

  }
  render() {
    return (
      <div>
        <div className="admin">
          <a onClick={this.handleFreeze.bind(this)} className={this.state.isfreeze===0?'':'freeze'}>{this.state.isfreeze===0?'冻结':'解冻'}</a>
          <a onClick={this.handleDel.bind(this)}>删除</a>
        </div>
        <div
          ref="confirm"
          role="alert"
          className="hidden"
          >
          <h4>确定删除吗？</h4>
          <p>回复、点赞、评论等数据将同时删除,删除后无法恢复！</p>
          <p>
            <button
              ref="yes"
              type="button"
              className="btn btn-danger"
              onClick={this.handleYes.bind(this)}
              >　确定　</button>
            {' '}
            <button
              type="button"
              className="btn btn-default"
              onClick={this.handleAlertDismiss.bind(this)}
            >取消</button>
          </p>
        </div>
      </div>
    )
  }
}

class Lastcom extends Component {
  constructor(props) {
      super(props);
  }
  render() {
    if(this.props.dt){
      return (
        <span className="upline">
          <img src={ConfigBBS.getUser(this.props.dt.user).avatar?ConfigBBS.getUser(this.props.dt.user).avatar:''} />
          <Link to={ {pathname: '/uc', query:{userid:this.props.dt.userid}} }>
            {ConfigBBS.getUser(this.props.dt.user).name?ConfigBBS.getUser(this.props.dt.user).name:''}
          </Link>
          {this.props.dt.updated?'，'+ConfigBBS.formatDate(this.props.dt.updated):''}
        </span>
      )
    } else {
      return (
        <span>
          {this.props.dt}
        </span>
      )
    }
  }
}

class Tcls extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    switch (this.props.data) {
      case '见闻':
        return (
          <span className="fenxiang"><span className="glyphicon glyphicon-tag"></span>{this.props.data}</span>
        );
        break;
      case '交流':
        return (
          <span className="jiaoliu"><span className="glyphicon glyphicon-tag"></span>{this.props.data}</span>
        );
        break;
      case '集市':
        return (
          <span className="jiaoyi"><span className="glyphicon glyphicon-tag"></span>{this.props.data}</span>
        );
        break;
        case '其他':
          return (
            <span className="qita"><span className="glyphicon glyphicon-tag"></span>{this.props.data}</span>
          );
          break;
      default:
        return (
          <span><span className="glyphicon glyphicon-tag"></span>{this.props.data}</span>
        );
    }
    return (
      <span><span className="glyphicon glyphicon-tag"></span>{this.props.data}</span>
    )
  }
}

class DepartMent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dep:{}
    }
  }
  componentDidMount() {
    var dp = this.state.dep;
    if(this.props.d[0]!==1) {
      $.ajax({
        type: 'POST',
        url: ConfigBBS.Host+'/department',
        data: {id: this.props.d[0]},
        success: function (data) {
          dp[this.props._id] = data;
          this.setState(dp)
        }.bind(this)
      });
    } else {
      dp[this.props._id] = '中控集团';
      this.setState(dp)
    }

  }
  componentWillUnmount() {
    $(document).unbind();
  }
  render() {
    return (
      <p>
        {this.state.dep[this.props._id]}
      </p>
    )
  }

}

class TopicList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listdata: [],
      page: 1
    }
  }
  getListdataFromServer() {
    $.ajax({
      type: 'GET',
      url: ConfigBBS.Host+this.props.url+this.props.tcls,
      data: {
        page: this.state.page,
        limit: ConfigBBS.pageLimit,
        se: this.props.se
      },
      success: function (data) {
        if(this.refs.loadpage) {
          this.refs.loadpage.className='hidden';
        }
        this.setState({listdata: data});
        if(data.length<ConfigBBS.pageLimit*this.state.page) {
            this.refs.loaddone.className='loaddone';
          }
        /*data.map(function(c){
          let k = _.findIndex(this.state.listdata, function(chr) {
              return chr._id == c._id;
            });
          if(k !== -1) {
            _.fill(this.state.listdata, c, k, k+1);
          }
          else {
            this.state.listdata.push(c);
          }
          this.state.listdata
          .sort(function(a, b){
            if(a.updated&&b.updated) {
              return Date.parse(new Date(b.updated))-Date.parse(new Date(a.updated));
            }
          })
          .sort(function(a, b) {
            if(a.lastcomment&&b.lastcomment) {
              if(a.lastcomment.created&&b.lastcomment.created) {
                return Date.parse(new Date(b.lastcomment.created))-Date.parse(new Date(a.lastcomment.created));
              }
            }
          });
          this.setState({listdata: this.state.listdata});
        }.bind(this));
        */

      }.bind(this)
    });
  }
  componentDidMount() {
    this.getListdataFromServer();
    this.interval = setInterval(function(){
      this.getListdataFromServer();
    }.bind(this), this.props.pollInterval);
    $(document).scroll(this.handleScroll.bind(this));
    this.props.handleCheck(ConfigBBS.getUser(this.props.user).errcode);

  }
  componentWillUnmount() {
    clearInterval(this.interval);
    $(document).unbind();
  }
  handleScroll() {
    var scrollTop = $("body").scrollTop();
　　var scrollHeight = $(document).height();
　　var windowHeight = $(window).height();
    var xheight = scrollHeight - windowHeight - scrollTop;
　　if(xheight==0){
　　　this.setState({page:this.state.page+1});
      this.refs.loadpage.className='subcontent';
　　}
  }
  handleActive(e) {
    var c = this.refs.tabul.children;
    for(let i=0; i<c.length; i++) {
      c[i].className = '';
    }
    e.currentTarget.className = 'active';
  }



  render() {
    var items =
      this.state.listdata.map(function(list){
        let info = eval('('+list.user.replace(/j\:/,'')+')');
        return (
          <div className="topic-cont" key={list._id} >
            <div className="title" data={list._id} onClick={this.props.handleClick.bind(this)} >
              <Link to={{ pathname: '/topic', query: { _id: list._id } }}>
                {list.title}
              </Link>
            </div>
            <p>
              <Tcls data={list.tcls} />
              <span><span className="glyphicon glyphicon-time"></span>{ConfigBBS.formatDate(list.created)}</span>
            </p>
            <div className="info-cont">

              <div className="info">
                <img
                  src={info.avatar}
                  className="img-circle"
                   />
                <p>
                  <Link to={ {pathname: '/uc', query:{userid:info.userid}} }>
                    {info.name}
                  </Link>
                </p>
                <DepartMent
                  _id={list._id}
                  d = {info.department}
                 />
              </div>
              <div className="num text-center">{list.num}/{list.relaynum}</div>
              <div className="clear"></div>
            </div>
            <div className="update-time">
            {list.lastcomment?'最近回复：':''}
            <Lastcom dt={list.lastcomment?list.lastcomment:''} />
            </div>
            {
              function(){
                let k = _.findIndex(ConfigBBS.getUser(this.props.admin), (chr) => {
                  return chr.userid == ConfigBBS.getUser(this.props.user).userid;
                });
                if(k > -1) {
                  return (
                    <Admin
                      topicid={list._id}
                      isfreeze={list.isfreeze?list.isfreeze:0}
                    />
                  )
                }
              }.bind(this)()
            }
            {
              function(){
                if(list.isfreeze==1) {
                  return (
                    <div className="befreeze">被冻结</div>
                  )
                }
              }.bind(this)()
            }
            <div className="forclick" data={list._id} onClick={this.props.handleClick.bind(this)}></div>
          </div>
        )
      }.bind(this) );
      if(ConfigBBS.getUser(this.props.user).errcode===1) {
        return (
          <div className="topic-freeze" style={{height: (window.innerHeight-130)}} >
            <div className="fcont">
              <div className="cry" ></div>
              <div className="ftxt" >
                <h4>出错啦!</h4>
                <p>请从微信客户端登陆！</p>
              </div>
              <div className="clear"></div>
            </div>
          </div>
        )
      } else {
        return (
          <div className="topic-list">
            <ul className="nav nav-tabs" role="tablist" ref="tabul">
              <li role="presentation" className="active" onClick={this.handleActive.bind(this)}>
                <Link to={{ pathname: this.props.pathname , query: { search:this.props.se } }}>
                  全部
                </Link>
              </li>
              <li role="presentation" onClick={this.handleActive.bind(this)}>
                <Link to={{ pathname: this.props.pathname , query: { search:this.props.se, tcls: '交流' } }}>
                  交流
                </Link>
              </li>
              <li role="presentation" onClick={this.handleActive.bind(this)}>
                <Link to={{ pathname: this.props.pathname , query: { search:this.props.se, tcls: '见闻' } }}>
                  见闻
                </Link>
              </li>
              <li role="presentation" onClick={this.handleActive.bind(this)}>
                <Link to={{ pathname: this.props.pathname , query: { search:this.props.se, tcls: '集市' } }}>
                  集市
                </Link>
              </li>
              <li role="presentation" onClick={this.handleActive.bind(this)}>
              <Link to={{ pathname: this.props.pathname , query: { search:this.props.se, tcls: '其他' } }}>
                其他
              </Link>
              </li>
            </ul>
            <div className="table-list">
              <ReactCSSTransitionGroup
                transitionName="example"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}>
                {items}
              </ReactCSSTransitionGroup>
            <div ref="loadpage" className="subcontent">
              <img src="/public/images/uploading.jpg" />
              <p>请稍候...</p>
            </div>
            <div ref="loaddone" className="hidden">
              <p className="text-center">所有数据加载完成</p>
            </div>
          </div>
        </div>
        );
      }

  }
}


function mapStateToProps(state) {
  return {
    user: state.user,
    admin: state.admin
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(bAction, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(TopicList);
