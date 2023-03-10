import User from '../backend/users';

function PageLogin() {

  const Login = async () => {
    try {
      var user = document.getElementById('userLogin').value
      var password = document.getElementById('passLogin').value
      await User.login(user, password)
      const userInfo = await User.getUser();
      window.location.href = '/';
    } catch (Error) {
      console.log(Error)
    }
  }

  const Register = async () => {
    var user = document.getElementById('userReg').value
    var password = document.getElementById('passReg').value
    var confpassword = document.getElementById('passRegC').value
    var nick = document.getElementById('NickReg').value
    document.querySelector('.Login-Form').style.display = 'block'


    if (confpassword !== password) {
      document.getElementById('erro-reg').innerHTML = 'As senhas devem ser iguais'
    } else if (user === '' || user === undefined || password === '' || password === undefined || nick === '' || nick === undefined) {
      document.getElementById('erro-reg').innerHTML = 'Você deve completar o que falta'
    } else if (password.length < 5) {
      document.getElementById('erro-reg').innerHTML = 'A senha deve ter no minimo 6 digitos!'
    } else if (user.length < 4) {
      document.getElementById('erro-reg').innerHTML = 'O usuario deve ter no minimo 5 digitos!'
    }
    
    else {
      try {
        var register = document.getElementById('register')

        register.style.transform = 'translateY(-2000px)'
        register.style.opacity = '0'

        var user2 = document.getElementById('userReg').value
        var password2 = document.getElementById('passReg').value
        var nick2 = document.getElementById('NickReg').value

        var response = await User.createUser(nick2, user2, password2)
        const userInfo = await User.createUser();
        console.log(response);
      } catch (Error) {
        alert('Senha ou Email Errados')
      }
    }

  }
  return (
    <div className='Login'>
      <div className='Login-Form'>
        <h1>Bem vindo</h1>
        <h6>ao</h6>
        <img src='/static/media/Logo.10d9b2ebed4705df7759.png' alt="logo" width='150px' />
        <small>Entre para continuar</small>
        <form>
          <label name='login'>Email</label>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
            </svg>
            <input type='text' name='login' placeholder='' id='userLogin' />
          </div>
        </form>

        <form className='Password-Form'>
          <label name='password'>Senha</label>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
              <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            <input type='Password' name='password' placeholder='' id='passLogin' />
          </div>
        </form>

        <small className='erro-Login'>Usuario ou senha incorretos</small>
        <div className='Login-Button'>

          <button onClick={Login}>Entrar</button>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
          </svg>
        </div>
        <small className='signup' onClick={registerApear} >Ainda não possui conta?</small>
      </div>

      <div className='Register-Form' id='register'>
        <svg onClick={CloseReg} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
        </svg>
        <h1>Registre-se</h1>
        <small>Para usar a maxima a experiencia do yusha</small>
        <form>
          <label name='login'>Usuario</label>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
            </svg>
            <input type='text' name='login' placeholder='' id='NickReg' autoComplete='no' />
          </div>
        </form>
        <form>
          <label name='login'>Email</label>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
            </svg>
            <input type='text' name='login' placeholder='' id='userReg' />
          </div>
        </form>
        <form>
          <label name='login'>Senha</label>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
              <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            <input type='password' name='login' placeholder='' id='passReg' />
          </div>
        </form>
        <form>
          <label name='login'>Confirme a senha</label>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
              <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            <input type='password' name='login' placeholder='' id='passRegC' />
          </div>
        </form>
        <small id='erro-reg'></small>
        <div className='Register-Button'>
          <button onClick={Register}>Criar conta</button>

          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
          </svg>
        </div>
      </div>

    </div>
  )

  function registerApear() {

    var register = document.getElementById('register')
    register.style.transform = 'translateY(-7px)'
    register.style.opacity = '1'
    document.querySelector('.Login-Form').style.display = 'none'

  }
  function CloseReg() {
    var register = document.getElementById('register')

    register.style.transform = 'translateY(-2000px)'
    register.style.opacity = '0'
    document.querySelector('.Login-Form').style.display = 'block'

  }
}

export default PageLogin