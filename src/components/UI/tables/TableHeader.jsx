const TableHeader = (props) => {
  return (
    <header className='bi-l-section--table-head bi-l-container'>
          <h1 className='bi-u-text-headM bi-u-gray-text'>{props.children}</h1>
        </header>
  );
}

export default TableHeader;