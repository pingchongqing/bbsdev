import { combineReducers } from 'redux'
import user,{admin} from './ReadUser'
import Uploaded from './Uploaded'
import content from './EditContent'

const rootReducer = combineReducers({
  user: user,
  admin:admin,
  uploaded: Uploaded,
  content: content
})

export default rootReducer
