// Mobile Menu Toggle Logic
const menu = document.getElementById("mobile-features-menu");

function toggleMobileFeatures() {
  if (menu.classList.contains("hidden")) {
    menu.classList.remove("hidden");
    // Small timeout to allow transition
    setTimeout(() => {
      menu.classList.add("mobile-menu-active");
      menu.classList.remove("mobile-menu-enter");
    }, 10);
  } else {
    closeMobileMenu();
  }
}

function closeMobileMenu() {
  menu.classList.remove("mobile-menu-active");
  menu.classList.add("mobile-menu-enter");
  setTimeout(() => {
    menu.classList.add("hidden");
  }, 300);
}

// Close menu if clicking outside
document.addEventListener("click", function (event) {
  const isButton = event.target.closest("button");
  const isMenu = event.target.closest("#mobile-features-menu");

  if (!isButton && !isMenu && !menu.classList.contains("hidden")) {
    closeMobileMenu();
  }
});

// --- Tab Switching Logic ---
function switchFeature(feature) {
    const qrTab = document.getElementById('tab-qr');
    const urlTab = document.getElementById('tab-url');
    const qrPanel = document.getElementById('panel-qr');
    const urlPanel = document.getElementById('panel-url');

    if (feature === 'qr') {
        // Show QR, Hide URL
        qrPanel.classList.remove('hidden');
        urlPanel.classList.add('hidden');
        
        // Update Tab Styles (Active QR)
        qrTab.className = "py-5 text-pink-600 bg-white border-b-4 border-pink-500 transition-all duration-300";
        urlTab.className = "py-5 text-gray-400 hover:text-blue-500 hover:bg-gray-100 transition-all duration-300";
    } else {
        // Show URL, Hide QR
        urlPanel.classList.remove('hidden');
        qrPanel.classList.add('hidden');
        
        // Update Tab Styles (Active URL)
        urlTab.className = "py-5 text-blue-600 bg-white border-b-4 border-blue-500 transition-all duration-300";
        qrTab.className = "py-5 text-gray-400 hover:text-pink-500 hover:bg-gray-100 transition-all duration-300";
    }
}

// --- Functional Logic (QR & URL) ---
function generateQR() {
  const input = document.getElementById("qr-input").value;
  if (!input) return alert("Please enter text!");

  const qrBtn = document.querySelector("#panel-qr button");
  const originalBtnText = qrBtn.innerHTML;

  // Button Loading State
  qrBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  qrBtn.disabled = true;

  const img = document.getElementById("qr-img");
  const area = document.getElementById("qr-result-area");

  // API URL
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(input)}`;

  img.src = url;

  img.onload = () => {
    area.classList.remove("hidden");
    qrBtn.innerHTML = originalBtnText;
    qrBtn.disabled = false;
  };

  img.onerror = () => {
    alert("Error generating QR Code");
    qrBtn.innerHTML = originalBtnText;
    qrBtn.disabled = false;
  };
}

async function shortenURL() {
    const input = document.getElementById('url-input').value;
    if(!input) return alert("Please enter a URL!");
    
    // Using TinyURL API (Demo)
    try {
        const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(input)}`);
        const shortLink = await res.text();
        
        document.getElementById('short-url-text').innerText = shortLink;
        document.getElementById('url-result-area').classList.remove('hidden');
    } catch(e) {
        alert("Error shortening URL");
    }
}

function copyToClipboard() {
    const text = document.getElementById('short-url-text').innerText;
    navigator.clipboard.writeText(text);
    alert("Copied!");
}
// --- New Download Logic (Fixes the Preview Issue) ---
async function downloadQR() {
    const imgUrl = document.getElementById('qr-img').src;
    const downloadBtn = document.getElementById('qr-download');
    
    if (!imgUrl) return;

    // Show visual feedback (Loading)
    const originalContent = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    
    try {
        // 1. Fetch the image from the URL
        const response = await fetch(imgUrl);
        // 2. Convert response to a Blob (Binary file)
        const blob = await response.blob();
        
        // 3. Create a temporary invisible link to trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'Atul-QR-Code.png'; // File name set kora
        
        document.body.appendChild(a);
        a.click(); // Auto click trigger
        
        // 4. Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

    } catch (error) {
        console.error('Download failed:', error);
        alert('Failed to download image. Try again.');
    } finally {
        // Reset button text
        downloadBtn.innerHTML = originalContent;
    }
}