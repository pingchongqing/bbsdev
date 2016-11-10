import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import cookie from 'react-cookie';
import { Head, Bottom } from './common/Navs.jsx';
import Creat from '../containers/Creat.jsx';





class Uc extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user:cookie.load('USER')
		}
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
	        <Creat user={this.state.user} search={this.props.location.search?this.props.location.search:''}  />
					</div>
				</div>
			<Bottom active={'creat'} />
	  	</div>
	  );
	}
}
export default Uc;
