import Bookshelf from '../../models/bookshelfs'
import Chapter from '../../models/chapters'
import Novel from '../../models/novels'

/**
  @api {GET} /bookshelfs 获取书架列表
  @apiPermission User
  @apiVersion 1.0.0
  @apiName 获取书架列表
  @apiGroup Bookshelfs

  @apiExample Example usage:
    curl -H "Content-Type: application/json" "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YjhmZDRkODUyYTE1YzliNmYyNjI3MSIsImlhdCI6MTQ4ODU1MTc2N30.IEgYwmgyqOBft9s38ool7cmuC2yIlWYVLf4WQzcbqAI" -X GET localhost:5000/bookshelfs

  @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
      "list": [
        {
          "_id": "58c949c5d18e2024b66360fc",
          "user": "58c94997d18e2024b66360fb",
          "novel": {
            "_id": "58c4cb509e4dad30f80d2f84",
            "url": "http://www.37zw.com/3/3960/",
            "name": "1852铁血中华",
            "author": "绯红之月",
            "updateTime": "2017-03-12",
            "introduction": "    1852,是革命，或者是一场该改朝换代的改良。燃烧的铁与血，最终能创造一个什么样的未来？\n",
            "__v": 0,
            "countChapter": "1377",
            "lastChapterTitle": "第644章 剪影 3",
            "img": "http://www.37zw.com/d/image/3/3960/3960s.jpg"
          },
          "chapter": {
            "_id": "58c4cb509e4dad30f80d2f85",
            "number": 0
          },
          "__v": 0
        }
      ]
    }

  @apiErrorExample {json} Error-Response:
    HTTP/1.1 422 Unprocessable Entity
      {
        "status": 422,
        "error": ""
      }
 */
export async function getBookshelf (ctx) {
  const user = ctx.state.user
  try {
    var list = await Bookshelf.getList(user.id)
  } catch (e) {
    Handle.sendEmail(e.message)
    ctx.throw(422, e.message)
  }

  ctx.body = {
    list: list
  }
  Handle.count('getBookshelf')
}

/**
  @api {POST} /bookshelfs/order 订阅小说
  @apiPermission User
  @apiVersion 1.0.0
  @apiName 订阅小说
  @apiGroup Bookshelfs

  @apiExample Example usage:
    curl -H "Content-Type: application/json" "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YjhmZDRkODUyYTE1YzliNmYyNjI3MSIsImlhdCI6MTQ4ODU1MTc2N30.IEgYwmgyqOBft9s38ool7cmuC2yIlWYVLf4WQzcbqAI" -X GET localhost:5000/bookshelfs/order

  @apiParam {String} id 小说ID.

  @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
      "success": true
    }

  @apiErrorExample {json} Error-Response:
    HTTP/1.1 422 Unprocessable Entity
    {
      "status": 422,
      "error": ""
    }
 */
export async function orderNovel (ctx) {
  const user = ctx.state.user
  const novelId = ctx.request.body.id

  try {
    var chapter = await Chapter.getFirstChapter(novelId)
  } catch (err) {
    ctx.throw(422, err.message)
  }

  const bookshelf = new Bookshelf({
    user: user.id,
    novel: novelId,
    chapter: chapter.id 
  })

  try {
    await bookshelf.save()
  } catch (e) {
    Handle.sendEmail(e.message)
    ctx.throw(422, e.message)
  }

  ctx.body = {
    success: true
  }
  Handle.count('orderNovel')
}

/**
  @api {POST} /bookshelfs/delect 取消订阅
  @apiVersion 1.0.0
  @apiName 取消订阅
  @apiGroup Bookshelfs

  @apiExample Example usage:
    curl -H "Content-Type: application/json" -X GET localhost:5000/bookshelfs/delect

  @apiParam {String} id 小说ID.

  @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
      "success": true
    }

  @apiErrorExample {json} Error-Response:
    HTTP/1.1 422 Unprocessable Entity
    {
      "status": 422,
      "error": ""
    }
 */
export async function delectNovel (ctx) {
  const id = ctx.request.body.id
  try {
    await Bookshelf.remove({_id: id})
  } catch (e) {
    Handle.sendEmail(e.message)
    ctx.throw(422, err.message)
  }

  ctx.body = {
    success: true
  }
  Handle.count('delectNovel')
}

/**
  @api {POST} /bookshelfs 记录最后阅读章节
  @apiPermission User
  @apiVersion 1.0.0
  @apiName 记录最后阅读章节
  @apiGroup Bookshelfs

  @apiExample Example usage:
    curl -H "Content-Type: application/json" "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YjhmZDRkODUyYTE1YzliNmYyNjI3MSIsImlhdCI6MTQ4ODU1MTc2N30.IEgYwmgyqOBft9s38ool7cmuC2yIlWYVLf4WQzcbqAI" -X GET localhost:5000/bookshelfs/change

  @apiParam num 小说章节
  @apiParam x   页数

  @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK

  @apiErrorExample {json} Error-Response:
    HTTP/1.1 422 Unprocessable Entity
      {
        "status": 422,
        "error": ""
      }
 */
export async function changeBookshelf (ctx) {
  let chapter,bookshelf
  const user = ctx.state.user
  const novel = ctx.request.body.novel
  const progress = novel.x / 375
  const options = {
    userId: user.id,
    novelId: novel.id
  }
  try {
    bookshelf = await Bookshelf.findByUserAndNovelId(options)
    chapter = await Chapter.findByNumber(novel.id, novel.num)
  } catch (e) {
    Handle.sendEmail(e.message)
    ctx.throw(422, e.message)
  }

  bookshelf.progress = progress
  bookshelf.chapter = chapter.id
  try {
    await bookshelf.save()
  } catch (e) {
    Handle.sendEmail(e.message)
    ctx.throw(422, e.message)
  }

  ctx.body = {
    success: true
  }
  Handle.count('changeBookshelf')
}
