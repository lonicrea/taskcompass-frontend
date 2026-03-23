<template>
  <div class="overview">
    <div class="header">
      <span class="page-kicker">Timeline Overview</span>
      <h2>任務總覽</h2>
      <p>查看需求對齊的完整歷程。</p>
    </div>

    <el-card class="overview-container" v-loading="loading">
      <!-- 项目基本信息 -->
      <div class="timeline-section">
        <div class="timeline-header">
          <span class="icon-text">📋</span>
          <h3>任務資訊</h3>
        </div>
        <div class="project-info">
          <p><strong>任務 ID:</strong> {{ sessionId }}</p>
        </div>
      </div>

      <!-- 原始想法 -->
      <div class="timeline-section">
        <div class="timeline-header">
          <span class="icon-text">💡</span>
          <h3>初始想法</h3>
        </div>
        <div class="idea-content">
          {{ sessionData.idea }}
        </div>
      </div>

      <!-- 对齐过程时间线 -->
      <div class="timeline-section">
        <div class="timeline-header">
          <span class="icon-text">🔗</span>
          <h3>需求對齊歷程</h3>
        </div>

        <div class="timeline">
          <!-- 第一轮问答 -->
          <div class="timeline-item" v-for="(round, index) in timelineData" :key="index">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="round-title">第 {{ index + 1 }} 輪對齊</div>
              
              <!-- 问答部分 -->
              <div class="qa-section">
                <div class="section-header" @click="toggleQa(index)">
                  <h4><span class="icon-text">💬</span> 問答內容</h4>
                  <el-icon class="toggle-icon" :class="{ expanded: expandedQa.includes(index) }">
                    <ArrowRight />
                  </el-icon>
                </div>
                <el-collapse-transition>
                  <div class="qa-list" v-show="expandedQa.includes(index)">
                    <div class="qa-item" v-for="(qa, qaIndex) in round.qas" :key="qaIndex">
                      <div class="question">
                        <span class="qa-label">Q{{ qaIndex + 1 }}:</span>
                        {{ qa.question }}
                      </div>
                      <div class="answer">
                        <span class="qa-label">A{{ qaIndex + 1 }}:</span>
                        {{ qa.answer }}
                      </div>
                    </div>
                  </div>
                </el-collapse-transition>
              </div>

              <!-- 报告部分 -->
              <div class="report-section" v-if="round.report">
                <div class="section-header" @click="toggleReport(index)">
                  <h4><span class="icon-text">📝</span> 階段報告</h4>
                  <el-icon class="toggle-icon" :class="{ expanded: expandedReport.includes(index) }">
                    <ArrowRight />
                  </el-icon>
                </div>
                <el-collapse-transition>
                  <div class="report-content markdown-body" v-show="expandedReport.includes(index)" v-html="renderMarkdown(round.report)"></div>
                </el-collapse-transition>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <el-button @click="downloadFullProcess" type="primary" size="large">
          下載完整對齊歷程
        </el-button>
        <el-button @click="goBack" size="large">返回結果頁</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { apiService } from '@/utils/api'
import { ArrowRight } from '@element-plus/icons-vue'
import MarkdownIt from 'markdown-it'

const route = useRoute()
const router = useRouter()
const sessionId = route.params.sessionId

const loading = ref(true)
const sessionData = ref({
  idea: '',
  created_at: '',
  updated_at: '',
  questions: [],
  answers: [],
  reports: []
})
const rounds = ref([]) // 存储轮次数据

// 折叠状态
const expandedQa = ref([]) // 默认全部折叠
const expandedReport = ref([]) // 默认全部折叠

// 切换问答折叠状态
const toggleQa = (index) => {
  const idx = expandedQa.value.indexOf(index)
  if (idx > -1) {
    expandedQa.value.splice(idx, 1)
  } else {
    expandedQa.value.push(index)
  }
}

// 切换报告折叠状态
const toggleReport = (index) => {
  const idx = expandedReport.value.indexOf(index)
  if (idx > -1) {
    expandedReport.value.splice(idx, 1)
  } else {
    expandedReport.value.push(index)
  }
}

// Markdown 渲染器
const md = new MarkdownIt()

const renderMarkdown = (text) => {
  return md.render(text)
}

const formatAnswerForDisplay = (answer) => {
  if (answer?.auto_infer) {
    return '已使用預設推測，由 AI 依上下文補足'
  }

  if (typeof answer === 'string') {
    return answer
  }

  return answer?.answer || ''
}

