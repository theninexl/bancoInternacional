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
    <div
      id={props.id}
      style={props.style} 
      className={`bi-l-form-simple__row ${props.className}`}>
      {props.children}
    </div>
  );
}

export const LabelElement = (props) => {
  return (
    <label 
      htmlFor={props.htmlFor}
      className={props.classNameLabel}
      style={props.style}
      >
      <span>{props.children}</span>
      <input 
        className={props.classNameInput}
        type={props.type}
        name={props.htmlFor}
        id={props.htmlFor}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.handleOnChange}
        required={props.required}
        disabled={props.disabled}
        readOnly={props.readOnly} />
    </label>
  );
}

export const ToggleElement = (props) => {
  return (
    <label htmlFor={props.htmlFor}>
      <span>{props.children}</span>
      <div
        className='bi-c-form-simple__radio-toggle'>
          <input 
            type='checkbox'
            name={props.htmlFor}
            onChange={props.handleOnChange}/>
      </div>
    </label>
  );
}

export const SelectElement = (props) => {
  return (
    <label 
      htmlFor={props.htmlFor}
      defaultValue={props.value}
      style={{display:'flex'}}>
        <span>{props.title}</span>
      <div 
        className='bi-c-select-icon'>
          <select
            className={`bi-c-select-icon__select ${props.className}`} 
            type="file" 
            name={props.htmlFor}
            id={props.htmlFor}
            value={props.value}
            onChange={props.handleOnChange}>
              {props.children}
          </select>
      </div>
    </label>
  );
}

export const UploadFileElement = (props) => {

  const handlePlaceHolder = (e) => {
    let tagName = document.getElementById(`${props.htmlFor}Placeholder`);
    tagName.innerText = e.target.files[0].name;
    console.log(e.target.files[0].name); 
  }

  return (
    <label 
      htmlFor={props.htmlFor}>
      <span>{props.children}</span>
      <div 
        className='bi-c-uploadfield-icon'>
        <input
          className={`bi-c-uploadfield-icon__input ${props.className}`} 
          type="file" 
          name={props.htmlFor}
          id={props.htmlFor}
          onChange={handlePlaceHolder}/>
          <span
            id={`${props.htmlFor}Placeholder`}
            className='placeholder'>
              {props.placeholder}
          </span>
      </div>
    </label>
  );
}

export const UploadFileTo64 = (props) => {
  return (
    <label 
      htmlFor={props.htmlFor}>
      <span>{props.children}</span>
      <div 
        className='bi-c-uploadfield-icon'>
        <input
          className={`bi-c-uploadfield-icon__input ${props.className}`} 
          type="file" 
          name={props.htmlFor}
          id={props.htmlFor}
          accept={props.accept}
          onChange={props.onChange}/>
          <span
            id={`${props.htmlFor}Placeholder`}
            className='placeholder'>
              {props.placeholder}
          </span>
      </div>
    </label>
  );
}

export const LabelIconField = ({ htmlFor, spanTitle, classNameLabel, classNameInput, type, placeholder, value, style, children, handleOnChage, handleOnclick, required, disabled, readOnly}) => {
  return (
    <label 
      htmlFor={htmlFor}
      className={classNameLabel}
      style={style}
      >
      <span>{spanTitle}</span>
      <div className='bi-c-field-icon'>
        <input 
          className={`bi-c-field-icon__input ${classNameInput}`}
          type={type}
          name={htmlFor}
          id={htmlFor}
          placeholder={placeholder}
          defaultValue={value}
          onChange={handleOnChage}
          required={required}
          disabled={disabled}
          readOnly={readOnly} />
         <button 
          className='bi-o-icon-button-small--secondary bi-c-field-icon__button' 
          id={`${htmlFor}Btn`}
          onClick={handleOnclick} >
            {children}
        </button>
      </div>
      
    </label>
  );
}



