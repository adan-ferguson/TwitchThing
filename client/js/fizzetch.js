export default async function(url, data = null){
  try {
    const obj = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    if(data){
      obj.body = JSON.stringify(data)
    }

    const resp = await fetch(url, obj)
    if(!resp.ok){
      return { error: resp.statusText }
    }
    return await resp.json()
  }catch(error){
    return { error }
  }
}