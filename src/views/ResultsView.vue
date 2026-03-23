<template>
  <div class="results">
    <div class="header">
      <span class="page-kicker">Task Brief</span>
      <h2>需求分析簡報</h2>
      <p>這份內容可以直接作為後續 AI、設計、開發或寫作工作的任務基礎。</p>
    </div>
    
    <el-card class="report-container" v-loading="loading">
      <div class="report-content markdown-body" v-html="renderMarkdown(reportContent)"></div>
    </el-card>
    
    <div class="actions">
      <el-button
        @click="generatePdf"
        type="success"
        size="large"
        :loading="pdfGenerating"
        :disabled="loading"
      >
        產生報告文件
      </el-button>
      <el-button
        @click="continueRefinement"
        size="large"
        :disabled="loading"
      >
        繼續細化需求
      </el-button>
      <el-button
        @click="shareProject"
        type="info"
        size="large"
        :disabled="loading"
      >
        分享任務
      </el-button>
      <el-button
        @click="viewOverview"
        type="warning"
        size="large"
        :disabled="loading"
      >
        查看任務總覽
      </el-button>
    </div>
    
    <!-- 下载链接 -->
    <div v-if="pdfUrl" class="pdf-download">
      <p>報告已產生：</p>
      <div class="download-options">
        <el-button @click="downloadFullReport" type="primary" size="large">下載完整報告</el-button>
        <el-button @click="downloadFinalReport" type="success" size="large">下載最終報告</el-button>
      </div>
    </div>
    
    <!-- 继续细化需求对话框 -->
    <el-dialog 
      v-model="showRefinementDialog" 
      title="繼續細化需求" 
      width="600px"
    >
      <p>請告訴我您還想進一步細化或修改的部分：</p>
      <el-input
        v-model="refinementFeedback"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 8 }"
        placeholder="例如：我對前面某項需求有新的想法..."
        maxlength="1000"
        show-word-limit
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showRefinementDialog = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="submitRefinement"
            :loading="refinementSubmitting"
          >
            確認送出
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { apiService } from '@/utils/api'
import MarkdownIt from 'markdown-it'

const route = useRoute()
const router = useRouter()
const sessionId = route.params.sessionId

const reportContent = ref('')
const loading = ref(true)
const pdfGenerating = ref(false)
const pdfUrl = ref(null)

// 继续细化需求相关
const showRefinementDialog = ref(false)
const refinementFeedback = ref('')
const refinementSubmitting = ref(false)

// Markdown 渲染器
const md = new MarkdownIt()

const renderMarkdown = (text) => {
  return md.render(text)
}

onMounted(async () => {
  document.title = '需求分析簡報 | TaskCompass'
  try {
    // 从后端获取报告内容
    const response = await apiService.getSessionData(sessionId)
    // 从报告数组中获取最新的报告
    const reports = response.data.reports
    if (reports && reports.length > 0) {
      reportContent.value = reports[reports.length - 1] // 获取最新报告
    } else {
      reportContent.value = '目前沒有分析報告，請先完成問題回答。'
    }
  } catch (error) {
    console.error('Error loading report:', error)
    ElMessage.error('載入報告失敗')
    reportContent.value = '載入報告時發生錯誤，請稍後再試。'
  } finally {
    loading.value = false
  }
})

const generatePdf = async () => {
  pdfGenerating.value = true

  try {
    const response = await apiService.generatePdf(sessionId)
    pdfUrl.value = response.data.pdf_url

    ElMessage.success('PDF 文件產生成功！')
  } catch (error) {
    console.error('Error generating PDF:', error)
    ElMessage.error('產生 PDF 文件失敗，請稍後再試')
  } finally {
    pdfGenerating.value = false
  }
}

// 生成完整报告的Markdown内容
const generateFullReport = (sessionData) => {
  let markdownContent = '# 任務需求簡報\n\n';
  
  // 添加原始想法
  markdownContent += '## 1. 初始想法\n\n';
  markdownContent += `${sessionData.idea}\n\n`;
  
  // 添加问答内容
  if (sessionData.questions && sessionData.answers) {
    markdownContent += '## 2. 需求澄清問答\n\n';
    
    const minLen = Math.min(sessionData.questions.length, sessionData.answers.length);
    for (let i = 0; i < minLen; i++) {
      const q = sessionData.questions[i];
      const a = sessionData.answers[i];
      
      const questionText = typeof q === 'object' ? q.text : q;
      const answerText = typeof a === 'object' ? a.answer : a;
      
      markdownContent += `**Q${i+1}: ${questionText}**\n`;
      markdownContent += `A${i+1}: ${answerText}\n\n`;
    }
  }
  
  // 添加分析报告
  if (sessionData.reports && sessionData.reports.length > 0) {
    markdownContent += '## 3. 階段分析報告\n\n';
    
    for (let i = 0; i < sessionData.reports.length; i++) {
      markdownContent += `### 第 ${i + 1} 次分析\n`;
      markdownContent += `${sessionData.reports[i]}\n\n`;
    }
  }
  
  return markdownContent;
};

// 生成最终报告的Markdown内容（仅包含最终总结）
const generateFinalReport = (sessionData) => {
  let markdownContent = '# 任務需求簡報（最終版）\n\n';
  
  // 添加原始想法
  markdownContent += '## 任務概述\n\n';
  markdownContent += `${sessionData.idea}\n\n`;
  
  // 添加最终分析报告
  if (sessionData.reports && sessionData.reports.length > 0) {
    markdownContent += '## 需求分析總結\n\n';
    
    // 使用最新的报告作为最终总结
    const latestReport = sessionData.reports[sessionData.reports.length - 1];
    markdownContent += `${latestReport}\n\n`;
  } else {
    markdownContent += '目前沒有分析報告。\n\n';
  }
  
  return markdownContent;
};

