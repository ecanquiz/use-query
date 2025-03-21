import { ref } from 'vue'
import type { AxiosInstance, AxiosRequestConfig } from 'axios' 

const getError = (e: any) => {
    console.log('myerror', e)
    console.log('myerror2', e.headers ?? "No Headers")
    console.log("MYYYYCode:", e.code)
    console.log("MYYYYStatus:", e.status)
    console.log("Message:", e.message)
    console.log("data:", !e.data)
    console.log("config:", e.config)
    console.log("stack:", e.stack)
    /*const errorMessage = "API Error, please try again.";  
    if (import.meta.env.DEV) {
      console.error(error.response.headers ?? "No Headers")    
      console.error("Status:", error.response.status)
      console.error("Message:", error.message)
      console.error(errorMessage)
      console.log(error)  
      if (!error.response.data) {
        console.error(
          "There is no Data.",
          `API ${error.config.baseURL}${error.config.url} not found`
        ) 
      } else {
        console.error('Data', error.response.data)
        return error.response.data.errors ?? {}
      }
    }  
    return errorMessage;*/
};

const useQuery = async(
  instance: AxiosInstance,
  url: string,
  config?: AxiosRequestConfig<any> | undefined
) => {
  const pending = ref(true)
  const errors = ref()
  const response = ref()

  try {
    response.value = await instance(url, config);
  }
  catch (e: any) {
    errors.value = e as Error;
    getError(e);
  }
  finally {
    pending.value = false;
  }
    
  return {
    response,
    errors,
    pending

    //getError
  }
}

export default useQuery;