export default class Page extends HTMLElement {
  constructor() {
    super()
    this.classList.add('page')
  }

  get user() {
    return this.app?.user
  }

  get app(){
    return this.closest('di-app')
  }

  /**
   * Page to go to if back button gets clicked. If null, back button will not be visible.
   */
  get backPage(){
    return null
  }

  /**
   * Load page content here. Return false to prevent the page from loading (for example,
   * if an error occurred).
   * @returns {Promise<boolean>}
   */
  async load(){

  }

  /**
   * Unload page content here. Return false to prevent the page from
   * unloading (for example, we want to show a confirmation dialog first).
   * @returns {Promise<boolean>}
   */
  async unload(){

  }
}