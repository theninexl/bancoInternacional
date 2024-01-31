import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from '../../services/api';
import { DateTime } from "luxon";
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { LabelElement, SelectElement, SimpleFormHrz, SimpleFormRow,  ToggleElement,  UploadFileTo64 } from "../../components/UI/forms/SimpleForms";
import { ButtonLGhost, ButtonLPrimary, ButtonLSecondary } from "../../components/UI/buttons/Buttons";
import { MainHeading } from "../../components/UI/headings";
import { TableData, TableDataHeader, TableCellMedium, TableDataRow, TableDataRowWrapper } from "../../components/UI/tables/TableDataElements";



const NewHedge = ({ hedges, setHedges, allHedges, setAllHedges, page, totalrowscount, setTotalrowscount }) => {
  const navigate = useNavigate();
  const form = useRef(null);
  const [formError, setFormError] = useState(null);
  //estados campos de creacion
  const [idHedgeItem, setIdHedgeItem] = useState('');
  const [idHedgeInstrument, setIdHedgeInstrument] = useState('');
  const [catHedgeFile, setCatHedgeFile] = useState('');
  const [loadedCatHedgeItems, setLoadedCatHedgeItems] = useState('');
  const [selectedCatHedgeItem, setSelectedCatHedgeItem] = useState('');
  const [loadedCatHedgeInstruments, setLoadedCatHedgeInstruments] = useState('');
  const [maturityDateItem, setMaturityDateItem] = useState('');
  const [numNotionalItem, setNumNotionalItem] = useState(); 
  const [maturityDateInstrument, setMaturityDateInstrument] = useState('');
  const [numNotionalInstrument, setNumNotionalInstrument] = useState();
  const [createHedgeItems, setCreateHedgeItems] = useState();

  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token; 
  const headers = {
    'Content-Type': 'application/json',
    'x-access-token': token,
  }

  //get CreateGet
  const getCreateHedge = () => {
    const data = {}
    Api.call.post('hedges/createGetCombos',data,{ headers:headers })
    .then(res => {
      // console.log(res.data)
      setCreateHedgeItems(res.data);
    }).catch(err => {
      console.warn(err)})
  }

  //get Info extra Partida cubierta
  const createGetItem = (id) => {
    const data = {'id_hedge_item':id}
    Api.call.post('hedges/createGetItem',data,{ headers:headers })
    .then(res => {
      // console.log(res.data);
      setMaturityDateItem(res.data.dt_maturity_date);
      setNumNotionalItem(res.data.num_notional);     
    }).catch(err => {
      console.warn(err)})
  }

  //get Info extra Derivado
  const createGetInstrument = (id) => {
    const data = {'id_hedge_item':id}
    Api.call.post('hedges/createGetInstrument',data,{ headers:headers })
    .then(res => {
      // console.log(res.data);
      setMaturityDateInstrument(res.data.dt_maturity_date);
      setNumNotionalInstrument(res.data.num_notional);       
    }).catch(err => {
      console.warn(err)})
  }

  //get info extra tipo objeto cubierto
  const createGetHedgeItem = (hedgeFile) => {
    const data = {'cat_hedge_file':hedgeFile}
    Api.call.post('hedges/createGetHedgeItem', data, {headers:headers})
    .then(res =>{
      //console.log(res.data);
      setLoadedCatHedgeItems(res.data.items);
    }).catch(err => console.warn(err));
  }

  //get info extra tipo derivado
  const createGetHedgeInstrument = (catHedgeFile, catHedgeItem) => {
    const data = {
      'cat_hedge_file': catHedgeFile,
      'cat_hedge_item': catHedgeItem,
    }
    Api.call.post('hedges/createGetHedgeInstrument', data, {headers:headers})
    .then(res =>{
      // console.log(res.data);
      setLoadedCatHedgeInstruments(res.data.items);
    }).catch(err => console.warn(err));
  }

  useEffect(()=>{      
    const execGetCreateHedge = async () => await getCreateHedge();
    execGetCreateHedge();
  },[]);

  //colocar todas las partidas de cubierta disponibles en el primer select cuando tengamos todas las coberturas cargadas
  useEffect(()=>{
    if (createHedgeItems) {
      setHedgeItemsOnSelect();
      setHedgeInstrumentsOnSelect();
      setHedgeFilesOnSelect();
    }
  },[createHedgeItems])

  //llamar a cargar datos cuando cambia la partida cubierta
  useEffect(() => {
    if (idHedgeItem) {
      const execCreateGetItem = async () => await createGetItem(idHedgeItem);
      execCreateGetItem();
    }
  },[idHedgeItem])

  //llamar a cargar datos cuando cambia el derivado
  useEffect(() => {
    if (idHedgeInstrument) {
      const execCreateGetInstrument = async () => await createGetInstrument(idHedgeInstrument);
      execCreateGetInstrument();
    }
  },[idHedgeInstrument])

  //llamar a rellenar el select de tipo de objeto cubierto cuando seleccionas un tipo de cobertura
  useEffect(()=>{
    if (loadedCatHedgeItems) {
      setCatHedgeItemsOnSelect();
    }
  },[loadedCatHedgeItems])

  //llamar a cargar datos cuando cambia el tipo de cobertura
  useEffect(()=>{
    const execCreateGetHedgeItem = async () => await createGetHedgeItem(catHedgeFile);
    execCreateGetHedgeItem();
  },[catHedgeFile])

  //llamar a cargar datos cuando cambia el tipo de objeto cubierto
  useEffect(()=> {
    const execCreateGetHedgeInstrument = async () => await createGetHedgeInstrument(catHedgeFile, selectedCatHedgeItem);
    execCreateGetHedgeInstrument();
  },[selectedCatHedgeItem])

  
  //llamar a rellenar el select de tipo de derivado cuando seleccionas un tipo de objeto cubierto
  useEffect(()=>{
    if (loadedCatHedgeInstruments) {
      setCatHedgeInstrumentsOnSelect();
    }
  },[loadedCatHedgeInstruments])

  
  //rellenar select partida cubierta
  const setHedgeItemsOnSelect = () => {
    const itemSelect = document.getElementById('id_hedge_item');
    itemSelect.innerHTML = '';
    const firstOption = document.createElement('option');
    firstOption.setAttribute('value','-1');
    firstOption.textContent = 'Seleccionar';
    itemSelect.appendChild(firstOption);

    createHedgeItems.items.map(hedge => {
      const option = document.createElement('option');
      option.setAttribute('value',hedge.id_hedge_item);
      option.textContent = hedge.id_hedge_item;
      itemSelect.appendChild(option);
    })
  }

  //rellenar select derivados con todos los instrumentos
  const setHedgeInstrumentsOnSelect = () => {
    const itemSelect = document.getElementById('id_hedge_instrument');
    itemSelect.innerHTML = '';
    const firstOption = document.createElement('option');
    firstOption.setAttribute('value','-1');
    firstOption.textContent = 'Seleccionar';
    itemSelect.appendChild(firstOption);

    createHedgeItems.instruments.map(hedge => {
      const option = document.createElement('option');
      option.setAttribute('value',hedge.id_hedge_instrument);
      option.textContent = hedge.id_hedge_instrument;
      itemSelect.appendChild(option);
    })
  }  
  
  //rellenar select tipo de cobertura
  const setHedgeFilesOnSelect = () => {
    const itemSelect = document.getElementById('cat_hedge_file');
    itemSelect.innerHTML = '';
    const firstOption = document.createElement('option');
    firstOption.setAttribute('value','-1');
    firstOption.textContent = 'Seleccionar';
    itemSelect.appendChild(firstOption);

    createHedgeItems.hedge_files.map(hedge => {
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
    }

    const dataSent = {
      "id_hedge_item":formItems.id_hedge_item,
      "id_hedge_instrument":formItems.id_hedge_instrument,
      "cat_hedge_item_type":formItems.cat_hedge_item_type,
      "pct":formItems.pct,
      "id_hedge_file":formItems.id_hedge_file,
      "cat_hedge_file": formItems.cat_hedge_file,
      "cat_hedge_item": formItems.cat_hedge_item,
      "cat_hedge_instrument": formItems.cat_hedge_instrument,
    }
    Api.call.post("hedges/create",dataSent,{ headers:headers })
      .then(res => {
        // console.log(res);
        navigate('/hedges');
      })
      .catch(err =>{
        // console.log(err);
        setFormError('Seleccione una opción válida para TODOS los campos');
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
      <SimpleFormHrz  innerRef={form}>
        <TableData>
          <TableDataHeader>
            <TableCellMedium>Partida cubierta</TableCellMedium>
            <TableCellMedium>Fecha vencimiento</TableCellMedium>
            <TableCellMedium>Nocional</TableCellMedium>
            <TableCellMedium>Activo/Pasivo</TableCellMedium>
          </TableDataHeader>          
          {
            createHedgeItems && 
            <>
              <TableDataRow>
                <TableDataRowWrapper>
                  <TableCellMedium>
                  <SelectElement
                        htmlFor='id_hedge_item'
                        value={idHedgeItem}
                        handleOnChange={(event) =>{
                          event.preventDefault();
                          setFormError(null);
                          setIdHedgeItem(event.target.value);
                        }}
                        >
                        <option value='-1'>Seleccionar</option>
                      </SelectElement>              
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
            </>
          }
        </TableData>        
        
        {/* NUEVO INSTRUMENTO */}
        <TableData>
          <TableDataHeader>
            <TableCellMedium>Derivado</TableCellMedium>
            <TableCellMedium>Fecha vencimiento</TableCellMedium>
            <TableCellMedium>Nocional</TableCellMedium>
            <TableCellMedium>% Utilizado</TableCellMedium>
          </TableDataHeader>
          {
            createHedgeItems && 
            <>
              <TableDataRow>
                <TableDataRowWrapper>
                  <TableCellMedium>
                  <SelectElement
                        htmlFor='id_hedge_instrument'
                        value={idHedgeInstrument}
                        handleOnChange={(event) =>{
                          event.preventDefault();
                          setFormError(null);
                          setIdHedgeInstrument(event.target.value);
                        }}
                        >
                        <option value='-1'>Seleccionar</option>
                      </SelectElement>              
                    
                  </TableCellMedium>
                  <TableCellMedium>
                  <LabelElement
                      htmlFor='dt_maturity_date_instrument'
                      type='text'
                      value={maturityDateInstrument}
                      placeholder=''
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
            </>
          }
        </TableData>


        {/* NUEVO INSTRUMENTO */}
        <TableData>
          <TableDataHeader>
            <TableCellMedium>Tipo cobertura</TableCellMedium>
            <TableCellMedium>Tipo objeto cubierto</TableCellMedium>
            <TableCellMedium>Tipo derivado</TableCellMedium>
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