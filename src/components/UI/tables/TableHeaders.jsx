export const TableHeader = (props) => {
  return (
    <header
      style={props.style}
      className={`bi-l-section--table-head bi-l-container ${props.className}`}>
          <h1 className='bi-u-text-headM bi-u-gray-text'>{props.children}</h1>
        </header>
  );
}

export const TableHeaderSub = (props) => {
  return (
    <header
      className={`bi-o-header-sub-section ${props.className}`}>
        <h3 className='bi-u-text-headS'>{props.children}</h3>
      </header>
  );
}