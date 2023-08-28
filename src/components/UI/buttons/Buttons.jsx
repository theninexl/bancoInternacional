export const ButtonLPrimary = (props) => {
  return (
    <button
      type={props.type}
      className={`bi-o-button-large--primary ${props.className}`}
      onClick={props.handleClick}>
        {props.children}
    </button>
  );
}

export const ButtonLSecondary = (props) => {
  return (
    <button
      type={props.type}
      className={`bi-o-button-large--secondary ${props.className}`}
      onClick={props.handleClick}>
        {props.children}
    </button>
  );
}

export const ButtonLGhost = (props) => {
  return (
    <button
      type={props.type}
      className={`bi-o-button-large--ghost ${props.className}`}
      onClick={props.handleClick}>
        {props.children}
    </button>
  );
}

export const ButtonMPrimary = (props) => {
  return (
    <button
      type={props.type}
      className={`bi-o-button-medium--primary ${props.className}`}
      onClick={props.handleClick}>
        {props.children}
    </button>
  );
}

export const ButtonMGhost = (props) => {
  return (
    <button
      type={props.type}
      className={`bi-o-button-medium--ghost ${props.className}`}
      onClick={props.handleClick}>
        {props.children}
    </button>
  );
}
