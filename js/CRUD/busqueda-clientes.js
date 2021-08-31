document.getElementById("txtCliente").onkeyup = function() {
    var buscar_= this.value.toLowerCase() ;
    document.querySelectorAll('.table tbody tr').forEach(function(e){
      var encontro_ =false;
      e.querySelectorAll('td').forEach(function(e){
        if (e.innerHTML.toLowerCase().indexOf(buscar_)>=0){
          encontro_=true;
        }
      }); 
      if (encontro_){
        e.style.display = '';
      }else{
        e.style.display = 'none';
      }
    });              
}

