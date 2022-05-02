import { mobileMode } from '../mobile.js'
import { hideAll as hideAllTippys } from 'tippy.js'

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
    this.rows = this.querySelector('.items')
    this._rowsCache = []
    this._page = 1
    this._isMobile = mobileMode()

    this._options = {
      paginate: true,
      pageSize: 10,
      mobilePageSize: null
    }

    this.addEventListener('wheel', e => {
      if(!this._options.paginate){
        return
      }
      if(e.deltaY < 0 && this._page > 1){
        this._page--
        this._update()
      }else if(e.deltaY > 0 && this._page < this._maxPage){
        this._page++
        this._update()
      }
    }, { passive: true })

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
    return this._options.paginate ? Math.floor(1 + (this._rowsCache.length - 1) / this._pageSize) : 1
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

  setRows(rows){
    this._rowsCache = rows.slice()
    this._update()
  }

  addRow(row){
    this._rowsCache.push(row)
    this._update()
  }

  removeRow(row){
    const index = this._rowsCache.findIndex(r => r === row)
    if(index > -1){
      this._rowsCache.splice(index, 1)
      this._update()
    }
  }

  findRow(fn){
    return this._rowsCache.find(fn)
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
    this.querySelector('.page-number').textContent = this._page + ''
    this.querySelector('.page-count').textContent = this._maxPage + ''

    this.rows.innerHTML = ''
    const start = (this._page - 1) * this._pageSize
    const toDisplay = this._rowsCache.slice(start, start + this._pageSize)
    fillWithBlanks(toDisplay, this._pageSize)
    toDisplay.forEach(el => {
      el.style.flexBasis = `${100 / this._pageSize}%`
    })
    this.rows.append(...toDisplay)
    hideAllTippys()
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