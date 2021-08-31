// Busqueda en tiempo real
document.getElementById("txtNombreAutoModificacion").onkeyup = function() {
    var buscar_= this.value.toLowerCase() ;
    document.querySelectorAll('.table tbody tr').forEach(function(e){
      var encontro_ =false;
      e.querySelectorAll('td').forEach(function(e){
        if (e.innerHTML.toLowerCase().indexOf(buscar_)>=0){
          encontro_=true;
        }
      }); 
      if (encontro_){
        e.style.display = '';
      }else{
        e.style.display = 'none';
      }
    });              
  }
  

  let arregloGeneral = [];

function contarrows(nombreTabla){
    var i=0;
    var tabla = document.getElementById(nombreTabla);
    var total = tabla.rows.length;
    
    for(j=1;j<=total-1;j++){
       var dato=tabla.rows[j].cells[1].childNodes[0].nodeValue;
       var dato_2=tabla.rows[j].cells[2].childNodes[0].nodeValue;
       var dato_3=tabla.rows[j].cells[3].childNodes[0].nodeValue;
       var dato_4=tabla.rows[j].cells[4].childNodes[0].nodeValue;
       var dato_5=tabla.rows[j].cells[5].childNodes[0].nodeValue;
       let objeto = {
            marca:dato.trim(),
            tipo: dato_2.trim(),
            numPlaca: dato_3.trim(),
            color: dato_4.trim(),
            disponibilidad:dato_5.trim()
        }
        arregloGeneral[i]=objeto;
       i++;
   }
   return arregloGeneral;
}


var indice;

document.querySelector('#tablaModificarAutomovil').onclick = function(ev) {
    indice = ev.target.parentElement.rowIndex;
    document.getElementById("txtIDAutomovil").value = indice;
    obtenerDatos(indice);
    console.log(indice);
}
  
function obtenerDatos(indice){
    let autos = contarrows("tablaModificarAutomovil");
    let marca = autos[indice-1].marca;
    let numPlaca = autos[indice-1].numPlaca;
    let color = autos[indice-1].color;

    document.getElementById("txtMarcaAutomovil").value = marca;
    document.getElementById("txtNumPlacaAutomovil").value = numPlaca;
    document.getElementById("txtColorAutomovil").value = color;    
}

function validarCampos(){
  let numPlaca = document.getElementById("txtNumPlacaAutomovil").value;
  let marca = document.getElementById("txtMarcaAutomovil").value;
  let color = document.getElementById("txtColorAutomovil").value;
  let bandera = false;

  if(numPlaca == "" || marca == "" || color == ""){
      bandera = true;
      return bandera;
  }
  return bandera;
}

$(function() {    
  $("#btnModificarAuto").click(function(){        
      if(!validarCampos()){
          //save();            
      }else{
          Swal.fire({
              icon: 'error',
              title: 'Error...',
              text: 'No olvide, llenar todos los campos!',
            })
      }
      
  });
});
