import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from 'papaparse';
import { ColsContainer, SectionHalf, SectionThird, SimpleCol } from '../../components/UI/layout/LayoutSections';
import { TableHeader, TableHeaderSub } from '../../components/UI/tables/TableHeaders';
import { LabelElement, SelectElement, SimpleFormHrz, SimpleFormRow,  ToggleElement,  UploadFileTo64 } from "../../components/UI/forms/SimpleForms";
import { ButtonLGhost, ButtonLPrimary } from "../../components/UI/buttons/Buttons";
import Api from '../../services/api';
import { MainHeading, SubHeading } from "../../components/UI/headings";
import { TableData, TableDataHeader, TableCellMedium, TableDataRow, TableDataRowWrapper } from "../../components/UI/tables/TableDataElements";


const NewHedge = ({ hedges, setHedges, allHedges, setAllHedges, page, totalrowscount, setTotalrowscount }) => {
  const navigate = useNavigate();
  const rowspage = 1;
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState(1);
  const [selectedHedge, setSelectedHedge] = useState();
  const [createHedgeItems, setCreateHedgeItems] = useState();
  

  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token; 


  //getData
  const getData = async (endpoint, search, pagenumber, rowspage, orderby) => {
    const headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    }
    const { data } = await Api.call.post(endpoint, {'search':search, 'pagenumber':pagenumber, 'rowspage':rowspage, 'orderby':orderby},{ headers:headers })
    return data;
  }

  //cargar totalRowscount
  const getTotaltowscount = async (busqueda, orden) => {
    const results = await getData('hedges/getAll',busqueda,page,rowspage,orden)
    .then(res => {
      setTotalrowscount(res.rowscount[0].count);
    })
    .catch(err => console.warn(err));
  }

  //cargar todas las coberturas
  const getAllHedges = async () => {
    const results = await getData('hedges/getAll',searchValue,page,totalrowscount, order)
    .then(res => {
      setAllHedges(res.data);
      // setHedgeItemsOnSelect();
    })
    .catch(err => console.warn(err));
  }

   //cargar 1 cobertura
   const getHedge = async (busqueda, orden) => {
    const results = await getData('hedges/getAll',busqueda,page,rowspage,orden)
    .then(res => {
      console.log(res);
      setSelectedHedge(res.data)
    })
    .catch(err => console.warn(err));
  }

  //get CreateGet
  const getCreateHedge = () => {
    const headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    }
    const data = {}
    Api.call.post('hedges/createGet',data,{ headers:headers })
    .then(res => {
      console.log(res.data)
      setCreateHedgeItems(res.data);
    }).catch(err => {
      //setFormError(err);
      console.warn(err)})
  }

  useEffect(()=>{      
    const execGetCreateHedge = async () => await getCreateHedge();
    execGetCreateHedge();
  },[]);


  //pedir 1 usuario la primera vez para saber el número de filas totales
  // useEffect(()=>{
  //   getTotaltowscount('',1);
  // },[])

   //pedir todos los usuarios cuando sabemos el número de filas totales
  //  useEffect(()=>{
  //   getAllHedges();
  // },[totalrowscount,searchValue])

  //pedir 1 usuario para saber el número de filas totales cuando rellenamos el select de cobertura
  // useEffect(()=>{
  //   if (totalrowscount > 0) {
  //     getHedge(searchValue,1);
  //   }
  // },[searchValue])

  //colocar todas las partidas de cubierta disponibles en el primer select cuando tengamos todas las coberturas cargadas
  // useEffect(()=>{
  //   setHedgeItemsOnSelect();
  // },[allHedges])

  //rellenar select con todas las partidasd de cubierta
  // const setHedgeItemsOnSelect = () => {
  //   const itemSelect = document.getElementById('hedgeItemsSelect');
  //  allHedges.map(hedge => {
  //   const option = document.createElement('option');
  //   option.setAttribute('value',hedge.id_hedge_item);
  //   option.textContent = hedge.id_hedge_item;
  //   itemSelect.appendChild(option);
  //  })
  // }
  
  const HandleCancel = () => {
    navigate('/hedges');
  }

  return (
    <main className="bi-u-h-screen--wSubNav">
      <TableHeader className='bi-u-border-bb-gm'>
        <MainHeading>
          Crear cobertura
        </MainHeading>
      </TableHeader>

      
      
      <SimpleFormHrz>
        <TableData>
          <TableDataHeader>
            <TableCellMedium>Partida cubierta</TableCellMedium>
            <TableCellMedium>Fecha vencimiento</TableCellMedium>
            <TableCellMedium>Nocional</TableCellMedium>
          </TableDataHeader>          
          {
            createHedgeItems && 
            <>
              <TableDataRow>
                <TableDataRowWrapper>
                  <TableCellMedium>
                  <SelectElement
                        htmlFor='hedge_item_id'
                        value={createHedgeItems.items[0].id_hedge_item}
                        handleOnChange={(event) =>{
                          console.log(event.target.value);
                          setSearchValue(event.target.value);
                        }}
                        >
                        <option value=''>Selecciona</option>
                        <option value={createHedgeItems.items[0].id_hedge_item}>{createHedgeItems.items[0].id_hedge_item}</option>
                      </SelectElement>              
                    
                  </TableCellMedium>
                  <TableCellMedium>
                  <LabelElement
                      htmlFor='hedge_item_date'
                      type='date'>
                    </LabelElement>
                    </TableCellMedium>
                  <TableCellMedium>
                    <LabelElement
                      htmlFor='hedge_item_notional'
                      type='text'
                      placeholder='introduce nocional'>
                    </LabelElement>
                  </TableCellMedium>
                </TableDataRowWrapper>            
              </TableDataRow>
            </>
          }
          
          


        </TableData>
        
        
        {/* NUEVO INSTRUMENTO */}
        <TableData>
          <TableDataHeader>
            <TableCellMedium>Instrumento</TableCellMedium>
            <TableCellMedium>Fecha vencimiento</TableCellMedium>
            <TableCellMedium>Nocional</TableCellMedium>
          </TableDataHeader>
          {
            createHedgeItems && 
            <>
              <TableDataRow>
                <TableDataRowWrapper>
                  <TableCellMedium>
                  <SelectElement
                        htmlFor='hedge_instrument_id'
                        value={createHedgeItems.instruments[0].id_hedge_instrument}
                        handleOnChange={(event) =>{
                          console.log(event.target.value);
                          setSearchValue(event.target.value);
                        }}
                        >
                        <option value=''>Selecciona</option>
                        <option value={createHedgeItems.instruments[0].id_hedge_instrument}>{createHedgeItems.instruments[0].id_hedge_instrument}</option>
                      </SelectElement>              
                    
                  </TableCellMedium>
                  <TableCellMedium>
                  <LabelElement
                      htmlFor='hedge_instrument_date'
                      type='date'>
                    </LabelElement>
                    </TableCellMedium>
                  <TableCellMedium>
                    <LabelElement
                      htmlFor='hedge_instrument_notional'
                      type='text'
                      placeholder='introduce nocional'>
                    </LabelElement>
                  </TableCellMedium>
                </TableDataRowWrapper>            
              </TableDataRow>
            </>
          }
        </TableData>
        

          <SimpleFormRow
            style={{'flexGrow':1}}   
            className='bi-u-centerText bi-u-border-bb-gm bi-u-border-bt-gm'>
              <ButtonLGhost
                className='bi-o-button--short'
                handleClick={HandleCancel}
                >
                  Cancelar
              </ButtonLGhost>
              <ButtonLPrimary
                className='bi-o-button--short'
                type='submit'
                handleClick={HandleCancel}
                >
                  Guardar
              </ButtonLPrimary>
          </SimpleFormRow>     
      
      </SimpleFormHrz>
    </main>
  );
}

export default NewHedge;