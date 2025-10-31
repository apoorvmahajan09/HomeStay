// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("viewMapBtn");
  if (!btn) return; // only run on show.ejs

  const mapContainer = document.getElementById("mapContainer");
  let map; // store map instance

  mapModal.addEventListener("shown.bs.modal", () => {
    const lat = parseFloat(btn.dataset.lat);
    const lng = parseFloat(btn.dataset.lng);

    if (!map) {
      map = L.map("mapContainer").setView([lat, lng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(map);

      L.marker([lat, lng]).addTo(map).bindPopup("Listing Location").openPopup();
    } else {
      map.invalidateSize(); // important when showing inside modal
      map.setView([lat, lng], 13);
    }
  });
});
