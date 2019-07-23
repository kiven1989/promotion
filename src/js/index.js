import $ from 'jquery'
import vconsole from 'vconsole'
import { Message, Loading, get, post, checkIsLogin } from '@/js/util'
import { HOST } from '@/js/env'

import '../css/reset.css'
import '../css/common.css'
import '../css/index.css'

// if (process.env.NODE_ENV !== 'production') {
//   new vconsole()
// }
new vconsole()

$(document).ready(function() {
  const popover = $('.popover')
  const publishDialog = $('.publishDialog')
  const publishDialogMask = $('.publishDialogMask')
  const publishTips = $('.publishTips')
  const publishTipsWrap = $('.publishTipsWrap')
  const tipOffRoof = $('.tipOffRoof')
  const bodyElement = $('body')
  const loadingEle = $('.loading')
  const windowHeight = window.innerHeight
  let contentHeight = 0
  let loadMoreLock = false
  let pageNum = 1

  const myLive = {
    init() {
      this.fetchData()
      this.bind()
    },
    bind() {
      // 发布消息
      $('.publishMes').on('click', this.publishMesHandler)

      // 快速登录浮层点击事件
      publishDialogMask.on('click', this.publishDialogMask)

      // 我知道了回调
      $('.iKnow').on('click', this.iKonwHandler)

      // 微信登录
      $('.loginWeChat').on('click', this.loginWeChat.bind(this))

      // 账号登录
      $('.loginAccount').on('click', this.loginAccount.bind(this))

      // 列表项点击事件
      $('.businessList').on('click', 'li', this.businessListItemClick)

      // 发布提示蒙层点击事件
      publishTipsWrap.on('click', this.publishMaskClick)

      // 加载更多
      window.onscroll = this.windowScroll.bind(this)
    },
    publishDialogMask() {
      publishDialog.removeClass('roof_show')
    },
    publishMaskClick(e) {
      if (e.target === this) {
        publishTips.removeClass('roof_show')
      }
    },
    windowScroll(e) {
      // 如果滚动距离底部小于20px,则加载更多，上锁
      if (
        contentHeight - (windowHeight + window.scrollY) < 20 &&
        !loadMoreLock
      ) {
        loadMoreLock = true
        this.fetchData()
      }
    },
    getContentHeight() {
      contentHeight = bodyElement[0].offsetHeight
    },
    businessListItemClick() {
      // 跳转详情
      const id = $(this).data('id')

      //跳转
      location.href = `./detail.html?id=${id}`
    },
    loginServer() {
      return new Promise((resolve, reject) => {
        Loading.show()
        post({
          url: `${HOST}/tuiguang/com/login/login.php`,
          data: {
            userName: 'wy',
            pwd: 123
          }
        })
          .then(res => {
            Message.show('登录成功')
            publishDialog.removeClass('roof_show')
            Loading.hide()
            resolve()
          })
          .catch(error => {
            Message.show(JSON.stringify(error))
            Loading.hide()
            reject()
          })
      })
    },
    loginAccount(e) {
      this.loginServer()
        .then(_ => {
          publishTips.addClass('roof_show')
        })
        .catch(error => {
          Message.show(JSON.stringify(error))
        })
    },
    weChatServer() {
      return new Promise((resolve, reject) => {
        Loading.show()
        get({
          url: `http://www.qunquntui.com/tuiguang/com/wx/wx.php`
          // url: `${HOST}/tuiguang/com/wx/wx.php`,
          // data: {
          //   userName: 'wy',
          //   pwd: 123
          // }
        })
          .then(res => {
            debugger
            Message.show('登录成功')
            publishDialog.removeClass('roof_show')
            Loading.hide()
            resolve(res)
          })
          .catch(error => {
            Message.show(JSON.stringify(error))
            Loading.hide()
            reject()
          })
      })
    },
    loginWeChat() {
      this.weChatServer()
        .then(res => {
          console.log(2, res)
        })
        .catch(error => {})
    },
    iKonwHandler() {
      publishTips.removeClass('roof_show')
      window.location.assign('./publish.html')
    },
    async publishMesHandler() {
      const isLogin = await checkIsLogin()
      if (isLogin) {
        publishTips.addClass('roof_show')
      } else {
        publishDialog.addClass('roof_show')
      }
    },
    /*
     *@author: wangjun
     *@date: 2019-07-20 16:14:37
     *@description: 置顶渲染函数
     */
    tag(item) {
      // 如果top为1则显示置顶
      if (item.top * 1 === 1) {
        return `<em class="tag">置顶</em>`
      }
      return ''
    },
    renderList(list) {
      const listHtmlArr = list.map(item => {
        return `
        <li data-id="${item.id}">
          <dl class="business_list_tit">
            <dt>
              <i>
                <img
                  src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1561661236791&di=9706ce86ce917f4c1ac5c12e9846c485&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201812%2F07%2F20181207173003_zdddw.jpg"
                  alt=""
                />
              </i>
              <span>${item.name || '王者'}</span>
              ${this.tag(item)}
            </dt>
          </dl>
          <div class="business_cont">
            <p class="article">${item.introduce || ''}</p>
            <div class="img-zone">
            ${item.imgs
              .map(imgUrl => {
                return `
              <span class="img-box" style="background-image:url(${HOST}/tuiguang/${imgUrl})">
              </span>
              `
              })
              .join('')}
            </div>
            <p class="page_view">
              ${item.pTime}，${item.PV}浏览
            </p>
          </div>
        </li>`
      })

      $('.businessList ul').append(listHtmlArr.join(''))
      // 数据加载完成功获取一下页面整体高度
      this.getContentHeight()
    },
    fetchData() {
      loadingEle.addClass('loadingShow')
      // 获取列表数据
      get({
        url: `${HOST}/tuiguang/com/quan/quanService.php`,
        dataType: 'json',
        data: {
          act: 'listbytype',
          type: 1,
          page: pageNum
        }
      })
        .then(res => {
          // 无数据返回,锁上加载更多
          if (res.length === 0) {
            loadMoreLock = true
            loadingEle.addClass('loadingEnd')
          } else {
            // 拿到数据渲染列表
            this.renderList(res)
            pageNum++
            loadMoreLock = false
          }
          loadingEle.removeClass('loadingShow')
          return this
        })
        .catch(error => {
          Message.show(JSON.stringify(error))
          loadingEle.removeClass('loadingShow')
          return this
        })
    }
  }
  // 脚本初始化
  myLive.init()
})
