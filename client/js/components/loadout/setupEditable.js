const DRAG_THRESHOLD = 12

let draggedElement
let hoveredElement
let hoverables
let dragStarted = false
let initialPoint

/**
 * Given an inventory + loadout pair, set them up so that they can be editable:
 * - If inventory item clicked, add to loadout if loadout not full
 * - If loadout item clicked, add it back to the inventory
 * - Item can be dragged out of loadout to remove it
 * - Item can be dragged within loadout to change the slot
 * - Item can be dragged from inventory to a specific loadout slot
 * - When loadout changes, it should update its header data (orbs)
 * @param inventoryEl {Inventory}
 * @param loadoutEl {Loadout}
 * @param options {object}
 */
export default function(inventoryEl, loadoutEl, options = {}){

  options = {
    onChange: () => undefined,
    ...options
  }

  inventoryEl.classList.add('editable')
  loadoutEl.setOptions({
    editable: true
  })

  inventoryEl.addEventListener('click', click)
  inventoryEl.addEventListener('pointerdown', pointerdown)
  inventoryEl.addEventListener('pointermove', pointermove)
  inventoryEl.addEventListener('pointerup', pointerup)

  loadoutEl.addEventListener('click', click)
  loadoutEl.addEventListener('pointerdown', pointerdown)
  loadoutEl.addEventListener('pointermove', pointermove)
  loadoutEl.addEventListener('pointerup', pointerup)

  function click(e){
    const row = e.target.closest('di-loadout-row')
    if(!row?.loadoutItem){
      return
    }
    if(dragStarted){
      return
    }
    if(inventoryEl.contains(row)){
      if(!loadoutEl.isFull){
        inventoryEl.removeItem(row.loadoutItem)
        loadoutEl.addItem(row.loadoutItem)
        changed()
      }
    }else{
      inventoryEl.addItem(row.loadoutItem)
      loadoutEl.setItem(row.index, null)
      changed()
    }
  }

  function pointerdown(e){
    const row = e.target.closest('di-loadout-row')
    if(!row?.loadoutItem){
      return
    }
    draggedElement = row
    hoveredElement = null
    dragStarted = false
    row.setPointerCapture(e.pointerId)
    initialPoint = {
      x: e.clientX,
      y: e.clientY
    }
  }

  function pointermove(e){
    if(!e.buttons){
      reset()
      return
    }
    const row = e.target.closest('di-loadout-row')
    if(!draggedElement || draggedElement !== row){
      return
    }
    if(!dragStarted){
      if(dist(initialPoint, { x: e.clientX, y: e.clientY }) >= DRAG_THRESHOLD){
        dragStarted = true
        calcHoverables()
      }
    }
    if(dragStarted){
      const currentPoint = {
        x: e.clientX,
        y: e.clientY
      }
      const hovered = getHoverableUnderPoint(currentPoint)
      if(hovered !== hoveredElement){
        hoveredElement?.classList.remove('hovered')
        hovered?.classList.add('hovered')
        hoveredElement = hovered
      }
      draggedElement.style.zIndex = 1000
      draggedElement.style.transform = `translate(${currentPoint.x - initialPoint.x}px, ${currentPoint.y - initialPoint.y}px)`
    }
  }

  function pointerup(e){
    const row = e.target.closest('di-loadout-row')
    if(draggedElement !== row || !dragStarted){
      return
    }
    if(hoveredElement){
      if(hoveredElement === inventoryEl){
        inventoryEl.addItem(draggedElement.loadoutItem)
        loadoutEl.setItem(draggedElement.index, null)
        changed()
      }else if(loadoutEl.contains(draggedElement)){
        loadoutEl.swap(draggedElement.index, hoveredElement.index)
        changed()
      }else{
        inventoryEl.removeItem(draggedElement.loadoutItem)
        if(hoveredElement.loadoutItem){
          inventoryEl.addItem(hoveredElement.loadoutItem)
        }
        loadoutEl.setItem(hoveredElement.index, draggedElement.loadoutItem)
        changed()
      }
    }
    reset()
  }

  function calcHoverables(){

    if(loadoutEl.contains(draggedElement)){
      inventoryEl.classList.add('hoverable')
    }

    loadoutEl.querySelectorAll('di-loadout-row, .blank-row').forEach(row => row.classList.add('hoverable'))
    draggedElement.classList.remove('hoverable')

    hoverables = []
    document.querySelectorAll('.hoverable').forEach(el => {
      hoverables.push({ el, rect: el.getBoundingClientRect() })
    })
  }

  function getHoverableUnderPoint(point){
    return hoverables.find(hoverable => contains(hoverable.rect, point))?.el
  }

  function changed(){
    loadoutEl.updateOrbs()
    options.onChange()
  }
}

function dist(pointA, pointB){
  return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2))
}

function contains(rect, point){
  if(rect.left > point.x || rect.right < point.x || rect.top > point.y || rect.bottom < point.y){
    return false
  }
  return true
}

function reset(){
  if(hoverables){
    hoverables.forEach(hoverable => {
      hoverable.el.classList.remove('hoverable', 'hovered')
    })
    hoverables = null
  }
  if(draggedElement){
    draggedElement.style.transform = 'initial'
    draggedElement.style.zIndex = 'initial'
    draggedElement = null
  }
  hoveredElement = null
  initialPoint = null
}