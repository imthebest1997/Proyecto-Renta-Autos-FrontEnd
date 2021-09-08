let listaClientes = [];
let listaAutomoviles = [];
let fechas = [];

function listAutos(){
    $.ajax({
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/automovil/list", //Dirección para realizar la petición HTTP
        contentType : "application/json",
        dataType: "json",
        success : function(response){
            console.log(response);
            cargarSelectAutos(response);
            copiarObjetos(response);
            $("#txtPrecioDiaRenta").val(response[0].precioPorDia);//Setear el precio de renta del auto inicial
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

function listEmpleados(){
    $.ajax({
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/empleado/list", //Dirección para realizar la petición HTTP
        contentType : "application/json",
        dataType: "json",
        success : function(response){
            console.log(response);
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
        "inicio" : $("#txtFechaInicioRenta").val(),       
        "fin" : $("#txtFechaFinRenta").val(),
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
        },
    		error : function(err){
			console.error(err);
		},
    });
}

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
    listAutos();
    listEmpleados();
    listClientes();
    cambiarPrecioRenta();
    $("#btnRegistrarRenta").click(function(){
        if(!validarCampos()){
            save();
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'No olvide llenar todos los campos..!'
              });           
        }
    }); 
    setearFecha();

    $("#btnVerificarFechaRenta").click(function(){
        if(!verificarRangoFechas()){
            calcularTotal();            
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'El rango de fecha es erroneo'
              });                                   
        }
    });
});

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

function setearFecha(){
    let fecha = new Date();
    let mesActual,diaActual;
    if((fecha.getMonth()+1) <10){
        mesActual = "0"+(fecha.getMonth()+1);
    }else{
        mesActual = fecha.getMonth()+1;
    }    

    if(fecha.getDate() < 10){
        diaActual = "0" + fecha.getDate();        
    }

    let fechaActual = fecha.getFullYear()+"-"+mesActual+ "-" + diaActual;
    document.getElementById("txtFechaInicioRenta").value = fechaActual;  
}

function cerrarPopupDetallesM() {
    $("#listaDetalleMantenimiento").modal('hide');//ocultamos el modal
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
    $('.modal-backdrop').remove();//eliminamos el backdrop del modal
}

function copiarObjetos(automovil){
    automovil.forEach(x=>{
        let auto = {
            "codigoAutomovil": x.codigoAutomovil,
            "precioPorDia": x.precioPorDia,
            "disponibilidad" : 1,
        };
        listaAutomoviles.push(auto);        
    });
}

function cambiarPrecioRenta(){
    let selectAutos = document.getElementById("txtAutomovilRenta");
    let indiceAuto;

    let fechaInicial = $("#txtFechaInicioRenta").val();
    let fechaFin = $("#txtFechaFinRenta").val();

    selectAutos.onchange = function(){
        indiceAuto = selectAutos.value;
        $("#txtPrecioDiaRenta").val(listaAutomoviles[indiceAuto-1].precioPorDia);
        if(fechaInicial == "" || fechaFin == ""){
            calcularTotal();
        }
    };
}

function calcularTotal(){
    let dias = diasRenta();        
    let precioRenta = $("#txtPrecioDiaRenta").val();
    let total = dias*precioRenta;
 
    $("#txtTotalRenta").val(total.toFixed(2));
}