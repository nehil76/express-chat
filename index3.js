const express = require("express");
const app = express();
const config = require('./config/config.json');
const hostname = "bds1231234";

app.set('view engine', 'ejs');

app.use("/css",express.static(__dirname+"/css"));
app.use("/js",express.static(__dirname+"/js"));
app.use("/node_modules",express.static(__dirname+"/node_modules"));

app.get('/index', (req, res) => {  
      res.render('index',{hostname,central:`${config.central.URL}:${config.central.port}/`});
});

app.listen(4200, () => {
    console.log('Client machine server started on port '+4200);
});