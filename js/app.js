// Initialize Firebase Config
(function init() {
  var config = {
    apiKey: "AIzaSyAKG6kAFkluKWTRORtcGr8yvqYb0MXe1No",
    authDomain: "portfolio-4943d.firebaseapp.com",
    databaseURL: "https://portfolio-4943d.firebaseio.com",
    projectId: "portfolio-4943d",
    storageBucket: "portfolio-4943d.appspot.com",
    messagingSenderId: "1075366702422"
  };
  firebase.initializeApp(config);
})();

// Global Firebase data reference variables
const dbRef = firebase.database().ref();
const projectsRef = dbRef.child('projects');
const personsRef = dbRef.child('persons')

// Get data from firebase projects db
projectsRef.on('child_added', snap => {
  // Get projects
  const project = snap.val();
  const keys = Object.keys(project);
  console.log(project)
  console.log(keys)
  // Call add project method
  renderProjects(project);
})

// Get data from firebase persons db
personsRef.on('value', snap => {
  const persons = snap.val();
  // Get an array of all persons keys
  const keys = Object.keys(persons);

  const adrianKey = keys.filter((key, i) => {
    // Find first and last name and return that key 
    if ((persons[key].name.firstName.toLowerCase().includes('adrian')) && (persons[key].name.lastName.toLowerCase().includes('kyzer'))) {
        return (persons[keys[i]]);
    } 
  })
  // Set desired person (adrian) to persons[at filtered key]
  const adrian = persons[adrianKey];
  // Call render methods at various spots on UI
  renderMenu(adrian);
  renderName(adrian);
  renderProfile(adrian);
  renderSocialLinks(adrian);
})

// Render the Nav Menu 
function renderMenu(adrian) {
  const markup = `
  <a class="text-focus-in" href="" class="home">Home</a>
  <a class="text-focus-in" href="${adrian.resume_url}" target="_blank">Resume</a>
  <a class="text-focus-in" href="mailto:${adrian.email}" target="_blank">E-mail</a>
  `;
  document.querySelector('.menu').innerHTML = markup;
}

// Render Name in variouse spots of the app 
function renderName(adrian) {
  const year = new Date().getFullYear();

  document.querySelector('.first-name').innerText = adrian.name.firstName.toUpperCase();
  document.querySelector('.last-name').innerText = adrian.name.lastName.toUpperCase();
  document.querySelector('.job-title').innerText = adrian.career.toUpperCase();  
  document.querySelector('.footer-text').innerHTML = `
  <p class="copyright">&copy; ${adrian.name.firstName} ${adrian.name.lastName} ${year}</p>
  `;
}

  // Render Profile Biography
function renderProfile(adrian) {
  const profileDiv = document.querySelector('.profileDiv');
  const markup = `
    <div class="col-md-12 about-col">
      <div class="me-title">
          <h3>${adrian.biography.title}</h3>
      </div>
      <div class="me-me-me">
        <p>${adrian.biography.content}</p>  
      </div>
    </div>
  `;
  
  profileDiv.innerHTML = markup;
}

// Render Socail Media Links 
function renderSocialLinks(adrian) {
  const socialDiv = document.querySelector('.logo-box');
  const markup = `
    <div class="logo dogs"><a href="${adrian.social_media_urls.other_url_two.url}" target="_blank">${adrian.social_media_urls.other_url_two.name}</a></div>
    <div class="logo facebook"><a href="${adrian.social_media_urls.facebook}" target="_blank">facebook</a></div>
    <div class="logo linkedin"><a href="${adrian.social_media_urls.linkedIn}" target="_blank">linkedIn</a></div>
    <div class="logo twitter"><a href="${adrian.social_media_urls.twitter}" target="_blank">twitter</a></div>
    <div class="logo github"><a href="${adrian.social_media_urls.github}" target="_blank">github</a></div>
    <div class="logo instagram"><a href="${adrian.social_media_urls.instagram}" target="_blank">instagram</a></div>
    <div class="logo photos"><a href="${adrian.social_media_urls.other_url_one.url}" target="_blank">${adrian.social_media_urls.other_url_one.name}</a></div>
  `;

  socialDiv.innerHTML = markup;
}

function renderProjects(project) {
  let resultsDiv= '';
  let repoBtn = '';
  let siteBtn = '';
  let otherBtn = '';
  let markup = '';
  const featured =JSON.parse(project.is_featured);

  // Render button only if the URL is present 
    if(project.repo_url !== "") {
      featured ?
      repoBtn = `<a href="${project.repo_url}" target="_blank">REPO</a>` :
      repoBtn = `<a href="${project.site_url}" target="_blank"><button class="btn btn-light">REPO</button></a>`;
    }
    if(project.deployed_url !== "") {
      featured ?
      siteBtn = `<a href="${project.site_url}" target="_blank">SITE</a>` :
      siteBtn = `<a href="${project.site_url}" target="_blank"><button class="btn btn-light">SITE</button></a>`;
    }
    if(project.other_url.name !== "") {
      otherBtn = `<a href="${project.other_url.url}" target="_blank"><button class="btn btn-light">${project.other_url.name}</button></a>`;
    }
    
    // Render project based on featured or not
    featured ? 
      (resultsDiv = document.querySelector('.featured-projects')) && 
      (markup = `
        <div class="row">
          <div class="card bg-light">
            <img class="card-img" src="${project.image_url}" alt="${project.title}">
            <div class="featured-card">
              <h5 class="card-title">${project.title}</h5>
              <p class="card-text">${project.description}</p>
              <p class="card-text build-tools">${project.build_tools}</p>
              <div class="featured-links">
                  ${repoBtn} ${siteBtn} ${otherBtn}
              </div>
            </div>
          </div>
        </div>
      `) : 
      (resultsDiv = document.querySelector('.other-projects-row')) && 
      (markup = `
        <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${project.title}</h5>
              <p class="card-text build-tools">${project.build_tools}</p>
              <div class="link-btns">
                ${repoBtn}  ${siteBtn}  ${otherBtn}
              </div>
            </div>
          </div>
        </div>
      `);
    // Insert project in UI
    resultsDiv.insertAdjacentHTML('afterbegin', markup);
};

