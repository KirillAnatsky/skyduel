// Same sprites as the game (Render/PixelArt.swift, Render/Skins.swift)
const PX = {};
PX.planeRows = ["......WWWWWWW...","D......K....K...","DD.KS..K....K..P","DDBBBBBBBBBBBBNP","DDBBBBBBBBBBBBNP",".DDDDDBBBBBBBBNP","......WWWWWWW..P","........K.......",".......KKK......"];
PX.skinRows = {
  1: ["......WWWWWWW...","D......K....K...","DD.KS..K....K..P","DDBBBBXXBBBXXBNP","DDBBBBXXBBBXXBNP",".DDDDDXXBBBXXBNP","......WWWWWWW..P","........K.......",".......KKK......"],
  2: ["......WWWWWWW...","D......K....K...","DD.KS..K....K..P","DDBBBBBBBBBXKBNP","DDBBBBBBBBBBBBNP",".DDDDDBBBXKXKXNP","......WWWWWWW..P","........K.......",".......KKK......"],
  3: ["......WXWXWXW...","D......K....K...","DD.KS..K....K..P","DDBDBDBDBDBDBDNP","DDDBDBDBDBDBDBNP",".DDDDDBDBDBDBDNP","......WXWXWXW..P","........K.......",".......KKK......"],
};
PX.skinRows[6] = PX.skinRows[1];
PX.pilotFall = ["S..S","SKKS","BSSB",".BB.",".DD.","D..D","K..K"];
PX.pilotStand = [".KK.",".SS.","BBBB","SBBS",".DD.",".DD.",".KK."];
PX.canopy = ["...CCCCCC...",".CRRCCCCRRC.","CCRRCCCCRRCC","L..........L",".L........L.","..L......L..","...L....L...","....L..L...."];
PX.hangar = ["....RRRRRR....","..RRRRRRRRRR..","RRRRRRRRRRRRRR","DDDDDDDDDDDDDD","WWWWWWWWWWWWWW","WWWKKKKKKKKWWW","WWWKkKKKKkKWWW","WWWKKKKKKKKWWW","WWWKKKKKKKKWWW","WWWKKKKKKKKWWW"];
PX.tree = [".GGG.","GGgGG","GgGGG","GGGgG",".GGG.","..T..","..T.."];
PX.clouds = [
 [".....WWWW.......","...WWWWWWWW.WW..","..WWWWWWWWWWWWW.",".WWWWWWWWWWWWWWW","WWWWWWWWWWWWWWWW",".ggggggggggggggg"],
 ["....WWW.....","..WWWWWWWW..",".WWWWWWWWWW.","WWWWWWWWWWWW",".gggggggggg."],
 ["........WWW.........","...WWW.WWWWWW.......","..WWWWWWWWWWWWWWW...",".WWWWWWWWWWWWWWWWWW.","WWWWWWWWWWWWWWWWWWWW",".gggggggggggggggggg."]];
