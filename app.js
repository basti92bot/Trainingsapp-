const WORKOUTS = [
  {id:"upper-heavy",day:1,dayName:"Montag",time:"16:00",title:"Oberkörper schwer",exercises:[
    ["Schrägbankdrücken",4,"10",60],["Brustpresse",3,"10",50],["Brustgestütztes Rudern",4,"10",50],
    ["Latzug neutral",3,"10",55],["Schulterpresse",3,"10",35],["Seitheben Kabel",3,"10",7.5],
    ["Face Pulls",3,"10",20],["Shrugs",3,"10",60],["Trizepsdrücken Seil",3,"10",25],
    ["Kabelcurls",3,"10",20],["Hanging Leg Raises",3,"10",0]
  ]},
  {id:"lower-heavy",day:3,dayName:"Mittwoch",time:"16:00",title:"Unterkörper schwer",exercises:[
    ["Beinpresse",4,"10",120],["Rumänisches Kreuzheben",4,"10",60],["Beinstrecker",3,"10",40],
    ["Wadenheben",4,"10",60],["Adduktoren",2,"10",40],["Abduktoren",2,"10",40],
    ["Crunch-Maschine",3,"10",30]
  ]},
  {id:"upper-volume",day:4,dayName:"Donnerstag",time:"16:00",title:"Oberkörper Volumen",exercises:[
    ["Flachbankdrücken",3,"10",50],["Butterfly oder Kabel-Flys",3,"10",35],["Latzug breit",3,"10",50],
    ["Kabelrudern",3,"10",45],["Reverse Butterfly",3,"10",25],["Seitheben",3,"10",8],
    ["Overhead Trizeps Kabel",3,"10",20],["Hammercurls",3,"10",12]
  ]}
];

const RUNS = [
  {day:2,dayName:"Dienstag",time:"07:00",title:"Intervalle 5–10 km"},
  {day:5,dayName:"Freitag",time:"07:00",title:"Tempolauf"},
  {day:6,dayName:"Samstag",time:"07:00",title:"Lockerer Lauf"}
];

const historyKey = "reppilot-history-v4"; // Bestehenden Verlauf weiterverwenden
const FIXED_REPS = 10;
let active = null;
let exerciseIndex = 0;
let setIndex = 0;
let phase = "set";
const $ = id => document.getElementById(id);

