import { useContext } from 'react';
import { useRoutes, BrowserRouter, Navigate } from 'react-router-dom';
import { GlobalContext, GlobalContextProvider, InitializeLocalStorage } from '../../context';
import HedgeAccounting from '../HedgeAccounting';
import NewHedge from '../NewHedge';
import Login from '../Login';
import Users from '../Users';
import NewUser from '../NewUser';
import EditUser from '../EditUser';
import MainNavbar from '../../components/MainNavbar';
import '../../scss/styles.scss';



const AppRoutes = () => {
  const context = useContext(GlobalContext);
  //evaluar account
  // const account = localStorage.getItem('account');
  // const parsedAccount = JSON.parse(account);
  // const noAccountInLocalStorage = parsedAccount ? Object.keys(parsedAccount).length === 0 : true;
  // const noAccountInLocalState = context.account ? Object.keys(context.account).lenght === 0: true;
  // const hasUserAnAccount = !noAccountInLocalStorage || !noAccountInLocalState;
  //evaluar signout
  const signOUt = localStorage.getItem('sign-out');
  const parsedSignOut = JSON.parse(signOUt);
  const isUserSignOut = context.signOut || parsedSignOut;

  let routes = useRoutes([
    { path: '/', element: !isUserSignOut ? <Navigate replace to={'/hedges'}/> : <Navigate replace to={'/login'}/> },
    { path: '/hedges', element: !isUserSignOut ? <HedgeAccounting/> : <Navigate replace to={'/login'}/> },
    { path: '/hedges-new', element: !isUserSignOut ? <NewHedge/> : <Navigate replace to={'/login'}/>},
    { path: '/login', element: isUserSignOut ? <Login/> : <Navigate replace to={'/hedges'}/> },
    { path: '/users', element: !isUserSignOut ? <Users/> : <Navigate replace to={'/login'}/> },
    { path: '/users-new', element: !isUserSignOut ? <NewUser/> : <Navigate replace to={'/login'}/> },
    { path: '/users-edit', element: !isUserSignOut ? <EditUser/> : <Navigate replace to={'/login'}/>} 
  ])
  return routes;
}

const App = () => {

  InitializeLocalStorage();


  return (
    <>
      <GlobalContextProvider>
        <BrowserRouter>
          <MainNavbar/>
          <AppRoutes/>          
        </BrowserRouter>
      </GlobalContextProvider>
    </>
  )
}

export default App
