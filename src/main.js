import './styles.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const clueCopy = {
  safety: {
    label: '觀察線索 01',
    text: '先確認事件的經過與當下安全，讓後續討論有共同的起點。',
  },
  change: {
    label: '觀察線索 02',
    text: '回看上一次支持之後的變化，留意哪些情況延續、哪些地方不同。',
  },
  support: {
    label: '觀察線索 03',
    text: '把行為放回需要與處境裡理解，思考現有支持是否仍合適。',
  },
  together: {
    label: '觀察線索 04',
    text: '盤點校內可以共同支持的角色，讓觀察、分工與追蹤能接續起來。',
  },
};

const clueButtons = [...document.querySelectorAll('.clue-card')];
const response = document.querySelector('#clue-response');

clueButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const copy = clueCopy[button.dataset.clue];
    if (!copy) return;

    clueButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });

    response.innerHTML = `<span class="response-line"><i></i> ${copy.label}</span><p>${copy.text}</p>`;
  });
});

document.querySelector('#current-year').textContent = new Date().getFullYear();

const feedbackForm = document.querySelector('#feedback-form');
const feedbackStatus = document.querySelector('#feedback-status');
const feedbackSubmit = document.querySelector('#feedback-submit');
const feedbackBridge = document.querySelector('#feedback-bridge');
const configuredEndpoint = import.meta.env.VITE_APPS_SCRIPT_URL?.trim();
const messageChannel = 'sdg4-teacher-exhibition-feedback';
let bridgeReady = false;
let awaitingConfirmation = false;
let responseTimer;

function setFeedbackStatus(message, state = '') {
  feedbackStatus.textContent = message;
  feedbackStatus.dataset.state = state;
}

function validAppsScriptUrl(value) {
  try {
    const endpoint = new URL(value);
    return endpoint.protocol === 'https:'
      && endpoint.hostname === 'script.google.com'
      && endpoint.pathname.includes('/macros/s/');
  } catch {
    return false;
  }
}

if (configuredEndpoint && validAppsScriptUrl(configuredEndpoint)) {
  feedbackBridge.src = configuredEndpoint;
  setFeedbackStatus('正在連接回饋服務；連線確認後即可送出。', 'pending');
} else if (configuredEndpoint) {
  setFeedbackStatus('回饋服務網址格式不正確，請檢查 VITE_APPS_SCRIPT_URL。', 'error');
} else {
  setFeedbackStatus('回饋表單尚未連接；目前不會傳送資料。', '');
}

window.addEventListener('message', (event) => {
  if (event.source !== feedbackBridge.contentWindow) return;
  let sender;
  try {
    sender = new URL(event.origin);
  } catch {
    return;
  }
  if (sender.hostname !== 'script.google.com' && !sender.hostname.endsWith('.googleusercontent.com')) return;
  if (event.data?.channel !== messageChannel) return;

  if (event.data.type === 'ready') {
    bridgeReady = true;
    feedbackSubmit.disabled = false;
    setFeedbackStatus('回饋服務已連線；送出後會等待寫入確認。', 'ready');
    return;
  }

  if (!awaitingConfirmation) return;
  window.clearTimeout(responseTimer);
  awaitingConfirmation = false;
  feedbackSubmit.disabled = false;

  if (event.data.type === 'success' && event.data.ok === true) {
    setFeedbackStatus('已收到 Apps Script 寫入成功確認，感謝你的回饋。', 'success');
    feedbackForm.reset();
    feedbackSubmit.textContent = '回饋已送出';
    feedbackSubmit.disabled = true;
  } else if (event.data.type === 'failure') {
    setFeedbackStatus('Apps Script 未能確認寫入；目前不會顯示為已記錄。請稍後再試。', 'error');
  }
});

feedbackForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (awaitingConfirmation) return;
  if (!feedbackForm.reportValidity()) return;
  if (!configuredEndpoint || !validAppsScriptUrl(configuredEndpoint)) {
    setFeedbackStatus('回饋服務尚未設定，這份回覆沒有送出。', 'error');
    return;
  }
  if (!bridgeReady) {
    setFeedbackStatus('回饋服務仍在連線，請稍候再送出。', 'pending');
    return;
  }

  const formData = new FormData(feedbackForm);
  const payload = {
    rating: formData.get('rating'),
    lens: formData.get('lens'),
    reflection: formData.get('reflection'),
  };

  awaitingConfirmation = true;
  feedbackSubmit.disabled = true;
  setFeedbackStatus('正在傳送，等候試算表寫入確認……', 'pending');
  feedbackBridge.contentWindow.postMessage({ channel: messageChannel, type: 'submit', payload }, '*');

  responseTimer = window.setTimeout(() => {
    if (!awaitingConfirmation) return;
    setFeedbackStatus('尚未收到寫入確認。請先檢查試算表，避免重複送出。', 'error');
    feedbackSubmit.textContent = '等待確認中';
  }, 20000);
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let animationContext;

function buildExhibitionMotion() {
  animationContext?.revert();
  animationContext = gsap.context(() => {
    const progressBar = document.querySelector('#reading-progress-bar');
    const timelineSteps = [...document.querySelectorAll('.scenario-beat')];

    gsap.set('.hero-copy > *, .hero-art > *', { autoAlpha: 0, y: 18 });
    gsap.to('.hero-copy > *, .hero-art > *', {
      autoAlpha: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.075,
      ease: 'power2.out',
      delay: 0.12,
    });

    gsap.utils.toArray('[data-reveal]').forEach((element) => {
      gsap.fromTo(element,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        },
      );
    });

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => { progressBar.style.transform = `scaleX(${self.progress})`; },
    });

    timelineSteps.forEach((step, index) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 62%',
        end: 'bottom 38%',
        onEnter: () => setCurrentStep(step, index),
        onEnterBack: () => setCurrentStep(step, index),
      });
    });

    const orbit = document.querySelector('.art-orbit.orbit-one');
    gsap.to(orbit, {
      rotation: 360,
      duration: 80,
      repeat: -1,
      ease: 'none',
      transformOrigin: '50% 50%',
    });
  });

  ScrollTrigger.refresh();
}

function setCurrentStep(step, index) {
  document.querySelectorAll('.scenario-beat').forEach((item, itemIndex) => {
    item.classList.toggle('is-current', itemIndex === index);
  });
  step.classList.add('is-current');
}

function applyMotionPreference() {
  animationContext?.revert();
  if (reduceMotion.matches) {
    gsap.set('[data-reveal]', { clearProps: 'all' });
    gsap.set('.hero-copy > *, .hero-art > *', { clearProps: 'all' });
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    document.querySelector('#reading-progress-bar').style.transform = 'scaleX(0)';
    return;
  }
  buildExhibitionMotion();
}

reduceMotion.addEventListener?.('change', applyMotionPreference);
applyMotionPreference();

let refreshFrame;
window.addEventListener('resize', () => {
  window.cancelAnimationFrame(refreshFrame);
  refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
}, { passive: true });

document.fonts?.ready?.then(() => ScrollTrigger.refresh());
