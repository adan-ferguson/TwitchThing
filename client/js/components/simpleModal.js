import Modal from './modal.js'
import { convertNewlinesToBreaks, toArray } from '../../../game/utilFunctions.js'
import { fadeIn, fadeOut } from '../animationHelper.js'

const SIMPLE_MODAL_HTML = `
  <div class='content'></div>
  <div class='buttons displaynone'></div>
`

export default class SimpleModal extends Modal{

  constructor(content = null, buttons = null){
    super()
    this.innerPane.innerHTML = SIMPLE_MODAL_HTML
    if(content){
      this.setContent(content)
    }
    if(buttons){
      this.setButtons(buttons)
    }
  }

  setContent(content, fadeTransition = false){
    const contentEl = this.querySelector('.content')

    if(contentEl.innerHTML && fadeTransition){
      fadeOut(contentEl).then(() => {
        set()
        fadeIn(contentEl)
      })
    }else{
      set()
    }

    function set(){
      contentEl.innerHTML = ''
      if(content instanceof HTMLElement){
        contentEl.appendChild(content)
      }else{
        contentEl.textContent = content
      }
    }
  }

  setButtons(buttons){

    buttons = toArray(buttons)

    const buttonsEl = this.querySelector('.buttons')
    buttonsEl.classList.toggle('displaynone', !buttons.length)
    buttonsEl.innerHTML = ''

    buttons.forEach(options => {

      options = {
        text: 'text',
        style: 'normal',
        fn: () => {
        }, // Called on click. If it returns false, the modal won't close after clicking.
        ...options
      }

      const btn = document.createElement('button')
      btn.classList.add('style-' + options.style)
      btn.textContent = options.text
      btn.addEventListener('click', () => {
        const ret = options.fn()
        if (ret !== false){
          this.hide()
        }
      })
      buttonsEl.appendChild(btn)
    })
  }
}

customElements.define('di-simple-modal', SimpleModal)