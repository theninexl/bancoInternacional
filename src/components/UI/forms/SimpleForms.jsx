export const SimpleFormHrz = (props) => {
  return (
    <form
      className={`bi-c-form-simple bi-l-form-simple bi-l-form-simple--hrz ${props.className}`}
      ref={props.innerRef}>
      {props.children}
    </form>
  );
}


export const SimpleFormRow = (props) => {
  return(
    <div className={`bi-l-form-simple__row ${props.className}`}>
      {props.children}
    </div>
  );
}

export const LabelElement = (props) => {
  return (
    <label htmlFor={props.htmlFor}>
      <span>{props.children}</span>
      <input 
        type={props.type}
        name={props.htmlFor}
        placeholder={props.placeholder}/>
    </label>
  );
}