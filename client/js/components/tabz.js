const HTML = prevHTML => `
<div class="tabz-list"></div>
<div class="tabz-content">${prevHTML}</div>
`

export default class Tabz extends HTMLElement{

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
        this._setTab(name)
      })
      list.appendChild(tab)
      if(!first){
        first = name
      }
    })
    this._setTab(first)
  }

  _setTab(name){
    this.querySelectorAll('.tabz-list .tab').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-tab-name') === name)
    })
    this.querySelectorAll('.tabz-content > *').forEach(tabContent => {
      tabContent.classList.toggle('active', tabContent.getAttribute('data-tab-name') === name)
    })
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