// 计算时间线数据（使用轮次数据，保持问答对应关系）
const timelineData = computed(() => {
  if (rounds.value.length > 0) {
    // 使用轮次数据
    return rounds.value.map(round => ({
      qas: round.questions.map((q, index) => ({
        question: q?.text || '',
        answer: formatAnswerForDisplay(round.answers[index])
      })),
      report: round.report,
      round_number: round.round_number,
      created_at: round.created_at
    }))
  }
  
  // 降级到旧逻辑（如果没有轮次数据）
  const data = []
  const reports = sessionData.value.reports || []
  const answers = sessionData.value.answers || []
  const questions = sessionData.value.questions || []

  for (let i = 0; i < reports.length; i++) {
    const roundData = {
      qas: [],
      report: reports[i]
    }
    
    const qaCount = Math.min(questions.length, answers.length)
    for (let j = 0; j < qaCount; j++) {
      roundData.qas.push({
        question: questions[j]?.text || '',
        answer: formatAnswerForDisplay(answers[j])
      })
    }
    
    data.push(roundData)
  }

  if (reports.length === 0 && answers.length > 0) {
    const roundData = {
      qas: [],
      report: null
    }
    const qaCount = Math.min(questions.length, answers.length)
    for (let j = 0; j < qaCount; j++) {
      roundData.qas.push({
        question: questions[j]?.text || '',
        answer: formatAnswerForDisplay(answers[j])
      })
    }
    data.push(roundData)
  }

  return data
})

onMounted(async () => {
  document.title = '任務總覽 | TaskCompass'
  
  // 解析 URL 中的后端地址参数
  const urlParams = new URLSearchParams(window.location.search)
  const encodedApiUrl = urlParams.get('api')
  if (encodedApiUrl) {
    try {
      const apiUrl = decodeURIComponent(atob(encodedApiUrl))
      localStorage.setItem('clarityai_api_url', apiUrl)
      ElMessage.success('已自動設定後端伺服器位址')
    } catch (error) {
      console.error('Error parsing API URL:', error)
    }
  }
  
  try {
    const response = await apiService.getSessionData(sessionId)
    sessionData.value = response.data
    
    // 加载轮次数据（保持问答对应关系）
    try {
      const roundsResponse = await apiService.getSessionRounds(sessionId)
      rounds.value = roundsResponse.data.rounds || []
    } catch (roundsError) {
      console.warn('Failed to load rounds data, using fallback:', roundsError)
      // 降级到旧逻辑
    }
    
    // 更新项目最后访问时间
    const savedProjects = localStorage.getItem('clarityai_projects')
    if (savedProjects) {
      let projects = JSON.parse(savedProjects)
      const projectIndex = projects.findIndex(p => p.id === sessionId)
      if (projectIndex > -1) {
        projects[projectIndex].lastVisited = new Date().toISOString()
        localStorage.setItem('clarityai_projects', JSON.stringify(projects))
      }
    }
  } catch (error) {
    console.error('Error loading session data:', error)
    ElMessage.error('載入任務資料失敗')
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW')
}

// 下载完整对齐过程
const downloadFullProcess = () => {
  let markdownContent = '# 任務需求對齊完整歷程\n\n'
  
  // 项目信息
  markdownContent += '## 任務資訊\n\n'
  markdownContent += `- **任務 ID:** ${sessionId}\n`
  // 原始想法
  markdownContent += '## 初始想法\n\n'
  markdownContent += `${sessionData.value.idea}\n\n`
  
  // 对齐过程
  markdownContent += '## 需求對齊歷程\n\n'
  
  // 优先使用轮次数据
  if (rounds.value.length > 0) {
    rounds.value.forEach((round, index) => {
      markdownContent += `### 第 ${round.round_number || (index + 1)} 輪對齊\n\n`
      markdownContent += `**時間：** ${formatDate(round.created_at)}\n\n`
      
      // 问答内容
      markdownContent += '#### 問答內容\n\n'
      round.questions.forEach((q, qIndex) => {
        const a = formatAnswerForDisplay(round.answers[qIndex])
        markdownContent += `**Q${qIndex + 1}:** ${q.text || ''}\n\n`
        markdownContent += `**A${qIndex + 1}:** ${a}\n\n`
      })
      
      // 阶段性报告
      if (round.report) {
        markdownContent += '#### 階段報告\n\n'
        markdownContent += `${round.report}\n\n`
      }
      
      markdownContent += '---\n\n'
    })
  } else {
    // 降级到旧逻辑
    const reports = sessionData.value.reports || []
    const answers = sessionData.value.answers || []
    const questions = sessionData.value.questions || []
    
    for (let i = 0; i < reports.length; i++) {
      markdownContent += `### 第 ${i + 1} 輪對齊\n\n`
      
      // 问答内容
      markdownContent += '#### 問答內容\n\n'
      const qaCount = Math.min(questions.length, answers.length)
      for (let j = 0; j < qaCount; j++) {
        const q = questions[j]?.text || ''
        const a = formatAnswerForDisplay(answers[j])
        markdownContent += `**Q${j + 1}:** ${q}\n\n`
        markdownContent += `**A${j + 1}:** ${a}\n\n`
      }
      
      // 阶段性报告
      markdownContent += '#### 階段報告\n\n'
      markdownContent += `${reports[i]}\n\n`
      
      markdownContent += '---\n\n'
    }
    
    // 如果没有报告但有问答
    if (reports.length === 0 && answers.length > 0) {
      markdownContent += '### 問答內容\n\n'
      const qaCount = Math.min(questions.length, answers.length)
      for (let j = 0; j < qaCount; j++) {
        const q = questions[j]?.text || ''
        const a = formatAnswerForDisplay(answers[j])
        markdownContent += `**Q${j + 1}:** ${q}\n\n`
        markdownContent += `**A${j + 1}:** ${a}\n\n`
      }
    }
  }
  
  // 创建 Blob 对象并下载
  const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = `project_overview_${sessionId.substring(0, 8)}.md`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
  
  ElMessage.success('完整對齊歷程下載成功！')
}

const goBack = () => {
  router.push({ name: 'Results', params: { sessionId } })
}
</script>

<style scoped>
.overview {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 12px 48px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  padding: 28px 24px;
  border-radius: 30px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(255, 244, 250, 0.86));
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: var(--surface-shadow-soft);
}

.page-kicker {
  display: inline-flex;
  padding: 0.52rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  color: var(--brand-pink);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.header h2 {
  margin: 16px 0 10px;
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--ink-strong);
  line-height: 1.02;
}

.header p {
  max-width: 620px;
  margin: 0 auto;
  color: var(--ink-body);
}

.icon-text {
  font-size: 1.5rem;
  margin-right: 8px;
}

.timeline-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(220, 201, 229, 0.4);
}

