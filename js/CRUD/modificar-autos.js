let listaAccesorios = [];
let arregloGeneral = [];
var indice;

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

function contarrows(nombreTabla){
    var i=0;
    var tabla = document.getElementById(nombreTabla);
    var total = tabla.rows.length;
    
    for(j=1;j<=total-1;j++){
       var codigo=tabla.rows[j].cells[0].childNodes[0].nodeValue;         
       var marca=tabla.rows[j].cells[1].childNodes[0].nodeValue;
       var tipoAuto=tabla.rows[j].cells[2].childNodes[0].nodeValue;
       var numPlaca=tabla.rows[j].cells[3].childNodes[0].nodeValue;
       var color=tabla.rows[j].cells[4].childNodes[0].nodeValue;
       var precioPorDia=tabla.rows[j].cells[5].childNodes[0].nodeValue;
       var disponibilidad=tabla.rows[j].cells[6].childNodes[0].nodeValue;
       let objeto = {
            codigo:codigo,
            marca:marca.trim(),
            tipo: tipoAuto.trim(),
            numPlaca: numPlaca.trim(),
            color: color.trim(),
            precioPorDia: precioPorDia.trim(),
            disponibilidad:disponibilidad.trim()
        }
        arregloGeneral[i]=objeto;
       i++;
   }
   return arregloGeneral;
}

document.querySelector('#tablaModificarAutomovil').onclick = function(ev) {
    indice = ev.target.parentElement.rowIndex;
    obtenerDatos(indice);
}


function obtenerDatos(indice){
    let autos = contarrows("tablaModificarAutomovil");
    let id = autos[indice-1].codigo;
    let marca = autos[indice-1].marca;
    let numPlaca = autos[indice-1].numPlaca;
    let color = autos[indice-1].color;
    let disponibilidad = autos[indice-1].disponibilidad; 
    let precio  = autos[indice-1].precioPorDia;
    if(disponibilidad == "Disponible"){
      $("#radioDisponible").prop('checked',true);
      $("#radioNoDisponible").prop('checked',false);
    }else{
      $("#radioNoDisponible").prop('checked',true);
      $("#radioDisponible").prop('checked',false);
    }
  
    document.getElementById("txtIDAutomovil").value = id;
    document.getElementById("txtMarcaAutomovil").value = marca;
    document.getElementById("txtNumPlacaAutomovil").value = numPlaca;
    document.getElementById("txtColorAutomovil").value = color;
    document.getElementById("txtPrecioDiaRentaAutomovil").value = precio;
    cerrarPopupAutos();
    retrieve(id);
}

function validarCampos(){
  let numPlaca = document.getElementById("txtNumPlacaAutomovil").value;
  let marca = document.getElementById("txtMarcaAutomovil").value;
  let color = document.getElementById("txtColorAutomovil").value;
  let id = document.getElementById("txtIDAutomovil").value;
  let bandera = false;

  if(numPlaca == "" || marca == "" || color == "" || id == 0){
      bandera = true;
      return bandera;
  }
  return bandera;
}

$(function() {    
  list();
  $("#btnModificarAuto").click(function(){        
    let id = $("#txtIDAutomovil").val();
    if(!validarCampos()){
          save(id);     
          limpiarCampos();   
          $("#tblaAccesorios").empty();    
      }else if(id == 0){
        Swal.fire({
          icon: 'error',
          title: 'Error...',
          text: 'El id/código del auto no puede ser 0!',
        })

      }else{
          Swal.fire({
              icon: 'error',
              title: 'Error...',
              text: 'No olvide, llenar todos los campos!',
            })
      }
  });

  $("#insertarAccesorioModal").click(function(){
    insertarAccesorios();
  });
});

//Tabla de list autos 
function show(list){
  $("#tblaAutomoviles").empty(); //Eliminar todo el contenido de la tabla

  list.forEach(automovil =>{      
      let disponibilidad = 'No disponible';
      if(automovil.disponibilidad){
        disponibilidad = 'Disponible';
      }

      $("#tblaAutomoviles").append('<tr>' 
          + '<td>' + automovil.codigoAutomovil + '</td>'
          + '<td>' + automovil.marca + '</td>'
          + '<td>' + automovil.tipoAuto + '</td>' 
          + '<td>' + automovil.numeroPlaca + '</td>'
          + '<td>' + automovil.color + '</td>'
          + '<td>' + automovil.precioPorDia + '</td>'
          + '<td>' + disponibilidad + '</td>'
      +'</tr>')    
    });
}

function list(){
  $.ajax({
      type: "GET", //Verbo de HTTP a utilizar
      url: "http://localhost:8080/automovil/list", //Dirección para realizar la petición HTTP
      contentType : "application/json",
      dataType: "json",
      success : function(response){
          console.log(response);
          show(response);
      },
  error : function(err){
    console.error(err);
  },
      complete: function(xhr, textStatus) {            
          if(xhr.status == 404){
              Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: xhr.responseText,
                })
          }
          if(xhr.status == 500){
              alert(xhr.responseText);
          }
      }       
      
  });
}

