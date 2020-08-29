<template>
  <div class="iframe-wrapper">
    <vue-friendly-iframe :src="url" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Post } from '~/types/struct'
import { getPosts } from '~/utils/externals/firestore'

type LocalData = {
  posts: Post[]
  url: String
}

export default Vue.extend({
  layout: 'empty',
  data(): LocalData {
    return {
      posts: [],
      url: 'https://btnmaker.me/'
    }
  },
  async mounted() {
    const posts: Post[] = await getPosts()
    this.posts = posts
    this.setNextPage(posts)
  },
  methods: {
    setNextPage(posts: Post[]) {
      if (posts.length === 1) return
      const post: Post = posts.shift() as Post
      setTimeout(() => {
        this.changePage(post.url)
        this.setNextPage(posts)
      }, post.durationMillisecond)
    },
    changePage(url: string): void {
      this.url = url
    }
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
