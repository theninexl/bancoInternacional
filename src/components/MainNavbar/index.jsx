import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SecNavbar from '../SecondaryNavbar';
import Logo from '../UI/Logo';
import UserBox from './UserBox';

const MainNavbar = ({ signOut,setSignOut,setAccount,userBoxOpen,setUserBoxOpen }) => {
  const path = useLocation().pathname;
  
  //evaluar account
  const account = localStorage.getItem('account');
  const parsedAccount = JSON.parse(account);
 //evaluar signout
  const signOUT = localStorage.getItem('sign-out');
  const parsedSignOut = JSON.parse(signOUT);
  const isUserSignOut = parsedSignOut;

  
  //manejar signout
  const handleSignOut = (e) => {
    e.preventDefault();
    //seteo signout y account en localStorage y context
    const stringifiedSignOut = JSON.stringify(true);
    localStorage.setItem('sign-out',stringifiedSignOut);
    setSignOut(true);
    localStorage.removeItem('account');
    setAccount({});
    //fuerzo ocultar el overlay
    setUserBoxOpen(false);
  }
  //overlay boton signout
  const handleUserOverlay = () => {  
    setUserBoxOpen(!userBoxOpen);
  }

  const renderLoginButton = () => {
    if (!isUserSignOut) {
      return (
        <>
          <UserBox 
            handleClick={handleUserOverlay}
            username={parsedAccount ? parsedAccount.name: 'Username'}/>
        </>
      )
    }
  }

  const renderMainLinks = () => {
    const isUsersActive = path.includes('/users');
    const isHedgeActive = path.includes('/hedges');
    const isBalanceMangementActive = path.includes('/mgmt');

    if (!isUserSignOut) {
      return (
        <>
          <Link
            to='/hedges'
            className={isHedgeActive ? 'bi-c-navbar-links__textbutt active' : 'bi-c-navbar-links__textbutt'}>
            Coberturas
          </Link>
          <Link
            to='/mgmt-balance-view'
            className={isBalanceMangementActive ? 'bi-c-navbar-links__textbutt active' : 'bi-c-navbar-links__textbutt'}>
            Gestión de balance
          </Link>
          <Link
            to='/users'
            className={isUsersActive ? 'bi-c-navbar-links__textbutt active' : 'bi-c-navbar-links__textbutt'}>
            Usuarios
          </Link>
        </>
      )
    } 
  }  

  return (
    <>
    <header className="bi-l-header">
      <div className='bi-l-header__main-bar'>
        <div className="bi-l-container">
          <nav className="bi-c-navbar">
            <div className="bi-c-navbar__left">              
              <Logo/>
            </div>
            <div className="bi-c-navbar__center bi-u-centerText"></div>
            <div className="bi-c-navbar__right">
              <div className='bi-c-navbar__navBtns'>
                {renderMainLinks()}
              </div>
              {renderLoginButton()}
            </div>
          </nav>
          <div className={userBoxOpen ? 'bi-c-overlay--activeUser': 'bi-u-inactive'}>
            <Link
              className='bi-o-overlay__notification'
              onClick={handleSignOut}>
                <div className="notification--text">Logout</div>
            </Link>
          </div>
        </div>
      </div>
      {['/login','/'].includes(path) ? null : <SecNavbar/>}
    </header>
    </>
  );
}

export default MainNavbar;