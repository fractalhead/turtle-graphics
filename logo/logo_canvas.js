// Turtle Graphics (c) Joby Bednar 2009

var logo = {
	//Variables
	vars : {
		curAngle : 0,
		curPos : {x:400,y:300},
		penDown : true,
		penColor : 'FFF',
		turtle : null,
		screen : null,
		cmdQueue : [],
		tmpQueue : [],
		funcQueue : {},
		varQueue : {},
		varStack : [],
		stateStack : [],
		varFuncQueue : {
			'RAND' : function(){
				return Math.floor(Math.random()*101);
			},
			'RANDANGLE' : function(){
				return Math.floor(Math.random()*360);
			},
			'POP' : function(){
				if(logo.vars.varStack.length > 0){
					var v = logo.vars.varStack.shift();
					logo.updateStackDisplay();
					return v;
				} else {
					logo.updateStackDisplay();
					return 0;
				}
			}
		},
		cmdLineIdx : 0,
		cmdLineQueue : [],
		timer : null,
		defaultFunctions : {
			'SQUARE':'RP 4 [FD 100 RT 90]',
			'STAR':'RP 5 [FD 200 RT 144]',
			'STARS':'RP 10 [RT 36 STAR]',
			'LOTUS':'RP 18 [RP 16 [FD 30 RT 20] RT 20]'
		}
	},
	
	//Parsing Command Functions
	cmd : function(){
		var cmdstr = $.trim($('#cmd').val().toUpperCase());
		$('#cmd').val('Processing...').attr('disabled','disabled');
		cmdstr = cmdstr.replace(/[^A-Z0-9\[\]\s]/g, '');
		cmdstr = cmdstr.replace(/\[/g, ' [');
		cmdstr = $.trim(cmdstr.replace(/\s{2,}/g, ' '));
		if(cmdstr.length > 0){
			this.vars.cmdLineQueue.unshift(cmdstr);
			if(this.vars.cmdLineQueue.length > 50) this.vars.cmdLineQueue.pop();
			this.vars.cmdLinePointer = 0;
			this.vars.cmdQueue = [];
			this.tokenize(cmdstr);
		}
	},
	tokenize : function(str){
		//tokenize
		this.vars.tmpQueue = [];
		var cmdstr = str;
		cmdstr = $.trim(cmdstr.replace(/\s{2,}/g, ' '));
		var token = '';
		for(var i=0; i<cmdstr.length; i++){
			if(cmdstr[i]==' '){
				this.vars.tmpQueue.push(token);
				token = '';
			} else if(cmdstr[i]=='['){
				var counter = 1;
				++i;
				while(i < cmdstr.length && counter != 0){
					if(cmdstr[i]=='['){
						counter += 1;
						token += cmdstr[i];
					}else if(cmdstr[i]==']'){
						counter -= 1;
						if(counter==0){
							this.vars.tmpQueue.push(token);
							token = '';
						}else{
							token += cmdstr[i];
						}
					}else{
						token += cmdstr[i];
					}
					++i;
				}
			} else {
				token += cmdstr[i];
			}
		}
		if(token.length) this.vars.tmpQueue.push(token);
		while(this.vars.tmpQueue.length > 0){
			this.vars.cmdQueue.unshift(this.vars.tmpQueue.pop());
		}
		this.processCmds();
	},
	processCmds : function(){
		if(this.vars.timer != null) clearTimeout(this.vars.timer);
		if(this.vars.cmdQueue.length != 0){
			var cmd = this.vars.cmdQueue.shift();
			switch(cmd){
				case 'NULL': break; //do nothing
				case 'SAVE':
				case 'RESTORE':
				case 'CL':
				case 'H': 
				case 'PU': 
				case 'PD': this.exec(cmd); break;
				case 'PC': this.exec(cmd, this.vars.cmdQueue.shift()); break;
				case 'FD': 
				case 'BK': 
				case 'RT': 
				case 'LT': this.exec(cmd, parseInt(this.getVariableValue(this.vars.cmdQueue.shift()))); break;
				case 'RP':
				case 'REPEAT':
					var times = parseInt(this.getVariableValue(this.vars.cmdQueue.shift()));
					var block = this.vars.cmdQueue.shift();
					for(var i=0; i<times; i++){
						this.vars.cmdQueue.unshift(block);
					}
					break;
				case 'TO':
					var vname = this.vars.cmdQueue.shift();
					var block = this.vars.cmdQueue.shift();
					this.makeFunction($.trim(vname), $.trim(block));
					break;
				case 'SET':
				case 'ADD':
				case 'DIV':
				case 'MULT':
				case 'PRCNT':
				case 'SUB': this.exec(cmd, this.vars.cmdQueue.shift(), this.vars.cmdQueue.shift()); break;
				case 'IFNZ':
					var val = parseInt(this.getVariableValue(this.vars.cmdQueue.shift()));
					var block1 = this.vars.cmdQueue.shift();
					var block2 = this.vars.cmdQueue.shift();
					if(val != 0){
						this.vars.cmdQueue.unshift(block1);
					} else {
						this.vars.cmdQueue.unshift(block2);
					}
					break;
				case 'IFEQ':
					var val = parseInt(this.getVariableValue(this.vars.cmdQueue.shift()));
					var val2 = parseInt(this.getVariableValue(this.vars.cmdQueue.shift()));
					var block1 = this.vars.cmdQueue.shift();
					var block2 = this.vars.cmdQueue.shift();
					if(val == val2){
						this.vars.cmdQueue.unshift(block1);
					} else {
						this.vars.cmdQueue.unshift(block2);
					}
					break;
				case 'IFGT':
					var val = parseInt(this.getVariableValue(this.vars.cmdQueue.shift()));
					var val2 = parseInt(this.getVariableValue(this.vars.cmdQueue.shift()));
					var block1 = this.vars.cmdQueue.shift();
					var block2 = this.vars.cmdQueue.shift();
					if(val > val2){
						this.vars.cmdQueue.unshift(block1);
					} else {
						this.vars.cmdQueue.unshift(block2);
					}
					break;
				case 'IFGTE':
					var val = parseInt(this.getVariableValue(this.vars.cmdQueue.shift()));
					var val2 = parseInt(this.getVariableValue(this.vars.cmdQueue.shift()));
					var block1 = this.vars.cmdQueue.shift();
					var block2 = this.vars.cmdQueue.shift();
					if(val >= val2){
						this.vars.cmdQueue.unshift(block1);
					} else {
						this.vars.cmdQueue.unshift(block2);
					}
					break;
				case 'PUSH': this.exec(cmd, this.vars.cmdQueue.shift()); break;
				default :
					var cmdarr = cmd.split(' ');
					if(cmdarr.length > 1){
						this.tokenize(cmd);
					} else {//assuming a function
						if(cmd in this.vars.funcQueue){
							this.vars.cmdQueue.unshift(this.vars.funcQueue[cmd]);
						} else if (cmd in this.vars.varFuncQueue){//function variable
							this.vars.cmdQueue.unshift(this.vars.varFuncQueue[cmd]().toString());
						}
					}
					break;
			};
			this.vars.timer = setTimeout("logo.processCmds()",1);
		} else {
			$('#cmd').val('').removeAttr('disabled').focus();
		}
	},
	exec : function(cmd, val, val2){
		switch(cmd){
			case 'CL': this.clearScreen(); break;
			case 'H': this.moveTurtleHome(); break; 
			case 'PU': this.penUp(); break;
			case 'PD': this.penDown(); break;
			case 'PC': this.penColor(val); break;
			case 'FD': this.moveTurtle('forward', val); break;
			case 'BK': this.moveTurtle('backward', val); break;
			case 'RT': this.turnTurtle('right', val); break;
			case 'LT': this.turnTurtle('left', val); break;
			case 'SET': this.setVariable(val, val2); break;
			case 'ADD': this.addVariable(val, val2); break;
			case 'SUB': this.subVariable(val, val2); break;
			case 'MULT': this.multVariable(val, val2); break;
			case 'DIV': this.divVariable(val, val2); break;
			case 'PRCNT': this.percentVariable(val, val2); break;
			case 'PUSH': this.push(val); break;
			case 'SAVE': this.saveState(); break;
			case 'RESTORE': this.restoreState(); break;
		};
	},
	makeFunction : function(vname, block){
		if(vname in this.vars.funcQueue){
			this.vars.funcQueue[vname] = block;
			var funcObj = $('#funct_'+vname);
			funcObj.text(vname+' : '+block);
			funcObj.click(function(){
				$('#cmd').val(block).focus();
			});
			$('#functs').scrollTop(funcObj.position().top);
		} else {
			this.vars.funcQueue[vname] = block;
			var funcObj = $('<button class="funct" id="funct_'+vname+'">'+vname+' : '+block+'</button>');
			funcObj.click(function(){
				$('#cmd').val(block).focus();
			});
			funcObj.appendTo('#functs');
			$('#functs').scrollTop($('#functs').innerHeight());
		}
	},
	getVariableValue : function(v){
		if(/[A-Z]/.test(v)){//variable
			if(v in this.vars.varQueue){
				return this.vars.varQueue[v].toString();
			} else if(v in this.vars.varFuncQueue){//function variable
				return this.vars.varFuncQueue[v]().toString();
			} else {
				return "0";
			}
		} else {//number
			return v;
		}
	},
	setVariable : function(v, val){
		var vals = this.getVariableValue(val);
		if(!(v in this.vars.varQueue)){
			var varObj = $('<span class="stats" id="var_'+v+'">'+v+' : '+vals+'</span>');
			varObj.appendTo('#screen_bg');
		}
		this.vars.varQueue[v] = parseInt(vals);
		$('#var_'+v).text(v+' : '+this.vars.varQueue[v]);
	},
	addVariable : function(v, val){
		this.vars.varQueue[v] += parseInt(this.getVariableValue(val));
		$('#var_'+v).text(v+' : '+this.vars.varQueue[v]);
	},
	subVariable : function(v, val){
		this.vars.varQueue[v] -= parseInt(this.getVariableValue(val));
		$('#var_'+v).text(v+' : '+this.vars.varQueue[v]);
	},
	multVariable : function(v, val){
		this.vars.varQueue[v] *= parseInt(this.getVariableValue(val));
		$('#var_'+v).text(v+' : '+this.vars.varQueue[v]);
	},
	divVariable : function(v, val){
		var vl = parseInt(this.getVariableValue(val));
		if(vl != 0) this.vars.varQueue[v] /= vl;
		else this.vars.varQueue[v] = 0;
		$('#var_'+v).text(v+' : '+this.vars.varQueue[v]);
	},
	percentVariable : function(v, val){
		var vl = parseInt(this.getVariableValue(val));
		this.vars.varQueue[v] *= vl;
		this.vars.varQueue[v] /= 100;
		$('#var_'+v).text(v+' : '+this.vars.varQueue[v]);
	},
	push : function(val){
		var v = parseInt(this.getVariableValue(val));
		this.vars.varStack.unshift(v);
		this.updateStackDisplay();
	},
 	saveState : function(){
		var state = {
			curAngle : this.vars.curAngle,
			curPos : this.vars.curPos,
			penColor : this.vars.penColor
		};
		this.vars.stateStack.unshift(state);
		this.updateStateDisplay();
	},
	restoreState : function(){
		if(this.vars.stateStack.length > 0){
			var state = this.vars.stateStack.shift();
			this.vars.curAngle = state.curAngle;
			this.vars.curPos = state.curPos;
			this.vars.penColor = state.penColor;
			this.drawTurtle();
			this.updateStateDisplay();
		}
	},
	updateStackDisplay : function(){
		if($('#var_stack').get().length==0){
			var stackObj = $('<span class="stats" id="var_stack">[stack] : [' + this.vars.varStack.toString().replace(',',', ') + ']</span>');
			stackObj.prependTo('#screen_bg');
		} else {
			$('#var_stack').text('[stack] : ['+this.vars.varStack.toString()+']');
		}
	},
	updateStateDisplay : function(){
		if($('#state_stack').get().length==0){
			var stackObj = $('<span class="stats" id="state_stack">[state] : [' + this.vars.stateStack.length + ' states]</span>');
			stackObj.prependTo('#screen_bg');
		} else {
			$('#state_stack').text('[state] : [' + this.vars.stateStack.length + ' states]');
		}
	},
	exportFunctions : function(){
		var funcStr = '';
		var f = null;
		for(f in this.vars.funcQueue){
			if(!(f in this.vars.defaultFunctions)) funcStr += 'TO '+f+' ['+this.vars.funcQueue[f]+'] '
		}
		if(funcStr.length == 0){
			alert("You need to create custom functions first.\nTO {function name} [commands...] will create custom functions.");
		} else {
			prompt("Copy and Paste your functions for later use:", $.trim(funcStr));
		}
	},
	cmdEventListener : function(e){
		var c = '';
		if (e.which == null) c = e.keyCode;// IE
		else if (e.which > 0) c = e.which;
		if(c == 38 || c == 40){
			$('#cmd').val(logo.vars.cmdLineQueue[logo.vars.cmdLineIdx]);
			if(c == 38){//up arrow
				logo.vars.cmdLineIdx++;
			}else{
				logo.vars.cmdLineIdx--;
			}
			if(logo.vars.cmdLineIdx >= logo.vars.cmdLineQueue.length) logo.vars.cmdLineIdx = logo.vars.cmdLineQueue.length-1;
			if(logo.vars.cmdLineIdx < 0){
				logo.vars.cmdLineIdx = 0;
			}
		}
	},
	
	//Turtle Functions
	drawTurtle : function(ang){
		if(ang != null) this.setTurtleAngle(ang);
		var turtle = this.vars.turtle;
		var curAngle = this.vars.curAngle;
		turtle.clearRect(0,0,turtle.canvas.width,turtle.canvas.height);
		turtle.strokeStyle = "#FFF";
		turtle.fillStyle = "#8A8";
		turtle.beginPath();
		xs = []; ys = [];
		angs = [0,120,180,240,0];
		lens = [10,10,2,10,10];
		for(var i=0; i<5; i++){
			xs[i] = Math.round(Math.cos((angs[i]-90+curAngle)*3.14159/180)*lens[i])+11;
			ys[i] = Math.round(Math.sin((angs[i]-90+curAngle)*3.14159/180)*lens[i])+11;
		}
		turtle.moveTo(xs[0],ys[0]);
		for(var i=1; i<5; i++){
			turtle.lineTo(xs[i],ys[i]);
		}
		turtle.fill();
		turtle.stroke();
		$('#turtle').css('top', this.vars.curPos.y-11+'px').css('left', this.vars.curPos.x-11+'px');
	},
	setTurtlePos : function(x, y) {
		this.vars.curPos = {x:x,y:y};
	},
	setTurtleAngle : function(ang) {this.vars.curAngle = ang;},
	turnTurtle : function(dir, ang) {
		if(dir == 'right'){
			this.setTurtleAngle(this.vars.curAngle+ang);
		}else{
			this.setTurtleAngle(this.vars.curAngle-ang);
		}
		this.drawTurtle();
		return this.vars.curAngle;
	},
	moveTurtle : function(dir, dist){
		var curPos = this.vars.curPos;
		var curAngle = this.vars.curAngle;
		var xdiff = Math.cos((curAngle-90)*3.14159/180)*dist;
		var ydiff = Math.sin((curAngle-90)*3.14159/180)*dist;
		if(dir == 'forward'){
			this.setTurtlePos(curPos.x+xdiff, curPos.y+ydiff);
		}else{
			this.setTurtlePos(curPos.x-xdiff, curPos.y-ydiff);
		}
		if(this.vars.penDown){
			var scrn = this.vars.screen;
			scrn.strokeStyle = this.getPenColor();
			scrn.lineWidth = 1;
			scrn.lineJoin = 'round';
			scrn.beginPath();
			scrn.moveTo(curPos.x, curPos.y);
			scrn.lineTo(this.vars.curPos.x, this.vars.curPos.y);
			scrn.stroke();
		} else {
			var scrn = this.vars.screen;
			scrn.moveTo(this.vars.curPos.x, this.vars.curPos.y);
		}
		this.drawTurtle();
		return {x:this.vars.curPos.x,y:this.vars.curPos.y};
	},
	moveTurtleHome : function(){
		this.setTurtlePos(400, 300);
		this.setTurtleAngle(0);
		this.penDown();
		this.drawTurtle();
	},
	
	//Pen Functions
	penUp : function(){ this.vars.penDown = false; return this.vars.penDown},
	penDown : function(){ this.vars.penDown = true; return this.vars.penDown},
	clearScreen : function(){ 
		this.vars.varQueue = {};
		this.vars.varStack = [];
		this.vars.stateStack = [];
		$('#screen_bg SPAN.stats').remove();
		this.penDown();
		this.penColor('FFF');
		this.vars.screen.clearRect(0,0,this.vars.screen.canvas.width,this.vars.screen.canvas.height);
	},
	penColor : function(color){
		this.vars.penColor = color;
	},
	getPenColor : function(){
		var pc = this.vars.penColor;
		if(/^([0-9A-F]{3}){1,2}$/.test(pc)){
			return '#'+pc;
		}else if(/^([0-9A-F]{8})$/.test(pc)){
			var R = parseInt(pc[0]+pc[1],16);
			var G = parseInt(pc[2]+pc[3],16);
			var B = parseInt(pc[4]+pc[5],16);
			var A = parseInt(pc[6]+pc[7],16)/255;
			return 'rgba('+R+','+G+','+B+','+A+')';
		}else{
			return pc;
		}
	},
	
	createGallery : function(fname){
		var gallery = $('<a href="#" id="gallery_'+fname+'" title="'+fname+'"><img src="logo/'+fname+'.png" alt="'+fname+'" width="60" height="60" border="0" /></a>');
		var cmd = $.trim($.ajax({url: "logo/"+fname+".txt", dataType:'text', async: false}).responseText);
		gallery.click(function(){
			$('#cmd').val(cmd);
			logo.cmd();
		});
		gallery.appendTo('#gallery');
	},
	
	//INIT
	init : function(){
		this.vars.turtle = $('#turtle').get(0).getContext('2d');
		this.vars.screen = $('#screen_gfx').get(0).getContext('2d');
		this.drawTurtle();
	}
};

$(function(){
	if($.browser.msie){
		$('#iesupport').show();
	} else {
	logo.init();
		$('#cmd').keyup(logo.cmdEventListener);
		logo.makeFunction('SQUARE', logo.vars.defaultFunctions['SQUARE']);
		logo.makeFunction('STAR', logo.vars.defaultFunctions['STAR']);
		logo.makeFunction('STARS', logo.vars.defaultFunctions['STARS']);
		logo.makeFunction('LOTUS', logo.vars.defaultFunctions['LOTUS']);
		$('<hr/>').appendTo('#functs');
		logo.createGallery('tiles');
		logo.createGallery('burst');
		logo.createGallery('tree');
		logo.createGallery('boxes');
		logo.createGallery('sierpinski');
		logo.createGallery('brownianfractal');
		logo.createGallery('koch');
		logo.createGallery('dragoncurve');
		logo.createGallery('plant');
		logo.createGallery('hilbertcurve');
		logo.createGallery('orbit');
		$('#cmd').focus();
	}
});