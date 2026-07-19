
const WORKOUTS=[
{id:"upper-heavy",day:1,dayName:"Montag",time:"16:00",title:"Oberkörper schwer",exercises:[
["Schrägbankdrücken",4,"6–10",60],["Brustpresse",3,"8–12",50],["Brustgestütztes Rudern",4,"6–10",50],
["Latzug neutral",3,"8–12",55],["Schulterpresse",3,"8–12",35],["Seitheben Kabel",3,"12–20",7.5],
["Face Pulls",3,"12–20",20],["Shrugs",3,"10–15",60],["Trizepsdrücken Seil",3,"10–15",25],
["Kabelcurls",3,"10–15",20],["Hanging Leg Raises",3,"10–15",0]]},
{id:"lower-heavy",day:3,dayName:"Mittwoch",time:"16:00",title:"Unterkörper schwer",exercises:[
["Beinpresse",4,"8–12",120],["Rumänisches Kreuzheben",4,"6–10",60],["Beinstrecker",3,"10–15",40],
["Wadenheben",4,"12–20",60],["Adduktoren",2,"12–15",40],["Abduktoren",2,"12–15",40],
["Crunch-Maschine",3,"10–15",30]]},
{id:"upper-volume",day:4,dayName:"Donnerstag",time:"16:00",title:"Oberkörper Volumen",exercises:[
["Flachbankdrücken",3,"8–12",50],["Butterfly oder Kabel-Flys",3,"12–15",35],["Latzug breit",3,"8–12",50],
["Kabelrudern",3,"10–12",45],["Reverse Butterfly",3,"12–20",25],["Seitheben",3,"12–20",8],
["Overhead Trizeps Kabel",3,"10–15",20],["Hammercurls",3,"10–15",12]]}
];

const RUNS=[
{day:2,dayName:"Dienstag",time:"07:00",title:"Intervalle 5–10 km"},
{day:5,dayName:"Freitag",time:"07:00",title:"Tempolauf"},
{day:6,dayName:"Samstag",time:"07:00",title:"Lockerer Lauf"}
];

const historyKey="reppilot-history-v4";
let active=null,index=0;
const $=id=>document.getElementById(id);

