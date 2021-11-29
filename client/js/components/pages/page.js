export default class Page extends HTMLElement {
  constructor() {
    super()
    this.classList.add('page')
  }

  get user() {
    debugger
    return this.closest('di-app')?.user
  }

  navigateTo(){
    this.classList.add('fade-in')
  }

  navigateFrom(){
    this.classList.add('fade-out')
  }
}