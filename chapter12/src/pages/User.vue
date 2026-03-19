<template>
  <div class="user-page">
    <div class="container">
      <h2>用户中心</h2>

      <div class="user-actions">
        <button @click="showAddForm = !showAddForm" class="btn btn-primary">
          {{ showAddForm ? '取消添加' : '添加用户' }}
        </button>
      </div>

      <!-- 添加用户表单 -->
      <div v-if="showAddForm" class="add-form">
        <h3>添加新用户</h3>
        <form @submit.prevent="handleAddUser">
          <div class="form-group">
            <label>姓名</label>
            <input v-model="newUser.name" type="text" placeholder="请输入姓名" required />
          </div>
          <div class="form-group">
            <label>邮箱</label>
            <input v-model="newUser.email" type="email" placeholder="请输入邮箱" required />
          </div>
          <div class="form-group">
            <label>头像</label>
            <input v-model="newUser.avatar" type="text" placeholder="请输入头像文字" />
          </div>
          <button type="submit" class="btn btn-success">确认添加</button>
        </form>
      </div>

      <!-- 用户列表 -->
      <div class="user-list">
        <h3>用户列表 ({{ userStore.userCount }})</h3>
        <div class="user-grid">
          <div
            v-for="user in userStore.users"
            :key="user.id"
            class="user-card"
            :class="{ active: userStore.currentUser?.id === user.id }"
            @click="handleSelectUser(user)"
          >
            <div class="user-avatar">{{ user.avatar }}</div>
            <div class="user-info">
              <h4>{{ user.name }}</h4>
              <p>{{ user.email }}</p>
            </div>
            <button @click.stop="handleDeleteUser(user.id)" class="btn-delete">
              删除
            </button>
          </div>
        </div>
      </div>

      <!-- 当前选中的用户 -->
      <div v-if="userStore.currentUser" class="current-user">
        <h3>当前选中</h3>
        <div class="selected-card">
          <div class="user-avatar large">{{ userStore.currentUser.avatar }}</div>
          <div class="user-details">
            <h4>{{ userStore.currentUser.name }}</h4>
            <p>{{ userStore.currentUser.email }}</p>
            <p class="user-id">ID: {{ userStore.currentUser.id }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useUserStore } from '@/stores/user';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

const userStore = useUserStore();

const showAddForm = ref(false);
const newUser = reactive({
  name: '',
  email: '',
  avatar: '',
});

function handleSelectUser(user: User) {
  if (userStore.currentUser?.id === user.id) {
    userStore.setCurrentUser(null);
  } else {
    userStore.setCurrentUser(user);
  }
}

function handleAddUser() {
  if (newUser.name && newUser.email) {
    userStore.addUser({
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar || newUser.name.charAt(0).toUpperCase(),
    });
    // 重置表单
    newUser.name = '';
    newUser.email = '';
    newUser.avatar = '';
    showAddForm.value = false;
  }
}

function handleDeleteUser(id: number) {
  userStore.removeUser(id);
}
</script>

<style scoped lang="scss">
.user-page {
  .container {
    max-width: 900px;
    margin: 0 auto;
  }

  h2 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 30px;
    text-align: center;
  }

  h3 {
    color: #333;
    margin-bottom: 20px;
  }
}

.user-actions {
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s;

  &-primary {
    background: #42b883;
    color: #fff;

    &:hover {
      background: #359268;
    }
  }

  &-success {
    background: #4caf50;
    color: #fff;

    &:hover {
      background: #43a047;
    }
  }
}

.add-form {
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
      font-weight: 500;
      color: #333;
      font-size: 0.9rem;
    }

    input {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.95rem;
      transition: border-color 0.3s;

      &:focus {
        outline: none;
        border-color: #42b883;
      }
    }
  }
}

.user-list {
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;

  &:hover {
    background: #f0f0f0;
  }

  &.active {
    border-color: #42b883;
    background: #e8f5e9;
  }
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #42b883, #3498db);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  flex-shrink: 0;

  &.large {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
}

.user-info {
  flex: 1;
  min-width: 0;

  h4 {
    color: #333;
    font-size: 0.95rem;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    color: #666;
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.btn-delete {
  padding: 6px 12px;
  background: #ff4757;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.3s;

  &:hover {
    background: #ff6b7a;
  }
}

.current-user {
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.selected-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #e8f5e9;
  border-radius: 10px;
}

.user-details {
  h4 {
    color: #333;
    font-size: 1.25rem;
    margin-bottom: 8px;
  }

  p {
    color: #666;
    font-size: 0.9rem;
  }

  .user-id {
    color: #42b883;
    font-weight: 500;
    margin-top: 8px;
  }
}
</style>
