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
  const playVideo=(key,title)=>{
    if(!['facciones','barberia-norte','limpieza','premio','como-llegar'].includes(key))return;
    const player=$('#modalPlayer'), frame=$('#videoModal .video-modal-frame');
    if(!player||!frame)return;
    const sources=['assets/'+key+'.mp4','videos/'+key+'.mp4'];
    frame.querySelector('.video-direct-link')?.remove();
    const link=document.createElement('a');
    link.className='video-direct-link';
    link.href=sources[0];link.target='_blank';link.rel='noopener noreferrer';
    link.textContent='¿No se reproduce? Abrir video directamente';
    link.style.cssText='display:block;margin:12px auto 0;color:#E0C46C;font:600 12px Arial,sans-serif;text-align:center;text-decoration:underline;position:relative;z-index:3';
    frame.appendChild(link);
    const label=$('#modalVideoTitle');label.textContent=title||'BARBERÍA JHON';
    let current=0;
    const attempt=()=>{
      player.src=sources[current];player.load();link.href=sources[current];
      const playing=player.play();
      if(playing&&playing.catch)playing.catch(err=>{if(err.name!=='AbortError')label.textContent=(title||'BARBERÍA JHON')+' · Pulsa ▶ para reproducir'});
    };
    player.onerror=()=>{
      if(current===0){current=1;attempt();}
      else label.textContent=(title||'BARBERÍA JHON')+' · No se pudo cargar. Usa el enlace inferior.';
    };
    player.pause();player.removeAttribute('src');player.load();
    reelPreviews.forEach(video=>video.pause());
    openModal('videoModal');attempt();
  };
  const stopVideo=()=>{const player=$('#modalPlayer');if(player){player.pause();player.removeAttribute('src');player.load()}closeModal('videoModal');if(typeof playVisibleReels==='function')playVisibleReels();};
  document.addEventListener('click',e=>{const item=e.target.closest('[data-video]');if(item){playVideo(item.dataset.video,item.dataset.videoTitle||'JHON') }});
  $('#closeVideo')?.addEventListener('click',stopVideo);
  // Reels verticales: autoplay silencioso y en bucle, cargados solo al entrar en pantalla.
  const reelPreviews=$$('.reel-preview');
  const mediaMotionReduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
  const previewsVisible=new Set();
  const playVisibleReels=()=>{
    for(const video of reelPreviews){
      const active=previewsVisible.has(video)&&document.visibilityState==='visible'&&!$('#videoModal')?.classList.contains('open')&&!mediaMotionReduced;
      if(!active){video.pause();continue;}
      video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;
      if(!video.src && video.dataset.src)video.src=video.dataset.src;
      if(video.paused){const request=video.play();if(request?.catch)request.catch(()=>{});}
    }
  };
  if(reelPreviews.length){
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{if(entry.isIntersecting)previewsVisible.add(entry.target);else previewsVisible.delete(entry.target)});
        playVisibleReels();
      },{threshold:.2,rootMargin:'40px 0px'});
      reelPreviews.forEach(video=>observer.observe(video));
    }else{
      reelPreviews.forEach(video=>previewsVisible.add(video));
      playVisibleReels();
    }
    document.addEventListener('visibilitychange',playVisibleReels);
    window.addEventListener('pageshow',playVisibleReels);
  }

  // Service prices are edited in assets/data.js.
  const tabs=$('#serviceTabs'),serviceSearch=$('#serviceSearch'),serviceRows=$('#serviceRows');let category='all';
  if(serviceRows){
    tabs.innerHTML=[{id:'all',nombre:'Todos'},...D.categorias].map(cat=>`<button type="button" data-category="${html(cat.id)}" class="${cat.id===category?'is-active':''}" role="tab" aria-selected="${cat.id===category}">${html(cat.nombre.toUpperCase())}</button>`).join('');
    function renderServices(){const q=normalize(serviceSearch.value.trim()),list=D.servicios.filter(s=>(q||category==='all'||s.cat===category)&&(!q||normalize(s.nombre+' '+(s.detalle||'')).includes(q)));
      const current=D.categorias.find(c=>c.id===category);$('#serviceCategory').textContent=q?'RESULTADOS':current?.nombre.toUpperCase()||'TODOS';$('#serviceCount').textContent=String(list.length).padStart(2,'0')+' SERVICIOS';
      serviceRows.innerHTML=list.length?list.map(s=>`<article class="service-row"><div><strong class="service-name">${html(s.nombre)}</strong>${s.detalle?`<small class="service-detail">${html(s.detalle)}</small>`:''}</div><div class="service-price">${s.desde?'<small>DESDE</small>':''}${money(s.precio)}</div><a class="service-book" href="reservas.html?servicio=${encodeURIComponent(s.id)}" aria-label="Solicitar ${html(s.nombre)}">AGENDAR</a></article>`).join(''):'<p class="empty-message">No encontramos ese servicio.</p>';}
    tabs.addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;category=b.dataset.category;serviceSearch.value='';$$('[data-category]').forEach(x=>{x.classList.toggle('is-active',x===b);x.setAttribute('aria-selected',String(x===b))});renderServices()});serviceSearch.addEventListener('input',renderServices);renderServices();
  }
  // Los cinco profesionales se cargan desde data.js (incluye a Andy en el segundo perfil).
  const grid=$('#teamGrid');let selectedBarber=null,selectedRating=0;
  if(grid){grid.innerHTML=D.equipo.map((b,i)=>`<button type="button" class="team-card" data-barber="${html(b.id)}" aria-label="Abrir perfil de ${html(b.nombre)}"><div class="photo-frame"><img src="${html(b.foto)}" alt="Retrato de ${html(b.nombre)}" loading="lazy"></div><div class="team-card-info"><span class="team-card-name">${html(b.nombre)}</span><span class="team-card-role">JHON / PROFESIONAL 0${i+1}</span></div></button>`).join('');
    const paintStars=()=>$('#starButtons').innerHTML=Array.from({length:5},(_,i)=>`<button type="button" data-star="${i+1}" class="${i<selectedRating?'active':''}" aria-label="${i+1} estrellas" aria-pressed="${i+1===selectedRating}">★</button>`).join('');
    grid.addEventListener('click',e=>{const button=e.target.closest('[data-barber]');if(!button)return;selectedBarber=D.equipo.find(b=>b.id===button.dataset.barber);if(!selectedBarber)return;$('#modalBarberPhoto').src=selectedBarber.foto;$('#modalBarberPhoto').alt=selectedBarber.nombre;$('#modalBarberName').textContent=selectedBarber.nombre;$('#modalBarberLink').href='reservas.html?barbero='+encodeURIComponent(selectedBarber.id);selectedRating=0;$('#rateComment').value='';$('#rateStatus').textContent='';paintStars();openModal('barberModal')});
    $('#starButtons').addEventListener('click',e=>{const btn=e.target.closest('[data-star]');if(!btn)return;selectedRating=Number(btn.dataset.star);paintStars()});
    $('#sendRating').addEventListener('click',()=>{if(!selectedRating){$('#rateStatus').textContent='Elige de una a cinco estrellas.';return;}try{const key='JHON_V4_PREVIEW_REVIEWS',arr=JSON.parse(localStorage.getItem(key)||'[]');arr.push({barbero:selectedBarber.id,estrellas:selectedRating,comentario:$('#rateComment').value.trim(),fecha:new Date().toISOString()});localStorage.setItem(key,JSON.stringify(arr));$('#rateStatus').textContent='Valoración guardada solo en este navegador. No es pública.';}catch{$('#rateStatus').textContent='No fue posible guardar esta valoración en el navegador.'}});
    $('#closeBarber').addEventListener('click',()=>closeModal('barberModal'));
  }
  // Product categories are placeholders, not individual confirmed stock items.
  const prodGrid=$('#productGrid'),prodSearch=$('#productSearch'),prodTabs=$('#productTabs');let prodFamily='all';
  if(prodGrid){const families=['all',...new Set(D.tienda.map(x=>x.familia))];prodTabs.innerHTML=families.map((f,i)=>`<button type="button" data-family="${html(f)}" class="${i===0?'is-active':''}">${f==='all'?'TODO':html(f)}</button>`).join('');
    const render=()=>{const query=normalize(prodSearch.value),list=D.tienda.filter(p=>(prodFamily==='all'||p.familia===prodFamily)&&normalize(p.nombre+' '+p.sub+' '+p.familia).includes(query));prodGrid.innerHTML=list.length?list.map((p,i)=>`<article class="product-card"><div class="product-top"><span>0${i+1} / ${html(p.familia)}</span><span>JHON</span></div><div class="product-visual-word"><b>${html(p.nombre.toUpperCase())}</b></div><div class="product-bottom"><p>${html(p.sub)}<small>CONSULTA PRECIOS Y MODELOS</small></p><button type="button" data-product="${html(p.id)}" aria-label="Consultar ${html(p.nombre)}">CONSULTAR</button></div></article>`).join(''):'<p class="empty-message">No hay coincidencias.</p>';};
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
    const bookingDate=$('#bookingDate'), bookingTime=$('#bookingTime'), hoursHint=$('#bookingHoursHint');
    const now=new Date();bookingDate.min=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    const updateTimeRange=()=>{
      const selected=bookingDate.value;
      if(!selected){bookingTime.removeAttribute('min');bookingTime.removeAttribute('max');bookingTime.value='';if(hoursHint)hoursHint.textContent='LUN–JUE 9:00–20:00 · VIE–SÁB 8:30–20:00 · DOM 8:30–19:00';return;}
      const day=new Date(selected+'T12:00:00').getDay();
      const hours=D.horarios?.[day];
      if(!hours)return;
      bookingTime.min=hours.inicio;bookingTime.max=hours.fin;
      if(bookingTime.value&&(bookingTime.value<hours.inicio||bookingTime.value>hours.fin))bookingTime.value='';
      bookingTime.setCustomValidity('');
      if(hoursHint)hoursHint.textContent='Horario de atención: '+hours.inicio+' a '+hours.fin+'. Sujeto a disponibilidad.';
    };
    bookingDate.addEventListener('change',updateTimeRange);
    bookingTime.addEventListener('input',()=>bookingTime.setCustomValidity(''));
    updateTimeRange();
    form.addEventListener('submit',e=>{e.preventDefault();updateTimeRange();const day=bookingDate.value?new Date(bookingDate.value+'T12:00:00').getDay():null;const hours=day===null?null:D.horarios?.[day];if(hours && (bookingTime.value<hours.inicio || bookingTime.value>hours.fin)){bookingTime.setCustomValidity('Selecciona una hora dentro del horario de atención: '+hours.inicio+' a '+hours.fin+'.');}else{bookingTime.setCustomValidity('');}if(!form.reportValidity())return;const s=D.servicios.find(x=>x.id===service.value),b=D.equipo.find(x=>x.id===chosenProfessional);const text=`Hola, Barbería y Peluquería Jhon. Quisiera consultar disponibilidad para una cita.\n\nNombre: ${$('#bookingName').value.trim()}\nServicio: ${s?.nombre||''}\nPrecio publicado: ${s?.desde?'Desde ':''}${money(s?.precio||0)}\nBarbero: ${b?(b.nombre):'Sin preferencia'}\nFecha preferida: ${$('#bookingDate').value}\nHora preferida: ${$('#bookingTime').value}\n\n¿Podrían confirmar el horario y precio final?`;
      $('#bookingMessage').value=text;$('#bookingStatus').textContent='';openModal('bookingModal')});
    $('#closeBooking').addEventListener('click',()=>closeModal('bookingModal'));
    $('#copyBooking').addEventListener('click',async()=>{$('#bookingStatus').textContent=await safeCopy($('#bookingMessage').value)?'Solicitud copiada. Debes enviarla para que la barbería confirme.':'Selecciona el texto y cópialo manualmente.'});
  }
  // Animaciones de entrada al hacer scroll; no se aplica ocultamiento sin IntersectionObserver.
  const prefersReducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
  const appearanceTargets=[
    '.home-editorial .editorial-head',
    '.home-editorial .editorial-card',
    '.home-videos .reels-heading',
    '.home-videos .reel-card',
    '.home-map .map-heading',
    '.home-map .map-info',
    '.home-map .map-frame',
    '.closing-banner .display',
    '.closing-banner .btn-white',
    '.services-section .headline-split',
    '.services-section .service-title-line',
    '.services-section .service-row',
    '.services-section .promo-poster',
    '.team-section .headline-split',
    '.team-section .team-card',
    '.store-section .headline-split',
    '.store-section .product-card',
    '.videos-section .reels-heading',
    '.videos-section .reel-card',
    '.reserve-form-container > h2',
    '.reserve-form-container .booking-form',
    '.location-detail',
    '.location-video'
  ];
  if(!prefersReducedMotion && 'IntersectionObserver' in window){
    const nodes=$$(appearanceTargets.join(',')); // TODOS los elementos, no solo el primero.
    if(nodes.length){
      const appearance=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(!entry.isIntersecting)return;
          const el=entry.target;
          // Dos fotogramas separados aseguran que el navegador aplique la transición.
          requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('reveal-visible')));
          appearance.unobserve(el);
        });
      },{threshold:0.08,rootMargin:'0px 0px -24px 0px'});
      nodes.forEach((node,i)=>{
        node.classList.add('reveal-item');
        node.style.setProperty('--reveal-delay',Math.min(i%3,2)*85+'ms');
        appearance.observe(node);
      });
    }
  }
})();
