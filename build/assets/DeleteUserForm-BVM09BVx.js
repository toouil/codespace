import{r,W as x,j as e}from"./app-xtGLZL-7.js";import{I as j}from"./Input-DiuZflP-.js";import{L as w}from"./Loader-Br331SDq.js";import{s as y}from"./Functions-DjAUCTNG.js";import"./index-BIcDevOB.js";import"./Notify-Dlq59V6X.js";function E({className:s=""}){const[t,l]=r.useState(!1),i=r.useRef(),{data:d,setData:u,post:m,processing:a,reset:c}=x({password:""}),p=()=>{l(!0)},f=n=>{n.preventDefault(),m(route("delete.account"),{preserveScroll:!0,onSuccess:()=>o(),onError:h=>{y(h)},onFinish:()=>c()})},o=()=>{l(!1),c()};return e.jsxs("section",{className:"delete_user_section "+s,children:[e.jsxs("header",{children:[e.jsx("h2",{className:"settings_title",children:"Delete Account"}),e.jsx("p",{className:"",children:"Once your account is deleted, all of its resources and data will be permanently deleted"})]}),e.jsx("button",{onClick:p,className:"openConfirmModalButton",children:"Delete Account"}),e.jsx(b,{show:t,onClose:o,children:e.jsxs("form",{onSubmit:f,className:"delete_user_form container",children:[e.jsx("h2",{className:"settings_title",children:"Are you sure you want to delete your account?"}),e.jsx("p",{children:"Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account."}),e.jsx(j.password,{id:"password",type:"password",name:"password",ref:i,value:d.password,onChange:n=>u("password",n.target.value),className:"mt-1 block w-3/4",placeholder:"Password"}),e.jsxs("div",{className:"actions",children:[e.jsx("button",{onClick:o,type:"button",children:"Cancel"}),e.jsx("button",{type:"submit",disabled:a,children:"Delete Account"})]})]})}),a&&e.jsx(w,{})]})}function b({show:s,children:t}){if(r.useEffect(()=>{s?document.documentElement.style.overflow="hidden":document.documentElement.style.overflow=null},[s]),s)return e.jsx("section",{className:"confirme_delete_model",children:t})}export{E as default};