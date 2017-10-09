var multiplayerGameOver = function(game){
  var player_won_text;
  var menu_btn;
}

multiplayerGameOver.prototype = {
  create: function(){
    socket.disconnect();
    if(victory){
      player_won_text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "You won", {
        font: "64px Bauhaus 93",
        fill: "#ffffff",
        align: "center"
      });
    }else{
      player_won_text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "You lost", {
        font: "64px Bauhaus 93",
        fill: "#ffffff",
        align: "center"
      });
    }
    player_won_text.anchor.setTo(0.5,0.5);
    this.game.input.enabled = true;
    menu_btn = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 70, "back_to_menu");
    menu_btn.inputEnabled = true;
    menu_btn.events.onInputDown.add(function(){
      this.game.state.start("Menu");
    }, this);
    menu_btn.anchor.setTo(0.5);
	}
}
