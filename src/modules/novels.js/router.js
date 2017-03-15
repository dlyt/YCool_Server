import { ensureUser } from '../../middleware/validators'
import * as novel from './controller'

export const baseUrl = '/novels'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      novel.createNovel
    ]
  },
  {
    method: 'GET',
    route: '/search',
    handlers: [
      novel.searchNovel
    ]
  },
  {
    method: 'GET',
    route: '/search/bqk',
    handlers: [
      novel.searchFromBQK
    ]
  },
  {
    method: 'POST',
    route: '/acquire',
    handlers: [
      ensureUser,
      novel.getNovel
    ]
  },
  {
    method: 'GET',
    route: '/directory/:id',
    handlers: [
      novel.getDirectory
    ]
  },
  {
    method: 'GET',
    route: '/search/zh',
    handlers: [
      novel.searchFromZH
    ]
  },
]
