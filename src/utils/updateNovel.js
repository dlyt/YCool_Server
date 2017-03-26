import Novel from '../models/novels'
import Chapter from '../models/chapters'
import Schedule from 'node-schedule'
import * as Crawler from './crawler'

async function update() {
  let crawlerList,      //获取所有需要更新提醒的小说
      $,                //DOM
      length,           //章节数量
      chapterArr,       //所有a标签里包含的数组
      count,
      postfix,          //爬取网站的后缀
      title,            //章节名称
      chapter           //章节数据，用于存储
  try {
    crawlerList = await Novel.find({type: 'VIP'})
  } catch (e) {
    Handle.sendEmail(e.message)
  }

  if (crawlerList) {
    for (let item of crawlerList.values()) {
      try {
        $ = await Crawler.getHtml(item.url)
      } catch (e) {
        Handle.sendEmail(e.message)
      }

      chapterArr = $('#list dd a')
      length = $('#list dd').length
      count = parseInt(item.countChapter)
      if (count !== length) {
        for (let i = count; i < length; i++) {
          chapter = new Chapter({
            postfix: chapterArr[i].attribs.href,
            title: chapterArr[i].children[0].data,
            number: i + 1,
            novel: item.id
          })
          try {
            await chapter.save()
          } catch (e) {
            Handle.sendEmail(e.message)
          }
        }
      }
      else {
        return true
      }
      item.updateTime = $('#info p')[2].children[0].data.substring(5, $('#info p')[2].children[0].data.length)
      item.countChapter = length
      item.lastChapterTitle = chapterArr[length - 1].children[0].data
      try {
        await item.save()
      } catch (e) {
        Handle.sendEmail(e.message)
      }
    }

  }
  else {
    return true
  }
}


export function start() {
  Schedule.scheduleJob('30 * * * * *', function () {
    update()
  })
}
