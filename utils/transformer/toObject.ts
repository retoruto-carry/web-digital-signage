import { Post } from '../../types/struct'
import { DocumentNotExistError } from '../../types/error'

type Document = firebase.firestore.DocumentSnapshot<
  firebase.firestore.DocumentData
>

export function toObject<T>(doc: Document): T {
  const obj: any = {
    id: doc.id,
    ...doc.data()
  }
  return obj as T
}

export function toPost(doc: Document): Post {
  if (!doc.exists) throw new DocumentNotExistError()
  const _doc: any = doc
  return {
    ...toObject<any>(doc),
    createdAt: _doc.data().createdAt.toDate()
  }
}
