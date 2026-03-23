import axios from 'axios'

const OFFICIAL_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api'

// 从 localStorage 获取 API 地址
const getApiBaseUrl = () => {
  const savedUrl = localStorage.getItem('clarityai_api_url')
  return savedUrl || OFFICIAL_API_URL
}

// 从 localStorage 获取自定义 API 配置
const getCustomApiConfig = () => {
  if (getApiBaseUrl() === OFFICIAL_API_URL) {
    return null
  }

  const savedConfig = localStorage.getItem('clarityai_api_config')
  if (savedConfig) {
    const config = JSON.parse(savedConfig)
    if (config.type === 'custom') {
      return {
        api_key: config.apiKey,
        base_url: config.baseUrl,
        model: config.model
      }
    }
  }
  return null
}

// 创建 axios 实例
const createApiClient = () => {
  const client = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    }
  })
  
  // 添加响应拦截器
  client.interceptors.response.use(responseInterceptor, handleError)
  
  return client
}

// 动态获取 API 客户端
const getApiClient = () => createApiClient()

// 请求拦截器
const requestInterceptor = (config) => {
  return config
}

// 响应拦截器
const responseInterceptor = (response) => {
  return response
}

const handleError = (error) => {
  // 检查是否是 token 限额错误
  if (error.response?.status === 429) {
    const data = error.response.data
    if (data.error === 'token_limit_reached') {
      import('element-plus').then(({ ElMessageBox }) => {
        ElMessageBox.alert(
          '伺服器已達單日 token 限額，請稍後再試。你仍可查看歷史任務與任務總覽；若要繼續使用，請到「設定」改用自己的 OpenAI API 或自建後端。',
          '服務限額提醒',
          {
            confirmButtonText: '知道了',
            type: 'warning'
          }
        )
      })
    }
  }
  return Promise.reject(error)
}

// API 服务方法
export const apiService = {
  // 健康检查
  healthCheck: () => {
    const client = getApiClient()
    return client.get('/health')
  },
  
  // 生成问题
  generateQuestions: (idea) => {
    const client = getApiClient()
    const customApi = getCustomApiConfig()
    return client.post('/generate-questions', { 
      idea,
      custom_api: customApi
    })
  },
  
  // 获取会话数据（包括问题）
  getSessionData: (sessionId) => {
    const client = getApiClient()
    return client.get(`/session/${sessionId}`)
  },
  
  // 获取轮次数据（保持问答对应关系）
  getSessionRounds: (sessionId) => {
    const client = getApiClient()
    return client.get(`/session/${sessionId}/rounds`)
  },
  
  // 提交答案
  submitAnswers: (sessionId, answers) => {
    const client = getApiClient()
    const customApi = getCustomApiConfig()
    return client.post('/submit-answers', { 
      session_id: sessionId, 
      answers,
      custom_api: customApi
    })
  },
  
  // 生成 PDF
  generatePdf: (sessionId) => {
    const client = getApiClient()
    return client.post('/generate-pdf', { session_id: sessionId })
  },
  
  // 继续细化需求
  continueWithFeedback: (sessionId, feedback) => {
    const client = getApiClient()
    const customApi = getCustomApiConfig()
    return client.post('/continue-with-feedback', { 
      session_id: sessionId, 
      feedback,
      custom_api: customApi
    })
  },
  
  // 删除会话
  deleteSession: (sessionId) => {
    const client = getApiClient()
    return client.delete(`/session/${sessionId}`)
  }
}
