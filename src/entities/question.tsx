import User from './user'

export default interface Question {
  id: string
  author: User
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likes: Record<string, { authorId: string }>
  likeCount: number
  likeId?: string
}
