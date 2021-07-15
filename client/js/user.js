import * as EventEmitter from 'events'
import Character from './character'

export default class User extends EventEmitter {

  constructor(data){
    super()
    this.data = data
    this._setupCharacters()
  }

  update(args){
    this.data = args.newDoc
    this.emit('updated', args)
  }

  isAdmin(){
    return this.data.username === 'khananaphone'
  }

  set activeCharacter(character){
    localStorage.setItem('activecharacter', character.name)
    this._activeCharacter = character
  }

  get activeCharacter(){
    return this._activeCharacter
  }

  _setupCharacters(){
    this.characters = this.data.characters.map(charData => new Character(charData))
    const activeCharName = localStorage.getItem('activecharacter') || ''
    const activeChar = this.characters.find(char => char.name === activeCharName)
    if(activeChar){
      this.activeCharacter = activeChar
    }else if(this.characters.length){
      this.activeCharacter = this.characters[0]
    }
  }
}