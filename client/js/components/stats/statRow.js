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
  _statsDisplayInfo

  constructor(statsDisplayInfo, options = {}){
    super()
    this._tippy = tippy(this, {
      theme: 'light'
    })
    this._statsDisplayInfo = statsDisplayInfo
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
    this._statsDisplayInfo = statsDisplayInfo
    this._update()
  }

  _update(){

    if(this._options.showTooltips){
      this._tippy.enable()
      this._tippy.setContent(this._statsDisplayInfo.description)
    }else{
      this._tippy.disable()
    }

    this.innerHTML = (this._options.iconsOnly ? ICONS_ONLY_HTML : HTML)(this._statsDisplayInfo)
    this.setAttribute('stat-key', this._statsDisplayInfo.stat.name)
    this.setAttribute('diff', this._statsDisplayInfo.stat.diff)
    this.style.order = this._statsDisplayInfo.order
  }
}

customElements.define('di-stat-row', StatRow)