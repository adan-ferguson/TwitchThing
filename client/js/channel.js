import { post } from './fizzetch'

export default class Channel {

  constructor(doc){
    this.doc = doc
  }

  async setEnabled(val, save = true){
    this.doc.enabled = val
    if(save){
      const result = await post('/user/updatechannel', {
        enabled: val
      })
      console.log('saved', result)
    }
  }
}