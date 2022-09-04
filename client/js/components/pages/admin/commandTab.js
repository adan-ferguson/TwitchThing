import fizzetch from '../../../fizzetch.js'

const HTML = `
<div>
    <input class="command-input" placeholder="enter command name" autocomplete="organization">
</div>
<textarea readonly class="command-output"></textarea>
`

export default class AdminCommandTab extends HTMLElement{

  _input
  _output
  
  constructor(){
    super()
    this.classList.add('flex-rows')
    this.innerHTML = HTML
    this._input = this.querySelector('.command-input')
    this._output = this.querySelector('.command-output')

    this._input.addEventListener('keydown', e => {
      if(e.key === 'Enter'){
        this._runCommand()
      }
    })
  }
  
  get name(){
    return 'Command'
  }

  async _runCommand(){
    const command = this._input.value
    if(!command){
      return
    }
    this._input.value = ''
    this._output.value = `Running command "${command}":`

    const { result } = await fizzetch('/game/admin/runcommand', { command })
    this._output.value += '\n' + result
  }
}
customElements.define('di-admin-command-tab', AdminCommandTab)