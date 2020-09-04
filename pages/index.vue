<template>
  <div>
    <div class="iframe-wrapper">
      <vue-friendly-iframe v-if="posts.length" :src="posts[pageIndex].url" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Post } from '~/types/struct'
import { toPost } from '~/utils/transformer/toObject'
import { firestore } from '~/utils/externals/firebase'

type LocalData = {
  posts: Post[]
  pageIndex: number
  timeoutId: NodeJS.Timeout | null
  url: string
}

export default Vue.extend({
  layout: 'empty',
  data(): LocalData {
    return {
      url: '',
      posts: [],
      pageIndex: 0,
      timeoutId: null
    }
  },
  mounted() {
    const postsRef = firestore.collection('posts')
    postsRef.onSnapshot(
      (docSnapshot) => {
        const posts: Post[] = []
        docSnapshot.forEach((doc) => {
          posts.push(toPost(doc))
        })
        this.posts = posts
        if (this.timeoutId) clearTimeout(this.timeoutId)
        this.startLoop()
      },
      (err) => {
        console.log(`Encountered error: ${err}`)
      }
    )
  },
  methods: {
    async startLoop(): Promise<void> {
      while (true) {
        await new Promise((resolve) => {
          this.timeoutId = setTimeout(() => {
            if (this.pageIndex === this.posts.length - 1) {
              this.pageIndex = 0
              resolve()
            }
            this.pageIndex++
            resolve()
          }, this.posts[this.pageIndex].durationMillisecond)
        })
      }
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
