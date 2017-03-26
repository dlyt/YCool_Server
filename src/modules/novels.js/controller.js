import Novel from '../../models/novels'
import Bookshelf from '../../models/bookshelfs'
import Chapter from '../../models/chapters'

import * as Crawler from '../../utils/crawler'
import simplePinyin from 'simple-pinyin'
import cheerio from 'cheerio'


/**
  @api {GET} /novels/directory/:id 获取小说目录
  @apiDescription order是目录顺序1（升序）-1（降序）
  @apiVersion 1.0.0
  @apiName 获取小说目录
  @apiGroup Novels

  @apiExample Example usage:
    curl -H "Content-Type: application/json" -X GET http://localhost:5000/novels/directory/58c4cbce9e4dad30f80d34e7?order=1

  @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
      "directory": [
        {
          "_id": "58c4cbce9e4dad30f80d34e8",
          "title": "第一章，缺钱的超级大腿",
          "number": 0
        },
        {
          "_id": "58c4cbce9e4dad30f80d34e9",
          "title": "第二章，辍学的念头",
          "number": 1
        }
      ]
    }
  @apiError UnprocessableEntity

  @apiErrorExample {json} Error-Response:
    HTTP/1.1 422 Unprocessable Entity
      {
        "status": 422,
        "error": ""
      }
 */
export async function downloadChapters (ctx) {
  let results
  const id = ctx.params.id
  const options = {
    attributes: ['title', 'content', 'number'],
    order: 1
  }
  try {
    results = await Chapter.getDirectory(id, options)
  } catch (err) {
    Handle.sendEmail(e.message)
    ctx.throw(422, err.message)
  }

  ctx.body = {
    results
  }
  Handle.count('getDirectory')
}

/**
  @api {GET} /novels/search/zh 搜索小说名称
  @apiDescription
  @apiVersion 1.0.0
  @apiName 搜索小说名称
  @apiGroup Novels
  @apiExample Example usage:
    curl -H "Content-Type: application/json" -X GET http://localhost:5000/novels/search/zh?keyword=永夜

  @apiParam {String} keyword 搜索关键词.

  @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      {
        "response": {
          "q": "yongye",
          "r": [
            {
              "word": "永夜君王"
            },
            {
              "word": "永夜之帝国双璧"
            },
            {
              "word": "永夜帝王"
            },
            {
              "word": "永夜王座"
            }
          ]
        }
      }
  @apiErrorExample {json} Error-Response:
      HTTP/1.1 422 Unprocessable Entity
      {
        "status": 422,
        "error": ""
       }
 */
export async function searchFromZH (ctx) {
  const keyword = ctx.query.keyword
  //将汉字转拼音
  const words = simplePinyin(keyword, { pinyinOnly: false })
  let word = ''
  words.forEach(function (item) {
    word += item
  })

  //调用纵横api接口
  const url = `http://search.zongheng.com/search/mvc/suggest.do?keyword=${word}`
  try {
    var body = await Crawler.getBody(url)
  } catch (e) {
    Handle.sendEmail(e.message)
    ctx.throw(422, err.message)
  }

  const response = JSON.parse(body)

  ctx.body = {
    response
  }
  Handle.count('searchFromZH')
}

/**
  @api {GET} novels/search/bqk 获取小说列表
  @apiDescription
  @apiVersion 1.0.0
  @apiName 获取小说列表
  @apiGroup Novels
  @apiExample Example usage:
    curl -H "Content-Type: application/json" -X GET http://localhost:5000/novels/search/bqk?name=永夜

  @apiParam {String} keyword 搜索关键词.

  @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      {
        "response": [
          {
            "title": "永夜君王",
            "img": "http://www.37zw.com/d/image/2/2790/2790s.jpg",
            "url": "http://www.37zw.com/2/2790/",
            "introduction": "千夜自困苦中崛起，在背叛中坠落。自此一个人，一把枪，行在永夜与黎明之间，却走出一段传奇。若永夜注定是他的命运，那他也要成为主宰的王。",
            "author": "烟雨江南",
            "type": "玄幻小说"
          },
          {
            "title": "永镇天渊",
            "img": "http://www.37zw.com/d/image/5/5926/5926s.jpg",
            "url": "http://www.37zw.com/5/5926/",
            "introduction": "从天坠落，当永耀烈阳归于寂灭……当诸天银河黯淡无光，当万事万物化为墟烬……这是被天渊笼罩的世界这是注定沦于破灭的宇宙然而高川降临了所以未来的一切便都被",
            "author": "阴天神隐",
            "type": "修真小说"
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
export async function searchFromBQK (ctx) {
  const name = ctx.query.name

  //笔趣库搜索网站
  const url = `http://zhannei.baidu.com/cse/search?s=2041213923836881982&q=${name}`
  try {
    var body = await Crawler.request(encodeURI(url))
  } catch (e) {
    Handle.sendEmail(e.message)
    ctx.throw(422, e.message)
  }
  const $ = cheerio.load(body, {decodeEntities: false})

  const length = $('.result-game-item-detail').length

  //爬取小说信息，用于展示
  let arr = []
  for (let i = 0; i < length; i++) {
    const title = $('.result-game-item-detail a')[i].attribs.title
    const img = $('.result-game-item-pic img')[i].attribs.src
    const url = $('.result-game-item-detail a')[i].attribs.href
    const introduction = $('.result-game-item-desc').eq(i).text().replace(/\s/g, "")
    const author = $('.result-game-item-info span').eq(i * 6 + 1).text().replace(/\s/g, "")
    const type = $('.result-game-item-info span').eq(i * 6 + 3).text()
    let json = {
      title: title,
      img: img,
      url: url,
      introduction: introduction,
      author: author,
      type: type
    }
    arr.push(json)
  }

  ctx.body = {
    response: arr
  }
  Handle.count('searchFromBQK')
}

/**
  @api {POST} /novels/acquire 爬取小说
  @apiPermission User
  @apiVersion 1.0.0
  @apiName 爬取小说
  @apiGroup Novels

  @apiExample Example usage:
    curl -H "Content-Type: application/json" "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YjhmZDRkODUyYTE1YzliNmYyNjI3MSIsImlhdCI6MTQ4ODU1MTc2N30.IEgYwmgyqOBft9s38ool7cmuC2yIlWYVLf4WQzcbqAI" -X GET http://localhost:5000/novels/acquire

  @apiParam {Object} novel          小说对象 (必需)
  @apiParam {String} novel.name    小说名称.
  @apiParam {String} novel.url     爬取网站的url.

  @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
      "success": true
    }
  @apiError UnprocessableEntity

  @apiErrorExample {json} Error-Response:
    HTTP/1.1 422 Unprocessable Entity
    {
      "status": 422,
      "error": ""
    }
 */
