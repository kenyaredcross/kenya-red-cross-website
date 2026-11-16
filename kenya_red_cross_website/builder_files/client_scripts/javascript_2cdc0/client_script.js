(function(){
if(window.__krcsMap)return;
function start(){
var svg=document.getElementById('map'),g=document.getElementById('layer');
if(!svg||!g||!document.getElementById('dgrid'))return false;
var v=svg.getAttribute('viewBox').split(' ').map(Number),W=v[2],H=v[3],vb={x:0,y:0,w:W,h:H},sel=null,moved=false,paths={},names=[],drag=null;
function setVB(){var r=svg.clientWidth/svg.clientHeight||1;if(vb.w/vb.h>r)vb.h=vb.w/r;else vb.w=vb.h*r;
 svg.setAttribute('viewBox',vb.x+' '+vb.y+' '+vb.w+' '+vb.h);var z=W/vb.w;svg.classList.toggle('zl',z>=2.4);svg.style.touchAction=z>1.05?'none':'pan-y'}
function fit(){vb={x:0,y:0,w:W,h:H};var r=svg.clientWidth/svg.clientHeight||1;if(W/H<r){vb.w=H*r;vb.x=-(vb.w-W)/2}else{vb.h=W/r;vb.y=-(vb.h-H)/2}setVB()}
function zoom(f){var cx=vb.x+vb.w/2,cy=vb.y+vb.h/2,nw=Math.min(Math.max(vb.w/f,W/10),W*1.6),k=nw/vb.w;vb.w=nw;vb.h*=k;vb.x=cx-vb.w/2;vb.y=cy-vb.h/2;setVB()}
function panel(n){var p=document.getElementById('panel');p.textContent='';var h=document.createElement('h3'),a=document.createElement('p'),m=document.createElement('p');m.className='m';
 if(!n){h.textContent='Select a county';a.textContent='Choose a county on the map, or use the directory below.'}
 else{h.textContent=n+' County';a.textContent='Kenya Red Cross county branch.';m.textContent='Branch address and contact details are not available on this page yet.'}
 p.appendChild(h);p.appendChild(a);if(n)p.appendChild(m)}
function pick(n,z){if(sel)paths[sel].classList.remove('sel');sel=n;var p=paths[n];p.classList.add('sel');g.insertBefore(p,g.querySelector('.lbl'));panel(n);
 if(z){var bb=p.getBBox(),r=svg.clientWidth/svg.clientHeight||1,w=Math.max(bb.width*1.5,60),h=Math.max(bb.height*1.5,60);if(w/h<r)w=h*r;else h=w/r;
  vb={x:bb.x+bb.width/2-w/2,y:bb.y+bb.height/2-h/2,w:w,h:h};setVB();var s=document.getElementById('map-section');if(s)s.scrollIntoView({behavior:'smooth',block:'start'})}}
g.querySelectorAll('.cty').forEach(function(p){var n=p.getAttribute('data-n');paths[n]=p;names.push(n);
 p.addEventListener('click',function(){if(!moved)pick(n,false)});
 p.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(n,false)}})});
svg.addEventListener('pointerdown',function(e){drag={x:e.clientX,y:e.clientY,vx:vb.x,vy:vb.y};moved=false});
window.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4){moved=true;svg.style.cursor='grabbing'}
 if(moved){var k=vb.w/svg.clientWidth;vb.x=drag.vx-dx*k;vb.y=drag.vy-dy*k;setVB()}});
window.addEventListener('pointerup',function(){drag=null;svg.style.cursor='';setTimeout(function(){moved=false},0)});
document.getElementById('zin').onclick=function(){zoom(1.5)};
document.getElementById('zout').onclick=function(){zoom(1/1.5)};
document.getElementById('zreset').onclick=fit;
window.addEventListener('resize',setVB);
var dg=document.getElementById('dgrid');
function list(){var q=document.getElementById('dq').value.trim().toLowerCase(),r=names.filter(function(n){return n.toLowerCase().indexOf(q)>-1});dg.textContent='';
 document.getElementById('cnt').textContent=r.length+(r.length===1?' county':' counties');document.getElementById('none').hidden=r.length>0;
 r.forEach(function(n){var li=document.createElement('li');li.className='dc';var d=document.createElement('div'),b=document.createElement('b'),s=document.createElement('small');b.textContent=n;s.textContent='County branch';d.appendChild(b);d.appendChild(s);
  var bt=document.createElement('button');bt.type='button';bt.textContent='View on map';bt.setAttribute('aria-label','View '+n+' on the map');bt.onclick=function(){pick(n,true)};li.appendChild(d);li.appendChild(bt);dg.appendChild(li)})}
document.getElementById('dq').addEventListener('input',list);
window.__krcsMap=true;fit();list();return true}
(function w(n){if(start())return;if(n>0)setTimeout(function(){w(n-1)},200);else console.warn('KRCS map: markup not found (#map).')})(100);
})();