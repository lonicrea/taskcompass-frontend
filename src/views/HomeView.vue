<template>
  <div class="home">
    <section class="hero-panel">
      <div class="hero-copy">
        <span class="hero-kicker">AI Requirement Studio</span>
        <h1>讓你的想法<br>精準起飛</h1>
        <p class="hero-lead">
          透過多輪互動式對話，把模糊需求整理成清楚、可執行、可交給 AI 繼續工作的任務簡報。
        </p>

        <div class="hero-actions">
          <button class="cta-primary" type="button" @click="scrollToIntake">開始整理需求</button>
          <button class="cta-secondary" type="button" @click="scrollToFeatures">查看功能亮點</button>
        </div>

        <div class="hero-chips">
          <span>多輪澄清</span>
          <span>任務總覽</span>
          <span>Markdown / PDF 匯出</span>
        </div>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <div class="visual-badge badge-brief">Brief</div>
        <div class="visual-badge badge-ai">AI</div>
        <div class="visual-badge badge-flow">Flow</div>

        <div class="launch-stage">
          <div class="launch-card">
            <div class="launch-card-grid">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div class="launch-rocket">
            <div class="rocket-cap"></div>
            <div class="rocket-body">
              <span class="rocket-window"></span>
              <span class="rocket-window small"></span>
            </div>
            <div class="rocket-fin left"></div>
            <div class="rocket-fin right"></div>
            <div class="rocket-flame"></div>
            <div class="rocket-clouds">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div class="signal-ring ring-one"></div>
        <div class="signal-ring ring-two"></div>
        <div class="spark spark-one"></div>
        <div class="spark spark-two"></div>
        <div class="spark spark-three"></div>
      </div>
    </section>

    <section class="intake-section" ref="intakeSection">
      <div class="section-heading">
        <span class="section-kicker">Start With A Raw Idea</span>
        <h2>把一句話，變成一份任務簡報</h2>
        <p>你只要輸入初步想法，TaskCompass 會用問答逐步拆解需求、受眾、風格、限制與輸出形式。</p>
      </div>

      <el-card class="idea-input-card">
        <div class="intake-grid">
          <div class="intake-copy">
            <h3>輸入你的初步想法</h3>
            <p>可以是一個產品概念、一份內容需求、一段功能構想，或任何還沒說清楚的方向。</p>
            <ul class="intake-list">
              <li>自動生成澄清問題</li>
              <li>保留歷次回答與分析結果</li>
              <li>可繼續細化、分享與匯出</li>
            </ul>
          </div>

          <div class="intake-form">
            <el-form @submit.prevent="startProcess">
              <el-form-item>
                <el-input
                  v-model="idea"
                  :autosize="{ minRows: 6, maxRows: 10 }"
                  type="textarea"
                  placeholder="例如：我想做一個會員制知識服務平台，讓顧問能管理課程、預約諮詢，並自動產出每週營運摘要。"
                  maxlength="1000"
                  show-word-limit
                />
              </el-form-item>
            </el-form>

            <div class="start-button-wrapper">
              <button
                class="start-button-card"
                type="button"
                :class="{ 'is-loading': loading, 'is-disabled': !idea.trim() }"
                @click="startProcess"
              >
                <span class="button-icon">✦</span>
                <span class="button-text">{{ loading ? '整理中...' : '開始需求對齊' }}</span>
              </button>
            </div>
          </div>
        </div>
      </el-card>
    </section>

    <section class="features-section" ref="featuresSection">
      <div class="section-heading section-heading-shell">
        <div>
          <span class="section-kicker">Mission Control</span>
          <h2>像在搭建一座任務控制台，而不是填一張表</h2>
        </div>
        <p>
          新版本把需求整理拆成推進階段、決策訊號與交付出口三個面向，讓使用者看見任務如何被收斂，而不是只看到一串問題。
        </p>
      </div>

      <div class="mission-shell">
        <el-card class="mission-path-card">
          <div class="mission-path-header">
            <span class="mission-pill">任務推進路徑</span>
            <span class="mission-mini-copy">從模糊概念到可執行輸出</span>
          </div>

          <div class="mission-path">
            <article class="path-step step-scan">
              <span class="path-step-tag">Phase A</span>
              <h4>掃描原始意圖</h4>
              <p>先判讀你真正想產出的成果樣貌，辨識題目類型、使用情境與交付重點，避免一開始就問錯方向。</p>
            </article>

            <article class="path-step step-fold">
              <span class="path-step-tag">Phase B</span>
              <h4>折疊雜訊與缺口</h4>
              <p>把散亂描述拆成可追問的模組，缺少的條件由系統標記，已明確的偏好則被保留下來作為後續約束。</p>
            </article>

            <article class="path-step step-shape">
              <span class="path-step-tag">Phase C</span>
              <h4>塑形成交付藍圖</h4>
              <p>最終輸出不是聊天紀錄，而是一份有上下文、有假設、有執行方向的任務藍圖，能直接接給下一個 AI 或團隊成員。</p>
            </article>
          </div>
        </el-card>

        <div class="mission-side">
          <el-card class="signal-panel">
            <div class="signal-header">
              <span class="signal-dot"></span>
              <span>關鍵訊號板</span>
            </div>

            <div class="signal-list">
              <div class="signal-item">
                <div>
                  <strong>偏好被保留</strong>
                  <p>風格、受眾、篇幅與限制會被累積，不會在多輪對話中遺失。</p>
                </div>
                <span class="signal-badge hot">LIVE</span>
              </div>
              <div class="signal-item">
                <div>
                  <strong>缺口被標記</strong>
                  <p>未確認但重要的資訊會被點亮，必要時可由系統預設推測補足。</p>
                </div>
                <span class="signal-badge warm">FLAG</span>
              </div>
              <div class="signal-item">
                <div>
                  <strong>決策有脈絡</strong>
                  <p>每一次補充、修改與追問，都會變成可追溯的上下文，而不是被下一輪覆蓋。</p>
                </div>
                <span class="signal-badge cool">TRACE</span>
              </div>
            </div>
          </el-card>

          <el-card class="delivery-panel">
            <span class="delivery-kicker">Output Deck</span>
            <h4>最後交付出去的是什麼？</h4>
            <p>你會得到一份偏向執行層的任務文本，可直接拿去做提案、寫作、設計規劃、產品討論，或餵給下一個模型繼續工作。</p>

            <div class="delivery-rail">
              <span>Brief</span>
              <span>Assumption Map</span>
              <span>Instruction Block</span>
            </div>
          </el-card>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { apiService } from '@/utils/api'

