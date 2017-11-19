/**
 * Created by talat on 06/09/15.
 */
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var samplemasterSchema = new mongoose.Schema({
    "specimanname":{type:String, required: true, unique: true},
    "partyname":{type:String},
    "testspeed":{type:String},
    "gaugelength":{type:String},
    "preload":{type:String},
    "sampleshape":{type:String},
    "csarea":{type:String},
    "thickness":{type:String},
    "width":{type:String},
    "diameter":{type:String},
    "innerdiameter":{type:String},
    "outerdiameter":{type:String}

},{strict:false});


samplemasterSchema.plugin(mongoosePaginate);



module.exports = mongoose.model('Samplemaster',samplemasterSchema);
