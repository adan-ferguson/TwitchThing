import Page from './page.js'


const HTML = errorMessage => `
<div>
  <p>An error occurred, oh no.</p>
  <textarea readonly class="message">${JSON.stringify(errorMessage)}</textarea>
</div>
`

export default class ErrorPage extends Page{
  constructor(error = 'Unknown Error'){
    super()
    this._error = error.toString()
    this.innerHTML = HTML(this._error)
  }

  static get pathDef(){
    return ['error']
  }

  get pathArgs(){
    return [this._error]
  }
}
customElements.define('di-error-page', ErrorPage)