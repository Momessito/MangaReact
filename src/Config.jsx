import Nav from "./components/nav"
import SideMenu from "./components/sideMenu"
import React, { useState, useEffect } from "react"
import User from "./backend/users"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from './firebase';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function Config() {
    const [customization, setCustomization] = useState({ banner: '', background: '', bio: '', accentColor: '#8B728E' });
    const [avatarUrl, setAvatarUrl] = useState('');
    const [savingCustom, setSavingCustom] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');

    const name = async () => {
        try {
            const userInfo = await User.getUser();
            if (!userInfo) return;
            document.getElementById('nick2').innerHTML = 'Olá ' + userInfo.data.nickname;
            document.getElementById('Email').innerHTML = 'Email: ' + userInfo.data.email;
            document.getElementById('nick4').innerHTML = 'Nick: ' + userInfo.data.nickname;
            document.getElementById('Pass').innerHTML = 'Password: *******';
            document.getElementById('icon3').src = userInfo.data.img || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg';
        } catch (Error) {
            console.log(Error);
        }
    }

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            if (u) {
                name();
                // Load existing customization
                try {
                    const { doc: fDoc, getDoc } = await import('firebase/firestore');
                    const { db } = await import('./firebase');
                    const snap = await getDoc(fDoc(db, 'users', u.uid));
                    if (snap.exists()) {
                        const d = snap.data();
                        setCustomization({
                            banner: d.banner || '',
                            background: d.background || '',
                            bio: d.bio || '',
                            accentColor: d.accentColor || '#8B728E'
                        });
                        setAvatarUrl(d.img || '');
                    }
                } catch (e) { console.log(e); }
            }
        });
        return () => unsub();
    }, []);

    const foi = async () => {
        try {
            var file = document.getElementById('inputImg').files[0];
            if (!file) { alert("Por favor selecione uma imagem do seu computador!"); return; }
            document.getElementById('foiBtn').innerText = "Enviando...";
            const uid = User.getUid();
            const storageRef = ref(storage, `profile_pictures/${uid}`);
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);
            const useredit = await User.getUser();
            useredit.data.img = downloadUrl;
            await User.editUser(useredit);
            window.location.href = '/config';
        } catch (Error) {
            console.log(Error);
            alert("Falha a enviar a imagem. Tente de novo.");
            document.getElementById('foiBtn').innerText = "Enviar";
        }
    }

    const changeNick = async () => {
        try {
            var nick = document.getElementById('changeN');
            const useredit = await User.getUser();
            useredit.nickname = nick.value;
            User.editUser(useredit);
        } catch (Error) { console.log(Error); }
    }

    const changeEmail = async () => {
        try {
            var nick = document.getElementById('changeE');
            const useredit = await User.getUser();
            useredit.email = nick.value;
            User.editUser(useredit);
        } catch (Error) { console.log(Error); }
    }

    const changePass = async () => {
        try {
            var passOld = document.getElementById('changeOLDP').value;
            var pass = document.getElementById('changePass').value;
            User.editPassword(passOld, pass);
        } catch (Error) { console.log(Error); }
    }

    const saveCustomization = async () => {
        setSavingCustom(true);
        setSaveMsg('');
        // Save avatar URL if changed
        if (avatarUrl.trim()) {
            const useredit = await User.getUser();
            if (useredit) {
                useredit.data.img = avatarUrl.trim();
                await User.editUser(useredit);
            }
        }
        const ok = await User.updateProfileCustomization(customization);
        setSavingCustom(false);
        setSaveMsg(ok ? '✅ Salvo com sucesso!' : '❌ Erro ao salvar.');
        setTimeout(() => setSaveMsg(''), 3000);
    };

    var istrue = true, istrue2 = true, istrue3 = true, istrue4 = true;

    function show() { if (istrue) { document.getElementById('ChangeImg').style.display = 'block'; istrue = false; } else { document.getElementById('ChangeImg').style.display = 'none'; istrue = true; } }
    function ChangeNick() { if (istrue2) { document.getElementById('ChangeNick').style.display = 'block'; istrue2 = false; } else { document.getElementById('ChangeNick').style.display = 'none'; istrue2 = true; } }
    function ChangeEmail() { if (istrue3) { document.getElementById('ChangeEmail').style.display = 'block'; istrue3 = false; } else { document.getElementById('ChangeEmail').style.display = 'none'; istrue3 = true; } }
    function ChangePass() { if (istrue4) { document.getElementById('ChangePass').style.display = 'block'; istrue4 = false; } else { document.getElementById('ChangePass').style.display = 'none'; istrue4 = true; } }

    return (
        <div className="app">
            <SideMenu />
            <div className="Black"></div>
            <Nav />

            {/* Overlays */}
            <div id="ChangeImg">
                <div className="Blacks" onClick={show}></div>
                <div>
                    <h2>Selecione uma imagem de perfil</h2>
                    <input type='file' accept="image/*" id='inputImg' style={{ marginTop: '20px', marginBottom: '20px' }} />
                    <button id='foiBtn' onClick={foi}>Enviar</button>
                </div>
            </div>
            <div id="ChangeNick">
                <div className="Blacks" onClick={ChangeNick}></div>
                <input placeholder="Escreva o Nick que desejar mudar" id="changeN" />
                <button onClick={changeNick}>Trocar</button>
            </div>
            <div id="ChangeEmail">
                <div className="Blacks" onClick={ChangeEmail}></div>
                <input placeholder="Escreva o Email que desejar mudar" id='changeE' />
                <button onClick={changeEmail}>Trocar</button>
            </div>
            <div id="ChangePass">
                <div className="Blacks" onClick={ChangePass}></div>
                <input placeholder="Senha antiga" id='changeOLDP' />
                <input placeholder="Nova senha" id='changePass' />
                <button onClick={changePass}>Trocar</button>
            </div>

            <div className="configAll">
                {/* Profile header */}
                <div id="Profile">
                    <div className="pic" onClick={show}>
                        <img id="icon3" alt="MyIcon" />
                        <p className="p">Mudar imagem</p>
                    </div>
                    <h1 id='nick2'></h1>
                </div>

                {/* Account info */}
                <div id="informations">
                    <div>
                        <h2 id='nick4'></h2>
                        <svg onClick={ChangeNick} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    </div>
                    <div>
                        <h2 id='Email'></h2>
                        <svg onClick={ChangeEmail} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    </div>
                    <div>
                        <h2 id='Pass'></h2>
                        <svg onClick={ChangePass} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    </div>
                </div>

                {/* ---- PROFILE CUSTOMIZATION SECTION ---- */}
                <div style={{ margin: '30px auto', width: '60%', backgroundColor: 'var(--color7)', padding: '25px', borderRadius: '12px', border: '1px solid var(--color2)', color: 'white' }}>
                    <h2 style={{ marginBottom: '20px', color: 'var(--color5)' }}>🎨 Personalizar Perfil</h2>

                    {/* Avatar URL */}
                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>🖼️ URL da Foto de Perfil</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <img
                                src={avatarUrl || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'}
                                onError={e => { e.target.src = 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'; }}
                                alt="preview avatar"
                                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color2)', flexShrink: 0 }}
                            />
                            <input
                                type="url"
                                placeholder="https://exemplo.com/minha-foto.jpg"
                                value={avatarUrl}
                                onChange={e => setAvatarUrl(e.target.value)}
                                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid var(--color2)', backgroundColor: 'var(--color6)', color: 'white' }}
                            />
                        </div>
                    </div>

                    {/* Banner URL */}
                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>🌆 URL do Banner (imagem de topo do perfil)</label>
                        <input
                            type="url"
                            placeholder="https://exemplo.com/banner.jpg"
                            value={customization.banner}
                            onChange={e => setCustomization(p => ({ ...p, banner: e.target.value }))}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color2)', backgroundColor: 'var(--color6)', color: 'white' }}
                        />
                        {customization.banner && <img src={customization.banner} alt="preview banner" onError={e => e.target.style.display = 'none'} style={{ marginTop: '8px', width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--color2)' }} />}
                    </div>

                    {/* Background URL */}
                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>🌄 URL da Imagem de Fundo do Perfil</label>
                        <input
                            type="url"
                            placeholder="https://exemplo.com/fundo.jpg"
                            value={customization.background}
                            onChange={e => setCustomization(p => ({ ...p, background: e.target.value }))}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color2)', backgroundColor: 'var(--color6)', color: 'white' }}
                        />
                        {customization.background && <img src={customization.background} alt="preview bg" onError={e => e.target.style.display = 'none'} style={{ marginTop: '8px', width: '100%', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--color2)', opacity: 0.5 }} />}
                    </div>

                    {/* Bio */}
                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>✏️ Biografia (aparece no seu perfil)</label>
                        <textarea
                            placeholder="Fala sobre ti, os teus mangás preferidos..."
                            value={customization.bio}
                            onChange={e => setCustomization(p => ({ ...p, bio: e.target.value }))}
                            rows={3}
                            maxLength={200}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color2)', backgroundColor: 'var(--color6)', color: 'white', resize: 'vertical' }}
                        />
                        <small style={{ color: '#888' }}>{customization.bio.length}/200</small>
                    </div>

                    {/* Accent color */}
                    <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>🎨 Cor de Destaque</label>
                        <input
                            type="color"
                            value={customization.accentColor}
                            onChange={e => setCustomization(p => ({ ...p, accentColor: e.target.value }))}
                            style={{ width: '50px', height: '40px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                        />
                        <span style={{ color: customization.accentColor, fontWeight: 'bold' }}>{customization.accentColor}</span>
                    </div>

                    <button onClick={saveCustomization} disabled={savingCustom} style={{ padding: '12px 30px', backgroundColor: 'var(--color5)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', opacity: savingCustom ? 0.6 : 1 }}>
                        {savingCustom ? 'Salvando...' : '💾 Guardar Personalização'}
                    </button>
                    {saveMsg && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{saveMsg}</p>}
                </div>
            </div>
        </div>
    );
}

export default Config;