var preload = function(game){}

preload.prototype = {
	preload: function(){
    var loadingBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY,"loading");
    loadingBar.anchor.setTo(0.5,0.5);
    this.load.setPreloadSprite(loadingBar);
		//-------------Menu----------
    this.game.load.image("mute", "assets/mute.png");
    this.game.load.image("unmute", "assets/unmute.png");
		this.game.load.image("1player", "assets/1player_btn.png");
		this.game.load.image("2player", "assets/2player_btn.png");
		//------------Game-----------
		this.game.load.image("menu_btn", "assets/menu_btn.png");
    this.game.load.image("paddle", "assets/paddle.png");
    this.game.load.image("ball", "assets/white_ball.png");
    this.game.load.image("center_line", "assets/line.png");
    this.game.load.audio("music", "assets/music.wav");
    this.game.load.audio("pong_sound", "assets/pong.wav");
		//-----------Game over---------
		this.game.load.image("back_to_menu", "assets/back_to_menu.png");
		this.game.load.image("restart_btn", "assets/restart_btn.png");
	},
  	create: function(){
		this.game.state.start("Menu");

	}
}
