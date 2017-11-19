/**
 * Created by talat on 06/09/15.
 */
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var serialSchema = new mongoose.Schema({
    x:{type:String},
    y:{type:String},
    peak:{type:String},
    createdat:{type:Date, default:Date.now}

},{strict:false});


serialSchema.plugin(mongoosePaginate);



module.exports = mongoose.model('Serial',serialSchema);
