import Cookies from "js-cookie";

export default defineNuxtRouteMiddleware( async () => {
    const api = useRuntimeConfig().public.API_PATH;
    
    let jwt;
    if(Cookies.get('jwt')){
        jwt = Cookies.get('jwt');
        const chk_jwt = await fetch(api + "api/verify-token", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        
        const resp_jwt = await chk_jwt.json();
        
        if (!resp_jwt.status) {
            console.log(resp_jwt.status);
            Cookies.remove('jwt');
            return navigateTo('/')
        }
  
    }else{
        return navigateTo('/')
    }
   

    useState('api', () => api);
    useState('jwt', () =>  jwt);
})