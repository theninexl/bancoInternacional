import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Api from '../../services/api';
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { TableData, TableDataHeader, TableDataRow, TableCellMedium, TableCellShort, TableDataRowWrapper } from '../../components/UI/tables/TableDataElements';
import TablePagination from '../../components/TablePagination';
import { SortButton } from '../../components/UI/buttons/Buttons';
import { IconButSm } from '../../components/UI/buttons/IconButtons';
import { DocumentArrowDownIcon, BoltIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { MainHeading } from '../../components/UI/headings';
import { LabelElement,SelectElement } from '../../components/UI/forms/SimpleForms';
import { CSVLink } from 'react-csv';
import { HedgesContextualActions } from '../../components/Hedges/HedgesContextualActions';



function HedgeAccounting({ totalPages,setTotalPages,hedges,setHedges,page,setPage,totalrowscount,setTotalrowscount }){
  const navigate = useNavigate();
  const rowspage = 10;
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState(1);
  const [allHedges, setAllHedges] = useState([]);
  const [hedgeStatus, setHedgeStatus] = useState();
  const sortBtns = document.querySelectorAll('.bi-o-sortButton');

  //guardar token peticiones
  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token;


  //calcular paginacion
  const calcTotalPages = (totalResults,totalRows) => setTotalPages(Math.ceil(totalResults/totalRows));

  //getData
  const getData = async (endpoint, search, pagenumber, rowspage, orderby, status) => {
    const headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    }
    const { data } = await Api.call.post(endpoint, {'search':search, 'pagenumber':pagenumber, 'rowspage':rowspage, 'orderby':orderby, 'status':status},{ headers:headers })
    return data;
  }

  //listar 10 usuarios
  const getHedges = async (busqueda, orden, status) => {
    const results = await getData('hedges/getAll',busqueda,page,rowspage,orden,status)
    .then(res => {
      console.log(res.data);
      setTotalrowscount(res.rowscount[0].count);
      calcTotalPages(res.rowscount[0].count, rowspage);
      setHedges(res.data);
    })
    .catch(err => console.log('error'));
  }

  //guardar todas las coberturas para descargar
  const getAllHedges = async () => {
    const results = await getData('hedges/getAll',searchValue,page,totalrowscount, order)
    .then(res => {
      setAllHedges(res.data)})
    .catch(err => console.warn(err));
  }

  const execGetHedges = (search,order, status) => getHedges(search = search, order = order, status = status);
  const execGetAllHedges = () => getAllHedges();

  //resetear pagina a 1
  useEffect(()=>{
    setPage(1);
  },[setPage])
  

  //volver a pedir listar usuarios cuando cambia la página, el orden o el termino de busqueda
  useEffect(()=>{
    execGetHedges(searchValue,order, hedgeStatus);
  },[page, order, searchValue, hedgeStatus]);

  //pedir todos los usuarios cuando sabemos el número de filas totales
  useEffect(()=>{
    execGetAllHedges();
  },[totalrowscount])
  

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
            Relación de coberturas
          </MainHeading>
          <div className='bi-c-form-simple'>
            <LabelElement
              htmlFor='searchHedges'
              type='text'
              placeholder='Buscar'
              handleOnChange={(event)=>{
                setSearchValue(event.target.value)
              }} />
              <SelectElement
              htmlFor='list-hedge-status'
              value={hedgeStatus}
              handleOnChange={(event) =>{
                event.preventDefault()
                setHedgeStatus(event.target.value)
              }}
              >
              <option value='1'>En curso</option>
              <option value='3'>Desarmadas</option>
              <option value='2'>Rechazadas</option>
            </SelectElement>
            <CSVLink
              className='bi-c-navbar-links__textbutt'
              filename={"coberturas.csv"}
              data={allHedges}>Descargar CSV</CSVLink>
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
              <SortButton orderCol={4} handleClick={() => sortItems()}>Tipo cobertura</SortButton>
            </TableCellMedium>
            <TableCellMedium className='bi-u-centerText'>
              <SortButton orderCol={5} handleClick={() => sortItems()}>Tipo objeto cubierto</SortButton>
            </TableCellMedium>
            <TableCellMedium>
              <SortButton orderCol={6} handleClick={() => sortItems()}>Nocional derivado</SortButton>
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
            <TableCellShort className='bi-u-centerText'></TableCellShort>
          </TableDataHeader>
          {
            hedges?.map(hedge => {
              return (
                <TableDataRow key={uuidv4()}>
                  <TableDataRowWrapper>
                    <TableCellMedium
                      className='bi-u-text-base-black bi-u-centerText'>{hedge.id_hedge_relationship}</TableCellMedium>
                    <TableCellMedium className='bi-u-centerText'>{hedge.id_hedge_item}</TableCellMedium>
                    <TableCellMedium className='bi-u-centerText'>{hedge.id_hedge_instrument}</TableCellMedium>
                    <TableCellMedium className='bi-u-centerText'>{hedge.cat_hedge_file}</TableCellMedium>
                    <TableCellMedium className='bi-u-centerText'>{hedge.cat_hedge_item}</TableCellMedium>
                    <TableCellMedium>{hedge.num_instrument_notional}</TableCellMedium>
                    <TableCellMedium>{hedge.dt_start_date}</TableCellMedium>
                    <TableCellMedium>{hedge.dt_maturity_date}</TableCellMedium>
                    <TableCellMedium>{hedge.user_insert}</TableCellMedium>
                    <TableCellShort style={{'position':'relative'}}>
                      { hedge.disarmVisible ? 
                        <HedgesContextualActions
                          hedgeId={hedge.id_hedge_relationship}  
                        />
                        :
                        ''
                      }
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

export default HedgeAccounting;