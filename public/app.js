const API_URL = 'http://localhost:3000/api';

async function fetchEvents() {
  try {
    const res = await fetch(`${API_URL}/event`);
    const data = await res.json();
    const container = document.getElementById('events');
    container.innerHTML = '';
    data.collection.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML = `
        <h3>${ev.name}</h3>
        <p>${ev.description || ''}</p>
        <p><strong>Fecha:</strong> ${ev.start_date}</p>
        <button data-id="${ev.id}">Ver detalles</button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error al cargar eventos', err);
  }
}

async function fetchEventDetail(id) {
  try {
    const res = await fetch(`${API_URL}/event/${id}`);
    const ev = await res.json();
    const detail = document.getElementById('detail');
    detail.innerHTML = `
      <h3>${ev.name}</h3>
      <p>${ev.description}</p>
      <p><strong>Fecha:</strong> ${ev.start_date}</p>
      <p><strong>Duración:</strong> ${ev.duration_in_minutes} minutos</p>
      <p><strong>Precio:</strong> $${ev.price}</p>
      <p><strong>Cupo máximo:</strong> ${ev.max_assistance}</p>
      <p><strong>Ubicación:</strong> ${ev.event_location ? ev.event_location.name + ' - ' + ev.event_location.full_address : 'N/A'}</p>
    `;
  } catch (err) {
    console.error('Error al cargar detalle', err);
  }
}

document.addEventListener('click', e => {
  if (e.target.matches('button[data-id]')) {
    const id = e.target.getAttribute('data-id');
    fetchEventDetail(id);
  }
});

fetchEvents();
