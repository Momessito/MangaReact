import '../App.css'
import React from "react"

var isFalse = false

function Burgers(){
return(
<div id='burger' onClick={animationBuger}>
    <div id='b'></div>
    <div id='c'></div>
    <div id='d'></div>

</div>
)

function animationBuger(){
if(isFalse === false){
    document.getElementById('user').style.position = 'absolute'
    document.getElementById('user').style.zIndex = '1011'
    document.getElementById('b').style.transform = 'rotate(45deg)translate(3px,01px)'
    document.getElementById('c').style.display = 'none'
    document.getElementById('d').style.transform = 'rotate(315deg)translate(3px,-2px)'
    document.getElementById('sideMenu').style.transform = 'translateX(0px)'
    var black = document.querySelector('.Black')
    black.style.backgroundColor = 'rgba(0, 0, 0, 0.288)'
    black.style.visibility = 'visible'
    isFalse = true
}else if(isFalse === true){
    var black = document.querySelector('.Black')
    document.getElementById('b').style.transform = 'rotate(0deg)translate(0px,0px)'
    document.getElementById('c').style.display = 'block'
    document.getElementById('d').style.transform = 'rotate(0deg)translate(0px,0px)'
    document.getElementById('sideMenu').style.transform = 'translateX(-400px)'
    black.style.backgroundColor = 'rgba(0, 0, 0, 0)'
    black.style.visibility = 'hidden'
    isFalse = false
}


var black = document.querySelector('.Black')
black.addEventListener('click',()=>{
    black.addEventListener('mouseover',()=>{})
    document.getElementById('b').style.transform = 'rotate(0deg)translate(0px,0px)'
    document.getElementById('c').style.display = 'block'
    document.getElementById('d').style.transform = 'rotate(0deg)translate(0px,0px)'
    document.getElementById('sideMenu').style.transform = 'translateX(-400px)'

    isFalse = false
    black.style.backgroundColor = 'rgba(0, 0, 0, 0)'
    black.style.visibility = 'hidden'
})
    }

}


export default Burgers
