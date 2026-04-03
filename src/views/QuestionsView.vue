<template>
  <div class="questions">
    <div class="header">
      <span class="page-kicker">Interactive Clarification</span>
      <h2>需求澄清問答</h2>
      <p>逐題補完任務背景、目標受眾、限制條件與交付形式，讓最終簡報更精準。</p>
    </div>
    
    <el-card class="questions-container" v-loading="loading">
      <div v-for="(question, index) in questions" :key="question.id" class="question-item">
        <h4>{{ index + 1 }}. {{ question.text }}</h4>
        
        <!-- 选择题（多选） -->
        <el-checkbox-group 
          v-if="question.type === 'choice'" 
          v-model="answers[question.id]"
          class="question-options"
          @change="handleChoiceChange(question)"
        >
          <el-checkbox 
            v-for="option in question.options" 
            :key="option" 
            :value="option"
            border
          >
            {{ option }}
          </el-checkbox>
        </el-checkbox-group>
        <el-input
          v-if="question.type === 'choice' && hasOtherOption(question)"
          v-model="otherChoiceInputs[question.id]"
          :disabled="!isOtherSelected(question)"
          placeholder="請輸入其他內容..."
          class="question-input other-choice-input"
        />
        
        <!-- 填空題 -->
        <el-input
          v-else-if="question.type === 'fill_blank'"
          v-model="answers[question.id]"
          :disabled="autoInferAnswers[question.id]"
          placeholder="請輸入答案..."
          class="question-input"
          @input="handleManualInput(question.id)"
        />
        <div v-if="question.type === 'fill_blank'" class="question-meta">
          <button
            class="auto-infer-button"
            type="button"
            :class="{ active: autoInferAnswers[question.id] }"
            @click="toggleAutoInfer(question)"
          >
            {{ autoInferAnswers[question.id] ? '改為自行填寫' : '使用預設推測' }}
          </button>
          <span v-if="autoInferAnswers[question.id]" class="auto-infer-note">
            已交由 AI 依上下文合理補足這一題。
          </span>
        </div>
        
        <!-- 敘述題 -->
        <el-input
          v-else-if="question.type === 'narrative'"
          v-model="answers[question.id]"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6 }"
          :disabled="autoInferAnswers[question.id]"
          placeholder="請詳細描述..."
          class="question-textarea"
          @input="handleManualInput(question.id)"
        />
        <div v-if="question.type === 'narrative'" class="question-meta">
          <button
            class="auto-infer-button"
            type="button"
            :class="{ active: autoInferAnswers[question.id] }"
            @click="toggleAutoInfer(question)"
          >
            {{ autoInferAnswers[question.id] ? '改為自行填寫' : '使用預設推測' }}
          </button>
          <span v-if="autoInferAnswers[question.id]" class="auto-infer-note">
            已交由 AI 依上下文合理補足這一題。
          </span>
        </div>
        
        <!-- 預設文字框 -->
        <el-input
          v-else
          v-model="answers[question.id]"
          :disabled="autoInferAnswers[question.id]"
          placeholder="請輸入答案..."
          class="question-input"
          @input="handleManualInput(question.id)"
        />
        <div v-if="question.type !== 'choice' && question.type !== 'fill_blank' && question.type !== 'narrative'" class="question-meta">
          <button
            class="auto-infer-button"
            type="button"
            :class="{ active: autoInferAnswers[question.id] }"
            @click="toggleAutoInfer(question)"
          >
            {{ autoInferAnswers[question.id] ? '改為自行填寫' : '使用預設推測' }}
          </button>
          <span v-if="autoInferAnswers[question.id]" class="auto-infer-note">
            已交由 AI 依上下文合理補足這一題。
          </span>
        </div>
      </div>
      
      <div class="actions">
        <el-button 
          @click="submitAnswers" 
          type="primary" 
          size="large"
          :loading="submitting"
          :disabled="loading"
        >
          提交答案
        </el-button>
        
      </div>
    </el-card>
    
    <!-- 補充資訊對話框 -->
    <el-dialog 
      v-model="showFeedbackDialog" 
      title="補充資訊" 
      width="600px"
      :loading="feedbackSubmitting"
      @close="feedbackText = ''"
    >
      <el-input
        v-model="feedbackText"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 8 }"
        placeholder="請補充額外需求或修改方向..."
        maxlength="1000"
        show-word-limit
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showFeedbackDialog = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="submitFeedback"
            :loading="feedbackSubmitting"
          >
            確認送出
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { apiService } from '@/utils/api'

const STORAGE_KEYS = {
  apiUrl: 'taskcompass_api_url'
}

const route = useRoute()
const router = useRouter()
const sessionId = route.params.sessionId

