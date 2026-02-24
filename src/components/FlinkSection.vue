<template>
  <div class="flink-section">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>正在加载友情链接...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>加载失败: {{ error }}</p>
      <button @click="retryLoad" class="retry-btn">重试</button>
    </div>

    <div v-else class="flink-content">
      <div v-for="(category, index) in linksData" :key="index" class="flink-category">
        <h2 :id="category.anchor" class="category-title">
          <a :href="'#' + category.anchor" class="headerlink" :title="category.title"></a>
          {{ category.title }}
        </h2>
        <div class="flink-desc">{{ category.description }}</div>
        
        <div class="flink-list">
          <div 
            v-for="(item, itemIndex) in category.items" 
            :key="itemIndex" 
            class="flink-list-item"
            :class="{ 'item-loaded': item.loaded }"
          >
            <a :href="item.link" :title="item.name" target="_blank" rel="noopener noreferrer">
              <div class="flink-item-icon">
                <img 
                  :src="item.imgError ? fallbackImage : item.avatar" 
                  :alt="item.name"
                  loading="lazy"
                  @load="handleImageLoad(item)"
                  @error="handleImageError(item)"
                  class="no-lightbox"
                />
                <!-- Loading placeholder for icon -->
                <div v-if="!item.imgLoaded && !item.imgError" class="img-placeholder"></div>
              </div>
              <div class="flink-item-name">{{ item.name }}</div>
              <div class="flink-item-desc" :title="item.descr">{{ item.descr }}</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  initialData: {
    type: Array,
    default: () => []
  },
  fallbackImage: {
    type: String,
    default: '/img/friend_404.gif'
  }
});

const loading = ref(true);
const error = ref(null);
const linksData = ref([]);

// 模拟数据加载（实际项目中可替换为 API 调用）
const loadData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 如果有传入数据则使用传入数据，否则使用默认数据
    if (props.initialData && props.initialData.length > 0) {
      linksData.value = JSON.parse(JSON.stringify(props.initialData));
    } else {
      // 默认数据
      linksData.value = [
        {
          title: '技术博客',
          anchor: '技术博客',
          description: '优质技术资源',
          items: [
            {
              name: 'Butterfly官网',
              link: 'https://butterfly.js.org',
              avatar: 'https://butterfly.js.org/img/logo.svg',
              descr: 'Butterfly主题官方文档',
              imgLoaded: false,
              imgError: false
            },
            {
              name: 'Hexo官网',
              link: 'https://hexo.io',
              avatar: 'https://hexo.io/logo.svg',
              descr: 'Hexo博客框架官方网站',
              imgLoaded: false,
              imgError: false
            }
          ]
        },
        {
          title: '个人博客',
          anchor: '个人博客',
          description: '值得关注的个人博客',
          items: [
            {
              name: '示例博客',
              link: 'https://example.com',
              avatar: '/img/placeholder.jpg',
              descr: '这是一个示例博客',
              imgLoaded: false,
              imgError: false
            }
          ]
        }
      ];
    }
  } catch (err) {
    error.value = '数据加载异常，请检查网络连接';
    console.error('Links load error:', err);
  } finally {
    loading.value = false;
  }
};

const handleImageLoad = (item) => {
  item.imgLoaded = true;
};

const handleImageError = (item) => {
  item.imgError = true;
  item.imgLoaded = true; // Mark as loaded so placeholder disappears
};

const retryLoad = () => {
  loadData();
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* 容器样式优化 */
.flink-section {
  width: 100%;
  min-height: 200px;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: #666;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #49b1f5;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #49b1f5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: #2691d9;
}

/* 原始 flink 样式复刻与优化 */
.flink-list {
  overflow: auto;
  padding: 10px 10px 0;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 15px; /* 使用 gap 代替 margin 计算，更现代 */
}

.flink-list-item {
  position: relative;
  width: calc(100% / 3 - 10px); /* 减去 gap 的大致份额 */
  height: 90px;
  line-height: 17px;
  border-radius: 8px;
  transition: all 0.3s;
  background: transparent; /* 确保背景透明或符合主题 */
  border: 1px solid #e0e0e0; /* 添加边框增加可见性 */
  box-sizing: border-box; /* 确保 padding/border 不增加宽度 */
  overflow: hidden;
}

.flink-list-item:hover {
  background: rgba(73, 177, 245, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.flink-list-item a {
  display: block;
  width: 100%;
  height: 100%;
  color: inherit;
  text-decoration: none;
  padding: 10px;
  box-sizing: border-box;
}

.flink-item-icon {
  float: left;
  overflow: hidden;
  margin-right: 10px;
  width: 60px;
  height: 60px;
  border-radius: 30px; /* 圆形头像 */
  transition: width 0.3s;
  position: relative;
}

.flink-item-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s;
}

.img-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.flink-item-name {
  font-weight: bold;
  font-size: 1.1em;
  padding: 8px 0 5px;
  height: 32px; /* 限制高度 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.flink-item-desc {
  font-size: 0.9em;
  opacity: 0.7;
  height: 34px; /* 两行高度 */
  overflow: hidden;
  text-align: left;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 悬停效果：复刻原始 CSS 逻辑 */
.flink-list-item:hover .flink-item-icon {
  width: 0;
  margin-right: 0;
}

/* 响应式适配 */
@media screen and (max-width: 1024px) {
  .flink-list-item {
    width: calc(50% - 8px); /* 两列 */
  }
}

@media screen and (max-width: 600px) {
  .flink-list-item {
    width: 100%; /* 单列 */
  }
}
</style>
