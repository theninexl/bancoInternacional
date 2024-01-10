import { useState } from "react";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { IconButSm } from "../UI/buttons/IconButtons";


export const HedgesContextualActions = ({ hedgeId }) => {
  const navigate = useNavigate();
  const [optionsBoxOpen, setOptionsBoxOpen] = useState(false)

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

  return (
    <>
      <IconButSm
        handleClick={handleDisplayBox}
        className="bi-o-icon-button-small--primary">
        <EllipsisHorizontalIcon/>
      </IconButSm>
      <div className={optionsBoxOpen ? 'bi-c-overlay--entryOptions' : 'bi-u-inactive'}>
        <Link 
          onClick={(e) => {
            e.preventDefault();
            requestDisarm(hedgeId)}}
          className='bi-o-overlay__notification'>
            <div className="notification--text">Desarmar</div>
        </Link>
        <Link
          onClick={(e) => {
            e.preventDefault();
            validateStatus(hedgeId)}} 
          className='bi-o-overlay__notification'>
            <div className="notification--text">Validar</div>
        </Link>
        <Link
          onClick={(e) => {
            e.preventDefault();
            navigate('/hedges-status')}
          }
          className='bi-o-overlay__notification'>
            <div className="notification--text">Ver status</div>
        </Link>
      </div>
    </>
  );
}