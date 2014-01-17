//+++++++ novas funcoes do AI
function cpuPlay(pPlayer){
	//vou comecar?
	if(firstMove){
		//jogo em qualquer uma das 9 posicoes		
		play(randomPos(), pPlayer);
		firstMove = false;
		return true;
	}
	else{ //nao comecei
		//posso vencer ou perder colocando em algum lugar
		if(canSomeOneWin(3,false,pPlayer) || canSomeOneWin(41,false,pPlayer)){
			return true;
			}
		else{ //se eu nao posso e nem ele, onde eu posso jogar pra ganhar na proxima?
			checkBetterPosition(pPlayer);
		}
	}
	return false;
}
  
/**
verifica baseado em uma comparacao simples onde eu jogo agora e que pode me levar a vitoria na proxima jogada
TODO criar mecanismo para prever duas jogadas
*/
function checkBetterPosition(pPlayer){
  var noChances = true;
  if(touches < 9){
    //para cada posicao livre verifico as possibilidade de vitoria na proxima jogada
    for(var i = 0; i < tableClone.length; i++){
      for(var j = 0; j < tableClone[i].length; j++){
        //verifica se da pra jogar onde estamos
        if(tableClone[i][j] == 0){
          //se eu jogar aqui, eu ganho em quantas linhas?
          tableClone[i][j] = 1;
          if(canSomeOneWin(3,true) > 0){
            tableClone[i][j] = 0; //volta o anterior
            play([i,j], pPlayer);
            noChances = false;
            return;
          }
          else{
            tableClone[i][j] = 0;
          }
        }
      }
    }
      
    if(noChances){
      play(randomPos(), pPlayer);
    }
  }
  else{
    //se estamos na oitavo jogado basta jogar onde tiver livre...
    for(var i = 0; i < tableClone.length; i++){
      for(var j = 0; j < tableClone[i].length; j++){
        if(tableClone[i][j] == 0){
          play([i,j], pPlayer);
        }
      }
    }
  }
}
  
/**
Executa a jogada nas coordenadas passadas
*/
function play(pos,who){
  //atualiza tabela clone
  
  if(!who){
  	  tableClone[pos[0]][pos[1]] = 1;
  }
  else{
    tableClone[pos[0]][pos[1]] = 20;
  }

  touches++;
	alert(touches);
	alert(who);
	alert("td.c"+pos[0]+""+pos[1]);
	var e = $("td.c"+pos[0]+""+pos[1]);
  e.find("span").css("opacity", 0);
  if(!who){
  	alert("jogou x");
    e.find("span").addClass("x").css("font-size",cellH).css("color",xColor).text('X');
    setPlayerMove(false);
  }
  else{
		alert("jogou o");
		e.find("span").addClass("o").css("font-size",cellH).css("color",oColor).text('O');
		setPlayerMove(true);
  }
   
  e.find("span").animate({opacity: "1"}, 250);
	
	setPlayerMove(!who);
	
	if(!checkWinner()){
		checkDraw();
	}
}
  
/**
	verifica as condicoes de vitoria e derrota baseado no tableClone
	recebe target - indica qual o valor deve ser somado para verificar vitoria de alguem
									3 - cpu pode ganhar
									41 - cpu pode perder
	retorna true se ganhou, false se nao pode ganhar
*/
function canSomeOneWin(target, justCheck, pPlayer){
	// armazena a quantidade de possiveis vitorias com o jogo atual
	var victoryCount = 0;

	//horizontais
	for(i = 0; i < tableClone.length; i++){
		//se a soma da linha + 1 = 3, verificar qual esta vaga e jogar nesta posicao
		if( ((tableClone[i][0] + tableClone[i][1] + tableClone[i][2]) + 1) == target ){
			//armazena o valor da coluna e da linha
			for(var j = 0; j< 3; j++){
				if(tableClone[i][j] == 0){
					victoryCount++;
					// marca esta posicao no tabuleiro real
					if(!justCheck){
						play([i,j], pPlayer);
						return true;
					}
				}
			}
		}
	}

	//verticais
	for(i = 0; i < tableClone.length; i++){
		//se a soma da linha + 1 = 3, verificar qual esta vaga e jogar nesta posicao
		if( (tableClone[0][i] + tableClone[1][i] + tableClone[2][i]) + 1 == target ){
			//armazena o valor da coluna e da linha
			for(var j = 0; j < 3; j++){
				if(tableClone[j][i] == 0){
					victoryCount++;
					// marca esta posicao no tabuleiro real
					if(!justCheck){
						play([j,i], pPlayer);
						return true;
					}
				}
			}
		}
	}
	
	//duas diagonais
	//diagonal 1
	if( (tableClone[0][0] + tableClone[1][1] + tableClone[2][2]) + 1 == target ){
		for(var i=0;i<3;i++){
			if(tableClone[i][i] == 0){
				victoryCount++;
				if(!justCheck){
					play([i,i], pPlayer);
					return true;
				}
			}
		}
	}
	
	//diagonal 2
	if( ((tableClone[0][2] + tableClone[1][1] + tableClone[2][0]) + 1) == target ){
		for(var i=0;i<3;i++){
			if(tableClone[i][2-i] == 0){
				victoryCount++;
				if(!justCheck){
					play([i,2-i], pPlayer);
					return true;
				}
			}
		}
	}
	if(justCheck){
		return victoryCount;
	}
	else{
		return false;
	}
}

//useful functions
function randomPos(){
	var randomLine=Math.floor(Math.random()*3);
	var randomCol=Math.floor(Math.random()*3);
		
	while (tableClone[randomLine][randomCol] != 0){
		randomLine=Math.floor(Math.random()*3);
		randomCol=Math.floor(Math.random()*3);
	}
	return [randomLine,randomCol];
}

function aiRestart(){
	//reinicia a tabela base
	tableClone = [[0,0,0],[0,0,0],[0,0,0]];
	
}

function aiFirstMove(){
		firstMove = true;
}
  
function alert(msg){
	console.log(msg);
} 
