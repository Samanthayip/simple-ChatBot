/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hey, Hello I am \"___*-\" a simple chat bot example."); //We start with the introduction;
  setTimeout(timedQuestion, 2500, socket,"What is your Name?"); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  answer= 'Hello ' + input + ' :-)';// output response
  waitTime =2000;
  question = 'Did you feel good today?';			    	// load next question
  }
  else if (questionNum == 1) {
    if(input.toLowerCase()==='yes'|| input===1){
      answer = 'That is awesome! I had a really nice day today too.';
      waitTime =2000;
      question = 'What did you do today?';
    }
    else if(input.toLowerCase()==='no'|| input===0){
    answer = 'I am sorry to hear that!';
    waitTime =2000;
    question = 'What happened?';
    questionNum = 3;
    }
    else{
      answer=' I did not understand you. Can you please answer with simply with \'yes\' or \'no?\''
      waitTime =2000;
      question = 'Did you feel good today?';
      questionNum--;
    }
  }
  else if (questionNum == 2) {
        answer = input + ' sounds fun! Well I had a great meal today, and that made my day :)';
        waitTime =2000;
        question = 'What else makes you happy?';
  }
  else if (questionNum == 3) {
    answer = input + ' makes me happy too! I am glad we share the same interest.';
    waitTime =3000;
    question = 'Who is the person who inspires you the most?';
    questionNum = 5
  }
  else if (questionNum == 4) {
    answer = 'I am sure things will work out!';
    waitTime =2000;
    question = 'Let us talk about happier things! What made you happy the past few days?';
  }
  else if (questionNum == 5) {
    answer = input + ' makes me happy too! I am glad we share the same interest.';
    waitTime =5000;
    question = 'Who is the person who inspires you the most?';
  }

  else if (questionNum == 6) {
      answer = 'Wow I am glad that ' + input + ' made a difference in your life! My sisters have always been mentors in my life.';
      waitTime =5000;
      question = 'Do you have any siblings?';
  }
  else if (questionNum == 7) {
    if(input.toLowerCase()==='yes'|| input===1){
      answer = 'Yay! Me too. Tell them a chatbot says hi!';
      question = 'Did you enjoy this conversation?';
      waitTime =2000;
    }
    else if(input.toLowerCase()==='no'|| input===0){
      answer = 'Oh, so you are an only child!';
      question = 'Did you enjoy this conversation?';
      waitTime =2000;
    }
    else{
      answer=' I did not understand you. Can you please answer with simply with yes or no.'
      question='Do you have any siblings?';
      questionNum--;
      waitTime =2000;
    }
  }
  // load next question
  else{
    answer= 'Sure. Well, I had so much fun talking to you! Hope to see you soon :)';// output response
    waitTime =0;
    question = '';
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
