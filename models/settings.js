/**
 * Created by talat on 06/09/15.
 */
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var settingsSchema = new mongoose.Schema({
    companyname:{type:String, required: true},
    portname:{type:mongoose.Schema.Types.Mixed, required: true},
    baudrate:{type:String, required: true},
    databits:{type:String, required: true},
    stopbits:{type:String, required: true},
    parity:{type:String, required: true},
    maxspeed:{type:String, required: true},
    setlow:{type:String, required: true}

},{strict:false});


settingsSchema.plugin(mongoosePaginate);



module.exports = mongoose.model('Setting',settingsSchema);