const router = useRouter()
const idea = ref('')
const loading = ref(false)
const intakeSection = ref(null)
const featuresSection = ref(null)

onMounted(() => {
  document.title = 'TaskCompass | 任務羅盤'

  const urlParams = new URLSearchParams(window.location.search)
  const encodedApiUrl = urlParams.get('api')
  if (encodedApiUrl) {
    try {
      const apiUrl = decodeURIComponent(atob(encodedApiUrl))
      localStorage.setItem('clarityai_api_url', apiUrl)
      ElMessage.success('已自動設定後端伺服器位址')
      window.history.replaceState({}, '', window.location.pathname)
    } catch (error) {
      console.error('Error parsing API URL:', error)
    }
  }
})

const scrollToIntake = () => {
  intakeSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const startProcess = async () => {
  if (!idea.value.trim()) {
    ElMessage.error('請輸入您的初步想法')
    return
  }

  loading.value = true

  try {
    const response = await apiService.generateQuestions(idea.value)
    const sessionId = response.data.session_id

    const project = {
      id: sessionId,
      idea: idea.value,
      lastVisited: new Date().toISOString()
    }

    const savedProjects = localStorage.getItem('clarityai_projects')
    const projects = savedProjects ? JSON.parse(savedProjects) : []
    projects.push(project)
    localStorage.setItem('clarityai_projects', JSON.stringify(projects))

    router.push({ name: 'Questions', params: { sessionId } })
  } catch (error) {
    console.error('Error:', error)
    ElMessage.error('產生問題失敗，請稍後再試')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 34px;
  padding: 0 12px 52px;
}

.hero-panel,
.intake-section,
.features-section {
  position: relative;
}

.hero-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 520px);
  gap: 28px;
  align-items: center;
  min-height: 620px;
  padding: 28px 32px 34px;
  border-radius: 40px;
  background:
    linear-gradient(92deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 246, 252, 0.82) 44%, rgba(255, 205, 234, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: var(--surface-shadow);
  overflow: hidden;
}

.hero-panel::after {
  content: '';
  position: absolute;
  inset: auto -14% -30% 28%;
  height: 78%;
  background: radial-gradient(circle, rgba(255, 145, 203, 0.26), transparent 62%);
  pointer-events: none;
}

.hero-copy {
  position: relative;
  z-index: 1;
  padding-left: 18px;
}

.hero-kicker,
.section-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  color: var(--brand-pink);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  box-shadow: 0 10px 26px rgba(198, 97, 155, 0.12);
}

