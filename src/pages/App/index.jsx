import { useRoutes, BrowserRouter, Navigate } from 'react-router-dom';
import { useData, InitializeLocalStorage } from './useData';
import HedgeAccounting from '../HedgeAccounting';
import NewHedge from '../NewHedge';
import DisarmStatus from '../DisarmStatus';
import DisarmStatusDet from '../DisarmStatusDet';
import DisarmHedge from '../DisarmHedge';
import Login from '../Login';
import Users from '../Users';
import BalanceView from '../BalanceView';
import BonusView from '../BonusView';
import NewUser from '../NewUser';
import EditUser from '../EditUser';
import MainNavbar from '../../components/MainNavbar';
import '../../scss/styles.scss';


const AppRoutes = () => {  
  const {
    setAccount,
    signOut,
    setSignOut,
    users,
    setUsers,
    totalPages,
    setTotalPages,
    hedges,
    setHedges,
    allHedges,
    totalrowscount,
    setTotalrowscount,
    setAllHedges,
    page,
    setPage,
    fileInstrument,
    setFileInstrument,
    hedgeStatus,
    setHedgeStatus,
    hedgeStatusData,
    setHedgeStatusData,
    hedgeDisarmData,
    setHedgeDisarmData
  } = useData();

  //evaluar signout
  const signOUt = localStorage.getItem('sign-out');
  const parsedSignOut = JSON.parse(signOUt);
  const isUserSignOut = signOut || parsedSignOut;

  let routes = useRoutes([
    { path: '/', element: !isUserSignOut ? <Navigate replace to={'/hedges'}/> : <Navigate replace to={'/login'}/> },
    { path: '/hedges', 
      element: !isUserSignOut ? 
      <HedgeAccounting
        hedges={hedges}
        setHedges={setHedges}
        totalrowscount={totalrowscount}
        setTotalrowscount={setTotalrowscount}
        allHedges={allHedges}
        setAllHedges={setAllHedges}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        /> 
      : 
      <Navigate replace to={'/login'}/> },
    { path: '/hedges-new', 
      element: !isUserSignOut ? 
      <NewHedge
        hedges={hedges}
        totalrowscount={totalrowscount}
        setTotalrowscount={setTotalrowscount}
        setHedges={setHedges}
        allHedges={allHedges}
        setAllHedges={setAllHedges}
        page={page}
        /> 
      : 
      <Navigate replace to={'/login'}/>},
     { path: '/hedges-status', 
      element: !isUserSignOut ? 
      <DisarmStatus
        hedges={hedges}
        setHedges={setHedges}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        /> 
      : 
      <Navigate replace to={'/login'}/> },
    { path: '/hedges-status-det', 
      element: !isUserSignOut ? 
      <DisarmStatusDet
        hedgeStatusData={hedgeStatusData}
        setHedgeStatusData={setHedgeStatusData}
        hedgeStatus={hedgeStatus}
        setHedgeStatus={setHedgeStatus}
      /> 
      : 
      <Navigate replace to={'/login'}/>},
    { path: '/hedges-disarm', 
      element: !isUserSignOut ?
      <DisarmHedge
        hedgeStatusData={hedgeStatusData}
        setHedgeStatusData={setHedgeStatusData}
        hedgeDisarmData={hedgeDisarmData}
        setHedgeDisarmData={setHedgeDisarmData}
      /> 
      : 
      <Navigate replace to={'/login'}/>},
    { path: '/login', 
      element: isUserSignOut ? 
      <Login
        setAccount={setAccount}
        setSignOut={setSignOut}
      /> 
      : 
      <Navigate replace to={'/hedges'}/> },
    { path: '/mgmt-balance-view', 
      element: !isUserSignOut ? 
      <BalanceView/> 
      : 
      <Navigate replace to={'/login'}/> },
    { path: '/mgmt-bonus-view', 
      element: !isUserSignOut ? 
      <BonusView/> 
      : 
      <Navigate replace to={'/login'}/> },
    { path: '/users', 
      element: !isUserSignOut ? 
      <Users
        setTotalPages={setTotalPages}
        users={users}
        setUsers={setUsers}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      /> 
      : 
      <Navigate replace to={'/login'}/> },
    { path: '/users-new', 
      element: !isUserSignOut ? <NewUser/> : <Navigate replace to={'/login'}/> },
    { path: '/users-edit', element: !isUserSignOut ? <EditUser/> : <Navigate replace to={'/login'}/>} 
  ])
  return routes;
}

const App = () => {

  const {
    setAccount,
    signOut,
    setSignOut,
    userBoxOpen,
    setUserBoxOpen,
  } = useData();

  InitializeLocalStorage();


  return (
    <>
      <BrowserRouter>
        <MainNavbar
          signOut={signOut}
          setSignOut={setSignOut}
          setAccount={setAccount}
          userBoxOpen={userBoxOpen}
          setUserBoxOpen={setUserBoxOpen}
          />
        <AppRoutes/>          
      </BrowserRouter>
    </>
  )
}

export default App
