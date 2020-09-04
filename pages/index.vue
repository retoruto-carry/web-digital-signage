<template>
  <div>
    <div class="iframe-wrapper">
      <vue-friendly-iframe v-if="pages.length" :src="pages[pageIndex].url" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Page } from '~/types/struct'
import { toPage } from '~/utils/transformer/toObject'
import { firestore } from '~/utils/externals/firebase'

type LocalData = {
  pages: Page[]
  pageIndex: number
  timeoutId: NodeJS.Timeout | null
  url: string
}

export default Vue.extend({
  layout: 'empty',
  data(): LocalData {
    return {
      url: '',
      pages: [],
      pageIndex: 0,
      timeoutId: null
    }
  },
  mounted() {
    const pagesRef = firestore.collection('pages')
    pagesRef.onSnapshot(
      (docSnapshot) => {
        const pages: Page[] = []
        docSnapshot.forEach((doc) => {
          pages.push(toPage(doc))
        })
        this.pages = pages
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
            if (this.pageIndex === this.pages.length - 1) {
              this.pageIndex = 0
              resolve()
              return
            }
            this.pageIndex++
            resolve()
          }, this.pages[this.pageIndex].durationMillisecond)
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
