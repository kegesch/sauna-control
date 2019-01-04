/*
The MIT License (MIT)

Copyright (c) 2014-2015 bbx10node@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var i2c = require('i2c-bus');
var fs=require('fs');
//var Promise = require("bluebird");

var MAX_TEMP_CONVERSION     = 50;   // milliseconds
var MAX_HUMI_CONVERSION     = 16;   // ms
var MAX_RESET_DELAY         = 15;   // ms

var HTU21D_I2CADDR          = 0x40;
var HTU21D_READTEMP_NH      = 0xF3;
var HTU21D_READHUMI_NH      = 0xF5;
var HTU21D_WRITEREG         = 0xE6;
var HTU21D_READREG          = 0xE7;
var HTU21D_RESET            = 0xFE;

var i2cbus = 0;

// The regular versions of the READTEMP and READHUMI commands depend
// on clock stretching/hold  which seems to be a problem the
// raspberry pi i2c controller.

const htu21d = function (i2copts_arg) {
};

htu21d.prototype.readTemperature = function(callback) {
  callback(21.5);
};

htu21d.prototype.readHumidity = function(callback) {
  callback(50.0);
};




module.exports = htu21d;
