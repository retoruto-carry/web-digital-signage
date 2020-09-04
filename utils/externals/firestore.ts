import { firestore } from '~/utils/externals/firebase'
import { Page } from '~/types/struct'
import { toPage } from '~/utils/transformer/toObject'

export async function getPosts(): Promise<Page[]> {
  const pagesDoc = await firestore
    .collection('pages')
    .orderBy('createdAt', 'desc')
    .get()
  return pagesDoc.docs.map(
    (postDoc): Page => {
      return toPage(postDoc)
    }
  ) as Page[]
}
