import { createContext, useState } from 'react';


export const GlobalContext = createContext();

export const InitializeLocalStorage = () => {

  const accountInLocalStorage = localStorage.getItem('account');
  const signOutInLocalStorage = localStorage.getItem('sign-out');
  let parsedAccount;
  let parsedSignOut;

  if (!accountInLocalStorage) {
    localStorage.setItem('account', JSON.stringify({}));
    parsedAccount = {};
  } else {
    parsedAccount = JSON.parse(accountInLocalStorage);
  }

  if (!signOutInLocalStorage) {
    localStorage.setItem('sign-out', JSON.stringify({}));
    parsedSignOut = {};
  } else {
    parsedSignOut = JSON.parse(signOutInLocalStorage);
  }
}

export const useData = () => {
  const currentPath = import.meta.env.VITE_PUBLIC_PATH;

  //account
  const [account, setAccount] = useState({});
  //signout
  const [signOut, setSignOut] = useState(false);

  //getUsers
  const [users, setUsers] = useState([]); 

  //getHedges
  const [hedges, setHedges] = useState([]);
  const [totalrowscount, setTotalrowscount] = useState(0);
  const [allHedges, setAllHedges] = useState([]);
  const [newHedgeData, setNewHedgeData] = useState([]);
  const [fileInstrument, setFileInstrument] = useState([]);

  //getHedge
  const [hedgeStatusData, setHedgeStatusData] = useState([]);
  const [hedgeStatus,setHedgeStatus] = useState([]);
  const [hedgeDisarmData, setHedgeDisarmData] = useState([]);

  //hedgeDisarm
  const [deferredFlowFile, setDeferredFlowFile] = useState();
  const [deferredFlowInfo, setDeferredFlowInfo] = useState();


  //list pagination
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(null);

  //efficacy test
  const [efficacyTestFile, setEfficacyTestFile] = useState();
  const [efficacyTestInfo, setEfficacyTestInfo] = useState();

  //main navbar
  //UserBox component
  const [userBoxOpen, setUserBoxOpen] = useState(false);

  return {
    currentPath,
    account,
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
    totalrowscount,
    setTotalrowscount,
    allHedges,
    setAllHedges,
    fileInstrument,
    setFileInstrument,
    newHedgeData,
    setNewHedgeData,
    hedgeStatusData,
    setHedgeStatusData,
    hedgeStatus,
    setHedgeStatus,
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
  };
}