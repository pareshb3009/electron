var Model = require("../models/samplemaster")

exports.savesamplemaster = function(req, res, next){
    var data = req.body;

    if(!data.specimanname) return next(new Error('sample name required'))
    if(!data._id)
    {
        var sample = new Model(data);
        sample.save(function(err, response) {
            if (err) {
                return res.json(err)
            };
            return res.json(response);
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
                if (err) return res.json(err)
                return res.json(result);
            })
        })
    }
}

exports.getsamplemaster = function(req, res, next) {

  Model.find({}, function(error, result) {
      return res.json({
          response: result
      });
  });
    
}