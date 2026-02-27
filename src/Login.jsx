import './App.css';
import './media.css';
import SideMenu from './components/sideMenu';
import Nav from './components/nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Footer from './components/Footer';
import PageLogin from './components/PageLogin'

function Home() {
  var isH = false

  return (

    <div className="App">

      <div className='Black'></div>
      <SideMenu />
      <Nav />

        <PageLogin />
    </div>
  );

  

  }
export default Home;
