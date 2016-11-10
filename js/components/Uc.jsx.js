import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import cookie from 'react-cookie';
import { Head, Bottom } from './common/Navs.jsx';
import Ucenter from '../containers/Ucenter.jsx';





class Uc extends Component {
	constructor(props) {
		super(props);
		this.state = {user:cookie.load('USER')}
	}
  componentDidMount() {

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
	        <Ucenter url="/list/uc" pollInterval={2000} />
					</div>
				</div>
			<Bottom active={'uc'} />
	  	</div>
	  );
	}
}
export default Uc;
