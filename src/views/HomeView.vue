<template>
  <div class="home">
    <section class="hero-panel">
      <div class="hero-copy">
        <span class="hero-kicker">需求整理系統</span>
        <div class="hero-intro-line">
          <span class="hero-intro-dot"></span>
          <span>協助你把想法整理成可執行的需求內容</span>
        </div>
        <h1>
          <span class="hero-line">不知道怎麼問 <em>AI</em>？</span>
          <span class="hero-line">那就讓 AI 先來問你</span>
        </h1>
        <p class="hero-lead">
          任務羅盤會逐步追問你的需求，把模糊想法整理成可直接使用的提示詞與需求簡報。
        </p>

        <div class="hero-proof-grid">
          <article class="hero-proof-card">
            <span class="hero-proof-label">步驟一</span>
            <strong>先輸入你的初步想法</strong>
            <p>只要先說明你想做什麼，不需要一開始就寫得很完整。</p>
          </article>
          <article class="hero-proof-card">
            <span class="hero-proof-label">步驟二</span>
            <strong>系統逐步整理需求</strong>
            <p>系統會透過多輪提問補齊目標、受眾、限制與交付形式。</p>
          </article>
          <article class="hero-proof-card">
            <span class="hero-proof-label">步驟三</span>
            <strong>取得可直接使用的結果</strong>
            <p>最後會產生提示詞與需求簡報，方便後續交給 AI 或團隊使用。</p>
          </article>
        </div>

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
            <div class="rocket-aura"></div>
            <div class="rocket-cap"></div>
            <div class="rocket-body">
              <span class="rocket-stripe"></span>
              <span class="rocket-body-shine"></span>
              <span class="rocket-window"></span>
              <span class="rocket-window small"></span>
            </div>
            <div class="rocket-fin left"></div>
            <div class="rocket-fin right"></div>
            <div class="rocket-thruster"></div>
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
        <span class="section-kicker">開始整理</span>
        <h2>從一句初步想法開始整理需求</h2>
        <p>輸入你的想法後，系統會逐步確認目標、受眾、限制與交付形式，整理成完整內容。</p>
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
          <span class="section-kicker">功能說明</span>
          <h2>把需求整理流程清楚分成三個步驟</h2>
        </div>
        <p>
          系統會依序幫你確認需求方向、補足缺漏資訊，最後輸出可直接使用的提示詞與需求簡報。
        </p>
      </div>

      <div class="mission-shell">
        <el-card class="mission-path-card">
          <div class="mission-path-header">
            <span class="mission-pill">處理流程</span>
            <span class="mission-mini-copy">從想法輸入到結果輸出</span>
          </div>

          <div class="mission-path">
            <article class="path-step step-scan">
              <span class="path-step-tag">步驟 1</span>
              <h4>確認需求方向</h4>
              <p>先了解你希望完成的成果、主要使用對象，以及這項需求的基本目標。</p>
            </article>

            <article class="path-step step-fold">
              <span class="path-step-tag">步驟 2</span>
              <h4>補足重要資訊</h4>
              <p>針對尚未說清楚的部分繼續提問，整理限制條件、風格偏好與交付形式。</p>
            </article>

            <article class="path-step step-shape">
              <span class="path-step-tag">步驟 3</span>
              <h4>產生最終結果</h4>
              <p>將整理後的內容輸出為可直接使用的提示詞與需求簡報，方便後續執行與溝通。</p>
            </article>
          </div>
        </el-card>

        <div class="mission-side">
          <el-card class="signal-panel">
            <div class="signal-header">
              <span class="signal-dot"></span>
              <span>系統特點</span>
            </div>

            <div class="signal-list">
              <div class="signal-item">
                <div>
                  <strong>保留需求重點</strong>
                  <p>已確認的受眾、風格、篇幅與限制會被持續保留，不會在後續流程中遺失。</p>
                </div>
                <span class="signal-badge hot">保留</span>
              </div>
              <div class="signal-item">
                <div>
                  <strong>補足缺漏資訊</strong>
                  <p>對於尚未確認但重要的部分，系統會繼續提問，必要時可用預設推測補足。</p>
                </div>
                <span class="signal-badge warm">補足</span>
              </div>
              <div class="signal-item">
                <div>
                  <strong>保存整理歷程</strong>
                  <p>每一次補充與修改都會保留下來，方便回看整個需求整理過程。</p>
                </div>
                <span class="signal-badge cool">記錄</span>
              </div>
            </div>
          </el-card>

          <el-card class="delivery-panel">
            <span class="delivery-kicker">輸出結果</span>
            <h4>系統最後會提供哪些內容？</h4>
            <p>你會得到一份整理完成的需求文本，可直接拿去做提案、規劃、寫作，或作為下一個 AI 任務的輸入內容。</p>

            <div class="delivery-rail">
              <span>提示詞</span>
              <span>需求簡報</span>
              <span>任務總覽</span>
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

