export function addPageToHistory(page){
  if(page.path === null){
    return
  }
  const targetPath = '/game' + page.path
  if(window.location.pathname === targetPath){
    return
  }
  window.history.pushState({}, '', targetPath)
}