.hero-copy h1 {
  margin: 22px 0 18px;
  color: var(--brand-pink);
  font-size: clamp(3rem, 6vw, 5.2rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
}

.hero-lead {
  max-width: 560px;
  margin: 0;
  color: var(--ink-body);
  font-size: 1.16rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 30px;
}

.cta-primary,
.cta-secondary,
.start-button-card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 1rem 1.6rem;
  border: none;
  border-radius: 999px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.cta-primary,
.start-button-card {
  color: #fff;
  background: linear-gradient(135deg, #cc2f7a 0%, #ff73b8 100%);
  box-shadow: var(--button-shadow);
}

.cta-secondary {
  color: var(--ink-strong);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 12px 28px rgba(109, 84, 130, 0.1);
}

.cta-primary:hover,
.cta-secondary:hover,
.start-button-card:hover:not(.is-disabled):not(.is-loading) {
  transform: translateY(-2px);
}

.hero-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.hero-chips span {
  padding: 0.75rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: var(--ink-body);
  font-weight: 700;
  box-shadow: 0 12px 30px rgba(136, 95, 164, 0.09);
}

.hero-visual {
  position: relative;
  min-height: 520px;
  z-index: 1;
}

.launch-stage {
  position: absolute;
  right: 24px;
  bottom: 16px;
  width: min(100%, 500px);
  height: 430px;
}

.launch-card {
  position: absolute;
  right: 4px;
  bottom: 0;
  width: 100%;
  height: 126px;
  border-radius: 32px;
  background: linear-gradient(180deg, #fdfcff 0%, #fff2fb 100%);
  border: 6px solid #4650e7;
  box-shadow: 0 30px 50px rgba(80, 70, 203, 0.2);
}

.launch-card-grid {
  position: absolute;
  right: 36px;
  bottom: 28px;
  display: flex;
  align-items: end;
  gap: 10px;
}

.launch-card-grid span {
  width: 16px;
  border-radius: 999px 999px 12px 12px;
  background: linear-gradient(180deg, #ff7bbc, #ffbe61);
}

.launch-card-grid span:nth-child(1) {
  height: 52px;
}

.launch-card-grid span:nth-child(2) {
  height: 74px;
  background: linear-gradient(180deg, #6d8cff, #5347eb);
}

.launch-card-grid span:nth-child(3) {
  height: 66px;
}

.launch-card-grid span:nth-child(4) {
  height: 92px;
  background: linear-gradient(180deg, #6ad37d, #56c98d);
}

.launch-rocket {
  position: absolute;
  left: 50%;
  bottom: 82px;
  width: 154px;
  transform: translateX(-50%);
}

.rocket-cap {
  width: 0;
  height: 0;
  margin: 0 auto;
  border-left: 52px solid transparent;
  border-right: 52px solid transparent;
  border-bottom: 80px solid #4b46e3;
  filter: drop-shadow(0 18px 24px rgba(72, 70, 227, 0.24));
}

.rocket-body {
  position: relative;
  width: 154px;
  height: 220px;
  margin-top: -12px;
  border-radius: 70px;
  background: linear-gradient(180deg, #554af0 0%, #2d28cb 100%);
  box-shadow: 0 24px 42px rgba(72, 70, 227, 0.26);
}

.rocket-body::before {
  content: '';
  position: absolute;
  top: 18px;
  left: 22px;
  right: 22px;
  height: 5px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, #ffb24d, transparent);
}

.rocket-window {
  position: absolute;
  left: 50%;
  top: 42px;
  width: 62px;
  height: 62px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: #fffaf8;
  border: 8px solid #ff6dc5;
  box-shadow: 0 0 0 7px rgba(255, 109, 197, 0.16);
}

.rocket-window.small {
  top: 124px;
  width: 34px;
  height: 34px;
  border-width: 6px;
}

.rocket-fin {
  position: absolute;
  bottom: 54px;
  width: 52px;
  height: 114px;
  background: linear-gradient(180deg, #ffd06f, #ffb24d);
  border-radius: 28px;
  z-index: -1;
}

.rocket-fin.left {
  left: -24px;
  transform: rotate(12deg);
}

.rocket-fin.right {
  right: -24px;
  transform: rotate(-12deg);
}

.rocket-flame {
  position: absolute;
  left: 50%;
  bottom: -8px;
  width: 64px;
  height: 88px;
  transform: translateX(-50%);
  border-radius: 28px 28px 36px 36px;
  background: linear-gradient(180deg, rgba(255, 231, 173, 0.84), rgba(255, 184, 65, 0.94));
  filter: blur(1px);
}

.rocket-clouds {
  position: absolute;
  left: 50%;
  bottom: -114px;
  width: 220px;
  height: 160px;
  transform: translateX(-50%);
}

.rocket-clouds span {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(243, 236, 247, 0.96));
  box-shadow: 0 18px 30px rgba(133, 112, 153, 0.08);
}

.rocket-clouds span:nth-child(1) {
  left: 18px;
  bottom: 8px;
  width: 82px;
  height: 82px;
}

.rocket-clouds span:nth-child(2) {
  left: 66px;
  bottom: 24px;
  width: 96px;
  height: 96px;
}

.rocket-clouds span:nth-child(3) {
  right: 8px;
  bottom: 14px;
  width: 72px;
  height: 72px;
}

.rocket-clouds span:nth-child(4) {
  left: 0;
  bottom: 60px;
  width: 42px;
  height: 42px;
}

.rocket-clouds span:nth-child(5) {
  right: 38px;
  bottom: 74px;
  width: 48px;
  height: 48px;
}

.visual-badge {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 76px;
  height: 76px;
  padding: 0 18px;
  border-radius: 24px;
  font-size: 1.05rem;
  font-weight: 800;
  color: #fff;
  box-shadow: 0 20px 34px rgba(110, 71, 141, 0.18);
}

.badge-brief {
  top: 66px;
  left: 18px;
  background: linear-gradient(135deg, #4b46e3, #6d8cff);
}

.badge-ai {
  top: 206px;
  left: 0;
  background: linear-gradient(135deg, #ffb24d, #ff7bbc);
}

.badge-flow {
  top: 112px;
  right: 24px;
  background: linear-gradient(135deg, #2d2845, #5b56ff);
}

.signal-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px dashed rgba(84, 72, 225, 0.28);
}

.ring-one {
  top: 122px;
  right: 112px;
  width: 74px;
  height: 74px;
}

.ring-two {
  left: 96px;
  bottom: 118px;
  width: 90px;
  height: 90px;
  border-color: rgba(86, 201, 141, 0.4);
}

.spark {
  position: absolute;
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, #ffb24d, #ffdf84);
  transform: rotate(45deg);
  border-radius: 6px;
}

.spark-one {
  top: 102px;
  left: 164px;
}

.spark-two {
  top: 188px;
  right: 110px;
}

.spark-three {
  right: 34px;
  bottom: 158px;
}

.section-heading {
  margin-bottom: 20px;
}

.section-heading h2 {
  margin: 16px 0 10px;
  color: var(--ink-strong);
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.section-heading p {
  max-width: 700px;
  margin: 0;
  color: var(--ink-body);
  font-size: 1.02rem;
}

.section-heading.centered {
  text-align: center;
}

.section-heading.centered p {
  margin-inline: auto;
}

.intake-grid {
  display: grid;
  grid-template-columns: minmax(240px, 0.85fr) minmax(0, 1.15fr);
  gap: 24px;
  align-items: start;
}

.intake-copy h3 {
  margin: 0;
  color: var(--ink-strong);
  font-size: 1.5rem;
}

.intake-copy p {
  margin: 12px 0 0;
  color: var(--ink-body);
}

.intake-list {
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.intake-list li {
  position: relative;
  padding-left: 22px;
  color: var(--ink-body);
  font-weight: 600;
}

.intake-list li::before {
  content: '';
  position: absolute;
  top: 0.58em;
  left: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-pink), var(--brand-orange));
  box-shadow: 0 0 0 6px rgba(255, 115, 184, 0.13);
}

.start-button-wrapper {
  display: flex;
  justify-content: flex-start;
  margin-top: 14px;
}

.start-button-card.is-disabled {
  cursor: not-allowed;
  background: linear-gradient(135deg, rgba(221, 214, 228, 0.96), rgba(239, 234, 244, 0.96));
  box-shadow: none;
  color: rgba(88, 78, 111, 0.6);
}

.start-button-card.is-loading {
  background: linear-gradient(135deg, #69628f 0%, #8a7aa6 100%);
}

.button-icon {
  font-size: 1.05rem;
}

.section-heading-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
  gap: 28px;
  align-items: end;
}

.section-heading-shell p {
  margin-left: auto;
}

.mission-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  gap: 18px;
  align-items: stretch;
}

.mission-path-card,
.signal-panel,
.delivery-panel {
  overflow: hidden;
}

.mission-path-header,
.signal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.mission-pill,
.delivery-kicker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 239, 248, 0.95);
  color: var(--brand-pink);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mission-mini-copy {
  color: var(--ink-soft);
  font-size: 0.9rem;
  font-weight: 600;
}

.mission-path {
  position: relative;
  display: grid;
  gap: 16px;
  margin-top: 22px;
}

.mission-path::before {
  content: '';
  position: absolute;
  top: 18px;
  bottom: 18px;
  left: 18px;
  width: 2px;
  background: linear-gradient(180deg, rgba(204, 47, 122, 0.26), rgba(74, 70, 223, 0.2));
}

.path-step {
  position: relative;
  padding: 22px 22px 22px 50px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(220, 194, 231, 0.4);
}

.path-step::before {
  content: '';
  position: absolute;
  left: 9px;
  top: 26px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: 0 0 0 7px rgba(255, 255, 255, 0.9);
}

.step-scan::before {
  background: linear-gradient(135deg, #ff73b8, #ffb24d);
}

.step-fold::before {
  background: linear-gradient(135deg, #6d8cff, #4a46df);
}

.step-shape::before {
  background: linear-gradient(135deg, #56c98d, #6d8cff);
}

.path-step-tag {
  display: inline-flex;
  margin-bottom: 10px;
  color: var(--ink-soft);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.path-step h4,
.delivery-panel h4 {
  margin: 0;
  color: var(--ink-strong);
  font-size: 1.22rem;
}

.path-step p,
.delivery-panel p,
.signal-item p {
  margin: 10px 0 0;
  color: var(--ink-body);
}

.mission-side {
  display: grid;
  gap: 18px;
}

.signal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff73b8, #4a46df);
  box-shadow: 0 0 0 8px rgba(255, 115, 184, 0.14);
}

.signal-header span:last-child {
  color: var(--ink-strong);
  font-size: 1.05rem;
  font-weight: 800;
}

.signal-list {
  display: grid;
  gap: 14px;
  margin-top: 24px;
}

.signal-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(220, 194, 231, 0.38);
}

.signal-item strong {
  color: var(--ink-strong);
  font-size: 1rem;
}

.signal-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 58px;
  padding: 0.42rem 0.7rem;
  border-radius: 999px;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.signal-badge.hot {
  background: linear-gradient(135deg, #ff73b8, #cc2f7a);
}

.signal-badge.warm {
  background: linear-gradient(135deg, #ffb24d, #ff8a5c);
}

.signal-badge.cool {
  background: linear-gradient(135deg, #6d8cff, #4a46df);
}

.delivery-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 250px;
}

.delivery-rail {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.delivery-rail span {
  padding: 0.62rem 0.92rem;
  border-radius: 999px;
  background: rgba(248, 243, 255, 0.9);
  color: var(--ink-body);
  font-weight: 700;
}

@media (max-width: 900px) {
  .hero-panel {
    padding: 24px 22px 28px;
    border-radius: 34px;
  }

  .hero-copy {
    padding-left: 0;
  }

  .hero-lead,
  .section-heading p {
    max-width: none;
  }

  .intake-grid {
    gap: 18px;
  }
}

@media (max-width: 1080px) {
  .hero-panel,
  .intake-grid {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    padding-left: 0;
  }

  .hero-visual {
    min-height: 440px;
  }

  .section-heading-shell,
  .mission-shell {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .home {
    gap: 24px;
    padding: 0 0 40px;
  }

  .hero-panel {
    min-height: auto;
    padding: 24px 18px 26px;
    border-radius: 30px;
  }

  .hero-copy h1 {
    font-size: 3.2rem;
  }

  .hero-lead {
    font-size: 1rem;
  }

  .hero-chips span {
    width: 100%;
    justify-content: center;
    text-align: center;
  }

  .hero-visual {
    min-height: 380px;
  }

  .launch-stage {
    right: 0;
    width: 100%;
  }

  .launch-card {
    height: 112px;
  }

  .launch-rocket {
    width: 126px;
  }

  .rocket-cap {
    border-left-width: 42px;
    border-right-width: 42px;
    border-bottom-width: 64px;
  }

  .rocket-body {
    width: 126px;
    height: 188px;
  }

  .rocket-window {
    width: 56px;
    height: 56px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .cta-primary,
  .cta-secondary,
  .start-button-card {
    width: 100%;
  }

  .path-step,
  .signal-item {
    padding-inline: 18px;
  }
}

@media (max-width: 560px) {
  .section-kicker,
  .hero-kicker {
    font-size: 0.68rem;
    letter-spacing: 0.1em;
  }

  .hero-panel {
    gap: 20px;
    padding: 18px 16px 20px;
    border-radius: 26px;
  }

  .hero-copy h1 {
    margin: 18px 0 14px;
    font-size: clamp(2.35rem, 12vw, 3rem);
    line-height: 0.98;
  }

  .hero-lead {
    font-size: 0.96rem;
    line-height: 1.75;
  }

  .hero-actions {
    gap: 12px;
    margin-top: 22px;
  }

  .cta-primary,
  .cta-secondary,
  .start-button-card {
    min-height: 50px;
    padding: 0.9rem 1.15rem;
    font-size: 0.95rem;
  }

  .hero-chips {
    gap: 10px;
    margin-top: 18px;
  }

  .hero-chips span {
    padding: 0.72rem 0.9rem;
    font-size: 0.88rem;
  }

  .hero-visual {
    min-height: 292px;
    padding-top: 12px;
  }

  .launch-stage {
    position: relative;
    right: auto;
    bottom: auto;
    height: 272px;
    margin: 0 auto;
  }

  .launch-card {
    width: calc(100% - 10px);
    height: 92px;
    right: 5px;
    border-width: 4px;
    border-radius: 24px;
  }

  .launch-card-grid {
    right: 18px;
    bottom: 18px;
    gap: 8px;
  }

  .launch-card-grid span {
    width: 12px;
  }

  .launch-card-grid span:nth-child(1) {
    height: 38px;
  }

  .launch-card-grid span:nth-child(2) {
    height: 52px;
  }

  .launch-card-grid span:nth-child(3) {
    height: 44px;
  }

  .launch-card-grid span:nth-child(4) {
    height: 62px;
  }

  .launch-rocket {
    bottom: 58px;
    width: 98px;
  }

  .rocket-cap {
    border-left-width: 32px;
    border-right-width: 32px;
    border-bottom-width: 50px;
  }

  .rocket-body {
    width: 98px;
    height: 146px;
    margin-top: -8px;
  }

  .rocket-body::before {
    top: 14px;
    left: 16px;
    right: 16px;
  }

  .rocket-window {
    top: 30px;
    width: 42px;
    height: 42px;
    border-width: 6px;
    box-shadow: 0 0 0 5px rgba(255, 109, 197, 0.16);
  }

  .rocket-window.small {
    top: 92px;
    width: 24px;
    height: 24px;
    border-width: 4px;
  }

  .rocket-fin {
    width: 34px;
    height: 74px;
    bottom: 40px;
  }

  .rocket-fin.left {
    left: -16px;
  }

  .rocket-fin.right {
    right: -16px;
  }

  .rocket-flame {
    width: 42px;
    height: 62px;
  }

  .rocket-clouds {
    width: 160px;
    height: 110px;
    bottom: -78px;
  }

  .rocket-clouds span:nth-child(1) {
    width: 56px;
    height: 56px;
  }

  .rocket-clouds span:nth-child(2) {
    left: 42px;
    width: 70px;
    height: 70px;
  }

  .rocket-clouds span:nth-child(3) {
    width: 54px;
    height: 54px;
  }

  .rocket-clouds span:nth-child(4),
  .rocket-clouds span:nth-child(5) {
    display: none;
  }

  .visual-badge {
    min-width: 58px;
    height: 58px;
    padding: 0 12px;
    border-radius: 18px;
    font-size: 0.85rem;
  }

  .badge-brief {
    top: 0;
    left: 0;
  }

  .badge-ai {
    top: 92px;
    left: 0;
  }

  .badge-flow {
    top: 28px;
    right: 0;
  }

  .ring-one,
  .ring-two,
  .spark-three {
    display: none;
  }

  .spark-one {
    top: 58px;
    left: 92px;
  }

  .spark-two {
    top: 126px;
    right: 72px;
  }

  .section-heading {
    margin-bottom: 16px;
  }

  .section-heading h2 {
    margin: 14px 0 8px;
    font-size: clamp(1.65rem, 8vw, 2.1rem);
    line-height: 1.1;
  }

  .section-heading p,
  .intake-copy p,
  .path-step p,
  .signal-item p,
  .delivery-panel p {
    font-size: 0.94rem;
    line-height: 1.7;
  }

  .intake-copy h3 {
    font-size: 1.2rem;
  }

  .intake-list {
    gap: 10px;
    margin-top: 18px;
  }

  .intake-list li {
    padding-left: 18px;
    font-size: 0.93rem;
  }

  .start-button-wrapper {
    margin-top: 10px;
  }

  .section-heading-shell {
    gap: 14px;
  }

  .mission-path-header,
  .signal-header,
  .signal-item {
    align-items: flex-start;
  }

  .mission-path-header {
    flex-direction: column;
  }

  .mission-path::before {
    left: 12px;
  }

  .path-step {
    padding: 18px 16px 18px 38px;
    border-radius: 22px;
  }

  .path-step::before {
    left: 3px;
    top: 22px;
    width: 18px;
    height: 18px;
    box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.9);
  }

  .path-step h4,
  .delivery-panel h4 {
    font-size: 1.08rem;
  }

  .signal-list,
  .mission-side {
    gap: 12px;
    margin-top: 18px;
  }

  .signal-item {
    flex-direction: column;
    padding: 14px;
    border-radius: 18px;
  }

  .signal-badge {
    min-width: 64px;
  }

  .delivery-panel {
    min-height: auto;
  }

  .delivery-rail {
    gap: 8px;
    margin-top: 16px;
  }

  .delivery-rail span {
    width: 100%;
    text-align: center;
    padding: 0.72rem 0.88rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 420px) {
  .home {
    gap: 18px;
  }

  .hero-panel::after {
    inset: auto -42% -22% 12%;
    height: 52%;
  }

  .hero-copy h1 {
    font-size: 2.16rem;
  }
}
</style>
