const WORKOUTS = [
  {id:"upper-heavy",day:1,dayName:"Montag",time:"16:00",title:"Oberkörper schwer",type:"strength",exercises:[
    ["Schrägbankdrücken",4,"10",60,"incline-bench"],["Brustpresse",3,"10",50,"chest-press"],["Brustgestütztes Rudern",4,"10",50,"row-machine"],
    ["Latzug neutral",3,"10",55,"lat-pulldown"],["Schulterpresse",3,"10",35,"shoulder-press"],["Seitheben Kabel",3,"10",7.5,"cable"],
    ["Face Pulls",3,"10",20,"rope-cable"],["Shrugs",3,"10",60,"barbell"],["Trizepsdrücken Seil",3,"10",25,"rope-cable"],
    ["Kabelcurls",3,"10",20,"cable"],["Hanging Leg Raises",3,"10",0,"pullup-station"]
  ]},
  {id:"lower-heavy",day:3,dayName:"Mittwoch",time:"16:00",title:"Unterkörper",type:"strength",exercises:[
    ["Beinpresse",4,"10",120,"leg-press"],["Rumänisches Kreuzheben",4,"10",60,"barbell"],["Beinstrecker",3,"10",40,"leg-extension"],
    ["Wadenheben",4,"10",60,"calf-machine"],["Adduktoren",2,"10",40,"hip-machine"],["Abduktoren",2,"10",40,"hip-machine"],
    ["Crunch-Maschine",3,"10",30,"ab-machine"]
  ]},
  {id:"upper-volume",day:5,dayName:"Freitag",time:"16:00",title:"Oberkörper Volumen",type:"strength",exercises:[
    ["Flachbankdrücken",3,"10",50,"flat-bench"],["Butterfly oder Kabel-Flys",3,"10",35,"pec-deck"],["Latzug breit",3,"10",50,"lat-pulldown"],
    ["Kabelrudern",3,"10",45,"seated-row"],["Reverse Butterfly",3,"10",25,"reverse-pec-deck"],["Seitheben",3,"10",8,"dumbbells"],
    ["Overhead Trizeps Kabel",3,"10",20,"rope-cable"],["Hammercurls",3,"10",12,"dumbbells"]
  ]}
];

const WEEK = [
  {day:1,dayName:"Montag",title:"Oberkörper schwer",type:"strength",workoutId:"upper-heavy",meta:"Krafttraining"},
  {day:2,dayName:"Dienstag",title:"Intervalltraining Laufband",type:"run",runId:"interval-treadmill",meta:"37 Minuten · 1 % Steigung"},
  {day:3,dayName:"Mittwoch",title:"Unterkörper",type:"strength",workoutId:"lower-heavy",meta:"Krafttraining"},
  {day:4,dayName:"Donnerstag",title:"Lockerer Dauerlauf",type:"run",meta:"Ruhiges Tempo · ohne Zeitdruck"},
  {day:5,dayName:"Freitag",title:"Oberkörper Volumen",type:"strength",workoutId:"upper-volume",meta:"Krafttraining"},
  {day:6,dayName:"Samstag",title:"Rest Day",type:"rest",meta:"Erholung, Spaziergang oder Mobility"},
  {day:0,dayName:"Sonntag",title:"Rest Day",type:"rest",meta:"Erholung und Vorbereitung auf Montag"}
];

const RUN_PLANS = {
  "interval-treadmill":{
    title:"Intervalltraining Laufband",
    meta:"37 Minuten · Laufband auf 1 % Steigung stellen",
    intro:"Die schnellen Abschnitte liegen knapp über deinem Zieltempo für 6 km unter 35 Minuten. Ändere die Geschwindigkeit am Laufband jeweils direkt beim Wechsel.",
    steps:[
      {title:"Einlaufen",duration:"8 Minuten",speed:"7,0–7,5 km/h"},
      {title:"Schnelles Intervall",duration:"6 × 2 Minuten",speed:"10,5 km/h"},
      {title:"Lockere Pause",duration:"Nach jedem Intervall 2 Minuten",speed:"7,0–7,5 km/h"},
      {title:"Auslaufen",duration:"5 Minuten",speed:"6,0–6,5 km/h"}
    ],
    note:"Wenn du alle sechs schnellen Intervalle sauber schaffst, erhöhst du beim nächsten Mal auf 10,7 km/h. Nicht gleichzeitig Dauer und Geschwindigkeit steigern."
  }
};

