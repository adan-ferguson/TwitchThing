import fizzetch from '../fizzetch.js'
import { hideLoader, showLoader } from '../loader.js'

const HTML = (html) => `
<div class="inputs">${html}</div>
<div class="bottom">
  <button type="submit"></button>
  <div class="error-message hidden"></div>
</div>
`

export default class DIForm extends HTMLFormElement{

  _inputs
  _errorMessage
  submitButton

  constructor(options){
    super()

    options = {
      async: false,
      action: '',
      submitText: 'Submit',
      success: () => {},
      customFetch: false,
      fullscreenLoading: false,
      extraData: {},
      html: '',
      ...options
    }
    this.options = options

    this.classList.add('di-form')
    this.innerHTML = HTML(options.html)
    this._inputs = this.querySelector('.inputs')
    this.submitButton = this.querySelector('button')
    this.submitButton.textContent = options.submitText
    this._errorMessage = this.querySelector('.error-message')

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
          this.dispatchEvent(new Event('success'))
        }
      })
    }
  }

  data(){
    const data = new FormData(this)
    const obj = {}
    Array.from(data.entries()).forEach(([key, val]) => obj[key] = val)

    let extra = this.options.extraData
    extra = typeof extra === 'function' ? extra() : extra
    extra = extra ? extra : {}

    return { ...obj, ...extra }
  }

  addInput(options, label = null){

    const input = document.createElement('input')
    for (let key in options){
      input.setAttribute(key, options[key])
    }

    this._addInput(input, label)
  }

  _addInput(inputEl, label = null){

    const labelEl = document.createElement('label')
    if(label){
      const span = document.createElement('span')
      span.textContent = label
      labelEl.appendChild(span)
    }

    labelEl.appendChild(inputEl)
    this._inputs.appendChild(labelEl)
  }

  addSelect(options){

    options = {
      label: null,
      name: '',
      optionsList: [],
      ...options
    }

    const label = document.createElement('label')
    label.classList.add('flex-between')
    if(options.label){
      const span = document.createElement('span')
      span.textContent = options.label
      label.appendChild(span)
    }

    const select = document.createElement('select')
    select.setAttribute('name', options.name)
    options.optionsList.forEach(({ value, name }) => {
      const options = document.createElement('option')
      options.value = value
      options.textContent = name
      select.appendChild(options)
    })
    label.appendChild(select)

    this._inputs.appendChild(label)
    return select
  }

  error(message){
    if(message?.message){
      message = message.message
    }
    this._errorMessage.textContent = message
    this._errorMessage.classList.remove('hidden')
  }

  _loading(){
    if(this.options.fullscreenLoading){
      return showLoader(this.options.fullscreenLoading.message ?? '')
    }
    this._errorMessage.classList.add('hidden')
    this.submitButton.disabled = true
    this.submitButton.innerHTML = '<span class="spin-effect">DI</span>'
  }

  _loadingFinished(){
    if(this.options.fullscreenLoading){
      return hideLoader()
    }
    this.submitButton.disabled = false
    this.submitButton.textContent = this.options.submitText
  }
}

customElements.define('di-form', DIForm, { extends: 'form' })