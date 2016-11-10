import React,{ Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';


export class Head extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: props.se?props.se:''
    }
  }
  handleChange(e) {
    this.setState({
      searchValue: e.target.value
    })
  }
  handleClick() {
    const { router } = this._reactInternalInstance._context;
    if(this.state.searchValue) {
      router.replace({ pathname: '/search', query: { search: this.state.searchValue} });
    }
  }
  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
        <div className="container">
          <div className="logocont">
            <a><img src="/public/images/logo.png" /></a>
          </div>
          <form className="navbar-form navbar-right searchcont" role="search">
          <div className="input-group input-group-sm">
            <input
              type="text"
              className="form-control"
              placeholder="搜主题..."
              onChange={this.handleChange.bind(this)}
              value={this.state.searchValue}
            />
            <span className="input-group-btn">
              <button
                type="button"
                className="btn btn-default"
                onClick={this.handleClick.bind(this)}
              >搜索</button>
            </span>
          </div>
          </form>
          <div className="clear"></div>
        </div>

      </nav>
    )
  }
}



/*
输出焦点图的组件
*/

export class BannerBox extends Component {
  constructor(props){
    super(props);
    this.state = {
      index: 0,
      direction: null
    };
  }

  handleSelect(selectedIndex, e) {
    this.setState({
      index: selectedIndex,
      direction: e.direction
    });
  }

  render() {
    return (
      <div className="col-xs-12 col-md-12">
        <div id="carousel-example-generic" className="carousel slide" data-ride="carousel">
          <ol className="carousel-indicators">
            <li data-target="#carousel-example-generic" data-slide-to="0" className="active"></li>
            <li data-target="#carousel-example-generic" data-slide-to="1"></li>
            <li data-target="#carousel-example-generic" data-slide-to="2"></li>
          </ol>
          <div className="carousel-inner" role="listbox">
            <div className="item active">
              <img width="1200" src="/public/images/banner.jpg" />
              <div className="carousel-caption">
                ...
              </div>
            </div>
            <div className="item">
              <img width="1200" src="/public/images/banner-fish.jpg" />
              <div className="carousel-caption">
                ...
              </div>
            </div>
            <div className="item">
              <img width="1200" src="/public/images/banner.jpg" />
              <div className="carousel-caption">
                ...
              </div>
            </div>
          </div>
          <a className="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
            <span className="glyphicon glyphicon-chevron-left"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
            <span className="glyphicon glyphicon-chevron-right"></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      </div>
    );
  }

}

export class Bottom extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if(this.props.active) {
      this.refs[this.props.active].className = 'activedd';
    }
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-bottom" role="navigation">
        <div className="container">
          <ul className="nav navbar-nav bottom-ul">
          <li
            ref="list"
          >
            <Link to={{ pathname: '/bbs' }}>
            <span className="glyphicon glyphicon-list"></span>
            <br />
              话题
            </Link>
          </li>
          <li
            ref="creat"
          >
            <Link to={{ pathname: '/creat' }}>
            <span className="glyphicon glyphicon-plus-sign"></span>
            <br />
              发布
            </Link>
          </li>
          <li
            ref="uc"
          >
            <Link to={{ pathname: '/uc' }}>
            <span className="glyphicon glyphicon-user"></span>
            <br />我
            </Link>
          </li>
          </ul>
        </div>
      </nav>
    )
  }
}
