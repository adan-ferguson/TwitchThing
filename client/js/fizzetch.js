export async function post(url, data){
  try {
    const resp = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if(!resp.ok){
      return {
        errors: {
          request: resp.statusText
        }
      }
    }
    return await resp.json()
  }catch(err){
    return {
      errors: {
        request: err
      }
    }
  }
}