export async function getNovel (ctx) {
  const user = ctx.state.user
  const { name, url } = ctx.request.body.novel
  try {
    var novel = await Novel.findOne({name: name})
  } catch (e) {
    ctx.throw(422, e.message)
  }

  //判断数据库中是否有该小说，没有在去网站爬取
  if (novel) {
    try {
      var bookshelf = await Bookshelf.findOne({novel: novel.id, user: user.id})
    } catch (e) {
      Handle.sendEmail(e.message)
      ctx.throw(422, e.message)
    }

    const response = novel.toJSON()
    if (bookshelf) {
      response.join = true
    }
    else {
      response.join = false
    }

    ctx.body = {
      novelInfo: response
    }
    Handle.count('getNovel')
  }
  else {
    try {
      var $ = await Crawler.getHtml(url)
    } catch (e) {
      Handle.sendEmail(e.message)
      ctx.throw(422, e.message)
    }

    let novelInfo = {}
    const author = $('#info p')[0].children[0].data
    const updateTime = $('#info p')[2].children[0].data
    const img = $('#fmimg img')[1].attribs.src
    novelInfo.name =
    novelInfo.url = url
    novelInfo.name = $('#info h1')[0].children[0].data
    novelInfo.author = author.substring(27, author.length)
    novelInfo.img = `http://www.37zw.com${img}`
    novelInfo.updateTime = updateTime.substring(5, updateTime.length)
    novelInfo.introduction = $('#intro p')[0].children[0].data


    novel = new Novel(novelInfo)
    try {
      await novel.save()
    } catch (e) {
      Handle.sendEmail(e.message)
      ctx.throw(422, e.message)
    }

    const novelId = novel.id

    await Crawler.getNovel($, novelId)

    try {
      var lastChapter = await Chapter.getLastTitle(novelId)
      var count = await Chapter.getCount(novelId)
    } catch (e) {
      Handle.sendEmail(e.message)
      ctx.throw(422, e.message)
    }

    novel.lastChapterTitle = lastChapter[0].title
    novel.countChapter = count

    try {
      await novel.save()
    } catch (e) {
      Handle.sendEmail(e.message)
      ctx.throw(422, e.message)
    }
    const response = novel.toJSON()
    response.join = false
    ctx.body = {
      novelInfo: response
    }
    Handle.count('getNovel')
  }
}

/**
  @api {GET} /novels/directory/:id 获取小说目录
  @apiDescription order是目录顺序1（升序）-1（降序）
  @apiVersion 1.0.0
  @apiName 获取小说目录
  @apiGroup Novels

  @apiExample Example usage:
    curl -H "Content-Type: application/json" -X GET http://localhost:5000/novels/directory/58c4cbce9e4dad30f80d34e7?order=1

  @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
      "directory": [
        {
          "_id": "58c4cbce9e4dad30f80d34e8",
          "title": "第一章，缺钱的超级大腿",
          "number": 0
        },
        {
          "_id": "58c4cbce9e4dad30f80d34e9",
          "title": "第二章，辍学的念头",
          "number": 1
        }
      ]
    }
  @apiError UnprocessableEntity

  @apiErrorExample {json} Error-Response:
    HTTP/1.1 422 Unprocessable Entity
      {
        "status": 422,
        "error": ""
      }
 */
export async function getDirectory (ctx) {
  let results
  const id = ctx.params.id
  const options = {
    where: {novel: id},
    attributes: ['title', 'number'],
    order: ctx.query.order || 1
  }
  try {
    results = await Chapter.getDirectory(options)
  } catch (e) {
    Handle.sendEmail(e.message)
    ctx.throw(422, e.message)
  }

  ctx.body = {
    results
  }
  Handle.count('getDirectory')
}


// export async function createNovel (ctx) {
//   const novel = new Novel(ctx.request.body.novel)
//   try {
//     await novel.save()
//   } catch (err) {
//     ctx.throw(422, err.message)
//   }
//
//   ctx.body = {
//     success: true
//   }
// }
//
// export async function searchNovel (ctx) {
//   const keyword = ctx.query.keyword
//
//   const url = `http://zhannei.baidu.com/cse/search?q=${keyword}&s=2041213923836881982`
//
//   if (keyword) {
//     var list = await Crawler.getSearchLists(encodeURI(url))
//   }
//   else {
//     var list = ''
//   }
//
//   ctx.body = {
//     list: list
//   }
// }
