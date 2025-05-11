<template>
  <header class="page-header">
    <div class="container">
      <!-- 左侧 Logo + 主导航 -->
      <div class="left">
        <router-link to="/" class="logo">LOGO</router-link>
        <nav class="main-nav">
          <ul>
            <li v-for="item in navList" :key="item.name">
              <router-link :to="item.path">{{ item.name }}</router-link>
            </li>
          </ul>
        </nav>
      </div>

      <!-- 中间 搜索框 -->
      <div class="center">
        <input
          v-model="searchText"
          @keyup.enter="onSearch"
          class="search-input"
          placeholder="人在高压疲暴的工作下很难成长"
        />
        <button class="btn-search" @click="onSearch">搜索</button>
      </div>

      <!-- 右侧 用户操作区 -->
      <div class="right">
        <img class="avatar" src="https://via.placeholder.com/32" alt="avatar" />

        <router-link to="/vip" class="action">大会员</router-link>

        <div class="action with-badge" @click="goMessage">
          消息
          <span class="badge">{{ badges.msg }}</span>
        </div>
        <div class="action with-badge" @click="goFeed">
          动态
          <span class="badge">{{ badges.feed }}</span>
        </div>
        <router-link to="/favorites" class="action with-badge">
          收藏
          <span class="badge">{{ badges.fav }}</span>
        </router-link>
        <router-link to="/history" class="action">历史</router-link>
        <router-link to="/creator" class="action">创作中心</router-link>

        <button class="btn-post" @click="goPost">投稿</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navList = [
  { name: '首页', path: '/' },
  { name: '番剧', path: '/bangumi' },
  { name: '直播', path: '/live' },
  { name: '游戏中心', path: '/games' },
  { name: '会员购', path: '/vip-shop' },
  { name: '漫画', path: '/comic' },
  { name: '赛事', path: '/events' },
  { name: '主题曲', path: '/theme' },
  { name: '下载客户端', path: '/download' },
]

const searchText = ref('')

function onSearch() {
  if (searchText.value.trim()) {
    router.push({ path: '/search', query: { q: searchText.value } })
  }
}

const badges = {
  msg: 34,
  feed: 20,
  fav: 0,
}

function goMessage() {
  router.push('/message')
}
function goFeed() {
  router.push('/feed')
}
function goPost() {
  router.push('/upload')
}
</script>

<style scoped>
.page-header {
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 60px;
}
.left,
.center,
.right {
  display: flex;
  align-items: center;
}
.logo {
  font-size: 1.25rem;
  font-weight: bold;
  margin-right: 24px;
}
.main-nav ul {
  display: flex;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.main-nav a {
  color: #333;
  text-decoration: none;
  font-size: 0.95rem;
}
.main-nav a:hover {
  color: #007aff;
}
.center {
  flex: 1;
  justify-content: center;
}
.search-input {
  width: 300px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  outline: none;
}
.btn-search {
  padding: 6px 12px;
  border: 1px solid #007aff;
  background: #007aff;
  color: #fff;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}
.btn-search:hover {
  background: #005fcc;
}
.right .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
  cursor: pointer;
}
.action {
  margin: 0 8px;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  position: relative;
}
.with-badge {
  display: flex;
  align-items: center;
}
.badge {
  display: inline-block;
  min-width: 16px;
  padding: 0 4px;
  font-size: 0.75rem;
  color: #fff;
  background: #f56c6c;
  border-radius: 8px;
  line-height: 16px;
  text-align: center;
  margin-left: 4px;
}
.btn-post {
  margin-left: 16px;
  padding: 6px 14px;
  background: #ff2a7b;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-post:hover {
  background: #e6005e;
}
</style>
