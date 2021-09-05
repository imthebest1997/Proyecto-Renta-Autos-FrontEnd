function show(list){
    let i = 1;
    $("#tblaEmpleados").empty(); //Eliminar todo el contenido de la tabla
    list.forEach(empleado =>{        
        $("#tblaEmpleados").append('<tr>' 
            + '<td>' + empleado.codigoEmpleado + '</td>'
            + '<td>' + empleado.nombre + '</td>' 
            + '<td>' + empleado.cedula + '</td>'
            + '<td>' + empleado.telefono + '</td>'
            + '<td>' + empleado.celular + '</td>'
            + '<td>' + empleado.correoElectronico + '</td>'
            + '<td>' + empleado.numeroAutosRentados + '</td>' 
            + '<td>'
                + '<button onclick ="del('+empleado.codigoEmpleado+')" type = "button" class = "btn btn-danger">Eliminar</button>'            
            + '</td>'

        +'</tr>')    
        i++;
    });
}

function list(){
    $.ajax({
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/empleado/list", //Dirección para realizar la petición HTTP
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

$( document ).ready(function() {    
    list();
});


function del(codigo){
    $.ajax({        
        type: "DELETE", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/empleado/delete/" + codigo, //Dirección para realizar la petición HTTP        
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
