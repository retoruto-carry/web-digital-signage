import { firestore } from '~/utils/externals/firebase'
import { Post } from '~/types/struct'
import { toPost } from '~/utils/transformer/toObject'

export async function getPosts(): Promise<Post[]> {
  const postsDoc = await firestore
    .collection('posts')
    .orderBy('createdAt', 'desc')
    .get()
  return postsDoc.docs.map(
    (postDoc): Post => {
      return toPost(postDoc)
    }
  ) as Post[]
}
