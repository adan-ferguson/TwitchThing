import fizzetch from '../fizzetch.js'

export default class DIForm extends HTMLFormElement {

  constructor(options){
    super()

    options = {
      async: false,
      action: '',
      submitText: 'Submit',
      success: () => {},
      customFetch: false,
      ...options
    }
    this.options = options

    if(options.action){
      this.setAttribute('action', options.action)
    }

    if(options.async){
      this.addEventListener('submit', async e => {
        e.preventDefault()
        this._loading()
        const result = options.action instanceof Function ? await options.action() : await fizzetch(options.action, this.data())
        this._loadingFinished()
        if(result.error){
          this.error(result.error)
        }else{
          options.success(result)
        }
      })
    }

    this.inputs = document.createElement('div')
    this.appendChild(this.inputs)

    this.submitButton = document.createElement('button')
    this.submitButton.setAttribute('type', 'submit')
    this.submitButton.textContent = options.submitText
    this.appendChild(this.submitButton)

    this.errorMessage = document.createElement('div')
    this.errorMessage.classList.add('error-message', 'hidden')
    this.appendChild(this.errorMessage)
  }

  data(){
    const data = new FormData(this)
    const obj = {}
    Array.from(data.entries()).forEach(([key, val]) => obj[key] = val)
    return obj
  }

  addInput(options){

    options = {
      label: '',
      ...options
    }

    const label = document.createElement('label')
    if(options.label){
      const span = document.createElement('span')
      span.textContent = options.label
      label.appendChild(span)
    }

    const input = document.createElement('input')
    for(let key in options){
      input.setAttribute(key, options[key])
    }
    label.appendChild(input)

    this.inputs.appendChild(label)

    return input
  }

  error(message){
    this.errorMessage.textContent = message
    this.errorMessage.classList.remove('hidden')
  }

  _loading(){
    this.errorMessage.classList.add('hidden')
    this.submitButton.disabled = true
    this.submitButton.innerHTML = '<span class="spin-effect">DI</span>'
  }

  _loadingFinished(){
    this.submitButton.disabled = false
    this.submitButton.textContent = this.options.submitText
  }
}

customElements.define('di-form', DIForm, { extends: 'form' })