export default class User {

  constructor(data){
    this.data = data
  }

  get name(){
    return this.data.twitchInfo.display_name
  }

  get exp(){
    return this.data.exp
  }

  get money(){
    return this.data.money
  }

  get isChannelRegistered(){
    return this.data.channel ? true : false
  }

}