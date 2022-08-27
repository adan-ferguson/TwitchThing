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

  async findOne(queryOrID, projection = {}){
    if(!queryOrID){
      throw 'Tried to findOne with null value, probably a bug'
    }
    return await db.findOne(this.collectionName, queryOrID, projection, this.defaults)
  }

  async find(queryOrID, projection = {}){
    return await db.find(this.collectionName, queryOrID, projection, this.defaults)
  }

  async findByIDs(ids, projection = {}){
    return await this.find({
      _id: { $in: ids }
    }, projection)
  }

  async update(_id, $set){
    await this.collection.updateOne({ _id }, { $set })
  }

  async removeAll(){
    await db.conn().collection(this.collectionName).deleteMany({})
  }
}