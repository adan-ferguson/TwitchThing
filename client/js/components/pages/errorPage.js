import Page from './page.js'


const HTML = errorMessage => `
<div>
  <p>An error occurred, oh no.</p>
  <p>Details:</p>
  <textarea readonly="readonly">${JSON.stringify(errorMessage)}</textarea>
</div>
`

export default class ErrorPage extends Page{
  constructor(error = {}){
    super()
    this.innerHTML = HTML(error.message ?? error ?? 'Unknown Error')
  }
}
customElements.define('di-error-page', ErrorPage)