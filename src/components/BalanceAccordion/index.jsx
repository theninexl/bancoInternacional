import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { TableDataRow, TableDataRowWrapper, TableCellMedium } from '../../components/UI/tables/TableDataElements';
import { ChevronRightIcon,MinusSmallIcon } from '@heroicons/react/24/solid';

const BalanceAccordion = ({ content }) => {
  const [open, setOpen]=useState(false);
  const subHeadings = content.subheadings;

  const handleOpen = () => {
    setOpen(!open);
  }

  return (
    <>
    <TableDataRow>
      <div className='dataRowAccordion'>
        <div className='dataRowAccordion--trigger'>
          <TableDataRowWrapper>
            <TableCellMedium
              className='bi-u-text-base-black' >
                <a onClick={handleOpen}>
                  <ChevronRightIcon 
                    className={open ? `bi-o-inlineIcon--big bi-u-rotateRight` : `bi-o-inlineIcon--big bi-u-noRotate`} />
                    &nbsp;{content.id_item}
                </a>
            </TableCellMedium>
            <TableCellMedium>{content.num_amount}</TableCellMedium>
            {/*<TableCellMedium>{content.currency}</TableCellMedium>*/}
            <TableCellMedium>{content.pct_amount_covered}%</TableCellMedium>
            <TableCellMedium></TableCellMedium>
          </TableDataRowWrapper>
        </div>

        {open ? (
          <div className='dataRowAccordion--content' key={uuidv4()}>
         {
          content.items.map(subHeading => {
            return (
              <TableDataRowWrapper key={uuidv4()}>
                <TableCellMedium>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{subHeading.id_hedge_accounting}</TableCellMedium>
                <TableCellMedium>{subHeading.num_amount}</TableCellMedium>
                {/*<TableCellMedium>{subHeading.currency}</TableCellMedium>*/}
                <TableCellMedium>{subHeading.pct_amount_covered}%</TableCellMedium>
                <TableCellMedium></TableCellMedium>
              </TableDataRowWrapper>
            );
          })
         }
         </div>
      ) : null}
      </div>
    </TableDataRow>
    </>
  );
}

export default BalanceAccordion;


{/* <div className='dataRowAccordion--content'>
          <TableDataRowWrapper>
            <TableCellMedium><MinusSmallIcon className='bi-o-inlineIcon--big'/>2aaaa</TableCellMedium>
            <TableCellMedium>bbb</TableCellMedium>
            <TableCellMedium>ccc</TableCellMedium>
            <TableCellMedium>ddd</TableCellMedium>
          </TableDataRowWrapper>
          <TableDataRowWrapper>
            <TableCellMedium><MinusSmallIcon className='bi-o-inlineIcon--big'/>3aaaa</TableCellMedium>
            <TableCellMedium>bbb</TableCellMedium>
            <TableCellMedium>ccc</TableCellMedium>
            <TableCellMedium>ddd</TableCellMedium>
          </TableDataRowWrapper>
        </div> */}