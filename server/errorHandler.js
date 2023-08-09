export default function(error, req, res, next){
  if(req.method === 'GET' && error.redirect){
    return res.redirect(error.redirect)
  }
  if(typeof(error) === 'string'){
    error = { message: error }
  }
  if(error.output !== false){
    console.error('Ajax Error', req.url, req.body, error)
  }
  res.status(error.code || 500).send({ error })
}