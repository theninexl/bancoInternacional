export const IconButSm = (props) => {
  return (
    <div 
      className={`bi-o-icon-button-small ${props.className}`}
      onClick={props.handleClick} >
      {props.children}
    </div>
  );
}

export const IconButSmPrimary = (props) => {
  return (
    <div 
      className={`bi-o-icon-button-small--primary ${props.className}`}
      onClick={props.handleClick} >
      {props.children}
    </div>
  );
}

export const IconButSmSecondary = (props) => {
  return (
    <div 
      className={`bi-o-icon-button-small--secondary ${props.className}`}
      onClick={props.handleClick} >
      {props.children}
    </div>
  );
}

export const IconButSmSuccess = (props) => {
  return (
    <div 
      className={`bi-o-icon-button-small--success ${props.className}`}
      onClick={props.handleClick} >
      {props.children}  
    </div>
  );
}

export const IconButSmWarning = (props) => {
  return (
    <div 
      className={`bi-o-icon-button-small--warning ${props.className}`}
      onClick={props.handleClick} >
      {props.children}
    </div>
  );
}

export const IconButSmError = (props) => {
  return (
    <div 
      className={`bi-o-icon-button-small--error ${props.className}`}
      onClick={props.handleClick} >
      {props.children}
    </div>
  );
}