function history(){return JSON.parse(localStorage.getItem(historyKey)||"[]")}
function save(items){localStorage.setItem(historyKey,JSON.stringify(items))}
function nextWorkout(){
 const today=new Date().getDay();
 return WORKOUTS.map(w=>({...w,delta:(w.day-today+7)%7})).sort((a,b)=>a.delta-b.delta)[0]
}
function lastExercise(name){
 const h=history();
 for(let i=h.length-1;i>=0;i--){const e=h[i].exercises.find(x=>x.name===name);if(e)return e}
 return null
}
function recommendation(name){
 const last=lastExercise(name);
 if(!last)return"Startgewicht";
 return"Halten"
}
function renderHome(){
 const n=nextWorkout();
 $("nextTitle").textContent=n.title;
 $("nextMeta").textContent=`${n.dayName}, ${n.time} Uhr`;
 $("startBtn").onclick=()=>start(n.id);
 $("plan").innerHTML=[...WORKOUTS,...RUNS].sort((a,b)=>a.day-b.day).map(x=>`
 <article class="plan-item"><div class="plan-day">${x.dayName}</div><div><h3>${x.title}</h3><p>${x.time} Uhr</p></div></article>`).join("")
}
function start(id){
 const w=WORKOUTS.find(x=>x.id===id);
 active={id:w.id,title:w.title,startedAt:new Date().toISOString(),exercises:w.exercises.map(([name,setCount,repRange,defaultWeight])=>{
   const last=lastExercise(name);
   const previousWeight=last?.sets?.find(s=>Number(s.weight)>=0)?.weight;
   return{name,repRange,recommendation:recommendation(name),sets:Array.from({length:setCount},(_,i)=>({
     index:i+1,weight:previousWeight??defaultWeight,done:false
   }))}
 })};
 index=0;
 renderExercise();
 show("workout")
}
function allSetsDone(){
 return active.exercises[index].sets.every(s=>s.done)
}
function updateContinueState(){
 const ready=allSetsDone();
 $("nextBtn").disabled=!ready;
 $("finishHint").textContent=ready
   ? (index===active.exercises.length-1?"Alle Sätze erledigt – Training abschließen.":"Übung erledigt – weiter zur nächsten Übung.")
   :"Markiere alle Sätze als erledigt, um weiterzugehen.";
 $("finishHint").classList.toggle("ready",ready)
}
function renderExercise(){
 const e=active.exercises[index],total=active.exercises.length;
 $("counter").textContent=`Übung ${index+1} von ${total}`;
 $("workoutTitle").textContent=active.title;
 $("bar").style.width=`${((index+1)/total)*100}%`;
 $("exerciseName").textContent=e.name;
 $("exerciseTarget").textContent=`${e.repRange} Wiederholungen`;
 $("rec").textContent=e.recommendation;
 $("rec").className=e.recommendation==="Steigern"?"up":"";
 $("sets").innerHTML="";
 e.sets.forEach((s,i)=>{
   const row=document.createElement("div");
   row.className=`set-card${s.done?" completed":""}`;
   row.innerHTML=`
     <strong>Satz ${s.index}</strong>
     <div class="input-wrap"><label>Gewicht in kg</label>
       <input type="number" inputmode="decimal" min="0" step="0.5" value="${s.weight}">
     </div>
     <input type="checkbox" ${s.done?"checked":""} aria-label="Satz erledigt">
   `;
   const inputs=row.querySelectorAll("input");
   inputs[0].oninput=ev=>active.exercises[index].sets[i].weight=ev.target.value;
   inputs[1].onchange=ev=>{
     active.exercises[index].sets[i].done=ev.target.checked;
     row.classList.toggle("completed",ev.target.checked);
     updateContinueState()
   };
   $("sets").appendChild(row)
 });
 $("skipBtn").disabled=index===total-1;
 $("skipBtn").textContent=index===total-1?"Keine Übung danach":"Übung überspringen";
 $("nextBtn").textContent=index===total-1?"Training abschließen":"Weiter";
 updateContinueState()
}
function skip(){
 if(!active||index>=active.exercises.length-1)return;
 [active.exercises[index],active.exercises[index+1]]=[active.exercises[index+1],active.exercises[index]];
 renderExercise();
 window.scrollTo({top:0,behavior:"smooth"})
}
function next(){
 if(!allSetsDone())return;
 if(index<active.exercises.length-1){
   index++;
   renderExercise();
   window.scrollTo({top:0,behavior:"smooth"})
 }else finish()
}
function finish(){
 active.finishedAt=new Date().toISOString();
 const h=history();h.push(active);save(h);
 active=null;
 renderHistory();
 show("home")
}
function renderHistory(){
 const h=history().slice().reverse();
 $("historyList").innerHTML=h.length?h.map(x=>{
   const date=new Date(x.finishedAt||x.startedAt).toLocaleDateString("de-DE");
   const sets=x.exercises.reduce((sum,e)=>sum+e.sets.filter(s=>s.done).length,0);
   return`<article class="history-item"><div><h3>${x.title}</h3><p>${date}, ${sets} erledigte Sätze</p></div></article>`
 }).join(""):`<div class="empty">Noch keine Trainings gespeichert.</div>`
}
function show(id){
 document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
 $(id).classList.add("active");
 document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===id))
}
$("nextBtn").onclick=next;
$("skipBtn").onclick=skip;
$("cancelBtn").onclick=()=>{if(confirm("Training wirklich abbrechen?")){active=null;show("home")}};
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>show(b.dataset.view));

if("serviceWorker"in navigator){
 window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"))
}
renderHome();
renderHistory();
