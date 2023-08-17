import { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { GlobalContext } from '../../context';
// import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Logo from '../UI/Logo';
import UserBox from './UserBox';

const MainNavbar = () => {
  const context = useContext(GlobalContext);
  
  
  //evaluar account
  const account = localStorage.getItem('account');
  const parsedAccount = JSON.parse(account);
  // const noAccountInLocalStorage = parsedAccount ? Object.keys(parsedAccount).length === 0 : true;
  // const noAccountInLocalState = context.account ? Object.keys(context.account).lenght === 0: true;
  // const hasUserAnAccount = !noAccountInLocalStorage || !noAccountInLocalState;
  //evaluar signout
  const signOUt = localStorage.getItem('sign-out');
  const parsedSignOut = JSON.parse(signOUt);
  const isUserSignOut = context.signOut || parsedSignOut;
  

  const handleSignOut = (e) => {
    e.preventDefault();
    //seteo signout en localStorage y context
    const stringifiedSignOut = JSON.stringify(true);
    localStorage.setItem('sign-out',stringifiedSignOut);
    context.setSignOut(true);
    //seteo account en localStorage y context
    localStorage.removeItem('account');
    context.setAccount({});
    //fuerzo ocultar el overlay
    context.setUserBoxOpen(false);
  }
  
  const handleUserOverlay = () => {  
    context.setUserBoxOpen(!context.userBoxOpen);
  }

  const renderLoginButton = () => {
    if (isUserSignOut) {
      return (
        <>
        {/* <NavLink
          to='/login'
          className={({isActive}) => 
          isActive ? 'bi-c-navbar-links__textbutt bi-c-navbar-links__textbutt--active' : 'bi-c-navbar-links__textbutt'}>
          Login<ArrowRightIcon className='icon'/>
        </NavLink> */}
        </>
      )
    } else if (!isUserSignOut) {
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
    if (!isUserSignOut) {
      return (
        <>
          <NavLink
            to='/'
            className={({isActive}) => 
            isActive ? 'bi-u-text-link bi-u-text-link__active' : 'bi-u-text-link'}>
            HedgeAccounting
          </NavLink>
          <NavLink
            to='/users'
            className={({isActive}) => 
            isActive ? 'bi-u-text-link bi-u-text-link__active' : 'bi-u-text-link'}>
            Usuarios
          </NavLink>
          <a className="bi-u-text-link bi-u-text-link__inactive">Amet consecteur</a>
        </>
      )
    } 
  }
  

  return (
    <>
    <header className="bi-l-header">
        <div className="bi-l-container">
          <nav className="bi-c-navbar">
            <div className="bi-c-navbar__left">              
              <Logo/>
            </div>
            <div className="bi-c-navbar__center"> 
              {renderMainLinks()}
            </div>
            <div className="bi-c-navbar__right">
              {renderLoginButton()}
            </div>
          </nav>
          <div className={context.userBoxOpen ? 'bi-c-overlay--activeUser': 'bi-u-inactive'}>
            <Link
              className='bi-o-overlay__notification'
              onClick={handleSignOut}>
                <div className="notification--text">Logout</div>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

export default MainNavbar;