function history(){
  try{return JSON.parse(localStorage.getItem(historyKey) || "[]")}catch{return []}
}
function save(items){localStorage.setItem(historyKey,JSON.stringify(items))}
function toNumber(value){
  const parsed = Number(String(value).replace(",","."));
  return Number.isFinite(parsed) ? parsed : 0;
}
function formatKg(value){
  return new Intl.NumberFormat("de-DE",{maximumFractionDigits:1}).format(value);
}
function nextWorkout(){
  const today = new Date().getDay();
  return WORKOUTS.map(w=>({...w,delta:(w.day-today+7)%7})).sort((a,b)=>a.delta-b.delta)[0];
}
function lastExercise(name){
  const items = history();
  for(let i=items.length-1;i>=0;i--){
    const found = items[i].exercises?.find(x=>x.name===name);
    if(found)return found;
  }
  return null;
}
function lastWeight(name, fallback){
  const previous = lastExercise(name);
  const completed = previous?.sets?.filter(s=>s.done).reverse().find(s=>Number.isFinite(toNumber(s.weight)));
  return completed ? toNumber(completed.weight) : fallback;
}
function workoutVolume(workout){
  return workout.exercises.reduce((sum,e)=>sum + exerciseVolume(e),0);
}
function exerciseVolume(exercise){
  return exercise.sets.reduce((sum,set)=>{
    if(!set.done)return sum;
    const reps = Number(set.reps) || FIXED_REPS;
    return sum + toNumber(set.weight) * reps;
  },0);
}
function renderHome(){
  const next = nextWorkout();
  $("nextTitle").textContent = next.title;
  $("nextMeta").textContent = `${next.dayName}, ${next.time} Uhr`;
  $("startBtn").onclick = ()=>start(next.id);
  $("plan").innerHTML = [...WORKOUTS,...RUNS].sort((a,b)=>a.day-b.day).map(item=>`
    <article class="plan-item">
      <div class="plan-day">${item.dayName}</div>
      <div><h3>${item.title}</h3><p>${item.time} Uhr</p></div>
    </article>`).join("");
}
function start(id){
  const workout = WORKOUTS.find(x=>x.id===id);
  active = {
    id:workout.id,
    title:workout.title,
    startedAt:new Date().toISOString(),
    exercises:workout.exercises.map(([name,setCount,repRange,defaultWeight])=>({
      name,
      repRange,
      skippedCount:0,
      sets:Array.from({length:setCount},(_,i)=>({
        index:i+1,
        weight:lastWeight(name,defaultWeight),
        reps:FIXED_REPS,
        done:false
      }))
    }))
  };
  exerciseIndex = 0;
  setIndex = 0;
  phase = "set";
  renderWorkout();
  show("workout");
}
function currentExercise(){return active.exercises[exerciseIndex]}
function renderWorkout(){
  if(!active)return;
  $("workoutTitle").textContent = active.title;
  $("counter").textContent = `Übung ${exerciseIndex+1} von ${active.exercises.length}`;
  $("bar").style.width = `${((exerciseIndex + (phase==="complete"?1:0))/active.exercises.length)*100}%`;
  $("setPanel").hidden = phase !== "set";
  $("completePanel").hidden = phase !== "complete";
  if(phase === "set") renderSet(); else renderComplete();
}
function renderSet(){
  const exercise = currentExercise();
  const set = exercise.sets[setIndex];
  $("exerciseName").textContent = exercise.name;
  $("setCounter").textContent = `Satz ${setIndex+1} von ${exercise.sets.length}`;
  $("fixedReps").textContent = `${FIXED_REPS} Wiederholungen`;
  $("weightInput").value = set.weight;
  $("previousSet").hidden = setIndex === 0;
  if(setIndex>0){
    const previous = exercise.sets[setIndex-1];
    $("previousSet").textContent = `Letzter Satz: ${formatKg(toNumber(previous.weight))} kg × ${previous.reps || FIXED_REPS}`;
  }
  $("completeSetBtn").textContent = setIndex === exercise.sets.length-1 ? "Letzten Satz abschließen" : "Satz abschließen";
  setTimeout(()=>$("weightInput").focus(),50);
}
function completeSet(){
  const exercise = currentExercise();
  const set = exercise.sets[setIndex];
  const weight = toNumber($("weightInput").value);
  if(weight < 0 || $("weightInput").value.trim()===""){
    $("weightInput").focus();
    return;
  }
  set.weight = weight;
  set.reps = FIXED_REPS;
  set.done = true;
  if(setIndex < exercise.sets.length-1){
    setIndex++;
    exercise.sets[setIndex].weight = weight;
    renderWorkout();
  }else{
    phase = "complete";
    renderWorkout();
  }
}
function renderComplete(){
  const finished = currentExercise();
  const volume = exerciseVolume(finished);
  $("completedExercise").textContent = finished.name;
  $("exerciseSummary").textContent = `${finished.sets.length} Sätze · ${formatKg(volume)} kg bewegt`;
  const hasNext = exerciseIndex < active.exercises.length-1;
  $("nextExerciseBlock").hidden = !hasNext;
  $("finishWorkoutBlock").hidden = hasNext;
  if(hasNext){
    const next = active.exercises[exerciseIndex+1];
    $("nextExerciseName").textContent = next.name;
    $("nextExerciseMeta").textContent = `${next.sets.length} Sätze · jeweils ${FIXED_REPS} Wiederholungen`;
    $("startNextBtn").textContent = "Nächste Übung starten";
    const canSkip = exerciseIndex+2 < active.exercises.length;
    $("skipNextBtn").disabled = !canSkip;
    $("skipNextBtn").textContent = canSkip ? "Gerät besetzt – überspringen" : "Keine weitere Übung zum Tauschen";
  }else{
    $("workoutVolumePreview").textContent = `${formatKg(workoutVolume(active))} kg Gesamtgewicht`;
  }
}
function startNextExercise(){
  if(exerciseIndex >= active.exercises.length-1)return;
  exerciseIndex++;
  setIndex = 0;
  phase = "set";
  renderWorkout();
  window.scrollTo({top:0,behavior:"smooth"});
}
function skipNextExercise(){
  const nextIndex = exerciseIndex+1;
  if(nextIndex+1 >= active.exercises.length)return;
  active.exercises[nextIndex].skippedCount = (active.exercises[nextIndex].skippedCount || 0) + 1;
  [active.exercises[nextIndex],active.exercises[nextIndex+1]] = [active.exercises[nextIndex+1],active.exercises[nextIndex]];
  renderComplete();
}
function finish(){
  active.finishedAt = new Date().toISOString();
  const items = history();
  items.push(active);
  save(items);
  active = null;
  renderHistory();
  show("history");
}
function renderHistory(){
  const items = history().slice().reverse();
  $("historyList").innerHTML = items.length ? items.map((workout,workoutIndex)=>{
    const date = new Date(workout.finishedAt || workout.startedAt).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"});
    const sets = workout.exercises?.reduce((sum,e)=>sum+(e.sets?.filter(s=>s.done).length||0),0) || 0;
    const volume = workoutVolume(workout);
    const details = workout.exercises?.map(exercise=>{
      const doneSets = exercise.sets?.filter(s=>s.done).length || 0;
      if(!doneSets)return "";
      return `<li><span>${exercise.name}</span><strong>${formatKg(exerciseVolume(exercise))} kg</strong></li>`;
    }).join("") || "";
    return `<details class="history-item" ${workoutIndex===0?"open":""}>
      <summary>
        <div><h3>${workout.title}</h3><p>${date} · ${sets} Sätze</p></div>
        <div class="volume"><small>Bewegtes Gewicht</small><strong>${formatKg(volume)} kg</strong></div>
      </summary>
      <ul class="exercise-history">${details}</ul>
    </details>`;
  }).join("") : `<div class="empty">Noch keine Trainings gespeichert.</div>`;
}
function show(id){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  $(id).classList.add("active");
  document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===id));
}

$("completeSetBtn").onclick = completeSet;
$("weightInput").addEventListener("keydown",event=>{if(event.key==="Enter")completeSet()});
$("startNextBtn").onclick = startNextExercise;
$("skipNextBtn").onclick = skipNextExercise;
$("finishWorkoutBtn").onclick = finish;
$("cancelBtn").onclick = ()=>{
  if(confirm("Training wirklich abbrechen?")){
    active = null;
    show("home");
  }
};
document.querySelectorAll("nav button").forEach(button=>button.onclick=()=>{
  if(active && button.dataset.view!=="workout"){
    if(!confirm("Das laufende Training wird abgebrochen. Fortfahren?"))return;
    active = null;
  }
  show(button.dataset.view);
});

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
}
renderHome();
renderHistory();
