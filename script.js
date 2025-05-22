
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCzGs2cQRjE7z3UZ6UQCMtvqaI1tXooFNs",
  authDomain: "buildthebuisnessmarketplace.firebaseapp.com",
  projectId: "buildthebuisnessmarketplace",
  storageBucket: "buildthebuisnessmarketplace.firebasestorage.app",
  messagingSenderId: "925773535893",
  appId: "1:925773535893:web:6572609247d9851866599c",
  measurementId: "G-W35X960PF1"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let listings = [];
const container = document.getElementById('listing-container');
const detailContainer = document.getElementById('detail-container');

const searchInput = document.getElementById('search');
const industryFilter = document.getElementById('industryFilter');

searchInput.addEventListener('input', showIndex);
industryFilter.addEventListener('change', showIndex);

async function fetchListings() {
  const querySnapshot = await getDocs(collection(db, "listings"));
  listings = [];
  const industries = new Set();
  querySnapshot.forEach(doc => {
    const data = doc.data();
    listings.push(data);
    industries.add(data.Industry);
  });
  populateFilters(industries);
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id !== null) showDetail(parseInt(id));
  else showIndex();
}

function populateFilters(industries) {
  industryFilter.innerHTML = '<option value="">All Industries</option>';
  [...industries].sort().forEach(ind => {
    const opt = document.createElement('option');
    opt.value = ind;
    opt.textContent = ind;
    industryFilter.appendChild(opt);
  });
}

function showIndex() {
  detailContainer.style.display = "none";
  container.style.display = "block";
  container.innerHTML = "";

  const search = searchInput.value.toLowerCase();
  const industry = industryFilter.value;

  listings.filter(item => {
    return (!industry || item.Industry === industry) &&
           (!search || item.Name.toLowerCase().includes(search));
  }).forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.Image}" alt="Business Image" />
      <h3>${item.Name}</h3>
      <p><strong>Price:</strong> $${item.Price}</p>
      <p><strong>Industry:</strong> ${item.Industry}</p>
      <button onclick="window.history.pushState({}, '', '?id=${i}'); location.reload();">More Details</button>
    `;
    container.appendChild(card);
  });
}

function showDetail(index) {
  container.style.display = "none";
  const item = listings[index];
  detailContainer.style.display = "block";
  detailContainer.innerHTML = `
    <div id="back-button" onclick="goBack()">← Back to Listings</div>
    <div class="detail">
      <img src="${item.Image}" alt="Business Image" />
      <h2>${item.Name}</h2>
      <p><strong>Price:</strong> $${item.Price}</p>
      <p><strong>Location:</strong> ${item.Location}</p>
      <p><strong>Industry:</strong> ${item.Industry}</p>
      <p><strong>Condition:</strong> ${item.Condition}</p>
      <p><strong>Description:</strong> ${item.Description}</p>
    </div>
  `;
}

function goBack() {
  history.pushState({}, "", window.location.pathname);
  location.reload();
}

fetchListings();
