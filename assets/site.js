(function(){
  var saved=null; try{saved=localStorage.getItem("lang")}catch(e){}
  var l=saved||((navigator.language||"en").toLowerCase().startsWith("ru")?"ru":"en");
  function set(x){document.documentElement.lang=x;try{localStorage.setItem("lang",x)}catch(e){}
    document.querySelectorAll(".lang button").forEach(function(b){b.classList.toggle("on",b.dataset.set===x)});}
  document.addEventListener("click",function(e){var b=e.target.closest(".lang button");if(b)set(b.dataset.set)});
  set(l);
})();
