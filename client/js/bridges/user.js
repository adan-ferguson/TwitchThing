import Character from '/client/js/character.js'

export default class User {

  constructor({ id, displayname, resources, characters }){
    this.id = id
    this.displayname = displayname
    // this.resources = resources
    // this.characters = this._setupCharacters(characters)
  }

  set activeCharacter(character){
    localStorage.setItem('activecharacter', character.name)
    this._activeCharacter = character
  }

  get activeCharacter(){
    return this._activeCharacter
  }

  update(args){
    this.resources = args.newVals
    this.emit('resources_updated', args)
  }

  addCharacter(character, makeActive = true){
    this.characters.push(character)
    if(makeActive){
      this.activeCharacter = character
    }
  }

  _setupCharacters(characterData){
    const characters = characterData.map(charData => new Character(charData))
    const activeCharName = localStorage.getItem('activecharacter') || ''
    const activeChar = characters.find(char => char.name === activeCharName)
    if(activeChar){
      this.activeCharacter = activeChar
    }else if(characters.length){
      this.activeCharacter = characters[0]
    }
    return characters
  }
}