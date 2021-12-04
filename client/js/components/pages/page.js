export default class Page extends HTMLElement {
  constructor() {
    super()
    this.classList.add('page')
  }

  get user() {
    debugger
    return this.closest('di-app')?.user
  }

  /**
   * Page to go to if back button gets clicked. If null, back button will not be visible.
   */
  get backPage(){
    return null
  }

  /**
   * Load page content here.
   * @returns {Promise<void>}
   */
  async load(){

  }

  /**
   * Unload page content here. Not sure if this is even necessary.
   * @returns {Promise<void>}
   */
  async unload(){

  }
}