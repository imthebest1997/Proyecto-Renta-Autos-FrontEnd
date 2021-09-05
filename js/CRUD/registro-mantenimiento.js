let automoviles = [];
let detalleMantenimientos = [];
function listAutomoviles(){
    $.ajax({
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/automovil/list", //Dirección para realizar la petición HTTP
        contentType : "application/json",
        dataType: "json",
        success : function(response){
            console.log(response);
            cargarSelect(response);
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

function cargarSelect(automoviles){
    let selectAutos = document.getElementById("txtAutomovil");
    automoviles.forEach(auto => {
        let option = document.createElement("option");
        option.innerText = auto.marca;
        option.value = auto.codigoAutomovil;
        selectAutos.append(option);
    });    
}

function verificarCamposIngreso(){
    let nombre = $("#txtNombreDetalleM").val();
    let detalleM = $("#txtDetalleM").val();
    let bandera = false;
    let divMensaje = document.getElementById("alertCamposDetalleMModal");
    divMensaje.style.display = 'block';
    if(nombre == '' || detalleM == ''){
        divMensaje.className = "alert alert-danger mt-3";
        divMensaje.innerText = 'Ingrese todo los campos';
        setTimeout(function(){
            divMensaje.style.display = 'none';
        },3000);
        bandera = true;
        return bandera;
    }
    return bandera;
}

function ingresarDetallesM(){
    let nombre = $("#txtNombreDetalleM").val();
    let detalleM = $("#txtDetalleM").val();
    
    let objeto = {
        nombre: nombre,
        descripcion: detalleM,
    }
    detalleMantenimientos.push(objeto);
}

function listDetallesM(){
    $("#tblaMantenimiento").empty();
    detalleMantenimientos.forEach(detalles =>{
        $("#tblaMantenimiento").append('<tr>'
            + '<td>' + detalles.nombre + '</td>'
            + '<td>' + detalles.descripcion + '</td>'
            + '<td>'
            + '<button onclick="remove('+ detalleMantenimientos.indexOf(detalles) +')" type="button" class="btn btn-danger">Eliminar</button>'
            + '</td>'
        +'</tr>'        
        )
    });
}

function remove(indice){
    detalleMantenimientos.splice(indice,1);
    listDetallesM();
}

function limpiarCamposModal(){
    $("#txtNombreDetalleM").val("");
    $("#txtDetalleM").val("");
    
}

function serializeForm(){        
    let mantenimiento = {
        "fechaInicio" : $("#txtFechaInicioMantenimiento").val(),       
        "fechaFin" : $("#txtFechaFinMantenimiento").val(),
        "automovil": $("#txtAutomovil").val(),
        "detalleMantenimiento" : detalleMantenimientos, 
    };
    return mantenimiento;
}

function save(){
    var mantenimiento = serializeForm();
    var requestBody = JSON.stringify(mantenimiento);
    console.log(requestBody);
    //Utilizar jQuery AJAX para enviar al Backend
    $.ajax({        
        type: "POST", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/mantenimiento/create", //Dirección para realizar la petición HTTP
        data: requestBody, //El contenido Body de la petición HTTP                
        contentType : "application/json",
        crossDomain: true,
        dataType: "json",
        success : function(response){
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'El registro de mantenimiento ha sido creado correctamente!'
              });
              $("#tblaMantenimiento").empty();
		},
		error : function(err){
			console.error(err);
		},
    });
}


$(function(){
    listAutomoviles();
    $("#insertarDetalleMModal").click(function(){
        if(!verificarCamposIngreso()){
            ingresarDetallesM();
            listDetallesM();
            cerrarPopupDetallesM();
            limpiarCamposModal();
        }
    });

    $("#btnRegistrarMantenimiento").click(function(){
        save();
    });
    
});


function cerrarPopupDetallesM() {
    $("#listaDetalleMantenimiento").modal('hide');//ocultamos el modal
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
    $('.modal-backdrop').remove();//eliminamos el backdrop del modal
}