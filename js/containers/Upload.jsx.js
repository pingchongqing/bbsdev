import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { FormGroup,  ControlLabel, HelpBlock, FormControl, Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as bAction from '../actions';
import $ from 'jquery';
import ConfigBBS from '../config/ConfigBBS';

class Upload extends Component {
  constructor (props) {
  	super(props);
  }

  handleChange(e) {
    var formData = new FormData($("#formcont")[0]);
    var that = this;
    if(e.target.value) {
      $.ajax({
          type: 'POST',
          url: ConfigBBS.Host+'/upload',
          data: formData,
          /**
           *必须false才会自动加上正确的Content-Type
           */
          contentType:false,
          /**
           * 必须false才会避开jQuery对 formdata 的默认处理
           * XMLHttpRequest会对 formdata 进行正确的处理
           */
          processData:false,
          beforeSend: function() {
            that.props.uploadMsg('uploading');
          },
          success: function (data) {
            that.props.uploadMsg(data);
          }
      });
    }

  }


  render () {
    const formInstance = (
      <div className="fileupcont">
        <button type="button" className="btn btn-default btn-sm" aria-label="Left Align">
          <span className="glyphicon glyphicon-picture" aria-hidden="true"></span>
        </button>
        <form
          method="post"
          encType="multipart/form-data"
          onChange={this.handleChange.bind(this)}
          id="formcont"
        >
          <input
            id="formControlsFile"
            name="filecontent"
            type="file"
            //multiple   上传多个文件
            className="fileup"
            />
        </form>
      </div>
    );
  	return (formInstance);
  }
}


function mapStateToProps(state) {
  return {
    user: state.user,
    uploaded: state.uploaded
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(bAction, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Upload);
