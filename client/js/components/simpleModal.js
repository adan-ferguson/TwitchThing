import Modal from './modal.js'
import { toArray } from '../../../game/utilFunctions.js'
import { fadeIn, fadeOut } from '../animations/simple.js'
import _ from 'lodash'

const SIMPLE_MODAL_HTML = `
  <div class='title displaynone'></div>
  <div class='content'></div>
  <div class='buttons displaynone'></div>
`

export function alertModal(message){
  return new SimpleModal(message, { text: 'Okay' }).show()
}

export default class SimpleModal extends Modal{

  constructor(content = null, buttons = null, title = null){
    super()
    this.innerContent.innerHTML = SIMPLE_MODAL_HTML
    if(content){
      this.setContent(content)
    }
    if(buttons){
      this.setButtons(buttons)
    }
    if(title){
      this.setTitle(title)
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
        contentEl.innerHTML = content
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
        content: null,
        style: 'normal',
        value: null,
        disabled: false,
        fn: () => {}, // Called on click. If it returns false, the modal won't close after clicking.
        ...options
      }

      const btn = document.createElement('button')
      btn.classList.add('style-' + options.style)
      btn.toggleAttribute('disabled', options.disabled)
      if(options.content){
        if(_.isString(options.content)){
          btn.innerHTML = options.content
        }else{
          btn.append(options.content)
        }
      }else{
        btn.textContent = options.text
      }
      btn.addEventListener('click', () => {
        const ret = options.fn()
        if (ret !== false){
          this.hide(options.value)
          this._result = options.value
        }
      })
      buttonsEl.appendChild(btn)
    })
  }

  setTitle(title){
    const titleEl = this.querySelector('.title')
    titleEl.classList.remove('displaynone')
    titleEl.innerHTML = title
  }

  awaitResult(){
    return new Promise(res => {
      if(this._result){
        return res(this._result)
      }
      this.addEventListener('hide', e => {
        res(e.detail.result)
      })
    })
  }
}

customElements.define('di-simple-modal', SimpleModal)