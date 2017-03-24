import Bookshelf from '../../models/bookshelfs'
import Chapter from '../../models/chapters'
import Novel from '../../models/novels'
import * as Crawler from '../../utils/crawler'


/**
  @api {POST} /chapters 获取章节信息
  @apiVersion 1.0.0
  @apiName 获取章节信息
  @apiGroup Chapters

  @apiExample Example usage:
    curl -H "Content-Type: application/json" -X GET http://localhost:5000/chapters/58c4cbce9e4dad30f80d34e7

  @apiParam {String} novelId 小说ID.
  @apiParam {String} num 小说章节.

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
  let {novelId, num} = ctx.request.body
  let detail
  try {
    detail = await Chapter.findByNumber(novelId, num)
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
  const response = detail
  ctx.body = {
    response
  }
  Handle.count('getChapterInfo')
}

/**
  @api {GET} /chapters/firstRender/:id 获取首次渲染章节
  @apiPermission User
  @apiVersion 1.0.0
  @apiName 获取首次渲染章节
  @apiGroup Chapters

  @apiExample Example usage:
    curl -H "Content-Type: application/json" "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YjhmZDRkODUyYTE1YzliNmYyNjI3MSIsImlhdCI6MTQ4ODU1MTc2N30.IEgYwmgyqOBft9s38ool7cmuC2yIlWYVLf4WQzcbqAI" -X GET http://localhost:5000/chapters/firstRender/58c4cbce9e4dad30f80d34e7

  @apiSuccess {Object}   progress          章节进度

  @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
      "response": {
        "chapters": [
          {
            "_id": "58ccc05923ff5c6b9d5053cc",
            "title": "上架感言",
            "postfix": "2352954.html",
            "number": 0,
            "novel": "58ccc05923ff5c6b9d5053cb",
            "__v": 0,
            "content": "&nbsp;&nbsp;&nbsp;&nbsp;《1852铁血中华》已经上架。&nbsp;&nbsp;&nbsp;&nbsp;这次写太平天国时代有很多原因，不过最重要的原因之一，是因为太平天国运动是清末民初最后一次体制外的造反，也是中国到现在为止的最后一次大规模农民起义。&nbsp;&nbsp;&nbsp;&nbsp;一提起太平天国来，现在的人很容易想起的就是拜上帝教、洪教主，而实际情况又是如何？&nbsp;&nbsp;&nbsp;&nbsp;在那个时代，满清朝廷虽然给洋人跪了，但是整个中国各阶层却远没有20世纪初面临亡国灭种危局的绝望之情。&nbsp;&nbsp;&nbsp;&nbsp;这就是太平天国时代的中国。&nbsp;&nbsp;&nbsp;&nbsp;在全世界主要大国正向着空前激烈的时代突飞猛进的时候，中国的变化远没有世界来的激烈。本书的主角要承担的责任，就是在中国掀起比世界更加激烈的变化。&nbsp;&nbsp;&nbsp;&nbsp;对大家以往的支持，绯红万分感谢！绯红一定会努力继续写书，请大家继续支持，继续订阅！谢谢！！&nbsp;&nbsp;&nbsp;&nbsp;[三七中文 www.37zw.com]百度搜索“37zw.com”"
          },
          {
            "_id": "58ccc05923ff5c6b9d5053cd",
            "title": "第1章 韦泽（一）",
            "postfix": "2352958.html",
            "number": 1,
            "novel": "58ccc05923ff5c6b9d5053cb",
            "__v": 0,
            "content": "&nbsp;&nbsp;&nbsp;&nbsp;1852年2月6日上午，广西大瑶山一处山岭上的树林旁边。&nbsp;&nbsp;&nbsp;&nbsp;二十几名年轻的战士正在战场上，他们都穿着广西普通百姓的服色，身上是黑色的粗布短衣短裤，腰间束了白色的粗布腰带，腿上打着白布绑腿，脚上则是草鞋。因为天冷，战士们脚上缠了原本可能是白色，现在已经脏兮兮看不出颜色的裹脚布。众人脑袋上并不是广西那种包头布，因为大家都把长发在头上扎了一个发髻，所以在脑袋上箍了一条白色粗布发带，猛看上仿佛是一支奔丧的队伍。&nbsp;&nbsp;&nbsp;&nbsp;一位浓眉大眼的青年停在战场中央，棱角分明脸庞有着少年轻人特有的圆润感觉，怎么看都不超过20岁的模样。这名笑道：“辫子又不重，带回去正好请功！”&nbsp;&nbsp;&nbsp;&nbsp;广西号称百万大山，大瑶山山峦叠翠，在战场附近就有山谷。清军的尸体被抛入山谷，转眼就没了踪影。清军还能留在战场上的是他们的武器，十几名清军的武器中一半是长枪，另一半则是火绳枪。这就是韦泽回到这个时代之后另一件不能立刻接受的事情。这个时业化的日本进行着艰苦卓绝的战斗，并且顽强的不断扩大敌后根据地，把中国的国土从侵略者手中一寸寸的夺回来。&nbsp;&nbsp;&nbsp;&nbsp;满清的火绳枪固然与这时代流行的燧发枪有不小差距，却远没有到达一场战斗只有五发子弹的八路军与敌人之间的差距。在武器装备差距有限的局面下还能被打得签署了无数丧权辱国的条约，这样的满清是必须消灭掉的。不消灭掉满清，就注定没有中国的未来。韦泽对此坚信不移。&nbsp;&nbsp;&nbsp;&nbsp;十几名清军携带的钱财不多，韦泽登记造册后让负责后勤的伍长林阿生把财物收起来。&nbsp;&nbsp;&nbsp;&nbsp;“出发！”韦泽命道。26人的小队扛起自己的装备，在韦泽的带领下向着东北方向继续前进了。&nbsp;&nbsp;&nbsp;&nbsp;[三七中文 www.37zw.com]百度搜索“37zw.com”"
          }
        ],
        "progress": 0
      }
    }

  @apiErrorExample {json} Error-Response:
    HTTP/1.1 422 Unprocessable Entity
      {
        "status": 422,
        "error": ""
      }
 */
export async function getFirstRenderChapter (ctx) {
  let bookshelf, chapter, nextChapter
  const id = ctx.params.id
  const user = ctx.state.user
  try {
    bookshelf = await Bookshelf.findOne({user: user._id, novel: id})
  } catch (e) {
    Handle.sendEmail(e.message)
    ctx.throw(422, e.message)
  }

  try {
    chapter = await Chapter.findById(bookshelf.chapter)
    nextChapter = await Chapter.findByNumber(bookshelf.novel, chapter.number + 1)
  } catch (e) {
    Handle.sendEmail(e.message)
    ctx.throw(422, e.message)
  }

  const response = {
    chapters: [chapter, nextChapter],
    progress: bookshelf.progress
  }

  ctx.body = {
    response
  }
  Handle.count('getFirstRenderChapter')
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
    var nextDetail = await Chapter.findByNumber(novelId, chapterNum)
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
    var lastDetail = await Chapter.findByNumber(novelId, chapterNum)
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
