import Bookshelf from '../../models/bookshelfs'
import Chapter from '../../models/chapters'
import Novel from '../../models/novels'
import * as Crawler from '../../utils/crawler'


/**
 * @api {GET} /chapters/:id 获取章节信息
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName 获取章节信息
 * @apiGroup Chapters
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET http://localhost:5000/chapters/58c4cbce9e4dad30f80d34e7
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *       "success": true
 *    }
 *
 * @apiError UnprocessableEntity
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": ""
 *     }
 */
export async function getChapterInfo (ctx) {
  const id = ctx.params.id
  try {
    var detail = await Chapter.getContent(id)
  } catch (err) {
    ctx.throw(422, err.message)
  }

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
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }

  const response = detail.toJSON()

  ctx.body = {
    detail: response
  }
}

/**
 * @api {GET} /chapter/next/:id 获取下一章信息
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName 获取下一章信息
 * @apiGroup Chapters
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET http://localhost:5000/chapters/next/58bc1ec43f9cdc31b9bea8dc
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *       "success": true
 *    }
 *
 * @apiError UnprocessableEntity
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": ""
 *     }
 */

export async function getNextChapterInfo (ctx) {
  const id = ctx.params.id
  try {
    var currentDetail = await Chapter.getContent(id)
  } catch (err) {
    ctx.throw(422, err.message)
  }

  const chapterNum = currentDetail.number + 1
  const novelId = currentDetail.novel.id
  try {
    var nextDetail = await Chapter.getContentByNumber(chapterNum, novelId)
  } catch (err) {
    ctx.throw(422, err.message)
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
      ctx.throw(422, err.message)
    }
  }

  const response = nextDetail.toJSON()

  ctx.body = {
    detail: response
  }
}

/**
 * @api {GET} /chapter/last/:id 获取上一章信息
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName 获取上一章信息
 * @apiGroup Chapters
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET http://localhost:5000/chapters/last/58bc1ec43f9cdc31b9bea8dc
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *       "success": true
 *    }
 *
 * @apiError UnprocessableEntity
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": ""
 *     }
 */

export async function getLastChapterInfo (ctx) {
  const id = ctx.params.id
  try {
    var currentDetail = await Chapter.getContent(id)
  } catch (err) {
    ctx.throw(422, err.message)
  }

  const chapterNum = currentDetail.number - 1
  const novelId = currentDetail.novel.id
  try {
    var lastDetail = await Chapter.getContentByNumber(chapterNum, novelId)
  } catch (err) {
    ctx.throw(422, err.message)
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
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }

  const response = lastDetail.toJSON()

  ctx.body = {
    detail: response
  }
}
