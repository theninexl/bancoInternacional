import { useEffect,useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
// import { GlobalContext } from '../../context';
import Api from '../../services/api';
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { TableData, TableDataHeader, TableDataRow, TableCellMedium, TableCellShort, TableDataRowWrapper } from '../../components/UI/tables/TableDataElements';
import TablePagination from '../../components/TablePagination';
import { ButtonLPrimary, SortButton } from '../../components/UI/buttons/Buttons';
import { IconButSm } from '../../components/UI/buttons/IconButtons';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { MainHeading } from '../../components/UI/headings';
import { LabelElement } from '../../components/UI/forms/SimpleForms';



function DisarmStatus({ totalPages,setTotalPages,hedges,setHedges,page,setPage }){
  const navigate = useNavigate();
  const rowspage = 10;
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState(1);
  const sortBtns = document.querySelectorAll('.bi-o-sortButton');

  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token;

  //calcular paginacion
  const calcTotalPages = (totalResults,totalRows) => setTotalPages(Math.ceil(totalResults/totalRows));

  //listar usuarios
  const getHedges = (busqueda, orden) => {
    const headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    }
    const data = {
      'search':busqueda,
      'pagenumber':page,
      'rowspage':rowspage,
      'orderby':orden
    }
    Api.call.post('hedges/disarmStatusGetAll',data,{ headers:headers })
    .then(res => {
      calcTotalPages(res.data.rowscount[0].count, rowspage);
      setHedges(res.data.data)
    }).catch(err => console.warn(err))
  }

  const execGetHedges = async (search,order) => await getHedges(search = search, order = order);

  //resetear pagina a 1
  useEffect(()=>{
    setPage(1);
  },[setPage])

  useEffect(()=>{
    execGetHedges(searchValue,order);
  },[page, order, searchValue]);

  //estado desarme
  const seeStatus = (id) => {
    navigate({      
      pathname:'/hedges-status-det',
      search: createSearchParams({
        id:id
      }).toString()
    });
  }

  //reordenar resultados
  const sortItems = () => {
    const sortCol = event.target.getAttribute('data-column');
    const descIcon = event.target.querySelector(':scope > span.sortIcon--desc');
    const ascIcon = event.target.querySelector(':scope > span.sortIcon--asc');

    sortBtns.forEach(btn =>{
      const descIcon = btn.querySelector(':scope > span.sortIcon--desc');
      const ascIcon = btn.querySelector(':scope > span.sortIcon--asc');
      descIcon.classList.add('bi-u-inactive');
      ascIcon.classList.add('bi-u-inactive');
    })
    
    if (Math.abs(order) === Math.abs(sortCol)) {
      if (order < 0) {
        setOrder(Math.abs(order));
        descIcon.classList.remove('bi-u-inactive');
        ascIcon.classList.add('bi-u-inactive');
      } else {
        setOrder(-Math.abs(order));
        descIcon.classList.add('bi-u-inactive');
        ascIcon.classList.remove('bi-u-inactive');
      }
    } else {
      if (sortCol < 0) {
        setOrder(Math.abs(sortCol));
        descIcon.classList.remove('bi-u-inactive');
        ascIcon.classList.add('bi-u-inactive');
      } else {
        setOrder(-Math.abs(sortCol));
        descIcon.classList.add('bi-u-inactive');
        ascIcon.classList.remove('bi-u-inactive');
      }
    }
  }

  return (
    <main className="bi-u-h-screen--wSubNav">
       <TableHeader>
          <MainHeading>
            Validación de desarmes
          </MainHeading>
          <div className='bi-c-form-simple'>
            <LabelElement
              htmlFor='searchHedges'
              type='text'
              placeholder='Busca coberturas'
              handleOnChange={(event)=>{
                console.log(event.target.value);
                setSearchValue(event.target.value)
              }} />
          </div>
        </TableHeader>
        <TableData>
          <TableDataHeader>
            <TableCellMedium className='bi-u-centerText'>
              <SortButton orderCol={1} handleClick={() => sortItems()}>Ref.</SortButton>
            </TableCellMedium>
            <TableCellMedium className='bi-u-centerText'>
              <SortButton orderCol={2} handleClick={() => sortItems()}>Partida cubierta</SortButton>
            </TableCellMedium>
            <TableCellMedium className='bi-u-centerText'>
              <SortButton orderCol={3} handleClick={() => sortItems()}>Derivado</SortButton>
            </TableCellMedium>
            <TableCellMedium className='bi-u-centerText'>
              <SortButton orderCol={4} handleClick={() => sortItems()}>Tipo</SortButton>
            </TableCellMedium>
            <TableCellMedium className='bi-u-centerText'>
              <SortButton orderCol={5} handleClick={() => sortItems()}>Ratio eficacia</SortButton>
            </TableCellMedium>
            <TableCellMedium>
              <SortButton orderCol={6} handleClick={() => sortItems()}>Monto subyacente</SortButton>
            </TableCellMedium>
            <TableCellMedium>
              <SortButton orderCol={7} handleClick={() => sortItems()}>Fecha inicio</SortButton>
            </TableCellMedium>
            <TableCellMedium>
              <SortButton orderCol={8} handleClick={() => sortItems()}>Fecha vencimiento</SortButton>
            </TableCellMedium>
            <TableCellMedium>
              <SortButton orderCol={9} handleClick={() => sortItems()}>Usuario</SortButton>
            </TableCellMedium>
            <TableCellShort>Validar</TableCellShort>
          </TableDataHeader>
          {
            hedges?.map(hedge => {
              const renderStatus = () => {
                return (
                  <ButtonLPrimary
                  handleClick={() => seeStatus(hedge.id_hedge_relationship)} >
                    Validar
                  </ButtonLPrimary>
                );
                // if (hedge.status == 'Ok') {
                //   return (
                //     <>
                //     <IconButSm
                //       handleClick={() => seeStatus(hedge.id_hedge_relationship)}
                //       className="bi-o-icon-button-small--success">
                //       <InformationCircleIcon/>
                //     </IconButSm>
                //     </>);  
                // } else if (hedge.status == 'Pendiente') {
                //   return (
                //     <>
                //     <IconButSm
                //       handleClick={() => seeStatus(hedge.id_hedge_relationship)}
                //       className="bi-o-icon-button-small--warning">
                //       <InformationCircleIcon/>
                //     </IconButSm>
                //     </>);  
                // } else if (hedge.status == 'Denegada') {
                //   return (
                //     <>
                //     <IconButSm
                //       handleClick={() => seeStatus(hedge.id_hedge_relationship)}
                //       className="bi-o-icon-button-small--error">
                //       <InformationCircleIcon/>
                //     </IconButSm>
                //     </>);    
                // }        
              } 
              return (
                <TableDataRow key={uuidv4()}>
                  <TableDataRowWrapper>
                    <TableCellMedium
                      className='bi-u-text-base-black bi-u-centerText'>{hedge.id_hedge_relationship}</TableCellMedium>
                    <TableCellMedium className='bi-u-centerText'>{hedge.id_hedge_item}</TableCellMedium>
                    <TableCellMedium className='bi-u-centerText'>{hedge.id_hedge_instrument}</TableCellMedium>
                    <TableCellMedium className='bi-u-centerText'>{hedge.cat_hedge_type}</TableCellMedium>
                    <TableCellMedium className='bi-u-centerText'>{hedge.pct_effectiveness}</TableCellMedium>
                    <TableCellMedium>{hedge.num_underlying_amount}</TableCellMedium>
                    <TableCellMedium>{hedge.dt_start_date}</TableCellMedium>
                    <TableCellMedium>{hedge.dt_maturity_date}</TableCellMedium>
                    <TableCellMedium>{hedge.user_insert}</TableCellMedium>
                    <TableCellShort>
                      {renderStatus()}
                    </TableCellShort>
                    </TableDataRowWrapper>
                </TableDataRow>
              );
            })
          }
        </TableData>
        <TablePagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          />    
    </main>
  );
}

export default DisarmStatus;