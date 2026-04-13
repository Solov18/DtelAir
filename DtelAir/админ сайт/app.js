// app.js - Dashboard demo logic (no backend, demo data)
const sections = document.querySelectorAll('.content');
const navLinks = document.querySelectorAll('aside nav a');

// Navigation logic with section-specific rendering
navLinks.forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  navLinks.forEach(x => x.classList.remove('active'));
  a.classList.add('active');
  const s = a.dataset.section;
  sections.forEach(sec => {
    if (sec.id === s) {
      sec.classList.remove('hidden');
      // render only visible section
      if (s === 'overview') renderOverview();
      if (s === 'users') renderUsers();
      if (s === 'points') renderPoints();
      if (s === 'tariffs') renderTariffs();
      if (s === 'connections') renderConnections();
    } else {
      sec.classList.add('hidden');
    }
  });
}));

// Modal logic
const modal = document.getElementById('modal');
document.getElementById('addPointBtn').addEventListener('click', () => openModal('Добавить точку'));
document.getElementById('addPointInline').addEventListener('click', () => openModal('Добавить точку'));
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('saveModal').addEventListener('click', savePoint);

function openModal(title) {
  document.getElementById('modalTitle').innerText = title;
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}

function savePoint() {
  const name = document.getElementById('m_name').value || ('AP-' + Math.floor(Math.random() * 900 + 100));
  const home = document.getElementById('m_home').value || '28к1';
  const host = document.getElementById('m_host').value || ('192.168.50.' + Math.floor(Math.random() * 50 + 10));
  const speed = Number(document.getElementById('m_speed').value) || 10;
  const id = 'p' + Date.now();
  const p = { id, name, home, host, online: true, clients: Math.floor(Math.random() * 10), speed };
  DATA.points.push(p);
  renderPoints();
  closeModal();
}

// Demo data (10+ each)
const DATA = {
  tariffs: Array.from({ length: 10 }, (_, i) => ({
    id: 't' + (i + 1),
    name: 'Тариф ' + (i + 1),
    duration: (i + 1) * 60,
    price: (i + 1) * 50
  })),
  points: Array.from({ length: 100 }, (_, i) => ({
    id: 'p' + (i + 1),
    name: 'AP-' + (i + 1),
    home: '28к' + (i + 1),
    host: '192.168.1.' + (i + 10),
    online: i % 2 === 0,
    clients: Math.floor(Math.random() * 10),
    speed: 10 + i
  })),
  users: Array.from({ length: 200 }, (_, i) => ({
    id: 'u' + (i + 1),
    phone: '+7 918 ' + String(10000000 + i),
    email: 'user' + (i + 1) + '@example.com',
    sessions: Math.floor(Math.random() * 5)
  })),
  connections: Array.from({ length: 20 }, (_, i) => ({
    time: `2025-11-20 ${String(10 + i).padStart(2,'0')}:00`,
    user: 'u' + ((i % 20) + 1),
    mac: 'AA:BB:CC:' + String(i).padStart(2,'0') + ':11:22',
    point: 'p' + ((i % 10) + 1),
    tariff: 't' + ((i % 10) + 1),
    duration: (i % 2 === 0 ? '2ч' : '15м')
  })),
  payments: Array.from({ length: 10 }, (_, i) => ({
    time: `2025-11-${20 + i}`,
    amount: (i + 1) * 100
  }))
};