const TECHNIQUE_TIPS = {
  "Schrägbankdrücken":"Schulterblätter hinten lassen und Brust stolz halten.",
  "Brustpresse":"Nicht komplett durchdrücken, Spannung halten.",
  "Brustgestütztes Rudern":"Mit den Ellenbogen ziehen, nicht mit den Händen.",
  "Latzug neutral":"Zur oberen Brust ziehen, nicht in den Nacken.",
  "Schulterpresse":"Bauch fest halten und kein Hohlkreuz machen.",
  "Seitheben Kabel":"Ellenbogen führen und die Schulter unten lassen.",
  "Face Pulls":"Zum Gesicht ziehen und die Hände nach außen führen.",
  "Shrugs":"Schultern gerade hochziehen, nicht kreisen.",
  "Trizepsdrücken Seil":"Oberarme ruhig am Körper lassen.",
  "Kabelcurls":"Ellenbogen am Körper lassen und nicht schwingen.",
  "Hanging Leg Raises":"Langsam absenken und nicht ins Schwingen kommen.",
  "Beinpresse":"Knie folgen den Fußspitzen und fallen nicht nach innen.",
  "Rumänisches Kreuzheben":"Rücken neutral halten und Hüfte nach hinten schieben.",
  "Beinstrecker":"Beine oben nicht komplett durchstrecken.",
  "Wadenheben":"Oben kurz halten und unten vollständig dehnen.",
  "Adduktoren":"Langsam schließen und kontrolliert zurückführen.",
  "Abduktoren":"Ohne Schwung nach außen drücken.",
  "Crunch-Maschine":"Aus dem Bauch einrollen, nicht mit den Armen ziehen.",
  "Flachbankdrücken":"Schulterblätter hinten lassen und Füße fest aufstellen.",
  "Butterfly oder Kabel-Flys":"Ellenbogen leicht gebeugt lassen und kontrolliert schließen.",
  "Latzug breit":"Zur oberen Brust ziehen und nicht nach hinten lehnen.",
  "Kabelrudern":"Brust raus und Schulterblätter zusammenziehen.",
  "Reverse Butterfly":"Aus der hinteren Schulter arbeiten, nicht aus dem Nacken.",
  "Seitheben":"Ellenbogen führen und nicht über Schulterhöhe heben.",
  "Overhead Trizeps Kabel":"Ellenbogen eng neben dem Kopf halten.",
  "Hammercurls":"Handgelenke gerade halten und nicht schwingen."
};

function techniqueTip(name){
  return TECHNIQUE_TIPS[name] || "Bewegung ruhig und kontrolliert ausführen.";
}

const historyKey = "reppilot-history-v4";
const FIXED_REPS = 10;
const REST_SECONDS = 90;
let active = null;
let exerciseIndex = 0;
let setIndex = 0;
let phase = "set";
let restTimerId = null;
let restEndsAt = 0;
let restTotalSeconds = REST_SECONDS;
let afterRest = null;
let lastCompletedSet = null;
let audioContext = null;
const $ = id => document.getElementById(id);

