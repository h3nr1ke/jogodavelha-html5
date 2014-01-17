
//global variables
//control variabeles
var player = false;
var startPlayer = false;
var winner = false;
var draw = false;
var xCount = 0;
var oCount = 0;
var drawCount = 0;
var touches = 0;
//condition to win
var conditions = [['.c11', '.c12', '.c13'],//horizontals
	                ['.c21', '.c22', '.c23'],
	                ['.c31', '.c32', '.c33'],
	                
	                ['.c11', '.c21', '.c31'],//verticals
	                ['.c12', '.c22', '.c32'],
	                ['.c13', '.c23', '.c33'],
	                
	                ['.c11', '.c22', '.c33'],//cross
	                ['.c13', '.c22', '.c31']];

var cellH = 0;

//cores
var xColor = "yellow";       
var oColor = "blue";       
var gridColor = "white";
var bgColor = "red";
var txtColor = "white";

//ai
var isAIOn = false;
var aiMode = "off";
var firstMove = true;
var cpuPlayer = false;

//possiveis jogadas com a cpu iniciando, para ficar diferente
var posTable = [ // possiblities to star a game
  [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ], // firs position
  [ 3, 6, 9, 2, 5, 8, 1, 4, 7 ], // second guessed position
  [ 7, 4, 1, 8, 5, 2, 9, 6, 3 ], // Third guessed position
  [ 9, 8, 7, 6, 5, 4, 3, 2, 1 ] // fourth guessed position

	];
var posTableSel = 0;

var moves = [0,0,0,0,0,0,0,0,0,0];

$(document).ready(function(){
  updateColors();
	updateActual();
	
	window.setTimeout(function(){
		//pega o tamanho atual da celula
		cellH = Math.abs(parseInt($("tr#l1 td.c11").css("height")) * 0.80);
		setPlayerMove(player);
		

//		if(isAIOn){
//			//Android.setMove(touches,classToPos( $(this)));
//			playAI(touches);
//			firstMove = false;
//			touches++;
//		}
		
	}, 200);
	
	//inclui funcoes nos botoes de jogo contra CPU
	/*$("tr.ai td").click(function(){
		if(!$(this).is(".ai-sel")){
			$("tr.ai td").removeClass("ai-sel");
			aiMode = $(this).attr("class");
			$(this).addClass("ai-sel");
			
			if(aiMode != "off"){
				isAIOn = true;
				resetGame();
				
				//inicia um jogo contra a CPU
				switch(aiMode){
				case "kids":
					break;
				case "normal":
					//define onde vai comecar
					posTableSel = Android.getRandom(4);
					playCPU();
					break;
				}
			}
			else{
				//desliga o ai
				isAIOn = false;
			}
		}
	});*/
	
	//escreve o draw game no idioma certo
	$('#draw').text(Android.getTransString("draw")+' : 0');
	
	$("#game").live('swipeleft swiperight', function(event){
		switch(event.type){
			case "swipeleft":
				resetCounters();
				break;
			case "swiperight":
				resetGame();
				break;
		}
			event.preventDefault();
		});
      
  //each click game include game item
  $("#game table tr.play td").click(function(){

    if(($(this).find("span").text() == '') && !winner){
      touches++;
      moves[touches] = parseInt($(this).attr("id").replace("c",""));
      $(this).find("span").css("opacity", 0);
      	
      if(!player){
        $(this).css("color",xColor);
        $(this).find("span").addClass("x").css("font-size",cellH).css("color",xColor).text('X');
      }
      else{
          $(this).css("color",oColor);
        $(this).find("span").addClass("o").css("font-size",cellH).css("color",oColor).text('O');
      }
      
      $(this).find("span").animate({opacity: "1"}, 250);
      
      player = !player;
      setPlayerMove(player);
      
    }

    
    //reset the game with one touch if its finished
    if(winner || draw){
  	  resetGame();
  	}
  	else{
  		if(isAIOn){
  			switch(aiMode){
  			case "kids":
  				break;
  			case "normal":
  				playCPU();
  				break;
  			}
  		}
  	}
    
    checkWinner();
    checkDraw();
  	
  });

});

function updateColors(){

	//pega as cores
	xColor = Android.getColor(0);      
	oColor = Android.getColor(1);       
	gridColor = Android.getColor(2);
	bgColor = Android.getColor(3);
	txtColor = Android.getColor(4);
	
	xColor = xColor.replace("#ff","#");
	oColor = oColor.replace("#ff","#");
	gridColor = gridColor.replace("#ff","#");
	bgColor = bgColor.replace("#ff","#");
	txtColor = txtColor.replace("#ff","#");
 
}

function updateActual(){
    $("span.x").css("color",xColor);
    $("span.o").css("color",oColor);
    $("tr.play td").css("border-color",gridColor);
    $("body").css("background-color",bgColor);
    $("#score ul li").css("color",txtColor);
}

