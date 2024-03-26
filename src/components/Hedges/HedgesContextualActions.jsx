import { useEffect,useState } from "react";
import { usePostData } from "../../hooks/usePostData";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { IconButSm } from "../UI/buttons/IconButtons";


export const HedgesContextualActions = ({ hedgeId, hedgeStatus }) => {

  const SERVER = import.meta.env.VITE_DB_SERVER;
  console.log('server',SERVER);
 

  const navigate = useNavigate();
  const [optionsBoxOpen, setOptionsBoxOpen] = useState(false);

  const getSheet = usePostData();

  //overlay boton opciones
  const handleDisplayBox = () => {  
    setOptionsBoxOpen(!optionsBoxOpen);
  }

  //desarmar cobertura
  const requestDisarm = (id) => {
    navigate({      
      pathname:'/hedges-disarm',
      search: createSearchParams({
        id:id
      }).toString()
    });
  }

  //ver status cobertura
  const validateStatus = (id) => {
    navigate({      
      pathname:'/hedges-status-det',
      search: createSearchParams({
        id:id
      }).toString()
    });
  }  


  //descargar ficha
  const downloadSheet = (id) => {
    getSheet.postData('hedges/getSheet',{'id_hedge_relationship':id});
  }

  useEffect(()=>{
    if(getSheet.responsePostData) console.log(getSheet.responsePostData);
  },[getSheet.responsePostData])

  return (
    <>
      <IconButSm
        handleClick={handleDisplayBox}
        className="bi-o-icon-button-small--primary">
        <EllipsisHorizontalIcon/>
      </IconButSm>
      <div className={optionsBoxOpen ? 'bi-c-overlay--entryOptions' : 'bi-u-inactive'}>
        {hedgeStatus == 1 ?
          <>
            <Link 
            onClick={(e) => {
              e.preventDefault();
              requestDisarm(hedgeId)}}
            className='bi-o-overlay__notification'>
              <div className="notification--text">Desarmar</div>
          </Link>
          </>
          : ''}
        <Link
          onClick={(e) => {
            e.preventDefault();
            validateStatus(hedgeId)}} 
          className='bi-o-overlay__notification'>
            <div className="notification--text">Ver status</div>
        </Link>
        <Link 
          to={`${SERVER}/api/hedges/getSheet?id=${hedgeId}`}
          download
          className='bi-o-overlay__notification'>
            <div className="notification--text">Descargar ficha</div>
        </Link>
      </div>
    </>
  );
}