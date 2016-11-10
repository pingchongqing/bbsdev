import React, { Component } from 'react';
import {Editor, EditorState, RichUtils, ContentState, Modifier } from 'draft-js';
import Upload from './Upload.jsx';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as bAction from '../actions';


class MyEditor extends Component {
  constructor(props) {
    super(props);
    if(props.edcontent) {
      this.state = {editorState: EditorState.createWithContent(ContentState.createFromText(props.edcontent))};
    } else {
      this.state = {editorState: EditorState.createEmpty()};
    }
    this.onChange = (editorState) => {
      this.setState({editorState});
    }
    this.focus = () => this.refs.ta.focus();
    this.handleKeyCommand = this.handleKeyCommand.bind(this);

  }


componentWillReceiveProps (np) {
  if(np.uploaded=='uploading') {
    this.refs.eb.disabled='disabled';
    this.refs.uploading.className='uploading';
  }
  if(np.uploaded!=='uploading'&&np.uploaded!==this.props.uploaded){
    this.refs.eb.disabled=false;
    this.refs.uploading.className='uploading-hidden';
    var content = this.state.editorState.getCurrentContent();
    var selection = content.getSelectionAfter();
    var upcont = np.uploaded=='fail'?'文件不是图片或大小超过20M':'\<p\>\<img src='+np.uploaded+' \/\>\<\/p\>';
    var ne = Modifier.insertText(content, selection, upcont);
    var nk = EditorState.push(this.state.editorState,ne);
    this.onChange( nk );
  }
}
  handleClick (e) {
    let html = this.state.editorState.getCurrentContent();
    let viw = html.getPlainText();
    this.props.toEdit(viw);
    var ds = EditorState.createEmpty();
    this.onChange( ds );
  }
  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }
  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }
  _onViewClick() {
    let html = this.state.editorState.getCurrentContent();
    let viw = html.getPlainText();
    this.refs.va.innerHTML=viw;
    if (this.refs.va.className==='vahidden') {
      this.refs.va.className='va';
      this.refs.eye.className='glyphicon glyphicon-eye-close';
    } else {
      this.refs.va.className='vahidden';
      this.refs.eye.className='glyphicon glyphicon-eye-open';
    }

  }
  render() {
    return (
      <div className="editor">
        <div ref="va" className="vahidden"></div>
        <div ref="uploading" className="uploading-hidden">
          <img src="/public/images/uploading.jpg" />
          <p>请稍候...</p>
        </div>
        <div className="hrline" ></div>
        <div className="btn-group toolbar" role="group" aria-label="...">
          <button onClick={this._onBoldClick.bind(this)} type="button" className="btn btn-default btn-sm" aria-label="Left Align">
              <span className="glyphicon glyphicon-bold" aria-hidden="true"></span>
          </button>
          <Upload />
          <button onClick={this._onViewClick.bind(this)} type="button" className="btn btn-default btn-sm" aria-label="Right Align">
            <span ref="eye" className="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
          </button>
        </div>
        <div className="hrline" ></div>
        <Editor
          ref="ta"
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}      />
        <button
          type="button"
          ref="eb"
          onClick={this.handleClick.bind(this)}
          className="btn btn-primary btn-sm" >提交</button>
      </div>
    );
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


export default connect(mapStateToProps, mapDispatchToProps)(MyEditor);