.timeline-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.timeline-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.timeline-header h3 {
  margin: 0;
  color: var(--ink-strong);
  font-size: 1.3rem;
}

.timeline-note {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: #ecf5ff;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #409eff;
}

.timeline-note .el-icon {
  font-size: 1.1rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
  margin-bottom: 10px;
}

.section-header:hover {
  background-color: rgba(255, 244, 250, 0.82);
}

.section-header h4 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink-strong);
}

.toggle-icon {
  transition: transform 0.3s;
  font-size: 1.2rem;
  color: var(--ink-soft);
}

.toggle-icon.expanded {
  transform: rotate(90deg);
}

.project-info {
  background-color: rgba(255, 255, 255, 0.74);
  padding: 15px;
  border-radius: 20px;
}

.project-info p {
  margin: 8px 0;
  color: var(--ink-body);
  overflow-wrap: anywhere;
}

.idea-content {
  background: linear-gradient(180deg, rgba(255, 245, 250, 0.88), rgba(255, 255, 255, 0.8));
  padding: 20px;
  border-radius: 24px;
  border-left: 4px solid var(--brand-pink);
  line-height: 1.8;
  color: var(--ink-strong);
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, rgba(255, 191, 222, 0.1), rgba(195, 171, 224, 0.9));
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
}

.timeline-dot {
  position: absolute;
  left: -26px;
  top: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-pink), var(--brand-rose));
  border: 3px solid #fff;
  box-shadow: 0 14px 24px rgba(204, 47, 122, 0.26);
}

.timeline-content {
  background: rgba(255, 255, 255, 0.72);
  padding: 20px;
  border-radius: 26px;
  border: 1px solid rgba(220, 201, 229, 0.34);
}

.round-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--brand-pink);
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(220, 201, 229, 0.34);
}

.qa-section,
.report-section {
  margin-bottom: 20px;
}

.qa-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.qa-item {
  background-color: rgba(255, 255, 255, 0.82);
  padding: 15px;
  border-radius: 20px;
  border: 1px solid rgba(220, 201, 229, 0.34);
}

.question,
.answer {
  margin: 8px 0;
  line-height: 1.6;
}

