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
    if (format === 'YMD') {
      str = year + '-' + month + '-' + day;
    } else {
      str = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    }
    return str;
  },
  role (ele) {
    let res = '';
    switch (ele) {
      case 1 :
        res = '采购员';
        break;
      case 2 :
        res = '代理商';
        break;
      case 3 :
        res = '业务员';
        break;
      case 4 :
        res = '财务员';
        break;
      case 5 :
        res = '仓管员';
        break;
      case 6 :
        res = '发货员';
        break;
      default:
        res = '未知';
        break;
    }
    return res;
  },
  state (ele) {
    let res = '';
    switch (ele) {
      case 0 :
        res = '停用';
        break;
      case 1 :
        res = '启用';
        break;
      default:
        res = '未知状态';
        break;
    }
    return res;
  },
  skuUnit (ele) {
    let res = '';
    switch (ele) {
      case 1 :
        res = '箱';
        break;
      case 2 :
        res = '瓶';
        break;
      default:
        res = '未知状态';
        break;
    }
    return res;
  },
  sort (ele) {
    let res = '';
    switch (ele) {
      case 1 :
        res = '最优';
        break;
      case 2 :
        res = '其次';
        break;
      case '最优' :
        res = '1';
        break;
      case '其次' :
        res = '2';
        break;
      default:
        res = '未知';
        break;
    }
    return res;
  },
  bp (ele) {
    let res = '';
    switch (ele) {
      case 1 :
        res = '登录页面';
        break;
      case 2 :
        res = '采购页面';
        break;
      case '登录页面' :
        res = '1';
        break;
      case '采购页面' :
        res = '2';
        break;
      default:
        res = '未知状态';
        break;
    }
    return res;
  }
};
