import { ensureUser } from '../../middleware/validators'
import * as bookshelf from './controller'

export const baseUrl = '/bookshelfs'

export default [
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureUser,
      bookshelf.getBookshelf
    ]
  },
  {
    method: 'POST',
    route: '/order',
    handlers: [
      ensureUser,
      bookshelf.orderNovel
    ]
  },
  {
    method: 'POST',
    route: '/delect',
    handlers: [
      bookshelf.delectNovel
    ]
  },
  {
    method: 'POST',
    route: '/change',
    handlers: [
      ensureUser,
      bookshelf.changeBookshelf
    ]
  }
]
