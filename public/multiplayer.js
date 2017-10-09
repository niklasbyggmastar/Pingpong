var multiplayer = function(game){
  var paddle1;
  var paddle2;
  var ball;
  var ball_launched;
  var ball_velocity;
  var score1_text;
  var score2_text;
  var score1;
  var score2;
  var goal_score;
  var center_line;
  var dist_on_paddle;
  var socket;
  var waiting_text;
  var player_num;
  var victory;
  var menu_btn;
  var me;
  var back_to_menu;
  var game_is_full;
  var opponent_socket_id;
}

multiplayer.prototype = {

  create: function(){
    music.stop();
    socket = io.connect();
    player_num = 0;
    me = this;

    socket.on("new_score1", function(score){
        score1 = score;
        console.log("s1: " + score1);
    });
    socket.on("new_score2", function(score){
        score2 = score;
        console.log("s2: " + score2);
    });


    center_line = this.game.add.sprite(this.game.world.centerX, 0, "center_line");
    center_line.anchor.setTo(0.5, 0);
    center_line.scale.setTo(1, 1.5);
    paddle1 = this.create_paddle(0, this.game.world.centerY);
    paddle2 = this.create_paddle(this.game.world.width - 6.4, this.game.world.centerY);
    ball = this.create_ball(this.game.world.centerX, this.game.world.centerY);
    ball_launched = false;
    ball_velocity = 400;
    score1 = 0;
    score2 = 0;
    goal_score = 10;
    this.game.input.onDown.add(this.launch_ball, this);

    score1_text = this.game.add.text(150, 60, "0", {
      font: "64px Bauhaus 93",
      fill: "#ffffff",
      align: "center"
    });
    score1_text.anchor.setTo(0.5);
    score2_text = this.game.add.text(this.game.world.width - 150, 60, "0", {
      font: "64px Bauhaus 93",
      fill: "#ffffff",
      align: "center"
    });
    score2_text.anchor.setTo(0.5);
    waiting_text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Waiting for other player...", {
      font: "32px Bauhaus 93",
      fill: "red",
      align: "center",
    });
    waiting_text.anchor.setTo(0.5);

    socket.on("game_full", function(){
      game_is_full.visible = true;
      me.game.time.events.add(Phaser.Timer.SECOND * 5, function(){
          me.game.input.enabled = true;
          me.game.state.start("Menu", true, false);
        }, me);
    });

    game_is_full = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Game is full\nplease try again later", {
      font: "64px Bauhaus 93",
      fill: "#ffffff",
      align: "center",
      backgroundColor: "rgb(51,51,51)"
    });
    game_is_full.anchor.setTo(0.5);
    game_is_full.visible = false;

  },

  update: function(){

    socket.on("players_online", function(players, user_disconnected){

      if (players.indexOf(socket.id) == 0) {
        player_num = 1;
        if (players.length < 2) {
          waiting_text.visible = true;
          me.game.input.enabled = false;
        }else{
          waiting_text.visible = false;
          me.game.input.enabled = true;
          opponent_socket_id = players[1];  //opponent_socket_id serverin tietoon!
        }
      }else if (players.indexOf(socket.id) == 1) {
        player_num = 2;
        waiting_text.visible = false;
        opponent_socket_id = players[0];
      }

//-----------------------------------------------------------
      if(players.length == 1 && user_disconnected){                         //user has disconnected --> menu
        me.game.input.enabled = false;
        waiting_text.text = "Player has disconnected";
        waiting_text.visible = true;

        me.game.time.events.add(Phaser.Timer.SECOND * 5, function(){
            me.game.input.enabled = true;
            me.game.state.start("Menu", true, false);
            socket.disconnect();
          }, me);
      }
    });



    socket.on("you_lost", function(){
      victory = false;
      me.game.state.start("multiplayerGameOver", true, false, victory);
    });
    socket.on("you_won", function(){
      victory = true;
      me.game.state.start("multiplayerGameOver", true, false, victory);
    });

    socket.emit("moving_ball", ball.x ,ball.y);
    var playSound = function(){
      me.game.sound.play("pong_sound");
    }
    score1_text.text = score1;
    score2_text.text = score2;
    if (player_num == 1) {
      this.control_paddle(paddle1, this.game.input.y);
    }else if (player_num == 2) {
      this.control_paddle(paddle2, this.game.input.y);
    }

    this.game.physics.arcade.collide(paddle1, ball, this.pointOnPaddle, playSound);
    this.game.physics.arcade.collide(paddle2, ball, this.pointOnPaddle, playSound);
    if (ball.body.blocked.left) {
      score2 += 1;
      ball.body.velocity.setTo(0,0);
      ball.x = this.game.world.centerX;
      ball.y = this.game.world.centerY;
      ball_launched = false;
      socket.emit("inc_score2", score2);
      if(score2 == goal_score){
        if (player_num == 2) {
          victory = true;
          this.game.state.start("multiplayerGameOver", true, false, victory); //Player 2 wins
          socket.emit("you_lost");
        }else if (player_num == 1) {           //Player 1 loses
          victory = false;
          me.game.state.start("multiplayerGameOver", true, false, victory);
          socket.emit("you_won");
        }
      }
    }else if (ball.body.blocked.right) {
      score1 += 1;
      ball.body.velocity.setTo(0,0);
      ball.x = this.game.world.centerX;
      ball.y = this.game.world.centerY;
      ball_launched = false;
      socket.emit("inc_score1", score1);
      if(score1 == goal_score){
        if (player_num == 1) {
          victory = true;
          this.game.state.start("multiplayerGameOver", true, false, victory); //Player 1 wins
          socket.emit("you_lost");
        }else if (player_num == 2){             //Player 2 loses
          victory = false;
          me.game.state.start("multiplayerGameOver", true, false, victory);
          socket.emit("you_won");
        }
      }
    }

    socket.on("paddle_move", function(y){
      if (player_num == 1) {
        paddle2.y = y;
      }else if (player_num == 2) {
        paddle1.y = y;
      }
    });

    socket.on("ball_move", function(x,y){
      ball.x = x;
      ball.y = y;
    });

    ball.body.maxVelocity.setTo(420,400);
  },

  pointOnPaddle: function(paddle){
    if(paddle == paddle1){
      if (ball.y < paddle.y) {   //pallo korkeammalla/vasemmalla
        dist_on_paddle = (paddle.y - ball.y)/4;
        ball.body.velocity.y = -50*dist_on_paddle;
      }
      else if (ball.y > paddle.y) {  //pallo alempana/oikealla
        dist_on_paddle = (ball.y - paddle.y)/4;
        ball.body.velocity.y = 50*dist_on_paddle;
      }
    }
    else if (paddle == paddle2) {
      if (ball.y < paddle.y) { //pallo korkeammalla/oikealla
        dist_on_paddle = (paddle.y - ball.y)/4;
        ball.body.velocity.y = -50*dist_on_paddle;
      }
      else if (ball.y > paddle.y) { //pallo alempana/vasemmalla
        dist_on_paddle = (ball.y - paddle.y)/4;
        ball.body.velocity.y = 50*dist_on_paddle;
      }
    }

  },

  create_paddle: function(x,y){
    var paddle = this.game.add.sprite(x,y,"paddle");
    paddle.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enable(paddle);
    paddle.body.collideWorldBounds = true;
    paddle.body.immovable = true;
    paddle.scale.setTo(0.4, 0.3);
    return paddle;
  },

  create_ball: function(x,y){
    var ball = this.game.add.sprite(x,y,"ball");
    ball.anchor.setTo(0.5);
    this.game.physics.arcade.enable(ball);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1,1);
    return ball;
  },

  control_paddle: function(paddle, y){
    paddle.y = y;
    if (paddle.y < paddle.height/2) {
      paddle.y = paddle.height/2;
    }else if (paddle.y > this.game.world.height - paddle.height/2) {
      paddle.y = this.game.world.height - paddle.height/2;
    }
    socket.emit("move_paddle", paddle.y);
  },

  launch_ball: function(){
    if (!ball_launched) {
      ball.body.velocity.x = -ball_velocity;
      ball.body.velocity.y = ball_velocity;
      ball_launched = true;
    }
  }

} //prototype
