var testFolder = './uploads/myopinion';
var fs = require('fs');
 
fs.readdir(testFolder, function (error, filelist) {
    var list = '<ul>';
    var i = 0;
    while ( i < filelist.length ) {
        list = list + `<li><a href="?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i+ 1;
    }
    list = list + '</ul>';
    console.log(list);
    return list;
})