// 下载完整报告
const downloadFullReport = async () => {
  try {
    const response = await apiService.getSessionData(sessionId);
    const sessionData = response.data;
    
    const markdownContent = generateFullReport(sessionData);
    
    // 创建Blob对象并下载
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `requirement_document_full_${sessionId.substring(0, 8)}.md`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    ElMessage.success('完整報告下載成功！');
  } catch (error) {
    console.error('Error generating full report:', error);
    ElMessage.error('產生完整報告失敗，請稍後再試');
  }
};

// 下载最终报告
const downloadFinalReport = async () => {
  try {
    const response = await apiService.getSessionData(sessionId);
    const sessionData = response.data;
    
    const markdownContent = generateFinalReport(sessionData);
    
    // 创建Blob对象并下载
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `requirement_document_final_${sessionId.substring(0, 8)}.md`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    ElMessage.success('最終報告下載成功！');
  } catch (error) {
    console.error('Error generating final report:', error);
    ElMessage.error('產生最終報告失敗，請稍後再試');
  }
};

const continueRefinement = () => {
  // 打开对话框让用户输入反馈
  showRefinementDialog.value = true
  refinementFeedback.value = ''
}

// 分享项目
const shareProject = async () => {
  const currentApiUrl = localStorage.getItem('clarityai_api_url') || 'http://127.0.0.1:5000/api'
  
  // 将后端地址编码后添加到链接中
  const encodedApiUrl = btoa(encodeURIComponent(currentApiUrl))
  const shareUrl = `${window.location.origin}/overview/${sessionId}?api=${encodedApiUrl}`
  
  try {
    await navigator.clipboard.writeText(shareUrl)
    ElMessage.success('連結已複製到剪貼簿，可以直接分享給其他人。')
  } catch (error) {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = shareUrl
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('連結已複製到剪貼簿，可以直接分享給其他人。')
  }
}

// 查看项目总览
const viewOverview = () => {
  router.push({ name: 'Overview', params: { sessionId } })
}

const submitRefinement = async () => {
  if (!refinementFeedback.value.trim()) {
    ElMessage.warning('請輸入想進一步細化的需求')
    return
  }
  
  refinementSubmitting.value = true
  
  try {
    // 提交反馈
    const response = await apiService.continueWithFeedback(sessionId, refinementFeedback.value)
    
    // 关闭对话框
    showRefinementDialog.value = false
    refinementFeedback.value = ''
    
    ElMessage.success('已收到您的細化需求，正在產生新問題...')
    
    // 跳转到问题页面
    router.push({ name: 'Questions', params: { sessionId } })
  } catch (error) {
    console.error('Error submitting refinement:', error)
    ElMessage.error('提交細化需求失敗，請稍後再試')
  } finally {
    refinementSubmitting.value = false
  }
}
</script>

<style scoped>
.results {
  max-width: 1040px;
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
  max-width: 650px;
  margin: 0 auto;
  color: var(--ink-body);
}

.report-container {
  margin-bottom: 30px;
  border-radius: 34px !important;
}

.report-content {
  line-height: 1.8;
  color: var(--ink-body);
  overflow-wrap: anywhere;
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
  display: block;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
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
  margin-bottom: 20px;
}

.pdf-download {
  text-align: center;
  padding: 22px;
  background: rgba(255, 255, 255, 0.76);
  border-radius: 28px;
  border: 1px solid rgba(218, 197, 228, 0.34);
  box-shadow: var(--surface-shadow-soft);
}

.pdf-download a {
  color: #409eff;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
}

.pdf-download a:hover {
  text-decoration: underline;
}

.download-options {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .results {
    padding: 0 0 36px;
  }

  .header {
    padding: 24px 18px;
    border-radius: 24px;
  }

  .actions {
    flex-direction: column;
  }

  .actions .el-button,
  .download-options .el-button {
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

  .report-container {
    margin-bottom: 20px;
    border-radius: 24px !important;
  }

  .report-content {
    font-size: 0.95rem;
    line-height: 1.75;
  }

  .markdown-body h1 {
    font-size: 1.34rem;
  }

  .markdown-body h2 {
    font-size: 1.18rem;
  }

  .markdown-body h3 {
    font-size: 1.04rem;
  }

  .markdown-body h1,
  .markdown-body h2,
  .markdown-body h3,
  .markdown-body h4,
  .markdown-body h5,
  .markdown-body h6 {
    margin-top: 20px;
    margin-bottom: 12px;
  }

  .markdown-body p,
  .markdown-body ul,
  .markdown-body ol,
  .markdown-body blockquote,
  .markdown-body table {
    margin-bottom: 14px;
  }

  .markdown-body pre {
    padding: 12px;
    border-radius: 14px;
    font-size: 0.84em;
  }

  .markdown-body table th,
  .markdown-body table td {
    min-width: 120px;
    padding: 8px 10px;
    font-size: 0.9rem;
  }

  .pdf-download {
    padding: 18px 14px;
    border-radius: 22px;
  }

  .download-options {
    gap: 10px;
  }

  .dialog-footer {
    display: flex;
    flex-direction: column-reverse;
    gap: 10px;
  }

  .dialog-footer .el-button {
    width: 100%;
    margin: 0;
  }
}
</style>
