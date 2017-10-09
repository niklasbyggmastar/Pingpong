var thegame = function(game){
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
  var menu_btn;
}

thegame.prototype = {
  create: function(){

    music.stop();

    menu_btn = this.game.add.sprite(0, 0,"menu_btn");
    menu_btn.inputEnabled = true;
    menu_btn.events.onInputDown.add(function(){
      this.game.state.start("Menu");
    }, this);
  	menu_btn.scale.setTo(0.35);

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

  },

  update: function(){
    var me = this;
    var playSound = function(){
      me.game.sound.play("pong_sound");
    }

    score1_text.text = score1;
    score2_text.text = score2;
    this.control_paddle(paddle1, this.game.input.y);
    this.game.physics.arcade.collide(paddle1, ball, this.pointOnPaddle, playSound);
    this.game.physics.arcade.collide(paddle2, ball, this.pointOnPaddle, playSound);
    if (ball.body.blocked.left) {
      score2 += 1;
      ball.body.velocity.setTo(0,0);
      ball.x = this.game.world.centerX;
      ball.y = this.game.world.centerY;
      ball_launched = false;
      if(score2 == goal_score){
        this.game.state.start("GameOver", true, false, score1, score2);
      }
    }else if (ball.body.blocked.right) {
      score1 += 1;
      ball.body.velocity.setTo(0,0);
      ball.x = this.game.world.centerX;
      ball.y = this.game.world.centerY;
      ball_launched = false;
      if(score1 == goal_score){
        this.game.state.start("GameOver", true, false, score1, score2);
      }
    }


    if(ball.y > paddle2.y || (ball.body.velocity.y > 0 && ball.x > this.game.world.width - 50)){
      paddle2.body.velocity.y = 350;
    }
    else if (ball.y < paddle2.y || (ball.body.velocity.y < 0 && ball.x > this.game.world.width - 50)) {
      paddle2.body.velocity.y = -350;
    }

    if (ball.body.velocity.x < 0 || ball.x < this.game.world.width/2 + 30){
      this.game.physics.arcade.moveToXY(paddle2, this.game.world.width - 6.4, this.game.world.centerY, 200);
    }
    if (ball.body.velocity.x == 0){
      paddle2.body.velocity.y = 0;
    }
    paddle2.body.velocity.x = 0;
    paddle2.body.maxVelocity.y = 350;
    ball.body.maxVelocity.setTo(400,400);
  },

  pointOnPaddle: function(paddle){
    if(paddle == paddle1){
      if (ball.y < paddle.y) {   //pallo korkeammalla/vasemmalla
        dist_on_paddle = (paddle.y - ball.y)/4;
      //  ball.body.velocity.x = ball_velocity/dist_on_paddle;
        ball.body.velocity.y = -50*dist_on_paddle;
      }
      else if (ball.y > paddle.y) {  //pallo alempana/oikealla
        dist_on_paddle = (ball.y - paddle.y)/4;
      //  ball.body.velocity.x = ball_velocity/dist_on_paddle;
        ball.body.velocity.y = 50*dist_on_paddle;
      }
    }
    else if (paddle == paddle2) {
      if (ball.y < paddle.y) { //pallo korkeammalla/oikealla
        dist_on_paddle = (paddle.y - ball.y)/4;
    //    ball.body.velocity.x = -ball_velocity/dist_on_paddle;
        ball.body.velocity.y = -50*dist_on_paddle;
      }
      else if (ball.y > paddle.y) {
        dist_on_paddle = (ball.y - paddle.y)/4;  //pallo alempana/vasemmalla
    //    ball.body.velocity.x = -ball_velocity/dist_on_paddle;
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
    ball.scale.setTo(0.8);
    return ball;
  },

  control_paddle: function(paddle, y){
    paddle.y = y;
    if (paddle.y < paddle.height/2) {
      paddle.y = paddle.height/2;
    }else if (paddle.y > this.game.world.height - paddle.height/2) {
      paddle.y = this.game.world.height - paddle.height/2;
    }
  },

  launch_ball: function(){
    if (!ball_launched) {
      ball.body.velocity.x = -ball_velocity;
      ball.body.velocity.y = ball_velocity;
      ball_launched = true;
    }
  }
} //prototype
