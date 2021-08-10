window.addEventListener('scroll', function () {
    let header = document.querySelector('header');//Toma el elemento header
    let barrasBoton = document.getElementById('bars');
    let windowPosition = window.scrollY > 0;
    header.classList.toggle('scrolling-active', windowPosition);
    if(windowPosition){
        barrasBoton.style.color = 'black';
        document.getElementById("navbar").style.height = '65px'; // toma el elemento con id 'header'
    }else{
        barrasBoton.style.color = 'white';
    } 
})


const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-list");

navToggle.addEventListener("click",function(){
    navMenu.classList.toggle("nav-menu_visible");

    if(navMenu.classList.contains("nav-menu-visible")){
        navToggle.setAttribute("aria-label","Cerrar menú");
    }else{
        navToggle.setAttribute("aria-label","Abrir menú");        
    }
});


window.addEventListener('load', function(){
    new Glider(document.querySelector(".carousel__lista"), {
        slidesToShow: 1,
        dots: '.carousel__indicadores',
//        draggable: true,
        arrows: {
          prev: '.carousel__anterior',
          next: '.carousel__siguiente'
        },
        responsive: [
            {
              // screens greater than >= 775px
              breakpoint: 800,
              settings: {
                // Set to `auto` and provide item width to adjust to viewport
                slidesToShow: 1,
                slidesToScroll: 1
              }
            },{
              // screens greater than >= 1024px
              breakpoint: 1024,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]
        
    });
            
});