const capaJogo=document.getElementById("capaJogo"),logoJogo=document.getElementById("logoJogo"),backgroundJogo=document.getElementById("backgroundJogo"),colarCapa=document.getElementById("colarCapa"),colarLogo=document.getElementById("colarLogo"),colarBackground=document.getElementById("colarBackground");function colarImagem(e,o,t,a,n){navigator.clipboard.read().then((c=>{for(const l of c)if(l.types.includes("image/png")||l.types.includes("image/jpeg")){l.getType("image/png").then((c=>{const l=new FileReader;l.onload=function(c){const l=c.target.result,r=new Image;r.src=l,r.style.minWidth=o,r.style.minHeight=t,r.style.maxWidth=a,r.style.maxHeight=n,r.draggable=!1,r.id="draggableImage",r.style.position="absolute",e.innerHTML="",e.appendChild(r),nomeFoto.focus();const m=document.getElementById("gradientOverlay");imagemArrastavel(r),e===capaJogo&&(capaJogo.style.backgroundColor="#000"),e===backgroundJogo&&(m.style.display="block",jogo.style.backgroundColor="#202020")},l.readAsDataURL(c)}));break}})).catch((e=>{console.error("Failed to read clipboard contents: ",e)}))}function imagemArrastavel(e){let o,t,a,n,c=!1;function l(l){if(c){const c=l.clientX,r=l.clientY,m=c-o,d=r-t;e.style.left=a+m+"px",e.style.left=a+m+"px",e.style.top=n+d+"px"}}e.addEventListener("mousedown",(r=>{c=!0,o=r.clientX,t=r.clientY,a=e.offsetLeft,n=e.offsetTop,e.style.zIndex=1e3,document.addEventListener("mousemove",l)})),document.addEventListener("mouseup",(()=>{c&&(c=!1,e.style.zIndex=2,document.removeEventListener("mousemove",l))}))}colarCapa.addEventListener("click",(()=>{colarImagem(capaJogo,"auto","480px","auto","480px")})),colarLogo.addEventListener("click",(()=>{colarImagem(logoJogo,"180px","auto","180px","auto")})),colarBackground.addEventListener("click",(()=>{colarImagem(backgroundJogo,"auto","480px","auto","480px")}));const imgElements=[document.getElementById("logoJogo"),document.getElementById("capaJogo"),document.getElementById("backgroundJogo")],scaleImages=[1,1,1];function setTransformImg(e,o){e.style.transform=1===o?`scale(${scaleImages[o]}) skewX(5.9deg)`:`scale(${scaleImages[o]})`}imgElements.forEach(((e,o)=>{e.onwheel=function(t){t.preventDefault(),(t.wheelDelta?t.wheelDelta:-t.deltaY)>0?scaleImages[o]*=1.05:scaleImages[o]/=1.05,setTransformImg(e.firstChild,o)}}));const jogo=document.getElementById("jogo"),nomeFoto=document.getElementById("nomeFoto"),botaoConverterParaPNG=document.getElementById("converterParaPNG");function salvarComoPNG(){const e=nomeFoto.value.trim()||"Imagem",o=document.getElementById("jogo"),t=o.offsetHeight;domtoimage.toBlob(o,{width:o.offsetWidth,height:t,style:{transform:"scale(1)",left:0,top:0}}).then((o=>{const t=document.createElement("a");t.href=window.URL.createObjectURL(o),t.download=`${e}.png`,t.click()})).catch((e=>{console.error("Erro ao salvar como PNG: ",e)}))}botaoConverterParaPNG.addEventListener("click",salvarComoPNG),nomeFoto.addEventListener("keypress",(function(e){"Enter"===e.key&&salvarComoPNG()}));