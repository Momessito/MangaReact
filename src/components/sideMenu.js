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
        </div>
    )
}

export default SideMenu