document.addEventListener('DOMContentLoaded', () => {
 const current = location.pathname.split('/').pop() || 'index.html';
 document.querySelectorAll('header nav a').forEach(a => {if(a.getAttribute('href') === current) a.setAttribute('aria-current','page');});
 const year = document.getElementById('year'); if(year) year.textContent = new Date().getFullYear();
 const nav=document.querySelector('nav[aria-label="Navegación principal"]'), toggle=document.querySelector('.nav-toggle');
 if(nav && toggle){const close=()=>{nav.classList.remove('nav-abierto');toggle.setAttribute('aria-expanded','false');};nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});}
});