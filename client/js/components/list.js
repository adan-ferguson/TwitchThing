import { mobileMode } from '../mobile.js'
import { hideAll as hideAllTippys } from 'tippy.js'
import DIElement from './diElement.js'

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

export default class List extends DIElement{

  _rowsCache = []
  _sortedRows = []
  _selectedRow = null

  constructor(){
    super()
    this.innerHTML = HTML
    this.rows = this.querySelector('.items')
    this._page = 1
    this._isMobile = mobileMode()

    this.addEventListener('wheel', e => {
      if(!this._options.paginate){
        return
      }
      if(e.deltaY < 0 && this._page > 1){
        this.page--
      }else if(e.deltaY > 0 && this._page < this.maxPage){
        this.page++
      }
    }, { passive: true })

    window.addEventListener('resize', () => {
      if(this._isMobile !== mobileMode()){
        this._update()
      }
    })

    this.querySelector('.first').addEventListener('click', () => {
      this.page = 1
    })

    this.querySelector('.prev').addEventListener('click', () => {
      this.page--
    })

    this.querySelector('.next').addEventListener('click', () => {
      this.page++
    })

    this.querySelector('.last').addEventListener('click', () => {
      this.page = this.maxPage
    })

    this.addEventListener('click', e => {
      const row = e.target.closest('.list-row')
      if(!row || row.classList.contains('blank-row')){
        return
      }
      if(this._options.clickableRows){
        this.events.emit('clickrow', { e, row })
      }
      if(this._options.selectableRows){
        if(row.classList.contains('selected')){
          return
        }
        row.classList.add('selected')
        this._selectedRow?.classList.remove('selected')
        this._selectedRow = row
        this.events.emit('selectrow', row)
      }
    })
  }

  get maxPage(){
    return this._options.paginate ? Math.max(1, Math.floor(1 + (this._sortedRows.length - 1) / this._pageSize)) : 1
  }

  get _pageSize(){
    return mobileMode && this._options.mobilePageSize ? this._options.mobilePageSize : this._options.pageSize
  }

  get allRows(){
    return this._rowsCache
  }

  get defaultOptions(){
    return {
      paginate: true,
      pageSize: 10,
      mobilePageSize: null,
      sortFn: null,
      filterFn: null,
      showFiltered: false,
      selectableRows: false,
      clickableRows: false,
      blankFn: null
    }
  }

  get selectedRow(){
    return this._selectedRow
  }

  get page(){
    return this._page
  }

  set page(val){
    val = parseInt(val)
    if(val && this._page === val){
      return
    }
    this._page = val
    this._update()
  }

  clear(){
    return this.setRows([])
  }

  setRows(rows){
    this._rowsCache = rows.slice()
    this.fullUpdate()
    return this
  }

  addRow(row){
    // TODO: binary search here
    this._rowsCache.push(row)
    this.fullUpdate()
  }

  removeRow(row){
    const cacheIndex = this._rowsCache.findIndex(r => r === row)
    if(cacheIndex > -1){
      this._rowsCache.splice(cacheIndex, 1)
    }
    const index = this._sortedRows.findIndex(r => r === row)
    if(index > -1){
      this._sortedRows.splice(index, 1)
      this._update()
    }
  }

  findRow(fn){
    return this._rowsCache.find(fn)
  }

  /**
   * Change page if necessary so that this row is visible.
   * @param row
   */
  showRow(row){
    const index = this._sortedRows.findIndex(r => r === row)
    if(index === -1){
      return
    }
    this.page = Math.ceil((index + 1) / this._pageSize)
  }

  fullUpdate(){
    const filtered = (!this._options.showFiltered && this._options.filterFn) ?
      this._rowsCache.filter(this._options.filterFn) : [...this._rowsCache]
    this._sortedRows = this._options.sortFn ? filtered.sort((a, b) => {
      // TODO: do this some other way
      // if(this._options.showFiltered && this._options.filterFn){
      //   const aFiltered = this._options.filterFn(a)
      //   const bFiltered = this._options.filterFn(b)
      //   if(aFiltered && !bFiltered){
      //     return -1
      //   }else if(bFiltered && !aFiltered){
      //     return 1
      //   }
      // }
      return this._options.sortFn(a, b)
    }) : filtered
    this._update()
  }

  _update(){

    hideAllTippys({ duration: 0 })
    this.isMobile = mobileMode()

    if(!this._options.paginate){
      this.querySelector('.pagination-buttons').classList.add('displaynone')
    }

    this._page = Math.max(1, Math.min(this.maxPage, this._page))
    this.querySelector('.first').disabled = this._page === 1 ? true : false
    this.querySelector('.prev').disabled = this._page === 1 ? true : false
    this.querySelector('.next').disabled = this._page === this.maxPage ? true : false
    this.querySelector('.last').disabled = this._page === this.maxPage ? true : false
    this.querySelector('.page-number').textContent = this._page + ''
    this.querySelector('.page-count').textContent = this.maxPage + ''

    this.classList.toggle('clickable-rows', this._options.clickableRows)

    this.rows.innerHTML = ''
    const start = (this._page - 1) * this._pageSize
    const toDisplay = this._sortedRows.slice(start, start + this._pageSize)
    this._fillWithBlanks(toDisplay)
    toDisplay.forEach(el => {
      el.classList.add('list-row')
      el.style.flexBasis = `${100 / this._pageSize}%`
      if(this._options.showFiltered && this._options.filterFn && !el.classList.contains('blank-row')){
        el.classList.toggle('filtered', !this._options.filterFn(el))
      }
    })
    this.rows.append(...toDisplay)
  }

  _fillWithBlanks(arr){
    for(let i = 0; i < this._pageSize; i++){
      if(!arr[i]){
        if(this._options.blankFn){
          arr[i] = this._options.blankFn()
        }else{
          const blankRow = document.createElement('div')
          blankRow.classList.add('blank-row')
          arr[i] = blankRow
        }
      }
    }
    return arr
  }
}
customElements.define('di-list', List)