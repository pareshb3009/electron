var SerialPort = require('serialport');


var serialModel = require("../models/serial")

var socket = require('../ioconnection');

var port;
var set;
var settingInsert = false;

exports.getPortList = function(req, res, next){
  SerialPort.list(function (err, ports) {
    ports.forEach(function(portObj) {
      console.log(portObj.comName);
      console.log(portObj.pnpId);
      console.log(portObj.manufacturer);
    });
    return res.json({
      response: ports
    });
  });
}

function sendSync(port1, parser1, src) {
    return new Promise((resolve, reject) => {
        if(!port1 || !port1.isOpen) reject('port is not opened')
        port1.write(src)
        
        if(parser1)
        {
          parser1.once('data', (data) => {
              resolve(data.toString());
          });
          parser1.once('error', (err) => {
              reject(err);
          });
        }
        else
        {
          var setT = setTimeout(function() {
            port1.once('data', (data) => {
                resolve(data.toString());
            });
            port1.once('error', (err) => {
                reject(err);
            });
          },1000)
        }
        
    });
}


exports.getConn = function(req, res, next) {
  settingInsert = false
  var io = socket.io();
  if(!req.body.setting) return res.json({error:'Please enter settings'})
  if(!req.body.setting.portname) return res.json({error:'Please select port'})
  if(!req.body.setting.portname.comName) return res.json({error:'Please select port'})
  var portname = req.body.setting.portname.comName;
  // '/dev/cu.usbserial'
  if(port && port.isOpen)
  {
    port.close(function () {
      openPort()
    })
  } 
  else
  {
    openPort()
  }

  function openPort(){
    port = new SerialPort(portname, {
      // parser: SerialPort.parsers.readline('/n'),
      // parser: SerialPort.parsers.byteLength(39),
      baudRate: parseInt(req.body.setting.baudrate) || 19200,
      dataBits: parseInt(req.body.setting.databits) || 8,
      parity: req.body.setting.parity || 'none',
      stopBits: parseInt(req.body.setting.stopbits) || 1,
      bufferSize: 65536
    });

    var respData = {};

    port.on('open',function(){
        function writeData(){
          sendSync(port, undefined, '*D\r\n', 'd').then((data) => {
            console.log(data)
            var firstData = data.split('_');
            
            respData.meter = firstData[7][0];
            respData.loadcellno = firstData[6];
            respData.length2 = firstData[5];
            respData.length1 = firstData[4];
            respData.wt4 = firstData[3];
            respData.wt3 = firstData[2];
            respData.wt2 = firstData[1];
            respData.wt1 = firstData[0];
            io.emit('initData', respData);
            console.log("Port opened");
            return res.json({message:'Port opened'})

          }, (reason) => {
            console.log(reason); // Error!
            return res.json({message:'data response not received from port'})
          })
        }

        writeData();
    });
    
    port.on('error', function(err) {
      return res.json({error:'Error opening port: ' + err.message})
    })
  }
}

