app.put('/user/:id',(req,res) =>{
  
  User.findOneAndUpdate({userId:req.params.id},
    {$push:{pwd:req.body.pwd}},
    (err,upuser) =>{
      if(err){
        res.status(400).send("Unable to update");
      }
      else{
        console.log(upuser.pwd);
        res.send(upuser)
      }
    });
  }); 
 
 app.delete('/user/:id',(req,res) =>{
  
  User.findOneAndRemove({userId:req.params.id},(err,upuser) =>{
      if(err){
        res.status(400).send("Unable to delete");
      }
      else{
        res.send(upuser),
        
        res.status(204)
      }
    });
  }); 

 app.get('/user',(req,res)=> {
   User.find({},(err,docs) => {
     if(err)
     {
       res.status(200).send("bad request");
     }
     else{
       res.send(docs);
     }
   });
 });