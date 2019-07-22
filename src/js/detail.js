import $ from 'jquery'
import Swiper from 'swiper/dist/js/swiper.js'
import {
  Message,
  Loading,
  get,
  post,
  getQueryString,
  tipOffList,
  checkIsLogin
} from './util.js'
import { HOST } from '@/js/env'
import 'swiper/dist/css/swiper.css'
import '../css/reset.css'
import '../css/common.css'
import '../css/index.css'
import '../css/detail.css'
$(function() {
  const publishDialog = $('.publishDialog')
  const publishDialogMask = $('.publishDialogMask')
  const publishTips = $('.publishTips')
  const tipOffRoof = $('.tipOffRoof')
  const ironHandler = $('.ironHandler')
  const businessList = $('.businessList')
  const viewZone = $('.viewZone')
  let mySwiper = null
  // 公共方法
  function maskHide(t) {
    $(t)
      .parent()
      .removeClass('roof_show')
  }

  const myLive = {
    init() {
      this.initPage()
      this.bind()

      // 初始化举报浮层
      this.initTipOffElement()
    },
    bind() {
      // 举报按钮
      businessList.on('click', '.tipOff', this.tipOffHandler)
      // 举报蒙层事件
      tipOffRoof.on('click', '.mask', this.publishDialogMask)
      // 举报列表点击事件
      tipOffRoof.on('click', 'dd', this.tipOffListHandler)
      // 举报提交事件
      tipOffRoof.on('click', '.btn', this.tipOffCommit)
      // 详情页面发布功能
      ironHandler.on('click', this.publishMesHandler)
      // 我知道了回调
      $('.iKnow').on('click', this.iKonwHandler)

      // 微信登录
      $('.loginWeChat').on('click', this.loginWeChat)

      // 账号登录
      $('.loginAccount').on('click', this.loginAccount.bind(this))

      // 图片预览
      businessList.on('click', 'span', this.businessListItemClick)

      // 图片预览区域点击事件
      viewZone.on('click', '.view-zone-inner', this.viewZoneTap)
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
    viewZoneTap(e) {
      console.log('viewZoneTap', e, this)
      if (e.target === this) {
        viewZone.fadeOut()
      }
    },
    businessListItemClick() {
      const index = $(this).data('index')
      viewZone.fadeIn()
      mySwiper.update()
      mySwiper.slideTo(index, 0, false)
    },
    initViewImg(imgs) {
      mySwiper = new Swiper('.swiper-container', {
        virtual: {
          slides: imgs,
          renderSlide(slide, index) {
            return `<div class="swiper-slide">
              <div class="box-img" style="background-image: url(${slide})"></div>
            </div>`
          }
        },
        on: {
          tap() {
            viewZone.fadeOut()
          }
        },
        pagination: {
          el: '.swiper-pagination'
        },
        effect: 'cube'
      })
    },
    initTipOffElement() {
      const ddHtmls = tipOffList
        .map(item => {
          return `
          <dd data-type="${item.type}">
            <span>${item.label}</span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-right"></use>
            </svg>
          </dd>
        `
        })
        .join('')

      tipOffRoof.find('dl').append(ddHtmls)
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
    tipOffCommit() {
      // 获取举报类型
      const typeId = tipOffRoof.find('dd.active').data('type')
      //获取url里的id
      const id = getQueryString('id')

      if (typeId === undefined) {
        Message.show('请选择要举报的类型')
        return
      }
      // 调用举报接口
      // tuiguang/com/quan/report.php?quanId=0&content=1      quanid: 被举报内容id。  content： 举报类型
      get({
        url: `${HOST}/tuiguang/com/quan/report.php`,
        data: {
          quanId: id,
          content: typeId
        }
      })
        .then(res => {
          tipOffRoof.removeClass('roof_show')
          Message.show('提交成功')
        })
        .catch(error => {
          Message.show(json.stringify(error))
        })
    },
    tipOffListHandler() {
      $(this)
        .toggleClass('active')
        .siblings()
        .removeClass('active')
    },
    publishDialogMask() {
      maskHide(this)
    },
    tipOffHandler(e) {
      e.stopPropagation()
      // 获取举报当前数据的id标识
      const id = e.target.dataset.id
      tipOffRoof.addClass('roof_show')
      tipOffRoof.find('dd').removeClass('active')
    },
    renderDetail(data) {
      // 名称
      businessList.html(`
        <dl class="business_list_tit">
        <dt>
          <i>
            <img
              src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1561661236791&di=9706ce86ce917f4c1ac5c12e9846c485&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201812%2F07%2F20181207173003_zdddw.jpg"
              alt=""
            />
          </i>
          <span class="name">账号名称</span>
          <em class="tag">标签</em>
        </dt>
        <dd class="tipOff" data-id="${data.id}">举报</dd>
      </dl>
      <div class="business_cont">
        <p class="article">${data.introduce}</p>
        <div class="img-zone">
        ${data.imgs
          .map((imgUrl, index) => {
            return `
          <span class="img-box" data-index="${index}" style="background-image:url(${HOST}/tuiguang/${imgUrl})">
          </span>
          `
          })
          .join('')}
        </div>
        <p class="page_view">
          ${data.pTime ? data.pTime + ',' : ''} ${
        data.PV ? data.PV + '浏览' : ''
      }
        </p>
        <ul class="info">
          <li><strong>联系人：</strong>${data.name}</li>
        </ul>
      </div>
      `)
      // 介绍
      businessList.find('.article').text(data.introduce)

      // 初试化图片预览控件
      const imgs = data.imgs.map(imgUrl => {
        return `${HOST}/tuiguang/${imgUrl}`
      })
      this.initViewImg(imgs)
    },
    initPage() {
      //获取url里的id
      const id = getQueryString('id')

      // show loading
      Loading.show()

      // 已经id获取详情
      get({
        url: `${HOST}/tuiguang/com/quan/quanService.php`,
        dataType: 'json',
        data: {
          act: 'select',
          id
        }
      })
        .then(res => {
          // 拿到数据渲染列表
          this.renderDetail(res[0])
          Loading.hide()
        })
        .catch(error => {
          Message.show(JSON.stringify(error))
          Loading.hide()
        })
    }
  }
  // 脚本初始化
  myLive.init()
})