exports.startTest = function(req, res, next) {
  var io = socket.io();
  var error;
  if(!req.body.sample) return res.json({error:'Please select sample'})
    console.log(req.body)
  function writeGauge(){
    sendSync(port, undefined, req.body.gaugelength, 'd').then((data) => {
      console.log(data)
      // writeSpeed();
    }, (reason) => {
      console.log(reason); // Error!
      error = reason;
      return res.json({message:'gauge response not received from port'})
    })
  }

  function writeSpeed(){
    sendSync(port, undefined, req.body.speedsetlow, 'd').then((data) => {
      console.log(data)
      // writeOffTime();
    }, (reason) => {
      
      if(!error)
      {
        console.log(reason); // Error!
        error = reason;
        return res.json({message:'speed response not received from port'})
      }
    })
    setTimeout(writeOffTime,1000)
  }

  function writeOffTime(){
    sendSync(port, undefined, '*O0005\r\n', 'd').then((data) => {
      console.log(data)
      // writeMode();
    }, (reason) => {
      
      if(!error)
      {
        console.log(reason); // Error!
        error = reason;
        return res.json({message:error})
      }
    })
    setTimeout(writeMode,1000)
  }

  function writeMode(){
    sendSync(port, undefined, req.body.testtype, 'd').then((data) => {
      console.log('mode')
      // writeForward();
    }, (reason) => {
      
      if(!error)
      {
        console.log(reason); // Error!
        error = reason;
        return res.json({message:error})
      }
    })
    setTimeout(writeForward,1000)
  }
  function writeForward(){
    sendSync(port, undefined, '*F\r\n', 'd').then((data) => {
      console.log('forward')
      // final();
    }, (reason) => {
      
      if(!error)
      {
        console.log(reason); // Error!
        error = reason;
        return res.json({message:error})
      }
    })
    setTimeout(final,1000)
  }
  function final(){
    if(!error)
    {
      settingInsert = true;
      console.log("Port opened");
      return res.json({message:'Port opened'})
    }
  }

  writeGauge();
  setTimeout(writeSpeed,1000)
  
  set = setInterval(function() {
    if(port && port.isOpen && settingInsert)
    {
      var ByteLength = SerialPort.parsers.ByteLength;
      var parser = port.pipe(new ByteLength({length: parseInt(45)}));

      sendSync(port, parser, '*D\r\n').then((data) => {
          console.log(data.toString())
          var split = data.split("_");
          //a.push({y:split[1], x:split[2], peak:split[3]})
          //console.log(a[a.length-1]);
          var respData = {}
          respData.status = split[8][0];
          respData.meter = split[7][0];
          respData.loadcellno = split[6];
          respData.length1 = parseFloat(split[4]);
          respData.length2 = parseFloat(split[5]);
          respData.wt4 = parseFloat(split[3]);
          respData.wt3 = parseFloat(split[2]);
          respData.wt2 = parseFloat(split[1]);
          respData.wt1 = parseFloat(split[0]);

          var y
          var x = parseFloat(split[5])

          if(respData.loadcellno == '1')
          {
            y = respData.wt1
          }
          else if(respData.loadcellno == '2')
          {
            y = respData.wt2
          }
          else if(respData.loadcellno == '3')
          {
            y = respData.wt3
          }
          else if(respData.loadcellno == '4')
          {
            y = respData.wt4
          }

          var point = {
              x:(x - parseFloat(req.body.sample.gaugelength)).toFixed(3), 
              y:y.toFixed(3),
              setting: req.body.setting,
              sample: req.body.sample,
              status: respData.status
            }

            // var serial = new serialModel(point);
            // serial.save(function(err, serialObj) {
            //   io.emit('serial', serialObj);
            // })

            // if(respData.meter)
            if(respData.status == 'S')
            {
              clearInterval(set);
            }
            io.emit('serial', point);
            
          
      })

    }
  }, 500);
}



exports.closeConn = function(req, res, next) {
  clearInterval(set);
  settingInsert = false;
  // if(port && port.isOpen)
  // {
  //   port.close(function () {
  //     return res.json({message: "connection closed"})
  //   })
  // } 
  // else
  // {
  //   return res.json({message: "no connection open"})
  // }
  return res.json({message: "connection closed"})
  
}

exports.getList = function(req, res, next) {

  serialModel.find({}, function(error, result) {
      return res.json({
          response: result
      });
  });
	
}

exports.getLast = function(req, res, next) {

  serialModel.findOne({}, function(error, result) {
      return res.json({
          response: result
      });
  }).sort({testno:-1});
  
}

exports.saveSerialTest = function(req, res, next){
  var serial = new serialModel(req.body);
  serial.save(function(err, serialObj) {
    if(err) return next(err)
    if(!serialObj) return next(new Error('Data not save'))
    return res.json({
        response: serialObj
    });  
  })
}



