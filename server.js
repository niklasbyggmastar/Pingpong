var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 8000, function(){
  var host = server.address().address;
  var port = server.address().port;
});
var players = [];

app.use(express.static('public'));
console.log("Server is running on 8000...");
var io = require('socket.io')(server);

io.sockets.on('connection', function(socket){
  if (players.length < 2) {
    players.push(socket.id);
  }else{
    socket.emit("game_full");
    console.log("Game is full");
  }
  console.log('online: ' + players);
  io.emit("players_online", players);

  socket.on("disconnect", function(socket){
    var index = players.indexOf(socket.id);
    players.splice(index, 1);
    if (index != -1) {      //kolmas pelaaja lähtee -> muiden peli keskeytyy! 
      console.log('online: ' + players);
      var user_disconnected = true;
      io.emit("players_online", players, user_disconnected);
    }
    console.log("index: " + index);
  });

  socket.on("move_paddle", function(y){
    socket.broadcast.emit("paddle_move", y);
  });

  socket.on("moving_ball",function(x,y){
    socket.broadcast.emit("ball_move", x, y);
  });

  socket.on("inc_score1", function(score){
    socket.broadcast.emit("new_score1", score);
  });

  socket.on("inc_score2", function(score){
    socket.broadcast.emit("new_score2", score);
  });

  socket.on("you_lost", function(){
    socket.broadcast.emit("you_lost");
  });
  socket.on("you_won", function(){
    socket.broadcast.emit("you_won");
  });

});
