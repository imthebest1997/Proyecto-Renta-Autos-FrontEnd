function serializeForm(){        
    let automovil = {
        "nombre" : $("#txtNombreAutomovil").val(),
        "tipoAuto" : $("#txtTipoAuto").val(),
        "numPlaca" : $("#txtNumPlacaAutomovil").val(), 
        "marca" : $("#txtMarcaAutomovil").val(),       
        "color" : $("#txtColorAutomovil").val(),
        "disponibilidad" : 1,
    };
    return automovil;
}


function save(){
    var dataForm = serializeForm();
    console.log(dataForm);
    var requestBody = JSON.stringify(dataForm);
    console.log(requestBody);
    //Utilizar jQuery AJAX para enviar al Backend
    $.ajax({        
        type: "POST", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/automovil/create", //Dirección para realizar la petición HTTP
        data: requestBody, //El contenido Body de la petición HTTP                
        contentType : "application/json",
        crossDomain: true,
        dataType: "json",
        success : function(response){
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'El automovil ha sido creado correctamente!'
              })
		},
		error : function(err){
			console.error(err);
		},
        complete: function(result, textStatus) {            
            if(result.status == 201){
                //window.location.href = "index.html";
            }
        }       
    });
}

$(function() {    
    $("#btnRegistrarAuto").click(function(){        
        if(!validarCampos()){
            save();            
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'No olvide, llenar todos los campos!',
              })
        }
        
    });
});


function validarCampos(){
    let nombre = document.getElementById("txtNombreAutomovil").value;
    let numPlaca = document.getElementById("txtNumPlacaAutomovil").value;
    let marca = document.getElementById("txtMarcaAutomovil").value;
    let color = document.getElementById("txtColorAutomovil").value;
    let bandera = false;

    if(nombre == "" || numPlaca == "" || marca == "" || color == ""){
        bandera = true;
        return bandera;
    }
    return bandera;
}