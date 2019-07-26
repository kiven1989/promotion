import $ from 'jquery'
import vconsole from 'vconsole'
import { Message, Loading, post } from './util.js'
import { HOST } from '@/js/env'

import '../css/reset.css'
import '../css/common.css'
import '../css/publish.css'

new vconsole()

$(function() {
  const uploadZone = $('.uploadZone')
  const fileIpt = $('#file')

  const fileArr = []
  const confirmPublish = $('.confirmPublish')
  const textArea = $('.textArea')
  const textAreaNum = $('.textAreaNum')
  const contacts = $('.contacts')
  const payRoof = $('.payRoof')
  const goPay = $('.goPay')
  let iNow = 0
  // 是否需要支付标识
  const needPay = true

  // 绑定textarea的change事件
  const max = textAreaNum.text().split('/')[1]
  textArea.on('input', function() {
    const len = this.value.length
    textAreaNum.text(len + '/' + max)
  })

  // 确定发布
  const data = {
    contacts: '',
    files: [],
    textArea: ''
  }

  const myLive = {
    init() {
      this.pageInit()
      this.bind()
    },
    pageInit() {},
    bind() {
      // 添加图片
      uploadZone.on('click', 'dt', this.addImg)
      // 删除图片
      uploadZone.on('click', '.close', this.removeImg)
      // 监听文件控件变化
      fileIpt.on('change', this.fileChange)
      // 发布
      confirmPublish.on('click', this.publistTo.bind(this))

      // 文本框失去光标事件(修复微信端弹起键盘后导致实际区域域视觉区域不一致bug)
      textArea.on('blur', this.textAreaBlur)
    },
    jsApiCall() {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
          '',
          (res) => {
              WeixinJSBridge.log(res.err_msg);

              if(res.err_msg == "get_brand_wcpay_request:ok"){
                  payRoof.removeClass('roof_show')
                  this.publistToServer()
                  Message.show('支付成功');
              }else{
                  //返回跳转到订单详情页面
                  Message.show('支付失败');
                  payRoof.removeClass('roof_show')
              }
          }
      );
    },
    callpay() {
      if (typeof WeixinJSBridge == "undefined"){
          if( document.addEventListener ){
              document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false)
          }else if (document.attachEvent){
              document.attachEvent('WeixinJSBridgeReady', this.jsApiCall)
              document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall)
          }
      }else{
          // 微信支付
          this.jsApiCall()
      }
    },
    goPay() {
      this.callpay()
    },
    textAreaBlur() {
      document.body.scrollTop = 0
    },
    checkIsNetworkError() {
      return !navigator.onLine
    },
    /*
     *@author: wangjun
     *@date: 2019-07-05 23:58:04
     *@description: 无限检测网络情况
     */
    infiniteGetNetwork() {
      let timer = null
      return new Promise(resolve => {
        timer = setInterval(_ => {
          const networkError = this.checkIsNetworkError()
          if (!networkError) {
            clearInterval(timer)
            resolve()
          }
        }, 2000)
      })
    },
    publistToServer() {
      // 获取值
      data.contacts = contacts.val()
      data.files = fileArr.map(item => {
        return item.file
      })
      data.textArea = textArea.val()
      // 校验
      const re = /^(1\d{10})|((0\d{2,3}-\d{7,8}))$/u

      if (!data.contacts.trim().length) {
        Message.show('请输入联系人')
        return
      }
      if (!data.files.length) {
        Message.show('请上传图片')
        return
      }
      if (!data.textArea.trim().length) {
        Message.show('请上填写服务内容')
        return
      }

      // show loading
      Loading.show()

      // 创建formData对象
      const formData = new FormData()

      console.log('提交的数据', data)

      formData.append('name', data.contacts)
      formData.append('introduce', data.textArea)
      formData.append('type', 1)
      formData.append('act', 'add')

      // 将图片对象推送到formData对象里
      data.files.forEach((file, index) => {
        formData.append('imgs[]', file, file.name)
      })

      post({
        url: `${HOST}/tuiguang/com/quan/quanService.php`,
        processData: false,
        contentType: false,
        data: formData,
        cookie: true
      })
        .then(res => {
          // 发布成功
          Message.show('发布成功')
          Loading.hide()
          // 跳转成功页面
          location.replace('./success.html')
        })
        .catch(error => {
          Message.show(JSON.stringify(error))
          Loading.hide()
          // 检测是不是由于网络问题导致请求失败
          if (this.checkIsNetworkError()) {
            this.infiniteGetNetwork().then(_ => {
              this.publistTo()
            })
          }
        })
    },
    publistTo() {
      this.publistToServer()
    },
    fileChange(e) {
      const files = e.target.files
      Array.prototype.slice.call(files).forEach(file => {
        const reader = new FileReader()

        reader.onload = function(data) {
          const ddLen = uploadZone.find('dd').length
          const url = data.target.result
          iNow++
          if (ddLen <= 2) {
            $(`
            <dd style="background-image:url(${url})">
              <svg class="icon close" aria-hidden="true" data-id="${iNow}">
                <use xlink:href="#icon-close"></use>
              </svg>
            </dd>
            `).insertBefore(uploadZone.find('dt'))
            // 图片对象保存到待上传的图片数组里
            fileArr.push({
              id: iNow,
              file
            })
          }
          if (ddLen === 2) {
            uploadZone.find('dt').hide()
          }
        }
        reader.readAsDataURL(file)
      })
    },
    removeImg() {
      const id = $(this).data('id')
      // 同步图片上传列表
      fileArr.forEach((item, index) => {
        if (item.id === id) {
          fileArr.splice(index, 1)
        }
      })
      $(this)
        .parent()
        .remove()
      uploadZone.find('dt').show()
    },
    addImg() {
      fileIpt.trigger('click')
    }
  }

  myLive.init()
})
