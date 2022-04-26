export default class Subpage extends HTMLElement{

  constructor(page, adventurer, dungeonRun){
    super()
    this.classList.add('subpage')
    this.style.opacity = '0'
    this.page = page
    this.adventurer = adventurer
    this.dungeonRun = dungeonRun
  }

  get app(){
    return this.page.app
  }

  update(dungeonRun, animate = true){

  }

}