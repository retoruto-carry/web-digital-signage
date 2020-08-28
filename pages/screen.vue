<template>
  <div class="iframe-wrapper">
    <vue-friendly-iframe :src="'http://btnmaker.me/'" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Post } from '~/types/struct'
import { getPosts } from '~/utils/externals/firestore'

type LocalData = {
  posts: Post[]
}

export default Vue.extend({
  layout: 'empty',
  data(): LocalData {
    return {
      posts: []
    }
  },
  async created() {
    const posts: Post[] = await getPosts()
    this.posts = posts
  }
})
</script>

<style lang="scss" scoped>
.iframe-wrapper {
  border: 1px solid gray;
  height: 100vw;
  .vue-friendly-iframe {
    height: 100%;
    width: 100%;
    ::v-deep iframe {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
