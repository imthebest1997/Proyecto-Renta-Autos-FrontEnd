function show(list){
    let i = 1;
    $("#tblaAutomoviles").empty(); //Eliminar todo el contenido de la tabla
    list.forEach(automovil =>{      

        $("#tblaAutomoviles").append('<tr>' 
            + '<td>' + automovil.marca + '</td>'
            + '<td>' + automovil.tipoAuto + '</td>' 
            + '<td>' + automovil.numeroPlaca + '</td>'
            + '<td>' + automovil.color + '</td>'
            + '<td>' +"$ " +automovil.precioPorDia + '</td>'
            + '<td>' 
                + '<button onclick ="retrieve('+automovil.codigoAutomovil+')" type = "button" class = "btn btn-primary" data-bs-toggle="modal" data-bs-target="#mdAutomovil">Consultar</button>'            
            + '</td>' 
        +'</tr>')    
        i++;
    });
}

function listAutomoviles(){
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

function listByDisponibilidad(disponibilidad){
    $.ajax({
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/automovil/list/" + disponibilidad, //Dirección para realizar la petición HTTP
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
                    icon: 'warning',
                    title: 'Warning',
                    text: xhr.responseText,
                  })
            }
            if(xhr.status == 500){
                alert(xhr.responseText);
            }
        }       
        
    });
}

function retrieve(codigo){
    let disponibilidad = "No disponible";
    $.ajax({        
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/automovil/retrieve/" + codigo, //Dirección para realizar la petición HTTP        
        contentType : "application/json",
        dataType : "json",
        success : function(response){
    
            console.log(response);    
            //La response contiene el objeto de tipo automovil
            let automovil = response;    
                    
            if(automovil.disponibilidad){
                disponibilidad = "Disponible";
            }
            $("#spDisponibilidad").html(disponibilidad);
            $("#tblAccesorios").empty(); //Eliminar el contenido del tbody de la tabla
           
            if(automovil.listaAccesorios.length > 0){
                automovil.listaAccesorios.forEach(accesorio =>{
                    $("#tblAccesorios").append('<tr>'
                        + '<td>' + accesorio.codigoAccesorios + '</td>'
                        + '<td>' + accesorio.nombre + '</td>'
                        + '<td>'
                            + '<button onclick="delAccesorios('+ accesorio.codigoAccesorios +')" type="button" class="btn btn-danger">Eliminar</button>'
                        + '</td>'                                    
                        + '</tr>'
                    );
                });                    
            }else{
                $("#tblAccesorios").append('<tr>'
                    + '<td colspan = "2">' + "El automovil no contiene accesorios" + '</td>'
                    + '</tr>'
                );        
            }

            $("#txtCodigoAutomovil").val(codigo); //Setter

		},
		error : function(err){
			console.error(err);
		}
    });
}

function del(){
    let codigo = $("#txtCodigoAutomovil").val();
    $.ajax({        
        type: "DELETE", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/automovil/delete/" + codigo, //Dirección para realizar la petición HTTP        
        contentType : "application/json",        
        success : function(response){
            console.log(response);    
            listAutomoviles();            
		},
		error : function(err){
			console.error(err);
		}        
    });
}


function delAccesorios(codigo){
    $.ajax({        
        type: "DELETE", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/accesorios/delete/" + codigo, //Dirección para realizar la petición HTTP        
        contentType : "application/json",        
        success : function(response){
            console.log(response);    
		},
		error : function(err){
			console.error(err);
		}        
    });
    cerrarPopupModalJuegos();
    
}

$( function(){
    listAutomoviles();    
    $("#btnBuscarPorDisponibilidad").click(function(){

        if(document.getElementById("radioDisponible").checked){
            listByDisponibilidad(1);
        }
        
        if(document.getElementById("radioNoDisponible").checked){
            listByDisponibilidad(0);
        }

        if(document.getElementById("radioCompleto").checked){
            listAutomoviles();
        }
    });

    $("#btnEliminarAutomovil").click(function(){
        del();
        cerrarPopupModalJuegos();
    });


});    

function cerrarPopupModalJuegos() {
    $("#mdAutomovil").modal('hide');//ocultamos el modal
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
    $('.modal-backdrop').remove();//eliminamos el backdrop del modal
}



        