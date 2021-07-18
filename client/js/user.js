import { EventEmitter } from 'events'
import Character from './character.js'

export default class User extends EventEmitter {

  constructor({ username, displayname, resources, characters }){
    super()
    this.username = username
    this.displayname = displayname
    this.resources = resources
    this._setupCharacters(characters)
  }

  update(args){
    this.resources = args.newVals
    this.emit('resources_updated', args)
  }

  isAdmin(){
    return this.username === 'khananaphone'
  }

  set activeCharacter(character){
    localStorage.setItem('activecharacter', character.name)
    this._activeCharacter = character
  }

  get activeCharacter(){
    return this._activeCharacter
  }

  _setupCharacters(characters){
    this.characters = characters.map(charData => new Character(charData))
    const activeCharName = localStorage.getItem('activecharacter') || ''
    const activeChar = this.characters.find(char => char.name === activeCharName)
    if(activeChar){
      this.activeCharacter = activeChar
    }else if(this.characters.length){
      this.activeCharacter = this.characters[0]
    }
  }
}