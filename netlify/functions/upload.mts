import {getStore} from "@netlify/blobs";
import type {Config} from "@netlify/functions";
const store=()=>getStore("thiz-data",{consistency:"strong"});
export default async(req:Request)=>{const p=Netlify.env.get("THIZ_ADMIN_PASSWORD");if(!p||req.headers.get("x-thiz-admin")!==p)return new Response("Unauthorized",{status:401});if(req.method!=="POST")return new Response("Method not allowed",{status:405});const f=await req.formData(),file=f.get("file");const key=String(f.get("key")||("image/"+Date.now()));if(!(file instanceof File))return new Response("No file",{status:400});await store().set(key,file);return new Response(JSON.stringify({key,url:"/api/image?key="+encodeURIComponent(key)}),{headers:{"content-type":"application/json"}})};
export const config:Config={path:"/api/upload"};
