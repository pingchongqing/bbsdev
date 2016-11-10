
export const UPLOADED = 'UPLOADED'
export const TOEDIT = 'TOEDIT'


export function uploadMsg(msg) {
  return {
    type: UPLOADED,
    msg: msg
  }
}

export function toEdit(content) {
  return {
  	type: TOEDIT,
  	content: content
  }
}