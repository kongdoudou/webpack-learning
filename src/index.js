var str = require("./component");
var $ = require('Jquery');

require('./less/index');
require('bootstrap');

var img = document.createElement("img");
img.className = "img-circle";
img.src= require('./1.png');
document.body.appendChild(img);

if(__DEV__){
    console.log("这是开发环境");
}else{
    console.log("这是线上环境");
}


$("#app").html("我就是测试一下下拉");