(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const menu=document.querySelector('.c1-menu'),menuToggle=document.querySelector('.c1-menu-toggle'),menuClose=document.querySelector('.c1-menu-close');
const pageSurfaces=[document.querySelector('.c1-header'),document.querySelector('main'),document.querySelector('.c1-footer'),document.querySelector('.c1-skip')];
let previousFocus,menuState='closed',menuAnimation,menuItems=[],menuSequence=0;
function updateScrollLock(){document.body.classList.toggle('c1-overlay-open',menuState!=='closed'||!!document.querySelector('#request-dialog')?.open||!!document.querySelector('#gallery-dialog')?.open)}
function cancelMenuAnimations(){menuAnimation?.cancel();menuItems.forEach(a=>a.cancel());menuItems=[]}
function isolatePage(on){pageSurfaces.forEach(el=>{if(el)el.inert=on})}
function openMenu(){
 const from=menuState==='closed'?'inset(0% 0% 100% 0%)':getComputedStyle(menu).clipPath;
 const run=++menuSequence;cancelMenuAnimations();previousFocus=document.activeElement;menu.hidden=false;menu.inert=false;menuState='opening';menuToggle.setAttribute('aria-expanded','true');isolatePage(true);updateScrollLock();menuClose.focus({preventScroll:true});
 if(reduced.matches||!menu.animate){menu.style.clipPath='';menuState='open';return}
 menuAnimation=menu.animate({clipPath:[from,'inset(0% 0% 0% 0%)']},{duration:620,easing:'cubic-bezier(.22,.7,.2,1)',fill:'both'});
 [...menu.querySelectorAll('.c1-menu-links a,.c1-menu-phone,.c1-menu p')].forEach((el,i)=>menuItems.push(el.animate({opacity:[0,1],transform:['translateY(24px)','translateY(0)']},{duration:450,delay:100+i*35,easing:'cubic-bezier(.22,.7,.2,1)',fill:'both'})));
 menuAnimation.onfinish=()=>{if(run===menuSequence){menuState='open';menuAnimation.cancel();menuAnimation=null}};
}
function closeMenu(restoreFocus=true){
 if(menuState==='closed')return Promise.resolve();
 const from=getComputedStyle(menu).clipPath;const run=++menuSequence;cancelMenuAnimations();menuState='closing';menuToggle.setAttribute('aria-expanded','false');menu.inert=true;
 return new Promise(resolve=>{
  function finish(){if(run!==menuSequence){resolve();return}menu.hidden=true;menu.inert=false;menu.style.clipPath='';menuState='closed';cancelMenuAnimations();isolatePage(false);updateScrollLock();if(restoreFocus)previousFocus?.focus({preventScroll:true});resolve()}
  if(reduced.matches||!menu.animate){finish();return}
  menuAnimation=menu.animate({clipPath:[from==='none'?'inset(0% 0% 0% 0%)':from,'inset(0% 0% 100% 0%)']},{duration:450,easing:'cubic-bezier(.4,0,.3,1)',fill:'both'});
  menuAnimation.onfinish=finish;menuAnimation.oncancel=resolve;
 });
}
menuToggle.addEventListener('click',()=>menuState==='closed'||menuState==='closing'?openMenu():closeMenu());menuClose.addEventListener('click',()=>closeMenu());
menu.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();closeMenu();return}if(e.key==='Tab'){const els=[...menu.querySelectorAll('button,a')];if(e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===els.at(-1)){e.preventDefault();els[0].focus()}}});
menu.querySelectorAll('a:not([href^="#"])').forEach(a=>a.addEventListener('click',()=>closeMenu()));
const motionButton=document.querySelector('.c1-motion');let motionContext,paused=false;
// Measure with native, immediate scrolling so refreshing pinned chapters cannot
// start a smooth scroll and corrupt subsequent anchor positions.
function stableGeometry(fn){const x=scrollX,y=scrollY;scrollTo({left:x,top:y,behavior:'instant'});fn();scrollTo({left:x,top:y,behavior:'instant'})}
function refreshGeometry(){if(window.ScrollTrigger)stableGeometry(()=>ScrollTrigger.refresh())}
function configureMotion(){
 const room=document.querySelector('#room'),roomBefore=room.getBoundingClientRect().top;const belowPortal=roomBefore<0;
 stableGeometry(()=>{
  if(motionContext){motionContext.revert();motionContext=null}
  motionButton.hidden=!window.gsap||!window.ScrollTrigger||reduced.matches;motionButton.setAttribute('aria-pressed',String(paused));motionButton.textContent=paused?'Включить движение':'Остановить движение';
  if(reduced.matches||paused||!window.gsap||!window.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);
  motionContext=gsap.context(()=>{
   const hero=document.querySelector('.c1-hero'),portal=document.querySelector('.c1-portal');
   const journey=gsap.timeline({scrollTrigger:{id:'c1-portal-journey',trigger:hero,start:'top top',end:()=>'+='+Math.round(innerHeight*(innerWidth<700?1.05:1.35)),pin:true,scrub:.55,anticipatePin:1,invalidateOnRefresh:true}});
   journey.to('.c1-hero-heading,.c1-wordmark,.c1-dock',{opacity:0,y:-24,duration:.23,ease:'power1.out'},0)
    .to(portal,{scale:()=>Math.max(innerWidth/(portal.offsetWidth*.5),innerHeight/(portal.offsetHeight*.7))*1.35,y:()=>innerHeight*.5-(portal.offsetTop+portal.offsetHeight*.45),duration:.88,ease:'power1.in'},0)
    .fromTo('.c1-arrival',{opacity:0,scale:1.1},{opacity:1,scale:1,duration:.2,ease:'power1.inOut'},.8);
   gsap.fromTo('.c1-room-copy',{opacity:0,y:36},{opacity:1,y:0,duration:1,ease:'none',scrollTrigger:{trigger:room,start:'top 90%',end:'top 40%',scrub:.5}});
   document.querySelectorAll('.c1-scene:not(.c1-room)').forEach(scene=>gsap.fromTo(scene.querySelector('.c1-scene-image'),{scale:1.07},{scale:1,ease:'none',scrollTrigger:{trigger:scene,start:'top bottom',end:'bottom top',scrub:1}}));
   document.querySelectorAll('.c1-example').forEach(el=>gsap.fromTo(el.querySelector('.c1-example-photo'),{opacity:.55,y:30},{opacity:1,y:0,ease:'none',scrollTrigger:{trigger:el,start:'top 98%',end:'top 73%',scrub:.5}}));
  });
  ScrollTrigger.refresh();
 });
 if(belowPortal)scrollTo({top:scrollY+room.getBoundingClientRect().top-roomBefore,behavior:'instant'});
}
motionButton.addEventListener('click',()=>{paused=!paused;configureMotion()});reduced.addEventListener('change',configureMotion);configureMotion();
let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(configureMotion,220)});
document.fonts.ready.then(refreshGeometry);
// Retain no-JS anchors, and animate only deliberate navigation clicks.
document.querySelectorAll('a[href^="#"]:not([data-subject])').forEach(link=>link.addEventListener('click',async e=>{
 if(e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
 const target=document.getElementById(link.hash.slice(1));if(!target)return;e.preventDefault();
 if(menu.contains(link))await closeMenu(false);
 history.pushState(null,'',link.hash);
 const top=link.hash==='#home'?0:target.getBoundingClientRect().top+scrollY;
 scrollTo({top,behavior:reduced.matches||paused?'instant':'smooth'});
 if(menu.contains(link)){target.setAttribute('tabindex','-1');target.focus({preventScroll:true})}
}));
document.querySelectorAll('.c1-accordion details').forEach(details=>{
 const summary=details.querySelector('summary');let animation,closing=false;
 summary.addEventListener('click',e=>{
  if(reduced.matches||paused||!details.animate){setTimeout(refreshGeometry,0);return}
  e.preventDefault();const from=details.getBoundingClientRect().height;const wantsClose=animation?!closing:details.open;animation?.cancel();closing=wantsClose;details.open=true;
  const to=wantsClose?summary.getBoundingClientRect().height+1:details.getBoundingClientRect().height;
  details.style.overflow='hidden';animation=details.animate({height:[from+'px',to+'px']},{duration:360,easing:'cubic-bezier(.2,.7,.2,1)'});
  animation.onfinish=()=>{details.open=!wantsClose;details.style.overflow='';animation=null;refreshGeometry()};
 });
});
const gallery=document.querySelector('#gallery-dialog'),galleryButtons=[...document.querySelectorAll('[data-gallery-image]')];let galleryIndex=0,galleryFocus;
function showGallery(index){galleryIndex=(index+galleryButtons.length)%galleryButtons.length;const button=galleryButtons[galleryIndex];const img=gallery.querySelector('#gallery-image');img.src=button.dataset.galleryImage;img.alt=button.querySelector('img').alt;gallery.querySelector('#gallery-title').textContent=button.dataset.galleryTitle;gallery.querySelector('#gallery-post').href=button.dataset.galleryPost}
galleryButtons.forEach((button,index)=>button.addEventListener('click',e=>{if(e.button||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();galleryFocus=button;showGallery(index);gallery.showModal();updateScrollLock();gallery.querySelector('.c1-gallery-close').focus()}));
gallery.querySelector('.c1-gallery-close').addEventListener('click',()=>gallery.close());gallery.querySelector('.c1-gallery-prev').addEventListener('click',()=>showGallery(galleryIndex-1));gallery.querySelector('.c1-gallery-next').addEventListener('click',()=>showGallery(galleryIndex+1));gallery.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showGallery(galleryIndex-1)}if(e.key==='ArrowRight'){e.preventDefault();showGallery(galleryIndex+1)}});gallery.addEventListener('close',()=>{updateScrollLock();galleryFocus?.focus({preventScroll:true})});gallery.addEventListener('click',e=>{if(e.target===gallery){const rect=gallery.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)gallery.close()}});

