const sheets=[...document.querySelectorAll('.sheet')];
const dots=[...document.querySelectorAll('.dot')];
const prev=document.getElementById('prev');
const next=document.getElementById('next');
const pageNumber=document.getElementById('pageNumber');
let current=0;
function showSheet(n){
  current=Math.max(0,Math.min(2,n));
  sheets.forEach((sheet,i)=>sheet.classList.toggle('active',i===current));
  dots.forEach((dot,i)=>dot.classList.toggle('active',i===current));
  prev.disabled=current===0;
  next.disabled=current===2;
  pageNumber.textContent=String(current+1);
  window.scrollTo({top:0,behavior:'smooth'});
}
prev.addEventListener('click',()=>showSheet(current-1));
next.addEventListener('click',()=>showSheet(current+1));
dots.forEach(dot=>dot.addEventListener('click',()=>showSheet(Number(dot.dataset.go))));
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowLeft')showSheet(current-1);
  if(e.key==='ArrowRight')showSheet(current+1);
});
let touchStart=0;
document.addEventListener('touchstart',e=>{touchStart=e.changedTouches[0].screenX},{passive:true});
document.addEventListener('touchend',e=>{
  const delta=e.changedTouches[0].screenX-touchStart;
  if(Math.abs(delta)>65)showSheet(current+(delta<0?1:-1));
},{passive:true});


// Música de fondo: intenta comenzar automáticamente al abrir la invitación.
const backgroundMusic=document.getElementById('backgroundMusic');
const musicToggle=document.getElementById('musicToggle');
function updateMusicButton(playing){
  musicToggle.textContent=playing?'♫ Pausar música':'♫ Activar música';
  musicToggle.setAttribute('aria-label',playing?'Pausar música':'Activar música');
  musicToggle.setAttribute('aria-pressed',String(playing));
}
async function playBackgroundMusic(){
  try{
    await backgroundMusic.play();
    updateMusicButton(true);
  }catch(error){
    // Si el navegador bloquea la reproducción automática, queda lista
    // para iniciar en cuanto el visitante toque la invitación.
    updateMusicButton(false);
  }
}

// Intento inmediato al cargar la página (el navegador puede exigir interacción).
window.addEventListener('DOMContentLoaded',playBackgroundMusic,{once:true});

// Respaldo para navegadores que bloquean el autoplay con sonido.
document.addEventListener('pointerdown',event=>{
  if(event.target.closest('#musicToggle')) return;
  if(backgroundMusic.paused) playBackgroundMusic();
});
musicToggle.addEventListener('click',async()=>{
  if(backgroundMusic.paused){
    await playBackgroundMusic();
  }else{
    backgroundMusic.pause();
    updateMusicButton(false);
  }
});
backgroundMusic.addEventListener('play',()=>updateMusicButton(true));
backgroundMusic.addEventListener('pause',()=>updateMusicButton(false));
