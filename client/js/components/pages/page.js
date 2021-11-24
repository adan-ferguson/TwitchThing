export default class Page extends HTMLElement {
  constructor(app) {
    super()
    this.app = app
    this.classList.add('page')
  }

  navigateTo(){
    this.classList.add('fade-in')
  }

  navigateFrom(){
    this.classList.add('fade-out')
  }
}