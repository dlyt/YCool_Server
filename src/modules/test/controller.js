import Chapter from '../../models/chapters'
import Novel from '../../models/novels'
import * as Crawler from '../../utils/crawler'


export async function getChapters (ctx) {
  const html = await Crawler.getHtml('http://search.zongheng.com/search/mvc/suggest.do?keyword=l%E2%80%86j')
  console.log(html);
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
