let accesorios = [];
function serializeForm(){        
    let automovil = {
        "marca" : $("#txtMarcaAutomovil").val(),       
        "tipoAuto" : $("#txtTipoAuto").val(),
        "numeroPlaca" : $("#txtNumPlacaAutomovil").val(), 
        "color" : $("#txtColorAutomovil").val(),
        "disponibilidad" : 1,
        "precioPorDia": $("#txtPrecioDiaRentaAutomovil").val(),
        "listaAccesorios": accesorios
    };
    return automovil;
}

function save(){
    var automovil = serializeForm();
    var requestBody = JSON.stringify(automovil);
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
              });
              $("#tblaAccesorios").empty();
		},
		error : function(err){
			console.error(err);
		},
    });
}

$(function() {    
    let precio_str,precio;
    $("#btnRegistrarAuto").click(function(){        
        precio_str = $("#txtPrecioDiaRentaAutomovil").val();
        precio = parseFloat(precio_str);    
        if(!validarCampos() && precio>50){
            save();  
            limpiarCampos();          
        }else if(validarCampos()){
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'No olvide, llenar todos los campos!',
              })
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'Warning...',
                text: 'El precio ingresado es incorrecto!',
              })
        }
    });

    $("#insertarAccesorioModal").click(function(){
        insertarAccesorios();
    });
});


function limpiarCampos(){
    $("#txtNumPlacaAutomovil").val("");
    $("#txtMarcaAutomovil").val("");
    $("#txtColorAutomovil").val("");
    $("#txtTipoAuto").val("deportivo");
    $("#txtPrecioDiaRentaAutomovil").val("50.00");
}

function validarCampos(){
    let numPlaca = document.getElementById("txtNumPlacaAutomovil").value;
    let marca = document.getElementById("txtMarcaAutomovil").value;
    let color = document.getElementById("txtColorAutomovil").value;

    let bandera = false;

    if(numPlaca == "" || marca == "" || color == ""){
        bandera = true;
        return bandera;
    }
    return bandera;
}



///MODAL
function validarCamposModal(){
    let nombre = document.getElementById("txtNombreAccesorio").value;
    let bandera = false;
    let divAlerta = document.getElementById("alertCampoAccesorioModal");

    if(nombre == ''){        
        divAlerta.style.display = "block";
        
        divAlerta.className= ("alert alert-danger mt-2");
        divAlerta.innerText = 'Ingrese el nombre del accesorio';

        setTimeout(function(){
            divAlerta.style.display = "none";
        },5000); 
        
        return bandera =  true;
    } 
    return bandera;   
}

function insertarAccesorios(){
    let nombre = document.getElementById("txtNombreAccesorio").value;
    let accesorio = {
        nombre: nombre,
    };

    if(!validarCamposModal()){
        accesorios.push(accesorio);
        list();
        cerrarPopupAccesorios();
        limpiarCamposModal();
    }
}

function list(){
    $("#tblaAccesorios").empty();
    accesorios.forEach((x)=>{
        $("#tblaAccesorios").append('<tr>'
            + '<td>' + x.nombre + '</td>'
            + '<td>'
            + '<button onclick="remove('+ accesorios.indexOf(x) +')" type="button" class="btn btn-danger">Eliminar</button>'
            + '</td>'                        
            +'</tr>');
    });
}

function remove(indice){
    accesorios.splice(indice, 1);
    list();
}

function cerrarPopupAccesorios() {
    $("#listaAccesorios").modal('hide');//ocultamos el modal
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
    $('.modal-backdrop').remove();//eliminamos el backdrop del modal
}

function limpiarCamposModal(){
    document.getElementById("txtNombreAccesorio").value = '';
}
