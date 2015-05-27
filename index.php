<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>DigTrig.com - Turtle Graphics</title>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
<script type="text/javascript" src="logo/logo_canvas.js"></script>
<style>
body {font-family:'Lucida Casual','Comic Sans MS',verdana;font-size:10px;margin:0px;padding:0px;}
#title {font-size:28px;font-weight:bold;text-align:right;float:right;padding-right:20px;}
#title div {font-size:18px;}
#stain {z-index:10;width:371px;height:400px;position:absolute;top:-150px;left:500px;background:url('images/stain.png');opacity:0.5;filter:alpha(opacity=5);}
#menu {font-size:21px;font-weight:bold;}
#menu li a {text-decoration:none;}
#menu li span {font-size:14px;color:#555;}

#screen {
	border:solid 2px black;
	position:absolute;
	top:-1px;
	left:-1px;
	height:600px;
	width:800px;
	z-index:10;
	overflow:hidden;
	clip:rect(auto, auto, auto, auto);
}
#screen_gfx {
	border:none;
	position:absolute;
	top:0px;
	left:0px;
}
#screen_bg {
	background-color:#000;
	border:none;
	opacity:0.5;
	filter:alpha(opacity=5);
	position:absolute;
	top:0px;
	left:0px;
	height:600px;
	width:800px;
}
SPAN.stats {
	padding:10px 0 0 10px;
	font-family:Lucida Console, Monaco, monospace;
	font-size:9px;
	color:#999;
	display:block;
}
#turtle {
	position:absolute;
	top:289px;
	left:389px;
	border:none;
}
#controls {
	background-color:#888;
	border:solid 2px black;
	position:absolute;
	top:600px;
	left:0px;
	height:auto;
	width:799px;
}
#controls #cmd {
	width:760px;
	height:30px;
	text-align:middle;
	font-size:18px;
	font-family:Lucida Console, Monaco, monospace;
	margin:5px 0 0 18px;
	border:solid 1px navy;
}
#controls #instructions {
	width:760px;
	text-align:middle;
	font-size:12px;
	font-family:Lucida Console, Monaco, monospace;
	margin:5px 0 0 18px;
	border:none;
	color:white;
}
#controls LABEL {
	display:block;
	border:dotted 1px #555;
	background-color:#777;
	color:#ccc;
	padding:0 0 0 5px;
}
#controls SPAN {
	height:18px;
	margin:2px 20px 0 20px;
	white-space:nowrap;
	display:inline-block;
}
#controls SPAN STRONG{
	color:yellow;
}
#functs {
	width:300px;
	height:490px;
	overflow:auto;
	position:absolute;
	border:solid 1px black;
	background-color:#FFF;
	top:503px;
	left:819px;
	padding:10px;
}
#functLinks {
	width:300px;
	height:20px;
	position:absolute;
	top:1010px;
	left:819px;
	padding:3px;
	text-align:right;
}
BUTTON.funct {
	display:block;
	padding:5px;
	color:navy;
	margin:3px 0 0 0;
	width:275px;
}
#info {
	width:300px;
	position:absolute;
	border:solid 1px black;
	background-color:#FFF;
	top:70px;
	left:819px;
	padding:10px;
	z-index:100;
}
#iesupport {
	width:400px;
	height:100px;
	display:none;
	text-align:center;
	vertical-align:middle;
	font-weight:bold;
	font-size:24px;
	color:maroon;
	background-color:#FEE;
	border:solid 10px maroon;
	z-index:1000;
	position:absolute;
	top:50px; left:50px;
}
#gallery {
	width:130px;
	height:auto;
	position:absolute;
	top:500px;
	left:1155px;
}
#snapshot {
	width:85px;
	height:auto;
	position:absolute;
	top:380px;
	left:1155px;
}
#snapshot IMG {
	border:none;
}
#snapshot DIV {
	height:60px;
	width:80px;
	border:solid 1px black;
	background-color:#666;
	padding:0;
}
#disqus {
	margin:2px 20px 0 20px;
	padding: 10px;
	border: solid 1px gray;
	background-color: white;
	font-family: Verdana, Geneva, Arial, Helvetica, sans-serif; font-size:10px;
}
#disqus a {
	color:#006;
	text-decoration:none;
}
</style>
</head>
<body style="background:url('images/grid.gif'); background-position:0px -100px; margin:0px; padding:0px;">
<div id="stain"></div>
<div id="title">Dig Trig<div>Turtle Graphics<br/><a href="/">Menu</a></div></div>
<div id="info">
	<h1>Turtle Graphics - Programming For Kids</h1>
	<br/>
	When I was a wee lad in 4th and 5th grade (1984/1985), we had a couple Apple II+ computers. One of the first programming experiences was with Apple Logo, a turtle graphics program that had a small language, but was still very much a 'programming' environment. Thus began my code monkey fate. My son (9 yrs old) asked me if he could learn to program... so I created this in hopes that he finds as much enjoyment as I did.
	<br/>
	<br/>
	I took this a step further for myself and added the ability to define your own functions. There is a link below to export your functions. Just copy the string back in next time to rebuild your function library. I also added variables and basic operations, random number generators, IF logic conditions and LIFO stacks. It's great for self-similar <a href="http://en.wikipedia.org/wiki/Fractal" target="_blank">fractals</a> and <a href="http://en.wikipedia.org/wiki/L-system" target="_blank">L-system</a> generation!
	<br/>
	<br/>
	<strong style="color:red;">UPDATE: </strong>I am now using the 'canvas' tag in HTML5 for the drawing routines. The canvas tag is not supported in all browsers.
