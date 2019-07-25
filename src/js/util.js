import $ from 'jquery'
import loadingImg from '../img/loading.png'
/*
 *@author: wangjun
 *@date: 2019-06-28 21:53:25
 *@description: 蒙版对象
 */
class MessageClass {
  constructor() {
    this.timer = null
    this.init()
  }
  init() {
    const MessageDiv = document.createElement('div')
    MessageDiv.style.cssText = `position:fixed;z-index: 999;top:40px;left:50%;word-break:break-all;transform:translate3d(-50%, 0, 0); background:rgba(0,0,0,.7);width:50%;padding: 10px;display:none;
        color:#fff;text-align:center;border-radius:4px;`
    document.body.appendChild(MessageDiv)
    // 挂载dom
    this.MessageDiv = MessageDiv
  }
  show(message) {
    $(this.MessageDiv)
      .text(message)
      .fadeIn()
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      $(this.MessageDiv).fadeOut()
    }, 3000)
  }
}
const Message = new MessageClass()
/*
 *@author: wangjun
 *@date: 2019-07-08 21:59:06
 *@description: loading加载
 */
class LoadingClass {
  constructor() {
    const loadingElement = document.createElement('div')
    loadingElement.className = 'full-loading'
    loadingElement.innerHTML = `<img src="${loadingImg}" class="loading-icon"/>`
    loadingElement.style.display = 'none'
    document.body.appendChild(loadingElement)

    this.loadingElement = loadingElement
  }
  show() {
    $(this.loadingElement).fadeIn()
  }
  hide() {
    $(this.loadingElement).fadeOut()
  }
}
const Loading = new LoadingClass()

/*
 *@author: wangjun
 *@date: 2019-06-30 21:44:37
 *@description: ajax方法
 */

const ajax = params => {
  return new Promise((resolve, reject) => {
    $.ajax(
      Object.assign(params, {
        dataType: params.dataType || 'json',
        timeout: 5000,
        xhrFields: {
          withCredentials: params.cookie
        },
        success(res) {
          resolve(res)
          
        },
        error(error) {
          reject(error)
        },
        complete() {
          // resolve()
        }
      })
    )
  })
}

const post = params => {
  return ajax(
    Object.assign(params, {
      type: 'post'
    })
  )
}

const get = params => {
  return ajax(
    Object.assign(params, {
      type: 'get'
    })
  )
}

const getQueryString = name => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const urlObj = window.location
  var r =
    urlObj.href.indexOf('#') > -1
      ? urlObj.hash.split('?')[1].match(reg)
      : urlObj.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

/*
 *@author: wangjun
 *@date: 2019-07-06 00:34:07
 *@description: 举报类型
 */
const tipOffList = [
  {
    label: '广告',
    type: 1
  },
  {
    label: '色情低俗',
    type: 2
  },
  {
    label: '反动',
    type: 3
  },
  {
    label: '谣言',
    type: 4
  },
  {
    label: '欺诈或恶意营销',
    type: 5
  },
  {
    label: '谩骂',
    type: 6
  }
]

/*
 *@author: wangjun
 *@date: 2019-07-12 12:22:36
 *@description: 检测登录状态
 */
const checkIsLogin = () => {
  return new Promise(resolve => {
    let cookies = null
    const re = /PHPSESSID/gu
    if (document.cookie) {
      cookies = document.cookie.split(';')
      const hasPHPSESSID = cookies.some(item => {
        return re.test(item)
      })
      if (hasPHPSESSID) {
        resolve(true)
        return
      }
    }
    resolve(false)
  })
}

export { Message, Loading, tipOffList, getQueryString, get, post, checkIsLogin }
