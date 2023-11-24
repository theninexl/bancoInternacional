export const TableData = (props) => {
  return (
    <div className={`bi-l-tabledata ${props.className}`}>
      {props.children}
    </div>
  );
}

export const TableDataHeader = (props) => {
  return (
    <div className={`bi-l-tabledata__header ${props.className}`}>
      {props.children}
    </div>
  );
}

export const TableDataFooter = (props) => {
  return (
    <div className={`bi-l-tabledata__footer ${props.className}`}>
      {props.children}
    </div>
  );
}


export const TableDataRow = (props) => {
  return (
    <div className={`bi-l-tabledata__row ${props.className}`}>
      {props.children}
    </div>
  );
}

export const TableDataRowWrapper = (props) => {
  return (
    <div className={`tablerow-wrapper ${props.className}`}>
      {props.children}
    </div>
  );
}

export const TableCellLong = (props) => {
  return (
    <div className={`tablecell-long ${props.className}`}>
      {props.children}
    </div>
  );
}

export const TableCellMedium = (props) => {
  return (
    <div className={`tablecell-medium ${props.className}`}>
      {props.children}
    </div>
  );
}

export const TableCellShort = (props) => {
  return (
    <div className={`tablecell-short ${props.className}`}>
      {props.children}
    </div>
  );
}