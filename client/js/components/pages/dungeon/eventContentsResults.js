const HTML = `
<div class="content-well scrollable">
  <di-tabz>
    <div data-tab-name="Results"></div>
    <div data-tab-name="Monsters"></div>
    <div data-tab-name="Relics"></div>
  </di-tabz>
</div>
<button class="finalizer displaynone">Finish</button>
`

export default class EventContentsResults extends HTMLElement{

  _lastEvent
  _results
  _skipAnimations = false

  constructor(dungeonEvent){
    super()
    this.innerHTML = HTML
    this._lastEvent = dungeonEvent
    this._results = dungeonEvent.results
    this.addEventListener('click', () => {
      this._skipAnimations = true
    })

    const tabz = this.querySelector('di-tabz')
    this._setupResultsTab(tabz.getContentEl('Results'))
    this._setupMonstersTab(tabz.getContentEl('Monsters'))
    this._setupRelicsTab(tabz.getContentEl('Relics'))
  }

  showFinalizerButton(fn){
    const el = this.querySelector('.finalizer')
    el.classList.remove('displaynone')
    el.onclick = fn
  }

  _setupResultsTab(el){
    el.innerHTML = 'TODO: Results tab'
  }

  _setupMonstersTab(el){
    el.innerHTML = 'TODO: Monsters tab'
  }

  _setupRelicsTab(el){
    el.innerHTML = 'TODO: Relics tab'
  }
}

customElements.define('di-dungeon-event-contents-results', EventContentsResults)