import { useCallback } from "react";

interface fetchRequest {
  url: string;
  token: string;
  json?: any;
  formData?: FormData;
}

const handleResponseError = async (res: Response) => {
  if (res.status === 413) {
    const err: any = new Error("Error de conexión");
    err.status = 413;
    throw err;
  }
  let message = `Error del servidor: ${res.status}`;
  try {
    const errorBody = await res.json();
    message = errorBody?.message ?? errorBody?.error ?? message;
  } catch { }
  const err: any = new Error(message);
  err.status = res.status;
  throw err;
};

export const useFetch = () => {

  const getRequest = useCallback(async ({ url, token }: fetchRequest) => {
    try {
      const res: any = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Cache-Control': 'no-cache',
          // 'Pragma': 'no-cache'
        },
        // cache: 'no-store'
      })

      // if (res.status === 304) {
      //   return null
      // }

      if (res.status === 401 && token) {
        sessionStorage.removeItem('session');
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        await handleResponseError(res);
      }

      if (!res) throw new Error("WARN", res.status);
      return res.json();
    }
    catch (err: any) {
      if (err?.status === 413 || err?.message === "Error de conexión") {
        throw err;
      }
      throw new Error(`Error en GET: ${err?.message ?? err}`)
    }
  }, [])

  // Nuevo postRequest para trabajar con json y formData
  const postRequest = useCallback(async ({ url, token, json, formData }: any) => {
    try {
      const headers: HeadersInit = { 'Authorization': `Bearer ${token}`, };

      let bodyData: any;

      if (formData) {
        bodyData = formData;
      } else {
        bodyData = JSON.stringify(json);
        headers['Content-Type'] = 'application/json';
      }

      const res = await fetch(url, { method: 'POST', body: bodyData, headers: headers });

      if (res.status === 401 && token) {
        sessionStorage.removeItem('session');
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        await handleResponseError(res);
      }

      return await res.json();
    }
    catch (err: any) {
      throw err;
    }
  }, [])

  const putRequest = useCallback(async ({ url, token, json }: fetchRequest) => {
    try {
      const res: any = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(json),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (res.status === 401 && token) {
        sessionStorage.removeItem('session');
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        await handleResponseError(res);
      }

      return await res.json();
    }
    catch (err: any) {
      throw err;
    }
  }, [])

  const patchRequest = useCallback(async ({ url, token, json, formData }: fetchRequest) => {
    try {
      const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`
      };

      let bodyData: BodyInit;

      if (formData) {
        bodyData = formData;
      } else {
        bodyData = JSON.stringify(json ?? {});
        headers['Content-Type'] = 'application/json';
      }

      const res = await fetch(url, {
        method: 'PATCH',
        body: bodyData,
        headers
      });

      if (res.status === 401 && token) {
        sessionStorage.removeItem('session');
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        await handleResponseError(res);
      }

      return await res.json();
    } catch (err: any) {
      throw err;
    }
  }, []);

  const deleteRequest = useCallback(async ({ url, token }: fetchRequest) => {
    try {
      const res: any = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })

      if (res.status === 401 && token) {
        sessionStorage.removeItem('session');
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        await handleResponseError(res);
      }

      return await res.json().catch(() => null);
    }
    catch (err: any) {
      throw err;
    }
  }, [])

  return {
    getRequest,
    postRequest,
    putRequest,
    patchRequest,
    deleteRequest
  }
}


