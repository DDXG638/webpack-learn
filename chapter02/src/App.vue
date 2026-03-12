<template>
  <div class="app-container">
    <h1>Webpack5 Loader 学习</h1>
    <p class="subtitle">第二章：Loader 机制和使用</p>

    <div class="sections">
      <!-- Loader 演示区域 -->
      <section class="demo-section">
        <h2>1. Babel Loader (ES6+ 转 ES5)</h2>
        <div class="demo-box">
          <p>查看控制台输出：使用了箭头函数、模板字符串等ES6+语法</p>
          <button @click="testEs6">测试 ES6+ 语法</button>
        </div>
      </section>

      <section class="demo-section">
        <h2>2. Raw Loader (加载原始文本)</h2>
        <div class="demo-box">
          <p>读取的文本内容：</p>
          <pre class="code-block">{{ rawText }}</pre>
        </div>
      </section>

      <section class="demo-section">
        <h2>3. CSS Loader (样式处理)</h2>
        <div class="demo-box demo-styled">
          <p>这是通过 CSS Loader 加载的样式</p>
        </div>
      </section>

      <section class="demo-section">
        <h2>4. SCSS Loader (SASS 预处理)</h2>
        <div class="demo-box demo-scss">
          <p>这是通过 SCSS Loader 编译的样式</p>
        </div>
      </section>

      <section class="demo-section">
        <h2>5. Asset Modules (图片资源)</h2>
        <div class="demo-box">
          <p>小图（&lt;8KB）转为 Base64：</p>
          <img :src="smallImage" alt="小图" class="demo-img" />
          <p>大图使用 file-loader 输出：</p>
          <img :src="largeImage" alt="大图" class="demo-img" />
        </div>
      </section>

      <section class="demo-section">
        <h2>6. Vue Loader (单文件组件)</h2>
        <div class="demo-box">
          <HelloWorld />
        </div>
      </section>

      <section class="demo-section">
        <h2>7. 自定义 Loader</h2>
        <div class="demo-box">
          <CustomLoaderDemo />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import CustomLoaderDemo from './components/CustomLoaderDemo.vue';
// 使用 asset/source (原 raw-loader) 加载原始文本
import rawText from './assets/demo.txt';
// 使用 asset 模块处理图片
import smallImage from './assets/small-logo.svg';
import largeImage from './assets/a2ui-composer.png';

// ES6+ 语法测试
const testEs6 = () => {
  // 箭头函数
  const add = (a: number, b: number): number => a + b;

  // 模板字符串
  const message = `计算结果: ${add(2, 3)}`;

  // 解构赋值
  const obj = { name: 'Webpack', version: 5 };
  const { name, version } = obj;

  // 展开运算符
  const arr = [1, 2, 3];
  const newArr = [...arr, 4, 5];

  console.log(message);
  console.log(`框架: ${name}, 版本: ${version}`);
  console.log('数组:', newArr);

  alert(message);
};

// 使用ref存储rawText
// 注册组件
const components = {
  HelloWorld,
  CustomLoaderDemo,
};

// 使用ref存储rawText
const rawTextContent = ref(rawText.trim());

onMounted(() => {
  console.log('App mounted, raw text loaded:', rawTextContent.value);
});
</script>

<style lang="scss" scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.demo-section {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #f9f9f9;

  h2 {
    margin-top: 0;
    color: #42b883;
  }
}

.demo-box {
  padding: 15px;
  background: #fff;
  border-radius: 4px;
}

.code-block {
  background: #282c34;
  color: #abb2bf;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

.demo-img {
  max-width: 200px;
  margin: 10px;
}
</style>