</div>
<div id="screen">
	<div id="screen_bg"></div>
	<canvas id="screen_gfx" width="800" height="600"></canvas>
	<canvas id="turtle" width="20" height="20"></canvas>
</div>
<div id="controls">
	<form action="javascript:logo.cmd();"><input id="cmd" type="text" value="" /><input type="submit" value="Go" style="display:none;"></form>
	<div id="instructions">
		<label>Screen</label>
		<span><strong>CL</strong> : Clear</span>
		<span><strong>H</strong> : Home</span>
		<label>Pen</label>
		<span><strong>PU</strong> : Pen Up</span>
		<span><strong>PD</strong> : Pen Down</span>
		<span><strong>PC color</strong> : Pen Color (HTML color names, RGB hex as RGB or RRGGBB, RGBA hex as RRGGBBAA)</span>
		<label>Movement</label>
		<span><strong>FD value</strong> : Move Forward # pixels</span>
		<span><strong>BK value</strong> : Move Backward # pixels</span>
		<span><strong>RT value</strong> : Right Turn # degrees</span>
		<span><strong>LT value</strong> : Left Turn # degrees</span>
		<span><strong>SAVE</strong> : Saves current Position, Angle and Pen Color (pushes onto LIFO state stack)</span>
		<span><strong>RESTORE</strong> : Restores saved Position, Angle and Pen Color (pops from LIFO state stack)</span>
		<label>Commands</label>
		<span><strong>NULL</strong> : Do Nothing (useful in logic conditions: IF Less Than = IFGTE x y [NULL][...])</span>
		<span><strong>RP value [...]</strong> : Repeats [...] # times (can use REPEAT instead)</span>
		<span><strong>TO name [...]</strong> : Creates a function of commands (call the name, or click on the button)</span>
		<label>Variables - all values can be integers or variables</label>
		<span><strong>SET var value</strong> : var = value</span>
		<span><strong>ADD var value</strong> : var = var + value</span>
		<span><strong>SUB var value</strong> : var = var - value</span>
		<span><strong>MULT var value</strong> : var = var * value</span>
		<span><strong>DIV var value</strong> : var = var / value</span>
		<span><strong>PRCNT var value</strong> : var = var * value / 100</span>
		<span><strong>PUSH value</strong> : Pushes value onto LIFO variable stack</span>
		<label>Special Variables - returns a value, use like a variable</label>
		<span><strong>POP</strong> : Pops value from LIFO variable stack (eg SET X POP)</span>
		<span><strong>RAND</strong> : Random number 0-100</span>
		<span><strong>RANDANGLE</strong> : Random number 0-359</span>
		<label>Logic Conditions</label>
		<span><strong>IFNZ value [...][...]</strong> : If value != 0 runs first, otherwise second</span>
		<span><strong>IFEQ value1 value2 [...][...]</strong> : If value1 = value2 runs first, otherwise second</span>
		<span><strong>IFGT value1 value2 [...][...]</strong> : If value1 &gt; value2 runs first, otherwise second</span>
		<span><strong>IFGTE value1 value2 [...][...]</strong> : If value1 &gt;= value2 runs first, otherwise second</span>
		<br />
	</div>
</div>
<div id="functs"><h2>Functions:</h2></div>
<div id="functLinks"><a href="javascript:logo.exportFunctions();">Export Your Functions</a></div>
<div id="iesupport">IE is not supported.<br/>Get a real browser.</div>
<div id="gallery"><h3>Gallery</h3></div>
<div id="snapshot">
	<a href="javascript:void(0);" onclick="javascript:$('#export').get(0).src = logo.vars.screen.canvas.toDataURL();"><img src="logo/snapshot.png" title="Take a snapshot of the screen" /></a>
	<div><img id="export" title="Right-click, Save As..." width="80" height="60" /></div>
</div>
</body>
</html>