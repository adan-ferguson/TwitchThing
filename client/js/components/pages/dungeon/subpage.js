export default class Subpage extends HTMLElement{

  page
  adventurer
  dungeonRun

  constructor(page, adventurer, dungeonRun){
    super()
    this.classList.add('subpage')
    this.style.opacity = '0'
    this.page = page
    this.adventurer = adventurer
    this.dungeonRun = dungeonRun
  }

  get titleText(){
    return ''
  }

  get app(){
    return this.page.app
  }

  update(dungeonRun, animate = true){

  }

  destroy(){

  }
}