// --- app.js ---
function renderOverview() {
  const onlinePoints = DATA.points.filter(p => p.online).length;
  const offlinePoints = DATA.points.length - onlinePoints;
  const totalUsers = DATA.users.length;
  const activeUsers = DATA.users.filter(u => u.sessions > 0).length;
  const newUsers = DATA.users.slice(-5).length;
  const maxLoad = Math.max(...DATA.points.map(p => p.clients));
  const avgLoad = (DATA.points.reduce((sum, p) => sum + p.clients, 0) / DATA.points.length).toFixed(1);
  const totalConnections = DATA.connections.length;
  const avgDuration = (() => {
    const mins = DATA.connections.map(c => c.duration.includes('ч') ? parseInt(c.duration) * 60 : parseInt(c.duration));
    return (mins.reduce((a, b) => a + b, 0) / mins.length).toFixed(1);
  })();
  const totalSpeed = DATA.points.reduce((sum, p) => sum + p.speed, 0);
  const hotPoint = DATA.points.reduce((prev, curr) => curr.clients > prev.clients ? curr : prev, {clients:0}).name;
  const totalPayments = DATA.payments.reduce((sum, p) => sum + p.amount, 0);

  const grid = document.querySelector('#overview .grid');
  grid.innerHTML = `
    <div class="card small">
      <div class="card-title"><i class="fa fa-wifi"></i> Точек онлайн</div>
      <div class="card-value">${onlinePoints}</div>
      <canvas class="miniChart" width="100" height="30"></canvas>
    </div>
    <div class="card small">
      <div class="card-title"><i class="fa fa-times-circle"></i> Точек оффлайн</div>
      <div class="card-value">${offlinePoints}</div>
      <canvas class="miniChart" width="100" height="30"></canvas>
    </div>
    <div class="card small">
      <div class="card-title"><i class="fa fa-users"></i> Всего пользователей</div>
      <div class="card-value">${totalUsers}</div>
      <canvas class="miniChart" width="100" height="30"></canvas>
    </div>
    <div class="card small">
      <div class="card-title"><i class="fa fa-user-check"></i> Активные пользователи</div>
      <div class="card-value">${activeUsers}</div>
      <canvas class="miniChart" width="100" height="30"></canvas>
    </div>
    <div class="card small">
      <div class="card-title"><i class="fa fa-user-plus"></i> Новые пользователи</div>
      <div class="card-value">${newUsers}</div>
      <canvas class="miniChart" width="100" height="30"></canvas>
    </div>
    <div class="card small">
      <div class="card-title"><i class="fa fa-tachometer-alt"></i> Макс. нагрузка</div>
      <div class="card-value">${maxLoad}</div>
      <canvas class="miniChart" width="100" height="30"></canvas>
    </div>
    <div class="card small">
      <div class="card-title"><i class="fa fa-chart-line"></i> Средняя нагрузка</div>
      <div class="card-value">${avgLoad}</div>
      <canvas class="miniChart" width="100" height="30"></canvas>
    </div>
    <div class="card small">
      <div class="card-title"><i class="fa fa-network-wired"></i> Всего подключений</div>
      <div class="card-value">${totalConnections}</div>
      <canvas class="miniChart" width="100" height="30"></canvas>
    </div>
    <div class="card small">
      <div class="card-title"><i class="fa fa-clock"></i> Средняя длительность (мин)</div>
      <div class="card-value">${avgDuration}</div>
      <canvas class="miniChart" width="100" height="30"></canvas>
    </div>
    <div class="card small">
      <div class="card-title"><i class="fa fa-bolt"></i> Общая пропускная способность</div>
      <div class="card-value">${totalSpeed} Mbps</div>
      <canvas class="miniChart" width="100" height="30"></canvas>
    </div>
    <div class="card small">
      <div class="card-title"><i class="fa fa-fire"></i> Горячая точка</div>
      <div class="card-value">${hotPoint}</div>
      <canvas class="miniChart" width="100" height="30"></canvas>
    </div>
    <div class="card small">
      <div class="card-title"><i class="fa fa-money-bill-wave"></i> Общие платежи</div>
      <div class="card-value">${totalPayments} ₽</div>
      <canvas class="miniChart" width="100" height="30"></canvas>
    </div>
  `;

  // Мини-графики для всех карточек
  document.querySelectorAll('.miniChart').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    const data = Array.from({length:7},()=>Math.floor(Math.random()*20+5));
    new Chart(ctx, {
      type: 'line',
      data: { labels:['','1','2','3','4','5','6'], datasets:[{data,borderColor:'#14b1ff',backgroundColor:'rgba(20,177,255,0.2)',fill:true,tension:0.3}] },
      options: { responsive:false, plugins:{legend:{display:false}}, scales:{x:{display:false},y:{display:false}} }
    });
  });
}

function renderUsers() {
  const tbody = document.querySelector('#usersTable tbody');
  tbody.innerHTML = '';
  DATA.users.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${u.id}</td><td>${u.phone}</td><td>${u.email}</td><td>${u.sessions}</td><td><button class="btn ghost" onclick="viewUser('${u.id}')">Просмотр</button></td>`;
    tbody.appendChild(tr);
  });

  const tf = document.getElementById('filterTariff');
  tf.innerHTML = '<option value="">Все тарифы</option>';
  DATA.tariffs.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.innerText = t.name;
    tf.appendChild(opt);
  });
}

function renderPoints() {
  const tbody = document.querySelector('#pointsTable tbody');
  tbody.innerHTML = '';
  DATA.points.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.id}</td><td>${p.name}</td><td>${p.home}</td><td>${p.online?'<span style="color:#7df59b">online</span>':'<span style="color:#ff7b7b">offline</span>'}</td><td>${p.clients}</td><td>${p.speed} Mbps</td><td>
      <button class="btn ghost" onclick="toggleOnline('${p.id}')">${p.online?'Отключить':'Включить'}</button>
      <button class="btn ghost" onclick="limitUser('${p.id}')">Лимит</button></td>`;
    tbody.appendChild(tr);
  });
}

function renderTariffs() {
  const tbody = document.querySelector('#tariffsTable tbody');
  tbody.innerHTML = '';
  DATA.tariffs.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${t.id}</td><td>${t.name}</td><td>${t.duration} мин</td><td>${t.price} ₽</td><td><button class="btn ghost" onclick="editTariff('${t.id}')">Ред.</button></td>`;
    tbody.appendChild(tr);
  });
}

function renderConnections() {
  const tbody = document.querySelector('#allConnections tbody');
  tbody.innerHTML = '';
  DATA.connections.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.time}</td><td>${c.user}</td><td>${c.mac}</td><td>${getPointName(c.point)}</td><td>${getTariffName(c.tariff)}</td><td>OK</td>`;
    tbody.appendChild(tr);
  });
}

