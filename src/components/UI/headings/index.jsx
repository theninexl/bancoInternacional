export const MainHeading = (props) => {
  return (
    <h1 className={`bi-u-text-headM bi-u-gray-text  ${props.className}`}>
      {props.children}
    </h1>
  );
}

export const SubHeading = (props) => {
  return (
    <h2 className={`bi-u-text-headS bi-u-gray-text  ${props.className}`}>
      {props.children}
    </h2>
  );
}