PX.team = t => t===0 ? {B:"#D94141",D:"#8E2323",W:"#F4A3A3"} : {B:"#3E73D6",D:"#1F3F86",W:"#A9C4F6"};
PX.ink = "#1D2333";
PX.planePalette = (team, skin=0) => {
  const t = PX.team(team);
  const p = {B:t.B,D:t.D,W:t.W,K:PX.ink,S:"#F2C29B",N:"#4A4A4A",X:"#FFFFFF",P:"rgba(221,221,221,0.9)"};
  if (skin===4) Object.assign(p,{W:"#F2C230",N:"#B8860B",D:"#B8860B"});
  if (skin===5) Object.assign(p,{B:"#2E2F3A",D:"#16171D",W:t.B,N:t.B});
  if (skin===6) Object.assign(p,{B:"#F4E7C5",D:t.D,W:t.B,X:t.B});
  return p;
};
PX.draw = (ctx, rows, pal, x, y, px, flip=false) => {
  for (let r=0;r<rows.length;r++) for (let c=0;c<rows[r].length;c++){
    const col = pal[rows[r][c]]; if(!col) continue;
    const cc = flip ? rows[r].length-1-c : c;
    ctx.fillStyle = col; ctx.fillRect(Math.round(x+cc*px), Math.round(y+r*px), Math.ceil(px), Math.ceil(px));
  }
};
// Draw a plane centered at (cx,cy), rotated by angle (radians, math convention, y up -> we flip)
PX.plane = (ctx, team, cx, cy, px, angle=0, skin=0) => {
  const rows = PX.skinRows[skin] || PX.planeRows;
  const w = 16*px, h = 9*px;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(-angle);
  if (Math.cos(angle) < 0) ctx.scale(1,-1);
  PX.draw(ctx, rows, PX.planePalette(team, skin), -w/2, -h/2, px);
  ctx.restore();
};
PX.pilot = (ctx, team, x, groundY, px, chute=true, flip=false) => {
  const t = PX.team(team);
  const pal = {B:t.B,D:t.D,K:PX.ink,S:"#F2C29B"};
  const ph = 7*px;
  PX.draw(ctx, chute?PX.pilotFall:PX.pilotStand, pal, x-2*px, groundY-ph, px, flip);
  if (chute) PX.draw(ctx, PX.canopy, {C:"#F4E7C5",R:t.B,L:"#555"}, x-6*px, groundY-ph-8*px+2, px);
};
PX.scene = (ctx, W, H, opts={}) => {
  // world 640x300 scaled to fill height
  const s = opts.scale || H/300;
  const gy = H - 28*s;
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,"#4FA8E6"); g.addColorStop(1,"#A6DDF7");
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  ctx.fillStyle="#5DAE3B"; ctx.fillRect(0,gy,W,H-gy);
  ctx.fillStyle="#86CF55"; ctx.fillRect(0,gy,W,3*s);
  ctx.fillStyle="#4A8A2C"; ctx.fillRect(0,gy+12*s,W,3*s);
  const trees = opts.trees || [0.22,0.27,0.47,0.53,0.71,0.78];
  trees.forEach((t,i)=>PX.draw(ctx,PX.tree,{G:"#2F7D32",g:"#4CAF50",T:"#6D4C41"},t*W,gy-7*(2.2+(i%2)*0.4)*s+s,(2.2+(i%2)*0.4)*s));
  (opts.hangars||[0.1,0.9]).forEach((hx,i)=>{const t=PX.team(i);PX.draw(ctx,PX.hangar,{R:t.B,D:t.D,W:"#F4E7C5",K:"#3B2F2A",k:"#F7D774"},hx*W-7*2.2*s,gy-10*2.2*s+s,2.2*s)});
  return {s, gy};
};
PX.cloud = (ctx, k, x, y, px, alpha=0.95) => { ctx.save(); ctx.globalAlpha=alpha; PX.draw(ctx, PX.clouds[k], {W:"#FFFFFF",g:"#DCEAF3"}, x, y, px); ctx.restore(); };
PX.explosion = (ctx, x, y, r, seed=1) => {
  let rnd = (()=>{let a=seed*9301+49297;return()=>{a=(a*9301+49297)%233280;return a/233280;}})();
  ctx.save();
  for (let i=0;i<7;i++){ctx.fillStyle=i%2?"#FF5722":"#FF9800";ctx.beginPath();ctx.arc(x+(rnd()-0.5)*r,y+(rnd()-0.5)*r,r*(0.35+rnd()*0.35),0,7);ctx.fill();}
  ctx.fillStyle="#FFF3C4";ctx.beginPath();ctx.arc(x,y,r*0.45,0,7);ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,0.8)";ctx.lineWidth=r*0.08;ctx.beginPath();ctx.arc(x,y,r*1.5,0,7);ctx.stroke();
  for(let i=0;i<34;i++){const a=rnd()*6.28,d=r*(0.8+rnd()*1.6),sz=r*(0.05+rnd()*0.09);ctx.fillStyle=["#FF5722","#FF9800","#FFEB3B","#FFFFFF","#8E2323","#555"][i%6];ctx.fillRect(x+Math.cos(a)*d,y+Math.sin(a)*d,sz,sz);}
  ctx.restore();
};
PX.smoke = (ctx, x0, y0, x1, y1, n, size, dark=true, seed=3) => {
  let a=seed; const rnd=()=>{a=(a*9301+49297)%233280;return a/233280;};
  for(let i=0;i<n;i++){const t=i/n;const sz=size*(0.5+t*1.6);ctx.fillStyle=dark?`rgba(60,60,60,${0.85-t*0.7})`:`rgba(230,230,230,${0.8-t*0.6})`;
    const x=x0+(x1-x0)*t+(rnd()-0.5)*size*2,y=y0+(y1-y0)*t+(rnd()-0.5)*size*2;ctx.fillRect(x,y,sz,sz);
    if(dark&&i<n*0.35&&rnd()>0.5){ctx.fillStyle=rnd()>0.5?"#FF9800":"#FFC107";ctx.fillRect(x+sz*0.2,y+sz*0.2,sz*0.6,sz*0.6);}}
};
PX.bullets = (ctx, x0, y0, ang, n, gap, sz) => { ctx.fillStyle=PX.ink; for(let i=0;i<n;i++) ctx.fillRect(x0+Math.cos(ang)*gap*i-sz/2, y0-Math.sin(ang)*gap*i-sz/2, sz, sz); };
