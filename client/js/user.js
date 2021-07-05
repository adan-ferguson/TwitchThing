import * as EventEmitter from 'events'

debugger
export default class User extends EventEmitter {

  constructor(data){
    super()
    this.data = data
  }

  get name(){
    return this.data.username
  }

  get exp(){
    return this.data.exp
  }

  get money(){
    return this.data.money
  }

  update(args){
    this.data = args.newDoc
    this.emit('updated', args)
  }

  // get isChannelRegistered(){
  //   return this.data.channel ? true : false
  // }

}