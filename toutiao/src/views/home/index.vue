<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        slot="title"
        class="search-btn"
        icon="search"
        type="info"
        round
        size="small"
      >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 文章频道列表 -->
    <van-tabs v-model="active">
      <van-tab 
      v-for="channel in channels"
      :title="channel.name"
      :key="channel.id">
      <!--文章列表-->
      <article-list :channel="channel"/>
      </van-tab>
    </van-tabs>
    <!-- /文章频道列表 -->
  </div>
</template>

<script>

import { getUserChannels } from '@/api/user.js'
import ArticleList from './components/article-list.vue'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList
  },
  props: {},
  data () {
    return {
      active: 0 ,// 控制被激活的标签
      channels: [] //频道列表
    }
  },
  computed: {},
  watch: {},
  created () {
      this.loadChannels()
  },
  mounted () {},
  methods: {
    async loadChannels(){  //请求获取频道数据
      const { data } = await getUserChannels()
      console.log(data)
      this.channels = data.data.channels
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: none;
  }
  .search-btn {
    width: 277px;
    height: 32px;
    background: #5babfb;
    border: none;
    .van-icon {
      font-size: 16px;
    }
    .van-button__text {
      font-size: 14px;
    }
  }
}
</style>