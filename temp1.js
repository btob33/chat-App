const {mongoose} = require('./DB/mongoose');
const {User} = require('./models/User');
const {Message} = require('./models/Message');
const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session');
var socketio = require('socket.io');
var http = require('http');

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static('./public'));
app.use(session({secret:'haveit'}));


app.get('/home',(req,res)=>
{
  
  if(req.session.name){
    res.sendFile(__dirname+'/public/userUi.html')
  }
  else
  {
    res.sendFile(__dirname+'/public/index.html')
    
  }
});

app.post('/signup',(req,res)=>
{
  
  if(req.session.name){
    res.send("hello"+req.sesssion.name)
  }
  else{
    let newUser = new User();
    newUser.userId = req.body.uid;
    newUser.name = req.body.uname;
    newUser.age = req.body.age;
    newUser.gender = req.body.gen;
    newUser.pwd = req.body.pwd;
    
    newUser.save((err,nUser) =>{
      if(err)
      {
        console.log(err);
        res.status(400).send("Unable to insert the user");
      }
      else{
        req.session.name = nUser.userId;
        
        res.send(nUser);
      }
    });
  }
});

app.post('/login',(req,res) => {
  
  if(req.session.name){
    res.sendFile(__dirname + '/public/userUi.html')
  }
  else{
    console.log(req.body)
    User.find({userId:req.body.id,pwd:req.body.pwd},(err,doc)=>{

        if(err)
        {
          res.send('erro');
        }
        else if(doc.length == 0)
        {
          
          res.send("no result")
        }
        else{
          sess = req.session;
          sess.name = req.body.id;
          res.sendfile(__dirname+'/public/userUi.html')
        }
    
    })
  }    
})
app.get('/user',(req,res)=> {
  if(req.session.name){
    User.find({userId:req.session.name},(err,docs) => {
      if(err)
      {
        res.status(200).send("bad request");
      }
      else{
        res.send(docs);
      }
    })
  }
  else{
    res.sendFile(__dirname + '/public/index.html')
  }
  });

var server = http.createServer(app); 
var io = socketio.listen(server);
server.listen(3000,'127.0.0.1');

var clients = {};

app.get('/chatting',(req,res) => {

   if(req.session.name){
    res.sendfile(__dirname+'/public/userUi.html');
    
    io.sockets.on('connection', (socket) => {
    
    socket.nickname = req.session.name;
    clients[socket.nickname] = socket;  
    // Handle chat event
    socket.on('chat', function(data){ 
      if(data.handle in clients)
      {
        //console.log(clients[data.handle])
        clients[data.handle].emit('mes',{'from':socket.nickname,'msg':data.message});
      }
      else
          console.log('sad')
    });
    });
  }
  else{
    res.sendFile(__dirname+'/public/index.html')
  } 
})