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
    this._isMobile = mobileMode()

    this._options = {
      paginate: true,
      pageSize: 10,
      mobilePageSize: null
    }

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
    return this._options.paginate ? Math.floor(1 + this._itemsCache.length / this._pageSize) : 1
  }

  get _pageSize(){
    return mobileMode && this._options.mobilePageSize ? this._options.mobilePageSize : this._options.pageSize
  }

  setOptions(options){
    for (let key in options){
      this._options[key] = options[key]
    }
    this._update()
  }

  setItems(items){
    this._itemsCache = items.slice()
    this._update()
  }

  _update(){

    this.isMobile = mobileMode()

    if(!this._options.paginate){
      this.querySelector('.pagination-buttons').classList.add('displaynone')
    }

    this.querySelector('.first').disabled = this._page === 1 ? true : false
    this.querySelector('.prev').disabled = this._page === 1 ? true : false
    this.querySelector('.next').disabled = this._page === this._maxPage ? true : false
    this.querySelector('.last').disabled = this._page === this._maxPage ? true : false

    this.itemsList.innerHTML = ''
    const start = (this._page - 1) * this._pageSize
    const toDisplay = this._itemsCache.slice(start, start + this._pageSize)
    fillWithBlanks(toDisplay, this._pageSize)
    toDisplay.forEach(el => {
      el.style.flexBasis = `${100 / this._pageSize}%`
    })
    this.itemsList.append(...toDisplay)
  }
}
customElements.define('di-list', List)

function fillWithBlanks(arr, length){
  for(let i = 0; i < length; i++){
    if(!arr[i]){
      const blankRow = document.createElement('div')
      blankRow.classList.add('blank-row')
      arr[i] = blankRow
    }
  }
  return arr
}