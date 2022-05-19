export default function(error, req, res, next){
  if(req.method === 'GET' && error.redirect){
    return res.redirect(error.redirect)
  }
  res.status(error.code || 500).send({ error })
}