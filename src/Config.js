import Nav from "./components/nav"
import SideMenu from "./components/sideMenu"
import React from "react"
import User from "./backend/users"

function Config() {
    const name = async () => {
        try {
            const userInfo = await User.getUser();
            document.getElementById('nick2').innerHTML = 'Ola ' + userInfo.data.nickname
            document.getElementById('Email').innerHTML = 'Email: ' + userInfo.data.email
            document.getElementById('icon2').src = userInfo.data.img
            console.log(userInfo)
            if (userInfo.data.img === '') {
                document.getElementById('icon2').src = 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'
            }

            // // teste
            // const useredit = await User.getUser();
            // useredit.img = "https://i.pinimg.com/736x/9a/eb/f6/9aebf6d9d179073ca81495b9deaf7881.jpg";
            // User.editUser(userANtigo); 
        } catch (Error) {
            console.log(Error)
        }

    }

    function foi(){
        var img = document.getElementById('inputImg')
        console.log(img.value)
    }
var istrue = true
    function show(){
        if(istrue === true){
        document.getElementById('ChangeImg').style.display = 'block'
            istrue = false
    }else{
        document.getElementById('ChangeImg').style.display = 'none'
        istrue = true
    }
    }

    return (
        <div className="app" onLoad={name}>
            <SideMenu />
            <div className="Black"></div>
            <Nav />
            <div id="ChangeImg" >
            <div className="Blacks" onClick={show}></div>
                <div >             
                    <h2>Digite o Link da sua imagem</h2>   
                    <input type='text' id='inputImg'/>
                    <button onClick={foi}>Enviar</button>
                </div>

            </div>
            <div className="configAll">
                <div id="Profile">
                    <div className="pic" onClick={show} >
                        <img id="icon2" />
                        <p className="p">Mudar imagem</p>
                    </div>

                    <h1 id='nick2'></h1>
                </div>
                <h2 id="Email"> </h2>
            </div>
        </div>)


}

export default Config