function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(link => { link.classList.remove('active'); });
  const pageTitles = {
    'home': 'FitQuest - Gamified Fitness Challenges',
    'login': 'Login - FitQuest',
    'register': 'Sign Up - FitQuest',
    'challenges': 'Challenges - FitQuest',
    'leaderboard': 'Leaderboard - FitQuest',
    'community': 'Community - FitQuest',
    'about': 'About - FitQuest'
  };
  document.title = pageTitles[pageId] || 'FitQuest';
}

// Login/Register form handling
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  if (!email || !password) {
    showError('loginEmailError', 'Please fill in all fields');
    return;
  }
  fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'Login successful') {
      showSuccess('loginSuccess', 'Login successful! Redirecting...');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setTimeout(() => showPage('challenges'), 2000);
    } else {
      showError('loginEmailError', data.message);
    }
  })
  .catch(error => {
    showError('loginEmailError', 'Login failed. Please try again.');
  });
});
document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  clearErrors();
  if (!name || !email || !password || !confirmPassword) {
    showError('registerNameError', 'Please fill in all fields');
    return;
  }
  if (password !== confirmPassword) {
    showError('registerConfirmPasswordError', 'Passwords do not match');
    return;
  }
  if (password.length < 6) {
    showError('registerPasswordError', 'Password must be at least 6 characters');
    return;
  }
  fetch('http://localhost:5000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'User created successfully') {
      showSuccess('registerSuccess', 'Account created successfully! Redirecting to login...');
      document.getElementById('registerForm').reset();
      setTimeout(() => showPage('login'), 2000);
    } else {
      showError('registerEmailError', data.message);
    }
  })
  .catch(error => {
    showError('registerEmailError', 'Registration failed. Please try again.');
  });
});

function showError(elementId, message) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.style.display = 'block';
}
function showSuccess(elementId, message) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.style.display = 'block';
}
function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => { el.style.display = 'none'; });
}
window.addEventListener('load', function() {
  const token = localStorage.getItem('token');
  if (token) {
    document.querySelector('.auth-buttons').innerHTML = `
      <button class="btn btn-outline" onclick="logout()">Logout</button>
      <button class="btn btn-primary" onclick="showPage('dashboard')">Dashboard</button>
    `;
  }
});
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  location.reload();
}
const challenges = [
  {
    icon: "fas fa-walking",
    bg: "#4CAF50",
    category: "Steps",
    title: "10K Steps Daily",
    description: "Walk 10,000 steps every day for 30 days to build a consistent walking habit.",
    progress: 65,
    participants: 2458,
    duration: "30 days"
  },
  {
    icon: "fas fa-water",
    bg: "#2196F3",
    category: "Hydration",
    title: "3L Water Daily",
    description: "Drink 3 liters of water every day for 21 days to improve hydration and energy levels.",
    progress: 40,
    participants: 1892,
    duration: "21 days"
  },
  {
    icon: "fas fa-spa",
    bg: "#FF9800",
    category: "Yoga",
    title: "30-Day Yoga Challenge",
    description: "Complete a daily yoga session for 30 days to improve flexibility and reduce stress.",
    progress: 75,
    participants: 3215,
    duration: "30 days"
  },
  // Additional sample challenges
  {
    icon: "fas fa-bicycle",
    bg: "#9C27B0",
    category: "Cycling",
    title: "Weekend Cycling",
    description: "Cycle at least 10km each weekend for one month.",
    progress: 33,
    participants: 811,
    duration: "4 weekends"
  },
  {
    icon: "fas fa-running",
    bg: "#E91E63",
    category: "Running",
    title: "5K Morning Run",
    description: "Run 5km every morning for two weeks.",
    progress: 50,
    participants: 1723,
    duration: "14 days"
  },
  {
    icon: "fas fa-dumbbell",
    bg: "#607D8B",
    category: "Strength",
    title: "Full Body Strength",
    description: "Complete a bodyweight strength routine 3x per week for 6 weeks.",
    progress: 22,
    participants: 960,
    duration: "6 weeks"
  },
  {
    icon: "fas fa-leaf",
    bg: "#43A047",
    category: "Meal",
    title: "Plant-Based Month",
    description: "Eat plant-based meals every day for one month.",
    progress: 12,
    participants: 400,
    duration: "30 days"
  }
];

// Dynamic rendering function for challenges
function renderChallenges(filterText = "") {
  const grid = document.getElementById("challengesGrid");
  grid.innerHTML = "";
  let filtered = challenges.filter(ch =>
    ch.title.toLowerCase().includes(filterText.toLowerCase()) ||
    ch.category.toLowerCase().includes(filterText.toLowerCase())
  );
  if(filtered.length === 0){
    grid.innerHTML = "<p style='padding:30px;text-align:center;color:var(--gray);'>No challenges found.</p>";
    return;
  }
  filtered.forEach(ch => {
    const card = document.createElement("div");
    card.className = "challenge-card fade-in";
    card.innerHTML = `
      <div class="challenge-image" style="background-color: ${ch.bg};">
        <i class="${ch.icon}"></i>
      </div>
      <div class="challenge-content">
        <span class="challenge-category">${ch.category}</span>
        <h3>${ch.title}</h3>
        <p>${ch.description}</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${ch.progress}%"></div>
        </div>
        <div class="challenge-stats">
          <span><i class="fas fa-users"></i> ${ch.participants} participants</span>
          <span><i class="far fa-clock"></i> ${ch.duration}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Show challenges when entering the page
document.querySelector('a[onclick="showPage(\'challenges\')"]').addEventListener('click', function() {
  renderChallenges();
});

document.querySelector('.btn.btn-primary[onclick="showPage(\'challenges\')"]').addEventListener('click', function() {
  renderChallenges();
});

// Handle search
document.getElementById('challengeSearch').addEventListener('input', function(e){
  renderChallenges(e.target.value);
});

// If page is loaded on "challenges", also render immediately
if(document.getElementById("challenges").classList.contains("active")){
  renderChallenges();
}
