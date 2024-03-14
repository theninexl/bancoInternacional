import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from '../../services/api';
import { useGetData } from "../../hooks/useGetData";
import { usePostData } from "../../hooks/usePostData";
import { DateTime } from "luxon";
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { LabelElement, SelectElement, SimpleFormHrz, SimpleFormRow, LabelIconField } from "../../components/UI/forms/SimpleForms";
import Select from 'react-dropdown-select';
import { ButtonLGhost, ButtonLPrimary } from "../../components/UI/buttons/Buttons";
import { MainHeading } from "../../components/UI/headings";
import { TableData, TableDataHeader, TableCellMedium, TableDataRow, TableDataRowWrapper } from "../../components/UI/tables/TableDataElements";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';



const NewHedge = ({ hedges, setHedges, allHedges, setAllHedges, page, totalrowscount, setTotalrowscount }) => {
  const navigate = useNavigate();
  const form = useRef(null);
  const [formError, setFormError] = useState(null);
  //estados campos de creacion
  const [idHedgeItem, setIdHedgeItem] = useState('');
  const [idHedgeInstrument, setIdHedgeInstrument] = useState('');
  const [catHedgeFile, setCatHedgeFile] = useState();
  const [loadedCatHedgeItems, setLoadedCatHedgeItems] = useState('');
  const [selectedCatHedgeItem, setSelectedCatHedgeItem] = useState('');
  const [loadedCatHedgeInstruments, setLoadedCatHedgeInstruments] = useState('');
  const [maturityDateItem, setMaturityDateItem] = useState('');
  const [numNotionalItem, setNumNotionalItem] = useState(); 
  const [maturityDateInstrument, setMaturityDateInstrument] = useState('');
  const [numNotionalInstrument, setNumNotionalInstrument] = useState();
  const [createHedgeItems, setCreateHedgeItems] = useState([]);




  //get CreateGet
  const getCreateHedge = useGetData('hedges/createGetCombos');
  useEffect (() => {    
    if (getCreateHedge.responseGetData) { 
      setCreateHedgeItems(getCreateHedge.responseGetData.data.hedge_files);      
    }
  },[getCreateHedge.responseGetData])


  //get initial HedgeItems
  const getinitialHedges = useGetData('hedges/createPredictiveItem',{"search":""});
  useEffect (() => {    
    if (getinitialHedges.responseGetData) { 
      setIdHedgeItem(getinitialHedges.responseGetData.data.items);
    }
  },[getinitialHedges.responseGetData])

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
      console.log(getItem.responsePostData);
      setMaturityDateItem(getItem.responsePostData.data.dt_maturity_date);
      setNumNotionalItem(getItem.responsePostData.data.num_notional); 
    }
  },[getItem.responsePostData])

  //get initial HedgeInstruments
  const getinitialHedgeInstruments = useGetData('hedges/createPredictiveInstrument',{"search":""});
  useEffect (() => {    
    if (getinitialHedgeInstruments.responseGetData) { 
      setIdHedgeInstrument(getinitialHedgeInstruments.responseGetData.data.instruments);
    }
  },[getinitialHedges.responseGetData])

  //getInstrumentDetails
  const getInstrument = usePostData();
  const getInstrumentDetails = (id) => {
    console.log('entro en getInstrumentDetails',id)
    if(id){
      getInstrument.postData('hedges/createGetInstrument',{'id_hedge_item':id});
    }
  }
  //get Info extra Derivado
  useEffect(()=>{
    if(getInstrument.responsePostData) {
      console.log(getInstrument.responsePostData);
      setMaturityDateInstrument(getInstrument.responsePostData.data.dt_maturity_date);
      setNumNotionalInstrument(getInstrument.responsePostData.data.num_notional); 
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
      console.log(getHedgeItem.responsePostData);
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
  useEffect(()=> {
    if (selectedCatHedgeItem) {
      console.log('selectedCatHedgeItem',selectedCatHedgeItem);
      getCatHedgeItemDetails(catHedgeFile, selectedCatHedgeItem)
    }
  },[selectedCatHedgeItem])

  //get info select tipo de derivado
  const getCatHedgeItem = usePostData();
  const getCatHedgeItemDetails = (hedgeFile, hedgeIem) => {
    if(hedgeFile){
      getCatHedgeItem.postData('hedges/createGetHedgeInstrument',{'cat_hedge_file':hedgeFile, 'cat_hedge_item': hedgeIem});
    }
  }
  useEffect(()=>{
    if(getCatHedgeItem.responsePostData) {
      console.log(getCatHedgeItem.responsePostData);
      setLoadedCatHedgeInstruments(getCatHedgeItem.responsePostData.data.items);
    }
  },[getCatHedgeItem.responsePostData])

  //llamar a rellenar el select de tipo de derivado cuando seleccionas un tipo de objeto cubierto
  useEffect(()=>{
    if (loadedCatHedgeInstruments) {
      setCatHedgeInstrumentsOnSelect();
    }
  },[loadedCatHedgeInstruments])

  
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
      option.setAttribute('value',hedgeItem.cat_hedge_item);
      option.textContent = hedgeItem.cat_hedge_item;
      hedgeItemSelect.appendChild(option);
    })
  }
  
  //rellenar select tipo derivado
  const setCatHedgeInstrumentsOnSelect = () => {
    const itemSelect = document.getElementById('cat_hedge_instrument');
    if (itemSelect) {
      itemSelect.innerHTML = '';
      const firstOption = document.createElement('option');
      firstOption.setAttribute('value','-1');
      firstOption.textContent = 'Seleccionar';
      itemSelect.appendChild(firstOption);
    }

    loadedCatHedgeInstruments.map(hedgeInstrument => {
      // console.log(hedgeInstrument);
      const option = document.createElement('option');
      option.setAttribute('value',hedgeInstrument.cat_hedge_instrument);
      option.textContent = hedgeInstrument.cat_hedge_instrument;
      itemSelect.appendChild(option);
    })
  }

  // useState(()=>{
  //   if (formItems) {
  //     let keys = Object.keys(formItems);
  //     for (let i=0; i< keys.length; i++) {
  //       let key = keys[i];
  //       let value = extractedData[key];
  //       console.log('evaluo: ',key,' con valor:',value);
  //       if (value == '-1' || value == '') {
  //         console.log('no pasa');
  //         setFormError('Seleccione una opción válida para TODOS los campos');
  //         break;
  //       } 
  //     }  
  //   }  
  // },[formItems])



  const handleSave = (event) => {
    event.preventDefault();
    console.log('handleSave')

    const formData = new FormData(form.current);
    const formItems = {
      id_hedge_item: formData.get('id_hedge_item'),
      dt_maturity_date_item: formData.get('dt_maturity_date_item'),
      num_item_notional: formData.get('num_item_notional'),
      cat_hedge_item_type: formData.get('cat_hedge_item_type'),
      id_hedge_instrument: formData.get('id_hedge_instrument'),      
      dt_maturity_date_instrument: formData.get('dt_maturity_date_instrument'),      
      num_instrument_notional: formData.get('num_instrument_notional'),
      pct: formData.get('pct'),
      cat_hedge_file: formData.get('cat_hedge_file'),
      cat_hedge_item: formData.get('cat_hedge_item'),
      cat_hedge_instrument: formData.get('cat_hedge_instrument'),
      date_from: formData.get('date_from')
    }

    console.log('formItems',formItems);

    const dataSent = {
      "id_hedge_item":formItems.id_hedge_item,
      "id_hedge_instrument":formItems.id_hedge_instrument,
      "cat_hedge_item_type":formItems.cat_hedge_item_type,
      "pct":formItems.pct,
      "id_hedge_file":formItems.id_hedge_file,
      "cat_hedge_file": formItems.cat_hedge_file,
      "cat_hedge_item": formItems.cat_hedge_item,
      "cat_hedge_instrument": formItems.cat_hedge_instrument,
      "date_from": formItems.date_from
    }
    // Api.call.post("hedges/create",dataSent,{ headers:headers })
    //   .then(res => {
    //     // console.log(res);
    //     navigate('/hedges');
    //   })
    //   .catch(err =>{
    //     // console.log(err);
    //     setFormError('Se ha producido un error');
    //   })
    
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
      <SimpleFormHrz  innerRef={form}>
        <TableData>
          <TableDataHeader>
            <TableCellMedium>Partida cubierta</TableCellMedium>
            <TableCellMedium>Fecha vencimiento</TableCellMedium>
            <TableCellMedium>Nocional</TableCellMedium>
            <TableCellMedium>Activo/Pasivo</TableCellMedium>
          </TableDataHeader>      
          <TableDataRow>
            <TableDataRowWrapper>
              <TableCellMedium>
                <Select
                 searchable
                 placeholder='Escribe..'
                 className='bi-c-dropdown-select'
                 valueField='id_hedge_item'
                 labelField='id_hedge_item'
                 name='id_hedge_item'
                 dropdownHandle={false}
                 options={idHedgeItem}
                 noDataRenderer={({ props, state, methods }) => (<div className='react-dropdown-select-item'><span className='react-dropdown-select-item'>No hay datos</span></div>)}
                 onChange={(values) => { 
                  if (values.length > 0) getItemDetails(values[0].id_hedge_item)            
                  }} />
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
                <SelectElement
                  htmlFor='cat_hedge_item_type'>
                  <option value='-1'>Seleccionar</option>
                  <option value='0'>Activo</option>
                  <option value='1'>Pasivo</option>
                </SelectElement>
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
            <TableCellMedium>% Utilizado</TableCellMedium>
          </TableDataHeader>
          <TableDataRow>
            <TableDataRowWrapper>
              <TableCellMedium>
                <Select
                  searchable
                  placeholder='Escribe..'
                  className='bi-c-dropdown-select'
                  valueField='id_hedge_instrument'
                  labelField='id_hedge_instrument'
                  name='id_hedge_instrument'
                  dropdownHandle={false}
                  options={idHedgeInstrument}
                  noDataRenderer={({ props, state, methods }) => (<div className='react-dropdown-select-item'><span className='react-dropdown-select-item'>No hay datos</span></div>)}
                  onChange={(values) => { 
                    console.log(values)
                    if (values.length > 0) getInstrumentDetails(values[0].id_hedge_instrument)            
                  }} />
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
                  htmlFor='pct'
                  type='number'
                  placeholder=''
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
            <TableCellMedium>Tipo objeto cubierto</TableCellMedium>
            <TableCellMedium>Tipo derivado</TableCellMedium>
            <TableCellMedium>Fecha inicio</TableCellMedium>
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
                  <TableCellMedium>
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
                  </TableCellMedium>
                  <TableCellMedium>

                    <LabelElement
                      htmlFor='date_from'
                      type='date'
                      //value={maturityDateInstrument}
                      placeholder=''
                      //readOnly={true}
                      >
                    </LabelElement>


                  </TableCellMedium>
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