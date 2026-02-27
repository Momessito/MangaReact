import { useState } from 'react';
import User from '../backend/users';
import Logo from '../Logo.png'

function PageLogin() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const email = document.getElementById('emailLogin')?.value.trim();
    const pass = document.getElementById('passLogin')?.value.trim();
    const nick = document.getElementById('nickRegister')?.value.trim();

    if (!email || !pass) {
      setErrorMsg('Preencha os campos!');
      return;
    }

    if (isRegistering && !nick) {
      setErrorMsg('Preenche o nickname!');
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        await User.register(email, pass, nick);
        setSuccessMsg('Conta criada com sucesso! Redirecionando...');
        setTimeout(() => window.location.href = '/', 1500);
      } else {
        await User.login(email, pass);
        setSuccessMsg('Login feito com sucesso! Redirecionando...');
        setTimeout(() => window.location.href = '/', 1500);
      }
    } catch (Error) {
      console.log(Error);
      setErrorMsg(Error.message || 'Usuario ou senha incorretos.');
      setLoading(false);
    }
  }

  return (
    <div className='Login'>
      <div className='Login-Form'>
        <h1>Bem vindo</h1>
        <h6>ao</h6>
        <img src={Logo} alt="logo" width='150px' />
        <small>{isRegistering ? 'Cria a tua conta Firebase' : 'Entre para continuar'}</small>

        {isRegistering && (
          <form>
            <label name='nick'>Nickname</label>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
              </svg>
              <input type='text' name='nick' placeholder='Seu nickname' id='nickRegister' />
            </div>
          </form>
        )}

        <form>
          <label name='email'>Email</label>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
            </svg>
            <input type='email' name='email' placeholder='Email de acesso' id='emailLogin' />
          </div>
        </form>

        <form className='Password-Form'>
          <label name='password'>Senha</label>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
              <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            <input type='Password' name='password' placeholder='******' id='passLogin' />
          </div>
        </form>

        {errorMsg && <small className='erro-Login' style={{ color: 'red', display: 'block', margin: '5px 0' }}>{errorMsg}</small>}
        {successMsg && <small style={{ color: 'lightgreen', display: 'block', margin: '5px 0' }}>{successMsg}</small>}

        <div className='Login-Button'>
          <button onClick={handleAuth} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Carregando...' : (isRegistering ? 'Registar' : 'Entrar')}
          </button>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
          </svg>
        </div>

        <small className='signup' style={{ marginTop: '10px', cursor: 'pointer', color: 'lightblue', textDecoration: 'underline' }} onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(''); }}>
          {isRegistering ? 'Já tens conta? Faz login aqui' : 'Ainda não possui conta? Crie no Firebase!'}
        </small>

      </div>

    </div>
  )
}

export default PageLogin;