<template>
  <div class="iframe-wrapper">
    <vue-friendly-iframe
      v-if="pages.length"
      :src="interruptPage ? interruptPage.url : pages[pageIndex].url"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Page } from '~/types/struct'
import { toPage } from '~/utils/transformer/toObject'
import { firestore, firebase } from '~/utils/externals/firebase'

type LocalData = {
  interruptPage: Page | null
  pages: Page[]
  pageIndex: number
  timeoutId: NodeJS.Timeout | null
}

export default Vue.extend({
  layout: 'empty',
  data(): LocalData {
    return {
      interruptPage: null,
      pages: [],
      pageIndex: 0,
      timeoutId: null
    }
  },
  mounted() {
    const pagesRef = firestore.collection('pages')
    pagesRef.onSnapshot((querySnapShot) => {
      this.stopLoop()
      const pages: Page[] = []
      querySnapShot.forEach((doc) => {
        pages.push(toPage(doc))
      })
      this.pages = pages
      this.startLoop()
    })
    const interruptPagesRef = firestore
      .collection('interruptPages')
      .where(
        'createdAt',
        '>',
        firebase.firestore.Timestamp.fromDate(new Date())
      )
    interruptPagesRef.onSnapshot((querySnapShot) => {
      querySnapShot.docChanges().forEach((change) => {
        if (change.type !== 'added') return
        this.stopLoop()
        this.interruptPage = toPage(change.doc)
        setTimeout(() => {
          this.interruptPage = null
          this.startLoop()
        }, this.interruptPage.durationMillisecond)
      })
    })
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
    },
    stopLoop(): void {
      if (this.timeoutId) clearTimeout(this.timeoutId)
    }
  }
})
</script>

<style lang="scss" scoped>
html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
  background-color: #191ca9;
}

.iframe-wrapper {
  border: 1px solid gray;
  height: 100%;
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
