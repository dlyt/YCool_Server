import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Bookshelf = new mongoose.Schema({
  user: { type: ObjectId, ref: 'user' },
  novel: { type: ObjectId, ref: 'novel'},
  chapter: { type: ObjectId, ref: 'chapter'},
  progress: { type: Number, default: 0}
})

Bookshelf.statics = {
  getList: function (id){
    return this
      .find({user: id})
      .populate('novel')
      .populate('chapter', ['_id', 'number'])
      .exec()
  },
  findByUserAndNovelId: function (options){
    return this
      .findOne({user: options.userId, novel: options.novelId})
      .exec()
  }
}

export default mongoose.model('bookshelf', Bookshelf)
