import Modal from './modal.js'

const SIMPLE_MODAL_HTML = `
  <div class='content'></div>
  <div class='buttons'></div>
`

export default class SimpleModal extends Modal {

  constructor(content, buttons){
    super()
    this.innerPane.innerHTML = SIMPLE_MODAL_HTML

    // TODO: escaped content if we want?
    this.querySelector('.content').textContent = content
    const buttonsEl = this.querySelector('.buttons')

    buttons.forEach(options => {

      options = {
        text: 'text',
        style: 'normal',
        fn: () => {}, // Called on click. If it returns false, the modal won't close after clicking.
        ...options
      }

      const btn = document.createElement('button')
      btn.classList.add('style-' + options.style)
      btn.textContent = options.text
      btn.addEventListener('click', () => {
        const ret = options.fn()
        if(ret !== false){
          this.hide()
        }
      })
      buttonsEl.appendChild(btn)
    })
  }
}