interface fetchRequest {
  url: string;
  token: string;
  json?: any
}

export const useFetch = () => {

  const getRequest = async ({ url, token }: fetchRequest) => {
    try {
      const res: any = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      if (!res) throw new Error("WARN", res.status);
      return res.json();
    }
    catch (err: any) {
      throw new Error(`Error en GET`, err)
    }
  }

  // Nuevo postRequest para trabajar con json y formData
  const postRequest = async ({ url, token, json, formData }: any) => {
    try {
        const headers: HeadersInit = {'Authorization': `Bearer ${token}`, };

        let bodyData: any;

        if (formData) {
            bodyData = formData;
        } else {
            bodyData = JSON.stringify(json);
            headers['Content-Type'] = 'application/json';
        }

        const res = await fetch(url, {method: 'POST', body: bodyData, headers: headers});

        if (!res.ok) throw new Error(`Server respondió con estatus: ${res.status}`);
        return await res.json();
    }
    catch (err: any) {
        throw new Error(`Error en POST: ${err.message}`);
    }
  }

  const putRequest = async ({ url, token, json }: fetchRequest) => {
    try {
      const res: any = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(json),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!res) throw new Error("WARN", res.status);
      return await res.json();
    }
    catch (err: any) {
      throw new Error(`Error en PUT`, err)
    }
  }

  const deleteRequest = async ({ url, token }: fetchRequest) => {
    try {
      const res: any = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      if (!res) throw new Error("WARN", res.status);
      return await res.json();
    }
    catch (err: any) {
      throw new Error(`Error en DELETE`, err)
    }
  }

  return {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest
  }
}

