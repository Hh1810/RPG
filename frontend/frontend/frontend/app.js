// app.js - frontend MVP for RPG Learning Platform
// NOTE: Replace firebaseConfig with your project config
const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_AUTH_DOMAIN",
projectId: "YOUR_PROJECT_ID",
};


firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


// Elements
const displayNameEl = document.getElementById('displayName');
const levelEl = document.getElementById('level');
const xpBarEl = document.getElementById('xpBar');
const startQuestsBtn = document.getElementById('startQuestsBtn');
const dailyQuestsEl = document.getElementById('dailyQuests');
const questPage = document.getElementById('questPage');
const dashboard = document.getElementById('dashboard');
const questArea = document.getElementById('questArea');
const submitAnswerBtn = document.getElementById('submitAnswerBtn');
const backBtn = document.getElementById('backBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');


let currentUser = null;
let currentQuests = [];
let currentQuestIndex = 0;


function xpToLevel(xp){
return Math.floor(Math.sqrt(xp/100)) + 1;
}


function updateLocalProfileUI(profile){
displayNameEl.textContent = profile.displayName || '冒險者';
levelEl.textContent = profile.level || 1;
const xp = profile.xp || 0;
const pct = Math.min(100, ((xp % 1000) / 10));
xpBarEl.style.width = pct + '%';
}


// login (簡單示範：匿名登入)
loginBtn.addEventListener('click', async ()=>{
try{
const cred = await auth.signInAnonymously();
console.log('signed in', cred.user.uid);
loginBtn.style.display = 'none';
logoutBtn.style.display = 'inline-block';