const questions = ref([])
const answers = ref({})
const autoInferAnswers = ref({})
const otherChoiceInputs = ref({})
const loading = ref(true)
const submitting = ref(false)
const showFeedbackDialog = ref(false)
const feedbackText = ref('')
const feedbackSubmitting = ref(false)

onMounted(() => {
  document.title = '需求澄清問答 | TaskCompass'
  
  // 解析 URL 中的后端地址参数
  const urlParams = new URLSearchParams(window.location.search)
  const encodedApiUrl = urlParams.get('api')
  if (encodedApiUrl) {
    try {
      const apiUrl = decodeURIComponent(atob(encodedApiUrl))
      localStorage.setItem(STORAGE_KEYS.apiUrl, apiUrl)
      ElMessage.success('已自動設定後端伺服器位址')
      // 清除 URL 中的参数
      window.history.replaceState({}, '', window.location.pathname + window.location.hash)
    } catch (error) {
      console.error('Error parsing API URL:', error)
    }
  }
})

const isOtherOption = (option) => typeof option === 'string' && option.includes('其他')

const hasOtherOption = (question) => {
  return question.type === 'choice' && Array.isArray(question.options) && question.options.some(isOtherOption)
}

const isOtherSelected = (question) => {
  const selectedOptions = answers.value[question.id]
  return Array.isArray(selectedOptions) && selectedOptions.some(isOtherOption)
}

const handleChoiceChange = (question) => {
  if (!isOtherSelected(question)) {
    otherChoiceInputs.value[question.id] = ''
  }
}

// 计算是否已回答所有必填问题
const hasAnsweredAllRequired = computed(() => {
  return questions.value.length > 0 && questions.value.every(q => {
    if (autoInferAnswers.value[q.id]) {
      return true
    }

    const answer = answers.value[q.id]
    if (q.type === 'choice' && Array.isArray(answer)) {
      if (answer.length === 0) {
        return false
      }

      if (hasOtherOption(q) && answer.some(isOtherOption)) {
        return Boolean(otherChoiceInputs.value[q.id]?.trim())
      }

      return true
    }
    return answer !== undefined && answer !== null && answer.toString().trim() !== ''
  })
})

const getMissingQuestions = () => {
  return questions.value.filter(q => {
    if (autoInferAnswers.value[q.id]) {
      return false
    }

    const answer = answers.value[q.id]

    if (q.type === 'choice' && Array.isArray(answer)) {
      if (answer.length === 0) {
        return true
      }

      if (hasOtherOption(q) && answer.some(isOtherOption)) {
        return !otherChoiceInputs.value[q.id]?.trim()
      }

      return false
    }

    return answer === undefined || answer === null || answer.toString().trim() === ''
  })
}

const toggleAutoInfer = (question) => {
  const nextState = !autoInferAnswers.value[question.id]
  autoInferAnswers.value[question.id] = nextState

  if (nextState) {
    answers.value[question.id] = question.type === 'choice' ? [] : ''
  }
}

const handleManualInput = (questionId) => {
  if (autoInferAnswers.value[questionId]) {
    autoInferAnswers.value[questionId] = false
  }
}

onMounted(async () => {
  try {
    // 从后端获取问题
    console.log('Session ID:', sessionId)
    
    const response = await apiService.getSessionData(sessionId)
    questions.value = response.data.questions || []
    
    // 初始化答案物件
    questions.value.forEach(q => {
      if (q.type === 'choice') {
        answers.value[q.id] = []
        otherChoiceInputs.value[q.id] = ''
      } else {
        answers.value[q.id] = ''
      }
      autoInferAnswers.value[q.id] = false
    })
  } catch (error) {
    console.error('Error loading questions:', error)
    ElMessage.error('載入問題失敗')
  } finally {
    loading.value = false
  }
})

const submitAnswers = async () => {
  const missingQuestions = getMissingQuestions()
  if (missingQuestions.length > 0) {
    ElMessage.warning(`還有 ${missingQuestions.length} 題尚未完成，請補齊後再提交`)
    return
  }

  submitting.value = true
  
  try {
    // 準備答案資料，按照問題順序排列
    const answerList = questions.value.map(q => {
      const answer = answers.value[q.id]
      if (q.type === 'choice' && Array.isArray(answer)) {
        const normalizedAnswer = answer.map(option => {
          if (isOtherOption(option) && otherChoiceInputs.value[q.id]?.trim()) {
            return `其他：${otherChoiceInputs.value[q.id].trim()}`
          }
          return option
        })

        return {
          answer: normalizedAnswer.join(', ')
        }
      }

      if (autoInferAnswers.value[q.id]) {
        return {
          answer: '',
          auto_infer: true
        }
      }

      return {
        answer: answer || ''
      }
    })
    
    // 提交答案
    const response = await apiService.submitAnswers(sessionId, answerList)
    const newSessionId = response.data.session_id
    
    // 跳转到结果页面
    router.push({ name: 'Results', params: { sessionId: newSessionId } })
  } catch (error) {
    console.error('Error submitting answers:', error)
    ElMessage.error('提交答案失敗，請稍後再試')
  } finally {
    submitting.value = false
  }
}

