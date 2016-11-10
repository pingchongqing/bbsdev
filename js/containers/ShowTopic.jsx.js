import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ConfigBBS from '../config/ConfigBBS';
import * as bAction from '../actions';
var $ = require('jquery');
import MyEditor from './Editor.jsx';


class Relay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      relay: [],
      comment: ''
    }
  }
  getRelaydataFromServer() {
    $.ajax({
      type: 'GET',
      url: ConfigBBS.Host+this.props.url,
      success: function (data) {
        this.setState({relay: data});
      }.bind(this)
    });
  }
  componentDidMount() {
    this.getRelaydataFromServer();
    this.interval = setInterval(function(){
      this.getRelaydataFromServer();
    }.bind(this), this.props.pollInterval);

  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  handleLike(e) {
    if(e.target.attributes["class"].value=='glyphicon glyphicon-heart') {
      e.target.attributes["class"].value = 'glyphicon glyphicon-heart-empty';
    } else {
      e.target.attributes["class"].value = 'glyphicon glyphicon-heart';
    }
    let info = eval('('+this.props.user.replace(/j\:/,'')+')');
    $.ajax({
      type: 'POST',
      url: ConfigBBS.Host+'/relay/like',
      data: {_id:e.currentTarget.value, likefrom:info.name},
      success: function (data) {
        //console.log(data);
      }.bind(this)
    });
  }
  handleComment(e) {
    if (this.refs['comment'+e.currentTarget.value]){
      let tf = this.refs['comment'+e.currentTarget.value];
        tf.className = 'hidden';
        tf.children[0].value = '';
    }
    this.setState({commentsub: true});
    let info = eval('('+this.props.user.replace(/j\:/,'')+')');
    $.ajax({
      type: 'POST',
      url: ConfigBBS.Host+'/relay/comment',
      data: {
        _id:e.currentTarget.value,
        commentuserid: info.userid,
        commentfrom:info.name,
        comment: this.state.comment
      },
      success: function (data) {
        this.setState({comment:''});
      }.bind(this)
    });
  }

  showComment(e) {
    if (this.refs['comment'+e.currentTarget.value]){
      let tf = this.refs['comment'+e.currentTarget.value];
      if(tf.className==='hidden'){
        tf.className = 'commentgroup input-group';
        tf.children[0].focus();
      } else {
        tf.className = 'hidden';
      }
    }
  }

  handleChange(e) {
    this.setState({comment: e.currentTarget.value});
  }

  checkLike(user, likefrom) {
    if(likefrom.indexOf(user)>-1){
      return 'glyphicon glyphicon-heart';
    } else {
      return 'glyphicon glyphicon-heart-empty';
    }
  }

  handleClick(e) {

    this.setState({delid: e.currentTarget.value});
    //console.log(this.refs);
    let hs = e.pageY-this.refs.showrelay.offsetTop-110
    this.refs.confirm.className = 'confirm alert alert-danger alert-dismissable';
    this.refs.confirm.style.top = hs+'px';
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
      url: ConfigBBS.Host+'/relay/del',
      data: {
        _id: this.state.delid
      },
      success: function (data) {
        if(data.ok===1) {
          this.refs.yes.className = 'btn btn-success';
          this.refs.yes.innerText = '删除成功';
          setTimeout(function(){
              this.refs.yes.innerText = '确定';
              this.refs.yes.className = 'btn btn-danger';
              this.refs.confirm.className = 'hidden';
            }.bind(this), 500
          );
        }
      }.bind(this)
    });

  }
  handleCommentDel(e) {
    e.currentTarget.attributes.disabled='disabled';
    let d = e.currentTarget.attributes.data.value;
    let relayid = d.replace(/\d+&/g,'');
    let commenttime = d.replace(/&\w*/g,'');
    $.ajax({
      type: 'POST',
      url: ConfigBBS.Host+'/relay/comment/del',
      data: {
        _id: relayid,
        commenttime: commenttime,
        commentuserid: ConfigBBS.getUser(this.props.user).userid
      },
      success: function (data) {
        if(data.ok==1) {
          console.log('删除成功');
        }
        if(data.ok==0) {
          console.log('删除失败');
        }
      }.bind(this)
    });

  }


  render () {
    return (
      <div>

      <div className="show-relay" ref="showrelay">
        <div
          ref="confirm"
          role="alert"
          className="hidden"
          >
          <h4>确定删除吗？</h4>
          <p>点赞与评论数据将同时删除！</p>
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

        <div className="tip">共{this.state.relay.length}条回复</div>
      {
        this.state.relay.map(function(relay){
          let info = eval('('+relay.user.replace(/j\:/,'')+')');
          let cinfo = eval('('+this.props.user.replace(/j\:/,'')+')');
          return (
            <div key={relay._id}>
            <div className="relaycont">
              <div className="info">
                <img
                  src={info.avatar}
                 />
              </div>
              <div className="content">
                <span className="name"><Link to={ {pathname: '/uc', query:{userid:relay.userid}} }>{info.name}</Link></span>
                <div className="cont"
                  dangerouslySetInnerHTML = { {__html: relay.content} } ></div>
                <span className="time">{ConfigBBS.formatDate(relay.created)}</span>
                {function() {
                  if(relay.liked.length>0||relay.comments.length>0) {
                    return (
                      <div className="cmcont">
                        <div className="arrow"></div>
                      {function() {
                        if(relay.liked.length>0) {
                          return (
                            <div className="liked">
                                <span>{relay.liked.length}
                                  <span className="glyphicon glyphicon-heart-empty" aria-hidden="true"></span>：</span>
                              {relay.liked.map(function(likefrom) {
                                return <span key={likefrom} >{likefrom}</span>
                              })}
                            </div>
                          )
                        }
                      }()}
                      {function() {
                        if(relay.comments) {
                          return (
                            <div className="comment" >
                            {relay.comments.map(function(comment) {
                              return (
                                <div key={comment.commentuserid+comment.comment+comment.commenttime} >
                                  <span>{comment.commentfrom}:</span>
                                  <span>{comment.comment}</span>
                                  <span>{comment.commentuserid===cinfo.userid?
                                    <a
                                      disabled="true"
                                      href="javascript:;"
                                      onClick={this.handleCommentDel.bind(this)}
                                      data={comment.commenttime+'&'+relay._id}
                                    >
                                      ×
                                    </a>
                                    :''}</span>
                                </div>
                              )
                            }.bind(this) )}
                            </div>
                          )
                        }
                      }.bind(this)()}
                      </div>
                    )
                  } }.bind(this)()
                }
                <div ref={'comment'+relay._id} className="hidden">
                  <input
                    type="text"
                    className="form-control"
                    onChange={this.handleChange.bind(this)}  />
                  <span className="input-group-btn">
                    <button
                      className="btn btn-default"
                      type="button" value={ relay._id }
                      disabled={!this.state.comment}
                      onClick={this.handleComment.bind(this)} >发送</button>
                  </span>
                </div>
                <div className="relaytool">
                  <button onClick={this.handleLike.bind(this)} value={ relay._id }>
                    <span className={this.checkLike(cinfo.name, relay.liked)} aria-hidden="true"></span>
                  </button>
                  <button onClick={this.showComment.bind(this)} value={ relay._id } >
                    <span className="glyphicon glyphicon-comment" aria-hidden="true"></span>
                  </button>
                  {
                    function(){

                      if(ConfigBBS.getUser(this.props.user).userid==relay.userid) {
                        return (
                          <button onClick={this.handleClick.bind(this)} value={ relay._id } >
                            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                          </button>
                        )
                      }
                    }.bind(this)()
                  }
                </div>
              </div>
            </div>
            <div className="clear"></div>
            </div>
          )
        }.bind(this) )
      }
      </div>

      </div>
    )
  }
}


class ShowTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: {},
      relayed: '',
    }
  }
  componentWillReceiveProps (np) {
    var that = this;
    if(np.content&&np.content!=this.props.content){
      let reform = {
        totopic: this.state.topic._id,
        userid: eval('('+np.user.replace(/j\:/,'')+')').userid,
        user: np.user,
        content: np.content
      }
      //let cform = new FormData($("#creatform")[0]);
      //cform.append("content", np.content);
      $.ajax({
          type: 'POST',
          url: ConfigBBS.Host+'/relay',
          data: reform,
          beforeSend: function() {
            that.setState({relayed: 'relaying'});
          },
          success: function (data) {
            if(data.ok===1){
              that.setState({relayed: 'relayed'});
            }
          }
      });
    }
  }
  getTopicdataFromServer() {
    $.ajax({
      type: 'GET',
      url: ConfigBBS.Host+this.props.url,
      success: function (data) {
        this.setState({topic: data});
      }.bind(this)
    });
  }

  componentDidMount() {
    this.getTopicdataFromServer();
    this.interval = setInterval(function(){
      this.getTopicdataFromServer();
    }.bind(this), this.props.pollInterval);
    //this.refs.topicFreeze.style.height = 100%;

  }
  componentWillUnmount() {
    if(this.state.topic.isfreeze!==1) {
      /*
      *阅读量+1
      */
      $.ajax({
        type: 'POST',
        url: ConfigBBS.Host+this.props.url,
        success: function (data) {
          //console.log(data);
        }.bind(this)
      });

    } else {
      console.log('unmount');
    }

    clearInterval(this.interval);
  }

  render() {
    if(!this.state.topic.isfreeze) {
      if(this.state.topic.user){
        var author = eval('('+this.state.topic.user.replace(/j\:/,'')+')');
        return (
          <div >

            <div className="topicbody">
              <div className="page-header">
                <h4>
                  <span>{this.state.topic.tcls}</span>
                  {this.state.topic.title}
                </h4>
              </div>
              <div className="twell">
                <img src={author.avatar} width="25" height="25" className="img-rounded" />
                <span className="author">{author.name}</span>
                <span className="created">
                { new Date(this.state.topic.created).toLocaleDateString() }
                { new Date(this.state.topic.created).toLocaleTimeString() }
                </span>
                <span className="num">阅读量：{this.state.topic.num}</span>
              </div>

              <p className="content" dangerouslySetInnerHTML={ {__html: this.state.topic.content} } />
              <div className="hrline" ></div>
              <p className="ping">
                { function() {
                  if(this.state.topic.updated) {
                    return (
                      <span>最后更新：
                      { this.state.topic.ctupdated?new Date(this.state.topic.ctupdated).toLocaleDateString():new Date(this.state.topic.updated).toLocaleDateString() }
                      { this.state.topic.ctupdated?new Date(this.state.topic.ctupdated).toLocaleTimeString():new Date(this.state.topic.updated).toLocaleTimeString() }
                      </span>
                    )
                  }
                }.bind(this)()  }
                <span>&nbsp;</span>
                <span>
                  <a href="#ping"><span className="glyphicon glyphicon-pencil"></span>回复</a>
                </span>
              </p>
            </div>


            <Relay
              url={"/relay?topicid="+this.state.topic._id}
              user={this.props.user}
              pollInterval={1000} />
            <a name="ping" ></a>
            <div className="editbody" >
              <MyEditor />
              {
                function() {
                  if(this.state.relayed==='relaying') {
                    return (  <div ref="subcontent" className="subcontent">
                        <img src="/public/images/uploading.jpg" />
                        <p>请稍候...</p>
                      </div>)
                  }
                }.bind(this)()
              }
            </div>
            <div className="clear"></div>
          </div>
        )
      }
      else {
        return <div></div>
      }
    } else {
      return (
        <div className="topic-freeze" style={{height: (window.innerHeight-130)}} >
          <div className="fcont">
            <div className="cry" ></div>
            <div className="ftxt" >
              <h4>该主题被冻结!</h4>
              <p>被冻结期间无法访问，如有疑问，请联系管理员处理！</p>
            </div>
            <div className="clear"></div>
          </div>
        </div>
      )
    }
  }
}


function mapStateToProps(state) {
  return {
    user: state.user,
    uploaded: state.uploaded,
    content: state.content
  }
}



function mapDispatchToProps(dispatch) {
  return bindActionCreators(bAction, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(ShowTopic);
