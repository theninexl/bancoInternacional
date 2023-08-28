import { useContext } from 'react';
import { GlobalContext } from '../../context';
import { TableData, TableDataFooter, TableDataRow, TableCellLong } from '../UI/tables/TableDataElements';
import { IconButSmPrimary } from '..//UI/buttons/IconButtons';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const TablePagination = () => {
  const context = useContext(GlobalContext);

   const prevPage = () => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    context.setPage(context.page - 1);} 
   const nextPage = () => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    context.setPage(context.page + 1);}

  return (
    <TableData 
      className={`${context.totalPages <= 1 ? 'bi-u-inactive' : ''} bi-u-spacer-mb-huge`}>
          <TableDataFooter>
            <TableDataRow>
              <TableCellLong>
                <IconButSmPrimary
                  className={`${context.page === 1 ? 'bi-u-inactive' : '' }`}
                  handleClick={prevPage}>
                  <ChevronLeftIcon/>
                </IconButSmPrimary>
              </TableCellLong>
              <TableCellLong
                className='bi-u-centerText'>
                Página {context.page} of {context.totalPages}
              </TableCellLong>
              <TableCellLong
                className="bi-u-textRight">
                <IconButSmPrimary
                  className={`${context.page === context.totalPages ? 'bi-u-inactive' : '' }`}
                  handleClick={nextPage}>
                  <ChevronRightIcon/>
                </IconButSmPrimary>
              </TableCellLong>
            </TableDataRow>            
          </TableDataFooter>
        </TableData>        
  );
}

export default TablePagination;