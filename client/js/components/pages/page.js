import fizzetch from '../../fizzetch.js'
import { generatePath } from '../pathRouter.js'

export default class Page extends HTMLElement{

  app
  unloaded = false

  constructor(){
    super()
    this.classList.add('page')
  }

  static path(args){
    return generatePath(this.pathDef, args)
  }

  get path(){
    return this.constructor.path(this.pathArgs)
  }

  static get pathDef(){
    return []
  }

  get pathArgs(){
    return []
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

  redirectTo(path){
    if(this.unloaded){
      return
    }
    this.app.setPage(path)
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