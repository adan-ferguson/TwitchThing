import Page from './page.js'

export default class Main extends Page {
  constructor(app){
    super(app)
  }
}

customElements.define('di-page-main', Main)