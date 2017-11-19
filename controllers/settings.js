var Model = require("../models/settings")

exports.saveSettings = function(req, res, next){
    var data = req.body;

    if(!data.companyname) return next(new Error('company name required'))
    if(!data.portname) return next(new Error('Port name required'))
    if(!data.portname.comName) return next(new Error('Port name required'))
    data.baudrate = data.baudrate || '9600'
    data.databits = data.databits || '8'
    data.parity = data.parity || 'none'
    data.stopbits = data.stopbits || '1'
    if(!data._id)
    {
        var setting = new Model(data);
        setting.save(function(err, response) {
            if (err) {
                return next(err)
            };
            return res.json({
                response: response
            });
        })
    }
    else
    {
        Model.findById(data._id, function(err, result) {
            if (err) return next(new Error(err));
            if (!result) return next(new Error("setting not found."));
            for (var key in data) {
                if (typeof result[key] !== "function") {
                    result[key] = data[key];
                };
            };
            result.save(function(err, result) {
                if (err) return next(new Error("Error while saving" + err));
                return res.json(result);
            })
        })
    }
}

exports.getSetting = function(req, res, next) {

  Model.findOne({}, function(error, result) {
      return res.json({
          response: result
      });
  });
    
}