function show(list){
    let i = 1;
    let disponibilidad = 0;
    $("#tblaAutomoviles").empty(); //Eliminar todo el contenido de la tabla
    list.forEach(automovil =>{        
        if(automovil.disponibilidad){
            disponibilidad = 1;
        }else{
            disponibilidad = 0;
        }
        $("#tblaAutomoviles").append('<tr>' 
            + '<td>' + i + '</td>'
            + '<td>' + automovil.marca + '</td>'
            + '<td>' + automovil.tipoAuto + '</td>' 
            + '<td>' + automovil.numPlaca + '</td>'
            + '<td>' + automovil.color + '</td>'
            + '<td>' + disponibilidad + '</td>' 
        +'</tr>')    
        i++;
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

$( document ).ready(function() {    
    list();
    // $("#btnEliminar").click(function(){        
    //     del();
    // });
});