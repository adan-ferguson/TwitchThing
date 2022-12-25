export default function(error, req, res, next){
  console.error('Ajax Error', req.url, req.body, error)
  if(req.method === 'GET' && error.redirect){
    return res.redirect(error.redirect)
  }
  if(typeof(error) === 'string'){
    error = { message: error }
  }
  res.status(error.code || 500).send({ error })
}