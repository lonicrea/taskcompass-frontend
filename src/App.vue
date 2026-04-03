<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Setting, HomeFilled, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import { apiService } from '@/utils/api'

const OFFICIAL_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api'
const STORAGE_KEYS = {
  projects: 'taskcompass_projects',
  apiUrl: 'taskcompass_api_url',
  apiConfig: 'taskcompass_api_config'
}

const router = useRouter()
const showProjectList = ref(false)
const showSettings = ref(false)
const projects = ref([])
const apiBaseUrl = ref(OFFICIAL_API_URL)
const serverType = ref('official')

const apiConfigType = ref('default')
const customApiKey = ref('')
const customApiBaseUrl = ref('https://api.openai.com/v1')
const customModel = ref('gpt-4o-mini')

const connectionStatus = ref('')
const testingConnection = ref(false)

onMounted(() => {
  const savedProjects = localStorage.getItem(STORAGE_KEYS.projects)
  if (savedProjects) {
    projects.value = JSON.parse(savedProjects)
  }

  const savedApiUrl = localStorage.getItem(STORAGE_KEYS.apiUrl)
  if (savedApiUrl) {
    apiBaseUrl.value = savedApiUrl
    if (savedApiUrl !== OFFICIAL_API_URL) {
      serverType.value = 'custom'
    }
  }

  const savedApiConfig = localStorage.getItem(STORAGE_KEYS.apiConfig)
  if (savedApiConfig) {
    const config = JSON.parse(savedApiConfig)
    apiConfigType.value = config.type || 'default'
    customApiKey.value = config.apiKey || ''
    customApiBaseUrl.value = config.baseUrl || 'https://api.openai.com/v1'
    customModel.value = config.model || 'gpt-4o-mini'
  }
})

const goToHome = () => {
  router.push('/')
}

const viewProjects = () => {
  const savedProjects = localStorage.getItem(STORAGE_KEYS.projects)
  projects.value = savedProjects ? JSON.parse(savedProjects) : []
  showProjectList.value = true
}

const deleteProject = async (projectId, index) => {
  try {
    await ElMessageBox.confirm(
      '確定要刪除此任務嗎？此操作會同時刪除本機紀錄與伺服器資料，且無法復原。',
      '確認刪除',
      {
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await apiService.deleteSession(projectId)
    projects.value.splice(index, 1)
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects.value))
    ElMessage.success('任務已刪除')
  } catch (error) {
    if (error === 'cancel' || error === 'close') return
    console.error('Error deleting project:', error)
    ElMessage.error('刪除失敗：' + (error.response?.data?.error || error.message))
  }
}

const viewProject = (projectId) => {
  router.push({ name: 'Overview', params: { sessionId: projectId } })
  showProjectList.value = false
}

const openSettings = () => {
  showSettings.value = true
  connectionStatus.value = ''
}

const saveSettings = () => {
  if (serverType.value === 'custom' && !apiBaseUrl.value.trim()) {
    ElMessage.error('請輸入後端伺服器位址')
    return
  }

  if (serverType.value === 'official' && apiConfigType.value === 'custom') {
    ElMessage.error('若要使用自己的 OpenAI API，請先切換到本地或自訂後端伺服器')
    return
  }

  if (apiConfigType.value === 'custom' && !customApiKey.value.trim()) {
    ElMessage.error('請輸入 OpenAI API Key')
    return
  }

  const finalUrl = serverType.value === 'official'
    ? OFFICIAL_API_URL
    : apiBaseUrl.value.trim()

  const normalizedBaseUrl = customApiBaseUrl.value.trim() || 'https://api.openai.com/v1'
  const normalizedModel = customModel.value.trim() || 'gpt-4o-mini'

  localStorage.setItem(STORAGE_KEYS.apiUrl, finalUrl)

  const apiConfig = {
    type: apiConfigType.value,
    apiKey: customApiKey.value.trim(),
    baseUrl: apiConfigType.value === 'custom' ? normalizedBaseUrl : '',
    model: apiConfigType.value === 'custom' ? normalizedModel : ''
  }
  localStorage.setItem(STORAGE_KEYS.apiConfig, JSON.stringify(apiConfig))

  if (apiConfigType.value === 'custom') {
    customApiBaseUrl.value = normalizedBaseUrl
    customModel.value = normalizedModel
  }

  ElMessage.success('設定已儲存，重新整理後生效')
  showSettings.value = false
}

