// Busqueda en tiempo real
  
let arregloGeneral = [];
function contarrows(nombreTabla){
    var i=0;
    var tabla = document.getElementById(nombreTabla);
    var total = tabla.rows.length;
    
    for(j=1;j<=total-1;j++){
        let codigoEmpleado = tabla.rows[j].cells[0].childNodes[0].nodeValue;;
        let dato = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        let dato_2=tabla.rows[j].cells[2].childNodes[0].nodeValue;
        let dato_3=tabla.rows[j].cells[3].childNodes[0].nodeValue;
        let dato_4=tabla.rows[j].cells[4].childNodes[0].nodeValue;
        let dato_5=tabla.rows[j].cells[5].childNodes[0].nodeValue;

       let cliente = {
            "codigoEmpleado": codigoEmpleado,
            "nombre" : dato,       
            "cedula" : dato_2,
            "telefono" : dato_3, 
            "celular" : dato_4,
            "correoElectronico" : dato_5,
        };
    
        arregloGeneral[i]=cliente;
       i++;
   }
   return arregloGeneral;
}

var indice;

document.querySelector('#tblaEmpleados').onclick = function(ev) {
    indice = ev.target.parentElement.rowIndex;
    obtenerDatos(indice);
}
  
function obtenerDatos(indice){
    let cliente = contarrows("tablaEmpleados");
    let codigo = cliente[indice-1].codigoEmpleado;
    let nombre = cliente[indice-1].nombre;
    let cedula = cliente[indice-1].cedula;
    let telefono = cliente[indice-1].telefono;
    let celular = cliente[indice-1].celular;
    let correoElectronico = cliente[indice-1].correoElectronico;

    
    document.getElementById("txtCodigoEmpleado").value = codigo;    
    document.getElementById("txtNombreEmpleado").value = nombre;       
    document.getElementById("txtCedulaEmpleado").value = cedula;       
    document.getElementById("txtTelefonoEmpleado").value = telefono;       
    document.getElementById("txtCelularEmpleado").value = celular;       
    document.getElementById("txtCorreoElectronicoEmpleado").value = correoElectronico;       

}

function limpiarCampos(){
    document.getElementById("txtNombreEmpleado").value = '';       
    document.getElementById("txtCedulaEmpleado").value = '';       
    document.getElementById("txtTelefonoEmpleado").value = '';       
    document.getElementById("txtCelularEmpleado").value = '';       
    document.getElementById("txtCorreoElectronicoEmpleado").value = '';       
    document.getElementById("txtNumeroLicenciaEmpleado").value = '';       
}

function validarCampos(){
    let nombre = $("#txtNombreEmpleado").val();       
    let cedula = $("#txtCedulaEmpleado").val();
    let telefono = $("#txtTelefonoEmpleado").val();
    let celular = $("#txtCelularEmpleado").val();
    let correoElectronico = $("#txtCorreoElectronicoEmpleado").val();    
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

//UPDATE
function serializeForm(){        
    let empleado = {
        "nombre" : $("#txtNombreEmpleado").val(),       
        "cedula" : $("#txtCedulaEmpleado").val(),
        "telefono" : $("#txtTelefonoEmpleado").val(), 
        "celular" : $("#txtCelularEmpleado").val(),
        "correoElectronico" : $("#txtCorreoElectronicoEmpleado").val(),
        "codigoEmpleado": $("#txtCodigoEmpleado").val()
    };
    return empleado;
}

function save(){
    var empleado = serializeForm();
    console.log(empleado);
    var requestBody = JSON.stringify(empleado);
    console.log(requestBody);
    let codigo = empleado.codigoEmpleado;
    //Utilizar jQuery AJAX para enviar al Backend
    $.ajax({        
        type: "PUT", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/empleado/update/" + codigo, //Dirección para realizar la petición HTTP
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
    $("#btnModificarEmpleado").click(function(){        
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
