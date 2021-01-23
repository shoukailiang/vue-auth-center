<template>
  <div >
      <app-header></app-header>
      <div class="main">
        <!-- 主区域组件渲染 -->
        <router-view></router-view>
      </div>
      <app-footer></app-footer>
  </div>
</template>

<script>
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'
export default {
  components: { AppHeader, AppFooter },
}
</script>

<style >
.main {
  min-height: 700px;
  width: 100%;
}
</style> 
