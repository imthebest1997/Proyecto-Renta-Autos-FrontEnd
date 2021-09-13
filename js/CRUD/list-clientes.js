function show(list){
    let i = 1;
    $("#tblaClientes").empty(); //Eliminar todo el contenido de la tabla
    list.forEach(cliente =>{        
        $("#tblaClientes").append('<tr>' 
            + '<td>' + cliente.codigoCliente + '</td>'
            + '<td>' + cliente.nombre + '</td>' 
            + '<td>' + cliente.cedula + '</td>'
            + '<td>' + cliente.telefono + '</td>'
            + '<td>' + cliente.celular + '</td>'
            + '<td>' + cliente.correoElectronico + '</td>'
            + '<td>' + cliente.numeroLicencia + '</td>'
            + '<td>'
                // + '<button onclick ="retrieve('+cliente.codigoAutomovil+')" type = "button" class = "btn btn-primary" data-bs-toggle="modal" data-bs-target="#mdCliente">Consultar</button>'            
                + '<button onclick ="del('+cliente.codigoCliente+')" type = "button" class = "btn btn-danger">Eliminar</button>'            
            + '</td>'
            
        +'</tr>')    
        i++;
    });
}

function list(){
    $.ajax({
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/cliente/list", //Dirección para realizar la petición HTTP
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

$(function(){    
    list();
});


function retrieve(codigo){

    $.ajax({        
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/cliente/retrieve/" + codigo, //Dirección para realizar la petición HTTP        
        contentType : "application/json",
        dataType : "json",
        success : function(response){
    
            console.log(response);    
            //La response contiene el objeto de tipo cliente
            let cliente = response;    
                    
            $("#spDisponibilidad").html(disponibilidad);
            $("#tblAccesorios").empty(); //Eliminar el contenido del tbody de la tabla
           
            if(cliente.listaAccesorios.length > 0){
                cliente.listaAccesorios.forEach(accesorio =>{
                    $("#tblAccesorios").append('<tr>'
                        + '<td>' + accesorio.codigoAccesorios + '</td>'
                        + '<td>' + accesorio.nombre + '</td>'
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


function del(codigo){
    $.ajax({        
        type: "DELETE", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/cliente/delete/" + codigo, //Dirección para realizar la petición HTTP        
        contentType : "application/json",        
        success : function(response){
            console.log(response);    
            list();            
		},
		error : function(err){
			console.error(err);
		}        
    });
}
