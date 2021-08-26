//Utiliza jQuery para tareas generales del frontend

function loadMenu(){
    $("nav").load("pages/menu.html #navbar");
}


$(document).ready(function(){
   console.log("Pagina Lista"); 
    loadMenu();
});