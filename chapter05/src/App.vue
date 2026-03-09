<template>
  <div :class="$style.container">
    <h1 :class="$style.title">Webpack5 CSS处理和资源管理</h1>

    <div :class="$style.section">
      <h2>CSS Modules 示例</h2>
      <div :class="buttonStyles.wrapper">
        <button :class="buttonStyles.primary">主要按钮</button>
        <button :class="buttonStyles.secondary">次要按钮</button>
        <button :class="buttonStyles.danger">危险按钮</button>
      </div>
    </div>

    <div :class="$style.section">
      <h2>图片资源示例</h2>
      <div :class="$style.imageGrid">
        <div :class="$style.imageItem">
          <img :src="smallImage" alt="小图片 (Base64)" />
          <p>小图片 (内联 Base64)</p>
        </div>
        <div :class="$style.imageItem">
          <img :src="largeImage" alt="大图片 (独立文件)" />
          <p>大图片 (独立文件)</p>
        </div>
      </div>
    </div>

    <div :class="$style.section">
      <h2>SCSS + CSS Modules 示例</h2>
      <div :class="cardStyles.card">
        <h3>SCSS 样式卡片</h3>
        <p>这个卡片使用了 SCSS 预处理器的特性，如嵌套规则和变量。</p>
      </div>
    </div>

    <div :class="$style.section">
      <h2>字体资源示例</h2>
      <p :class="fontStyles.customFont">这是自定义字体示例</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入图片资源
import smallImage from './assets/images/small-logo.svg';
import largeImage from './assets/images/webpack-logo.svg';

// 引入 CSS Modules
import buttonStyles from './components/Button.module.css';
import cardStyles from './components/Card.module.scss';
import fontStyles from './components/Font.module.css';

console.log('小图片:', smallImage);
console.log('大图片:', largeImage);
console.log('按钮样式:', buttonStyles);
</script>

<style lang="scss" module>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.title {
  color: #42b983;
  border-bottom: 2px solid #42b983;
  padding-bottom: 10px;
}

.section {
  margin: 30px 0;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;

  h2 {
    margin-top: 0;
    color: #333;
  }
}

.imageGrid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.imageItem {
  text-align: center;

  img {
    max-width: 200px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  p {
    font-size: 14px;
    color: #666;
  }
}
</style>
