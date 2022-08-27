import db from '../db.js'

export default class Collection{

  constructor(collectionName, defaults = {}, indexes = []){
    this.collectionName = collectionName
    this.defaults = defaults
    this.validateSave = () => {}
    if(indexes.length){
      db.waitForConnection().then(() => {
        this.collection.createIndexes(indexes)
      })
    }
  }

  get collection(){
    return db.conn().collection(this.collectionName)
  }

  async save(doc){
    this.validateSave(doc)
    return await db.save(db.fix(doc, this.defaults), this.collectionName)
  }

  async find(options = {}){
    return await db.find(this.collectionName, {
      ...options,
      defaults: this.defaults
    })
  }

  async findByID(id, options = {}){
    if(!id){
      throw 'Tried to findOne with null value, probably a bug'
    }
    return await db.findOne(this.collectionName, {
      ...options,
      id,
      defaults: this.defaults
    })
  }

  async findByIDs(ids, options = {}){
    return await this.find({
      ...options,
      query: {
        _id: { $in: ids }
      }
    })
  }

  async update(_id, $set){
    await this.collection.updateOne({ _id }, { $set })
  }

  async removeAll(){
    await db.conn().collection(this.collectionName).deleteMany({})
  }
}