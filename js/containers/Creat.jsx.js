import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import cookie from 'react-cookie';
import MyEditor from './Editor.jsx';
import ConfigBBS from '../config/ConfigBBS';
import * as bAction from '../actions';
import $ from 'jquery';

class Creat extends Component {
  constructor (props) {
  	super(props);
    this.state = {
      tcls: '交流',
      title: '',
      groupcls: '',
      tnum: 0,
      created: ''
    }
  }
  componentWillReceiveProps (np) {
    var that = this;
    if(np.content&&np.content!=this.props.content){
      let tit = this.state.title?this.state.title:'这家伙很懒，没取标题...';
      //let cform = new FormData($("#creatform")[0]);
      //cform.append("content", np.content);
        if(this.props.search) {
          let cform = {
            _id: this.state._id,
            tcls: this.state.tcls,
            title: tit,
            content: np.content
          }
          $.ajax({
            type: 'POST',
            url: ConfigBBS.Host+'/creat',
            data: cform,
            success: function (data) {
              if(data.ok===1){
                that.setState({
                  created: 'created',
                  create_id: that.state._id
                });
              } else {
                console.log('更新出错！');
              }
            }
          });
        } else {
          let cform = {
            userid: eval('('+np.user.replace(/j\:/,'')+')').userid,
            user: np.user,
            tcls: this.state.tcls,
            title: tit,
            content: np.content,
            num: 0
          }
          $.ajax({
            type: 'POST',
            url: ConfigBBS.Host+'/creat',
            data: cform,
            success: function (data) {
              that.setState({
                created: 'created',
                create_id: data._id
              });
            }
          });
        }
    }
  }
  componentDidMount() {
    if(this.props.search) {
      $.ajax({
          type: 'GET',
          url: ConfigBBS.Host+'/topic'+this.props.search,
          success: function (data) {
            this.setState({
              _id: data._id,
              userid: data.userid,
              tcls: data.tcls,
              title: data.title,
              edcontent: data.content,
              tnum: data.title.length
            });
          }.bind(this)
      });
    }
  }
  componentWillUnmount() {
    //this.serverRequest.abort();
  }
  handleTcls(e) {
    let value = e.target.value;
    this.setState({tcls: value});
  }
  handleTitle(e) {
    let value = e.target.value;
    this.setState({tnum:value.length});
    if(!value.trim()){
      this.setState({title: '', groupcls: 'has-error'});
    } else if (value.length>30) {
      this.refs.tip.className = 'show';
      this.setState({title: value.substring(0,30), groupcls: 'has-error'});
    } else if (value.length<=30&&value.length>25) {
      this.setState({title: value, groupcls: 'has-warning'});
    } else if (value.length<=4&&value.length>0) {
      this.setState({title: value, groupcls: 'has-warning'});
    } else {
      this.setState({title: value, groupcls: 'has-success'});
    }
  }
  render () {
    if(this.state.created){
      return(
        <div className="alert alert-success " role="alert">
          <br /><br />
          <p className="text-center"><img src="/public/images/success.png" /></p>
          <h2 className="text-center">操作成功！</h2>
          <br /><br />  <br /><br />
          <Link to={{ pathname: '/topic', query:{_id:this.state.create_id} }}>
            <button
              type="button"
              className="btn btn-success btn-lg btn-block"
            >
              查看
            </button>
          </ Link>

          <Link to={{ pathname: '/bbs' }}>
            <button
              type="button"
              className="btn btn-default btn-lg btn-block">首页</button>
          </ Link>
        </div>
      )
    }
    else{
      if(this.props.search && this.state.userid!==ConfigBBS.getUser(this.props.user).userid) {
        return <div>无权操作！</div>
      } else {
        return (
          <div className="creat">
          <form id="creatform">
            <div ref="titlegroup" className={"input-group "+this.state.groupcls}>
            <span className="input-group-addon creat-select">
              <select
                name="tcls"
                style={{border:'none'}}
                value={this.state.tcls}
                onChange={this.handleTcls.bind(this)}  >
              {ConfigBBS.TopicClass.map(function(tcls){
                return <option key={tcls} value={tcls}>{tcls}</option>
              }) }
              </select>
            </span>
            <input
              ref="titleinput"
              name="title"
              type="text"
              className="form-control creat-input"
              placeholder="请输入标题，5到25字最佳"
              required="required"
              value={this.state.title}
              onChange={this.handleTitle.bind(this)}
               />
              <span className="tip">{this.state.tnum}/30</span>
             </div>
             <input
               type="hidden"
               value={eval('('+this.props.user.replace(/j\:/,'')+')').userid} />
             </form>
             {
               function() {
                 if(this.props.search) {
                   if(this.state.edcontent) {
                     return <MyEditor edcontent={this.state.edcontent} />
                   }
                 } else {
                   return <MyEditor  />
                 }

               }.bind(this)()
             }
          </div>
        );
      }

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


export default connect(mapStateToProps, mapDispatchToProps)(Creat);
