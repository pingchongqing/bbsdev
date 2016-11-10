import * as _ from 'lodash';
var eventproxy = require('eventproxy');
var $ = require('jquery');
const ConfigBBS = {
  Host: 'http://admin.hisegg.com',
  TopicClass: ['交流',  '见闻', '集市', '其他']
}

/**
 * 格式化时间
 *
 * @param {any} t
 * @returns
 */
ConfigBBS.formatDate = function (str) {
    var date = new Date(str);
    var time = new Date().getTime() - date.getTime(); //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
    if (time < 0) {
        return '';
    } else if (time / 1000 < 60) {
        return parseInt((time / 1000)) + '秒前';
    } else if ((time / 60000) < 60) {
        return parseInt((time / 60000)) + '分钟前';
    } else if ((time / 3600000) < 24) {
        return parseInt(time / 3600000) + '小时前';
    } else if ((time / 86400000) < 31) {
        return parseInt(time / 86400000) + '天前';
    } else if ((time / 2592000000) < 12) {
        return parseInt(time / 2592000000) + '月前';
    } else {
        return parseInt(time / 31536000000) + '年前';
    }
}

ConfigBBS.formatDep =
function(d) {
	if(d){
    $.ajax({
      type: 'POST',
      url: ConfigBBS.Host+'/department',
      data: {id: d[0]},
      success: function (data) {
        console.log(data);
        return data;
      }.bind(this)
    });
  }
}

ConfigBBS.getUser = function(d) {
	return eval('('+d.replace(/j\:/,'')+')');
}

ConfigBBS.pageLimit = 10; //分页记录数

export default ConfigBBS;
