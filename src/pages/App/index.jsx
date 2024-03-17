import { useRoutes, BrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { useData, InitializeLocalStorage } from './useData';
import HedgeAccounting from '../HedgeAccounting';
import NewHedge from '../NewHedge';
import PendingValidations from '../PendingValidations';
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
import EfficacyTest from '../EfficacyTest';


const AppRoutes = () => {  
  const {
    currentPath,
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
    hedgeStatus,
    setHedgeStatus,
    hedgeStatusData,
    setHedgeStatusData,
    hedgeDisarmData,
    setHedgeDisarmData,
    deferredFlowFile,
    setDeferredFlowFile,
    deferredFlowInfo,
    setDeferredFlowInfo,
    efficacyTestFile,
    setEfficacyTestFile,
    efficacyTestInfo,
    setEfficacyTestInfo,
  } = useData();

  //evaluar signout
  const signOUt = localStorage.getItem('sign-out');
  const parsedSignOut = JSON.parse(signOUt);
  const isUserSignOut = signOut || parsedSignOut;


  let routes = useRoutes([
    { path: `/`, element: !isUserSignOut ? <Navigate replace to={`/hedges`}/> : <Navigate replace to={`/login`}/> },
    { path: `/login`, 
      element: isUserSignOut ? 
      <Login
        setAccount={setAccount}
        setSignOut={setSignOut}
      /> 
      : 
      <Navigate replace to={`/hedges`}/> },  
    { path: `/hedges`, 
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
      <Navigate replace to={`/login`}/> },
    { path: `/hedges-new`, 
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
      <Navigate replace to={`/login`}/> },
     { path: `/hedges-pending-validations`, 
      element: !isUserSignOut ? 
      <PendingValidations
        hedges={hedges}
        setHedges={setHedges}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        /> 
      : 
      <Navigate replace to={`/login`}/> },
    { path: `/hedges-status-det`, 
      element: !isUserSignOut ? 
      <DisarmStatusDet
        hedgeStatusData={hedgeStatusData}
        setHedgeStatusData={setHedgeStatusData}
        hedgeStatus={hedgeStatus}
        setHedgeStatus={setHedgeStatus}
        deferredFlowFile={deferredFlowFile}
        setDeferredFlowFile={setDeferredFlowFile}
        deferredFlowInfo={deferredFlowInfo}
        setDeferredFlowInfo={setDeferredFlowInfo}
      /> 
      : 
      <Navigate replace to={`/login`}/> },
    { path: `/hedges-disarm`, 
      element: !isUserSignOut ?
      <DisarmHedge
        hedgeStatusData={hedgeStatusData}
        setHedgeStatusData={setHedgeStatusData}
        hedgeDisarmData={hedgeDisarmData}
        setHedgeDisarmData={setHedgeDisarmData}
      /> 
      : 
      <Navigate replace to={`/login`}/> },
    { path: `/hedges-efficacy-test`, 
      element: !isUserSignOut ?
      <EfficacyTest 
        efficacyTestFile={efficacyTestFile}
        setEfficacyTestFile={setEfficacyTestFile}
        efficacyTestInfo={efficacyTestInfo}
        setEfficacyTestInfo={setEfficacyTestInfo}
      />
      : 
      <Navigate replace to={`/login`}/> },
    { path: `/mgmt-balance-view`, 
      element: !isUserSignOut ? 
      <BalanceView
        totalrowscount={totalrowscount}
        setTotalrowscount={setTotalrowscount}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
      /> 
      : 
      <Navigate replace to={`/login`}/> },
    { path: `/mgmt-bonus-view`, 
      element: !isUserSignOut ? 
      <BonusView/> 
      : 
      <Navigate replace to={`/login`}/> },
    { path: `/users`, 
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
      <Navigate replace to={`/login`}/> },
    { path: `/users-new`, 
      element: !isUserSignOut ? <NewUser/> : <Navigate replace to={`/login`}/> },
    { path: `/users-edit`, element: !isUserSignOut ? <EditUser/> : <Navigate replace to={`/login`}/> } 
  ])
  return routes;
}

const App = () => {

  const {
    currentPath,
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
          currentPath={currentPath}
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
