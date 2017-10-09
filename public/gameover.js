var gameover = function(game){
  var player_won_text;
  var restart_btn;
  var menu_btn;
}

gameover.prototype = {
  create: function(){
    if(score1 > score2){
      player_won_text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "You won", {
        font: "64px Bauhaus 93",
        fill: "#ffffff",
        align: "center"
      });
    }else{
      player_won_text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Computer won", {
        font: "64px Bauhaus 93",
        fill: "#ffffff",
        align: "center"
      });
    }
    player_won_text.anchor.setTo(0.5,0.5);

    restart_btn = this.game.add.sprite(this.game.world.centerX - 100, this.game.world.centerY + 70, "restart_btn");
    restart_btn.inputEnabled = true;
    restart_btn.events.onInputDown.add(function(){
      this.game.state.start("TheGame");
    }, this);
    restart_btn.anchor.setTo(0.5);
    menu_btn = this.game.add.sprite(this.game.world.centerX + 100, this.game.world.centerY + 70, "back_to_menu");
    menu_btn.inputEnabled = true;
    menu_btn.events.onInputDown.add(function(){
      this.game.state.start("Menu");
    }, this);
    menu_btn.anchor.setTo(0.5);
	}
}
