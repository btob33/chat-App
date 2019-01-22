// Make connection
var socket = io.connect();

// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback'),
      onlineUsers = document.getElementById('showusers'),
      usr = document.getElementById('usr'),
      chatwith = document.getElementById('sendto'),
      typing = document.getElementById('typing');

var block = document.getElementById('block');
var unblock = document.getElementById('unblock');

block.addEventListener('click',() =>{
    if(handle.innerHTML!=='')
        socket.emit('blockuser',handle.innerHTML);
})

unblock.addEventListener('click',() =>{
    if(handle.innerHTML!=='')
        socket.emit('unblockuser',handle.innerHTML);
})
// Emit events
btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        //handle: handle.value
        handle: handle.innerHTML
    });
    message.value = "";
});

onlineUsers.addEventListener('click', function(){
    socket.emit('showUsers');
});
  window.setInterval(() => {
    socket.emit('showUsers');
},2000) 
 

socket.on('showUsers',(data) =>{
    usr.innerHTML=""
    data.forEach(element => {
        var btn= document.createElement('input');
        btn.setAttribute('class','ousers');
        btn.setAttribute('id',element);
        btn.setAttribute('type',"button");
        btn.setAttribute('value',element);
        btn.style.color="";
        usr.append(btn);
        btn.addEventListener('click',()=>{
            socket.emit('chat-hist',btn.id);
        })
    });
    
    
})

socket.on('chat-hist',(data,msgs)=>{
    //socket.emit('showUsers');
    block.style.display="block";
    unblock.style.display="block";
    handle.innerHTML ="";
    if(msgs.length>0){
        output.innerHTML="";
        msgs.forEach(element => {
            output.innerHTML += '<p><strong>' + element.senderId + ': </strong>' + element.text + '</p>';
        })
    }
    else{
        output.innerHTML="";
    }
    chatwith.innerHTML = ""
    chatwith.innerHTML = data;
    handle.innerHTML=data;
});

socket.on('mes-reciever', function(data){
        
        //handle.innerHTML = data.to;
        socket.emit('showUsers');
        output.innerHTML = "";
        socket.emit('chat-hist',handle.innerHTML);
        output.innerHTML += '<p><strong>' + data.from + ': </strong>' + data.msg + '</p>';
    
});

socket.on('mes-sender', function(data){
    
    feedback.innerHTML = '';
    if(handle.innerHTML === "")
    {
        handle.innerHTML = ""
        handle.innerHTML = data.from;
        chatwith.innerHTML = ""
        chatwith.innerHTML = data.from;

        output.innerHTML = ""
        socket.emit('chat-hist',handle.innerHTML);
        output.innerHTML += '<p><strong>' + data.from + ': </strong>' + data.msg + '</p>';
    }
    else if(handle.innerHTML !== data.from){
    
        /* usr.childNodes.forEach((element)=>{
        
            if(element.id === data.from)
            {
                element.style.color = "blue";
                
            }
         }) */
        
         window.alert("You got new message from "+ data.from);
        
    }else{
        chatwith.innerHTML = ""
        chatwith.innerHTML = data.from;
        handle.innerHTML = data.from;
        output.innerHTML = ""
        socket.emit('chat-hist',handle.innerHTML);
        output.innerHTML += '<p ><strong>' + data.from + ': </strong>' + data.msg + '</p>';
        
    }
});

socket.on('error-msg',function(data){
   
    feedback.innerHTML = '';
    if(data==='')
    {
        output.innerHTML=""
        output.innerHTML+="<p>"+"Please choose one online user"+"</p>"
    }
    else{
        
        //output.innerHTML += '<p>'+data+" is not online"+'</p>';
        output.innerHTML = "";
        handle.innerHTML = "";
        chatwith.innerHTML = "";
        window.alert(data+" is not online");
        
    }
})

socket.on('error-msg2',function(data){
    
    feedback.innerHTML = '';
    
    output.innerHTML+="<p>"+data+"</p>"
    
})

socket.on('logout',()=>{
    
    console.log('here');
    socket.emit('disconnect');
})

message.addEventListener('keydown', ()=>{
    
    socket.emit('typing',handle.innerHTML)
});

 message.addEventListener('keyup', ()=>{

    socket.emit('notyping',handle.innerHTML);
    
});
socket.on('typing',(data)=>{
    
    if(data[0] === handle.innerHTML || chatwith.innerHTML===""){
        typing.innerHTML ='<span>'+data[1]+" "+'is typing'+'</span>';
    
        //chatwith.innerHTML = data[1];
    }
    
});

socket.on('notyping',()=>{
    typing.innerHTML = "";
})

socket.on('blocked-msg',(data) => {
    output.innerHTML+='<p>'+data+'</p';
})
