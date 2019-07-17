import $ from 'jquery'
import {
  Message,
  Loading,
  get,
  post,
  getQueryString,
  tipOffList,
  checkIsLogin
} from './util.js'
import '../css/reset.css'
import '../css/common.css'
import '../css/personalCenter.css'
$(function() {
  const personalList = $('.personalList')
  const myLive = {
    init() {
      this.bind()
    },
    bind() {
      // 列表项点击事件
      personalList.on('click', 'dd', this.personalListDtHandler)

      // 退出登录
      personalList.on('click', 'dt', this.loginOut)
    },
    loginOut() {
      Message.show('退出')
      console.log('loginOut')
    },
    personalListDtHandler() {
      const text = $(this)
        .find('span')
        .text()
      Message.show(text)
    }
  }
  // 脚本初始化
  myLive.init()
})
