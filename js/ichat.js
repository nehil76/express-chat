$(function() {
    let userName = $("#hostname").val();
    let centralSystemURL = $("#central").val();

    var socket = io(centralSystemURL,{
        query: {
          hostname: userName
        }
    });
    
    var chats = $("#chats");
    var msg= $("#message");
    let participantList = $("#participantList");
    let allMessage ={};
    let allParticipants = [];
    let activeChatDetails = {};



    $("#send").click(()=>{

        chats.append("<li class='chat-list-group-item'>"+msg.val()+"</li>");

        let chatObj = getChatObj(activeChatDetails,msg.val());
        populateSentChat({...chatObj,timestamp:new Date()});        
       
        socket.emit("privatechat",chatObj);
        msg.val("");


    });

    const getChatObj = (chatDetails,msg) => {
        let {hostname,id} = chatDetails;
        return {hostname,id,msg};
    };

    
    $("ul[id='participantList']").click(e =>{
        if(e.target.nodeName =="LI"){
            $("#activeChat").text(e.target.id);
            $(e.target).find("span").remove();
            activeChatDetails = allParticipants.find(x=> x.hostname == e.target.id);
    
            populateOldChats(activeChatDetails);
            $("#chatbox").removeClass("invisible");
            
        }
        
    });

    socket.on("welcome",(arg) =>{
        
    });

    socket.on("participantin",(arg) =>{
        allParticipants.push(arg);
        participantList.append("<li id="+arg.hostname+" class='list-group-item'>"
        +"<img src='/node_modules/bootstrap-icons/icons/person-fill.svg' />"
        +arg.hostname+"</li>");
    });

    socket.on("participantout",(arg) =>{
        allParticipants = allParticipants.filter(x => x.hostname !=arg.hostname);
        $("#"+arg.hostname).remove();
    });

    socket.on("loggedinParticipant",(arg)=>{
        participantList.find("li").remove();
        allParticipants =  Object.keys(arg).map(x =>  { return {"hostname":x}});
        populateParticipantList(allParticipants);
    });

    socket.on("privatechat",(arg)=>{
        if(activeChatDetails.hostname ==arg.senderHostName){
            chats.append("<li class='chat-list-group-item-other'>"+arg.msg+"</li>");
           
        }else{
            participantList.find("li[id="+arg.senderHostName+"]").append('<span class="badge badge-primary badge-pill">New</span>');
        }

        populateRecievedChat(arg);
      
    });

    const  populateParticipantList = (arg) =>{ 
       arg.forEach(ele => {
            participantList.append("<li id="+ele.hostname+"  class='list-group-item'>"
          +"<img src='/node_modules/bootstrap-icons/icons/person-fill.svg' />"
            +ele.hostname+"</li>");
        });
    };

    const populateRecievedChat = async(arg) =>{

       let partipantDetail =  allParticipants.find(x => x.hostname == arg.senderHostName);
       if(partipantDetail.chat == undefined){
        partipantDetail['chat'] = []; 
       }
       
       partipantDetail.chat.push(arg);
    };

    const populateSentChat = async(arg) =>{

        let partipantDetail =  allParticipants.find(x => x.hostname == arg.hostname);
        if(partipantDetail.chat == undefined){
         partipantDetail['chat'] = []; 
        }
        
       partipantDetail.chat.push(arg);
    };

    const populateOldChats = (arg) =>{
       chats.find("li").remove();
       if(arg && arg.chat) {
           arg.chat.sort((a,b)=>{
            return a.timestamp > b.timestamp;
           });

           arg.chat.forEach(x=>{
                if(x.senderHostName){
                    chats.append("<li class='chat-list-group-item-other'>"+x.msg+"</li>");
                }else{

                    chats.append("<li class='chat-list-group-item'>"+x.msg+"</li>");
                }
           });
       }
    };

    const debounce = (func, delay) => {
        let debounceTimer
        return function() {
            const context = this
            const args = arguments
                clearTimeout(debounceTimer)
                    debounceTimer
                = setTimeout(() => func.apply(context, args), delay)
        }
    };
    
    $("#message").keyup(debounce(()=>{
        socket.emit("typing",{client:userName,reciever:activeChatDetails.hostname});
    },3000));

    socket.on("typing",(arg)=>{
        if(activeChatDetails.hostname == arg.client){
               $("#activechatStatus").text("Typing...");
                   setTimeout(()=>{
                $("#activechatStatus").text("Online");
                   },3000);
              
        }
    });

});