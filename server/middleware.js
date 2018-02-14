module.exports = {
  isUser: function(req, res, next){
    let user = req.user
    if (user.id === +req.params.userId){
      return next()
    } else {
      return next('you are not this user')
    }
  },
  isTripUser: function(req, res, next){
  let user = req.user
  if (user.id === +req.params.userId){
    return next()
  } else {
    return next('you are not on this trip')
  }
}
}