//function to click
function playCPU(){
	touches++;
	var m = parseInt(nextMoveNormal(touches));
	//Android.showToast(m);
	
	var e = $("td#c"+m);
	 e.find("span").css("opacity", 0);
     if(!player){
       e.find("span").addClass("x").css("font-size",cellH).css("color",xColor).text('X');
     }
     else{
       e.find("span").addClass("o").css("font-size",cellH).css("color",oColor).text('O');
     }
     
     e.find("span").animate({opacity: "1"}, 250);

	 player = !player;
}

//funcoes para controle do game

//reinicia os contatores
function resetCounters(){
	xCount = 0;
	oCount = 0;
	drawCount = 0;
	
	$('#player1').text('X : '+xCount);
	$('#player2').text('O : '+oCount);
	$('#draw').text(Android.getTransString("draw")+' : '+drawCount); //include the draw string
	
	Android.showToast(Android.getTransString("reset_counter"));
}

function onMenuKeyDown() {
	if($("#menu").hasClass("visible")){
			$("#menu").removeClass("visible").animate({
	    bottom: "-120px", opacity: 0}, 250);
	}
	else{
			$("#menu").addClass("visible").animate({
	    bottom: "0px", opacity: 1}, 250);
	}
}

function showWinner(cond){
	winner = true;
	touches = 0;
	$(conditions[cond][0]).addClass("winCell");//.css('backgroundColor', '#55dd55');
	$(conditions[cond][1]).addClass("winCell");//.css('backgroundColor', '#55dd55');
	$(conditions[cond][2]).addClass("winCell");//.css('backgroundColor', '#55dd55');
	
	//update the score table
	switch( $(conditions[cond][0]).text() ){
	  case 'X':
	    xCount++;
	    
	    $('#player1').text('X : '+xCount);
	    Android.showToast(Android.getTransString("x_won"));
	    break;
	  case 'O':
	    oCount++;
	    $('#player2').text('O : '+oCount);
	    Android.showToast(Android.getTransString("o_won"));
	    break;
	}
}


function resetGame(){
	touches = 0; //reset the touch control variable
	event.preventDefault();
	$(this).css('backgroundColor', '#000000');
	$("td span").text('').removeClass("winCell").removeClass("x").removeClass("o").removeClass("drawGame");
	$("td").removeClass("winCell").removeClass("x").removeClass("o").removeClass("drawGame");

	winner = false;
	draw = false;
	startPlayer = !startPlayer; //inverte sempre quem comecou
	player = startPlayer;
	//setPlayerMove(player);
	
	moves = new Array(0,0,0,0,0,0,0,0,0,0);
	
	Android.showToast(Android.getTransString("clean_screen"));
}


function checkDraw(){
	if (!winner && (touches == 9)){
	  //TODO
	  /*
	  definir o que sera feito quando o jogo der velha...
	  surgir uma imagem de uma velhinha?
	  ficar piscando tudo?
	  */
	  drawCount++;
	  draw = true;
	  touches = 0;
	  moves = new Array(0,0,0,0,0,0,0,0,0,0);
	  $("td").addClass("drawGame");
	  $('#draw').text(Android.getTransString("draw")+' : '+drawCount);
	  Android.showToast(Android.getTransString("draw_game"));
	}
}

function setPlayerMove(w){
	if(!w){
		//marca x
		$("li#player1").addClass("border-bot");
		$("li#player2").removeClass("border-bot");
	}
	else{
		//marca o
		$("li#player2").addClass("border-bot");
		$("li#player1").removeClass("border-bot");
	}
}


function checkWinner(){
//check the winner if exists more than 4 itens
	if(touches >= 4) {
	  //there are 8 conditions
	  /*$.each(conditions, function(i, value) {
		  if(( $(conditions[i][0]).text() != '' 
		  	&& $(conditions[i][1]).text() != '' 
		  	&& $(conditions[i][2]).text() != '') 
		    && ( $(conditions[i][0]).text() == $(conditions[i][1]).text() 
			    && $(conditions[i][0]).text() == $(conditions[i][2]).text() 
			    && $(conditions[i][1]).text() == $(conditions[i][2]).text()) ){
	      	showWinner(i);
	      //break;
	    }
		});*/
	
	  for (var i in conditions){
	    if(($(conditions[i][0]).text() != '' && $(conditions[i][1]).text() != '' && $(conditions[i][2]).text() != '') 
	        && ($(conditions[i][0]).text() == $(conditions[i][1]).text() 
	            && $(conditions[i][0]).text() == $(conditions[i][2]).text() 
	            && $(conditions[i][1]).text() == $(conditions[i][2]).text()) ){
	      showWinner(i);
	      break;
	    }
	  }
	}
}

