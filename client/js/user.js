import * as EventEmitter from 'events'

export default class User extends EventEmitter {

  constructor(data){
    super()
    this.data = data
  }

  update(args){
    this.data = args.newDoc
    this.emit('updated', args)
  }

  // get isChannelRegistered(){
  //   return this.data.channel ? true : false
  // }

}