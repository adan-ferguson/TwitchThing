export function addPageToHistory(page, replace){
  if(page.path === null){
    return
  }
  const targetPath = '/game' + page.path
  if(replace || targetPath === window.location.pathname){
    window.history.replaceState({ targetPath }, '', targetPath)
  }else{
    window.history.pushState({ targetPath }, '', targetPath)
  }
}