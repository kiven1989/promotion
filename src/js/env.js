// 环境变量
const env = {
  // 线上环境配置
  prod: {
    url: 'http://www.qunquntui.com',
    HOST: ''
  },
  // 测试环境配置
  test: {
    url: 'http://39.106.197.1',
    HOST: ''
  },
  // 本地环境配置
  dev: {
    HOST: 'http://39.106.197.1'
  }
}

// 获取当前域名信息
const hostname = window.location.hostname

// 依据域名动态生成
let host = ''
switch (hostname) {
  case env.prod.url:
    host = env.prod.HOST
    break
  case env.test.url:
    host = env.test.HOST
    break
  default:
    host = env.dev.HOST
}

// 对外导出
export const HOST = host
