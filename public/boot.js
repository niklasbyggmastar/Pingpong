var boot = function(game){
	console.log("%cPing Pong is starting!", "color:white; background:red");
};

boot.prototype = {
	preload: function(){
    this.game.load.image("loading","assets/loading.png");
	},
  create: function(){
		this.game.state.start("Preload");
	}
}
