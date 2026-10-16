//Elementos DOM
const  nombreUsuario = document.getElementById('nombreUsuario')
const colorFondo = document.getElementById('colorFondo')
const btnAyuda = document.getElementById('btnAyuda')
const saludo = document.getElementById('parrafoSaludo')
const lista = document.getElementById('lista')

//Recuperar preferencias
const nombreGuardado = localStorage.getItem('usuario')
if(nombreGuardado){
    nombreUsuario.value =nombreGuardado
}
const colorPreferido = localStorage.getItem('colorPreferido')
if(colorPreferido){
    colorFondo.value =document.body.style.background = colorPreferido
}
//Variables para datos

let nombre
let color
let fechaActual= new Date ()
let fechaFormateada = fechaActual.toLocaleDateString()
let hora = fechaActual.getHours()

// Lógica para el saludo
let textoSaludo
if(hora<12){
    textoSaludo = "Buenos días"
    

}else if(hora<20){
    textoSaludo = "Buenas tardes"
 
}else{
    textoSaludo = "Buenas noches"
   
}

saludo.textContent = textoSaludo + ", hoy es " + fechaFormateada

//Cambiamos el color de fondo.

colorFondo.addEventListener('input' , () => {document.body.style.background = colorFondo.value; localStorage.setItem('colorPreferido',colorFondo.value)
})

//Guardamos el usuario

nombreUsuario.addEventListener('input', () =>{
    localStorage.setItem('usuario', nombreUsuario.value)
})

// Información del navegador

/**
 * Obtiene los datos del navegador mediante el BOM y los 
 * muestra en una lista dinámica en el HTML.
 * @returns {void}
 */
function mostrarInformacionSistema(){
    

const infoBom = [
    "Navegador: " + navigator.userAgent,
    "Idioma: " + navigator.language,
    "Resolución: " + screen.width + "x" + screen.height
];
infoBom.forEach(dato =>{
    let nuevoLi =document.createElement('li')
    nuevoLi.textContent = dato
    lista.appendChild(nuevoLi)
})
}

mostrarInformacionSistema()


// 1. Abrimos el evento click
btnAyuda.addEventListener('click', () => {
    
    // 2. Abrimos la ventana.
    const ventanaAyuda = window.open('ayuda.html', 'Ayuda', 'width=400,height=400');

    // 3. Programamos el retraso para enviar el mensaje
    setTimeout(() => {
        // El mensaje se envía a la variable que acabamos de crear arriba
        ventanaAyuda.postMessage("La ayuda anda en camino", "*");
    }, 1000); // 1000 milisegundos = 1 segundo

});
