(() => {
 'use strict';
 const root=document.documentElement;
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 const motionButton=document.querySelector('#motion-toggle');
 let manualMotion=null;
 const reduced=()=>manualMotion===null?preference.matches:manualMotion;
 function updateMotion(){
  const off=reduced();root.dataset.motion=off?'off':'on';
  motionButton.setAttribute('aria-pressed',String(off));motionButton.textContent=off?'Activer les animations':'Réduire les animations';
  if(off){document.querySelectorAll('.sample-plane,.hero-atmosphere img,#gallery-dialog').forEach(el=>el.getAnimations().forEach(animation=>animation.cancel()))}
  updateScroll();
 }
 motionButton.addEventListener('click',()=>{manualMotion=!reduced();updateMotion()});
 preference.addEventListener('change',updateMotion);
 const materials=[
  {name:'Marmorino',file:'004',alt:'Marmorino dans une chambre à Marcory Biétri',tag:'CHAUX & POUDRE DE MARBRE',heading:'La profondeur du minéral.',text:'Des nuances subtiles, une matière vivante et une présence douce. Le Marmorino donne du caractère aux murs de vos espaces de vie.',caption:'Chambre · Marcory, Biétri · 2024'},
  {name:'Béton ciré',file:'007',alt:'Béton ciré sur les murs d’une salle d’eau à Biétri',tag:'CONTINUITÉ & TEXTURE',heading:'Le calme d’une surface continue.',text:'Un rendu contemporain pour les murs, les salles d’eau et les escaliers. La préparation et la protection sont choisies selon le support et son usage.',caption:'Salle d’eau · Marcory, Biétri · 2023'},
  {name:'Stucco effet marbre',file:'017',alt:'Décoration murale en stucco avec veinage effet marbre',tag:'VEINAGE & LUMIÈRE',heading:'Le mouvement de la pierre.',text:'Des veines dessinées, des nuances et des reflets. Le stucco effet marbre apporte une expression singulière aux intérieurs et aux espaces professionnels.',caption:'Particuliers · Yamoussoukro & Gabiadji · 2022'},
  {name:'Pietra Levigata',file:'043',alt:'Pietra Levigata dans un espace de la PISAM à Cocody',tag:'DOUCEUR & RELIEF',heading:'Une présence naturellement chaleureuse.',text:'Un enduit décoratif à l’aspect de pierre naturelle, pour les lieux de vie, les hôtels et les espaces d’accueil.',caption:'PISAM · Cocody · Avril 2025'}
 ];
 const materialFacts=[['Minéral, nuancé, satiné','Chambres, salons, espaces de vie'],['Continu, contemporain, texturé','Murs, salles d’eau, escaliers'],['Veiné, marbré, lumineux','Intérieurs, bureaux, showrooms'],['Pierre naturelle, douce, chaleureuse','Lieux de vie, hôtels, espaces d’accueil']];
 let selectedMaterial=0,materialRequest=0;
 const plane=document.querySelector('#sample-plane'),photo=document.querySelector('#sample-photo'),detail=document.querySelector('#detail-photo'),range=document.querySelector('#detail-range');
 const materialButtons=[...document.querySelectorAll('[data-material]')];
 async function chooseMaterial(index){
  const request=++materialRequest;
  if(index===selectedMaterial){document.querySelector('#lab-description').textContent=materials[index].text;return;}
  const m=materials[index],src='assets/portfolio/resibat-'+m.file+'.jpg';
  const preload=new Image();preload.src=src;
  try{await preload.decode()}catch{if(request!==materialRequest)return;document.querySelector('#lab-description').textContent='Cette photographie est momentanément indisponible. Retrouvez les réalisations dans le portfolio.';return}
  if(request!==materialRequest)return;
  selectedMaterial=index;document.querySelector('#material-aspect').textContent=materialFacts[index][0];document.querySelector('#material-usage').textContent=materialFacts[index][1];materialButtons.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.material)===index)));
  plane.classList.remove('is-changing');photo.src=src;photo.alt=m.alt;detail.src=src;range.value='0';range.setAttribute('aria-valuetext','Vue d’ensemble');plane.style.setProperty('--detail','0%');
  document.querySelector('#lab-tag').textContent=m.tag;document.querySelector('#lab-heading').textContent=m.heading;document.querySelector('#lab-description').textContent=m.text;document.querySelector('#sample-caption').textContent=m.caption;document.querySelector('#sample-counter').textContent=String(index+1).padStart(2,'0')+' / 04';
  if(!reduced()){void plane.offsetWidth;plane.classList.add('is-changing')}
 }
 materialButtons.forEach(b=>b.addEventListener('click',()=>chooseMaterial(Number(b.dataset.material))));
 plane.addEventListener('animationend',()=>plane.classList.remove('is-changing'));
 range.addEventListener('input',()=>{plane.style.setProperty('--detail',range.value+'%');range.setAttribute('aria-valuetext',range.value+' % de la photographie agrandie')});
 let pointerFrame=0;
 plane.addEventListener('pointermove',e=>{
  if(reduced()||e.pointerType!=='mouse')return;
  const r=plane.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  cancelAnimationFrame(pointerFrame);pointerFrame=requestAnimationFrame(()=>{plane.style.setProperty('--rx',(3-y*6)+'deg');plane.style.setProperty('--ry',(-6+x*12)+'deg');plane.style.setProperty('--lx',(x*100)+'%');plane.style.setProperty('--ly',(y*100)+'%')});
 });
 plane.addEventListener('pointerleave',()=>{cancelAnimationFrame(pointerFrame);plane.style.setProperty('--rx','0deg');plane.style.setProperty('--ry','-5deg')});
 const portal=document.querySelector('.portal-section'),frame=document.querySelector('.portal-frame'),progress=document.querySelector('.reading-progress');
 let scrollFrame=0;
 function updateScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';
  if(reduced())return;
  const r=portal.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight*.55-r.top)/(r.height*.7)));
  portal.style.setProperty('--portal',p.toFixed(3));
  frame.style.transform='translateY('+((1-p)*14)+'%) scale('+(.84+p*.45)+') rotateX('+((1-p)*8)+'deg)';
  const round=(1-p)*40;frame.style.clipPath='inset(0 0 0 0 round '+round+'% '+round+'% 0 0)';
 }
 window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;updateScroll()})},{passive:true});
 window.addEventListener('resize',updateScroll);
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{threshold:.08});
  document.querySelectorAll('.section-head,.expertise>div,.reference-list article,.atelier-intro,.film,.process li,.faq>div').forEach(el=>{el.classList.add('reveal');observer.observe(el)});
 }
 let activeProject=null;
 const gallery=document.querySelector('#gallery-dialog');
 document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
  activeProject=Number(button.dataset.project);
  if(reduced()||typeof gallery.animate!=='function')return;
  const from=button.getBoundingClientRect(),to=gallery.getBoundingClientRect(),dx=from.left+from.width/2-to.left-to.width/2,dy=from.top+Math.min(from.height,innerHeight)/2-to.top-to.height/2;
  gallery.animate([{opacity:.3,transform:'translate('+dx*.35+'px,'+dy*.35+'px) scale(.88)'},{opacity:1,transform:'translate(0,0) scale(1)'}],{duration:420,easing:'cubic-bezier(.16,1,.3,1)'});
 }));
 const quoteForm=document.querySelector('#quote-form'),quoteService=document.querySelector('#service');
 const context=document.createElement('p');context.className='quote-context';context.hidden=true;quoteForm.querySelector('h3').after(context);
  function setInspiration(service,inspiration){
   const option=[...quoteService.options].find(o=>o.value===service);if(option)quoteService.value=service;
   const detailsField=quoteForm.querySelector('#details');if(detailsField&&!detailsField.value.trim()){detailsField.value='Inspiration : '+inspiration+'\nDécrivez votre projet : ';if(typeof detailsField.setCustomValidity==='function')detailsField.setCustomValidity('')}
   quoteForm.dataset.inspiration=inspiration;context.replaceChildren();const text=document.createElement('span');text.textContent='Votre inspiration : '+inspiration;const clear=document.createElement('button');clear.type='button';clear.textContent='Retirer';clear.addEventListener('click',()=>{delete quoteForm.dataset.inspiration;context.hidden=true;document.querySelector('#quote-result').hidden=true});context.append(text,clear);context.hidden=false;document.querySelector('#quote-result').hidden=true;
  }
 document.querySelector('#lab-quote').addEventListener('click',()=>{const m=materials[selectedMaterial];setInspiration(m.name,m.name+' — '+m.caption)});
 document.querySelector('#gallery-enquiry').addEventListener('click',()=>{
  gallery.close();if(activeProject===null)return;const p=projects[activeProject];setInspiration(p.category==='Stucco'?'Stucco effet marbre':p.category,p.title+' — '+p.location);
 });
 updateMotion();
})();
