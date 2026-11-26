const PROJECTS = [
  {
    id:'tsero',name:'Tsero App',shortName:'TSERO',category:'uiux',categoryLabel:'Mobile App · UI/UX',year:'2026',device:'phone',cover:'project-tsero.jpg',screenArtwork:'tsero-desktop-home.webp',screenshots:['project-tsero.jpg'],accent:'#FF3316',
    demo:{
      src:'./tsero/index.html?start=home&v=0.15.2',width:375,height:811,
      description:'Tsero is live inside the phone. Browse restaurants and place a sample order.',
      guide:'Scroll inside the phone to browse',
      note:'Demo only · Sign-in, payment and delivery are simulated',
    },
    description:'The name “Tsero” comes from the Georgian word for stork, symbolizing delivery, movement and speed. The app explores modern, user-centered food ordering with browsing, courier tracking, checkout, payment, and profile settings. Branding, logo, color system, UI/UX and interactive prototyping were designed by Giorgi Giorgadze. This is a personal portfolio concept.',
    scene:{position:[-1.75,-.2,1.2],rotation:[-.06,.12,-.02],scale:1},camera:{position:[0,.28,9.6],focusZ:3.55,scale:1.34}
  },
  {
    id:'tomford',name:'Tom Ford Tobacco Vanille',shortName:'TOBACCO VANILLE',artAspect:627/1115,category:'graphics',categoryLabel:'Product Visual · Graphics',year:'2025',device:'poster',cover:'project-tomford.png',screenshots:['project-tomford.png'],accent:'#A88554',
    description:'A Photoshop product-visual composition exploring warm tobacco and vanilla tones through lighting, texture and smoke. The artwork emphasizes color harmony and visual depth around the fragrance. This is an independently created design exercise, not an official brand campaign.',
    scene:{position:[-2.65,-.21,1.23],rotation:[-.045,.08,0],scale:1},camera:{position:[0,.3,9.5],focusZ:3.2,scale:1.18}
  },
  {
    id:'jbl',name:'MeeTab',shortName:'MEETAB',category:'uiux',categoryLabel:'Interactive App · Web Preview',year:'2026',device:'tablet',cover:"meetab-preview.jpg",screenArtwork:"meetab-desktop-home.webp",screenshots:['project-jbl.png'],accent:'#FA6E5F',
    demo:{
      src:'./meetab-demo.html?v=0.14.5',width:1280,height:800,bridge:true,
      description:'MeeTab is live inside the tablet. Try a booking — your progress stays here.',
      guide:'Scroll to zoom the scene',
      note:'Sample data only · Account access is disabled',
    },
    description:'MeeTab meeting-room app. Explore navigation, calendar and local sample bookings. The portfolio demo uses sample data; account access is disabled.',
    scene:{position:[1.65,-.535,1.18],rotation:[-.045,-.08,.01],scale:1.12},camera:{position:[0,.3,9.6],focusZ:3.35,scale:1.35}
  },
  {
    id:'earthhour',name:'Earth Hour Campaign Poster',shortName:'EARTH HOUR',artAspect:1797/2542,category:'graphics',categoryLabel:'Poster Design · Graphics',year:'2025',device:'poster',cover:'project-earthhour.png',screenshots:['project-earthhour.png'],accent:'#AD94D9',
    description:'A vector campaign poster created in Adobe Illustrator, emphasizing custom shape building, vector path precision and controlled typography. The composition is designed for scalable print and digital presentation. Independent portfolio work.',
    scene:{position:[0,-.21,1.23],rotation:[-.045,0,0],scale:1},camera:{position:[0,.3,9.5],focusZ:3.38,scale:1.33}
  }
];
PROJECTS.push({
 id:'jbl-artwork',name:'JBL Premium Audio Campaign',shortName:'JBL',category:'graphics',
 categoryLabel:'Advertising · Graphics',year:'2025',device:'poster',artAspect:2480/3508,
 cover:'project-jbl.png',accent:'#0E89E6',
 description:'JBL Premium Audio Campaign — advertising visual by Giorgi Giorgadze. Independent portfolio work.',
 scene:{position:[2.65,-.21,1.23],rotation:[-.045,-.08,0],scale:1},
 camera:{position:[0,.3,9.5],focusZ:3.38,scale:1.33},
});
const ARCHIVE_PROJECTS = [...PROJECTS, {
 id:'portfolio', name:'Portfolio Website', shortName:'PORTFOLIO',
 category:'experiments', categoryLabel:'Creative Development · Independent project',
 year:'2026', device:'web', cover:'portfolio-preview.webp', accent:'#00F0FF',
 description:'This portfolio combines responsive HTML, CSS and JavaScript with a Three.js showroom, holographic interfaces and isolated application demos. Design and creative development by Giorgi Giorgadze.',
}];
for (const project of ARCHIVE_PROJECTS) {
 project.categories = project.demo ? ['uiux', 'development'] :
  project.id === 'portfolio' ? ['development', 'experiments'] : ['graphics'];
}

// Home presentation variants use the same canonical project records.
const featuredTitles = {
 tomford: 'Tom Ford\nTobacco Vanille',
 'jbl-artwork': 'JBL Premium Audio',
 earthhour: 'Earth Hour\nPoster',
};
for (const project of ARCHIVE_PROJECTS) {
 project.featuredTitle = featuredTitles[project.id] || project.name;
 project.slug = project.id === 'jbl' ? 'meetab' : project.id;
 if (project.cover.startsWith('project-')) {
  project.thumbnail = project.cover.replace(/\.(png|jpg)$/, '-preview.webp');
 }
}
PROJECTS.find(project => project.id === 'jbl').featuredArtwork = 'meetab-desktop-home.webp';

export {PROJECTS, ARCHIVE_PROJECTS};
