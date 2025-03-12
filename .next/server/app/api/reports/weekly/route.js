(()=>{var e={};e.id=595,e.ids=[595],e.modules={96330:e=>{"use strict";e.exports=require("@prisma/client")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},79428:e=>{"use strict";e.exports=require("buffer")},79646:e=>{"use strict";e.exports=require("child_process")},55511:e=>{"use strict";e.exports=require("crypto")},14985:e=>{"use strict";e.exports=require("dns")},94735:e=>{"use strict";e.exports=require("events")},29021:e=>{"use strict";e.exports=require("fs")},81630:e=>{"use strict";e.exports=require("http")},55591:e=>{"use strict";e.exports=require("https")},91645:e=>{"use strict";e.exports=require("net")},21820:e=>{"use strict";e.exports=require("os")},33873:e=>{"use strict";e.exports=require("path")},27910:e=>{"use strict";e.exports=require("stream")},34631:e=>{"use strict";e.exports=require("tls")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},74075:e=>{"use strict";e.exports=require("zlib")},18538:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>h,routeModule:()=>l,serverHooks:()=>m,workAsyncStorage:()=>p,workUnitAsyncStorage:()=>g});var s={};r.r(s),r.d(s,{POST:()=>d});var n=r(42706),i=r(28203),o=r(45994),a=r(39187),u=r(62087),c=r(98873);async function d(e){try{let t=await (0,c.r)(e);if(!t||"CEO"!==t.role&&"ADMIN"!==t.role)return a.NextResponse.json({message:"Unauthorized"},{status:401});let r=await (0,u.j)();if(r.success)return a.NextResponse.json({success:!0,message:"Weekly report generated and sent successfully",reportId:r.reportId});return a.NextResponse.json({success:!1,message:"Failed to generate weekly report",error:r.error},{status:500})}catch(e){return console.error("Error generating weekly report:",e),a.NextResponse.json({message:"An error occurred while generating the weekly report"},{status:500})}}let l=new n.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/reports/weekly/route",pathname:"/api/reports/weekly",filename:"route",bundlePath:"app/api/reports/weekly/route"},resolvedPagePath:"E:\\signonsite\\transform\\app\\api\\reports\\weekly\\route.ts",nextConfigOutput:"standalone",userland:s}),{workAsyncStorage:p,workUnitAsyncStorage:g,serverHooks:m}=l;function h(){return(0,o.patchFetch)({workAsyncStorage:p,workUnitAsyncStorage:g})}},96487:()=>{},78335:()=>{},98873:(e,t,r)=>{"use strict";r.d(t,{r:()=>i});var s=r(43008),n=r(11587);async function i(e){try{let t=e.headers.get("cookie");if(!t)return null;let r=t.split(";").reduce((e,t)=>{let[r,s]=t.trim().split("=");return e[r]=decodeURIComponent(s),e},{})["auth-token"];if(!r)return null;let i=(0,s.verify)(r,process.env.JWT_SECRET||"fallback-secret");return await n.z.user.findUnique({where:{id:i.id},select:{id:!0,name:!0,email:!0,role:!0,company:!0,position:!0}})}catch(e){return console.error("Error getting user from request:",e),null}}},11587:(e,t,r)=>{"use strict";r.d(t,{z:()=>n});var s=r(96330);let n=global.prisma||new s.PrismaClient({log:["error"]})},62087:(e,t,r)=>{"use strict";r.d(t,{j:()=>u});var s=r(11587),n=r(61222),i=r(6811),o=r(95899),a=r(98721);async function u(){try{let e=(0,n.k)(new Date,{weekStartsOn:1}),t=(0,i.$)(new Date,{weekStartsOn:1}),r=(0,o.GP)(e,"yyyy-MM-dd"),u=(0,o.GP)(t,"yyyy-MM-dd"),c=await s.z.jobSite.findMany({include:{attendances:{where:{signInTime:{gte:e,lte:t}},include:{user:!0}},inductions:{include:{completions:{where:{completedAt:{gte:e,lte:t}}}}},swms:{include:{signoffs:{where:{signedAt:{gte:e,lte:t}}}}}}}),d=c.reduce((e,t)=>e+t.attendances.length,0),l=new Set;c.forEach(e=>{e.attendances.forEach(e=>{l.add(e.userId)})});let p=c.reduce((e,t)=>e+t.inductions.reduce((e,t)=>e+t.completions.length,0),0),g=c.reduce((e,t)=>e+t.swms.reduce((e,t)=>e+t.signoffs.length,0),0),m=0;c.forEach(e=>{e.attendances.forEach(e=>{if(e.signOutTime){let t=new Date(e.signInTime).getTime(),r=new Date(e.signOutTime).getTime();m+=(r-t)/36e5}})});let h=c.map(e=>{let t=e.attendances.reduce((e,t)=>{if(!t.signOutTime)return e;let r=new Date(t.signInTime).getTime(),s=new Date(t.signOutTime).getTime();return e+(s-r)/36e5},0);return{name:e.name,attendances:e.attendances.length,uniqueWorkers:new Set(e.attendances.map(e=>e.userId)).size,hoursWorked:t,inductionsCompleted:e.inductions.reduce((e,t)=>e+t.completions.length,0),swmsSigned:e.swms.reduce((e,t)=>e+t.signoffs.length,0)}}),w={weekStarting:r,weekEnding:u,totalAttendances:d,uniqueWorkers:l.size,totalHoursWorked:m,totalInductionsCompleted:p,totalSwmsSigned:g,sites:h},k=await s.z.weeklyReport.create({data:{weekStarting:e,weekEnding:t,reportData:w,sentTo:[process.env.REPORT_EMAIL||"admin@example.com"]}}),x=a.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT),secure:"true"===process.env.SMTP_SECURE,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}}),y=`
    <h1>Weekly Site Activity Report</h1>
    <p>Week: ${w.weekStarting} to ${w.weekEnding}</p>
    
    <h2>Summary</h2>
    <ul>
      <li>Total Attendances: ${w.totalAttendances}</li>
      <li>Unique Workers: ${w.uniqueWorkers}</li>
      <li>Total Hours Worked: ${w.totalHoursWorked.toFixed(1)}</li>
      <li>Inductions Completed: ${w.totalInductionsCompleted}</li>
      <li>SWMS Signed: ${w.totalSwmsSigned}</li>
    </ul>
    
    <h2>Site Breakdown</h2>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
      <tr>
        <th>Site Name</th>
        <th>Attendances</th>
        <th>Unique Workers</th>
        <th>Hours Worked</th>
        <th>Inductions</th>
        <th>SWMS</th>
      </tr>
      ${w.sites.map(e=>`
        <tr>
          <td>${e.name}</td>
          <td>${e.attendances}</td>
          <td>${e.uniqueWorkers}</td>
          <td>${e.hoursWorked.toFixed(1)}</td>
          <td>${e.inductionsCompleted}</td>
          <td>${e.swmsSigned}</td>
        </tr>
      `).join("")}
    </table>
    
    <p>View detailed report in the admin dashboard.</p>
  `;return await x.sendMail({from:process.env.SMTP_FROM,to:process.env.REPORT_EMAIL,subject:`Weekly Site Activity Report: ${w.weekStarting} to ${w.weekEnding}`,html:y}),await s.z.weeklyReport.update({where:{id:k.id},data:{sentAt:new Date}}),{success:!0,reportId:k.id}}catch(e){return console.error("Error generating weekly report:",e),{success:!1,error:e}}}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[638,452,8,5],()=>r(18538));module.exports=s})();