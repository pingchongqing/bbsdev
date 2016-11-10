import { SET_READED, LOAD_READED } from '../actions'
import { merge, union, compact, chunk } from 'lodash'



export default function status(state = [], action) {
  switch (action.type) {
    case SET_READED:  
      if(localStorage.status){
        return union(localStorage.status.split(","), [action.readed])
      } else {
        return compact(union(state, [action.readed]))
      }      
    case LOAD_READED: 
      if(localStorage.status){
        return localStorage.status
      } else {
        return state
      }      
    default:
      return state
  }

}
