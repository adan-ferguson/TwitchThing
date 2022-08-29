import MainPage from './main/mainPage.js'
import fizzetch from '../../fizzetch.js'

export default class Page extends HTMLElement{

  app
  unloaded = false

  constructor(){
    super()
    this.classList.add('page')
  }

  static get pathDef(){
    return null
  }

  get path(){
    return null
  }

  /**
   * @return string
   */
  get titleText(){
    return ''
  }

  get user(){
    return this.app?.user
  }

  showBackConfirm(){
    return false
  }

  redirectTo(page){
    if(this.unloaded){
      return
    }
    this.app.setPage(page)
  }

  async fetchData(args = {}){
    if(this.path === null){
      throw 'Could not fetch data with null path.'
    }
    const results = await fizzetch('/game' + this.path, args)
    if(results.error){
      throw results
    }
    return results
  }

  /**
   * Page to go to if back button gets clicked. If null/false, back button will not be visible.
   * @returns {null|function(): Page}
   */
  get backPage(){
    return () => new MainPage()
  }

  /**
   * Load page content here. Return false to prevent the page from loading (for example,
   * if an error occurred).
   * @param previousPage {Page|undefined}
   * @returns {Promise<string|void>}
   */
  async load(previousPage){

  }

  /**
   * Unload page content here. Return false to prevent the page from
   * unloading (for example, we want to show a confirmation dialog first).
   * @returns {Promise<boolean>}
   */
  async unload(){

  }
}