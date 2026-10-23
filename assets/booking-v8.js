/* Barbería Jhon — Maqueta de reserva interactiva V8.
   Solo genera una solicitud para copiar; NO guarda citas ni afirma disponibilidad. */
(() => {
  'use strict';
  const root=document.getElementById('jhonBookingV8');
  if(!root || !window.JHON) return;
  const D=window.JHON;
  const find=(s)=>root.querySelector(s);
  const all=(s)=>Array.from(root.querySelectorAll(s));
  const escapeHtml=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cost=(s)=>(s.desde?'Desde ':'')+'$'+Number(s.precio).toFixed(2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1');
  const today=new Date();today.setHours(0,0,0,0);
  const lastDay=new Date(today.getFullYear(),today.getMonth(),today.getDate()+90);
  const state={step:1,service:null,barber:null,date:'',time:'',month:new Date(today.getFullYear(),today.getMonth(),1)};
  const dayISO=(date)=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
  const dateObj=(iso)=>new Date(iso+'T12:00:00');
  const fmtDate=(iso)=>iso?new Intl.DateTimeFormat('es-EC',{weekday:'long',day:'numeric',month:'long'}).format(dateObj(iso)):'Por seleccionar';
  const hours=(iso)=>D.horarios?.[String(dateObj(iso).getDay())];
  const feedback=find('#bookingFeedbackV8');
  const error=(s)=>{feedback.textContent=s;feedback.hidden=!s};
  const serviceGrid=find('#bookingServicesV8');
  const categories=[...D.categorias];
  serviceGrid.innerHTML=categories.map(c=>{
    const list=D.servicios.filter(s=>s.cat===c.id);
    return '<div class="bv8-category"><h3>'+escapeHtml(c.nombre)+'</h3><div class="bv8-service-grid">'+list.map(s=>'<button type="button" class="bv8-service" data-service-id="'+escapeHtml(s.id)+'" aria-pressed="false"><span class="bv8-service-title">'+escapeHtml(s.nombre)+'</span><span class="bv8-service-price">'+escapeHtml(cost(s))+'</span>'+(s.detalle?'<small>'+escapeHtml(s.detalle)+'</small>':'')+'</button>').join('')+'</div></div>';
  }).join('');
  const team=find('#bookingTeamV8');
  team.innerHTML=D.equipo.map(b=>'<button type="button" class="bv8-barber" data-barber-id="'+escapeHtml(b.id)+'" aria-pressed="false"><img src="'+escapeHtml(b.foto)+'" alt="Retrato de '+escapeHtml(b.nombre)+'" loading="lazy"><span>'+escapeHtml(b.nombre)+'</span><i aria-hidden="true">✓</i></button>').join('');
  function summary(){
    const s=D.servicios.find(x=>x.id===state.service);
    const b=D.equipo.find(x=>x.id===state.barber);
    find('#bv8SumService').textContent=s?.nombre||'Por seleccionar';
    find('#bv8SumPrice').textContent=s?cost(s):'—';
    find('#bv8SumBarber').textContent=b?.nombre||'Por seleccionar';
    find('#bv8SumDate').textContent=fmtDate(state.date);
    find('#bv8SumTime').textContent=state.time||'Por seleccionar';
  }
  function renderService(){
    all('[data-service-id]').forEach(el=>{const on=el.dataset.serviceId===state.service;el.classList.toggle('selected',on);el.setAttribute('aria-pressed',String(on));});
  }
  function renderBarber(){
    all('[data-barber-id]').forEach(el=>{const on=el.dataset.barberId===state.barber;el.classList.toggle('selected',on);el.setAttribute('aria-pressed',String(on));});
  }
  serviceGrid.addEventListener('click',e=>{const b=e.target.closest('[data-service-id]');if(!b)return;state.service=b.dataset.serviceId;renderService();summary();error('')});
  team.addEventListener('click',e=>{const b=e.target.closest('[data-barber-id]');if(!b)return;state.barber=b.dataset.barberId;renderBarber();summary();error('')});
  function renderCalendar(){
    const d=state.month;
    const title=new Intl.DateTimeFormat('es-EC',{month:'long',year:'numeric'}).format(d);
    find('#bv8MonthName').textContent=title.charAt(0).toUpperCase()+title.slice(1);
    const first=new Date(d.getFullYear(),d.getMonth(),1);
    const lead=(first.getDay()+6)%7;
    const days=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();
    const items=[];
    for(let i=0;i<lead;i++)items.push('<span class="bv8-blank" aria-hidden="true"></span>');
    for(let day=1;day<=days;day++){
      const date=new Date(d.getFullYear(),d.getMonth(),day);
      const iso=dayISO(date);
      const disabled=date<today||date>lastDay;
      const selected=iso===state.date;
      items.push('<button type="button" class="bv8-day'+(selected?' selected':'')+'" data-date="'+iso+'" '+(disabled?'disabled':'')+' aria-label="'+escapeHtml(fmtDate(iso))+'" aria-pressed="'+selected+'">'+day+'</button>');
    }
    find('#bv8Days').innerHTML=items.join('');
    const offset=(d.getFullYear()-today.getFullYear())*12+d.getMonth()-today.getMonth();
    find('#bv8PrevMonth').disabled=offset<=0;
    const nextMonth=new Date(d.getFullYear(),d.getMonth()+1,1);
    find('#bv8NextMonth').disabled=nextMonth>lastDay;
  }
  const minutes=(hhmm)=>{const [h,m]=hhmm.split(':').map(Number);return h*60+m};
  const showTime=(n)=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
  function renderSlots(){
    const holder=find('#bv8Slots'),hint=find('#bv8TimeHint');
    if(!state.date){holder.innerHTML='<p class="bv8-empty-slots">Selecciona un día en el calendario para ver los horarios de atención.</p>';hint.textContent='Los horarios todavía no indican disponibilidad real.';return;}
    const h=hours(state.date);if(!h){holder.innerHTML='<p class="bv8-empty-slots">No hay horario configurado para este día.</p>';return;}
    hint.textContent='Horario de atención: '+h.inicio+' a '+h.fin+'. La disponibilidad se confirmará con la barbería.';
    const now=new Date();
    const options=[];
    for(let min=minutes(h.inicio);min<=minutes(h.fin)-30;min+=30){
      const t=showTime(min);
      if(state.date===dayISO(now) && min<=now.getHours()*60+now.getMinutes())continue;
      options.push('<button class="bv8-slot'+(state.time===t?' selected':'')+'" type="button" data-time="'+t+'" aria-pressed="'+String(state.time===t)+'">'+t+'</button>');
    }
    if(state.time && !options.some(x=>x.includes('data-time="'+state.time+'"')))state.time='';
    holder.innerHTML=options.join('')||'<p class="bv8-empty-slots">Ya no hay horarios dentro del horario de atención para este día. Elige otra fecha.</p>';
    summary();
  }
  find('#bv8PrevMonth').addEventListener('click',()=>{state.month=new Date(state.month.getFullYear(),state.month.getMonth()-1,1);renderCalendar();});
  find('#bv8NextMonth').addEventListener('click',()=>{state.month=new Date(state.month.getFullYear(),state.month.getMonth()+1,1);renderCalendar();});
  find('#bv8Days').addEventListener('click',e=>{const b=e.target.closest('[data-date]');if(!b||b.disabled)return;state.date=b.dataset.date;state.time='';renderCalendar();renderSlots();summary();error('');});
  find('#bv8Slots').addEventListener('click',e=>{const b=e.target.closest('[data-time]');if(!b)return;state.time=b.dataset.time;renderSlots();summary();error('');});
  const chosenService=new URLSearchParams(location.search).get('servicio');
  const chosenBarber=new URLSearchParams(location.search).get('barbero');
  if(D.servicios.some(x=>x.id===chosenService))state.service=chosenService;
  if(D.equipo.some(x=>x.id===chosenBarber))state.barber=chosenBarber;
  function canAdvance(step){
    if(step===1 && (!state.service||!state.barber)){error('Selecciona un servicio y un barbero para continuar.');return false;}
    if(step===2 && (!state.date||!state.time)){error('Selecciona una fecha y un horario preferido para continuar.');return false;}
    return true;
  }
  function navigate(step){
    if(step>state.step && !canAdvance(state.step))return;
    if(step<1||step>3)return;
    state.step=step;
    all('[data-step]').forEach(el=>{const active=Number(el.dataset.step)===step;el.hidden=!active;});
    all('[data-step-label]').forEach(el=>{const n=Number(el.dataset.stepLabel);el.classList.toggle('active',n===step);el.classList.toggle('complete',n<step);if(n===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
    find('#bv8StepCurrent').textContent=step+'/3';
    find('#bv8ProgressBar').style.width=(step*100/3)+'%';
    error('');
    const panel=find('#bv8Panel');
    if(window.innerWidth<1000)panel.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  }
  all('[data-next-step]').forEach(b=>b.addEventListener('click',()=>navigate(Number(b.dataset.nextStep))));
  all('[data-prev-step]').forEach(b=>b.addEventListener('click',()=>navigate(Number(b.dataset.prevStep))));
  all('[data-step-label]').forEach(el=>el.addEventListener('click',()=>{const n=Number(el.dataset.stepLabel);if(n<state.step)navigate(n);}));
  const form=find('#bookingFormV8');
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!canAdvance(1)||!canAdvance(2)){navigate(!canAdvance(1)?1:2);return;}
    const name=find('#bv8Name').value.trim(),phone=find('#bv8Whatsapp').value.trim(),notes=find('#bv8Notes').value.trim();
    if(name.length<2){error('Ingresa tu nombre para preparar la solicitud.');find('#bv8Name').focus();return;}
    const digits=phone.replace(/[^0-9]/g,'');
    if(digits.length<9 || digits.length>15){error('Ingresa un número de WhatsApp válido, con código de país si corresponde.');find('#bv8Whatsapp').focus();return;}
    const service=D.servicios.find(x=>x.id===state.service),barber=D.equipo.find(x=>x.id===state.barber);
    const message=['Hola, Barbería y Peluquería Jhon. Quiero consultar la disponibilidad para una cita.','','Nombre: '+name,'WhatsApp: '+phone,'Servicio: '+service.nombre,'Precio publicado: '+cost(service),'Barbero: '+barber.nombre,'Fecha preferida: '+fmtDate(state.date),'Hora preferida: '+state.time,notes?'Notas: '+notes:null,'','¿Podrían confirmarme si hay disponibilidad?'].filter(x=>x!==null).join(String.fromCharCode(10));
    const modal=document.getElementById('bookingModal');
    const textarea=document.getElementById('bookingMessage');
    if(!modal||!textarea){error('No se pudo abrir el resumen. Reintenta.');return;}
    textarea.value=message;
    const whatsappAction=document.getElementById('sendBookingWhatsapp');
    if(whatsappAction && /^\d{10,15}$/.test(String(D.whatsapp||''))){
      whatsappAction.href='https://wa.me/'+D.whatsapp+'?text='+encodeURIComponent(message);
      whatsappAction.hidden=false;
    } else if(whatsappAction){whatsappAction.hidden=true;}
    const status=document.getElementById('bookingStatus');
    if(status)status.textContent='Esta solicitud no se guarda ni bloquea un horario. Cópiala y envíala a la barbería para confirmar.';
    modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
    document.getElementById('copyBooking')?.focus();
  });
  document.getElementById('closeBooking')?.addEventListener('click',()=>{document.getElementById('bookingModal')?.classList.remove('open');document.getElementById('bookingModal')?.setAttribute('aria-hidden','true');document.body.style.overflow='';});
    const copyButton=document.getElementById('copyBooking');
  copyButton?.addEventListener('click',async()=>{
    const field=document.getElementById('bookingMessage'),status=document.getElementById('bookingStatus');
    if(!field)return;
    let worked=false;
    try{
      if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(field.value);worked=true;}
    }catch(e){worked=false;}
    if(!worked){
      field.focus();field.select();
      try{worked=document.execCommand('copy')}catch(e){worked=false}
    }
    if(status)status.textContent=worked?'Solicitud copiada. Envíala a la barbería para confirmar tu cita.':'Selecciona y copia manualmente el mensaje para enviarlo a la barbería.';
  });

  renderService();renderBarber();renderCalendar();renderSlots();summary();navigate(1);
})();