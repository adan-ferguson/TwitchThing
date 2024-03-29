import Page from './page.js'


const HTML = errorMessage => `
<div>
  <p>An error occurred, oh no.</p>
  <div>${JSON.stringify(errorMessage)}</div>
</div>
`

export default class ErrorPage extends Page{
  constructor({ error }){
    super()
    this._error = error
    this.innerHTML = HTML(this._error)
  }

  static get pathDef(){
    return ['error']
  }

  async load(){
    if(!this._error){
      this.redirectToMain()
    }
  }

  get useHistory(){
    return false
  }
}
customElements.define('di-error-page', ErrorPage)