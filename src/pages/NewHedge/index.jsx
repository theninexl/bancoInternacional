import { useRef, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useGetData } from "../../hooks/useGetData";
import { usePostData } from "../../hooks/usePostData";
import { useSaveData } from "../../hooks/useSaveData";
import { DateTime } from "luxon";
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { LabelElement, SelectElement, SimpleFormHrz, SimpleFormRow } from "../../components/UI/forms/SimpleForms";
import { ButtonLGhost, ButtonLPrimary } from "../../components/UI/buttons/Buttons";
import { MainHeading } from "../../components/UI/headings";
import { TableData, TableDataHeader, TableCellMedium, TableDataRow, TableDataRowWrapper } from "../../components/UI/tables/TableDataElements";



const NewHedge = ({ hedges, setHedges, allHedges, setAllHedges, page, totalrowscount, setTotalrowscount }) => {
  const account = localStorage.getItem('account');
  const parsedAccount = JSON.parse(account);
  const navigate = useNavigate();
  const form = useRef(null);
  const [formError, setFormError] = useState(null);
  //estados campos de creacion
  const [idHedgeItemSelected, setIdHedgeItemSelected] = useState('');
  const [idHedgeSearchResults, setIdHedgeSearchResults] = useState(null);
  const [showIdHedgeResultsModal, setShowIdHedgeResultsModal] = useState(false);

  const [idHedgeInstrumentSelected, setIdHedgeInstrumentSelected] = useState('');
  const [idHedgeInstrument, setIdHedgeInstrument] = useState(null);
  const [showIdHedgeInstrumentResultsModal, setShowIdHedgeInstrumentResultsModal] = useState(false);

  const [catHedgeFile, setCatHedgeFile] = useState();
  const [loadedCatHedgeItems, setLoadedCatHedgeItems] = useState('');
  const [selectedCatHedgeItem, setSelectedCatHedgeItem] = useState('');
  const [loadedCatHedgeInstruments, setLoadedCatHedgeInstruments] = useState('');
  const [maturityDateItem, setMaturityDateItem] = useState('');
  const [numNotionalItem, setNumNotionalItem] = useState(); 
  const [itemRate, setItemRate] = useState();
  const [itemPCTRate, setItemPCTRate] = useState(); 
  const [maturityDateInstrument, setMaturityDateInstrument] = useState('');
  const [numNotionalInstrument, setNumNotionalInstrument] = useState();
  const [instrumentRate, setInstrumentRate] = useState();
  const [instrumentPCTRate, setInstrumentPCTRate] = useState(); 
  const [createHedgeItems, setCreateHedgeItems] = useState([]);

  //get CreateGet (get tipos de coberturas)
  const getCreateHedge = useGetData('hedges/createGetCombos');
  useEffect (() => {    
    if (getCreateHedge.responseGetData) { 
      setCreateHedgeItems(getCreateHedge.responseGetData.data.hedge_files);  
    }
  },[getCreateHedge.responseGetData])


  //search Hedge Item (ParticaCubierta)
  const searchHedgeResults= usePostData();
  const getHedges = (search) => {
    searchHedgeResults.postData('hedges/createPredictiveItem',{"search":search});
  }

  useEffect(()=> {
    if (searchHedgeResults.responsePostData) {
      setIdHedgeSearchResults(searchHedgeResults.responsePostData.data.items);
      setShowIdHedgeResultsModal(true);
    }

  },[searchHedgeResults.responsePostData])



  //getItemDetails
  const getItem = usePostData();
  const getItemDetails = (id) => {
    if(id){
      getItem.postData('hedges/createGetItem',{'id_hedge_item':id});
    }
  }
  //get Info extra Partida cubierta
  useEffect(()=>{
    if(getItem.responsePostData) {
      setMaturityDateItem(getItem.responsePostData.data.dt_maturity_date);
      setNumNotionalItem(getItem.responsePostData.data.num_notional); 
      setItemRate(getItem.responsePostData.data.item_rate);
      setItemPCTRate(getItem.responsePostData.data.pct_item_rate); 
    }
  },[getItem.responsePostData])


  //search Hedge Instrument (Derivado)
  const searchHedgeInstrumentsResults= usePostData();
  const getHedgeInstruments = (search) => {
    searchHedgeInstrumentsResults.postData('hedges/createPredictiveInstrument',{"search":search});
  }

  useEffect(()=>{
    if (searchHedgeInstrumentsResults.responsePostData) {
      setIdHedgeInstrument(searchHedgeInstrumentsResults.responsePostData.data.instruments);
      setShowIdHedgeInstrumentResultsModal(true);
    }

  },[searchHedgeInstrumentsResults.responsePostData])
 

  //getInstrumentDetails
  const getInstrument = usePostData();
  const getInstrumentDetails = (id) => {
    if(id){
      getInstrument.postData('hedges/createGetInstrument',{'id_hedge_item':id});
    }
  }
  //get Info extra Derivado
  useEffect(()=>{
    if(getInstrument.responsePostData) {
      setMaturityDateInstrument(getInstrument.responsePostData.data.dt_maturity_date);
      setNumNotionalInstrument(getInstrument.responsePostData.data.num_notional);
      setInstrumentRate(getInstrument.responsePostData.data.instrument_rate); 
      setInstrumentPCTRate(getInstrument.responsePostData.data.pct_instrument_rate); 
    }
  },[getInstrument.responsePostData])


  //SELECTS ULTIMA LINEA

  //mirar cuando hay elementos en createHedgeItems para llamar a la función que rellena el select de tipo de cobertura
  useEffect(()=>{
    if (createHedgeItems.length > 0) {
      setHedgeFilesOnSelect();
    }
  },[createHedgeItems])

  
  //mirar cuando cambia el hedgeFile para llamar a la funcion que obtiene la info tipo de objeto cubierto
  useEffect(()=>{
    if (catHedgeFile) {
      getHedgeItemDetails(catHedgeFile);
    }
  },[catHedgeFile])


  //get info select tipo objeto cubierto
  const getHedgeItem = usePostData();
  const getHedgeItemDetails = (hedgeFile) => {
    if(hedgeFile){
      getHedgeItem.postData('hedges/createGetHedgeItem',{'cat_hedge_file':hedgeFile});
    }
  }
  useEffect(()=>{
    if(getHedgeItem.responsePostData) {
      setLoadedCatHedgeItems(getHedgeItem.responsePostData.data.items);
    }
  },[getHedgeItem.responsePostData])

  //mirar cuando cambia el loadedCatHedgeItems para llamar a la funcion que rellena el select de tipo de objeto cubierto
  useEffect(()=>{
    if (loadedCatHedgeItems) {
      setCatHedgeItemsOnSelect();
    }
  },[loadedCatHedgeItems])

  //mirar cuando cambia selectedCatHedgeItem para llamar a la función que obtiene la info de tipo de derivado
  /*useEffect(()=> {
    if (selectedCatHedgeItem) {
      getCatHedgeItemDetails(catHedgeFile, selectedCatHedgeItem)
    }
  },[selectedCatHedgeItem])*/

  //get info select tipo de derivado
  /*const getCatHedgeItem = usePostData();
  const getCatHedgeItemDetails = (hedgeFile, hedgeIem) => {
    if(hedgeFile){
      getCatHedgeItem.postData('hedges/createGetHedgeInstrument',{'cat_hedge_file':hedgeFile, 'cat_hedge_item': hedgeIem});
    }
  }
  useEffect(()=>{
    if(getCatHedgeItem.responsePostData) {
      console.log(getCatHedgeItem.responsePostDat);
      //setLoadedCatHedgeInstruments(getCatHedgeItem.responsePostData.data.items);
    }
  },[getCatHedgeItem.responsePostData])*/

  //llamar a rellenar el select de tipo de derivado cuando seleccionas un tipo de objeto cubierto
  /*useEffect(()=>{
    if (loadedCatHedgeInstruments) {
      setCatHedgeInstrumentsOnSelect();
    }
  },[loadedCatHedgeInstruments])*/

  
  // rellenar select tipo de cobertura
  const setHedgeFilesOnSelect = () => {
    const itemSelect = document.getElementById('cat_hedge_file');
    itemSelect.innerHTML = '';
    const firstOption = document.createElement('option');
    firstOption.setAttribute('value','-1');
    firstOption.textContent = 'Seleccionar';
    itemSelect.appendChild(firstOption);
    

    createHedgeItems.map(hedge => {
      const option = document.createElement('option');
      option.setAttribute('value',hedge.cat_hedge_file);
      option.textContent = hedge.cat_hedge_file;
      itemSelect.appendChild(option);
    })
  }



  //rellenar select tipo objeto cubierto
  const setCatHedgeItemsOnSelect = () => {
    //borro todas las opciones del select de objeto cubierto y añado solo la de seleccionar
    const hedgeItemSelect = document.getElementById('cat_hedge_item');
    if (hedgeItemSelect) {
      hedgeItemSelect.innerHTML = '';
      const firstItemOption = document.createElement('option');
      firstItemOption.setAttribute('value','-1');
      firstItemOption.textContent = 'Seleccionar';
      hedgeItemSelect.appendChild(firstItemOption);
    }
    
    //borro todas las opciones del select de tipo de derivado y añado solo seleccionar
    const hedgeInstrumentSelect = document.getElementById('cat_hedge_instrument');
    if (hedgeInstrumentSelect) {
      hedgeInstrumentSelect.innerHTML = '';
      const firstIntrumentOption = document.createElement('option');
      firstIntrumentOption.setAttribute('value','-1');
      firstIntrumentOption.textContent = 'Seleccionar';
      hedgeInstrumentSelect.appendChild(firstIntrumentOption);
    }

    loadedCatHedgeItems.map(hedgeItem => {
      const option = document.createElement('option');
      option.setAttribute('value',hedgeItem.strategy);
      option.textContent = hedgeItem.strategy;
      hedgeItemSelect.appendChild(option);
    })
  }
  
  //rellenar select tipo derivado
  /*const setCatHedgeInstrumentsOnSelect = () => {
    const itemSelect = document.getElementById('cat_hedge_instrument');
    if (itemSelect) {
      itemSelect.innerHTML = '';
      const firstOption = document.createElement('option');
      firstOption.setAttribute('value','-1');
      firstOption.textContent = 'Seleccionar';
      itemSelect.appendChild(firstOption);
    }

    loadedCatHedgeInstruments.map(hedgeInstrument => {
      const option = document.createElement('option');
      option.setAttribute('value',hedgeInstrument.cat_hedge_instrument);
      option.textContent = hedgeInstrument.cat_hedge_instrument;
      itemSelect.appendChild(option);
    })
  }*/

  //Render results Hedge (Partida cubierta)
  const renderIdHedgeSearchResults = () => {
    if (showIdHedgeResultsModal && idHedgeSearchResults.length == 0) {
      return (
        <div className='bi-c-dropdown-select__results-box' >
          <span>No hay resultados</span>
        </div>
        );
    } else if (showIdHedgeResultsModal && idHedgeSearchResults.length > 0) {      
        return (
        <div className='bi-c-dropdown-select__results-box' >
          { idHedgeSearchResults?.map(result => {
          return (
            <span
              className='result'
              key={result.id_hedge_item}
              onClick={(e) => {
                e.preventDefault();
                getItemDetails(result.id_hedge_item);
                setShowIdHedgeResultsModal(false);
                setIdHedgeItemSelected(result.id_hedge_item);
              }}>{result.id_hedge_item}</span>
          );
        })}
        </div>
      );
    }
  }

  //Render results Hedge Instruments (Derivados)
  const renderIdHedgeInstrumentSearchResults = () => {
    if (showIdHedgeInstrumentResultsModal && idHedgeInstrument.length == 0) {
      return (
        <div className='bi-c-dropdown-select__results-box' >
          <span>No hay resultados</span>
        </div>
        );
    } else if (showIdHedgeInstrumentResultsModal && idHedgeInstrument.length > 0) {      
        return (
        <div className='bi-c-dropdown-select__results-box' >
          { idHedgeInstrument?.map(result => {
          return (
            <span
              className='result'
              key={result.id_hedge_instrument}
              onClick={(e) => {
                e.preventDefault();
                getInstrumentDetails(result.id_hedge_instrument);
                setShowIdHedgeInstrumentResultsModal(false);
                setIdHedgeInstrumentSelected(result.id_hedge_instrument);
              }}>{result.id_hedge_instrument}</span>
          );
        })}
        </div>
      );
    }
  }

  //GUARDAR DATOS

  const createNewHedge = useSaveData();

  const handleSave = (event) => {
    event.preventDefault();

    const formData = new FormData(form.current);

    const dateFrom = formData.get('date_from');
    const dateFromTocado = DateTime.fromISO(dateFrom).toFormat("dd/MM/yyyy");

    const formItems = {
      id_hedge_item: formData.get('id_hedge_item'),
      //dt_maturity_date_item: formData.get('dt_maturity_date_item'),
      //num_item_notional: formData.get('num_item_notional'),
      //item_rate: formData.get('item_rate'),
      //pct_item_rate: formData.get('pct_item_rate'),
      cat_hedge_item_type: formData.get('cat_hedge_item_type'),
      id_hedge_instrument: formData.get('id_hedge_instrument'),      
      //dt_maturity_date_instrument: formData.get('dt_maturity_date_instrument'),      
      //num_instrument_notional: formData.get('num_instrument_notional'),
      //instrument_rate: formData.get('instrument_rate'),
      //pct_instrument_rate: formData.get('pct_instrument_rate'),
      //pct_item_rate: formData.get('pct_item_rate'),
      cat_hedge_file: formData.get('cat_hedge_file'),
      cat_hedge_item: formData.get('cat_hedge_item'),
      //cat_hedge_instrument: formData.get('cat_hedge_instrument'),
      pct_item: formData.get('pct_item'),
      pct_instrument: formData.get('pct_instrument'),
      date_from: dateFromTocado
    }
    const dataSent = {};

    if (formItems) {
      for (const [key, value] of Object.entries(formItems)) {        
        if (value == '-1' || value == '') {
          // console.log(`${key}: ${value}`);
          // console.log('no pasa');
          setFormError('Seleccione una opción válida para TODOS los campos');
          break;
        } else {
          dataSent[key] = value;
        } 
      }

      if (Object.keys(formItems).length === Object.keys(dataSent).length) {
        console.log(dataSent);
        createNewHedge.uploadData('hedges/create', dataSent)
      }
    }
  }

  //mirar la respuesta de subir datos para setear error
  useEffect(()=> {
    if (createNewHedge.responseUpload) {
      if (createNewHedge.responseUpload.code === 'ERR_NETWORK') { setFormError('Error de conexión, inténtelo más tarde')
      } else if (createNewHedge.responseUpload.status === 'ok') { navigate('/hedges');
      } else {
        setFormError('Existe un error en el formulario, inténtelo de nuevo')
      }
    }
  },[createNewHedge.responseUpload])

  const HandleCancel = () => {
    navigate('/hedges');
  }

  //renderizar allowed
  const renderAllowed = () => {
    if (parsedAccount.permission == 4) {
      return <Navigate to="/hedges" replace={true}/>
    } else if (parsedAccount.permission == 3) {
      return <Navigate to="/users" replace={true}/>
    }
  }
  

  return (
    <main className="bi-u-h-screen--wSubNav">
      {renderAllowed()}
      <TableHeader className='bi-u-border-bb-gm'>
        <MainHeading>
          Crear cobertura
        </MainHeading>
      </TableHeader>      
      <SimpleFormHrz  innerRef={form}>
        <TableData>
          <TableDataHeader>
            <TableCellMedium>Partida cubierta</TableCellMedium>
            <TableCellMedium>Fecha vencimiento</TableCellMedium>
            <TableCellMedium>Nocional</TableCellMedium>
            <TableCellMedium>Tasa de interés</TableCellMedium>
            {/*<TableCellMedium>% de tasa de obj. cubierto</TableCellMedium>*/}
            <TableCellMedium>% utilizado</TableCellMedium>
          </TableDataHeader>      
          <TableDataRow>
            <TableDataRowWrapper>
              <TableCellMedium>
                <div
                  className='bi-c-dropdown-select'>
                  <LabelElement 
                  htmlFor='id_hedge_item'
                  type='text'
                  value={idHedgeItemSelected}
                  handleOnChange={(e) => {
                    setIdHedgeItemSelected(e.target.value);
                    if (e.target.value.length >= 3) {
                      getHedges(e.target.value);                      
                    } else {
                      setIdHedgeSearchResults(null);
                      setShowIdHedgeResultsModal(false);
                      setMaturityDateItem('');
                      setNumNotionalItem('');                       
                    }                    
                  }}  />
                  {renderIdHedgeSearchResults()}
                </div>
               
              </TableCellMedium>
              <TableCellMedium>
                <LabelElement
                  htmlFor='dt_maturity_date_item'
                  type='text'
                  placeholder=''
                  value={maturityDateItem}
                  readOnly={true}
                  >
                </LabelElement>
              </TableCellMedium>
              <TableCellMedium>
                <LabelElement
                  htmlFor='num_item_notional'
                  type='text'
                  value={numNotionalItem}
                  placeholder=''
                  readOnly={true}
                  >
                </LabelElement>
              </TableCellMedium>
              <TableCellMedium>
                <LabelElement
                  htmlFor='item_rate'
                  type='number'
                  placeholder=''
                  value={itemRate}
                  readOnly={true}
                  >
                </LabelElement>
              </TableCellMedium>
              {/*<TableCellMedium>
                <LabelElement
                  htmlFor='pct_item_rate'
                  type='number'
                  placeholder=''
                  value={itemPCTRate}
                  readOnly={true}
                  >
                </LabelElement>
                </TableCellMedium>*/}
              <TableCellMedium>
                <LabelElement
                  htmlFor='pct_item'
                  type='number'
                  placeholder='Introducir %'
                  >
                </LabelElement>
              </TableCellMedium>
            </TableDataRowWrapper>
          </TableDataRow>    
          
        </TableData>        
        
        {/* NUEVO INSTRUMENTO */}
        <TableData>
          <TableDataHeader>
            <TableCellMedium>Derivado</TableCellMedium>
            <TableCellMedium>Fecha vencimiento</TableCellMedium>
            <TableCellMedium>Nocional</TableCellMedium>
            <TableCellMedium>Tasa de interés</TableCellMedium>
            {/*<TableCellMedium>% de tasa derivado</TableCellMedium>*/}
            <TableCellMedium>% Utilizado</TableCellMedium>
          </TableDataHeader>
          <TableDataRow>
            <TableDataRowWrapper>
              <TableCellMedium>
                <div
                  className='bi-c-dropdown-select'>
                  <LabelElement 
                  htmlFor='id_hedge_instrument'
                  type='text'
                  value={idHedgeInstrumentSelected}
                  handleOnChange={(e) => {
                    setIdHedgeInstrumentSelected(e.target.value);
                    if (e.target.value.length >= 3) {                 
                      getHedgeInstruments(e.target.value);                      
                    } else {
                      setIdHedgeInstrument(null);
                      setShowIdHedgeInstrumentResultsModal(false);
                      setMaturityDateInstrument('');
                      setNumNotionalInstrument(''); 
                    }                    
                  }}  />
                  { renderIdHedgeInstrumentSearchResults()}
                </div>
              </TableCellMedium>
              <TableCellMedium>
                <LabelElement
                  htmlFor='dt_maturity_date_instrument'
                  type='text'
                  placeholder=''
                  value={maturityDateInstrument}
                  readOnly={true}
                  >
                </LabelElement>
              </TableCellMedium>
              <TableCellMedium>
                <LabelElement
                  htmlFor='num_instrument_notional'
                  type='text'
                  value={numNotionalInstrument}
                  placeholder=''
                  readOnly={true}
                  >
                </LabelElement>
              </TableCellMedium>
              <TableCellMedium>
                <LabelElement
                  htmlFor='instrument_rate'
                  type='number'
                  placeholder=''
                  value={instrumentRate}
                  readOnly={true}
                  >
                </LabelElement>
              </TableCellMedium>
              {/*<TableCellMedium>
                <LabelElement
                  htmlFor='pct_instrument_rate'
                  type='number'
                  placeholder=''
                  value={instrumentPCTRate}
                  readOnly={true}
                  >
                </LabelElement>
                </TableCellMedium>*/}
              <TableCellMedium>
                <LabelElement
                  htmlFor='pct_instrument'
                  type='number'
                  placeholder='Introducir %'
                  >
                </LabelElement>
              </TableCellMedium>
            </TableDataRowWrapper>
          </TableDataRow>
        </TableData>


        {/* LINEA COBERTURA */}
        <TableData>
          <TableDataHeader>
            <TableCellMedium>Tipo cobertura</TableCellMedium>
            <TableCellMedium>Tipo estrategia</TableCellMedium>
            <TableCellMedium>Fecha inicio</TableCellMedium>
            <TableCellMedium>Activo/Pasivo</TableCellMedium>
            <TableCellMedium></TableCellMedium>
          </TableDataHeader>
          {
            createHedgeItems && 
            <>
              <TableDataRow>
                <TableDataRowWrapper>
                  <TableCellMedium>
                  <SelectElement
                        htmlFor='cat_hedge_file'
                        value={catHedgeFile}
                        handleOnChange={(event) =>{
                          event.preventDefault();
                          setFormError(null);
                          setCatHedgeFile(event.target.value);
                        }}
                        >
                        <option value='-1'>Seleccionar</option>
                      </SelectElement>
                  </TableCellMedium>
                  <TableCellMedium>
                  <SelectElement
                        htmlFor='cat_hedge_item'
                        value={selectedCatHedgeItem}
                        handleOnChange={(event) =>{
                         event.preventDefault();
                         setFormError(null);
                         setSelectedCatHedgeItem(event.target.value);
                        }}
                        >
                        <option value='-1'>Seleccionar</option>
                      </SelectElement>
                  </TableCellMedium>
                  {/*<TableCellMedium>
                  <SelectElement
                        htmlFor='cat_hedge_instrument'
                        //value={idHedgeItem}
                        //handleOnChange={(event) =>{
                        //  event.preventDefault();
                        //  setIdHedgeItem(event.target.value);
                        //}}
                        >
                        <option value='-1'>Seleccionar</option>
                      </SelectElement>
                      </TableCellMedium>*/}
                  <TableCellMedium>

                    <LabelElement
                      htmlFor='date_from'
                      type='date'
                      placeholder='Introduce fecha'
                      >
                    </LabelElement>


                  </TableCellMedium>
                  <TableCellMedium>
                    <SelectElement
                      htmlFor='cat_hedge_item_type'>
                      <option value='0'>Activo</option>
                      <option value='1'>Pasivo</option>
                    </SelectElement>
                  </TableCellMedium>
                  <TableCellMedium></TableCellMedium>
                </TableDataRowWrapper>            
              </TableDataRow>
            </>
          }
        </TableData>        
        <SimpleFormRow
          style={{'flexGrow':1}}   
          className='bi-u-centerText bi-u-border-bb-gm bi-u-border-bt-gm' >
            
            <ButtonLGhost
              className='bi-o-button--short'
              handleClick={HandleCancel}
              >
                Cancelar
            </ButtonLGhost>
            <ButtonLPrimary
              className='bi-o-button--short'
              type='submit'
              handleClick={handleSave}
              >
                Guardar
            </ButtonLPrimary>
        </SimpleFormRow>
        {formError && 
          <SimpleFormRow className='bi-u-centerText'>
            <span className='error'>{formError}</span>
          </SimpleFormRow>
        }     
      
      </SimpleFormHrz>
    </main>
  );
}

export default NewHedge;