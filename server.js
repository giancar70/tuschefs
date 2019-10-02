//const express = require('express');
//const path = require('path');
//import appRoot from 'app-root-path';

//const app = express();
//app.use(express.static('./dist'));
//const DIST_FOLDER = join(process.cwd(), 'dist');
/*
app.use(express.static('./dist'));


//app.use(express.static(path.join(__dirname,'dist')));
//app.use(express.static(__dirname/dist/));
//app.get('*',(req,res) => {
//    res.sendFile(`./dist/index.html`);
//});

//print(app.get('appPath'))

console.log("path.join() : ", path.join());
// outputs .
console.log("path.resolve() : ", __dirname);
console.log("path.resolve() : ", path.resolve(__dirname, '..'));


//console.log("path.resolve() : ",path.resolve('dist','/dist'));


app.get('*', (req, res) => {

   res.sendFile(path.resolve(__dirname, '..') + '/dist/index.html');

});

*/

const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname,'dist')));
app.get('*',(req,res) => {
    res.sendFile(`./dist/index.html`);
});

app.listen(process.env.PORT || 4200);
