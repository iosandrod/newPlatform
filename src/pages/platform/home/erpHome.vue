<template>
  <el-container style="height: 100vh;">
    <!-- Header -->
    <el-header height="60px" class="header">
      <div class="logo">MyApp Platform</div>
      <el-menu mode="horizontal" class="header-menu">
        <el-menu-item index="1">Home</el-menu-item>
        <el-menu-item index="2">About</el-menu-item>
        <el-menu-item index="3">Contact</el-menu-item>
      </el-menu>
    </el-header> 

    <!-- Main Layout -->
    <el-container>
      <!-- Sidebar Menu -->
      <el-aside width="200px" class="aside">
        <el-menu default-active="1" class="el-menu-vertical-demo">
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            Dashboard
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-setting"></i>
            Settings
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-user"></i>
            Profile
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-document"></i>
            Reports
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Content Area -->
      <el-main class="main">
        <div class="cards-container">
          <el-card v-for="app in apps" :key="app.id" class="app-card">
            <div class="card-header">
              <i :class="app.icon" class="app-icon"></i>
              <span class="app-title">{{ app.name }}</span>
            </div>
            <div class="card-body">
              {{ app.description }}
            </div>
            <div class="card-footer">
              <el-button type="primary" size="small">Open</el-button>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>

    <!-- Footer -->
    <el-footer height="40px" class="footer">
      © 2025 MyApp Platform
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface AppItem {
  id: number
  name: string
  description: string
  icon: string
}

const apps = ref<AppItem[]>([
  {
    id: 1,
    name: 'Analytics',
    description: 'View data insights',
    icon: 'el-icon-data-analysis',
  },
  {
    id: 2,
    name: 'Tasks',
    description: 'Manage your tasks',
    icon: 'el-icon-check',
  },
  {
    id: 3,
    name: 'Messages',
    description: 'Check your messages',
    icon: 'el-icon-message',
  },
  {
    id: 4,
    name: 'Settings',
    description: 'Configure your preferences',
    icon: 'el-icon-setting',
  },
])
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #409eff;
  color: #fff;
}
.logo {
  font-size: 20px;
  font-weight: bold;
}
.header-menu >>> .el-menu-item {
  color: #fff;
}
.aside {
  background: #f0f2f5;
}
.main {
  padding: 20px;
  background: #f9fafb;
}
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
.app-card {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}
.app-card:hover {
  transform: translateY(-5px);
}
.card-header {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}
.app-icon {
  font-size: 24px;
  margin-right: 8px;
}
.card-body {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}
.card-footer {
  text-align: right;
}
.footer {
  text-align: center;
  color: #909399;
  background: #f0f2f5;
}
</style>
