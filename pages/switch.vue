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
    this.setNextPage(posts, 0)
  },
  methods: {
    setNextPage(posts: Post[], index: number) {
      if (posts.length === 1) return
      if (index >= posts.length) index = 0
      const post: Post = posts[index] as Post
      this.changePage(post.url)
      setTimeout(() => {
        this.setNextPage(posts, ++index)
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
