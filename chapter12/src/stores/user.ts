import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const users = ref<User[]>([
    { id: 1, name: '张三', email: 'zhangsan@example.com', avatar: 'Z' },
    { id: 2, name: '李四', email: 'lisi@example.com', avatar: 'L' },
    { id: 3, name: '王五', email: 'wangwu@example.com', avatar: 'W' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com', avatar: 'Z' },
  ]);

  const currentUser = ref<User | null>(null);
  const isLoading = ref(false);

  // 计算属性
  const userCount = computed(() => users.value.length);
  const hasUser = computed(() => currentUser.value !== null);

  // 方法
  function setCurrentUser(user: User | null) {
    currentUser.value = user;
  }

  function addUser(user: Omit<User, 'id'>) {
    const newUser: User = {
      ...user,
      id: Date.now(),
    };
    users.value.push(newUser);
  }

  function removeUser(id: number) {
    const index = users.value.findIndex(u => u.id === id);
    if (index > -1) {
      users.value.splice(index, 1);
    }
    if (currentUser.value?.id === id) {
      currentUser.value = null;
    }
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading;
  }

  return {
    users,
    currentUser,
    isLoading,
    userCount,
    hasUser,
    setCurrentUser,
    addUser,
    removeUser,
    setLoading,
  };
});
