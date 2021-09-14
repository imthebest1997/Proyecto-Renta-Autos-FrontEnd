function serializeForm(){        
    let empleado = {
        "nombre" : $("#txtNombreEmpleado").val(),       
        "cedula" : $("#txtCedulaEmpleado").val(),
        "telefono" : $("#txtTelefonoEmpleado").val(), 
        "celular" : $("#txtCelularEmpleado").val(),
        "correoElectronico" : $("#txtCorreoElectronicoEmpleado").val(),
    };
    return empleado;
}

function save(){
    var dataForm = serializeForm();
    console.log(dataForm);
    var requestBody = JSON.stringify(dataForm);
    console.log(requestBody);
    //Utilizar jQuery AJAX para enviar al Backend
    $.ajax({        
        type: "POST", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/empleado/create", //Dirección para realizar la petición HTTP
        data: requestBody, //El contenido Body de la petición HTTP                
        contentType : "application/json",
        crossDomain: true,
        dataType: "json",
        success : function(response){
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'El registro del empleado ha sido creado correctamente!'
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
    $("#btnRegistrarEmpleado").click(function(){        
        if(!validarCampos() && validarEmail()){
            if(validarCedula()){
                save();  
                limpiarCampos();         
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'La cédula insertada es incorrecta!',
                  })    
            }
        }else if(validarCampos()){
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'No olvide, llenar todos los campos!',
              })
        }else if(!validarEmail()){
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'El correo ingresado es invalido',
              })            
        }
        
    });
});


function limpiarCampos(){
    document.getElementById("txtNombreEmpleado").value = '';       
    document.getElementById("txtCedulaEmpleado").value = '';       
    document.getElementById("txtTelefonoEmpleado").value = '';       
    document.getElementById("txtCelularEmpleado").value = '';       
    document.getElementById("txtCorreoElectronicoEmpleado").value = '';       

}

function validarCampos(){
    let nombre = $("#txtNombreCliente").val();       
    let cedula = $("#txtCedulaCliente").val();
    let telefono = $("#txtTelefonoCliente").val();
    let celular = $("#txtCelularCliente").val();
    let correoElectronico = $("#txtCorreoElectronicoCliente").val();
    
    let bandera = false;

    if(nombre == "" || cedula == "" || telefono == "" || celular == "" || correoElectronico == ""){
        bandera = true;
        return bandera;
    }
    return bandera;
}

function validarCedula(){
    let cad = document.getElementById("txtCedulaEmpleado").value.trim();
    let total = 0;
    let longitud = cad.length;
    let temporal = "";
    if(longitud==13){
        temporal = cad.split("",10);        
        cad = "";
        for(let i = 0;i<10;i++){
            cad+=temporal[i];
        }
        longitud = 10;
    }
    let longcheck = longitud - 1;
    let bandera = false;

    if (cad !== "" && longitud === 10){
      for(i = 0; i < longcheck; i++){
        if (i%2 === 0) {
          var aux = cad.charAt(i) * 2;
          if (aux > 9) aux -= 9;
          total += aux;
        } else {
          total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
        }
      }

      total = total % 10 ? 10 - total % 10 : 0;

      if (cad.charAt(longitud-1) == total) {
        bandera = true;
        return bandera;
      }else{
        return bandera;
      }
    }
}

function validarEmail() {
    let bandera = false;
    let correo = document.getElementById("txtCorreoElectronicoEmpleado").value;
    let expresionRegular = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    if (expresionRegular.exec(correo)){
        bandera = true;
        return bandera;        
    }
    return bandera;
}