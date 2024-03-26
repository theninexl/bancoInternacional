import { useEffect,useState } from 'react';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
// import { GlobalContext } from '../../context';
import Api from '../../services/api';
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { TableData, TableDataHeader, TableDataRow, TableCellMedium, TableCellShort, TableDataRowWrapper } from '../../components/UI/tables/TableDataElements';
import TablePagination from '../../components/TablePagination';
import { ButtonLGhost, ButtonLPrimary, ButtonLSecondary, ButtonLTransparent, SortButton } from '../../components/UI/buttons/Buttons';
import { MainHeading } from '../../components/UI/headings';
import { LabelElement } from '../../components/UI/forms/SimpleForms';
import ModalBig from "../../components/ModalBig";
import ModalSmall from '../../components/ModalSmall';
import { ColsContainer, SectionThird, SimpleCol } from '../../components/UI/layout/LayoutSections';
import { DocumentArrowDownIcon } from '@heroicons/react/24/solid';



function PendingValidations({ totalPages,setTotalPages,hedges,setHedges,page,setPage }){
  const navigate = useNavigate();
  const rowspage = 10;

  const SERVER = import.meta.env.VITE_DB_SERVER;


  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState(1);
  //mostrar modal disarm
  const [hedgeRelationshipData, setHedgeRelationshipData] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  //fallo al validar creacion cobertura
  const [modalValidateFail, setModalValidateFail] = useState(false);
  
  const sortBtns = document.querySelectorAll('.bi-o-sortButton');

  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token;
  const headers = {
    'Content-Type': 'application/json',
    'x-access-token': token,
  }

  //calcular paginacion
  const calcTotalPages = (totalResults,totalRows) => setTotalPages(Math.ceil(totalResults/totalRows));

  //listar usuarios
  const getHedges = (busqueda, orden) => {
    const data = {
      'search':busqueda,
      'pagenumber':page,
      'rowspage':rowspage,
      'orderby':orden
    }
    // Api.call.post('hedges/disarmStatusGetAll',data,{ headers:headers })
    Api.call.post('hedges/validationGetAll',data,{ headers:headers })
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

  //cargar datos de validación de cobertura y lanzar modal
  const validateStatus = (id) => {
    const data = {
      'id_hedge_relationship':id.toString(),
    }
    console.log(data);
    Api.call.post('hedges/validationCreateGet',data,{ headers:headers })
    .then(res => {
      setHedgeRelationshipData(res.data);
      setModalOpen(true);
    }).catch(err => console.warn(err))
  }

  //ejecutar validación cobertura
  const validateExecute = (id,validation) => {
    const data = {
      'id_hedge_relationship':id.toString(),
      'validate':validation,
    }
    Api.call.post('hedges/validationCreateExecute',data,{ headers:headers })
    .then(res => {
      if (res.data.status == 'ok') {
        setModalOpen(false);
        execGetHedges(searchValue,order);
      } else {
        setModalOpen(false);
        setModalValidateFail(true);
      }
    }).catch(err => console.warn(err))
  }

  //contenido modal validacion creacion de cobertura
  const renderView = () => {
    if (modalOpen) {
        let hedgeItemType = '';
        if (hedgeRelationshipData.cat_hedge_item_type == 0 || hedgeRelationshipData.cat_hedge_item_type == "Activo") {
          hedgeItemType = 'Activo'
        } else { hedgeItemType = 'Pasivo'}
        
      return (
        <ModalBig
          title={`Validación creación de cobertura`} 
          body={
            <>
              <TableData className='bi-u-spacer-mt-large'>
                <TableDataHeader>
                  <TableCellMedium>Fecha creación</TableCellMedium>
                  <TableCellMedium>Fecha inicio</TableCellMedium>
                  <TableCellMedium>Fecha vencimiento</TableCellMedium>
                  <TableCellMedium>Activo/Pasivo</TableCellMedium>
                </TableDataHeader>    
                <TableDataRow>
                  <TableDataRowWrapper> 
                    <TableCellMedium>{`${hedgeRelationshipData.dt_date_last_update}`}</TableCellMedium>
                    <TableCellMedium>{`${hedgeRelationshipData.dt_start_date}`}</TableCellMedium>
                    <TableCellMedium>{`${hedgeRelationshipData.dt_maturity_date}`}</TableCellMedium>
                    <TableCellMedium>{`${hedgeItemType}`}</TableCellMedium>
                  </TableDataRowWrapper>
                </TableDataRow>
                <TableDataHeader>
                  <TableCellMedium>Derivado</TableCellMedium>
                  <TableCellMedium>Nocional objeto</TableCellMedium>
                  <TableCellMedium>Nocional derivado</TableCellMedium>
                  <TableCellMedium>% Utilizado</TableCellMedium>
                </TableDataHeader>
                <TableDataRow>
                  <TableDataRowWrapper> 
                    <TableCellMedium>{`${hedgeRelationshipData.id_hedge_instrument}`}</TableCellMedium>
                    <TableCellMedium>{`${hedgeRelationshipData.num_item_notional}`}</TableCellMedium>
                    <TableCellMedium>{`${hedgeRelationshipData.num_instrument_notional}`}</TableCellMedium>
                    <TableCellMedium>{`${hedgeRelationshipData.pct_instrument}`}</TableCellMedium>
                  </TableDataRowWrapper>
                </TableDataRow>
                <TableDataHeader>
                  <TableCellMedium>Tipo cobertura</TableCellMedium>
                  <TableCellMedium>Tipo objeto cubierto</TableCellMedium>
                  <TableCellMedium>Tipo derivado</TableCellMedium>
                </TableDataHeader>
                <TableDataRow>
                  <TableDataRowWrapper> 
                    <TableCellMedium>{`${hedgeRelationshipData.cat_hedge_file}`}</TableCellMedium>
                    <TableCellMedium>{`${hedgeRelationshipData.cat_hedge_item}`}</TableCellMedium>
                    <TableCellMedium>{`${hedgeRelationshipData.cat_hedge_instrument}`}</TableCellMedium>
                  </TableDataRowWrapper>
                </TableDataRow>                 
              </TableData>
            </>
          }
          buttons={
            <>
            <ColsContainer>
              <SimpleCol
                style={{border:'0', padding:'0', display:'flex', gap:'24px'}} >
                <ButtonLPrimary
                  className='bi-o-button--short'
                  handleClick={() => validateExecute(hedgeRelationshipData.id_hedge_relationship,1)}
                  >
                    Aceptar
                </ButtonLPrimary>
                <ButtonLSecondary
                  className='bi-o-button--short'
                  handleClick={() => validateExecute(hedgeRelationshipData.id_hedge_relationship,2)}
                >
                  Rechazar
                </ButtonLSecondary>
              </SimpleCol>
              <SectionThird
                style={{padding:'0', display:'flex', justifyContent:'end'}} >
                <ButtonLGhost
                  className='bi-o-button--large'
                  handleClick={() => setModalOpen(false)}>
                    Cancelar
                </ButtonLGhost>
              </SectionThird>
            </ColsContainer>
            
              
              
              
            </>
          }
        />
      );
    }
  }

  //modal fallo validacion de creacion de cobertura

  const renderFailModal = () => {
    if (modalValidateFail) {
      return (
        <ModalSmall
          message='Se ha producido un error al intentar validar la cobertura. Inténtelo de nuevo.'
          buttons={
            <>
              <ButtonLPrimary
                className='bi-o-button--short'
                handleClick={() =>{
                  setModalValidateFail(false);
                }}
                >
                  Aceptar
              </ButtonLPrimary>
            </>
          }
        />
      )
    }
  }

  return (    
    <main className="bi-u-h-screen--wSubNav">
      {renderFailModal()}
      {renderView()}
       <TableHeader>
          <MainHeading>
            Validaciones pendientes
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
            <TableCellShort className='bi-u-centerText'>
              <SortButton orderCol={1} handleClick={() => sortItems()}>Ref.</SortButton>
            </TableCellShort>
            <TableCellMedium className='bi-u-centerText'>
              <SortButton orderCol={2} handleClick={() => sortItems()}>Validación</SortButton>
            </TableCellMedium>
            <TableCellMedium className='bi-u-centerText'>
              <SortButton orderCol={3} handleClick={() => sortItems()}>Partida cubierta</SortButton>
            </TableCellMedium>
            <TableCellMedium className='bi-u-centerText'>
              <SortButton orderCol={4} handleClick={() => sortItems()}>Derivado</SortButton>
            </TableCellMedium>
            <TableCellMedium className='bi-u-centerText'>
              <SortButton orderCol={5} handleClick={() => sortItems()}>Tipo cobertura</SortButton>
            </TableCellMedium>
            <TableCellMedium className='bi-u-centerText'>
              <SortButton orderCol={6} handleClick={() => sortItems()}>Tipo objeto cubierto</SortButton>
            </TableCellMedium>
            <TableCellMedium className='bi-u-textRight'>
              <SortButton orderCol={7} handleClick={() => sortItems()}>Nocional derivado</SortButton>
            </TableCellMedium>
            <TableCellMedium className='bi-u-centerText'>
              <SortButton orderCol={8} handleClick={() => sortItems()}>Fecha inicio</SortButton>
            </TableCellMedium>
            <TableCellMedium className='bi-u-centerText'>
              <SortButton orderCol={9} handleClick={() => sortItems()}>Fecha vencimiento</SortButton>
            </TableCellMedium>
            <TableCellMedium className='bi-u-centerText'>
              <SortButton orderCol={10} handleClick={() => sortItems()}>Usuario</SortButton>
            </TableCellMedium>
            <TableCellShort className='bi-u-centerText'></TableCellShort>
            <TableCellShort  className='bi-u-centerText'></TableCellShort>
          </TableDataHeader>
          {
            hedges?.map(hedge => {
              const renderType = () => {
                if (hedge.validation_type == 'DISARM') {
                  return (<><span>{"Desarme"}</span></>);
                } else if (hedge.validation_type == 'CREATE') {
                  return (<><span>{"Creación"}</span></>);
                } 
              }
              return (
                <TableDataRow key={uuidv4()}>
                  <TableDataRowWrapper>
                    <TableCellShort
                      className='bi-u-text-base-black bi-u-centerText'>{hedge.id_hedge_relationship}</TableCellShort>
                    <TableCellMedium className='bi-u-centerText'>{renderType()}</TableCellMedium>
                    <TableCellMedium className='bi-u-centerText'>{hedge.id_hedge_item}</TableCellMedium>
                    <TableCellMedium className='bi-u-centerText'>{hedge.id_hedge_instrument}</TableCellMedium>
                    <TableCellMedium className='bi-u-centerText'>{hedge.cat_hedge_file}</TableCellMedium>
                    <TableCellMedium className='bi-u-centerText'>{hedge.cat_hedge_item}</TableCellMedium>
                    <TableCellMedium className='bi-u-textRight'>{hedge.num_instrument_notional}</TableCellMedium>
                    <TableCellMedium className='bi-u-centerText'>{hedge.dt_start_date}</TableCellMedium>
                    <TableCellMedium className='bi-u-centerText'>{hedge.dt_maturity_date}</TableCellMedium>
                    <TableCellMedium className='bi-u-centerText'>{hedge.user_insert}</TableCellMedium>
                    <TableCellShort>
                      <Link
                        to={`${SERVER}/api/hedges/getSheet?id=${hedge.id_hedge_relationship}`}
                        download
                        className='bi-o-icon-button-small--primary'>
                          <DocumentArrowDownIcon />
                      </Link>
                    </TableCellShort>
                    <TableCellShort>
                      <ButtonLPrimary
                        handleClick={() => {
                          if (hedge.validation_type == 'CREATE') {
                            validateStatus(hedge.id_hedge_relationship);
                          } else {
                            navigate({      
                              pathname:'/hedges-status-det',
                                search: createSearchParams({
                                  id:hedge.id_hedge_relationship
                              }).toString()
                            });
                          }
                        }}
                        >
                      Validar
                    </ButtonLPrimary>
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

export default PendingValidations;