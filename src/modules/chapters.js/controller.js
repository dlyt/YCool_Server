import Bookshelf from '../../models/bookshelfs'
import Chapter from '../../models/chapters'
import Novel from '../../models/novels'
import * as Crawler from '../../utils/crawler'


/**
  @api {GET} /chapters/:id 获取章节信息
  @apiVersion 1.0.0
  @apiName 获取章节信息
  @apiGroup Chapters

  @apiExample Example usage:
    curl -H "Content-Type: application/json" -X GET http://localhost:5000/chapters/58c4cbce9e4dad30f80d34e7

  @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
      "detail": {
        "_id": "58c4cbce9e4dad30f80d373e",
        "title": "第五百九十九章，崩盘（2）",
        "postfix": "3455564.html",
        "number": 598,
        "novel": {
          "_id": "58c4cbce9e4dad30f80d34e7",
          "url": "http://www.37zw.com/3/3731/",
          "name": "1855美国大亨"
        },
        "__v": 0,
        "content": "&nbsp;&nbsp;&nbsp;&nbsp;安克雷奇港突然的就安静了下来，自打几个月前危机爆发后，尤其是标准石油宣布将下调燃油和原油价格之后，抵达这里的船只就越来越少了，最近一个星期，平均每天都只有几条船抵达港口。 而这些船当中，真正的最有意义的超级油轮却没多少，这个星期里仅仅只来了一条而已。其他的船都是些渔船呀，捕鲸船呀什么的。据说德国人现在还在购入石油，但是因为从标准直接购入石油的成本已经比从阿拉斯加开采更低了，所以那些油轮也不再往这边跑了。&nbsp;&nbsp;&nbsp;&nbsp十五的地步。剩下的那些没有失业的工人，他们的工资也大幅下降了两成到五成。虽然信奉工联主义的社民党努力的安抚，但是自发的罢工，乃至暴.动也开始此起彼伏的发生。&nbsp;&nbsp;&nbsp;&nbsp;[三七中文手机版 m.37zw.com]"
      }
    }

  @apiErrorExample {json} Error-Response:
    HTTP/1.1 422 Unprocessable Entity
      {
        "status": 422,
        "error": ""
      }
 */
export async function getChapterInfo (ctx) {
  const id = ctx.params.id
  try {
    var detail = await Chapter.getContent(id)
  } catch (e) {
    Handle.sendEmail(e.message)
    ctx.throw(422, e.message)
  }

  //如果没有内容，会去网站爬取
  if (detail.content) {
    ctx.body = {
      success: true
    }
  }
  else {
    const url = `${detail.novel.url}${detail.postfix}`
    try {
      const content = await Crawler.getChapterContent(url)
      detail.content = content
      await detail.save()
    } catch (e) {
      Handle.sendEmail(e.message)
      ctx.throw(422, e.message)
    }
  }

  const response = detail.toJSON()

  ctx.body = {
    detail: response
  }
  Handle.count('getChapterInfo')
}

/**
  @api {GET} /chapter/next/:id 获取下一章信息
  @apiVersion 1.0.0
  @apiName 获取下一章信息
  @apiGroup Chapters

  @apiExample Example usage:
    curl -H "Content-Type: application/json" -X GET http://localhost:5000/chapters/next/58bc1ec43f9cdc31b9bea8dc


  @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
      "detail": {
        "_id": "58c4cbce9e4dad30f80d373e",
        "title": "第五百九十九章，崩盘（2）",
        "postfix": "3455564.html",
        "number": 598,
        "novel": {
          "_id": "58c4cbce9e4dad30f80d34e7",
          "url": "http://www.37zw.com/3/3731/",
          "name": "1855美国大亨"
        },
        "__v": 0,
        "content": "&nbsp;&nbsp;&nbsp;&nbsp;安克雷奇港突然的就安静了下来，自打几个月前危机爆发后，尤其是标准石油宣布将下调燃油和原油价格之后，抵达这里的船只就越来越少了，最近一个星期，平均每天都只有几条船抵达港口。 而这些船当中，真正的最有意义的超级油轮却没多少，这个星期里仅仅只来了一条而已。其他的船都是些渔船呀，捕鲸船呀什么的。据说德国人现在还在购入石油，但是因为从标准直接购入石油的成本已经比从阿拉斯加开采更低了，所以那些油轮也不再往这边跑了。&nbsp;&nbsp;&nbsp;&nbsp十五的地步。剩下的那些没有失业的工人，他们的工资也大幅下降了两成到五成。虽然信奉工联主义的社民党努力的安抚，但是自发的罢工，乃至暴.动也开始此起彼伏的发生。&nbsp;&nbsp;&nbsp;&nbsp;[三七中文手机版 m.37zw.com]"
      }
    }

  @apiErrorExample {json} Error-Response:
    HTTP/1.1 422 Unprocessable Entity
      {
        "status": 422,
        "error": ""
      }
 */
