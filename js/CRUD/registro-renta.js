let listaClientes = [];
let listaAutomoviles = [];
let listaEmpleados = [];
let fechas = [];

// Lista de autos disponibles para cargarlo al select 
function listByDisponibilidad(disponibilidad){
    $.ajax({
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/automovil/list/" + disponibilidad, //Dirección para realizar la petición HTTP
        contentType : "application/json",
        dataType: "json",
        success : function(response){
            console.log(response);
            cargarSelectAutos(response);
            listaAutomoviles = response;
            $("#txtPrecioDiaRenta").val(response[0].precioPorDia.toFixed(2));//Setear el precio de renta del auto inicial
        },
		error : function(err){
			console.error(err);
		},
        complete: function(xhr, textStatus) {            
            if(xhr.status == 404){
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: xhr.responseText,
                  })
            }
            if(xhr.status == 500){
                alert(xhr.responseText);
            }
        }       
        
    });
}
// Lista de empleados para cargarlo al select
function listEmpleados(){
    $.ajax({
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/empleado/list", //Dirección para realizar la petición HTTP
        contentType : "application/json",
        dataType: "json",
        success : function(response){
            console.log(response);
            listaEmpleados = response;
            cargarSelectEmpleados(response);
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
// Lista de clientes para cargarlo al select
function listClientes(){
    $.ajax({
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/cliente/list", //Dirección para realizar la petición HTTP
        contentType : "application/json",
        dataType: "json",
        success : function(response){
            console.log(response);
            cargarSelectClientes(response);
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

function cargarSelectAutos(automoviles){
    let selectAutos = document.getElementById("txtAutomovilRenta");
    automoviles.forEach(auto => {
        let option = document.createElement("option");
        option.innerText = auto.marca;
        option.value = auto.codigoAutomovil;
        selectAutos.append(option);
    });    
}

function cargarSelectEmpleados(empleados){
    let selectEmpleados = document.getElementById("txtEmpleadoRenta");
    empleados.forEach(empleado => {
        let option = document.createElement("option");
        option.innerText = empleado.nombre;
        option.value = empleado.codigoEmpleado;
        selectEmpleados.append(option);
    });    
}

function cargarSelectClientes(clientes){
    let selectClientes = document.getElementById("txtClienteRenta");
    clientes.forEach(cliente => {
        let option = document.createElement("option");
        option.innerText = cliente.nombre;
        option.value = cliente.codigoCliente;
        selectClientes.append(option);
    });    
}

function serializeForm(){        
    let renta = {
        "fechaInicio" : $("#txtFechaInicioRenta").val(),       
        "fechaFin" : $("#txtFechaFinRenta").val(),
        "empleado": $("#txtEmpleadoRenta").val(),
        "cliente": $("#txtClienteRenta").val(),
        "automovil": $("#txtAutomovilRenta").val(),
        "total": $("#txtTotalRenta").val(),
    };
    return renta;
}

function save(){
    var rentaAuto = serializeForm();
    var requestBody = JSON.stringify(rentaAuto);
    console.log(requestBody);
    //Utilizar jQuery AJAX para enviar al Backend
    $.ajax({        
        type: "POST", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/renta/create", //Dirección para realizar la petición HTTP
        data: requestBody, //El contenido Body de la petición HTTP                
        contentType : "application/json",
        crossDomain: true,
        dataType: "json",
        success : function(response){
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'El registro de la renta ha sido creado correctamente!'
              });
              
            setTimeout(() => {
                location.reload();
            },3000);
        },
    		error : function(err){
			console.error(err);
		},
    });
}

//Verificar que no existan campos vacios
function validarCampos(){
    let precioDia = $("#txtPrecioDiaRenta").val();
    let totalRenta = $("#txtTotalRenta").val();
    let bandera = false;
    
    if(precioDia.length == "" || totalRenta.length == ""){
        bandera = true;
        return bandera;
    }
    return bandera;
}

$(function(){
    listByDisponibilidad(true);//Cargar los selects con la lista de autos
    listEmpleados();//Cargar los selects con la lista de empleados
    listClientes();//Cargar los selects con la lista de clientes
    cambiarPrecioRenta();//Cambiar dinámicamente el precio según el auto seleccionado
    setearFecha();//Setea la fecha actual en la fecha de inicio
    $("#btnRegistrarRenta").click(function(){
        if(!validarCampos() && !verificarRangoFechas()){
            save();
            actualizarEstadoAutomovil();
            actualizarAutosRentadosCliente();
            limpiarCampos();
        }else if(verificarRangoFechas()){
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'El rango de fecha es erroneo'
              });                                   
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'No olvide llenar todos los campos..!'
              });           
        }
    }); 

    actualizarPrecio();
});

//Calcula el # de dias de renta del auto
function diasRenta(){
    let fechaInicial = $("#txtFechaInicioRenta").val();
    let fechaFin = $("#txtFechaFinRenta").val();
    
    let fechaInicial_ = new Date(fechaInicial);
    let fechaFin_ = new Date(fechaFin);

    let milisegundosDia = 24*60*60*1000;
    let milisegundosTranscurridos = Math.abs(fechaInicial_.getTime() - fechaFin_.getTime());
    let diasTranscurridos = Math.round(milisegundosTranscurridos/milisegundosDia);

    return diasTranscurridos;
}

//Verifica que el rango de fechas ingresado sea correcto
function verificarRangoFechas(){
    let fechaInicial = $("#txtFechaInicioRenta").val();
    let fechaFin = $("#txtFechaFinRenta").val();
    let bandera = false;
    if(fechaFin < fechaInicial){
        bandera = true;
        return bandera; 
    }
    return bandera;
}
//Setear fecha actual en el campo fecha inicio
function setearFecha(){
    let fecha = new Date();
    let mesActual,diaActual;
    if((fecha.getMonth()+1) <10){
        mesActual = "0"+(fecha.getMonth()+1);
    }else{
        mesActual = fecha.getMonth()+1;
    }    

    diaActual = fecha.getDate();

    if(fecha.getDate() < 10){
        diaActual = "0" + fecha.getDate();        
    }

    let fechaActual = fecha.getFullYear()+"-"+mesActual+ "-" + diaActual;
    document.getElementById("txtFechaInicioRenta").value = fechaActual;  
}

function cambiarPrecioRenta(){
    let selectAutos = document.getElementById("txtAutomovilRenta");
    let indiceAuto;

    selectAutos.onchange = function(){
        indiceAuto = selectAutos.value;
        listaAutomoviles.forEach(auto=>{
            if(auto.codigoAutomovil == indiceAuto){
                $("#txtPrecioDiaRenta").val(auto.precioPorDia.toFixed(2));                
                calcularTotal();
            }
        });

    };
}

function calcularTotal(){
    let dias = diasRenta();//Calcular el # de dias entre la fecha de inicio y fin        
    let precioRenta = $("#txtPrecioDiaRenta").val();
    let total = dias*precioRenta;
 
    $("#txtTotalRenta").val(total.toFixed(2));
}

function actualizarPrecio(){
    // let fechaInicial = $("#txtFechaInicioRenta").val();
    let fechaFin = document.getElementById("txtFechaFinRenta");
    let fechaInicial = document.getElementById("txtFechaInicioRenta");
    
    fechaInicial.addEventListener("change",function(){
        calcularTotal();
    });

    fechaFin.addEventListener("change",function(){
        calcularTotal();
    });
}

//Cambiar el estado de un auto a no disponible, después de la renta
function actualizarEstadoAutomovil(){
    let codigoAutomovil = $("#txtAutomovilRenta").val();
    var automovil = serializeAutomovil();
    var requestBody = JSON.stringify(automovil);
    console.log(requestBody);
    //Utilizar jQuery AJAX para enviar al Backend
    $.ajax({        
        type: "PUT", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/automovil/update/"+codigoAutomovil, //Dirección para realizar la petición HTTP
        data: requestBody, //El contenido Body de la petición HTTP                
        contentType : "application/json",
        crossDomain: true,
        dataType: "json",
        success : function(response){
            console.log(response);
        },
        error : function(err){
        console.error(err);
        },
    });
}

function actualizarAutosRentadosCliente(){
    let codigoEmpleado = $("#txtEmpleadoRenta").val();
    var empleado = serializeEmpleado();
    var requestBody = JSON.stringify(empleado);
    console.log(requestBody);
    //Utilizar jQuery AJAX para enviar al Backend
    $.ajax({        
        type: "PUT", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/empleado/update/"+codigoEmpleado, //Dirección para realizar la petición HTTP
        data: requestBody, //El contenido Body de la petición HTTP                
        contentType : "application/json",
        crossDomain: true,
        dataType: "json",
        success : function(response){
            console.log(response);
        },
        error : function(err){
        console.error(err);
        },
    });

}


function serializeAutomovil(){ 
    let codigoAutomovil = $("#txtAutomovilRenta").val();
    let marca,tipoAuto,numeroPlaca,color,listaAccesorios,precio;
    listaAutomoviles.forEach(auto=>{
        if(auto.codigoAutomovil == codigoAutomovil){
            marca = auto.marca;
            tipoAuto = auto.tipoAuto;
            numeroPlaca = auto.numeroPlaca;
            color = auto.color;
            listaAccesorios = auto.listaAccesorios;
            precio = auto.precioPorDia;
        }
    });

    let automovil = {
        "codigoAutomovil": codigoAutomovil,
        "marca" : marca,       
        "tipoAuto" : tipoAuto,
        "numeroPlaca" : numeroPlaca, 
        "color" : color,
        "precioPorDia": precio,
        "disponibilidad" : false,
        "listaAccesorios": listaAccesorios,
    };
    return automovil;
}

function serializeEmpleado(){ 
    let codigoEmpleado = $("#txtEmpleadoRenta").val();
    let nombre,cedula,telefono,celular,correoElectronico,numAutosRentados;
    listaEmpleados.forEach(empleado=>{
        if(empleado.codigoEmpleado == codigoEmpleado){
            nombre = empleado.nombre;
            cedula = empleado.cedula;
            telefono = empleado.telefono;
            celular = empleado.celular;
            correoElectronico = empleado.correoElectronico;
            numAutosRentados = empleado.numeroAutosRentados + 1
        }
    });

    let empleado = {
        "nombre" : nombre,       
        "cedula" : cedula,
        "telefono" : telefono, 
        "celular" : celular,
        "correoElectronico" : correoElectronico,
        "numeroAutosRentados": numAutosRentados
    };

    return empleado;
}

function limpiarCampos(){
    $("#txtTotalRenta").val("");
    $("#txtPrecioDiaRenta").val("");
    setearFecha();
    $("#txtFechaFinRenta").val("");        
}