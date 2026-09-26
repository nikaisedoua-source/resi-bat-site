const projects = [{"category": "Marmorino", "title": "Chambre aux nuances minérales", "location": "Marcory, Biétri", "date": "Novembre–décembre 2024", "photos": [2, 3, 4, 5]}, {"category": "Béton ciré", "title": "Salle d’eau en béton ciré", "location": "Marcory, Biétri", "date": "Mai–juin 2023", "photos": [6, 7, 8, 9]}, {"category": "Béton ciré", "title": "Un escalier tout en continuité", "location": "Cocody, Riviera Golf", "date": "2024", "photos": [10, 11, 12]}, {"category": "Béton ciré", "title": "Magasin Seigneurie-MIA", "location": "Treichville", "date": "2023", "photos": [13, 14, 15, 16]}, {"category": "Stucco", "title": "Variations autour du marbre", "location": "Yamoussoukro & Gabiadji", "date": "2022", "photos": [17, 18, 19, 20]}, {"category": "Stucco", "title": "Showroom Babi Motor", "location": "Treichville, Zone 3", "date": "2024", "photos": [21, 22, 23, 24]}, {"category": "Stucco", "title": "Bureau Canal+ Côte d’Ivoire", "location": "Cocody, Mermoz", "date": "2024", "photos": [25, 26, 27]}, {"category": "Peinture & rénovation", "title": "Locaux de Novelia Assurance", "location": "Cocody, II Plateaux", "date": "Décembre 2024", "photos": [28, 29, 30]}, {"category": "Peinture & rénovation", "title": "Une villa remise en couleur", "location": "Cocody, II Plateaux", "date": "2023", "photos": [31, 32, 33]}, {"category": "Peinture & rénovation", "title": "Villa, intérieur & extérieur", "location": "Yamoussoukro", "date": "2023", "photos": [34, 35, 36, 37, 38]}, {"category": "Pietra Levigata", "title": "Les matières de l’hôtel ONOMO", "location": "Marcory, Zone 4", "date": "2024", "photos": [39, 40, 41, 42]}, {"category": "Pietra Levigata", "title": "Une finition douce à la PISAM", "location": "Cocody", "date": "Avril 2025", "photos": [43, 44, 45]}];
const menu=document.querySelector('.mobile-nav');
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.open=false));
const filters=[...document.querySelectorAll('[data-filter]')];
let selectedCategory="Tout",selectedAudience="all";
const professionalProjects=new Set([3,5,6,7,10,11]);
const audienceFilters=[...document.querySelectorAll("[data-audience]")];
function filterProjects(category){
 selectedCategory=category;
 filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===category)));
 let count=0;document.querySelectorAll('.project-card').forEach(card=>{const isProfessional=professionalProjects.has(Number(card.querySelector('[data-project]').dataset.project));card.hidden=(category!=='Tout'&&card.dataset.category!==category)||(selectedAudience==='professional'&&!isProfessional)||(selectedAudience==='residential'&&isProfessional);if(!card.hidden)count++});
 document.querySelector('.result-count').textContent=count+' chantier'+(count>1?'s':'')+' à découvrir';
}
audienceFilters.forEach(b=>b.addEventListener('click',()=>{selectedAudience=b.dataset.audience;audienceFilters.forEach(item=>item.setAttribute('aria-pressed',String(item===b)));filterProjects(selectedCategory)}));
filters.forEach(b=>b.addEventListener('click',()=>filterProjects(b.dataset.filter)));
document.querySelectorAll('[data-filter-link]').forEach(a=>a.addEventListener('click',()=>filterProjects(a.dataset.filterLink)));
const dialog=document.querySelector('#gallery-dialog');
let galleryProject=null,galleryIndex=0;
const galleryImage=document.querySelector('#gallery-image');
const galleryError=document.querySelector('#gallery-error');
const photoPath=n=>'assets/portfolio/resibat-'+String(n).padStart(3,'0')+'.jpg';
const photoAlt=(p,i)=>'Chantier '+p.title+' — finition '+p.category+' — '+p.location+', Côte d’Ivoire — photo '+(i+1)+' sur '+p.photos.length;
function showGalleryPhoto(index){
 if(!galleryProject)return;
 galleryIndex=(index+galleryProject.photos.length)%galleryProject.photos.length;
 galleryError.hidden=true;
 galleryImage.src=photoPath(galleryProject.photos[galleryIndex]);
  galleryImage.alt=photoAlt(galleryProject,galleryIndex);
 document.querySelector('#gallery-caption').textContent=galleryProject.title;
 document.querySelector('#gallery-counter').textContent=String(galleryIndex+1).padStart(2,'0')+' / '+String(galleryProject.photos.length).padStart(2,'0');
 document.querySelectorAll('[data-gallery-photo]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.galleryPhoto)===galleryIndex)));
}
galleryImage.addEventListener('error',()=>galleryError.hidden=false);
galleryImage.addEventListener('load',()=>galleryError.hidden=true);
document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>{
 galleryProject=projects[Number(b.dataset.project)];
 const p=galleryProject;
 document.querySelector('#gallery-title').textContent=p.title;
 document.querySelector('#gallery-category').textContent=p.category;
 document.querySelector('#gallery-location').textContent=p.location+' · '+p.date;
 const photos=document.querySelector('#gallery-photos');photos.replaceChildren();
 p.photos.forEach((n,i)=>{
  const button=document.createElement('button'),image=document.createElement('img');
  button.type='button';button.dataset.galleryPhoto=String(i);button.setAttribute('aria-label','Afficher la photo '+(i+1)+' sur '+p.photos.length);
   image.src=photoPath(n);image.alt=photoAlt(p,i);image.loading='lazy';image.width=96;image.height=72;
  button.append(image);button.addEventListener('click',()=>showGalleryPhoto(i));photos.append(button);
 });
 showGalleryPhoto(0);dialog.showModal();dialog.scrollTop=0;
}));
document.querySelector('#gallery-prev').addEventListener('click',()=>showGalleryPhoto(galleryIndex-1));
document.querySelector('#gallery-next').addEventListener('click',()=>showGalleryPhoto(galleryIndex+1));
dialog.addEventListener('keydown',e=>{
 if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showGalleryPhoto(galleryIndex+(e.key==='ArrowRight'?1:-1))}
});
let swipeStart=null;
const galleryStage=document.querySelector('.gallery-stage');
galleryStage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')swipeStart={x:e.clientX,y:e.clientY}});
galleryStage.addEventListener('pointerup',e=>{
 if(!swipeStart)return;
 const dx=e.clientX-swipeStart.x,dy=e.clientY-swipeStart.y;swipeStart=null;
 if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5)showGalleryPhoto(galleryIndex+(dx<0?1:-1));
});
galleryStage.addEventListener('pointercancel',()=>swipeStart=null);
document.querySelector('#close-gallery').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
const form=document.querySelector('#quote-form'),result=document.querySelector('#quote-result');
form.addEventListener('input',e=>{result.hidden=true;if(typeof e.target.setCustomValidity==='function')e.target.setCustomValidity('')});
form.addEventListener('change',()=>result.hidden=true);
form.addEventListener('submit',e=>{
 e.preventDefault();const data=new FormData(form);
 const name=String(data.get('name')).trim(),city=String(data.get('city')).trim(),details=String(data.get('details')).trim();
 if(!city||!details){const field=form.querySelector(!city?'#city':'#details');field.setCustomValidity(!city?'Indiquez la ville ou la commune du chantier.':'Décrivez votre projet en quelques mots.');field.reportValidity();return}
 const message='Bonjour RESI-BAT,'+(name?' je suis '+name+'.':'')+'\nJe souhaite un devis pour : '+data.get('service')+'.\nLieu : '+city+'.'+(data.get('place')?'\nType de lieu : '+data.get('place')+'.':'')+(data.get('surface')?'\nSurface approximative : '+data.get('surface')+' m².':'')+'\nMon projet : '+details+(form.dataset.inspiration?'\nInspiration : '+form.dataset.inspiration:'');
 document.querySelector('#quote-preview').textContent=message;
  document.querySelector('#quote-link').href='https://wa.me/2250749123888?text='+encodeURIComponent(message);result.hidden=false;
});
const labQuote=document.querySelector('#lab-quote'),quoteService=document.querySelector('#service'),quoteDetails=document.querySelector('#details');
function materialServiceName(label){return label==='Stucco'?'Stucco effet marbre':label}
function ensureQuoteContext(){let context=form.querySelector('.quote-context');if(!context){context=document.createElement('p');context.className='quote-context';context.hidden=true;form.querySelector('h3').after(context)}return context}
function setQuoteInspiration(service,inspiration){
 const option=[...quoteService.options].find(o=>o.value===service);if(option)quoteService.value=service;
 if(!quoteDetails.value.trim()){quoteDetails.value='Inspiration : '+inspiration+'\nDécrivez votre projet : ';if(typeof quoteDetails.setCustomValidity==='function')quoteDetails.setCustomValidity('')}
 form.dataset.inspiration=inspiration;
 const context=ensureQuoteContext();context.replaceChildren();
 const text=document.createElement('span');text.textContent='Votre inspiration : '+inspiration;
 const clear=document.createElement('button');clear.type='button';clear.textContent='Retirer';
 clear.addEventListener('click',()=>{delete form.dataset.inspiration;context.hidden=true;result.hidden=true});
 context.append(text,clear);context.hidden=false;result.hidden=true;
}
if(labQuote)labQuote.addEventListener('click',()=>{
 const pressed=document.querySelector('[data-material][aria-pressed="true"] strong');
 const label=pressed?pressed.textContent.trim():'';
 const service=materialServiceName(label);
 const caption=document.querySelector('#sample-caption');
 const captionText=caption?caption.textContent.trim():'';
 setQuoteInspiration(service,service+(captionText?' — '+captionText:''));
});

menu.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.open=false;menu.querySelector('summary').focus()}});
document.addEventListener('click',e=>{if(menu.open&&!menu.contains(e.target))menu.open=false});

// Turnstile callback
window.onTurnstileSuccess = function(token) {
  const btn = document.getElementById('quote-submit');
  if (btn) {
    btn.disabled = false;
    btn.dataset.turnstile = token;
  }
};

// RGPD banner already injected via inline script in HTML
