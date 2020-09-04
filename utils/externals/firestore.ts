import { firestore } from '~/utils/externals/firebase'
import { Page } from '~/types/struct'
import { toPost } from '~/utils/transformer/toObject'

export async function getPosts(): Promise<Page[]> {
  const pagesDoc = await firestore
    .collection('pages')
    .orderBy('createdAt', 'desc')
    .get()
  return pagesDoc.docs.map(
    (postDoc): Page => {
      return toPost(postDoc)
    }
  ) as Page[]
}
