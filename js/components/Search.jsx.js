import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import  { Head, BannerBox, Bottom } from './common/Navs.jsx';
import TopicList from '../containers/TopicList.jsx';



class Search extends Component {
	constructor(props) {
		super(props);
	}

	handleClick (e) {
		const { router } = this._reactInternalInstance._context;
		router.replace("/topic?_id="+e.currentTarget.attributes['data'].value);
	}

	render() {
	  return (
	  	<div>

	  	<div className="mysupcon-head" >
				<div className="container">
					<div className="row">
						<Head se={this.props.location.query.search} />
					</div>
				</div>
	  	</div>

			<div className="bannercont">
				<div className="container">
					<div className="row">
						<BannerBox />
					</div>
				</div>
			</div>

			<div className="container">
				<div className="row">
	        <TopicList
						url="/list"
            pathname="/search"
            se={this.props.location.query.search?this.props.location.query.search:''}
						tcls={this.props.location.search?this.props.location.search:''}
						pollInterval={1000}
						handleClick={this.handleClick.bind(this)}
					/>
					</div>
				</div>
			<Bottom active={'list'} />
	  	</div>
	  );
	}
}
export default Search;
