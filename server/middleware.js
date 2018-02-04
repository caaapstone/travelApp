module.exports = {
  isUser: function(req, res, next){
    console.log('user params', req.params)
    let user = req.user
    if (user.id === +req.params.userId){
      return next()
    } else {
      return next('you are not this user')
    }
  },
  isTripUser: function(req, res, next){
  console.log('user params', req)
  let user = req.user
  if (user.id === +req.params.userId){
    return next()
  } else {
    return next('you are not on this trip')
  }
}
}
