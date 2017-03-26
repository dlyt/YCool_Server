import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Chapter = new mongoose.Schema({
  title: { type: String },
  content: { type: String, default: ''},
  postfix: { type: String },
  number: { type: Number },
  novel: { type: ObjectId, ref: 'novel'},
})

Chapter.statics = {
  getFirstChapter: function (id){
    return this
      .find({novel: id},['_id'])
      .sort({number: 1})
      .limit(1)
      .exec()
  },
  getLastTitle: function (id){
    return this
      .find({novel: id}, ['title'])
      .sort({number: -1})
      .limit(1)
      .exec()
  },
  getCount: function (id){
    return this
      .find({novel: id})
      .count()
      .exec()
  },
  getContent: function (id){
    return this
      .findById(id)
      .populate('novel',['name', 'url'])
      .exec()
  },
  findByNumber: function (id, num) {
    return this
      .findOne({number: num, novel: id})
      .exec()
  },
  getDirectory: function (options) {
    return this
      .find(options.where, options.attributes)
      .sort({number: options.order})
      .limit()
      .exec()
  }
}

export default mongoose.model('chapter', Chapter)
