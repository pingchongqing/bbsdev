import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ConfigBBS from '../config/ConfigBBS';
import * as bAction from '../actions';
var $ = require('jquery');
import MyEditor from './Editor.jsx';



class ShowTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: [],
      relay: [],
      comment: [],
      k: 0
    }
  }
  getListdataFromServer() {
    $.ajax({
      type: 'GET',
      url: ConfigBBS.Host+this.props.url,
      data: {
        userid: ConfigBBS.getUser(this.props.user).userid
      },
      success: function (data) {
        this.refs.loadpage.className='hidden';
        this.setState({topic: data});
      }.bind(this)
    });
  }
  componentDidMount() {
    this.getListdataFromServer();
    this.interval = setInterval(function(){
      this.getListdataFromServer();
    }.bind(this), this.props.pollInterval);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.intervalSuccess);
  }
  handleClick(e) {
    this.setState({delid: e.currentTarget.attributes.data.value});
    this.refs.confirm.className = 'confirm alert alert-danger alert-dismissable';
    this.refs.confirm.style.top = e.pageY-110+'px';
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
      url: ConfigBBS.Host+this.props.url,
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


  render() {

    return (
      <div className="ucenter">
        <h5>我的话题</h5>
        <table className="table table-hover">
          <tbody>
            <tr>
              <th width="5%"></th>
              <th width="55%">标题</th>
              <th width="25%">日期</th>
              <th width="15%">操作</th>
            </tr>
            {
              this.state.topic.map(function(tp) {
              return (
                <tr key={tp._id}>
                  <td>{tp.no}</td>
                  <td>
                    <Link to={{ pathname: '/topic', query: { _id: tp._id } }} >
                      [{tp.tcls}]{tp.title}
                    </Link>
                  </td>
                  <td>{ new Date(tp.created).toLocaleDateString() }</td>
                  <td>
                    <Link to={{ pathname: '/creat', query: { _id: tp._id } }} >
                      <span className="glyphicon glyphicon-edit"></span>
                    </Link>
                    {' '}
                    <a
                      href="javascript:;"
                      onClick={this.handleClick.bind(this)}
                      data={tp._id}
                      >
                      <span className="glyphicon glyphicon-trash"></span>
                    </a>
                  </td>
                </tr>
              )
            }.bind(this))
          }
          </tbody>
        </table>

        <div
          ref="confirm"
          role="alert"
          className="hidden"
          >
          <h4>确定删除吗？</h4>
          <p>删除之后将无法恢复，主题的回复与评论将同时删除。</p>
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
        <div ref="loadpage" className="subcontent">
            <img src="/public/images/uploading.jpg" />
            <p>请稍候...</p>
        </div>
      </div>
    )
  }

}


function mapStateToProps(state) {
  return {
    user: state.user
  }
}



function mapDispatchToProps(dispatch) {
  return bindActionCreators(bAction, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(ShowTopic);
