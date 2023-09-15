// import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { GlobalContext } from '../../context';
import SecNavbar from '../SecondaryNavbar';
import Logo from '../UI/Logo';
import UserBox from './UserBox';

const MainNavbar = ({ signOut,setSignOut,setAccount,userBoxOpen,setUserBoxOpen }) => {
  // const context = useContext(GlobalContext);
  const path = useLocation().pathname;

  
  //evaluar account
  const account = localStorage.getItem('account');
  const parsedAccount = JSON.parse(account);
  //evaluar signout
  const signOUt = localStorage.getItem('sign-out');
  const parsedSignOut = JSON.parse(signOUt);
  const isUserSignOut = signOut || parsedSignOut;
  
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
    const isUsersActive = path.includes('/bancoInternacional/users');
    const isHedgeActive = path.includes('/bancoInternacional/hedges');

    if (!isUserSignOut) {
      return (
        <>
          <Link
            to='/bancoInternacional/hedges'
            className={isHedgeActive ? 'bi-u-text-link bi-u-text-link__active' : 'bi-u-text-link'}>
            Coberturas
          </Link>
          <Link
            to='/bancoInternacional/users'
            className={isUsersActive ? 'bi-u-text-link bi-u-text-link__active' : 'bi-u-text-link'}>
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
            <div className="bi-c-navbar__center bi-u-centerText"> 
              {renderMainLinks()}
            </div>
            <div className="bi-c-navbar__right">
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
      {['/bancoInternacional/login','/'].includes(path) ? null : <SecNavbar/>}
    </header>
    </>
  );
}

export default MainNavbar;