function save(codigo){
  var automovil = serializeForm();
  var requestBody = JSON.stringify(automovil);
  console.log(requestBody);
  //Utilizar jQuery AJAX para enviar al Backend
  $.ajax({        
      type: "PUT", //Verbo de HTTP a utilizar
      url: "http://localhost:8080/automovil/update/"+codigo, //Dirección para realizar la petición HTTP
      data: requestBody, //El contenido Body de la petición HTTP                
      contentType : "application/json",
      crossDomain: true,
      dataType: "json",
      success : function(response){
          console.log(response);
          Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'El automovil ha sido modificado correctamente!'
            });
  },
  error : function(err){
    console.error(err);
  },
  });
}

function serializeForm(){     
  let disponibilidad = false;
  if(document.getElementById("radioDisponible").checked){
    disponibilidad = true;    
  }
  
  let automovil = {
      "codigoAutomovil": parseInt($("#txtIDAutomovil").val()),
      "marca" : $("#txtMarcaAutomovil").val(),       
      "tipoAuto" : $("#txtTipoAuto").val(),
      "numeroPlaca" : $("#txtNumPlacaAutomovil").val(), 
      "precioPorDia": $("#txtPrecioDiaRentaAutomovil").val(),
      "color" : $("#txtColorAutomovil").val(),
      "disponibilidad" : disponibilidad,
      "listaAccesorios": listaAccesorios,
  };
  return automovil;
}

function limpiarCampos(){
    $("#txtIDAutomovil").val(0);
    $("#txtMarcaAutomovil").val("");
    $("#txtNumPlacaAutomovil").val("");
    $("#txtTipoAuto").val("deportivo");
    $("#txtColorAutomovil").val("");
    $("#radioDisponible").prop('checked',true);
    $("#txtPrecioDiaRentaAutomovil").val("50.00");    
}


function cerrarPopupAutos() {
  $("#listaAutosModificacion").modal('hide');//ocultamos el modal
  $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
  $('.modal-backdrop').remove();//eliminamos el backdrop del modal
}

function cerrarPopupAccesorios() {
  $("#listaAccesoriosModificacion").modal('hide');//ocultamos el modal
  $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
  $('.modal-backdrop').remove();//eliminamos el backdrop del modal
}

// Busca por id y obtiene los datos
function retrieve(codigo){
  $.ajax({        
      type: "GET", //Verbo de HTTP a utilizar
      url: "http://localhost:8080/automovil/retrieve/" + codigo, //Dirección para realizar la petición HTTP        
      contentType : "application/json",
      dataType : "json",
      success : function(response){
          console.log(response);    
          listAccesorios(response);
          copiarArreglo(response.listaAccesorios);

        },
      error : function(err){
        console.error(err);
      }
  });
}

function copiarArreglo(array){
  listaAccesorios = [];
  let tam = array.length;
  for(let i = 0;i<tam;i++){
    listaAccesorios[i] = array[i];    
  }
}


//Imprimir la tabla de accesorios db
function listAccesorios(automovil){
  $("#tblaAccesorios").empty(); //Eliminar el contenido del tbody de la tabla

  if(automovil.listaAccesorios.length > 0){
    automovil.listaAccesorios.forEach(accesorio =>{
          $("#tblaAccesorios").append('<tr>'
              + '<td>' + accesorio.nombre + '</td>'
              + '<td>'
                + '<button onclick ="remove('+automovil.listaAccesorios.indexOf(accesorio)+')" type = "button" class = "btn btn-danger">Eliminar</button>'            
              + '</td>'
              + '</tr>'
          );
      });                    
  }else{
      $("#tblaAccesorios").append('<tr>'
          + '<td colspan = "2">' + "El automovil no contiene accesorios" + '</td>'
          + '</tr>'
      );        
  }
}

function listAccesoriosModificacion(){
  $("#tblaAccesorios").empty(); //Eliminar el contenido del tbody de la tabla
  listaAccesorios.forEach(a =>{
        $("#tblaAccesorios").append('<tr>'
        + '<td>' + a.nombre + '</td>'
        + '<td>'
          + '<button onclick ="remove('+listaAccesorios.indexOf(a)+')" type = "button" class = "btn btn-danger">Eliminar</button>'            
        + '</td>'
        + '</tr>'
    );
  });                    
  
}

//Modal de insercion de accesorios
function insertarAccesorios(){
  // accesorios = 
  let nombre = document.getElementById("txtNombreAccesorio").value;
  let accesorio = {
      nombre: nombre,
  };

  if(!validarCamposModal()){
      listaAccesorios.push(accesorio);
      listAccesoriosModificacion();
      cerrarPopupAccesorios();
      $("#txtNombreAccesorio").val("");
  }
}

function validarCamposModal(){
  let nombre = document.getElementById("txtNombreAccesorio").value;
  let bandera = false;
  let divAlerta = document.getElementById("alertCampoAccesorioModal");

  if(nombre == ''){        
      divAlerta.style.display = "block";
      
      divAlerta.className= ("alert alert-danger mt-2");
      divAlerta.innerText = 'Ingrese el nombre del accesorio';

      setTimeout(function(){
          divAlerta.style.display = "none";
      },5000); 
      
      return bandera =  true;
  } 
  return bandera;   
}

function remove(indice){
  listaAccesorios.splice(indice, 1);
  listAccesoriosModificacion();
}

