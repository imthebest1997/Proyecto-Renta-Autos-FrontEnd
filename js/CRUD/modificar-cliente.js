let arregloGeneral = [];
function contarrows(nombreTabla){
    var i=0;
    var tabla = document.getElementById(nombreTabla);
    var total = tabla.rows.length;
    
    for(j=1;j<=total-1;j++){
       let codigo = tabla.rows[j].cells[0].childNodes[0].nodeValue;  
       let dato = tabla.rows[j].cells[1].childNodes[0].nodeValue;
       let dato_2 = tabla.rows[j].cells[2].childNodes[0].nodeValue;
       let dato_3 = tabla.rows[j].cells[3].childNodes[0].nodeValue;
       let dato_4 = tabla.rows[j].cells[4].childNodes[0].nodeValue;
       let dato_5 = tabla.rows[j].cells[5].childNodes[0].nodeValue;
       let dato_6 = tabla.rows[j].cells[6].childNodes[0].nodeValue;

       let cliente = {
            "codigoCliente": codigo,
            "nombre" : dato,       
            "cedula" : dato_2,
            "telefono" : dato_3, 
            "celular" : dato_4,
            "correoElectronico" : dato_5,
            "numeroLicencia": dato_6
        };
    
        arregloGeneral[i]=cliente;
       i++;
   }
   return arregloGeneral;
}

var indice;

document.querySelector('#tblaClientes').onclick = function(ev) {
    indice = ev.target.parentElement.rowIndex;
    obtenerDatos(indice);
}
  
function obtenerDatos(indice){
    let cliente = contarrows("tablaClientes");
    let codigo  = cliente[indice-1].codigoCliente;
    let nombre = cliente[indice-1].nombre;
    let cedula = cliente[indice-1].cedula;
    let telefono = cliente[indice-1].telefono;
    let celular = cliente[indice-1].celular;
    let correoElectronico = cliente[indice-1].correoElectronico;
    let numeroLicencia = cliente[indice-1].numeroLicencia;

    document.getElementById("txtCodigoCliente").value = codigo;    
    document.getElementById("txtNombreCliente").value = nombre;       
    document.getElementById("txtCedulaCliente").value = cedula;       
    document.getElementById("txtTelefonoCliente").value = telefono;       
    document.getElementById("txtCelularCliente").value = celular;       
    document.getElementById("txtCorreoElectronicoCliente").value = correoElectronico;       
    document.getElementById("txtNumeroLicenciaCliente").value = numeroLicencia;       
}

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

//UPDATE
function serializeForm(){        
    let cliente = {
        "nombre" : $("#txtNombreCliente").val(),       
        "cedula" : $("#txtCedulaCliente").val(),
        "telefono" : $("#txtTelefonoCliente").val(), 
        "celular" : $("#txtCelularCliente").val(),
        "correoElectronico" : $("#txtCorreoElectronicoCliente").val(),
        "numeroLicencia": $("#txtNumeroLicenciaCliente").val(),
        "codigoCliente": $("#txtCodigoCliente").val()
    };
    return cliente;
}

function save(){
    var cliente = serializeForm();
    console.log(cliente);
    var requestBody = JSON.stringify(cliente);
    console.log(requestBody);
    let codigo = cliente.codigoCliente;
    //Utilizar jQuery AJAX para enviar al Backend
    $.ajax({        
        type: "PUT", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/cliente/update/" + codigo, //Dirección para realizar la petición HTTP
        data: requestBody, //El contenido Body de la petición HTTP                
        contentType : "application/json",
        crossDomain: true,
        dataType: "json",
        success : function(response){
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Modificación realizada con exito!'
              })

            setTimeout(() => {
                location.reload();
            }, 3000);
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
    list();
    $("#btnModificarCliente").click(function(){        
        if(!validarCampos() && validarEmail()){
            if(validarCedula()){
                save();  
                limpiarCampos();  
                list();       
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


function show(list){
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
        +'</tr>')    
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
