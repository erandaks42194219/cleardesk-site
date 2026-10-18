/* Academy audience carousel and progressive enquiry fields. No external dependencies. */
(function(){
  'use strict';
  var motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-academy-carousel]').forEach(function(carousel){
    var slides=carousel.querySelectorAll('[data-academy-slide]');
    var dots=carousel.querySelectorAll('[data-academy-dot]');
    var toggle=carousel.querySelector('[data-academy-toggle]');
    var current=0,timer=null,paused=motion.matches,startX=null;
    function show(index){
      current=(index+slides.length)%slides.length;
      slides.forEach(function(slide,i){slide.hidden=i!==current;});
      dots.forEach(function(dot,i){dot.setAttribute('aria-current',i===current?'true':'false');});
    }
    function sync(){toggle.textContent=paused?'Play':'Pause';toggle.setAttribute('aria-label',(paused?'Play':'Pause')+' Academy slides');toggle.setAttribute('aria-pressed',paused?'true':'false');}
    function start(){
      window.clearInterval(timer);
      if(paused||motion.matches||document.hidden||carousel.matches(':hover')||carousel.contains(document.activeElement))return;
      timer=window.setInterval(function(){show(current+1);},9000);
    }
    dots.forEach(function(dot,i){dot.addEventListener('click',function(){show(i);start();});});
    carousel.querySelector('[data-academy-prev]').addEventListener('click',function(){show(current-1);start();});
    carousel.querySelector('[data-academy-next]').addEventListener('click',function(){show(current+1);start();});
    toggle.addEventListener('click',function(){paused=!paused;sync();start();});
    carousel.addEventListener('mouseenter',start);carousel.addEventListener('mouseleave',start);
    carousel.addEventListener('focusin',start);carousel.addEventListener('focusout',function(){window.setTimeout(start,0);});
    document.addEventListener('visibilitychange',start);
    carousel.addEventListener('touchstart',function(e){startX=e.changedTouches[0].clientX;},{passive:true});
    carousel.addEventListener('touchend',function(e){if(startX===null)return;var distance=e.changedTouches[0].clientX-startX;if(Math.abs(distance)>55){show(current+(distance<0?1:-1));start();}startX=null;},{passive:true});
    motion.addEventListener('change',function(){if(motion.matches)paused=true;sync();start();});
    show(0);sync();start();
  });
  var form=document.getElementById('contactForm');
  if(!form)return;
  var service=document.getElementById('cservice'),fields=document.getElementById('academyFields');
  var phone=document.getElementById('cphone'),preference=document.getElementById('contactPreference');
  var message=document.getElementById('cmsg');
  function syncPhone(){phone.required=service.value==='academy'&&preference.value!=='Email';}
  function syncForm(){
    var isAcademy=service.value==='academy';
    fields.hidden=!isAcademy;fields.disabled=!isAcademy;
    form.querySelector('[name="_subject"]').value=isAcademy?'ClearDesk Academy training enquiry':'New ClearDesk website enquiry';
    message.required=!isAcademy;
    message.placeholder=isAcademy?'Anything else you want us to know? (optional)':'';
    syncPhone();
  }
  service.addEventListener('change',syncForm);preference.addEventListener('change',syncPhone);
  var params=new URLSearchParams(window.location.search);
  if(params.get('service')==='academy'){
    service.value='academy';
    if(params.get('pathway')==='one-to-one')document.getElementById('trainingFormat').value='One-to-one online';
    if(params.get('pathway')==='foundation')document.getElementById('learningInterest').value='Practical bookkeeping foundation';
    if(params.get('pathway')==='career')document.getElementById('learningInterest').value='NZ / Australia career skills preparation';
  }
  syncForm();
  form.addEventListener('submit',function(){
    // Native POST to the existing mail handler. Never show a made-up success state.
    var button=form.querySelector('button[type="submit"]');
    button.textContent='Sending…';
    window.setTimeout(function(){button.textContent='Send enquiry';},15000);
  });
})();
