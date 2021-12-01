export default class DIForm extends HTMLFormElement {

  constructor(){
    super()
    this.errorMessage = document.createElement('div')
    this.errorMessage.classList.add('error', 'hidden')
    this.appendChild(this.errorMessage)
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
    this.insertBefore(label, this.errorMessage)

    return input
  }

  addSubmitButton(text){
    const button = document.createElement('button')
    button.setAttribute('type', 'submit')
    button.textContent = text
    this.insertBefore(button, this.errorMessage)
  }

  error(message){
    this.errorMessage.removeClass('hidden')
    this.errorMessage.textContent(message)
  }
}

customElements.define('di-form', DIForm, { extends: 'form' })