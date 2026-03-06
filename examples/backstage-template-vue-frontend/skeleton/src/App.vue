<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <div class="splash-container">
    <div class="splash-card" :class="{ visible: isVisible }">
      <div class="logo-container">
        <svg class="vue-logo" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
          <path d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z" fill="#42b883"/>
          <path d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z" fill="#35495e"/>
        </svg>
      </div>
      
      <h1 class="title">
        <span class="highlight">Welcome!</span>
      </h1>
      
      <p class="subtitle">Your Vue project is ready to go</p>
      
      <div class="features">
        <div class="feature-item">
          <span class="feature-icon">⚡</span>
          <span>Vite</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🎨</span>
          <span>Vue 3</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">📘</span>
          <span>TypeScript</span>
        </div>
      </div>
      
      <a 
        href="https://vuejs.org/" 
        target="_blank" 
        rel="noopener" 
        class="cta-button"
      >
        Explore the docs
        <span class="arrow">→</span>
      </a>
      
      <p class="hint">Edit <code>src/App.vue</code> to get started</p>
    </div>
    
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.splash-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.splash-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem 4rem;
  text-align: center;
  z-index: 10;
  transform: translateY(30px);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.splash-card.visible {
  transform: translateY(0);
  opacity: 1;
}

.logo-container {
  margin-bottom: 1.5rem;
}

.vue-logo {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 10px 30px rgba(66, 184, 131, 0.4));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.75rem;
  letter-spacing: -0.5px;
}

.highlight {
  background: linear-gradient(135deg, #42b883 0%, #35d9a2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.features {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.6rem 1rem;
  border-radius: 50px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(66, 184, 131, 0.2);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 1.1rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #42b883 0%, #35d9a2 100%);
  color: #1a1a2e;
  text-decoration: none;
  padding: 0.9rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px -5px rgba(66, 184, 131, 0.4);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px -5px rgba(66, 184, 131, 0.5);
}

.cta-button .arrow {
  transition: transform 0.3s ease;
}

.cta-button:hover .arrow {
  transform: translateX(4px);
}

.hint {
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
}

.hint code {
  background: rgba(66, 184, 131, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: #42b883;
  font-family: 'Fira Code', monospace;
}

/* Background shapes */
.background-shapes {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #42b883, #35d9a2);
  top: -100px;
  right: -100px;
  animation: pulse 8s ease-in-out infinite;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #3498db, #9b59b6);
  bottom: -50px;
  left: -50px;
  animation: pulse 10s ease-in-out infinite reverse;
}

.shape-3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #e74c3c, #f39c12);
  top: 50%;
  left: 10%;
  animation: pulse 12s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.2); opacity: 0.6; }
}

/* Responsive */
@media (max-width: 640px) {
  .splash-card {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
  
  .title {
    font-size: 1.8rem;
  }
  
  .features {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .feature-item {
    justify-content: center;
  }
}
</style>
