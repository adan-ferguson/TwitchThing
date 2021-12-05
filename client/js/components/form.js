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
          this.addError(result.error)
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
    this.errorMessage.classList.add('error', 'hidden')
    this.appendChild(this.errorMessage)
  }

  data(){
    debugger
    const data = new FormData(this)
    return data
  }

  addInput(options){

    options = {
      label: '',
      ...options
    }

    const label = document.createElement('label')
    const input = document.createElement('input')

    for(let key in options){
      input.setAttribute(key, options[key])
    }

    label.textContent = options.label
    label.appendChild(input)
    this.inputs.appendChild(label)

    return input
  }

  error(message){
    this.errorMessage.removeClass('hidden')
    this.errorMessage.textContent(message)
  }
}

customElements.define('di-form', DIForm, { extends: 'form' })