//Simula os itens criados pelo android
function AndroidInterface(){
	this.getTransString = function (str){
		return str;
	}
	
	this.getColor = function (color){
		tmpC = "";
		switch(color){
		case 0:
			tmpC = "#ffeeff99";
			break;
		case 1:
			tmpC = "#ff23fff8";
			break;
		case 2:
			tmpC = "#ff9fff00";
			break;
		case 3:
			tmpC = "#ff654321";
			break;
		case 4:
			tmpC = "#ff0099ff";
			break;
		}
		return tmpC;
	}
	
	this.showToast = function (msg){
		alert(msg);
	}
}

var Android = new AndroidInterface();