function getHistory(){
  try{return JSON.parse(localStorage.getItem(historyKey) || "[]")}catch{return []}
}
function saveHistory(items){localStorage.setItem(historyKey,JSON.stringify(items))}
function toNumber(value){
  const parsed = Number(String(value).replace(",","."));
  return Number.isFinite(parsed) ? parsed : 0;
}
function formatKg(value){
  return new Intl.NumberFormat("de-DE",{maximumFractionDigits:1}).format(value);
}
function formatDate(value){
  const date = new Date(value);
  if(Number.isNaN(date.getTime()))return "Datum unbekannt";
  return date.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"});
}
function todayPlan(){
  const day = new Date().getDay();
  return WEEK.find(item=>item.day===day) || WEEK[0];
}
function nextStrengthDay(){
  const today = new Date().getDay();
  return WORKOUTS.map(w=>({...w,delta:(w.day-today+7)%7 || 7})).sort((a,b)=>a.delta-b.delta)[0];
}
function lastWeightRecord(name, fallback){
  const items = getHistory();
  for(let i=items.length-1;i>=0;i--){
    const exercise = items[i].exercises?.find(x=>x.name===name);
    const completed = exercise?.sets?.slice().reverse().find(set=>{
      const raw = String(set.weight ?? "").replace(",",".").trim();
      return set.done && raw !== "" && Number.isFinite(Number(raw));
    });
    if(completed){
      return {
        exists:true,
        weight:toNumber(completed.weight),
        date:items[i].finishedAt || items[i].startedAt
      };
    }
  }
  return {exists:false,weight:fallback,date:null};
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
function iconKeyForName(name=""){
  const value = name.toLowerCase();
  if(value.includes("schrägbank"))return "incline-bench";
  if(value.includes("flachbank"))return "flat-bench";
  if(value.includes("brustpresse"))return "chest-press";
  if(value.includes("brustgestützt"))return "row-machine";
  if(value.includes("latzug"))return "lat-pulldown";
  if(value.includes("schulterpresse"))return "shoulder-press";
  if(value.includes("face pull") || value.includes("trizeps") || value.includes("overhead"))return "rope-cable";
  if(value.includes("kabelrudern"))return "seated-row";
  if(value.includes("kabel") || value.includes("seitheben kabel"))return "cable";
  if(value.includes("shrug") || value.includes("kreuzheben"))return "barbell";
  if(value.includes("hanging"))return "pullup-station";
  if(value.includes("beinpresse"))return "leg-press";
  if(value.includes("beinstrecker"))return "leg-extension";
  if(value.includes("waden"))return "calf-machine";
  if(value.includes("addukt") || value.includes("abdukt"))return "hip-machine";
  if(value.includes("crunch"))return "ab-machine";
  if(value.includes("reverse butterfly"))return "reverse-pec-deck";
  if(value.includes("butterfly"))return "pec-deck";
  if(value.includes("hammer") || value === "seitheben")return "dumbbells";
  return "machine";
}
function equipmentIcon(key, label="Trainingsgerät"){
  const common = `viewBox="0 0 64 64" role="img" aria-label="${label}"`;
  const icons = {
    "incline-bench":`<svg ${common}><path d="M14 48h38M20 45l16-20M31 28l14 8M18 48v7M47 48v7M12 18v30M8 18h8M48 13v24M43 13h10"/><circle cx="22" cy="23" r="3"/><path d="M25 25l10 6M34 31l7-10M41 21h9"/></svg>`,
    "flat-bench":`<svg ${common}><path d="M10 47h44M18 43h28M21 43v11M43 43v11M12 19v28M8 19h8M50 19v28M46 19h8"/><circle cx="25" cy="34" r="3"/><path d="M28 34h13M32 30v8M22 34l-5 7"/></svg>`,
    "chest-press":`<svg ${common}><path d="M18 52V17h13v35M18 31h13M31 27h13l6 8M44 27v25M50 35h5M15 52h35"/><circle cx="37" cy="20" r="4"/><path d="M37 24v14M37 29l10 5M37 38l-6 10"/></svg>`,
    "row-machine":`<svg ${common}><path d="M10 51h44M16 47l11-15h20M20 47v5M46 32v20M47 24h8M51 24v12"/><circle cx="29" cy="23" r="4"/><path d="M29 27l5 13M34 32l11-5M34 40l-8 8"/></svg>`,
    "lat-pulldown":`<svg ${common}><path d="M13 55V9h38v46M13 15h38M32 15v13M23 27h18M18 55h28M23 39v16M41 39v16"/><circle cx="32" cy="33" r="4"/><path d="M28 34l-7-6M36 34l7-6M32 37v12"/></svg>`,
    "shoulder-press":`<svg ${common}><path d="M17 53V16h12v37M17 34h12M29 30h17M46 20v33M42 20h8M12 53h39"/><circle cx="36" cy="25" r="4"/><path d="M36 29v13M36 33l-8-8M36 33l9-8M28 25h-6M45 25h7"/></svg>`,
    "cable":`<svg ${common}><path d="M13 55V9h14v46M37 55V9h14v46M13 15h38M20 15v12M44 15v12M20 27l10 12M44 27L34 39M30 39h4M18 55h35"/><circle cx="32" cy="43" r="3"/></svg>`,
    "rope-cable":`<svg ${common}><path d="M16 55V9h32v46M16 15h32M32 15v20M27 35c0 6-6 7-6 13M37 35c0 6 6 7 6 13M18 55h31"/><circle cx="21" cy="50" r="3"/><circle cx="43" cy="50" r="3"/></svg>`,
    "barbell":`<svg ${common}><path d="M8 32h48M15 23v18M20 20v24M44 20v24M49 23v18"/></svg>`,
    "pullup-station":`<svg ${common}><path d="M14 56V9M50 56V9M14 13h36M8 13h12M44 13h12M21 56h-9M52 56h-9"/><circle cx="32" cy="23" r="4"/><path d="M32 27v15M32 30L20 18M32 30l12-12M32 42l-7 11M32 42l7 11"/></svg>`,
    "leg-press":`<svg ${common}><path d="M10 53h44M15 50l17-25h17M22 50v4M49 25v29M41 15l12 9M43 12l13 10"/><circle cx="29" cy="31" r="4"/><path d="M26 34l-8 10M32 33l10 3M42 36l7-8"/></svg>`,
    "leg-extension":`<svg ${common}><path d="M14 53h38M19 49V18h14v31M19 34h14M33 34h12v15M45 45h9"/><circle cx="38" cy="25" r="4"/><path d="M38 29v12M38 35l10 7M48 42h7"/></svg>`,
    "calf-machine":`<svg ${common}><path d="M16 54V12h28v42M16 18h28M22 54h28M50 40v14M28 25h12"/><circle cx="34" cy="31" r="4"/><path d="M34 35v12M34 39l-9-8M34 47l8 5"/></svg>`,
    "hip-machine":`<svg ${common}><path d="M12 53h40M17 49V18h12v31M17 34h12M29 39h19M48 31v18"/><circle cx="37" cy="27" r="4"/><path d="M37 31v11M37 37l-10 8M37 37l10 8"/></svg>`,
    "ab-machine":`<svg ${common}><path d="M13 53h40M18 49V17h13v32M18 33h13M31 38h16M47 31v18"/><circle cx="38" cy="25" r="4"/><path d="M38 29l-5 11M33 40l10 7M38 31l8 4"/></svg>`,
    "pec-deck":`<svg ${common}><path d="M13 54V13h38v41M13 19h38M21 54V38M43 54V38M17 54h31"/><circle cx="32" cy="29" r="4"/><path d="M32 33v13M32 36l-12-7M32 36l12-7M20 25v10M44 25v10"/></svg>`,
    "reverse-pec-deck":`<svg ${common}><path d="M13 54V13h38v41M13 19h38M21 54V38M43 54V38M17 54h31"/><circle cx="32" cy="29" r="4"/><path d="M32 33v13M32 36L18 41M32 36l14 5M17 36v10M47 36v10"/></svg>`,
    "seated-row":`<svg ${common}><path d="M10 52h44M16 48h18M20 48v5M47 20v32M43 20h8M34 35h12"/><circle cx="28" cy="29" r="4"/><path d="M28 33l4 11M32 36l12-5M32 44l-9 5"/></svg>`,
    "dumbbells":`<svg ${common}><path d="M10 25v14M15 21v22M20 27h24M44 21v22M49 25v14"/></svg>`,
    "machine":`<svg ${common}><path d="M14 54V10h36v44M14 17h36M21 54V38h22v16M19 54h27"/><circle cx="32" cy="29" r="5"/></svg>`
  };
  return `<span class="equipment-icon" aria-hidden="false">${icons[key] || icons.machine}</span>`;
}
function iconFor(type){
  if(type==="run")return "🏃";
  if(type==="rest")return "😴";
  return "🏋️";
}
function renderHome(){
  const today = todayPlan();
  $("todayIcon").textContent = iconFor(today.type);
  $("todayLabel").textContent = `Heute ist ${today.dayName}`;
  $("nextTitle").textContent = today.title;
  $("nextMeta").textContent = today.meta;

  const startBtn = $("startBtn");
  const todayHint = $("todayHint");
  if(today.type === "strength"){
    startBtn.hidden = false;
    startBtn.textContent = "Training starten";
    startBtn.onclick = ()=>start(today.workoutId);
    todayHint.textContent = "";
  }else if(today.type === "run" && today.runId){
    startBtn.hidden = false;
    startBtn.textContent = "Laufplan anzeigen";
    startBtn.onclick = ()=>openRunPlan(today.runId);
    todayHint.textContent = "Geschwindigkeiten und Intervalle direkt fürs Laufband.";
  }else if(today.type === "run"){
    startBtn.hidden = true;
    todayHint.textContent = "Heute locker laufen, sodass du dich noch unterhalten könntest.";
  }else{
    startBtn.hidden = true;
    const next = nextStrengthDay();
    todayHint.textContent = `Nächstes Krafttraining: ${next.dayName} – ${next.title}`;
  }

  $("plan").innerHTML = WEEK.slice().sort((a,b)=>((a.day+6)%7)-((b.day+6)%7)).map(item=>{
    const action = item.type === "strength"
      ? `<button class="plan-start" data-workout="${item.workoutId}">Starten</button>`
      : item.runId
        ? `<button class="plan-start plan-run" data-run="${item.runId}">Plan</button>`
        : `<span class="plan-badge ${item.type}">${item.type === "run" ? "Laufen" : "Erholung"}</span>`;
    return `<article class="plan-item ${item.day===new Date().getDay()?"today":""}">
      <div class="plan-icon">${iconFor(item.type)}</div>
      <div class="plan-copy"><div class="plan-day">${item.dayName}</div><h3>${item.title}</h3><p>${item.meta}</p></div>
      ${action}
    </article>`;
  }).join("");

  document.querySelectorAll(".plan-start[data-workout]").forEach(button=>{
    button.onclick = ()=>start(button.dataset.workout);
  });
  document.querySelectorAll(".plan-run").forEach(button=>{
    button.onclick = ()=>openRunPlan(button.dataset.run);
  });
}
function start(id){
  const workout = WORKOUTS.find(x=>x.id===id);
  if(!workout)return;
  active = {
    id:workout.id,
    title:workout.title,
    startedAt:new Date().toISOString(),
    exercises:workout.exercises.map(([name,setCount,repRange,defaultWeight,icon])=>{
      const previous = lastWeightRecord(name,defaultWeight);
      return {
        name,
        icon:icon || iconKeyForName(name),
        repRange,
        skippedCount:0,
        lastTraining:previous.exists ? {weight:previous.weight,date:previous.date} : null,
        sets:Array.from({length:setCount},(_,i)=>({
          index:i+1,
          weight:previous.weight,
          reps:FIXED_REPS,
          done:false
        }))
      };
    })
  };
  exerciseIndex = 0;
  setIndex = 0;
  phase = "set";
  cancelRestTimer();
  lastCompletedSet = null;
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
  $("restPanel").hidden = phase !== "rest";
  $("completePanel").hidden = phase !== "complete";
  if(phase === "set")renderSet();
  else if(phase === "rest")renderRest();
  else renderComplete();
}
function renderSet(){
  const exercise = currentExercise();
  const set = exercise.sets[setIndex];
  $("exerciseName").textContent = exercise.name;
  $("exerciseTip").textContent = techniqueTip(exercise.name);
  $("exerciseIcon").innerHTML = equipmentIcon(exercise.icon || iconKeyForName(exercise.name), exercise.name);
  $("setCounter").textContent = `Satz ${setIndex+1} von ${exercise.sets.length}`;
  $("fixedReps").textContent = `${FIXED_REPS} Wiederholungen`;
  const previous = exercise.lastTraining;
  $("lastTraining").hidden = !previous;
  if(previous){
    $("lastWeightValue").textContent = `${formatKg(previous.weight)} kg`;
    $("lastWeightDate").textContent = `vom ${formatDate(previous.date)}`;
  }
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
  prepareTimerFeedback();
  set.weight = weight;
  set.reps = FIXED_REPS;
  set.done = true;
  lastCompletedSet = {
    exercise:exercise.name,
    number:setIndex+1,
    weight,
    reps:FIXED_REPS
  };
  if(setIndex < exercise.sets.length-1){
    const nextSetIndex = setIndex+1;
    exercise.sets[nextSetIndex].weight = weight;
    beginRest({type:"set",setIndex:nextSetIndex});
  }else{
    beginRest({type:"complete"});
  }
}
function prepareTimerFeedback(){
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if(!AudioContextClass)return;
  if(!audioContext)audioContext = new AudioContextClass();
  if(audioContext.state === "suspended")audioContext.resume().catch(()=>{});
}
function notifyTimerDone(){
  if("vibrate" in navigator)navigator.vibrate([250,120,250]);
  if(!audioContext)return;
  const now = audioContext.currentTime;
  [0,.2].forEach(offset=>{
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(.001,now+offset);
    gain.gain.exponentialRampToValueAtTime(.22,now+offset+.01);
    gain.gain.exponentialRampToValueAtTime(.001,now+offset+.15);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now+offset);
    oscillator.stop(now+offset+.16);
  });
}
function beginRest(next){
  cancelRestTimer();
  afterRest = next;
  restTotalSeconds = REST_SECONDS;
  restEndsAt = Date.now() + REST_SECONDS*1000;
  phase = "rest";
  renderWorkout();
  restTimerId = window.setInterval(updateRestTimer,250);
}
function renderRest(){
  if(lastCompletedSet){
    $("restSetSummary").textContent = `${lastCompletedSet.exercise}: Satz ${lastCompletedSet.number} erledigt · ${formatKg(lastCompletedSet.weight)} kg × ${lastCompletedSet.reps}`;
  }
  if(afterRest?.type === "set"){
    $("restNext").textContent = `Danach: Satz ${afterRest.setIndex+1} von ${currentExercise().sets.length}`;
  }else if(exerciseIndex < active.exercises.length-1){
    $("restNext").textContent = `Danach: ${active.exercises[exerciseIndex+1].name}`;
  }else{
    $("restNext").textContent = "Danach kannst du das Training speichern.";
  }
  updateRestTimer();
}
function updateRestTimer(){
  if(phase !== "rest")return;
  const remaining = Math.max(0,Math.ceil((restEndsAt-Date.now())/1000));
  const minutes = Math.floor(remaining/60);
  const seconds = remaining%60;
  $("restTime").textContent = `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
  $("restClock").setAttribute("aria-label",`Noch ${remaining} Sekunden Pause`);
  const elapsedRatio = Math.min(1,Math.max(0,1-remaining/restTotalSeconds));
  $("restClock").style.setProperty("--rest-progress",`${elapsedRatio*360}deg`);
  if(remaining === 0)finishRest(true);
}
function addRestTime(){
  if(phase !== "rest")return;
  restEndsAt += 30000;
  restTotalSeconds += 30;
  updateRestTimer();
}
function skipRest(){
  if(phase === "rest")finishRest(false);
}
function finishRest(withFeedback){
  const next = afterRest;
  cancelRestTimer();
  if(withFeedback)notifyTimerDone();
  if(next?.type === "set"){
    setIndex = next.setIndex;
    phase = "set";
  }else{
    phase = "complete";
  }
  renderWorkout();
  window.scrollTo({top:0,behavior:"smooth"});
}
function cancelRestTimer(){
  if(restTimerId !== null)window.clearInterval(restTimerId);
  restTimerId = null;
  afterRest = null;
}
function renderComplete(){
  const finished = currentExercise();
  const volume = exerciseVolume(finished);
  $("completedExercise").textContent = finished.name;
  $("completedExerciseIcon").innerHTML = equipmentIcon(finished.icon || iconKeyForName(finished.name), finished.name);
  $("exerciseSummary").textContent = `${finished.sets.length} Sätze · ${formatKg(volume)} kg bewegt`;
  const hasNext = exerciseIndex < active.exercises.length-1;
  $("nextExerciseBlock").hidden = !hasNext;
  $("finishWorkoutBlock").hidden = hasNext;
  if(hasNext){
    const next = active.exercises[exerciseIndex+1];
    $("nextExerciseName").textContent = next.name;
    $("nextExerciseIcon").innerHTML = equipmentIcon(next.icon || iconKeyForName(next.name), next.name);
    $("nextExerciseMeta").textContent = `${next.sets.length} Sätze · jeweils ${FIXED_REPS} Wiederholungen`;
    $("nextExerciseTip").textContent = techniqueTip(next.name);
    const canSkip = exerciseIndex+2 < active.exercises.length;
    $("skipNextBtn").disabled = !canSkip;
    $("skipNextBtn").textContent = canSkip ? "Gerät besetzt – überspringen" : "Keine weitere Übung zum Tauschen";
  }else{
    $("workoutVolumePreview").textContent = `${formatKg(workoutVolume(active))} kg Gesamtgewicht`;
  }
}
function startNextExercise(){
  cancelRestTimer();
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
  cancelRestTimer();
  active.finishedAt = new Date().toISOString();
  const items = getHistory();
  items.push(active);
  saveHistory(items);
  active = null;
  renderHistory();
  renderHome();
  show("history");
}
function renderHistory(){
  const items = getHistory().slice().reverse();
  $("historyList").innerHTML = items.length ? items.map((workout,workoutIndex)=>{
    const date = new Date(workout.finishedAt || workout.startedAt).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"});
    const sets = workout.exercises?.reduce((sum,e)=>sum+(e.sets?.filter(s=>s.done).length||0),0) || 0;
    const volume = workoutVolume(workout);
    const details = workout.exercises?.map(exercise=>{
      const doneSets = exercise.sets?.filter(s=>s.done).length || 0;
      if(!doneSets)return "";
      return `<li><span class="history-exercise-name">${equipmentIcon(exercise.icon || iconKeyForName(exercise.name), exercise.name)}<span>${exercise.name}</span></span><strong>${formatKg(exerciseVolume(exercise))} kg</strong></li>`;
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
function openRunPlan(id){
  const plan = RUN_PLANS[id];
  if(!plan)return;
  $("runTitle").textContent = plan.title;
  $("runMeta").textContent = plan.meta;
  $("runIntro").textContent = plan.intro;
  $("runSteps").innerHTML = plan.steps.map((step,index)=>`
    <article class="run-step">
      <span class="run-step-number">${index+1}</span>
      <div><h3>${step.title}</h3><p>${step.duration}</p></div>
      <div class="run-speed">${step.speed}<small>Geschwindigkeit</small></div>
    </article>`
  ).join("");
  $("runNote").textContent = plan.note;
  show("run");
  window.scrollTo({top:0,behavior:"smooth"});
}
function show(id){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  $(id).classList.add("active");
  document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===id));
}

$("completeSetBtn").onclick = completeSet;
$("weightInput").addEventListener("keydown",event=>{if(event.key==="Enter")completeSet()});
$("addRestBtn").onclick = addRestTime;
$("skipRestBtn").onclick = skipRest;
$("closeRunBtn").onclick = ()=>{renderHome();show("home")};
$("startNextBtn").onclick = startNextExercise;
$("skipNextBtn").onclick = skipNextExercise;
$("finishWorkoutBtn").onclick = finish;
$("cancelBtn").onclick = ()=>{
  if(confirm("Training wirklich abbrechen?")){
    cancelRestTimer();
    active = null;
    show("home");
  }
};
document.querySelectorAll("nav button").forEach(button=>button.onclick=()=>{
  if(active && button.dataset.view!=="workout"){
    if(!confirm("Das laufende Training wird abgebrochen. Fortfahren?"))return;
    cancelRestTimer();
    active = null;
  }
  if(button.dataset.view==="home")renderHome();
  show(button.dataset.view);
});

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
}
renderHome();
renderHistory();