//funcao que joga...
function nextMoveNormal(pMove) {
		// variaveis
		var piece = 0;
		switch (pMove) {
		case 1: // primeira jogada, coloca no canto inferior esquerdo
			piece = 7;
			break;
		case 3:	//terceira jogada
			switch (moves[2]) { // move 2
			case posTable[posTableSel][0]:
			case posTable[posTableSel][1]:
			case posTable[posTableSel][3]:
			case posTable[posTableSel][4]:
			case posTable[posTableSel][5]:
			case posTable[posTableSel][7]:
			case posTable[posTableSel][8]:
				piece = 3;
				break;
			case posTable[posTableSel][2]:
				piece = 1;
				break;
			}
			break;	//fim da terceira jogada

		case 5:	//quinta jogada
			switch (moves[2]) { // move 2
			case posTable[posTableSel][0]:
				switch (moves[4]) { // move 4
				case posTable[posTableSel][0]:
				case posTable[posTableSel][1]:
				case posTable[posTableSel][3]:
				case posTable[posTableSel][5]:
				case posTable[posTableSel][7]:
				case posTable[posTableSel][8]:
					piece = 5;
					break;
				case posTable[posTableSel][4]:
					piece = 9;
					break;
				}
				break;
			case posTable[posTableSel][1]:
				switch (moves[4]) { // move 4
				case posTable[posTableSel][0]:
				case posTable[posTableSel][3]:
				case posTable[posTableSel][5]:
				case posTable[posTableSel][7]:
				case posTable[posTableSel][8]:
					piece = 5;
					break;
				case posTable[posTableSel][4]:
					piece = 8;
					break;
				}
				break;
			case posTable[posTableSel][2]:
				switch (moves[4]) { // move 4
				case posTable[posTableSel][3]:
					piece = 9;
					break;
				
				case posTable[posTableSel][8]:
				case posTable[posTableSel][1]:
				case posTable[posTableSel][4]:
				case posTable[posTableSel][7]:
					piece = 4;
					break;
				}
				break;
			case posTable[posTableSel][3]:
				switch (moves[4]) { // move 4
				case posTable[posTableSel][0]:
				case posTable[posTableSel][1]:
				case posTable[posTableSel][5]:
				case posTable[posTableSel][7]:
				case posTable[posTableSel][8]:
					piece = 5;
					break;
				case posTable[posTableSel][4]:
					piece = 6;
					break;
				}
				break;
			case posTable[posTableSel][4]:
			    alert(moves[4]);
				// relacao entre as jogadas deve ser mantida
				//piece = 10 - moves[4]; // move 4
				
				switch (moves[4]) { // move 4
				case posTable[posTableSel][0]:
					piece = 9;
					break;
				case posTable[posTableSel][1]:
					piece = 8;
					break;
				case posTable[posTableSel][3]:
					piece = 6;
					break;
				case posTable[posTableSel][5]:
					piece = 4;
					break;
				case posTable[posTableSel][7]:
					piece = 2;
					break;
				case posTable[posTableSel][8]:
					piece = 1;
					break;
				}
				break;
			case posTable[posTableSel][5]:
				switch (moves[4]) { // move 4
				case posTable[posTableSel][0]:
				case posTable[posTableSel][1]:
				case posTable[posTableSel][3]:
				case posTable[posTableSel][7]:
				case posTable[posTableSel][8]:
					piece = 5;
					break;
				case posTable[posTableSel][4]:
					piece = 4;
					break;
				}
				break;
			case posTable[posTableSel][7]:
				switch (moves[4]) { // move 4
				case posTable[posTableSel][0]:
				case posTable[posTableSel][1]:
				case posTable[posTableSel][3]:
				case posTable[posTableSel][5]:
				case posTable[posTableSel][8]:
					piece = 5;
					break;
				case posTable[posTableSel][4]:
					piece = 2;
					break;
				}
				break;
			case posTable[posTableSel][8]:
				switch (moves[4]) { // move 4
				case posTable[posTableSel][0]:
				case posTable[posTableSel][1]:
				case posTable[posTableSel][3]:
				case posTable[posTableSel][5]:
				case posTable[posTableSel][7]:
					piece = 5;
					break;
				case posTable[posTableSel][4]:
					piece = 1;
					break;
				}
				break;
			}
			break; //fim da quinta jogada

		case 7:	//setima jogada
			switch (moves[2]) { // move 2
			case posTable[posTableSel][0]:
				// se chegamos ate aqui, ele o oponente jogou no meio, logo nao
				// preciso testar a 4 jogada
				switch (moves[6]) { // move 6
				case posTable[posTableSel][1]:
				case posTable[posTableSel][5]:
					piece = 8;
					break;
				case posTable[posTableSel][3]:
				case posTable[posTableSel][7]:
					piece = 6;
					break;
				}
				break;
			
			case posTable[posTableSel][1]: 
				switch (moves[6]) { // move 6
				case posTable[posTableSel][0]:
				case posTable[posTableSel][3]:
				case posTable[posTableSel][5]:
					piece = 9;
					break;
				case posTable[posTableSel][8]:
					piece = 1;
					break;
				}
				break;
			case posTable[posTableSel][2]: //faltou esse, agora ta certo...
			  switch (moves[6]) { // move 6
			    case posTable[posTableSel][0]:
			    case posTable[posTableSel][1]:
			    case posTable[posTableSel][3]:
			    case posTable[posTableSel][5]:
			    case posTable[posTableSel][7]:
				  piece = 5;
				  break;
				  
		 	    case posTable[posTableSel][4]:
		 	    case posTable[posTableSel][5]:
		 	        piece = 8;
		 	        break;
			  }
			  break;
			case posTable[posTableSel][3]:
				switch (moves[6]) { // move 6
				case posTable[posTableSel][0]:
				case posTable[posTableSel][1]:
				case posTable[posTableSel][7]:
					piece = 9;
					break;
				case posTable[posTableSel][8]:
					piece = 1;
					break;
				}
				break;
			
			case posTable[posTableSel][5]:
				switch (moves[6]) { // move 6
				case posTable[posTableSel][0]:
					piece = 9;
					break;
				case posTable[posTableSel][1]:
				case posTable[posTableSel][7]:
				case posTable[posTableSel][8]:
					piece = 1;
					break;
				}
				break;
			
			case posTable[posTableSel][7]:
				switch (moves[6]) { // move 6
				case posTable[posTableSel][0]:
					piece = 9;
					break;
				case posTable[posTableSel][3]:
				case posTable[posTableSel][5]:
				case posTable[posTableSel][8]:
					piece = 1;
					break;
				}
				break;

			case posTable[posTableSel][4]:
				switch (moves[4]) { // move 4
				case posTable[posTableSel][0]:
					switch (moves[6]) { // move 6
					case posTable[posTableSel][1]:
					case posTable[posTableSel][3]:
					case posTable[posTableSel][7]:
						piece = 6;
						break;
					case posTable[posTableSel][5]:
						piece = 8;
						break;
					}
					break;
				case posTable[posTableSel][1]:
					switch (moves[6]) { // move 6
					case posTable[posTableSel][0]:
					case posTable[posTableSel][3]:
					case posTable[posTableSel][5]:
						piece = 9;
						break;
					case posTable[posTableSel][8]:
						piece = 1;
						break;
					}
					break;
				case posTable[posTableSel][3]:
					switch (moves[6]) { // move 6
					case posTable[posTableSel][0]:
					case posTable[posTableSel][1]:
					case posTable[posTableSel][7]:
						piece = 9;
						break;
					case posTable[posTableSel][8]:
						piece = 1;
						break;
					}
					break;
				case posTable[posTableSel][5]:
					switch (moves[6]) { // move 6
					case posTable[posTableSel][0]:
						piece = 9;
						break;
					case posTable[posTableSel][1]:
					case posTable[posTableSel][7]:
					case posTable[posTableSel][8]:
						piece = 1;
						break;
					}
					break;
				case posTable[posTableSel][7]:
					switch (moves[6]) { // move 6
					case posTable[posTableSel][0]:
						piece = 9;
						break;
					case posTable[posTableSel][3]:
					case posTable[posTableSel][5]:
					case posTable[posTableSel][8]:
						piece = 1;
						break;
					}
					break;
				case posTable[posTableSel][8]:
					switch (moves[6]) { // move 6
					case posTable[posTableSel][1]:
					case posTable[posTableSel][7]:
						piece = 4;
						break;
					case posTable[posTableSel][3]:
					case posTable[posTableSel][5]:
						piece = 10 - moves[6];
						break;
					}
					break;
				}
				break;
			
			case posTable[posTableSel][8]:
				switch (moves[6]) { // move 6
				case posTable[posTableSel][1]:
				case posTable[posTableSel][3]:
					piece = 6 - moves[6];
					break;
				case posTable[posTableSel][5]:
					piece = 4;
					break;
				case posTable[posTableSel][7]:
					piece = 2;
					break;
				}
				break;
			}

			break;
		case 9: // no winner condition
			// play in the free one
			var em = "1,2,3,4,5,6,7,8,9,";
			for (var i in moves){
			  em = em.replace(moves[i]+",","");
			}
			alert(em);
			piece = parseInt(em.replace(",","")); // mean to play in the free one
			return piece;
		}
		moves[touches] = parseInt(posTable[posTableSel][piece - 1]);
		return parseInt(posTable[posTableSel][piece - 1]);
	}

