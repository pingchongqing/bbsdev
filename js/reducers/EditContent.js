import { TOEDIT } from '../actions'
import { merge, union, compact, chunk } from 'lodash'



export default function content(state='', action) {
  switch (action.type) {
    case TOEDIT:
      return action.content;
    default:
      return state;
  }

}
