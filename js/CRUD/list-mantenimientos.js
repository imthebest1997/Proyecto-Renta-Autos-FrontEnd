let listaAutomoviles = [];
let listaDetalleMantenimiento = [];
// let indice;
function showMantenimientos(list){
    $("#tblaMantenimientos").empty(); //Eliminar todo el contenido de la tabla
    let i = 1;
    list.forEach(mantenimiento =>{      
        let fechaInicio = mantenimiento.fechaInicio;
        let nuevaFechaInicio = fechaInicio.split("T");

        let fechaFin = mantenimiento.fechaFin;
        let nuevaFechaFin = fechaFin.split("T");
 
        $("#tblaMantenimientos").append('<tr>' 
            + '<td>' + i + '</td>'
            + '<td>' + nuevaFechaInicio[0] + '</td>'
            + '<td>' + nuevaFechaFin[0] + '</td>'
            + '<td>' 
                + '<button onclick ="retrieveDetalleMantenimiento('+ mantenimiento.codigoMantenimiento+'),setearNombreAutomovil('+mantenimiento.codigoMantenimiento+')" type = "button" class = "btn btn-primary" data-bs-toggle="modal" data-bs-target="#mdMantenimiento">Consultar</button>'            
            + '</td>' 
            + '<td>' 
                + '<button onclick ="delMantenimiento('+ mantenimiento.codigoMantenimiento+')" type = "button" class = "btn btn-danger">Eliminar</button>'            
            + '</td>' 
        +'</tr>')    
        i++;
    });
}

//Se realiza una consulta de la lista de autos para verificar los codigos de los mantenimientos realizados
function listAutomoviles(){
    $.ajax({
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/automovil/list", //Dirección para realizar la petición HTTP
        contentType : "application/json",
        dataType: "json",
        success : function(response){
            copiarArreglo(response);
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

function copiarArreglo(array){
    listaAutomoviles = [];
    let tam = array.length;
    for(let i = 0;i<tam;i++){
      listaAutomoviles[i] = array[i];    
    }
}
  
function delMantenimiento(codigo){
    $.ajax({        
        type: "DELETE", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/mantenimiento/delete/" + codigo, //Dirección para realizar la petición HTTP        
        contentType : "application/json",        
        success : function(response){
            console.log(response);    
            listMantenimientos();
		},
		error : function(err){
			console.error(err);
		}        
    });

}

function delDetalleMantenimiento(codigo){
    $.ajax({        
        type: "DELETE", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/detalle_mantenimiento/delete/" + codigo, //Dirección para realizar la petición HTTP        
        contentType : "application/json",        
        success : function(response){
            console.log(response);                       
            location.reload();
		},
		error : function(err){
			console.error(err);
		}        
    });

}


function setearNombreAutomovil(codigo){
    console.log(listaAutomoviles);
    listaAutomoviles.forEach(automovil =>{
        let tam = automovil.listaMantenimientos.length;
        if(tam>0){
            automovil.listaMantenimientos.forEach(detalle =>{
                if(codigo == detalle.codigoMantenimiento){
                    $("#txtNombreAuto").val(automovil.marca);                
                }    
            })
        }        
    });
}

function showDetalleMantenimientos(list){
    $("#tblaDetalleMantenimientos").empty(); //Eliminar todo el contenido de la tabla
    let i = 1;
    list.detalleMantenimiento.forEach(detalleMantenimiento =>{      
        $("#tblaDetalleMantenimientos").append('<tr>' 
            + '<td>' + i + '</td>'
            + '<td>' + detalleMantenimiento.nombre + '</td>'
            + '<td>' + detalleMantenimiento.descripcion + '</td>'
            + '<td>' 
                + '<button onclick ="delDetalleMantenimiento('+ detalleMantenimiento.codigoDetalleMantenimiento+')" type = "button" class = "btn btn-danger">Eliminar</button>'            
            + '</td>' 

        +'</tr>')    
        i++;
    });
}

function retrieveDetalleMantenimiento(codigo){
    $.ajax({        
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/mantenimiento/retrieve/" + codigo, //Dirección para realizar la petición HTTP        
        contentType : "application/json",
        dataType : "json",
        success : function(response){
            console.log(response);    
            showDetalleMantenimientos(response);                        
            // listaDetalleMantenimiento = response;
        },
		error : function(err){
			console.error(err);
		}
    });    
}

function retrieveAuto(codigo){
    $.ajax({        
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/automovil/retrieve/" + codigo, //Dirección para realizar la petición HTTP        
        contentType : "application/json",
        dataType : "json",
        success : function(response){
            console.log(response);    
            console.log("La marca es: " + response.marca);
            //La response contiene el objeto de tipo variedad
            let marca = response.marca;            
            return nombreAutomovil = response.marca;            
            
        },
		error : function(err){
			console.error(err);
		}
    });
}

function listMantenimientos(){
    $.ajax({
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/mantenimiento/list", //Dirección para realizar la petición HTTP
        contentType : "application/json",
        dataType: "json",
        success : function(response){
            console.log(response);
            showMantenimientos(response);
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


$( function(){
    listMantenimientos();    
    listAutomoviles();
    // console.log("Nombre del automovil 2: " +  nombreAutomovil);
});    

function cerrarPopupModalJuegos() {
    $("#mdAutomovil").modal('hide');//ocultamos el modal
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
    $('.modal-backdrop').remove();//eliminamos el backdrop del modal
}

//Obtener la fila eliminada
function obtenerFilaEliminar(){
    let indice;
    document.querySelector('#tblaDetalleMantenimientos').onclick = function(ev) {
        indice = ev.target.parentElement.rowIndex;        
    } 
    return indice;       
}
