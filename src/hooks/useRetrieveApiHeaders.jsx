export const useRetrieveApiHeaders = () => {

  
    //guardar token peticiones
    const accountInLocalStorage = localStorage.getItem('account');
    const parsedAccount = JSON.parse(accountInLocalStorage);
    const token = parsedAccount.token;
  
    const headers = {
      'Content-Type': 'application/json',
      'x-access-token': token
    }
  
    return {headers}
  }