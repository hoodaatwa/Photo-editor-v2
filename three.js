

  const currentPageLocation = window.location.href;

  let displayedRepos = 0; // Counter for displayed repositories



  // Fetch data from GitHub API

  fetch('https://api.github.com/users/hoodaatwa/repos')

    .then(response => response.json())

    .then(data => {

      // Extract topics of the current repository

      const currentRepoTopics = data

        .filter(repo => repo.homepage === currentPageLocation)

        .flatMap(repo => repo.topics || []);



      // Create Material-UI card for each repository with the same topics

      const repoList = document.getElementById('repoList');

      data.forEach(repo => {

        const repoTopics = repo.topics || [];



        if (

          displayedRepos >= 4 ||

          repo.homepage === currentPageLocation ||

          !repoTopics.some(topic => currentRepoTopics.includes(topic))

        ) {

          // Skip creating card if reached the limit, homepage matches current page location,

          // or repository has no common topics

          return;

        }



        const repoCard = document.createElement('div');

        repoCard.classList.add('repoCard');

        repoCard.innerHTML = `

          <div class="repoTitle">${repo.name}</div>

          <div class="repoDescription">${repo.description}</div>

          <div class="repoLink">

            <a href="${repo.homepage}" target="_blank">Homepage <i class="fas fa-external-link-alt"></i></a>

          </div>

        `;

        repoList.appendChild(repoCard);



        displayedRepos++;

      });



      // Find the "Main" repository and create a special card with a dynamic link

      const mainRepo = data.find(repo => repo.name.toLowerCase() === 'main');

      if (mainRepo) {

        const mainRepoCard = document.createElement('div');



        mainRepoCard.innerHTML = `

          <a class="center" href="${mainRepo.homepage}" target="_blank">Go to Main Page <i class="fas fa-external-link-alt"></i></a>

        `;

        repoList.appendChild(mainRepoCard);

      }

    })

    .catch(error => console.error('Error fetching data:', error));



  function toggleMenu() {

    const menuOverlay = document.getElementById('menuOverlay');

    const body = document.body;

    const menuIcon = document.getElementById('menuIcon');



    if (menuOverlay.style.display === 'block') {

      menuOverlay.style.display = 'none';

      body.style.overflow = 'auto';

      menuIcon.classList.replace('fa-times', 'fa-bars');

    } else {

      menuOverlay.style.display = 'block';

      body.style.overflow = 'hidden';

      menuIcon.classList.replace('fa-bars', 'fa-times');

    }

  }

    
    
