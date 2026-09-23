const projects = [{"category": "Marmorino", "title": "Chambre aux nuances minérales", "location": "Marcory, Biétri", "date": "Novembre–décembre 2024", "photos": [2, 3, 4, 5]}, {"category": "Béton ciré", "title": "Salle d’eau en béton ciré", "location": "Marcory, Biétri", "date": "Mai–juin 2023", "photos": [6, 7, 8, 9]}, {"category": "Béton ciré", "title": "Un escalier tout en continuité", "location": "Cocody, Riviera Golf", "date": "2024", "photos": [10, 11, 12]}, {"category": "Béton ciré", "title": "Magasin Seigneurie-MIA", "location": "Treichville", "date": "2023", "photos": [13, 14, 15, 16]}, {"category": "Stucco", "title": "Variations autour du marbre", "location": "Yamoussoukro & Gabiadji", "date": "2022", "photos": [17, 18, 19, 20]}, {"category": "Stucco", "title": "Showroom Babi Motor", "location": "Treichville, Zone 3", "date": "2024", "photos": [21, 22, 23, 24]}, {"category": "Stucco", "title": "Bureau Canal+ Côte d’Ivoire", "location": "Cocody, Mermoz", "date": "2024", "photos": [25, 26, 27]}, {"category": "Peinture & rénovation", "title": "Locaux de Novelia Assurance", "location": "Cocody, II Plateaux", "date": "Décembre 2024", "photos": [28, 29, 30]}, {"category": "Peinture & rénovation", "title": "Une villa remise en couleur", "location": "Cocody, II Plateaux", "date": "2023", "photos": [31, 32, 33]}, {"category": "Peinture & rénovation", "title": "Villa, intérieur & extérieur", "location": "Yamoussoukro", "date": "2023", "photos": [34, 35, 36, 37, 38]}, {"category": "Pietra Levigata", "title": "Les matières de l’hôtel ONOMO", "location": "Marcory, Zone 4", "date": "2024", "photos": [39, 40, 41, 42]}, {"category": "Pietra Levigata", "title": "Une finition douce à la PISAM", "location": "Cocody", "date": "Avril 2025", "photos": [43, 44, 45]}];
const menu=document.querySelector('.mobile-nav');
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.open=false));
const filters=[...document.querySelectorAll('[data-filter]')];
function filterProjects(category){
 filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===category)));
 let count=0;document.querySelectorAll('.project-card').forEach(card=>{card.hidden=category!=='Tout'&&card.dataset.category!==category;if(!card.hidden)count++});
 document.querySelector('.result-count').textContent=count+' chantier'+(count>1?'s':'')+' à découvrir';
}
filters.forEach(b=>b.addEventListener('click',()=>filterProjects(b.dataset.filter)));
document.querySelectorAll('[data-filter-link]').forEach(a=>a.addEventListener('click',()=>filterProjects(a.dataset.filterLink)));
const dialog=document.querySelector('#gallery-dialog');
document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>{
 const p=projects[Number(b.dataset.project)];
 document.querySelector('#gallery-title').textContent=p.title;
 document.querySelector('#gallery-category').textContent=p.category;
 document.querySelector('#gallery-location').textContent=p.location+' · '+p.date;
 const photos=document.querySelector('#gallery-photos');photos.replaceChildren();
 p.photos.forEach((n,i)=>{const figure=document.createElement('figure'),image=document.createElement('img'),caption=document.createElement('figcaption');image.src='assets/portfolio/resibat-'+String(n).padStart(3,'0')+'.jpg';image.alt=p.title+' — vue '+(i+1);image.loading='lazy';caption.textContent=p.title+' · '+(i+1)+' / '+p.photos.length;figure.append(image,caption);photos.append(figure)});
 dialog.showModal();dialog.scrollTop=0;
}));
document.querySelector('#close-gallery').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
const form=document.querySelector('#quote-form'),result=document.querySelector('#quote-result');
form.addEventListener('input',()=>result.hidden=true);
form.addEventListener('submit',e=>{
 e.preventDefault();const data=new FormData(form);
 const name=String(data.get('name')).trim(),city=String(data.get('city')).trim(),details=String(data.get('details')).trim();
 if(!city||!details){form.querySelector(!city?'#city':'#details').focus();return}
 const message='Bonjour RESI-BAT,'+(name?' je suis '+name+'.':'')+'\nJe souhaite un devis pour : '+data.get('service')+'.\nLieu : '+city+'.\nMon projet : '+details;
 document.querySelector('#quote-link').href='https://wa.me/2250749123888?text='+encodeURIComponent(message);result.hidden=false;
});
