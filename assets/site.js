/* Barbería y Peluquería Jhon — V4; vista previa local, sin servicios de servidor. */
(()=>{
  'use strict';
  const D=window.JHON;
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const html=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const money=n=>'$'+Number(n).toFixed(2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1');
  const normalize=s=>String(s??'').toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const safeCopy=async text=>{try{if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(text);return true;}}catch{}const area=document.createElement('textarea');area.value=text;area.style.cssText='position:fixed;top:-500px;left:-500px;';document.body.appendChild(area);area.select();let ok=false;try{ok=document.execCommand('copy')}catch{}area.remove();return ok;};
  const header=$('.header');window.addEventListener('scroll',()=>header?.classList.toggle('scrolled',scrollY>30),{passive:true});
  const menu=$('#mobileMenu'),toggle=$('#mobileToggle');
  const setMenu=open=>{if(!menu||!toggle)return;menu.classList.toggle('open',open);menu.setAttribute('aria-hidden',String(!open));toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');document.body.style.overflow=open?'hidden':'';};
  toggle?.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
  $$('.mobile-link').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  const loader=$('#loader');if(loader){const finish=()=>{loader.classList.add('done');setTimeout(()=>loader.remove(),750)};setTimeout(finish,1100);}
  const openModal=id=>{const el=$('#'+id);if(!el)return;el.classList.add('open');el.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'};
  const closeModal=id=>{const el=$('#'+id);if(!el)return;el.classList.remove('open');el.setAttribute('aria-hidden','true');document.body.style.overflow='';};
  $$('.modal-overlay').forEach(layer=>layer.addEventListener('click',e=>{if(e.target===layer) {if(layer.id==='videoModal')stopVideo();else closeModal(layer.id)}}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){$$('.modal-overlay.open').forEach(layer=>{if(layer.id==='videoModal')stopVideo();else closeModal(layer.id)});setMenu(false)}});
  // All five videos are supplied by the owner, locally bundled, play only on click.
  const playVideo=(key,title)=>{if(!['facciones','barberia-norte','limpieza','premio','como-llegar'].includes(key))return;const player=$('#modalPlayer');player.pause();player.removeAttribute('src');player.load();player.src='assets/videos/'+key+'.mp4';$('#modalVideoTitle').textContent=title||'BARBERÍA JHON';openModal('videoModal');player.play().catch(()=>{});};
  const stopVideo=()=>{const player=$('#modalPlayer');if(player){player.pause();player.removeAttribute('src');player.load()}closeModal('videoModal')};
  document.addEventListener('click',e=>{const item=e.target.closest('[data-video]');if(item){playVideo(item.dataset.video,item.dataset.videoTitle||'JHON') }});
  $('#closeVideo')?.addEventListener('click',stopVideo);
  // Service prices are edited in assets/data.js.
  const tabs=$('#serviceTabs'),serviceSearch=$('#serviceSearch'),serviceRows=$('#serviceRows');let category='barberia';
  if(serviceRows){
    tabs.innerHTML=D.categorias.map(cat=>`<button type="button" data-category="${html(cat.id)}" class="${cat.id===category?'is-active':''}" role="tab" aria-selected="${cat.id===category}">${html(cat.nombre.toUpperCase())}</button>`).join('');
    function renderServices(){const q=normalize(serviceSearch.value.trim()),list=D.servicios.filter(s=>(q||category==='all'||s.cat===category)&&(!q||normalize(s.nombre+' '+(s.detalle||'')).includes(q)));
      const current=D.categorias.find(c=>c.id===category);$('#serviceCategory').textContent=q?'RESULTADOS':current?.nombre.toUpperCase()||'TODOS';$('#serviceCount').textContent=String(list.length).padStart(2,'0')+' SERVICIOS';
      serviceRows.innerHTML=list.length?list.map(s=>`<article class="service-row"><div><strong class="service-name">${html(s.nombre)}</strong>${s.detalle?`<small class="service-detail">${html(s.detalle)}</small>`:''}</div><div class="service-price">${s.desde?'<small>DESDE</small>':''}${money(s.precio)}</div><a class="service-book" href="reservas.html?servicio=${encodeURIComponent(s.id)}" aria-label="Solicitar ${html(s.nombre)}">↗</a></article>`).join(''):'<p class="empty-message">No encontramos ese servicio.</p>';}
    tabs.addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;category=b.dataset.category;serviceSearch.value='';$$('[data-category]').forEach(x=>{x.classList.toggle('is-active',x===b);x.setAttribute('aria-selected',String(x===b))});renderServices()});serviceSearch.addEventListener('input',renderServices);renderServices();
  }
  // Five actual professional photos; two uniforms read Manuel, so two separate profiles share that label.
  const grid=$('#teamGrid');let selectedBarber=null,selectedRating=0;
  if(grid){grid.innerHTML=D.equipo.map((b,i)=>`<button type="button" class="team-card" data-barber="${html(b.id)}" aria-label="Abrir perfil de ${html(b.nombre)}"><div class="photo-frame"><img src="${html(b.foto)}" alt="Retrato de ${html(b.nombre)}" loading="lazy"></div><div class="team-card-info"><span class="team-card-name">${html(b.nombre)}</span><span class="team-card-role">JHON / PROFESIONAL 0${i+1}</span></div><span class="team-card-arrow">↗</span></button>`).join('');
    const paintStars=()=>$('#starButtons').innerHTML=Array.from({length:5},(_,i)=>`<button type="button" data-star="${i+1}" class="${i<selectedRating?'active':''}" aria-label="${i+1} estrellas" aria-pressed="${i+1===selectedRating}">★</button>`).join('');
    grid.addEventListener('click',e=>{const button=e.target.closest('[data-barber]');if(!button)return;selectedBarber=D.equipo.find(b=>b.id===button.dataset.barber);if(!selectedBarber)return;$('#modalBarberPhoto').src=selectedBarber.foto;$('#modalBarberPhoto').alt=selectedBarber.nombre;$('#modalBarberName').textContent=selectedBarber.nombre;$('#modalBarberLink').href='reservas.html?barbero='+encodeURIComponent(selectedBarber.id);selectedRating=0;$('#rateComment').value='';$('#rateStatus').textContent='';paintStars();openModal('barberModal')});
    $('#starButtons').addEventListener('click',e=>{const btn=e.target.closest('[data-star]');if(!btn)return;selectedRating=Number(btn.dataset.star);paintStars()});
    $('#sendRating').addEventListener('click',()=>{if(!selectedRating){$('#rateStatus').textContent='Elige de una a cinco estrellas.';return;}try{const key='JHON_V4_PREVIEW_REVIEWS',arr=JSON.parse(localStorage.getItem(key)||'[]');arr.push({barbero:selectedBarber.id,estrellas:selectedRating,comentario:$('#rateComment').value.trim(),fecha:new Date().toISOString()});localStorage.setItem(key,JSON.stringify(arr));$('#rateStatus').textContent='Valoración guardada solo en este navegador. No es pública.';}catch{$('#rateStatus').textContent='No fue posible guardar esta valoración en el navegador.'}});
    $('#closeBarber').addEventListener('click',()=>closeModal('barberModal'));
  }
  // Product categories are placeholders, not individual confirmed stock items.
  const prodGrid=$('#productGrid'),prodSearch=$('#productSearch'),prodTabs=$('#productTabs');let prodFamily='all';
  if(prodGrid){const families=['all',...new Set(D.tienda.map(x=>x.familia))];prodTabs.innerHTML=families.map((f,i)=>`<button type="button" data-family="${html(f)}" class="${i===0?'is-active':''}">${f==='all'?'TODO':html(f)}</button>`).join('');
    const render=()=>{const query=normalize(prodSearch.value),list=D.tienda.filter(p=>(prodFamily==='all'||p.familia===prodFamily)&&normalize(p.nombre+' '+p.sub+' '+p.familia).includes(query));prodGrid.innerHTML=list.length?list.map((p,i)=>`<article class="product-card"><div class="product-top"><span>0${i+1} / ${html(p.familia)}</span><span>JHON ↗</span></div><div class="product-visual-word"><b>${html(p.nombre.toUpperCase())}</b></div><div class="product-bottom"><p>${html(p.sub)}<small>CONSULTA PRECIOS Y MODELOS</small></p><button type="button" data-product="${html(p.id)}" aria-label="Consultar ${html(p.nombre)}">↗</button></div></article>`).join(''):'<p class="empty-message">No hay coincidencias.</p>';};
    prodTabs.addEventListener('click',e=>{const b=e.target.closest('[data-family]');if(!b)return;prodFamily=b.dataset.family;$$('[data-family]').forEach(x=>x.classList.toggle('is-active',x===b));render()});prodSearch.addEventListener('input',render);render();
    prodGrid.addEventListener('click',e=>{const b=e.target.closest('[data-product]');if(!b)return;const product=D.tienda.find(p=>p.id===b.dataset.product);if(!product)return;$('#productTitle').textContent=product.nombre;$('#productMessage').value=`Hola, Barbería y Peluquería Jhon. Me interesa conocer los modelos, precios y disponibilidad de ${product.nombre}. ¿Me dan información?`;$('#productStatus').textContent='';openModal('productModal')});
    $('#closeProduct').addEventListener('click',()=>closeModal('productModal'));
    $('#copyProduct').addEventListener('click',async()=>{$('#productStatus').textContent=await safeCopy($('#productMessage').value)?'Mensaje copiado. Pégalo en WhatsApp para consultar.':'Selecciona el mensaje y cópialo manualmente.'});
  }
  // Appointment generates a text request; it never reserves a Google Calendar slot.
  const form=$('#bookingForm');let chosenProfessional='';
  if(form){const param=new URLSearchParams(location.search),service=$('#bookingService');service.innerHTML='<option value="">SELECCIONA TU SERVICIO</option>'+D.categorias.map(c=>`<optgroup label="${html(c.nombre)}">${D.servicios.filter(s=>s.cat===c.id).map(s=>`<option value="${html(s.id)}">${html(s.nombre)} · ${s.desde?'Desde ':''}${money(s.precio)}</option>`).join('')}</optgroup>`).join('');
    if(D.servicios.some(s=>s.id===param.get('servicio')))service.value=param.get('servicio');
    const choices=$('#bookingBarbers');choices.innerHTML=D.equipo.map(b=>`<button type="button" class="booking-barber" data-professional="${html(b.id)}" aria-pressed="false"><img src="${html(b.foto)}" alt="${html(b.nombre)}"><span>${html(b.nombre)}</span></button>`).join('');
    const select=id=>{chosenProfessional=id;$$('.booking-barber').forEach(b=>{const a=b.dataset.professional===id;b.classList.toggle('active',a);b.setAttribute('aria-pressed',String(a))})};
    choices.addEventListener('click',e=>{const b=e.target.closest('[data-professional]');if(b)select(b.dataset.professional)});
    if(D.equipo.some(b=>b.id===param.get('barbero')))select(param.get('barbero'));
    const now=new Date();$('#bookingDate').min=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const s=D.servicios.find(x=>x.id===service.value),b=D.equipo.find(x=>x.id===chosenProfessional);const text=`Hola, Barbería y Peluquería Jhon. Quisiera consultar disponibilidad para una cita.\n\nNombre: ${$('#bookingName').value.trim()}\nServicio: ${s?.nombre||''}\nPrecio publicado: ${s?.desde?'Desde ':''}${money(s?.precio||0)}\nBarbero: ${b?(b.nombre+(b.nombre==='Manuel'?' (perfil '+String(D.equipo.findIndex(x=>x.id===b.id)+1).padStart(2,'0')+')':'')):'Sin preferencia'}\nFecha preferida: ${$('#bookingDate').value}\nHora preferida: ${$('#bookingTime').value}\n\n¿Podrían confirmar el horario y precio final?`;
      $('#bookingMessage').value=text;$('#bookingStatus').textContent='';openModal('bookingModal')});
    $('#closeBooking').addEventListener('click',()=>closeModal('bookingModal'));
    $('#copyBooking').addEventListener('click',async()=>{$('#bookingStatus').textContent=await safeCopy($('#bookingMessage').value)?'Solicitud copiada. Debes enviarla para que la barbería confirme.':'Selecciona el texto y cópialo manualmente.'});
  }
})();
