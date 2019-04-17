module.exports = {
  state (ele) {
    let state = '';
    switch (ele) {
      case 0 :
        state = '停用';
        break;
      case 1 :
        state = '启用';
        break;
      default:
        state = '未知状态';
        break;
    }
    return state;
  },
  format (t, format) {
    let d = new Date(t);
    if (!d) return t;
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;
    let str = '';
    if (format === 'HMS') {
      str = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    } else {
      str = year + '-' + month + '-' + day;
    }
    return str;
  },
  getParams (n) {
    let href = window.location.href.slice(window.location.href.indexOf('?'));
    let reg = new RegExp('(^|&)' + n + '=([^&]*)(&|$)');
    let res = href.slice(1).match(reg);
    if (res) return decodeURI(res[2]);
    return '';
  }
};
