import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Head, Bottom } from './common/Navs.jsx';
import ShowTopic from '../containers/ShowTopic.jsx';



class Topic extends Component {
  constructor(props) {
    super(props);
  }


	render() {
	  return (
	  	<div>

      <div className="mysupcon-head" >
				<div className="container">
					<div className="row">
						<Head />
					</div>
				</div>
	  	</div>

	     <div className="container">
          <div className="row">
  	        <ShowTopic
            url={this.props.location.pathname+this.props.location.search}
            pollInterval={9000}  />
          </div>
        </div>
        <Bottom />
	  	</div>
	  );
	}
}
export default Topic;
