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
      setHedgeItemsOnSelect();
    })
    .catch(err => console.warn(err));
  }

   //cargar 1 cobertura
   const getHedge = async (busqueda, orden) => {
    const results = await getData('hedges/getAll',busqueda,page,rowspage,orden)
    .then(res => {
      console.log(res.data);
      setSelectedHedge(res.data)
    })
    .catch(err => console.warn(err));
  }

  //pedir 1 usuario la primera vez para saber el número de filas totales
  useEffect(()=>{
    getTotaltowscount('',1);
  },[])

   //pedir todos los usuarios cuando sabemos el número de filas totales
   useEffect(()=>{
    getAllHedges();
  },[totalrowscount,searchValue])

  //pedir 1 usuario para saber el número de filas totales cuando rellenamos el select de cobertura
  useEffect(()=>{
    if (totalrowscount > 0) {
      getHedge(searchValue,1);
    }
  },[searchValue])

  //colocar todas las partidas de cubierta disponibles en el primer select cuando tengamos todas las coberturas cargadas
  useEffect(()=>{
    setHedgeItemsOnSelect();
  },[allHedges])

  //rellenar select con todas las partidasd de cubierta
  const setHedgeItemsOnSelect = () => {
    const itemSelect = document.getElementById('hedgeItemsSelect');
   allHedges.map(hedge => {
    const option = document.createElement('option');
    option.setAttribute('value',hedge.id_hedge_item);
    option.textContent = hedge.id_hedge_item;
    itemSelect.appendChild(option);
   })
  }
  
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
          <TableDataRow>
            <TableDataRowWrapper>
              <TableCellMedium>              
                <SelectElement
                    htmlFor='hedgeItemsSelect'
                    handleOnChange={(event) =>{
                      console.log(event.target.value);
                      setSearchValue(event.target.value);
                    }}
                    >
                    <option value=''>Selecciona</option>
                  </SelectElement>
              </TableCellMedium>
              <TableCellMedium>
                {
                  selectedHedge? selectedHedge[0].dt_maturity_date : '---'
                }
                </TableCellMedium>
              <TableCellMedium>
                {
                  selectedHedge? selectedHedge[0].num_underlying_amount : '---'
                }
              </TableCellMedium>
            </TableDataRowWrapper>            
          </TableDataRow>
        </TableData>
        
        
        {/* NUEVO DERIVADO */}
        <TableData>
          <TableHeader>
            <SubHeading  className='bi-u-border-bb-gm'>
              Instrumentos de cobertura
            </SubHeading>
          </TableHeader>
          <TableDataHeader>
            <TableCellMedium>Instrumento</TableCellMedium>
            <TableCellMedium>Fecha vencimiento</TableCellMedium>
            <TableCellMedium>Nocional</TableCellMedium>
          </TableDataHeader>
          <TableDataRow>
            <TableDataRowWrapper>
              <TableCellMedium>              
                1482938
              </TableCellMedium>
              <TableCellMedium>
                17/04/2024
                </TableCellMedium>
              <TableCellMedium>
                11.68
              </TableCellMedium>
            </TableDataRowWrapper>            
          </TableDataRow>
          <TableDataRow>
            <TableDataRowWrapper>
              <TableCellMedium>              
              8384737
              </TableCellMedium>
              <TableCellMedium>
                17/04/2024
                </TableCellMedium>
              <TableCellMedium>
                14.00
              </TableCellMedium>
            </TableDataRowWrapper>            
          </TableDataRow>
          <TableDataRow>
            <TableDataRowWrapper>
              <TableCellMedium>              
              7383838
              </TableCellMedium>
              <TableCellMedium>
                17/04/2024
                </TableCellMedium>
              <TableCellMedium>
                9.80
              </TableCellMedium>
            </TableDataRowWrapper>            
          </TableDataRow>
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