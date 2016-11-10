import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Mysupcon from '../components/Mysupcon.jsx'
import * as MysupconActions from '../actions'
import route from '../routes/Route'

function mapStateToProps(state) {
  return {
    status: state.status
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MysupconActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Mysupcon)
