var menu = function(game){
  var label;
  var singlePlayerBtn;
  var multiPlayerBtn;
  var muteButton;
  var unmuteButton;
  var music;
}

menu.prototype = {
  create: function(){
    music = this.game.add.audio('music');
    music.loop = true;
    music.play();

    this.game.sound.mute = false;
    label = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 60, "Ping Pong", {
      font: "64px Bauhaus 93",
      fill: "#ffffff",
      align: "center"
    });
    label.anchor.setTo(0.5,0.5);

    singlePlayerBtn = this.game.add.sprite(this.game.world.centerX - 100, this.game.world.centerY + 30,"1player");
    singlePlayerBtn.inputEnabled = true;
    singlePlayerBtn.events.onInputDown.add(function(){
      this.game.state.start("TheGame");
    }, this);
  	singlePlayerBtn.anchor.setTo(0.5,0.5);

    multiPlayerBtn = this.game.add.sprite(this.game.world.centerX + 100, this.game.world.centerY + 30,"2player");
    multiPlayerBtn.inputEnabled = true;
    multiPlayerBtn.events.onInputDown.add(function(){
      this.game.state.start("Multiplayer");
    }, this);
  	multiPlayerBtn.anchor.setTo(0.5,0.5);

    unmuteButton = this.game.add.sprite(0, 0, "unmute");
    unmuteButton.inputEnabled = true;
    unmuteButton.events.onInputDown.add(function(){
      this.game.sound.mute = true;
      unmuteButton.visible = false;
      muteButton.visible = true;
    }, this);

    muteButton = this.game.add.sprite(0, 0 ,"mute");
    muteButton.visible = false;
    muteButton.inputEnabled = true;
    muteButton.events.onInputDown.add(function(){
      this.game.sound.mute = false;
      muteButton.visible = false;
      unmuteButton.visible = true;
    }, this);
  },

}
