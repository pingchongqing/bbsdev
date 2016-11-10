import { UPLOADED } from '../actions'
import { merge, union, compact, chunk } from 'lodash'



export default function uploaded(state='', action) {
  switch (action.type) {
    case UPLOADED:
      return action.msg;
    default:
      return state;
  }

}
