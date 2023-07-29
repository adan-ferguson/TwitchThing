import fizzetch from '../../fizzetch.js'
import { generatePath } from '../pathRouter.js'

export default class Page extends HTMLElement{

  app
  loadstate = 'none'

  constructor(){
    super()
    this.classList.add('page')
  }

  static path(){
    return generatePath(this.pathDef, arguments)
  }

  get path(){
    return this.constructor.path(...this.pathArgs)
  }

  static get pathDef(){
    return []
  }

  get pathArgs(){
    return []
  }

  get useHistory(){
    return true
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

  redirectToMain(){
    this.redirectTo('')
  }

  redirectTo(path, args){
    if(this.loadstate === 'unloaded'){
      return
    }
    this.app.setPage(path, args)
  }

  reload(){
    this.app.reloadPage()
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
   * Load page content here. Return false to prevent the page from loading (for example,
   * if an error occurred).
   * @returns {Promise<string|void>}
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