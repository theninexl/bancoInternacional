import { useRoutes, BrowserRouter, Navigate } from 'react-router-dom';
import { useData, InitializeLocalStorage } from './useData';
import HedgeAccounting from '../HedgeAccounting';
import NewHedge from '../NewHedge';
import DisarmStatus from '../DisarmStatus';
import DisarmHedge from '../DisarmHedge';
import Login from '../Login';
import Users from '../Users';
import NewUser from '../NewUser';
import EditUser from '../EditUser';
import MainNavbar from '../../components/MainNavbar';
import '../../scss/styles.scss';


const AppRoutes = ({ setAccount,setSignOut,users,setUsers,totalPages,setTotalPages,setHedges,page,setPage,hedges,fileInstrument,setFileInstrument,hedgeStatusData,setHedgeStatusData,hedgeStatus,setHedgeStatus,hedgeDisarmData,setHedgeDisarmData }) => {
  const {
    signOut
  } = useData();

  //evaluar signout
  const signOUt = localStorage.getItem('sign-out');
  const parsedSignOut = JSON.parse(signOUt);
  const isUserSignOut = signOut || parsedSignOut;

  let routes = useRoutes([
    { path: '/bancoInternacional/', element: !isUserSignOut ? <Navigate replace to={'/bancoInternacional/hedges'}/> : <Navigate replace to={'/bancoInternacional/login'}/> },
    { path: '/bancoInternacional/hedges', 
      element: !isUserSignOut ? 
      <HedgeAccounting
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        setHedges={setHedges}
        page={page}
        setPage={setPage}
        hedges={hedges}
        /> 
      : 
      <Navigate replace to={'/bancoInternacional/login'}/> },
    { path: '/bancoInternacional/hedges-new', 
      element: !isUserSignOut ? 
      <NewHedge
        fileInstrument={fileInstrument}
        setFileInstrument={setFileInstrument}/> 
      : 
      <Navigate replace to={'/bancoInternacional/login'}/>},
    { path: '/bancoInternacional/hedges-status', 
      element: !isUserSignOut ? 
      <DisarmStatus
        hedgeStatusData={hedgeStatusData}
        setHedgeStatusData={setHedgeStatusData}
        hedgeStatus={hedgeStatus}
        setHedgeStatus={setHedgeStatus}
      /> 
      : 
      <Navigate replace to={'/bancoInternacional/login'}/>},
    { path: '/bancoInternacional/hedges-disarm', 
      element: !isUserSignOut ?
      <DisarmHedge
        hedgeStatusData={hedgeStatusData}
        setHedgeStatusData={setHedgeStatusData}
        hedgeDisarmData={hedgeDisarmData}
        setHedgeDisarmData={setHedgeDisarmData}
      /> 
      : 
      <Navigate replace to={'/bancoInternacional/login'}/>},
    { path: '/bancoInternacional/login', 
      element: isUserSignOut ? 
      <Login
        setAccount={setAccount}
        setSignOut={setSignOut}
      /> 
      : 
      <Navigate replace to={'/bancoInternacional/hedges'}/> },
    { path: '/bancoInternacional/users', 
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
      <Navigate replace to={'/bancoInternacional/login'}/> },
    { path: '/bancoInternacional/users-new', 
      element: !isUserSignOut ? <NewUser/> : <Navigate replace to={'/bancoInternacional/login'}/> },
    { path: '/bancoInternacional/users-edit', element: !isUserSignOut ? <EditUser/> : <Navigate replace to={'/bancoInternacional/login'}/>} 
  ])
  return routes;
}

const App = () => {

  const {
    setAccount,
    signOut,
    setSignOut,
    users,
    setUsers,
    page,
    setPage,
    totalPages,
    setTotalPages,
    userBoxOpen,
    setUserBoxOpen,
    hedges,
    setHedges,
    fileInstrument,
    setFileInstrument,
    hedgeStatusData,
    setHedgeStatusData,
    hedgeStatus,
    setHedgeStatus,
    hedgeDisarmData,
    setHedgeDisarmData
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
          <AppRoutes
            setAccount={setAccount}
            setSignOut={setSignOut}
            users={users}
            setUsers={setUsers}
            totalPages={totalPages}
            setTotalPages={setTotalPages}
            setHedges={setHedges}
            page={page}
            setPage={setPage}
            hedges={hedges}
            fileInstrument={fileInstrument}
            setFileInstrument={setFileInstrument}
            hedgeStatusData={hedgeStatusData}
            setHedgeStatusData={setHedgeStatusData}
            hedgeStatus={hedgeStatus}
            setHedgeStatus={setHedgeStatus}
            hedgeDisarmData={hedgeDisarmData}
            setHedgeDisarmData={setHedgeDisarmData}
            />          
        </BrowserRouter>
    </>
  )
}

export default App
