const backendUrl = "https://fish-inv-chat.onrender.com";

// Load fish list
async function loadFish() {
  const res = await fetch(`${backendUrl}/fish`);
  const data = await res.json();

  const list = document.getElementById('fishList');
  if (!list) return;

  list.innerHTML = '';
  data.forEach(fish => {
    const div = document.createElement('div');
    div.className = 'fish-entry';
    div.innerHTML = `
      <h3>${fish.fishName}</h3>
      <p><strong>Place of Catch:</strong> ${fish.placeOfCatch}</p>
      <p><strong>Location:</strong> ${fish.catchLocation}</p>
      <img src="${fish.qrImageUrl}" alt="QR Code" width="100">
      <img src="${fish.fishImageUrl}" alt="Fish Image" width="100">
      ${window.location.pathname.includes('admin') ? `
        <br>
        <button onclick="deleteFish('${fish._id}')">Delete</button>
        <button onclick="prefillForm('${fish._id}', '${fish.fishName}', '${fish.placeOfCatch}', '${fish.catchLocation}')">Edit</button>
      ` : ''}
    `;
    list.appendChild(div);
  });
}

// Upload new fish
async function uploadFish(event) {
  event.preventDefault();
  const form = document.getElementById('uploadForm');
  const formData = new FormData(form);

  const res = await fetch(`${backendUrl}/fish`, {
    method: 'POST',
    body: formData,
  });

  const result = await res.json();
  alert(result.message);
  form.reset();
  loadFish();
}

// Delete fish
async function deleteFish(id) {
  if (!confirm("Delete this entry?")) return;

  const res = await fetch(`${backendUrl}/fish/${id}`, {
    method: 'DELETE',
  });

  const result = await res.json();
  alert(result.message);
  loadFish();
}

// Prefill edit form
function prefillForm(id, name, place, location) {
  document.getElementById('fishId').value = id;
  document.getElementById('fishNameEdit').value = name;
  document.getElementById('placeOfCatchEdit').value = place;
  document.getElementById('catchLocationEdit').value = location;
  document.getElementById('editSection').style.display = 'block';
}

// Save edits
async function saveEdit(event) {
  event.preventDefault();
  const id = document.getElementById('fishId').value;
  const body = {
    fishName: document.getElementById('fishNameEdit').value,
    placeOfCatch: document.getElementById('placeOfCatchEdit').value,
    catchLocation: document.getElementById('catchLocationEdit').value,
  };

  const res = await fetch(`${backendUrl}/fish/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const result = await res.json();
  alert("Updated successfully");
  document.getElementById('editSection').style.display = 'none';
  loadFish();
}

// Init
window.onload = () => {
  if (document.getElementById('uploadForm')) {
    document.getElementById('uploadForm').addEventListener('submit', uploadFish);
  }
  if (document.getElementById('editForm')) {
    document.getElementById('editForm').addEventListener('submit', saveEdit);
  }
  loadFish();
};
