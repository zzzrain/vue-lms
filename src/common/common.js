module.exports = {
  getParams (n) {
    let href = window.location.href.slice(window.location.href.indexOf('?'));
    let reg = new RegExp('(^|&)' + n + '=([^&]*)(&|$)');
    let res = href.slice(1).match(reg);
    if (res) return decodeURI(res[2]);
    return '';
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
  sort (ele) {
    let sort = '';
    switch (ele) {
      case 1 :
        sort = '最优';
        break;
      case 2 :
        sort = '其次';
        break;
      case '最优' :
        sort = '1';
        break;
      case '其次' :
        sort = '2';
        break;
      default:
        sort = '未知';
        break;
    }
    return sort;
  },
  bp (ele) {
    let bp = '';
    switch (ele) {
      case 1 :
        bp = '登录页面';
        break;
      case 2 :
        bp = '采购页面';
        break;
      case '登录页面' :
        bp = '1';
        break;
      case '采购页面' :
        bp = '2';
        break;
      default:
        bp = '未知状态';
        break;
    }
    return bp;
  }
};
