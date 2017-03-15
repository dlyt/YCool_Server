import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Bookshelf = new mongoose.Schema({
  user: { type: ObjectId, ref: 'user' },
  novel: { type: ObjectId, ref: 'novel'},
  chapter: { type: ObjectId, ref: 'chapter'},
})

Bookshelf.statics = {
  getList: function (id){
    return this
      .find({user: id})
      .populate('novel')
      .populate('chapter', ['_id', 'number'])
      .exec()
  }

}

export default mongoose.model('bookshelf', Bookshelf)
