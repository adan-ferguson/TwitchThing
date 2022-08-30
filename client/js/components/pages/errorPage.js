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
    this._error = error?.toString()
    this.innerHTML = HTML(this._error)
  }

  static get pathDef(){
    return ['error']
  }

  get pathArgs(){
    return [{ error: this._error }]
  }

  async load(){
    if(!this._error){
      this.redirectToMain()
    }
  }
}
customElements.define('di-error-page', ErrorPage)