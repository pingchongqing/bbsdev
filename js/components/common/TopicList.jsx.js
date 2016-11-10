import React,{ Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import * as ReBs from 'react-bootstrap';
import indexOf from 'lodash/indexOf';



class TopicBox extends Component {
  constructor(props) {
    super(props);   
   
  }

  componentWillMount() {
    /**
     挂载之前读取本地状态数据
    */
    this.props.status.load();
  }

  handleClick(e) {
    var id = e.currentTarget.id;    
    this.props.status.set(id);    
  }

  render() { 
    const { data, status } = this.props;
    let index = indexOf(status.status, String(data.id));
    let readed = '';
    if(index > -1){
      readed = 'readed';
    } 
    return(
      <div className="cont" id={data.id}  onClick={this.handleClick.bind(this)}>        
        <div className={"box "+readed} >
          <h4>{data.title}</h4>
          <p>{data.des}</p>
          <p><img src={data.imgs[0]} /></p>
        </div>
      </div>

    );
  }

}


export class TopicList extends Component {
  constructor (props) {
  	super(props);     
  	this.state = {

    };
  }

  render() {    
    const { title, data, status } = this.props;
  	return (
 	  <div className="topiclist">
 	  	<div role="标题栏" className="title">
  		{title}
  		</div>
      {data.map(
        topic => {
          return(
            <TopicBox key={topic.id} data={topic} status = {status} />
          );
        }
      )}      

 	  </div>
  	);
  }
}