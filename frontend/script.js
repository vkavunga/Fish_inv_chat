const backendUrl = 'https://your-backend-url.onrender.com';

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const res = await fetch(`${backendUrl}/fish`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  alert(data.message);
  e.target.reset();
  loadFish();
});

async function loadFish() {
  const res = await fetch(`${backendUrl}/fish`);
  const fish = await res.json();
  const list = document.getElementById('fishList');
  list.innerHTML = '';

  fish.forEach(f => {
    const div = document.createElement('div');
    div.innerHTML = `
      <form onsubmit="return updateFish('${f._id}', this)">
        <input type="text" name="fishName" value="${f.fishName}">
        <input type="text" name="placeOfCatch" value="${f.placeOfCatch}">
        <input type="text" name="catchLocation" value="${f.catchLocation}">
        <button type="submit">Update</button>
        <button onclick="deleteFish('${f._id}'); return false;">Delete</button>
      </form>
      <img src="${f.qrImageUrl}" width="100">
      <img src="${f.fishImageUrl}" width="150"><hr>
    `;
    list.appendChild(div);
  });
}

async function deleteFish(id) {
  if (confirm('Are you sure you want to delete this entry?')) {
    await fetch(`${backendUrl}/fish/${id}`, { method: 'DELETE' });
    loadFish();
  }
}

async function updateFish(id, form) {
  const data = {
    fishName: form.fishName.value,
    placeOfCatch: form.placeOfCatch.value,
    catchLocation: form.catchLocation.value
  };

  await fetch(`${backendUrl}/fish/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  alert('Updated');
  return false;
}

window.onload = loadFish;
