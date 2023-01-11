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
            document.getElementById('nick4').innerHTML = 'Nick: ' + userInfo.data.nickname
            document.getElementById('Pass').innerHTML = 'Password: *******'
            document.getElementById('icon2').src = userInfo.data.img;
            if (userInfo.data.img === '') {
                document.getElementById('icon2').src = 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'
            }
        } catch (Error) {
            console.log(Error)
        }

    }



    const foi = async () => {
        try {
            var img = document.getElementById('inputImg')
            console.log(img.value)


            const useredit = await User.getUser();
            useredit.img = img.value;
            User.editUser(useredit);
            window.location.href = '/config';
        } catch (Error) {
            console.log(Error)
        }
    }

    const changeNick = async () => {
        try {
            var nick = document.getElementById('changeN')
            console.log(nick.value)


            const useredit = await User.getUser();
            useredit.nickname = nick.value;
            User.editUser(useredit);
        } catch (Error) {
            console.log(Error)
        }
    }
    const changeEmail = async () => {
        try {
            var nick = document.getElementById('changeE')


            const useredit = await User.getUser();
            useredit.email = nick.value;
            User.editUser(useredit);
        } catch (Error) {
            console.log(Error)
        }
    }


    var istrue = true
    var istrue2 = true
    var istrue3 = true

    function show() {
        if (istrue === true) {
            document.getElementById('ChangeImg').style.display = 'block'
            istrue = false
        } else {
            document.getElementById('ChangeImg').style.display = 'none'
            istrue = true
        }
    }

    function ChangeNick() {
        if (istrue2 === true) {
            document.getElementById('ChangeNick').style.display = 'block'
            istrue2 = false
        } else {
            document.getElementById('ChangeNick').style.display = 'none'
            istrue2 = true

        }
    }

    function ChangeEmail() {
        if (istrue3 === true) {
            document.getElementById('ChangeEmail').style.display = 'block'
            istrue3 = false
        } else {
            document.getElementById('ChangeEmail').style.display = 'none'
            istrue3 = true

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
                    <input type='text' id='inputImg' />
                    <button onClick={foi}>Enviar</button>
                </div>

            </div>
            <div id="ChangeNick">
            <div className="Blacks" onClick={ChangeNick}></div>

                <input placeholder="Escreva o Nick que desejar mudar" id="changeN"/>
                <button onClick={changeNick}>Trocar</button>
            </div>
            <div id="ChangeEmail">
            <div className="Blacks" onClick={ChangeEmail}></div>

                <input placeholder="Escreva o Email que desejar mudar" id='changeE'/>
                <button onClick={changeEmail}>Trocar</button>
            </div>
            <div className="configAll">
                <div id="Profile">
                    <div className="pic" onClick={show} >
                        <img id="icon2" alt="MyIcon" />
                        <p className="p">Mudar imagem</p>
                    </div>

                    <h1 id='nick2'></h1>

                </div>
                <div id="informations">
                    <div>
                        <h2 id='nick4'></h2>                <svg onClick={ChangeNick} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg></div>

                    <div>
                        <h2 id='Email'></h2>                <svg onClick={ChangeEmail} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg></div>

                    <div>
                        <h2 id='Pass'></h2>                </div>
                </div>
            </div>
        </div>)


}

export default Config