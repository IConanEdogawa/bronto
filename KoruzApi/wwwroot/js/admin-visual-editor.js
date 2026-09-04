(function(){
  var n=8, chunks=[], loaded=0;
  function tryRun(){
    if(loaded<n) return;
    try {
      var code = atob(chunks.join(''));
      (0,eval)(code);
    } catch(e) { console.error('editor decode/run failed', e); }
  }
  for(var i=0;i<n;i++){
    (function(i){
      fetch('/js/editor-b64-'+i+'.txt?v='+Date.now(),{cache:'no-store'})
        .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.text(); })
        .then(function(t){ chunks[i]=t.trim(); loaded++; tryRun(); })
        .catch(function(e){ console.error('editor chunk', i, e); });
    })(i);
  }
})();