const STORAGE_KEYS = {
  apiUrl: 'taskcompass_api_url',
  projects: 'taskcompass_projects'
}

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
      localStorage.setItem(STORAGE_KEYS.apiUrl, apiUrl)
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

    const savedProjects = localStorage.getItem(STORAGE_KEYS.projects)
    const projects = savedProjects ? JSON.parse(savedProjects) : []
    projects.push(project)
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects))

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
  font-size: clamp(2.7rem, 5.2vw, 4.5rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
}

.hero-intro-line {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
  color: var(--ink-body);
  font-size: 0.94rem;
  font-weight: 700;
}

.hero-intro-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-pink), var(--brand-orange));
  box-shadow: 0 0 0 8px rgba(255, 115, 184, 0.12);
}

.hero-copy h1 em {
  font-style: normal;
  color: #7a3cff;
}

.hero-line {
  display: block;
  white-space: nowrap;
}

.hero-lead {
  max-width: 560px;
  margin: 0;
  color: var(--ink-body);
  font-size: 1.16rem;
}

.hero-proof-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
  max-width: 760px;
}

.hero-proof-card {
  padding: 16px 16px 18px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 244, 250, 0.84));
  border: 1px solid rgba(220, 194, 231, 0.36);
  box-shadow: 0 16px 34px rgba(136, 95, 164, 0.08);
}

.hero-proof-label {
  display: inline-flex;
  margin-bottom: 10px;
  color: var(--brand-pink);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero-proof-card strong {
  display: block;
  color: var(--ink-strong);
  font-size: 1rem;
  line-height: 1.35;
}

.hero-proof-card p {
  margin: 8px 0 0;
  color: var(--ink-body);
  font-size: 0.92rem;
  line-height: 1.6;
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
  filter: drop-shadow(0 28px 44px rgba(108, 63, 162, 0.18));
}

.launch-card {
  position: absolute;
  right: 4px;
  bottom: 0;
  width: 100%;
  height: 126px;
  border-radius: 32px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 243, 251, 0.94) 100%);
  border: 6px solid #4650e7;
  box-shadow: 0 30px 50px rgba(80, 70, 203, 0.2);
}

.launch-card::before {
  content: '';
  position: absolute;
  inset: 10px 16px auto;
  height: 22px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0));
  opacity: 0.9;
}

.launch-card::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 14px;
  width: 120px;
  height: 18px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(70, 80, 231, 0.3), rgba(70, 80, 231, 0.05));
  filter: blur(4px);
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
  isolation: isolate;
}

.rocket-aura {
  position: absolute;
  left: 50%;
  top: 42px;
  width: 220px;
  height: 220px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(105, 121, 255, 0.24), rgba(255, 131, 193, 0.08) 48%, transparent 74%);
  filter: blur(10px);
  z-index: -3;
}

.rocket-cap {
  width: 0;
  height: 0;
  margin: 0 auto;
  border-left: 52px solid transparent;
  border-right: 52px solid transparent;
  border-bottom: 80px solid #4b46e3;
  filter: drop-shadow(0 18px 24px rgba(72, 70, 227, 0.24));
  position: relative;
}

.rocket-cap::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 72px;
  width: 92px;
  height: 14px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255, 186, 98, 0), rgba(255, 186, 98, 0.95), rgba(255, 186, 98, 0));
}

.rocket-body {
  position: relative;
  width: 154px;
  height: 220px;
  margin-top: -12px;
  border-radius: 70px;
  background:
    radial-gradient(circle at 28% 24%, rgba(135, 137, 255, 0.46), transparent 34%),
    linear-gradient(180deg, #6558ff 0%, #4238e6 38%, #2d28cb 100%);
  box-shadow:
    inset 0 10px 18px rgba(255, 255, 255, 0.08),
    inset 0 -18px 26px rgba(21, 14, 101, 0.18),
    0 24px 42px rgba(72, 70, 227, 0.26);
  overflow: hidden;
}

.rocket-body::before {
  content: '';
  position: absolute;
  top: 22px;
  left: 18px;
  right: 18px;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255, 178, 77, 0), rgba(255, 178, 77, 0.92), rgba(255, 178, 77, 0));
}

