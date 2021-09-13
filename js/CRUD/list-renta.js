let listaClientes = [];
let listaEmpleados = [];

function listRentaAutos(){
    $.ajax({
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/automovil/list", //Dirección para realizar la petición HTTP
        contentType : "application/json",
        dataType: "json",
        success : function(response){
            console.log(response);
            console.log("Lista de clientes: " + listaClientes);
            showRenta(response);
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

function listRentaClientes(){
    $.ajax({
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/cliente/list", //Dirección para realizar la petición HTTP
        contentType : "application/json",
        dataType: "json",
        success : function(response){
            console.log(response);
            listaClientes = response;
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

function listRentaEmpleado(){
    $.ajax({
        type: "GET", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/empleado/list", //Dirección para realizar la petición HTTP
        contentType : "application/json",
        dataType: "json",
        success : function(response){
            console.log(response);
            listaEmpleados = response;
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

function showRenta(list){
    $("#tblaRegistroRenta").empty(); //Eliminar todo el contenido de la tabla
    let i = 1;
    list.forEach(auto =>{
        if(auto.listaRenta.length != 0){
            auto.listaRenta.forEach(renta=>{
                let fechaInicio = renta.fechaInicio;
                let nuevaFechaInicio = fechaInicio.split("T");        
                let fechaFin = renta.fechaFin;
                let nuevaFechaFin = fechaFin.split("T");
                
                listaClientes.forEach(cliente =>{
                    if(cliente.renta.length != 0){
                        listaEmpleados.forEach(empleado =>{
                            if(empleado.rentas.length !=0){
                                cliente.renta.forEach(rentaCliente =>{
                                    empleado.rentas.forEach(rentaEmpleado =>{
                                        if(rentaCliente.codigoRenta == renta.codigoRenta && rentaEmpleado.codigoRenta == renta.codigoRenta){
                                            $("#tblaRegistroRenta").append('<tr>' 
                                                + '<td>' + i + '</td>'
                                                + '<td>' + nuevaFechaInicio[0] + '</td>'
                                                + '<td>' + nuevaFechaFin[0] + '</td>'
                                                + '<td>' + auto.marca +'</td>'
                                                + '<td>' + cliente.nombre +'</td>'
                                                + '<td>' + empleado.nombre +'</td>'
                                                + '<td>' + "$ " + renta.total.toFixed(2) +'</td>'
                                                + '<td>'                                               
                                                    + '<button onclick ="del('+ renta.codigoRenta+')" type = "button" class = "btn btn-danger">Eliminar</button>'            
                                                + '</td>' 
                                            +'</tr>')    
                                            i++;
                                        }                                                                                                    
                                    });
                                });
                            }
                        })                        
                    }
                });
            });  
        } 
    });
}

function del(codigo){
    $.ajax({        
        type: "DELETE", //Verbo de HTTP a utilizar
        url: "http://localhost:8080/renta/delete/" + codigo, //Dirección para realizar la petición HTTP        
        contentType : "application/json",        
        success : function(response){
            console.log(response);    
            listRentaAutos();            
		},
		error : function(err){
			console.error(err);
		}        
    });
}

$(function(){
    listRentaClientes();
    listRentaEmpleado();
    listRentaAutos();//Principal
});