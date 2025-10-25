

var textoHome = [
    "Familiar",
    "Pessoal",
    "Empresarial",
    "Universitário",
    "de Forma Fácil"
]


var txt = document.getElementById("spanText");
var i = 0;
function trocarTexto(){
    setTimeout(() => {
        txt.innerHTML = textoHome[i];
        i = (i+1) % textoHome.length;
    }, 500)
}

trocarTexto();
setInterval(trocarTexto, 3000);