import { mobileMode } from '../mobile.js'

const HTML = `
<div class='items'></div>
<div class='pagination-buttons'>
    <button class='first' disabled='disabled'><<</button>
    <button class='prev disabled='disabled'><</button>
    <div class='page-count-display'>
        <span class='page-number'>1</span> of <span class='page-count'>1</span>
    </div>
    <button class='next' disabled='disabled'>></button>
    <button class='last' disabled='disabled'>>></button>
</div>
`

export default class List extends HTMLElement{

  constructor(){
    super()
    this.innerHTML = HTML
    this.itemsList = this.querySelector('.items')
    this._itemsCache = []
    this._page = 1
    this._pageSizeStandard = Math.floor(this.getAttribute('page-size') || 10)
    this._pageSizeMobile = Math.floor(this.getAttribute('m-page-size') || 5)
    this._isMobile = mobileMode()

    window.addEventListener('resize', () => {
      if(this._isMobile !== mobileMode()){
        this._update()
      }
    })

    this.querySelector('.first').addEventListener('click', () => {
      this._page = 1
      this._update()
    })

    this.querySelector('.prev').addEventListener('click', () => {
      this._page--
      this._update()
    })

    this.querySelector('.next').addEventListener('click', () => {
      this._page++
      this._update()
    })

    this.querySelector('.last').addEventListener('click', () => {
      this._page = this._maxPage
      this._update()
    })
  }

  get _maxPage(){
    return Math.floor(1 + this._itemsCache.length / this._pageSizeStandard)
  }

  get _pageSize(){
    return mobileMode ? this._pageSizeMobile : this._pageSizeStandard
  }

  setItems(items){
    this._itemsCache = items.slice()
    this._update()
  }

  _update(){

    this.querySelector('.first').disabled = this._page === 1 ? true : false
    this.querySelector('.prev').disabled = this._page === 1 ? true : false
    this.querySelector('.next').disabled = this._page === this._maxPage ? true : false
    this.querySelector('.last').disabled = this._page === this._maxPage ? true : false

    this.itemsList.innerHTML = ''
    const start = (this._page - 1) * this._pageSizeStandard
    const toDisplay = this._itemsCache.slice(start, start + this._pageSizeStandard - 1)
    this.itemsList.append(...toDisplay)
  }
}
customElements.define('di-list', List)