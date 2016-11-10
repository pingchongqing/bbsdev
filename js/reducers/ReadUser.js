
import cookie from 'react-cookie';


export default function user() {
  if(cookie.load('USER')){
    return cookie.load('USER');
  }
  else {
    return ('j:{"errcode":1,"errmsg":"请从公众号登陆"}'); 
    //return ('j:{"errcode":0,"errmsg":"ok","userid":"jt_xcch_pcq","name":"平重庆","department":[23],"mobile":"18268039293","gender":"1","avatar":"http://shp.qpic.cn/bizmp/OKibIicaMnfnLiathH6wdvyxaevRJz7PNlYzsdztmkkMYlZM49rFruP9Q/","status":1,"extattr":{"attrs":[]}}'); //调试时候加的验证字段
  }
}

export  function admin() {
  if(cookie.load('ADMIN')){
    return cookie.load('ADMIN');
  }
  else {
    return ('j:[]');
  }
}
