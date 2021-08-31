function show(list){
    let i = 1;
    $("#tblaClientes").empty(); //Eliminar todo el contenido de la tabla
    list.forEach(cliente =>{        
        $("#tblaClientes").append('<tr>' 
            + '<td>' + i + '</td>'
            + '<td>' + cliente.nombre + '</td>' 
            + '<td>' + cliente.cedula + '</td>'
            + '<td>' + cliente.telefono + '</td>'
            + '<td>' + cliente.celular + '</td>'
            + '<td>' + cliente.correoElectronico + '</td>'
            + '<td>' + cliente.numeroLicencia + '</td>' 
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

$( document ).ready(function() {    
    list();
    // $("#btnEliminar").click(function(){        
    //     del();
    // });
});