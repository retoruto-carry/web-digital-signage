<template>
  <div>
    <h1>Screen</h1>
    <p v-for="post in posts" :key="post.id">{{ post.url }}</p>
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
