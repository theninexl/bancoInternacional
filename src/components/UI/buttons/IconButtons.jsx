export const IconButSmPrimary = (props) => {
  return (
    <div className={`bi-o-icon-button-small--primary ${props.className}`}>
      {props.children}
    </div>
  );
}

export const IconButSmSecondary = (props) => {
  return (
    <div className={`bi-o-icon-button-small--secondary ${props.className}`}>
      {props.children}
    </div>
  );
}