const testConnection = async () => {
  testingConnection.value = true
  connectionStatus.value = ''

  try {
    const targetApiUrl = (
      serverType.value === 'official'
        ? OFFICIAL_API_URL
        : apiBaseUrl.value
    ).trim()

    if (!targetApiUrl) {
      throw new Error('請先輸入後端伺服器位址')
    }

    const healthUrl = `${targetApiUrl.replace(/\/api\/?$/, '')}/api/health`
    const response = await fetch(healthUrl)
    if (response.ok) {
      connectionStatus.value = 'success'
      ElMessage.success('伺服器連線成功！')
    } else {
      connectionStatus.value = 'error'
      ElMessage.error('伺服器連線失敗')
    }
  } catch (error) {
    connectionStatus.value = 'error'
    ElMessage.error('無法連線到伺服器：' + error.message)
  } finally {
    testingConnection.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleString('zh-TW')
}
</script>

<template>
  <div class="app-container">
    <div class="app-glow glow-left"></div>
    <div class="app-glow glow-right"></div>

    <header class="app-header">
      <div class="header-content">
        <button class="brand-lockup" type="button" @click="goToHome">
          <span class="brand-mark">TC</span>
          <span class="brand-copy">
            <span class="brand-kicker">AI Requirement Launchpad</span>
            <span class="logo">TaskCompass</span>
          </span>
        </button>

        <nav class="header-nav">
          <el-button @click="goToHome" text size="large">
            <el-icon><HomeFilled /></el-icon>
            首頁
          </el-button>
          <el-button @click="viewProjects" text size="large">
            <el-icon><Document /></el-icon>
            歷史任務
          </el-button>
          <el-button @click="openSettings" text size="large">
            <el-icon><Setting /></el-icon>
            設定
          </el-button>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="app-footer">
      <p class="footer-brand">TaskCompass | 任務羅盤</p>
      <p class="footer-copy">把模糊想法整理成可執行的需求簡報。</p>
    </footer>

    <el-dialog v-model="showProjectList" title="歷史任務列表" width="640px">
      <div v-if="projects.length === 0" class="empty-projects">
        <el-empty description="目前沒有任務紀錄" />
      </div>
      <div v-else class="project-list">
        <article class="project-item" v-for="(project, index) in projects" :key="project.id">
          <div class="project-info" @click="viewProject(project.id)">
            <div class="project-name">{{ project.idea.substring(0, 56) }}{{ project.idea.length > 56 ? '...' : '' }}</div>
            <div class="project-date">最近開啟：{{ formatDate(project.lastVisited) }}</div>
          </div>
          <el-button @click="deleteProject(project.id, index)" type="danger" size="small">刪除</el-button>
        </article>
      </div>
    </el-dialog>

    <el-dialog v-model="showSettings" title="系統設定" width="640px">
      <el-form label-position="top">
        <el-form-item label="伺服器類型">
          <el-radio-group v-model="serverType">
            <el-radio label="official">官方伺服器</el-radio>
            <el-radio label="custom">自訂伺服器</el-radio>
          </el-radio-group>
          <div class="form-tip">官方伺服器會使用環境變數中的 API 位址：{{ OFFICIAL_API_URL }}</div>
        </el-form-item>

        <el-form-item label="後端伺服器位址" v-if="serverType === 'custom'">
          <el-input v-model="apiBaseUrl" :placeholder="OFFICIAL_API_URL" />
          <div class="form-tip">請輸入完整 API 位址，結尾需包含「/api」。</div>
        </el-form-item>

        <el-divider>OpenAI API 設定</el-divider>

        <el-form-item label="AI 來源">
          <el-radio-group v-model="apiConfigType">
            <el-radio label="default">使用伺服器預設設定</el-radio>
            <el-radio label="custom">使用我自己的 OpenAI API</el-radio>
          </el-radio-group>
          <div class="form-tip">若要使用自己的 OpenAI API，請把上方伺服器切換成你的本地或自訂後端。</div>
        </el-form-item>

        <template v-if="apiConfigType === 'custom'">
          <el-form-item label="OpenAI API Key">
            <el-input v-model="customApiKey" type="password" placeholder="sk-..." show-password />
            <div class="form-tip">較安全的做法是直接寫進後端 `.env`。這裡的自訂欄位只適合你自己的本地或自建後端。</div>
          </el-form-item>
          <el-form-item label="OpenAI API 位址">
            <el-input v-model="customApiBaseUrl" placeholder="https://api.openai.com/v1" />
            <div class="form-tip">若使用 OpenAI 官方 API，通常保持 `https://api.openai.com/v1` 即可。</div>
          </el-form-item>
          <el-form-item label="模型名稱">
            <el-input v-model="customModel" placeholder="gpt-4o-mini" />
            <div class="form-tip">預設建議 `gpt-4o-mini`，成本較低，適合這個專案的問答與摘要流程。</div>
          </el-form-item>
        </template>

        <el-form-item label="測試後端連線">
          <el-button @click="testConnection" :loading="testingConnection" type="primary">
            測試連線
          </el-button>
          <div v-if="connectionStatus === 'success'" class="connection-status success">
            <el-icon><CircleCheck /></el-icon> 連線成功
          </div>
          <div v-if="connectionStatus === 'error'" class="connection-status error">
            <el-icon><CircleClose /></el-icon> 連線失敗
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showSettings = false" type="info">取消</el-button>
          <el-button type="primary" @click="saveSettings">儲存設定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style>
.app-container {
  position: relative;
  min-height: 100vh;
  padding: 28px 28px 20px;
  overflow: hidden;
}

.app-glow {
  position: fixed;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  filter: blur(48px);
  opacity: 0.46;
  pointer-events: none;
  z-index: 0;
}

.glow-left {
  top: -140px;
  left: -120px;
  background: rgba(255, 184, 217, 0.8);
}

.glow-right {
  top: 24%;
  right: -140px;
  background: rgba(255, 119, 191, 0.5);
}

.app-header,
.app-main,
.app-footer {
  position: relative;
  z-index: 1;
}

.app-header {
  max-width: 1240px;
  margin: 0 auto 34px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 22px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: var(--surface-shadow-soft);
  backdrop-filter: blur(18px);
}

.brand-lockup {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 18px;
  background: linear-gradient(145deg, #2d2845, #4a46df);
  color: #fff;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  box-shadow: 0 18px 40px rgba(59, 54, 153, 0.24);
}

.brand-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.05;
}

.brand-kicker {
  color: var(--brand-pink);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.logo {
  margin-top: 6px;
  color: var(--ink-strong);
  font-size: 1.42rem;
  font-weight: 800;
}

.header-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
}

.header-nav .el-button {
  min-width: 110px;
}

.app-main {
  max-width: 1240px;
  margin: 0 auto;
}

.app-footer {
  max-width: 1240px;
  margin: 28px auto 0;
  padding: 0 12px 20px;
  text-align: center;
}

.footer-brand {
  margin: 0;
  color: var(--ink-strong);
  font-size: 0.95rem;
  font-weight: 700;
}

.footer-copy {
  margin: 6px 0 0;
  color: var(--ink-soft);
  font-size: 0.9rem;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.project-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 18px 18px 22px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(220, 194, 231, 0.38);
}

.project-info {
  flex: 1;
  cursor: pointer;
}

.project-name {
  color: var(--ink-strong);
  font-size: 1rem;
  font-weight: 700;
  word-break: break-word;
}

.project-date {
  margin-top: 4px;
  color: var(--ink-soft);
  font-size: 0.88rem;
}

.empty-projects {
  padding: 28px 0;
}

.form-tip {
  margin-top: 8px;
  color: var(--ink-soft);
  font-size: 0.85rem;
}

.connection-status {
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ink-body);
}

