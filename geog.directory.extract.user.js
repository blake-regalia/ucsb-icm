var b = [];
var pfs=['Professor','Professor Emeritus','Associate Professor','Assistant Professor'];
var profs=[],grads=[];
$('.yui-dt-data').children().each(function() {
    var e=$(this).children().children(':first');
    var n=e.children().first().text();
    var t=e.text().substr(n.length);
    if(pfs.indexOf(t)!=-1) {
        profs.unshift(n);
    }
    else {
        b.unshift(n);
    }   
});
JSON.stringify(profs);