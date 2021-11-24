import Page from './page.js'

export default class Login extends Page {
  constructor(app){
    super(app)
  }
}

customElements.define('di-page-login', Login)