const dialog=document.querySelector('#request-dialog'),form=document.querySelector('#request-form'),result=document.querySelector('#request-result'),text=document.querySelector('#request-text'),status=document.querySelector('#request-status');let dialogFocus;
function openRequest(subject){dialogFocus=document.activeElement;if(subject){const select=form.elements.subject;if([...select.options].some(o=>o.value===subject))select.value=subject}if(!dialog.open){dialog.showModal();document.body.classList.add('c1-overlay-open')}form.elements.name.focus()}
function closeRequest(){dialog.close()}
document.querySelectorAll('.c1-request').forEach(button=>{button.hidden=false;button.addEventListener('click',()=>openRequest())});document.querySelectorAll('[data-subject]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openRequest(a.dataset.subject)}));dialog.querySelector('.c1-dialog-close').addEventListener('click',closeRequest);dialog.addEventListener('close',()=>{updateScrollLock();dialogFocus?.focus({preventScroll:true})});dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)closeRequest()}});
['name','message'].forEach(key=>form.elements[key].addEventListener('input',()=>form.elements[key].setCustomValidity('')));form.addEventListener('submit',e=>{e.preventDefault();form.elements.name.setCustomValidity(form.elements.name.value.trim()?'':'Укажите ваше имя.');form.elements.message.setCustomValidity(form.elements.message.value.trim()?'':'Расскажите о вашей задаче.');if(!form.reportValidity())return;const data=new FormData(form);text.value=`Здравствуйте, DecoFlowers!\n\nМеня зовут ${data.get('name').trim()}.\nИнтересует: ${data.get('subject')}.\n\n${data.get('message').trim()}${data.get('phone').trim()?`\n\nТелефон для связи: ${data.get('phone').trim()}`:''}\n\nПодскажите, пожалуйста, доступные варианты и условия.`;form.hidden=true;result.hidden=false;status.textContent='Запрос подготовлен. Вы можете изменить текст перед передачей бренду.';text.focus()});
document.querySelector('#edit-request').addEventListener('click',()=>{result.hidden=true;form.hidden=false;form.elements.message.focus()});document.querySelector('#copy-request').addEventListener('click',async()=>{try{if(!navigator.clipboard)throw new Error();await navigator.clipboard.writeText(text.value);status.textContent='Текст скопирован. Откройте Instagram и вставьте его в сообщение.'}catch{ text.focus();text.select();status.textContent='Текст выделен. Скопируйте его сочетанием Ctrl+C или через меню устройства.'}});document.querySelector('#save-request').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([text.value],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='DecoFlowers-запрос.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Текст запроса сохранён в файл. Сообщение ещё не отправлено.'});
})();
