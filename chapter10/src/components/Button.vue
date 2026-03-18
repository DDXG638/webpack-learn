<template>
  <button class="custom-button" @click="handleClick">
    {{ text }}
  </button>
</template>

<script setup lang="ts">
interface Props {
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  text: '按钮',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<style scoped>
.custom-button {
  padding: 10px 20px;
  font-size: 14px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.custom-button:hover {
  background: #45a049;
}

.custom-button:active {
  background: #3d8b40;
}
</style>
