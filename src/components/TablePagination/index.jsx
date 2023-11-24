// import { useContext } from 'react';
// import { GlobalContext } from '../../context';
import { TableData, TableDataFooter, TableDataRow, TableCellLong, TableDataRowWrapper } from '../UI/tables/TableDataElements';
import { IconButSmPrimary } from '..//UI/buttons/IconButtons';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const TablePagination = ({ page,setPage,totalPages }) => {
  // const context = useContext(GlobalContext);

   const prevPage = () => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    setPage(page - 1);} 
   const nextPage = () => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    setPage(page + 1);}

  return (
    <TableData 
      className={`${totalPages <= 1 ? 'bi-u-inactive' : ''} bi-u-spacer-mb-huge`}>
          <TableDataFooter>
            <TableDataRow>
              <TableDataRowWrapper>
                <TableCellLong>
                  <IconButSmPrimary
                    className={`${page === 1 ? 'bi-u-inactive' : '' }`}
                    handleClick={prevPage}>
                    <ChevronLeftIcon/>
                  </IconButSmPrimary>
                </TableCellLong>
                <TableCellLong
                  className='bi-u-centerText'>
                  Página {page} of {totalPages}
                </TableCellLong>
                <TableCellLong
                  className="bi-u-textRight">
                  <IconButSmPrimary
                    className={`${page === totalPages ? 'bi-u-inactive' : '' }`}
                    handleClick={nextPage}>
                    <ChevronRightIcon/>
                  </IconButSmPrimary>
                </TableCellLong>
              </TableDataRowWrapper>
            </TableDataRow>            
          </TableDataFooter>
        </TableData>        
  );
}

export default TablePagination;