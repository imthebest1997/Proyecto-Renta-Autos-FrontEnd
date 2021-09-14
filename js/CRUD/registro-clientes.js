function serializeForm(){        
    let cliente = {
        "nombre" : $("#txtNombreCliente").val(),       
        "cedula" : $("#txtCedulaCliente").val(),
        "telefono" : $("#txtTelefonoCliente").val(), 
        "celular" : $("#txtCelularCliente").val(),
        "correoElectronico" : $("#txtCorreoElectronicoCliente").val(),
        "numeroLicencia": $("#txtNumeroLicenciaCliente").val()
    };
    return cliente;
}

function save(){
    var dataForm = serializeForm();
    console.log(dataForm);
    var requestBody = JSON.stringify(dataForm);
    console.log(requestBody);
    //Utilizar jQuery AJAX para enviar al Backend
    $.ajax({        
        type: "POST", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/cliente/create", //Dirección para realizar la petición HTTP
        data: requestBody, //El contenido Body de la petición HTTP                
        contentType : "application/json",
        crossDomain: true,
        dataType: "json",
        success : function(response){
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'El registro de cliente ha sido creado correctamente!'
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
    $("#btnRegistrarCliente").click(function(){        
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
    document.getElementById("txtNombreCliente").value = '';       
    document.getElementById("txtCedulaCliente").value = '';       
    document.getElementById("txtTelefonoCliente").value = '';       
    document.getElementById("txtCelularCliente").value = '';       
    document.getElementById("txtCorreoElectronicoCliente").value = '';       
    document.getElementById("txtNumeroLicenciaCliente").value = '';       
}

function validarCampos(){
    let nombre = $("#txtNombreCliente").val();       
    let cedula = $("#txtCedulaCliente").val();
    let telefono = $("#txtTelefonoCliente").val();
    let celular = $("#txtCelularCliente").val();
    let correoElectronico = $("#txtCorreoElectronicoCliente").val();
    let numLicencia = $("#txtNumeroLicenciaCliente").val();
    
    let bandera = false;

    if(nombre == "" || cedula == "" || telefono == "" || celular == "" || correoElectronico == "" || numLicencia == ''){
        bandera = true;
        return bandera;
    }
    return bandera;
}

function validarCedula(){
    let cad = document.getElementById("txtCedulaCliente").value.trim();
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
    let correo = document.getElementById("txtCorreoElectronicoCliente").value;
    let expresionRegular = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    if (expresionRegular.exec(correo)){
        bandera = true;
        return bandera;        
    }
    return bandera;
}