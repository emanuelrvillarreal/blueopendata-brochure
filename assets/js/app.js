/* Brochure online · Blue Open Data
   Navegación entre la bienvenida y cada brochure (por #ancla), índice de capítulos y copiar mail.
   Para sumar una solución nueva: agregala en SOLS (clave = id del #ancla) y creá su <article data-sol="..."> en index.html. */
(function(){
  var SOLS={software:'Desarrollo de software',logistica:'Logística','sector-publico':'Sector público','b-sports':'B-Sports',meditory:'Meditory','scan-ai':'Scan AI','b-points':'B-Points'};
  var home=document.getElementById('home'),reader=document.getElementById('reader'),toc=document.getElementById('toc'),rTitle=document.getElementById('rTitle'),prog=document.getElementById('prog'),moreNav=document.getElementById('moreNav'),fin=document.getElementById('fin');
  var chapters=[];

  function route(){
    var k=(location.hash||'').slice(1);
    if(!SOLS[k]){showHome();return}
    showSol(k);
  }
  function showHome(){
    reader.hidden=true;home.hidden=false;document.title='Brochure Blue Open Data';window.scrollTo(0,0);
  }
  function showSol(k){
    home.hidden=true;reader.hidden=false;
    document.querySelectorAll('article[data-sol]').forEach(function(a){a.hidden=a.dataset.sol!==k});
    rTitle.textContent=SOLS[k];
    var art=document.querySelector('article[data-sol="'+k+'"]');
    chapters=[].slice.call(art.querySelectorAll('section[data-ch]')).concat([fin]);
    toc.textContent='';
    chapters.forEach(function(s,i){
      var b=document.createElement('button');b.type='button';
      var n=document.createElement('b');n.textContent=String(i+1).padStart(2,'0');
      b.appendChild(n);b.appendChild(document.createTextNode(s.dataset.ch));
      b.addEventListener('click',function(){s.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});
      toc.appendChild(b);
    });
    moreNav.textContent='';
    Object.keys(SOLS).forEach(function(o){if(o===k)return;var a=document.createElement('a');a.href='#'+o;a.textContent=SOLS[o];moreNav.appendChild(a)});
    var all=document.createElement('a');all.href='#inicio';all.textContent='Ver todas las soluciones';moreNav.appendChild(all);
    window.scrollTo(0,0);
    onScroll();
  }
  function setCurrent(i){
    [].forEach.call(toc.children,function(b,j){b.setAttribute('aria-current',j===i)});
    var b=toc.children[i];if(b){var w=toc;var l=b.offsetLeft-w.clientWidth/2+b.clientWidth/2;w.scrollTo({left:l})}
  }
  function onScroll(){
    if(reader.hidden)return;
    var h=document.documentElement,max=h.scrollHeight-h.clientHeight;prog.style.width=(max>0?Math.min(100,h.scrollTop/max*100):0)+'%';
    var y=150,cur=0;chapters.forEach(function(s,i){if(s.getBoundingClientRect().top<=y)cur=i});
    if(max-h.scrollTop<4)cur=chapters.length-1;
    setCurrent(cur);
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('hashchange',route);
  // índice sin barra visible: la rueda del mouse lo desplaza en horizontal
  toc.addEventListener('wheel',function(e){
    if(toc.scrollWidth<=toc.clientWidth||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
    e.preventDefault();toc.scrollLeft+=e.deltaY;
  },{passive:false});
  document.querySelector('[data-tocontact]').addEventListener('click',function(e){e.preventDefault();fin.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});
  document.getElementById('copyMail').addEventListener('click',function(){
    var b=this,t='comercial@blueopendata.com';
    function sel(){var r=document.createRange();r.selectNodeContents(document.getElementById('mail'));var s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Seleccionado'}
    try{navigator.clipboard.writeText(t).then(function(){b.textContent='Copiado'},sel)}catch(e){sel()}
    setTimeout(function(){b.textContent='Copiar email'},2200);
  });
  route();
})();
