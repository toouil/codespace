import{r as s,b as E}from"./app-xtGLZL-7.js";function z({dataTemplate:d={},autoFetch:h=()=>{},onSuccess:n=a=>{},onError:o=a=>{}}){const[a,g]=s.useState(d),[S,l]=s.useState(!1),[b,r]=s.useState(!1),[k,p]=s.useState(!1),[y,R]=s.useState(null),[C,m]=s.useState(null),x=(e,t)=>{g(u=>({...u,[e]:t}))};s.useEffect(()=>{h()},[]);const q=s.useCallback(e=>{p(!0),m(e),n(e)},[n]),f=s.useCallback(e=>{R(e),o(e)},[o]),c=s.useCallback(async(e,t,u={})=>{l(!1),r(!0),p(!1),R(null);try{const D=(await E({headers:{"Content-Type":"application/json",Accept:"application/json"},method:e,url:t,data:{...a,...u},params:e==="get"?{...a,...u}:{}})).data;q(D)}catch(i){f(i)}finally{r(!1),l(!0)}},[a,q,f]);return{data:a,setData:x,getRequest:(e,t={})=>c("get",e,t),postRequest:(e,t={})=>c("post",e,t),putRequest:(e,t={})=>c("put",e,t),patchRequest:(e,t={})=>c("patch",e,t),deleteRequest:(e,t={})=>c("delete",e,t),fetched:S,fetching:b,error:y,success:k,response:C}}export{z as u};