// Small actions
function getPointName(id){ const p=DATA.points.find(x=>x.id===id); return p? p.name : id; }
function getTariffName(id){ const t=DATA.tariffs.find(x=>x.id===id); return t? t.name : id; }
function viewUser(id){ alert('Просмотр пользователя: ' + id); }
function toggleOnline(id){ const p=DATA.points.find(x=>x.id===id); p.online=!p.online; renderPoints(); renderOverview(); }
function limitUser(id){ alert('Задать лимит пользователям точки ' + id); }
function editTariff(id){ alert('Редактирование тарифа ' + id); }

document.getElementById('refreshBtn').addEventListener('click', ()=>{ renderAll(); alert('Обновлено (демо)'); });

function renderAll() {
  renderOverview();
  renderUsers();
  renderPoints();
  renderTariffs();
  renderConnections();
}

// Initial render
renderAll();
sections.forEach(s=>s.classList.add('hidden'));
document.getElementById('overview').classList.remove('hidden');
navLinks[0].classList.add('active');

function renderPoints() {
  const tbody = document.querySelector('#pointsTable tbody');
  tbody.innerHTML = '';
  DATA.points.forEach(p => {
    const tr = document.createElement('tr');
    tr.className = p.online ? 'row-online' : 'row-offline';
    tr.innerHTML = `<td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.home}</td>
      <td>${p.online ? 'online' : 'offline'}</td>
      <td>${p.clients}</td>
      <td>${p.speed} Mbps</td>
      <td>
        <button class="btn ghost" onclick="toggleOnline('${p.id}')">
          ${p.online ? 'Отключить' : 'Включить'}
        </button>
        <button class="btn ghost" onclick="limitUser('${p.id}')">Лимит</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

// Обновляем таблицу подключений с подсветкой
  const tbody = document.querySelector('#recentConnections tbody');
  tbody.innerHTML = '';
  DATA.connections.slice().reverse().forEach(c => {
    const tr = document.createElement('tr');
    const p = DATA.points.find(x=>x.id===c.point);
    const onlineClass = p && p.online ? 'online' : 'offline';
    tr.innerHTML = `<td>${c.time}</td><td>${c.mac}</td><td class="${onlineClass}">${getPointName(c.point)}</td><td>${getTariffName(c.tariff)}</td><td>${c.duration}</td>`;
    tbody.appendChild(tr);
  });

  // Динамические графики
  const ctx1 = document.getElementById('loadChart').getContext('2d');
  const labels1 = DATA.points.map(p => p.name);
  const data1 = DATA.points.map(p => p.clients);
  if(window.loadChart) window.loadChart.destroy();
  window.loadChart = new Chart(ctx1, {
    type:'bar',
    data: { labels: labels1, datasets:[{label:'Клиенты на точке', data:data1, backgroundColor:DATA.points.map(p=>p.online?'#7df59b':'#ff7b7b')}] },
    options:{responsive:true, plugins:{legend:{display:false}}, animation:{duration:800}}
  });

  const ctx2 = document.getElementById('statusChart').getContext('2d');
  const onlineCount = DATA.points.filter(p=>p.online).length;
  const offlineCount = DATA.points.length - onlineCount;
  if(window.statusChart) window.statusChart.destroy();
  window.statusChart = new Chart(ctx2, {
    type:'doughnut',
    data: { labels:['Онлайн','Оффлайн'], datasets:[{data:[onlineCount, offlineCount], backgroundColor:['#7df59b','#ff7b7b']}] },
    options:{responsive:true, plugins:{legend:{position:'bottom'}}, animation:{duration:800}}
  });

  const ctx3 = document.getElementById('paymentsChart').getContext('2d');
  const labels3 = DATA.payments.map(p=>p.time);
  const data3 = DATA.payments.map(p=>p.amount);
  if(window.paymentsChart) window.paymentsChart.destroy();
  window.paymentsChart = new Chart(ctx3, {
    type:'line',
    data:{ labels:labels3, datasets:[{label:'Платежи', data:data3, borderColor:'#7df59b', backgroundColor:'rgba(125,245,155,0.2)'}] },
    options:{responsive:true, plugins:{legend:{display:false}}, animation:{duration:800}}
  });

  const ctx4 = document.getElementById('speedChart').getContext('2d');
  const labels4 = DATA.points.map(p=>p.name);
  const data4 = DATA.points.map(p=>p.speed);
  if(window.speedChart) window.speedChart.destroy();
  window.speedChart = new Chart(ctx4, {
    type:'line',
    data:{ labels:labels4, datasets:[{label:'Скорость точки Mbps', data:data4, borderColor:'#14b1ff', backgroundColor:'rgba(20,177,255,0.2)'}] },
    options:{responsive:true, plugins:{legend:{display:false}}, animation:{duration:800}}
  });
