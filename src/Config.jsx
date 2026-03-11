import Nav from "./components/nav"
import SideMenu from "./components/sideMenu"
import Footer from "./components/Footer"
import React, { useState, useEffect } from "react"
import User from "./backend/users"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from './firebase';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';

function Config() {
    const [customization, setCustomization] = useState({
        banner: '', background: '', bio: '', accentColor: '#8B728E',
        profileLayout: 'centered', cardStyle: 'glass', nameEffect: 'none',
        badgeEmoji: '🎮', spotlightManga: null,
    });
    const [avatarUrl, setAvatarUrl] = useState('');
    const [savingCustom, setSavingCustom] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [userInfo, setUserInfo] = useState({ nickname: '', email: '' });
    const [activeTab, setActiveTab] = useState('profile');
    const [showImgUpload, setShowImgUpload] = useState(false);
    const [editField, setEditField] = useState(null);
    const [fieldValue, setFieldValue] = useState('');
    const [fieldValue2, setFieldValue2] = useState('');
    const [spotlightSearch, setSpotlightSearch] = useState('');

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            if (u) {
                try {
                    const info = await User.getUser();
                    if (info) {
                        setUserInfo({ nickname: info.data.nickname || '', email: info.data.email || '' });
                        setAvatarUrl(info.data.img || '');
                    }
                    const { doc: fDoc, getDoc } = await import('firebase/firestore');
                    const { db } = await import('./firebase');
                    const snap = await getDoc(fDoc(db, 'users', u.uid));
                    if (snap.exists()) {
                        const d = snap.data();
                        setCustomization({
                            banner: d.banner || '', background: d.background || '',
                            bio: d.bio || '', accentColor: d.accentColor || '#8B728E',
                            profileLayout: d.profileLayout || 'centered',
                            cardStyle: d.cardStyle || 'glass',
                            nameEffect: d.nameEffect || 'none',
                            badgeEmoji: d.badgeEmoji || '🎮',
                            spotlightManga: d.spotlightManga || null,
                        });
                        if (d.img) setAvatarUrl(d.img);
                    }
                } catch (e) { console.log(e); }
            }
        });
        return () => unsub();
    }, []);

    const uploadAvatar = async () => {
        try {
            const file = document.getElementById('inputImg').files[0];
            if (!file) { alert("Selecione uma imagem!"); return; }
            const uid = User.getUid();
            const storageRef = ref(storage, `profile_pictures/${uid}`);
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);
            const useredit = await User.getUser();
            useredit.data.img = downloadUrl;
            await User.editUser(useredit);
            setAvatarUrl(downloadUrl);
            setShowImgUpload(false);
        } catch (e) { console.log(e); alert("Erro ao enviar imagem."); }
    }

    const saveField = async () => {
        try {
            const useredit = await User.getUser();
            if (editField === 'nick') { useredit.nickname = fieldValue; await User.editUser(useredit); setUserInfo(p => ({ ...p, nickname: fieldValue })); }
            if (editField === 'email') { useredit.email = fieldValue; await User.editUser(useredit); setUserInfo(p => ({ ...p, email: fieldValue })); }
            if (editField === 'pass') { await User.editPassword(fieldValue, fieldValue2); }
            setEditField(null); setFieldValue(''); setFieldValue2('');
        } catch (e) { console.log(e); }
    };

    const saveCustomization = async () => {
        setSavingCustom(true); setSaveMsg('');
        if (avatarUrl.trim()) {
            const useredit = await User.getUser();
            if (useredit) { useredit.data.img = avatarUrl.trim(); await User.editUser(useredit); }
        }
        const ok = await User.updateProfileCustomization(customization);
        setSavingCustom(false);
        setSaveMsg(ok ? '✅ Salvo!' : '❌ Erro ao salvar.');
        setTimeout(() => setSaveMsg(''), 3000);
    };

    const inputStyle = {
        width: '100%', padding: '12px 14px', borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(30,30,46,0.9)',
        color: 'white', fontSize: '0.9rem', outline: 'none',
    };

    const sectionTitle = (icon, text) => (
        <h4 style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '24px 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {icon} {text}
        </h4>
    );

    const optionBtn = (label, value, current, onChange) => (
        <button
            onClick={() => onChange(value)}
            style={{
                padding: '8px 14px', borderRadius: '10px', cursor: 'pointer',
                backgroundColor: current === value ? `${customization.accentColor}33` : 'rgba(30,30,46,0.9)',
                border: current === value ? `2px solid ${customization.accentColor}` : '1px solid rgba(255,255,255,0.06)',
                color: current === value ? customization.accentColor : '#888',
                fontWeight: current === value ? 'bold' : 'normal',
                fontSize: '0.82rem', transition: 'all 0.2s',
            }}
        >
            {label}
        </button>
    );

    const emojiOptions = ['🎮', '⚔️', '🔥', '💜', '🌸', '👑', '🐉', '💀', '🦊', '🎯', '⭐', '🍃', '🌙', '❤️', '🎪', '🗡️'];

    const tabBtn = (tabId, label, icon) => (
        <button onClick={() => setActiveTab(tabId)} style={{
            flex: 1, padding: '12px', border: 'none', cursor: 'pointer',
            backgroundColor: activeTab === tabId ? customization.accentColor : 'rgba(30,30,46,0.7)',
            color: activeTab === tabId ? 'white' : '#888',
            borderRadius: '10px', fontWeight: 'bold', fontSize: '0.85rem', transition: 'all 0.2s',
        }}>
            {icon} {label}
        </button>
    );

    return (
        <div style={{ minHeight: '100vh', color: 'white' }}>
            <SideMenu />
            <div className="Black"></div>
            <Nav />

            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
                {/* Profile Header Card */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '20px', padding: '24px',
                    marginBottom: '20px', backgroundColor: 'rgba(30,30,46,0.7)', borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.04)',
                }}>
                    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowImgUpload(!showImgUpload)}>
                        <img src={avatarUrl || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'} alt="Avatar"
                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${customization.accentColor}` }} />
                        <div style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: customization.accentColor, borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', border: '2px solid #171724' }}>✏️</div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ margin: '0 0 4px', fontSize: '1.3rem', fontWeight: '800' }}>{userInfo.nickname || 'Visitante'}</h2>
                        <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>{userInfo.email}</p>
                    </div>
                    <Link to="/perfil/meu-perfil" style={{
                        padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.05)',
                        color: '#ccc', borderRadius: '8px', fontSize: '0.8rem',
                        textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                        👁️ Ver Perfil
                    </Link>
                </div>

                {/* Avatar Upload */}
                {showImgUpload && (
                    <div style={{ padding: '20px', marginBottom: '16px', backgroundColor: 'rgba(30,30,46,0.9)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <h4 style={{ margin: '0 0 12px', color: customization.accentColor }}>📸 Alterar foto de perfil</h4>
                        <input type='file' accept="image/*" id='inputImg' style={{ marginBottom: '12px', color: '#ccc' }} />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={uploadAvatar} style={{ padding: '10px 20px', backgroundColor: customization.accentColor, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Enviar</button>
                            <button onClick={() => setShowImgUpload(false)} style={{ padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#888', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                    {tabBtn('profile', 'Conta', '👤')}
                    {tabBtn('custom', 'Visual', '🎨')}
                    {tabBtn('extras', 'Extras', '✨')}
                </div>

                {/* ===== TAB: ACCOUNT ===== */}
                {activeTab === 'profile' && (
                    <div style={{ backgroundColor: 'rgba(30,30,46,0.7)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                        {[
                            { key: 'nick', label: 'Nickname', value: userInfo.nickname, action: 'Editar' },
                            { key: 'email', label: 'Email', value: userInfo.email, action: 'Editar' },
                            { key: 'pass', label: 'Senha', value: '••••••••', action: 'Alterar' },
                        ].map((item, i) => (
                            <div key={item.key} style={{
                                padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                            }}>
                                <div>
                                    <span style={{ color: '#666', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</span>
                                    <div style={{ fontWeight: '600', marginTop: '2px' }}>{item.value || '—'}</div>
                                </div>
                                <button onClick={() => { setEditField(item.key); setFieldValue(item.key === 'pass' ? '' : item.value); setFieldValue2(''); }}
                                    style={{ background: 'none', border: 'none', color: customization.accentColor, cursor: 'pointer', fontWeight: 'bold' }}>{item.action}</button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Edit Field */}
                {editField && (
                    <div style={{ marginTop: '16px', padding: '20px', backgroundColor: 'rgba(30,30,46,0.9)', borderRadius: '14px', border: `1px solid ${customization.accentColor}33` }}>
                        <h4 style={{ margin: '0 0 12px', color: customization.accentColor }}>
                            {editField === 'nick' ? '✏️ Alterar Nickname' : editField === 'email' ? '📧 Alterar Email' : '🔐 Alterar Senha'}
                        </h4>
                        {editField === 'pass' ? (
                            <><input placeholder="Senha atual" type="password" value={fieldValue} onChange={e => setFieldValue(e.target.value)} style={{ ...inputStyle, marginBottom: '10px' }} />
                            <input placeholder="Nova senha" type="password" value={fieldValue2} onChange={e => setFieldValue2(e.target.value)} style={inputStyle} /></>
                        ) : (
                            <input placeholder={editField === 'nick' ? 'Novo nickname' : 'Novo email'} value={fieldValue} onChange={e => setFieldValue(e.target.value)} style={inputStyle} />
                        )}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                            <button onClick={saveField} style={{ padding: '10px 24px', backgroundColor: customization.accentColor, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar</button>
                            <button onClick={() => setEditField(null)} style={{ padding: '10px 24px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#888', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
                        </div>
                    </div>
                )}

                {/* ===== TAB: VISUAL ===== */}
                {activeTab === 'custom' && (
                    <div style={{ backgroundColor: 'rgba(30,30,46,0.7)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', padding: '24px' }}>
                        {/* Avatar URL */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.85rem', color: '#aaa' }}>🖼️ Foto de Perfil (URL)</label>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <img src={avatarUrl || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'} onError={e => { e.target.src = 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg'; }} alt="" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${customization.accentColor}`, flexShrink: 0 }} />
                                <input type="url" placeholder="https://..." value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} style={inputStyle} />
                            </div>
                        </div>

                        {/* Banner */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.85rem', color: '#aaa' }}>🌆 Banner</label>
                            <input type="url" placeholder="URL da imagem do banner..." value={customization.banner} onChange={e => setCustomization(p => ({ ...p, banner: e.target.value }))} style={inputStyle} />
                            {customization.banner && <img src={customization.banner} alt="" onError={e => e.target.style.display = 'none'} style={{ marginTop: '8px', width: '100%', height: '70px', objectFit: 'cover', borderRadius: '10px' }} />}
                        </div>

                        {/* Background */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.85rem', color: '#aaa' }}>🌄 Fundo do Perfil</label>
                            <input type="url" placeholder="URL de fundo..." value={customization.background} onChange={e => setCustomization(p => ({ ...p, background: e.target.value }))} style={inputStyle} />
                        </div>

                        {/* Accent Color */}
                        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#aaa' }}>🎨 Cor de Destaque</label>
                            <input type="color" value={customization.accentColor} onChange={e => setCustomization(p => ({ ...p, accentColor: e.target.value }))} style={{ width: '44px', height: '36px', borderRadius: '8px', border: 'none', cursor: 'pointer' }} />
                            <span style={{ color: customization.accentColor, fontWeight: 'bold', fontSize: '0.85rem' }}>{customization.accentColor}</span>
                        </div>

                        {/* Bio */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.85rem', color: '#aaa' }}>✏️ Bio</label>
                            <textarea placeholder="Fala sobre ti..." value={customization.bio} onChange={e => setCustomization(p => ({ ...p, bio: e.target.value }))} rows={3} maxLength={200} style={{ ...inputStyle, resize: 'vertical' }} />
                            <small style={{ color: '#555' }}>{customization.bio.length}/200</small>
                        </div>

                        {/* Save button */}
                        <button onClick={saveCustomization} disabled={savingCustom} style={{ width: '100%', padding: '14px', backgroundColor: customization.accentColor, color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', opacity: savingCustom ? 0.6 : 1 }}>
                            {savingCustom ? 'Salvando...' : '💾 Guardar Visual'}
                        </button>
                        {saveMsg && <p style={{ marginTop: '10px', fontWeight: 'bold', textAlign: 'center' }}>{saveMsg}</p>}
                    </div>
                )}

                {/* ===== TAB: EXTRAS ===== */}
                {activeTab === 'extras' && (
                    <div style={{ backgroundColor: 'rgba(30,30,46,0.7)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', padding: '24px' }}>
                        {/* Badge Emoji */}
                        {sectionTitle('🏷️', 'Emoji Badge')}
                        <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '10px' }}>Aparece ao lado da tua foto de perfil</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                            {emojiOptions.map(em => (
                                <button key={em} onClick={() => setCustomization(p => ({ ...p, badgeEmoji: em }))}
                                    style={{
                                        width: '44px', height: '44px', borderRadius: '10px', fontSize: '1.3rem',
                                        border: customization.badgeEmoji === em ? `2px solid ${customization.accentColor}` : '1px solid rgba(255,255,255,0.06)',
                                        backgroundColor: customization.badgeEmoji === em ? `${customization.accentColor}22` : 'rgba(30,30,46,0.9)',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                    }}>
                                    {em}
                                </button>
                            ))}
                        </div>

                        {/* Name Effect */}
                        {sectionTitle('✨', 'Efeito do Nome')}
                        <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '10px' }}>Como teu nome aparece no perfil</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                            {optionBtn('Normal', 'none', customization.nameEffect, v => setCustomization(p => ({ ...p, nameEffect: v })))}
                            {optionBtn('✨ Brilho', 'glow', customization.nameEffect, v => setCustomization(p => ({ ...p, nameEffect: v })))}
                            {optionBtn('🌈 Gradiente', 'gradient', customization.nameEffect, v => setCustomization(p => ({ ...p, nameEffect: v })))}
                            {optionBtn('🎨 Rainbow', 'rainbow', customization.nameEffect, v => setCustomization(p => ({ ...p, nameEffect: v })))}
                        </div>

                        {/* Card Style */}
                        {sectionTitle('🃏', 'Estilo dos Cards')}
                        <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '10px' }}>O visual dos blocos no teu perfil</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                            {optionBtn('🔮 Glass', 'glass', customization.cardStyle, v => setCustomization(p => ({ ...p, cardStyle: v })))}
                            {optionBtn('⬛ Solid', 'solid', customization.cardStyle, v => setCustomization(p => ({ ...p, cardStyle: v })))}
                            {optionBtn('💡 Neon', 'neon', customization.cardStyle, v => setCustomization(p => ({ ...p, cardStyle: v })))}
                            {optionBtn('📄 Minimal', 'minimal', customization.cardStyle, v => setCustomization(p => ({ ...p, cardStyle: v })))}
                        </div>

                        {/* Layout */}
                        {sectionTitle('📐', 'Layout do Perfil')}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                            {optionBtn('🎯 Centralizado', 'centered', customization.profileLayout, v => setCustomization(p => ({ ...p, profileLayout: v })))}
                            {optionBtn('◀️ Alinhado à Esquerda', 'left', customization.profileLayout, v => setCustomization(p => ({ ...p, profileLayout: v })))}
                        </div>

                        {/* Spotlight Manga */}
                        {sectionTitle('⭐', 'Mangá em Destaque')}
                        <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '10px' }}>Mostra teu mangá favorito no perfil</p>
                        <div style={{ marginBottom: '10px' }}>
                            <input placeholder="ID do mangá (ex: 3f11b06b-...)" value={spotlightSearch} onChange={e => setSpotlightSearch(e.target.value)} style={{ ...inputStyle, marginBottom: '8px' }} />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={async () => {
                                    if (!spotlightSearch.trim()) return;
                                    try {
                                        const { default: Mangas } = await import('./backend/mangas');
                                        const data = await Mangas.getMangaById(spotlightSearch.trim());
                                        if (data) {
                                            setCustomization(p => ({ ...p, spotlightManga: { id: data.id, title: data.title, image: data.image } }));
                                            setSpotlightSearch('');
                                        } else { alert('Mangá não encontrado!'); }
                                    } catch (e) { alert('Erro ao buscar mangá'); }
                                }} style={{ padding: '8px 16px', backgroundColor: customization.accentColor, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                    Buscar
                                </button>
                                {customization.spotlightManga && (
                                    <button onClick={() => setCustomization(p => ({ ...p, spotlightManga: null }))}
                                        style={{ padding: '8px 16px', backgroundColor: 'rgba(255,77,77,0.15)', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                        Remover
                                    </button>
                                )}
                            </div>
                        </div>
                        {customization.spotlightManga && (
                            <div style={{
                                display: 'flex', gap: '12px', padding: '12px',
                                backgroundColor: `${customization.accentColor}11`, borderRadius: '12px',
                                border: `1px solid ${customization.accentColor}33`, marginBottom: '20px',
                            }}>
                                <img src={customization.spotlightManga.image} alt="" style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{customization.spotlightManga.title}</span>
                                    <span style={{ color: '#888', fontSize: '0.75rem' }}>Em destaque no perfil</span>
                                </div>
                            </div>
                        )}

                        {/* Save */}
                        <button onClick={saveCustomization} disabled={savingCustom} style={{ width: '100%', padding: '14px', backgroundColor: customization.accentColor, color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', opacity: savingCustom ? 0.6 : 1 }}>
                            {savingCustom ? 'Salvando...' : '💾 Guardar Extras'}
                        </button>
                        {saveMsg && <p style={{ marginTop: '10px', fontWeight: 'bold', textAlign: 'center' }}>{saveMsg}</p>}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Config;