const submitFeedback = async () => {
  if (!feedbackText.value.trim()) {
    ElMessage.warning('請輸入補充資訊')
    return
  }
  
  feedbackSubmitting.value = true
  
  try {
    // 提交反馈
    const response = await apiService.continueWithFeedback(sessionId, feedbackText.value)
    const newSessionId = response.data.session_id
    questions.value = response.data.questions
    
    // 清空之前答案
    answers.value = {}
    
    // 初始化新問題的答案
    questions.value.forEach(q => {
      answers.value[q.id] = q.type === 'choice' ? [] : ''
      otherChoiceInputs.value[q.id] = ''
      autoInferAnswers.value[q.id] = false
    })
    
    // 关闭对话框
    showFeedbackDialog.value = false
    feedbackText.value = ''
    
    ElMessage.success('已收到您的補充資訊，正在產生新問題...')
  } catch (error) {
    console.error('Error submitting feedback:', error)
    ElMessage.error('提交補充資訊失敗，請稍後再試')
  } finally {
    feedbackSubmitting.value = false
  }
}
</script>

<style scoped>
.questions {
  max-width: 980px;
  margin: 0 auto;
  padding: 0 12px 48px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  padding: 28px 24px;
  border-radius: 30px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(255, 244, 250, 0.84));
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

.questions-container {
  border-radius: 34px !important;
}

.question-item {
  margin-bottom: 18px;
  padding: 22px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(214, 191, 226, 0.34);
}

.question-item:last-child {
  margin-bottom: 0;
}

.question-item h4 {
  margin-bottom: 16px;
  color: var(--ink-strong);
  font-size: 1.08rem;
  line-height: 1.5;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.other-choice-input {
  margin-top: 12px;
}

.question-input,
.question-textarea {
  max-width: 100%;
}

.question-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.auto-infer-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0.72rem 1rem;
  border: 1px solid rgba(190, 153, 208, 0.44);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  color: var(--ink-body);
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.auto-infer-button:hover {
  transform: translateY(-1px);
  border-color: rgba(204, 47, 122, 0.42);
  box-shadow: 0 12px 24px rgba(204, 47, 122, 0.12);
}

.auto-infer-button.active {
  border-color: rgba(204, 47, 122, 0.48);
  background: rgba(255, 241, 248, 0.92);
  color: var(--brand-pink);
}

.auto-infer-note {
  color: var(--ink-soft);
  font-size: 0.9rem;
  font-weight: 600;
}

.actions {
  margin-top: 26px;
  display: flex;
  gap: 15px;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.question-options .el-checkbox.is-bordered) {
  min-height: 58px;
  padding: 12px 14px;
}

:deep(.question-options .el-checkbox__label) {
  display: block;
  font-size: 0.98rem;
}

@media (max-width: 768px) {
  .questions {
    padding: 0 0 36px;
  }

  .header {
    padding: 24px 18px;
    border-radius: 24px;
  }

  .question-item {
    padding: 18px;
    border-radius: 22px;
  }

  .actions {
    position: sticky;
    bottom: 10px;
    z-index: 5;
    padding: 12px;
    border-radius: 22px;
    background: rgba(255, 250, 253, 0.88);
    backdrop-filter: blur(16px);
    box-shadow: 0 18px 40px rgba(103, 66, 122, 0.12);
  }

  .question-meta {
    flex-direction: column;
    align-items: flex-start;
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

  .question-item {
    padding: 16px 14px;
    border-radius: 20px;
    margin-bottom: 14px;
  }

  .question-item h4 {
    margin-bottom: 14px;
    font-size: 1rem;
    line-height: 1.65;
  }

  .question-meta {
    gap: 10px;
  }

  .auto-infer-button {
    width: 100%;
    min-height: 46px;
  }

  .auto-infer-note {
    font-size: 0.86rem;
    line-height: 1.6;
  }

  .actions {
    bottom: 6px;
    margin-top: 18px;
    padding: 10px;
    border-radius: 18px;
  }

  :deep(.question-options .el-checkbox.is-bordered) {
    min-height: 54px;
    border-radius: 16px !important;
    padding: 10px 12px;
  }

  :deep(.question-options .el-checkbox__label) {
    font-size: 0.94rem;
    line-height: 1.55;
  }

  .dialog-footer {
    flex-direction: column-reverse;
  }

  .dialog-footer .el-button {
    width: 100%;
    margin: 0;
  }
}
</style>