.connection-status.success {
  color: #2d9860;
}

.connection-status.error {
  color: #d04c6e;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 900px) {
  .app-container {
    padding: 18px 14px 18px;
  }

  .app-glow {
    width: 300px;
    height: 300px;
    filter: blur(42px);
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    border-radius: 26px;
  }

  .header-nav {
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .app-container {
    padding: 14px 10px 14px;
  }

  .app-header {
    margin-bottom: 18px;
  }

  .brand-lockup {
    width: 100%;
    justify-content: flex-start;
    gap: 12px;
  }

  .brand-copy {
    align-items: flex-start;
  }

  .brand-mark {
    width: 46px;
    height: 46px;
    border-radius: 16px;
    font-size: 0.92rem;
  }

  .brand-kicker {
    font-size: 0.64rem;
    letter-spacing: 0.12em;
  }

  .logo {
    font-size: 1.18rem;
    margin-top: 4px;
  }

  .header-nav {
    justify-content: stretch;
    gap: 10px;
  }

  .header-nav .el-button {
    min-width: auto;
    flex: 1 1 100%;
    justify-content: flex-start;
    margin: 0;
    padding-inline: 14px;
  }

  .app-footer {
    margin-top: 18px;
    padding: 0 4px 10px;
  }

  .footer-brand {
    font-size: 0.88rem;
  }

  .project-item {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }

  .project-item .el-button {
    width: 100%;
  }

  .dialog-footer {
    flex-direction: column-reverse;
  }

  .dialog-footer .el-button {
    width: 100%;
    margin: 0;
  }

  .form-tip,
  .project-date {
    line-height: 1.55;
  }
}

@media (max-width: 420px) {
  .header-content {
    padding: 14px;
  }

  .brand-lockup {
    align-items: flex-start;
  }

  .brand-copy {
    min-width: 0;
  }

  .brand-kicker,
  .logo {
    word-break: break-word;
  }
}
</style>
