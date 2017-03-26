import Chapter from '../../models/chapters'
import Novel from '../../models/novels'
import * as Crawler from '../../utils/crawler'
import * as UpdateNovel from '../../utils/updateNovel'


export async function getChapters (ctx) {
  UpdateNovel.start()
  ctx.body = {
    success: true
  }
}

export async function getImgs (ctx) {
  const type = ctx.query.type
  const data = await Crawler.request('http://112.74.34.241:3000/meizi/random?type=%E5%8F%B0%E6%B9%BE')
  const url = JSON.parse(data).url

  ctx.body = {
    url: url
  }
}