.question {
  color: var(--ink-strong);
  font-weight: 500;
}

.answer {
  color: #2d9860;
  background-color: rgba(239, 255, 245, 0.92);
  padding: 10px;
  border-radius: 14px;
}

.qa-label {
  font-weight: bold;
  margin-right: 8px;
}

.report-content {
  background-color: rgba(255, 255, 255, 0.82);
  padding: 15px;
  border-radius: 20px;
  border: 1px solid rgba(220, 201, 229, 0.34);
  line-height: 1.8;
  color: var(--ink-body);
}

.markdown-body {
  white-space: normal;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: var(--ink-strong);
}

.markdown-body h1 {
  font-size: 1.5rem;
}

.markdown-body h2 {
  font-size: 1.3rem;
}

.markdown-body h3 {
  font-size: 1.1rem;
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body li {
  margin-top: 4px;
  margin-bottom: 4px;
}

.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 0.9em;
  background-color: rgba(244, 239, 248, 0.96);
  border-radius: 10px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 0.9em;
  line-height: 1.45;
  background-color: rgba(247, 242, 250, 0.92);
  border-radius: 18px;
}

.markdown-body pre code {
  display: inline;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border-radius: 0;
}

.markdown-body blockquote {
  padding: 0 1em;
  color: var(--ink-soft);
  border-left: 0.25em solid rgba(204, 47, 122, 0.26);
  margin: 0 0 16px 0;
}

.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
}

.markdown-body table th,
.markdown-body table td {
  padding: 8px 12px;
  border: 1px solid rgba(214, 191, 226, 0.4);
}

.markdown-body table th {
  background-color: rgba(255, 242, 249, 0.84);
  font-weight: 600;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .overview {
    padding: 0 0 36px;
  }

  .header {
    padding: 24px 18px;
    border-radius: 24px;
  }

  .timeline {
    padding-left: 24px;
  }

  .timeline-dot {
    left: -21px;
  }

  .actions {
    flex-direction: column;
  }

  .actions .el-button {
    width: 100%;
    margin: 0;
  }
}

@media (max-width: 520px) {
  .header {
    padding: 20px 16px;
    border-radius: 22px;
    margin-bottom: 16px;
  }

  .header h2 {
    margin: 14px 0 8px;
    font-size: clamp(1.8rem, 9vw, 2.3rem);
  }

  .header p {
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .timeline-section {
    margin-bottom: 22px;
    padding-bottom: 16px;
  }

  .timeline-header {
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .timeline-header h3 {
    font-size: 1.12rem;
    line-height: 1.4;
  }

  .icon-text {
    font-size: 1.25rem;
    margin-right: 6px;
  }

  .project-info,
  .idea-content,
  .timeline-content,
  .qa-item,
  .report-content {
    border-radius: 18px;
  }

  .project-info,
  .report-content {
    padding: 14px;
  }

  .idea-content {
    padding: 16px;
    line-height: 1.72;
    font-size: 0.96rem;
  }

  .timeline {
    padding-left: 18px;
  }

  .timeline::before {
    left: 5px;
  }

  .timeline-item {
    margin-bottom: 22px;
  }

  .timeline-dot {
    left: -16px;
    width: 14px;
    height: 14px;
    border-width: 2px;
  }

  .timeline-content {
    padding: 14px;
  }

  .round-title {
    font-size: 1.02rem;
    margin-bottom: 12px;
    padding-bottom: 8px;
  }

  .section-header {
    align-items: flex-start;
    padding: 10px 12px;
    border-radius: 12px;
    margin-bottom: 8px;
  }

  .section-header h4 {
    font-size: 0.98rem;
    line-height: 1.45;
  }

  .qa-list {
    gap: 10px;
  }

  .qa-item {
    padding: 12px;
  }

  .question,
  .answer {
    font-size: 0.94rem;
    line-height: 1.65;
  }

  .answer {
    padding: 8px 10px;
    border-radius: 12px;
  }

  .markdown-body h1 {
    font-size: 1.28rem;
  }

  .markdown-body h2 {
    font-size: 1.14rem;
  }

  .markdown-body h3 {
    font-size: 1rem;
  }

  .markdown-body pre {
    padding: 12px;
    border-radius: 14px;
    font-size: 0.84em;
  }

  .markdown-body table {
    display: block;
    overflow-x: auto;
  }

  .markdown-body table th,
  .markdown-body table td {
    min-width: 120px;
    padding: 8px 10px;
    font-size: 0.9rem;
  }
}
</style>
