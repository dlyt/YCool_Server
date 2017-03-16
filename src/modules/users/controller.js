import User from '../../models/users'


/**
  @api {POST} /users/tourists 新增游客
  @apiDescription
  @apiVersion 1.0.0
  @apiName 新增游客
  @apiGroup Users
  @apiExample Example usage:
    curl -H "Content-Type: application/json" -X GET http://localhost:5000/users/tourists

  @apiParam {Object} user          用户对象 (必需)
  @apiParam {String} user.uuid     ios唯一标识.

  @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4Yzk0OTk3ZDE4ZTIwMjRiNjYzNjBmYiIsImlhdCI6MTQ4OTYzNjI5M30.OHd22AfwQaUZAuNC2A4w28THizwtf4UgRvWhc3lBuSI"
      }
  @apiErrorExample {json} Error-Response:
      HTTP/1.1 422 Unprocessable Entity
      {
        "status": 422,
        "error": ""
       }
 */
export async function createTourist (ctx) {
  const uuid = ctx.request.body.user.uuid
  //先查
  try {
    var user = await User.findOne({uuid: uuid})
  } catch (err) {
    Handle.sendEmail(err.message)
    ctx.throw(422, err.message)
  }

  if (user) {
    var token = user.generateToken()
  }
  else {
    user = new User(ctx.request.body.user)
    try {
      await user.save()
    } catch (err) {
      Handle.sendEmail(err.message)
      ctx.throw(422, err.message)
    }

    var token = user.generateToken()
  }

  ctx.body = {
    token
  }
  Handle.count('createTourist')
}
