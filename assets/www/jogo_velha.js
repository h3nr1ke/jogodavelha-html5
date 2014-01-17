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
var conditions = [['.c00', '.c01', '.c02'],//horizontals
									['.c10', '.c11', '.c12'],	
									['.c20', '.c21', '.c22'],
									
									['.c00', '.c10', '.c20'],//verticals
									['.c01', '.c11', '.c21'],
									['.c02', '.c12', '.c22'],
									
									['.c00', '.c11', '.c22'],//cross
									['.c02', '.c11', '.c20']]; 
var cellH = 0;

//cores
var xColor = "yellow";       
var oColor = "blue";       
var gridColor = "white";
var bgColor = "red";
var txtColor = "white";

//clone do tabuleiro
/**
	1 = cpu
	20 = oponente
	0 = ninguem jogou ainda
*/
var tableClone = [[0,0,0],
									[0,0,0],
									[0,0,0]];
	
var firstMove = false;
var isAiOn = false;

$(document).ready(function(){
	updateColors();
	updateActual();
	
	window.setTimeout(function(){
		//pega o tamanho atual da celula
		cellH = Math.abs(parseInt($("td.c00").css("height")) * 0.80);
		setPlayerMove(player);
	}, 200);
	
	//escreve o draw game no idioma certo
	$('#draw').text(Android.getTransString("draw")+' : 0');
	
	// inclui swipe
	$("#game").live('swipeleft swiperight', function(event){
		event.preventDefault();
		switch(event.type){
			case "swipeleft":
				resetCounters();
				break;
			case "swiperight":
				resetGame();
				break;
		}
	});

	//each click game include game item
	$("#game table tr.play td").click(function(){
		//reinicia se ganhou ou empatou
		if(winner || draw){
			resetGame();
			return;
		}
		else{
			if(($(this).find("span").text() == '') && !winner){
	
				$(this).find("span").css("opacity", 0);
					
				if(!player){
					$(this).css("color",xColor);
				}
				else{
						$(this).css("color",oColor);
				}
				
				var parentId = parseInt($(this).parent().attr('id'));
				var colId = parseInt($(this).attr('id'));
				play([parentId,colId], player);
				
				$(this).find("span").animate({opacity: "1"}, 250);
				
				player = !player;
				setPlayerMove(player);
				
				if( !winner && !draw && !player && isAiOn){
					alert("depois do click ai play");
					cpuPlay(player);
					player = !player;
				}
			}
		}
	});
	
	$(".ai td.off").click(function(){
			if(!$(this).is(".ai-sel")){
				//desliga o ai
				isAiOn = false;
				
				//seleciona o item
				$(".ai td").removeClass("ai-sel");
				$(this).addClass("ai-sel");
				
				//reinicia o jogo
				resetGame();
			}
	});
	
	$(".ai td.normal").click(function(){
			if(!$(this).is(".ai-sel")){
				//liga o ai
				isAiOn = true;
				
				//seleciona o item
				$(".ai td").removeClass("ai-sel");
				$(this).addClass("ai-sel");
	
				//reinicia o jogo
				resetGame();
			}
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
		$("tr.ai td").css("color",txtColor);
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

function showWinner(cond){
	winner = true;
	touches = 0;
	$(conditions[cond][0]).addClass("winCell");
	$(conditions[cond][1]).addClass("winCell");
	$(conditions[cond][2]).addClass("winCell");
	
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
	alert("jogo reiniciado");
	
	//zera todo o tabuleiro
	$("td span").text('').removeClass("winCell").removeClass("x").removeClass("o").removeClass("drawGame");
	$("td").removeClass("winCell").removeClass("x").removeClass("o").removeClass("drawGame");
	
	//reinicia a tabela clone dos movimentos
	aiRestart();
	
	//reinicia indicadores de status
	winner = false;
	draw = false;
	
	//apos reiniciar o jogo inverte quem comecou no round anterior
	startPlayer = !startPlayer;
	player = startPlayer;
	
	//reinicia a contagem de toques
	touches = 0; 
	
	//baseado em que dará o proximo passo marca na parte superior
	setPlayerMove(player);
	
	if(!player && isAiOn){
		alert("vez de comecar o ai");
		aiFirstMove();
		cpuPlay(player);
		player = !player;
	}
	
	//exibe mensagem para o usuario
	Android.showToast(Android.getTransString("clean_screen"));
}

function checkDraw(){
	if (!winner && (touches == 9)){
		drawCount++;
		draw = true;
		touches = 0;
		$("td").addClass("drawGame");
		$('#draw').text(Android.getTransString("draw")+' : '+drawCount);
		Android.showToast(Android.getTransString("draw_game"));
	}
}

function checkWinner(){
//check the winner if exists more than 4 itens
	if(touches >= 4) {
		for (var i in conditions){
			if(($(conditions[i][0]).text() != '' && $(conditions[i][1]).text() != '' && $(conditions[i][2]).text() != '') 
					&& ($(conditions[i][0]).text() == $(conditions[i][1]).text() 
							&& $(conditions[i][0]).text() == $(conditions[i][2]).text() 
							&& $(conditions[i][1]).text() == $(conditions[i][2]).text()) ){
				showWinner(i);
				return true;
				break;
			}
		}
	}
	return false;
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