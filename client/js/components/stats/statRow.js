import tippy from 'tippy.js'

const HTML = ({ text, displayedValue, icon }) => `
<span class="left-side">${icon ? `<img src="${icon}">` : '<span class="no-icon"></span>'}${text}</span><span class="val">${displayedValue}</span>
`

const ICONS_ONLY_HTML = ({ displayedValue, icon }) => `
<span class="left-side"><img src="${icon}"></span><span class="val">${displayedValue}</span>
`

export default class StatRow extends HTMLElement{

  _options = {
    showTooltips: true,
    iconsOnly: false
  }

  _tippy
  statsDisplayInfo

  constructor(statsDisplayInfo, options = {}){
    super()
    this._tippy = tippy(this, {
      theme: 'light'
    })
    this.statsDisplayInfo = statsDisplayInfo
    this.innerHTML = '<div class="content"></div>'
    this._contentEl = this.querySelector('.content')
    this.setOptions(options)
  }

  setOptions(options){
    for (let key in options){
      if(key in this._options){
        this._options[key] = options[key]
      }
    }
    this._update()
  }

  setStatsDisplayInfo(statsDisplayInfo){
    this.statsDisplayInfo = statsDisplayInfo
    this._update()
  }

  _update(){

    if(this._options.showTooltips){
      this._tippy.enable()
      this._tippy.setContent(this.statsDisplayInfo.description)
    }else{
      this._tippy.disable()
    }

    this._contentEl.innerHTML = (this._options.iconsOnly ? ICONS_ONLY_HTML : HTML)(this.statsDisplayInfo)
    this.setAttribute('stat-key', this.statsDisplayInfo.stat.name)
    this.setAttribute('diff', this.statsDisplayInfo.stat.diff)
    this.style.order = this.statsDisplayInfo.order
  }
}

customElements.define('di-stat-row', StatRow)