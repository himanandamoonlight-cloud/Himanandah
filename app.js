(function(){
  function qs(s){return document.querySelector(s)}
  function qsa(s){return Array.from(document.querySelectorAll(s))}

  // Countdown utilities
  var countdownEl = qs('#countdown');
  function nextSession(now){
    var y=now.getFullYear(), m=now.getMonth(), d=now.getDate();
    function dt(h,min){return new Date(y,m,d,h,min,0,0);}
    var morning = dt(5,30), evening = dt(18,0);
    if(now<=morning) return morning;
    if(now<=evening) return evening;
    return new Date(y,m,d+1,5,30,0,0);
  }
  function pad(n){return n<10? '0'+n: n}
  function updateCountdown(){
    var now = new Date();
    var next = nextSession(now);
    var diff = next - now;
    if(diff <= 0){
      countdownEl.textContent = 'Live — tap to join';
      playChime();
      return;
    }
    var s = Math.floor(diff/1000);
    var h = Math.floor(s/3600); s%=3600;
    var m = Math.floor(s/60); s%=60;
    countdownEl.textContent = 'Next session in ' + (h? h+'h ':'') + (m? m+'m ':'') + (s? s+'s':'');
  }
  updateCountdown();
  setInterval(updateCountdown,1000);

  // gentle chime
  var lastChime=0;
  function playChime(){
    var now = Date.now();
    if(now - lastChime < 60000) return;
    lastChime = now;
    try{
      var ctx = new (window.AudioContext||window.webkitAudioContext)();
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type='sine'; o.frequency.value=523.25;
      g.gain.value=0.0001; o.connect(g); g.connect(ctx.destination);
      o.start();
      g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02);
      setTimeout(function(){ g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2); o.stop(ctx.currentTime + 1.25); }, 800);
    }catch(e){}
  }

  // Wisdom overlay placeholders
  var overlay = qs('#wisdomOverlay'), openWisdom = qs('#openWisdom'), closeWisdom = qs('#closeWisdom'), notesArea = qs('#notesArea');
  function makeNotes(){
    notesArea.innerHTML='';
    for(var i=0;i<8;i++){
      var n=document.createElement('div'); n.className='sticky empty'; n.innerHTML='<div style="opacity:0.45">Blank note</div>';
      notesArea.appendChild(n);
    }
  }
  makeNotes();
  openWisdom && openWisdom.addEventListener('click', function(){ overlay.style.display='flex'; overlay.setAttribute('aria-hidden','false'); });
  closeWisdom && closeWisdom.addEventListener('click', function(){ overlay.style.display='none'; overlay.setAttribute('aria-hidden','true'); });

  qs('#card-wisdom') && qs('#card-wisdom').addEventListener('click', function(){ overlay.style.display='flex'; overlay.setAttribute('aria-hidden','false'); });

  // Chatbot
  var chatToggle = qs('#chatToggle'), chatWindow = qs('#chatWindow'), closeChat = qs('#closeChat'), chatBody = qs('#chatBody'), chatForm = qs('#chatForm'), chatInput = qs('#chatInput');
  var botPhrases = [
    "Breathe... gently. What is present right now?",
    "You are welcomed. Tell me what you are feeling, slowly.",
    "Name the feeling. Breathe with it. Let it soften.",
    "Try this: inhale 4, hold 2, exhale 6. Repeat slowly."
  ];
  function addBot(msg){ var d=document.createElement('div'); d.className='chat-msg bot'; d.textContent=msg; chatBody.appendChild(d); chatBody.scrollTop=chatBody.scrollHeight; }
  function addUser(msg){ var d=document.createElement('div'); d.className='chat-msg user'; d.textContent=msg; chatBody.appendChild(d); chatBody.scrollTop=chatBody.scrollHeight; }
  chatToggle.addEventListener('click', function(){ if(chatWindow.style.display==='flex'){ chatWindow.style.display='none'; } else { chatWindow.style.display='flex'; addBot("Namaste. I am the Himānandaḥ Companion — a gentle guide."); } });
  closeChat.addEventListener('click', function(){ chatWindow.style.display='none'; });
  chatForm.addEventListener('submit', function(e){ e.preventDefault(); var v=chatInput.value.trim(); if(!v) return; addUser(v); setTimeout(function(){ var r = botPhrases[Math.floor(Math.random()*botPhrases.length)]; if(v.toLowerCase().includes('sad')) r='I hear sadness. Breathe with it.'; else if(v.toLowerCase().includes('angry')) r='Anger is a fierce teacher. Breathe soft.'; addBot(r); chatInput.value=''; },700); });

  // small interactions
  qs('#openMindSample') && qs('#openMindSample').addEventListener('click', function(){ alert('Pause. Take three slow breaths. Notice the body.'); });

  // open soul click behaviour: open Naam Jap now or show info
  qs('#card-soul') && qs('#card-soul').addEventListener('click', function(){
    var now = new Date();
    var next = nextSession(now = now);
    // if within 1 hour of next session, open link; otherwise inform and open
    var diff = next - (new Date());
    if(diff <= 0 || diff < 60*60*1000){
      window.open('https://www.youtube.com/watch?v=xy2xoI3SUWk&list=LL&index=48','_blank');
    } else {
      if(confirm('Naam Jap is scheduled at 5:30 AM and 6:00 PM. Open the chant now?')){
        window.open('https://www.youtube.com/watch?v=xy2xoI3SUWk&list=LL&index=48','_blank');
      }
    }
  });

})();