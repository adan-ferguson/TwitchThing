import DIElement from './diElement.js'

const HTML = prevHTML => `
<div class="tabz-list"></div>
<div class="tabz-content">${prevHTML}</div>
`

export default class Tabz extends DIElement{

  constructor(){
    super()

    this.innerHTML = HTML(this.innerHTML)
    const tabContents = this.querySelectorAll('.tabz-content > *')
    const list = this.querySelector('.tabz-list')

    let first
    tabContents.forEach(diTab => {
      const name = diTab.getAttribute('data-tab-name')
      const tab = makeTab(name)
      tab.addEventListener('click', () => {
        this.setTab(name)
      })
      list.appendChild(tab)
      if(!first){
        first = name
      }
    })
    this.setTab(first)
  }

  get currentTab(){
    return this.querySelector('.tabz-content .active')
  }

  getContentEl(name){
    return this.querySelector(`.tabz-content [data-tab-name=${name}]`)
  }

  setTab(name){
    if(!name){
      return
    }
    this.querySelectorAll('.tabz-list .tab').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-tab-name') === name)
      tab.classList.remove('glow')
    })
    this.querySelectorAll('.tabz-content > *').forEach(tabContent => {
      const match = tabContent.getAttribute('data-tab-name') === name
      if(match){
        tabContent.show?.()
      }
      tabContent.classList.toggle('active', match)
    })
    this.events.emit('changed')
  }
}
customElements.define('di-tabz', Tabz)

function makeTab(name){
  const tab = document.createElement('div')
  tab.classList.add('tab', 'clickable')
  tab.setAttribute('data-tab-name', name)
  tab.textContent = name
  return tab
}
