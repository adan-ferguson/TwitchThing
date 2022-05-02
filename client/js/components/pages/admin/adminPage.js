import Page from '../page.js'

import fizzetch from '../../../fizzetch.js'

const HTML = `
<div class="fill-contents">
  <div class="command">
      <input class="command-input" placeholder="enter command name" autocomplete="organization">
      <textarea readonly class="command-output"></textarea>
  </div>
</div>
`

export default class AdminPage extends Page{

  constructor(adventurerID){
    super()
    this.innerHTML = HTML
    this.input = this.querySelector('.command-input')
    this.output = this.querySelector('.command-output')
  }

  get titleText(){
    return 'Admin Control Panel'
  }

  async load(){
    const result = await fizzetch('/admin')
    if(result.error){
      return result
    }

    this.input.addEventListener('keydown', e => {
      if(e.key === 'Enter'){
        this._runCommand()
      }
    })
  }

  async _runCommand(){
    const command = this.input.value
    if(!command){
      return
    }
    this.input.value = ''
    this.output.value = `Running command "${command}":`

    const { result } = await fizzetch('/admin/runcommand', { command })
    this.output.value += '\n' + result
  }
}

customElements.define('di-admin-page', AdminPage)