export async function getNextChapterInfo (ctx) {
  const id = ctx.params.id
  try {
    var currentDetail = await Chapter.getContent(id)
  } catch (e) {
    Handle.sendEmail(e.message)
    ctx.throw(422, e.message)
  }

  const chapterNum = currentDetail.number + 1
  const novelId = currentDetail.novel.id
  try {
    var nextDetail = await Chapter.getContentByNumber(chapterNum, novelId)
  } catch (e) {
    Handle.sendEmail(e.message)
    ctx.throw(422, e.message)
  }

  if (nextDetail.content) {
    ctx.body = {
        success: true
    }
  }
  else {
    const url = `${currentDetail.novel.url}${nextDetail.postfix}`
    try {
      const content = await Crawler.getChapterContent(url)
      nextDetail.content = content
      await nextDetail.save()
    } catch (err) {
      Handle.sendEmail(e.message)
      ctx.throw(422, e.message)
    }
  }

  const response = nextDetail.toJSON()

  ctx.body = {
    detail: response
  }
  Handle.count('getNextChapterInfo')
}

/**
  @api {GET} /chapter/last/:id 获取上一章信息
  @apiVersion 1.0.0
  @apiName 获取上一章信息
  @apiGroup Chapters

  @apiExample Example usage:
    curl -H "Content-Type: application/json" -X GET http://localhost:5000/chapters/last/58bc1ec43f9cdc31b9bea8dc

  @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
      "detail": {
        "_id": "58c4cbce9e4dad30f80d373e",
        "title": "第五百九十九章，崩盘（2）",
        "postfix": "3455564.html",
        "number": 598,
        "novel": {
          "_id": "58c4cbce9e4dad30f80d34e7",
          "url": "http://www.37zw.com/3/3731/",
          "name": "1855美国大亨"
        },
        "__v": 0,
        "content": "&nbsp;&nbsp;&nbsp;&nbsp;安克雷奇港突然的就安静了下来，自打几个月前危机爆发后，尤其是标准石油宣布将下调燃油和原油价格之后，抵达这里的船只就越来越少了，最近一个星期，平均每天都只有几条船抵达港口。 而这些船当中，真正的最有意义的超级油轮却没多少，这个星期里仅仅只来了一条而已。其他的船都是些渔船呀，捕鲸船呀什么的。据说德国人现在还在购入石油，但是因为从标准直接购入石油的成本已经比从阿拉斯加开采更低了，所以那些油轮也不再往这边跑了。&nbsp;&nbsp;&nbsp;&nbsp十五的地步。剩下的那些没有失业的工人，他们的工资也大幅下降了两成到五成。虽然信奉工联主义的社民党努力的安抚，但是自发的罢工，乃至暴.动也开始此起彼伏的发生。&nbsp;&nbsp;&nbsp;&nbsp;[三七中文手机版 m.37zw.com]"
      }
    }

  @apiErrorExample {json} Error-Response:
    HTTP/1.1 422 Unprocessable Entity
      {
        "status": 422,
        "error": ""
      }
 */
export async function getLastChapterInfo (ctx) {
  const id = ctx.params.id
  try {
    var currentDetail = await Chapter.getContent(id)
  } catch (e) {
    Handle.sendEmail(e.message)
    ctx.throw(422, err.message)
  }

  const chapterNum = currentDetail.number - 1
  const novelId = currentDetail.novel.id
  try {
    var lastDetail = await Chapter.getContentByNumber(chapterNum, novelId)
  } catch (e) {
    Handle.sendEmail(e.message)
    ctx.throw(422, e.message)
  }

  if (lastDetail.content) {
    ctx.body = {
        success: true
    }
  }
  else {
    const url = `${currentDetail.novel.url}${lastDetail.postfix}`
    try {
      const content = await Crawler.getChapterContent(url)
      lastDetail.content = content
      await lastDetail.save()
    } catch (e) {
      Handle.sendEmail(e.message)
      ctx.throw(422, e.message)
    }
  }

  const response = lastDetail.toJSON()

  ctx.body = {
    detail: response
  }
  Handle.count('getLastChapterInfo')
}
