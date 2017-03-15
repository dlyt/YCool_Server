import User from '../../models/users'


/**
 * @api {GET} /users/tourists 新增游客
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName 新增游客
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET http://localhost:5000/users/tourists
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *       "token": *"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4Yzk0OTk3ZDE4ZTIwMjRiNjYzNjBmYiIsImlhdCI6MTQ4OTU4OTg4OX0.JFkxoGJsx6T9WduGm1E2Ca83zPSMbhuDxVdhqa-Khfc"
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
export async function createTourist (ctx) {
  const uuid = ctx.request.body.user.uuid
  try {
    var user = await User.findOne({uuid: uuid})
  } catch (err) {
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
      ctx.throw(422, err.message)
    }

    var token = user.generateToken()
  }

  ctx.body = {
    token
  }
}
