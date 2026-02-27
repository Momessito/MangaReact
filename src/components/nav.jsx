import Search from './search';
import Burgers from './burger';
import '../App.css';
import '../media.css';
import { useEffect, useState } from 'react';
import Logo from '../Logo.png'
import { Link } from 'react-router-dom';
import User from '../backend/users';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

function Nav() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Listen to Firebase Auth state directly to avoid race conditions on page load
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // User is logged in
        document.getElementById('loginn').style.display = 'none';
        document.getElementById('user').style.display = 'block';

        try {
          const userInfo = await User.getUser();
          if (userInfo) {
            document.getElementById('nick').innerHTML = 'Bem vindo! <span>' + (userInfo.data.nickname || 'Usuario') + "</span>";
            document.getElementById('icon').src = userInfo.data.img || 'https://pbs.twimg.com/media/FCvrblIX0AI6sMJ.jpg';
          }
        } catch (err) {
          console.log("Error fetching profile", err);
        }

      } else {
        // User is logged out
        document.getElementById('loginn').style.display = 'block';
        document.getElementById('user').style.display = 'none';
      }
    });

    return () => unsubscribe();
  }, []);

  const Sair = async () => {
    await User.Exit()
  }
  var istrue = true

  function config() {
    if (istrue === true) {
      document.querySelector('.stats').style.display = '1'
      document.querySelector('.stats').style.animation = 'slide-in-blurred-top 0.5s cubic-bezier(0.230, 1.000, 0.320, 1.000) both'
      istrue = false
    } else {
      document.querySelector('.stats').style.opacity = '0'
      document.querySelector('.stats').style.animation = 'scale-out-top 0.3s cubic-bezier(0.550, 0.085, 0.680, 0.530) both'
      istrue = true
    }
  }

  return (
    <div>
      <nav className='nav1'>

        <Link to="/" ><img className='logo-img' alt='logo' src={Logo} /></Link>
        <Search />







        <div className='Logo'>
          <div id='user'>
            <img id='icon' />

            <div className='stats'>
              <p id='nick'></p>
              <ul>
                <li><Link to={'/perfil/meu-perfil'} id='listC'>Meu Perfil</Link></li>
                <li><Link to={'/amigos'} id='listC'>Comunidade</Link></li>
                <li><Link to={'/favoritos'} id='listC'>Meus Favoritos</Link></li>
                <li><Link to={'/config'} id='listC'>Configurações'</Link></li>
              </ul>
              <Link reloadDocument>
                <div className='wr2'></div>
                <small onClick={Sair}>Sair</small>
              </Link>
            </div>
          </div>


          <Link to='/Login' id='loginn'>
            <svg id='' xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-person-fill-down" viewBox="0 0 16 16">
              <path d="M12.5 9a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm.354 5.854 1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V10.5a.5.5 0 0 0-1 0v2.793l-.646-.647a.5.5 0 0 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z" />
            </svg>
          </Link>


        </div>


        <Burgers />
      </nav>
      <div style={{ width: '100%', height: '60px' }}></div>

    </div>
  )

}

export default Nav