.rocket-stripe {
  position: absolute;
  left: 50%;
  bottom: 26px;
  width: 26px;
  height: 104px;
  transform: translateX(-50%);
  border-radius: 20px 20px 30px 30px;
  background: linear-gradient(180deg, rgba(255, 214, 122, 0.16), rgba(255, 193, 91, 0.45), rgba(255, 175, 60, 0.78));
  box-shadow: inset 0 10px 18px rgba(255, 244, 204, 0.18);
}

.rocket-body-shine {
  position: absolute;
  top: 22px;
  right: 26px;
  width: 24px;
  height: 150px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0));
  transform: rotate(-6deg);
  opacity: 0.7;
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
  box-shadow:
    inset 0 8px 14px rgba(255, 216, 244, 0.45),
    0 0 0 7px rgba(255, 109, 197, 0.16);
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
  background: linear-gradient(180deg, #ffd777, #ffb24d 56%, #ff9f2f 100%);
  border-radius: 28px 28px 34px 34px;
  z-index: -1;
  box-shadow: inset 0 8px 14px rgba(255, 247, 211, 0.28);
}

.rocket-fin.left {
  left: -24px;
  transform: rotate(12deg) skewY(4deg);
}

.rocket-fin.right {
  right: -24px;
  transform: rotate(-12deg) skewY(-4deg);
}

.rocket-thruster {
  position: absolute;
  left: 50%;
  bottom: 26px;
  width: 56px;
  height: 44px;
  transform: translateX(-50%);
  border-radius: 18px 18px 26px 26px;
  background: linear-gradient(180deg, #ffdb8c, #ffb24d);
  box-shadow:
    inset 0 8px 14px rgba(255, 251, 231, 0.34),
    0 14px 22px rgba(255, 171, 58, 0.18);
}

.rocket-flame {
  position: absolute;
  left: 50%;
  bottom: -14px;
  width: 72px;
  height: 96px;
  transform: translateX(-50%);
  border-radius: 28px 28px 36px 36px;
  background: linear-gradient(180deg, rgba(255, 244, 194, 0.94), rgba(255, 187, 70, 0.98) 46%, rgba(255, 128, 47, 0.95));
  filter: blur(1px);
}

.rocket-flame::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 10px;
  width: 34px;
  height: 62px;
  transform: translateX(-50%);
  border-radius: 20px 20px 30px 30px;
  background: linear-gradient(180deg, rgba(255, 255, 232, 0.92), rgba(255, 216, 96, 0.86));
}

.rocket-flame::after {
  content: '';
  position: absolute;
  inset: auto 8px -12px;
  height: 28px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 182, 72, 0.56), transparent 70%);
  filter: blur(8px);
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

  .hero-proof-grid {
    grid-template-columns: 1fr;
    max-width: none;
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
    font-size: 2.8rem;
  }

  .hero-lead {
    font-size: 1rem;
  }

  .hero-intro-line {
    margin-top: 14px;
    font-size: 0.88rem;
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
    font-size: clamp(1.92rem, 8vw, 2.4rem);
    line-height: 1.08;
  }

  .hero-lead {
    font-size: 0.96rem;
    line-height: 1.75;
  }

  .hero-actions {
    gap: 12px;
    margin-top: 22px;
  }

  .hero-proof-grid {
    gap: 10px;
    margin-top: 20px;
  }

  .hero-proof-card {
    padding: 14px;
    border-radius: 18px;
  }

  .hero-proof-card strong {
    font-size: 0.96rem;
  }

  .hero-proof-card p {
    font-size: 0.88rem;
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

  .rocket-aura {
    width: 150px;
    height: 150px;
    top: 32px;
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

  .rocket-stripe {
    bottom: 18px;
    width: 18px;
    height: 72px;
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

  .rocket-thruster {
    bottom: 18px;
    width: 40px;
    height: 30px;
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
    font-size: 1.82rem;
  }

  .hero-intro-line {
    align-items: flex-start;
    line-height: 1.5;
  }
}
</style>
