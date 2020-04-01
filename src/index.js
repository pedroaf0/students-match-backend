const http = require("http");
const express = require("express");
const crypto = require("crypto");
const db = require('./database/db');

const app = express();
const port = process.env.port || 3333;
app.set('port', port);

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions) 
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


const server = http.createServer(app);
app.use(express.json());
app.post('/user',async (req, res) => {
    console.log(req.body);
    const {name, email, cell, school, city, bio, area_fav, area_mal, password} = req.body;
    const id = crypto.randomBytes(4).toString('HEX');
   await db('users').insert({
        id,
        name,
        email,
        cell, 
        school, 
        city, 
        area_fav, 
        area_mal,
        bio,
        password
   });
  return res.json( { id } );
});

app.get('/match/:id',async (req, res) => {
  
  const id = req.params.id;
 var ids = id+',';
  var json = '[';

    const [{area_fav, area_mal, school, city}] = await db('users').where('id', id,).select('area_fav', 'area_mal', 'school', 'city');
    
    const match100 = await db('users').where('area_fav', area_mal).andWhere('area_mal', area_fav).andWhere('school',school).andWhere('city',city).whereNot('id', id).select('area_fav', 'area_mal', 'city', 'id', 'name', 'school');
 
    for(var i=0;match100.length>i;i++){
      json += JSON.stringify(match100[i]).substr(0,JSON.stringify(match100[i]).length - 1) + ",\"por\":\"100%\"}," ;
     // console.log(match100[i].id)
      ids += match100[i].id + ',';
    }
    //console.log(ids.substr(0,ids.length - 1).split(','));
    ids = ids.substr(0,ids.length - 1).split(',');

    const match75 =  await db('users').where('area_fav', area_mal).andWhere('area_mal', area_fav).andWhere('school',school).whereNotIn('id', ids).select('area_fav', 'area_mal', 'city', 'id', 'name', 'school');
    
    ids += ',';
    for(var i=0;match75.length>i;i++){
      json += JSON.stringify(match75[i]).substr(0,JSON.stringify(match75[i]).length - 1) + ",\"por\":\"75%\"}," ;
      ids += match75[i].id + ',';
    }
    //console.log(ids.substr(0,ids.length - 1).split(','));
    ids = ids.substr(0,ids.length - 1).split(',');

    const match50 =  await db('users').where('area_fav', area_mal).andWhere('area_mal', area_fav).whereNotIn('id', ids).select('area_fav', 'area_mal', 'city', 'id', 'name', 'school');
    ids += ',';
    for(var i=0;match50.length>i;i++){
      json += JSON.stringify(match50[i]).substr(0,JSON.stringify(match50[i]).length - 1) + ",\"por\":\"50%\"}," ;
      ids += match50[i].id + ',';
    }
   // console.log(ids.substr(0,ids.length - 1).split(','));
    ids = ids.substr(0,ids.length - 1).split(',');

    const match25 =  await db('users').where('area_fav', area_mal).whereNotIn('id', ids).select('area_fav', 'area_mal', 'city', 'id', 'name', 'school');
    ids += ',';
    for(var i=0;match25.length>i;i++){
      json += JSON.stringify(match25[i]).substr(0,JSON.stringify(match25[i]).length - 1) + ",\"por\":\"25%\"}," ;
      ids += match25[i].id + ',';
    }
    //console.log(ids.substr(0,ids.length - 1).split(','));
    
    json = JSON.parse(json.substr(0,json.length - 1)+']');
    
 return res.json( json  );
});


 app.post('/login/:email/:senha',async (req, res) => {
  
 try{
  const [{ password, id }] = await db('users').where('email', req.params.email).select('*');

 
  if(password == req.params.senha){
   const success = true;


   return res.json( { success, id}); 
 }else{
   const success = false;
   const err = "senha incorreta";

   return res.json( { success, err }); 

 }
 }catch{
  const success = false;
   const err = "usuario não encontrado";

   return res.json( { success, err }); 
 } 

});
app.get('/profile/:id',async (req, res) => {
  
 
 return res.json( await db('users').where('id', req.params.id).select('*')); 

});

console.log("api escutando em http://localhost:"+port)
server.listen(port);

