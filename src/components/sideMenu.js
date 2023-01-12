import '../App.css'
import React from "react"
import { Link } from 'react-router-dom'
import User from '../backend/users'

function SideMenu() {
    var isfalse2 = false

    const Sair = async () => {
        await User.Exit()
      }

    return (
        <div id='sideMenu'>
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