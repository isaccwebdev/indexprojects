const $ = selector => document.querySelector(selector);
const searchInput = $('#search');
const projectsContainer = $('#projects');
let proyectos = []; // Variable global para almacenar los proyectos

// Llamada a la API
const fetchProyectos = async () => {
  const username = 'isaccwebdev'; // Cambia esto por tu nombre de usuario en GitHub
  const repos = await fetch(`https://api.github.com/users/${username}/repos`);
  const reposData = await repos.json();

  const proyectosTemp = [];

  for (let repo of reposData) {
    try {
      const readme = await fetch(repo.contents_url.replace('{+path}', 'README.md'));
      if (!readme.ok) continue; // Si no hay README, omitir este repositorio

      const readmeData = await readme.json();
      const readmeContent = atob(readmeData.content); // Decodificar el contenido en base64

      const enlaces = readmeContent.match(/https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/g);
      if (enlaces) {
        proyectosTemp.push({
          nombre: repo.name,
          url: repo.html_url,
          enlaces: enlaces
        });
      }
    } catch (error) {
      console.error(`Error al procesar el repositorio ${repo.name}:`, error);
    }
  }

  return proyectosTemp;
};

// Función para actualizar la lista de proyectos
function mostrarProyectos(lista) {
  projectsContainer.innerHTML = '';
  lista.forEach(proyecto => {
    const li = document.createElement('li');
    li.className = 'project';
    li.innerHTML = `<a href="${proyecto.url}" target="_blank">${proyecto.nombre}</a>`;
    projectsContainer.appendChild(li);
  });
}

// Cargar y mostrar los proyectos al inicio
const init = async () => {
  proyectos = await fetchProyectos();
  mostrarProyectos(proyectos);
};

// Filtrar los proyectos basado en la búsqueda
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filteredProyectos = proyectos.filter(proyecto =>
    proyecto.nombre.toLowerCase().includes(query)
  );
  mostrarProyectos(filteredProyectos);
});

// Iniciar la carga de proyectos
init();
