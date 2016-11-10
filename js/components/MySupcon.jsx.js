import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import  { Head, BannerBox, Bottom } from './common/Navs.jsx';
import TopicList from '../containers/TopicList.jsx';

import TransitionGroup from 'react-addons-transition-group';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';



class MySupcon extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errcode:0
		}
	}

	handleClick (e) {
		const { router } = this._reactInternalInstance._context;
		router.replace("/topic?_id="+e.currentTarget.attributes['data'].value);
	}
	handleCheck(errcode) {
		if(errcode===1) {
			this.setState({errcode:1});
		}
	}
	render() {

		var banner = <div className="bannercont" >
			<div className="container">
				<div className="row">
					<BannerBox />
				</div>
			</div>
		</div>

		var head = <div className="mysupcon-head" >
						<div className="container">
							<div className="row">
								<Head />
							</div>
						</div>
			  	</div>

	  return (
	  	<div>


	  	{this.state.errcode===1?'':head}

			{this.state.errcode===1?'':banner}


			<div className="container">
				<div className="row">
	        <TopicList
						url="/list"
						pathname="/"
						tcls={this.props.location.search?this.props.location.search:''}
						pollInterval={1000}
						handleClick={this.handleClick.bind(this)}
						handleCheck={this.handleCheck.bind(this)}
					/>
					</div>
				</div>
				{this.state.errcode===1?'':<Bottom active={'list'} />}
	  	</div>
	  );
	}
}
export default MySupcon;
