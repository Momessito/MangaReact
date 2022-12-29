import '../App.css'
import React from "react"

function SideMenu() {
    var isfalse2 = false
    return (
        <div id='sideMenu'>
            <div className='Logo'>
                <img src='https://images.vexels.com/media/users/3/157555/isolated/preview/2b48b29abd18febe3b1f92a85913ce39-icone-de-livro-simples.png' alt='Logo' height='30px' />
            </div>
            <ul>

                <li>Mangas</li>
                <li>Categorias</li>
                <li>Comunidade</li>
                <li>Apoie</li>
                <li>Destaques</li>
                <li>Mais Lidos</li>
            </ul>
            <div id='colors' onClick={modes}>
                <svg xmlns="http://www.w3.org/2000/svg" height="100" fill="white" className="bi bi-palette" viewBox="0 0 16 16">
                    <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                    <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z" />
                </svg>

            </div>
            <div id='colorpalletes'>
            <h6>Escolha um plano de fundo:</h6>
            <div onClick={color1}></div>
            <div onClick={color2}></div>
            </div>
        </div>
    )
    function modes(){
        const color = document.getElementById('colorpalletes')
        
        if(isfalse2 === false){
            color.style.transform = 'translateX(0px)'
            isfalse2 = true
        }else{
            color.style.transform = 'translateX(-600px)'
            isfalse2 = false
        }
    }
    function color1(){

        var r = document.querySelector(':root');




            r.style.setProperty('--color1', '#422b2b');
            r.style.setProperty('--color2', '#ae8d8d');
            


    }
    function color2(){

        var r = document.querySelector(':root');




            r.style.setProperty('--color1', '#2b2d42');
            r.style.setProperty('--color2', '#8d99ae');
            


    }
}

export default SideMenu