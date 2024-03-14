import { useState } from "react";
import Api from "../services/api";
import { useRetrieveApiHeaders } from "./useRetrieveApiHeaders";

export const useSaveData = (endpoint,parameters) => {
  const {headers} = useRetrieveApiHeaders();
  const [responseUpload, setResponseUpload] = useState(null);  

  const uploadData = async (endpoint,parameters) => {

    await Api.call.post(endpoint.toString(),parameters,{ headers:headers})
    .then(response => {
      console.log(response.data)
      setResponseUpload(response.data)
    })
    .catch(err => {
      console.log('error en useSaveData', err)
      setResponseUpload(err)
    })
  }

  return { uploadData, responseUpload };
}