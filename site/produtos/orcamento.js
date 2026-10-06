var ORC = (function(){
  var CH = 'caborge_orcamento_v1', WA = '556536651005';
  function ler(){ try { return JSON.parse(localStorage.getItem(CH)) || {itens:{}}; } catch(e){ return {itens:{}}; } }
  function gravar(o){ try { localStorage.setItem(CH, JSON.stringify(o)); } catch(e){} }
  function esc(s){ return String(s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function total(o){ return Object.keys(o.itens).length; }
  function barra(){ var o = ler(), n = total(o);
    document.getElementById('nb').textContent = n;
    document.getElementById('barra').style.display = n ? 'block' : 'none'; }
  function add(bt){
    var c = bt.closest('.c'), sel = c.querySelector('select'), qtd = c.querySelector('.q');
    var op = sel ? sel.options[sel.selectedIndex] : c.querySelector('.un');
    var cod = op.getAttribute('data-c'), nome = op.getAttribute('data-n');
    var q = Math.max(1, parseInt(qtd.value, 10) || 1);
    var o = ler(); var it = o.itens[cod] || {n: nome, q: 0}; it.q += q; o.itens[cod] = it; gravar(o);
    bt.textContent = '✓ Adicionado (' + it.q + ')'; bt.classList.add('ok');
    setTimeout(function(){ bt.textContent = '+ Adicionar ao orçamento'; bt.classList.remove('ok'); }, 1600);
    barra();
  }
  function lista(){
    var o = ler(), h = '', ks = Object.keys(o.itens);
    if(!ks.length) h = '<p style="color:#5b6472">Nenhum item ainda. Escolha os produtos e toque em “Adicionar ao orçamento”.</p>';
    ks.forEach(function(k){ var it = o.itens[k];
      h += '<div class="it"><div>' + esc(it.n) + '<small>Cód. ' + esc(k) + '</small><button class="rm" onclick="ORC.mudar(\'' + k + '\',-999)">remover</button></div>' +
           '<div class="qt"><button onclick="ORC.mudar(\'' + k + '\',-1)">−</button><span>' + it.q + '</span><button onclick="ORC.mudar(\'' + k + '\',1)">+</button></div></div>'; });
    document.getElementById('lista').innerHTML = h;
    document.getElementById('onome').value = o.nome || '';
    document.getElementById('otel').value = o.tel || '';
  }
  function mudar(k, d){ var o = ler(); if(!o.itens[k]) return; o.itens[k].q += d;
    if(o.itens[k].q <= 0) delete o.itens[k]; gravar(o); lista(); barra(); }
  function abrir(){ lista(); document.getElementById('painel').style.display = 'block'; }
  function fechar(){ document.getElementById('painel').style.display = 'none'; }
  function enviar(){
    var o = ler(), nome = document.getElementById('onome').value.trim(), tel = document.getElementById('otel').value.trim(),
        obs = document.getElementById('oobs').value.trim(), err = document.getElementById('erro');
    o.nome = nome; o.tel = tel; gravar(o);
    if(!total(o)){ err.textContent = 'Adicione pelo menos um produto.'; return; }
    if(nome.length < 2){ err.textContent = 'Informe o seu nome.'; return; }
    if(tel.replace(/\D/g,'').length < 10){ err.textContent = 'Informe o telefone com DDD.'; return; }
    err.textContent = '';
    var t = 'Olá, Caborge! Meu nome é ' + nome + ', telefone ' + tel + '.\nGostaria de um orçamento destes itens:\n\n';
    Object.keys(o.itens).forEach(function(k, i){ var it = o.itens[k]; t += (i+1) + ') ' + it.q + 'x — cód. ' + k + ' — ' + it.n + '\n'; });
    if(obs) t += '\nObservação: ' + obs + '\n';
    t += '\n(Montado no catálogo caborge.com.br/produtos)';
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(t), '_blank');
  }
  document.addEventListener('click', function(ev){
    var b = ev.target.closest('.btadd'); if(b){ add(b); return; }
    var d = ev.target.closest('.ds'); if(d) d.classList.toggle('aberta');
  });
  document.addEventListener('DOMContentLoaded', barra);
  window.addEventListener('pageshow', barra);
  return {abrir: abrir, fechar: fechar, mudar: mudar, enviar: enviar};
})();
