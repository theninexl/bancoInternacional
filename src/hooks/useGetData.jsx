import { useEffect, useState } from "react";
import Api from "../services/api";
import { useRetrieveApiHeaders } from "./useRetrieveApiHeaders";

export const useGetData = (endpoint,parameters) => {
  const {headers} = useRetrieveApiHeaders();
  const [responseGetData, setResponseGetData] = useState(null);  

 useEffect(()=> {
  Api.call.post(endpoint,parameters,{ headers:headers})
    .then(response => {
      setResponseGetData(response);
    })
    .catch(err => {
      setResponseGetData(err)
    })
 },[])

  return { responseGetData };
}