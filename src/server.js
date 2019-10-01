const express = require('express');
const path = require('path');

const app = express();
//app.use(express.static('dist'));
//const DIST_FOLDER = join(process.cwd(), 'dist');

app.use(express.static(path.join(__dirname,'dist')));
//app.use(express.static(__dirname/dist/));
//app.get('*',(req,res) => {
//    res.sendFile(`./dist/index.html`);
//});

app.get('*', (req, res) => {
   res.sendFile(`./dist/index.html`);
});


app.listen(process.env.PORT || 8080);
