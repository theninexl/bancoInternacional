import { useEffect,useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
// import { GlobalContext } from '../../context';
import Api from '../../services/api';
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { TableData, TableDataHeader, TableDataRow, TableCellMedium, TableCellShort } from '../../components/UI/tables/TableDataElements';
import TablePagination from '../../components/TablePagination';
import { SortButton } from '../../components/UI/buttons/Buttons';
import { IconButSm } from '../../components/UI/buttons/IconButtons';
import { DocumentArrowDownIcon, InformationCircleIcon, BoltIcon } from '@heroicons/react/24/solid';
import { MainHeading } from '../../components/UI/headings';
import { LabelElement } from '../../components/UI/forms/SimpleForms';



function HedgeAccounting({ totalPages,setTotalPages,hedges,setHedges,page,setPage }){
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
    Api.call.post('hedges/getAll',data,{ headers:headers })
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

  //editar usuario
  const seeStatus = (id) => {
    navigate({      
      pathname:'/bancoInternacional/hedges-status',
      search: createSearchParams({
        id:id
      }).toString()
    });
  }
  //desarmar cobertura
  const requestDisarm = (id) => {
    navigate({      
      pathname:'/bancoInternacional/hedges-disarm',
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
            Listado coberturas
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
            <TableCellMedium>
              <SortButton orderCol={1} handleClick={() => sortItems()}>Ref.</SortButton>
            </TableCellMedium>
            <TableCellMedium>
              <SortButton orderCol={2} handleClick={() => sortItems()}>Ref. Part. Cubierta</SortButton>
            </TableCellMedium>
            <TableCellMedium>
              <SortButton orderCol={3} handleClick={() => sortItems()}>Ref. Instr.</SortButton>
            </TableCellMedium>
            <TableCellMedium>
              <SortButton orderCol={4} handleClick={() => sortItems()}>Tipo Cobertura</SortButton>
            </TableCellMedium>
            <TableCellMedium>
              <SortButton orderCol={5} handleClick={() => sortItems()}>Ratio Eficacia</SortButton>
            </TableCellMedium>
            <TableCellMedium>
              <SortButton orderCol={6} handleClick={() => sortItems()}>MtM Derivado</SortButton>
            </TableCellMedium>
            <TableCellMedium>
              <SortButton orderCol={7} handleClick={() => sortItems()}>Impacto OCI</SortButton>
            </TableCellMedium>
            <TableCellMedium>
              <SortButton orderCol={8} handleClick={() => sortItems()}>Impacto P&L</SortButton>
            </TableCellMedium>
            <TableCellMedium>
              <SortButton orderCol={9} handleClick={() => sortItems()}>Monto Subyacente</SortButton>
            </TableCellMedium>
            <TableCellMedium>
              <SortButton orderCol={10} handleClick={() => sortItems()}>Fecha Final</SortButton>
            </TableCellMedium>
            <TableCellMedium>
              <SortButton orderCol={11} handleClick={() => sortItems()}>Usuario</SortButton>
            </TableCellMedium>
            <TableCellShort>Ficha</TableCellShort>
            <TableCellShort>Status</TableCellShort>
            <TableCellShort>Desarmar</TableCellShort>
          </TableDataHeader>
          {
            hedges?.map(hedge => {
              const renderStatus = () => {
                if (hedge.status == 'Ok') {
                  return (
                    <>
                    <IconButSm
                      handleClick={() => seeStatus(hedge.hedge_ref)}
                      className="bi-o-icon-button-small--success">
                      <InformationCircleIcon/>
                    </IconButSm>
                    </>);  
                } else if (hedge.status == 'Pending') {
                  return (
                    <>
                    <IconButSm
                      handleClick={() => seeStatus(hedge.hedge_ref)}
                      className="bi-o-icon-button-small--warning">
                      <InformationCircleIcon/>
                    </IconButSm>
                    </>);  
                } else if (hedge.status == 'Denegada') {
                  return (
                    <>
                    <IconButSm
                      handleClick={() => seeStatus(hedge.hedge_ref)}
                      className="bi-o-icon-button-small--error">
                      <InformationCircleIcon/>
                    </IconButSm>
                    </>);    
                }        
              } 
              return (
                <TableDataRow key={uuidv4()}>
                  <TableCellMedium
                    className='bi-u-text-base-black'>{hedge.hedge_ref}</TableCellMedium>
                  <TableCellMedium>{hedge.hedge_item_ref}</TableCellMedium>
                  <TableCellMedium>{hedge.hedge_instrument_ref}</TableCellMedium>
                  <TableCellMedium>{hedge.hedge_type}</TableCellMedium>
                  <TableCellMedium>{hedge.rate}</TableCellMedium>
                  <TableCellMedium>{hedge.mtm}</TableCellMedium>
                  <TableCellMedium>{hedge.oci}</TableCellMedium>
                  <TableCellMedium>{hedge.pyl}</TableCellMedium>
                  <TableCellMedium>{hedge.amount}</TableCellMedium>
                  <TableCellMedium>{hedge.date_expire}</TableCellMedium>
                  <TableCellMedium>{hedge.user_create}</TableCellMedium>
                  <TableCellShort>
                    <IconButSm
                      className="bi-o-icon-button-small--disabled">
                      <DocumentArrowDownIcon/>
                    </IconButSm>
                  </TableCellShort>
                  <TableCellShort>
                    {renderStatus()}
                  </TableCellShort>
                  <TableCellShort>
                    <IconButSm
                      handleClick={() => requestDisarm(hedge.hedge_ref)}
                      className="bi-o-icon-button-small--primary">
                      <BoltIcon/>
                    </IconButSm>
                  </TableCellShort>
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

export default HedgeAccounting;