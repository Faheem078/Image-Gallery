const IMAGES = [
      {id:10,cat:'albums',title:'Misty Mountains', src: `https://picsum.photos/id/10/800/600`},
      {id:20,cat:'camera',title:'City Skyline', src: `https://picsum.photos/id/20/800/600`},
      {id:30,cat:'documents',title:'Portrait Smile', src: `https://picsum.photos/id/30/800/600`},
      {id:40,cat:'albums',title:'Color Burst', src: `https://picsum.photos/id/40/800/600`},
      {id:50,cat:'camera',title:'Forest Path', src: `https://picsum.photos/id/50/800/600`},
      {id:60,cat:'documents',title:'Night Lights', src: `https://picsum.photos/id/60/800/600`},
      {id:70,cat:'albums',title:'Candid Shot', src: `https://picsum.photos/id/70/800/600`},
      {id:80,cat:'camera',title:'Shapes', src: `https://picsum.photos/id/80/800/600`},
      {id:90,cat:'documents',title:'Lake View', src: `https://picsum.photos/id/90/800/600`},
      {id:100,cat:'albums',title:'Old Town', src: `https://picsum.photos/id/100/800/600`},
      {id:110,cat:'camera',title:'Street Portrait', src: `https://picsum.photos/id/110/800/600`},
      {id:120,cat:'documents',title:'Modern Art', src: `https://picsum.photos/id/120/800/600`}
    ];

    const galleryEl = document.getElementById('gallery');
    const filtersEl = document.getElementById('filters');
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbCaption = document.getElementById('lbCaption');
    const lbInfo = document.getElementById('lbInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const closeBtn = document.getElementById('closeBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const resetBtn = document.getElementById('resetBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadInput = document.getElementById('uploadInput');

    let activeCat = 'all';
    let shown = [...IMAGES];
    let currentIndex = 0;

    function buildCard(image, index){
      const a = document.createElement('div');
      a.className='card';
      a.setAttribute('data-index',index);
      a.setAttribute('data-cat',image.cat);

      // Use responsive image with width hints
      const img = document.createElement('img');
      img.src = image.src || `https://picsum.photos/id/${image.id}/800/600`;
      img.alt = image.title;
      img.loading = 'lazy';

      // Masonry: set grid-row-end based on aspect ratio
      img.onload = () => {
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        const span = Math.ceil(aspectRatio * 10); // base on grid-auto-rows: 10px
        a.style.gridRowEnd = `span ${span}`;
      };

      const overlay = document.createElement('div'); overlay.className='overlay';
      overlay.innerHTML = `<div class="icon">🔍</div>`;

      const meta = document.createElement('div'); meta.className='meta';
      meta.innerHTML = `<div style="font-weight:600">${image.title}</div><div class="tag">${image.cat}</div>`;

      a.appendChild(img);
      a.appendChild(overlay);
      a.appendChild(meta);

      // click opens lightbox
      a.addEventListener('click', ()=> openLightbox(index));
      return a;
    }

    function renderGallery(list){
      galleryEl.innerHTML='';
      list.forEach((img,idx)=> galleryEl.appendChild(buildCard(img, idx)));
    }

    function applyFilter(cat){
      activeCat = cat;
      if(cat==='all') shown = [...IMAGES]; else shown = IMAGES.filter(i=>i.cat===cat);
      renderGallery(shown);
    }

    // initial render
    renderGallery(shown);

    // Filter handlers
    filtersEl.addEventListener('click', e=>{
      const btn = e.target.closest('.filter'); if(!btn) return;
      [...filtersEl.querySelectorAll('.filter')].forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.cat);
    });

    // Shuffle & Reset
    shuffleBtn.addEventListener('click', ()=>{
      // Fisher-Yates
      for(let i=shown.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1)); [shown[i],shown[j]]=[shown[j],shown[i]];
      }
      renderGallery(shown);
    });
    resetBtn.addEventListener('click', ()=>{
      activeCat='all'; shown=[...IMAGES];
      [...filtersEl.querySelectorAll('.filter')].forEach(b=>b.classList.remove('active'));
      filtersEl.querySelector('.filter[data-cat="all"]').classList.add('active');
      renderGallery(shown);
    });

    // Lightbox functions
    function openLightbox(index){
      currentIndex = index;
      const item = shown[currentIndex];
      lbImg.src = item.src || `https://picsum.photos/id/${item.id}/1200/900`;
      lbImg.style.filter='none';
      lbCaption.textContent = item.title;
      lbInfo.textContent = `${currentIndex+1} / ${shown.length}`;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
    }
    function closeLightbox(){
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden','true');
      document.body.style.overflow='auto';
    }
    function goto(delta){
      currentIndex = (currentIndex + delta + shown.length) % shown.length;
      const item = shown[currentIndex];
      lbImg.src = item.src || `https://picsum.photos/id/${item.id}/1200/900`;
      lbCaption.textContent = item.title;
      lbInfo.textContent = `${currentIndex+1} / ${shown.length}`;
    }

    prevBtn.addEventListener('click', ()=> goto(-1));
    nextBtn.addEventListener('click', ()=> goto(1));
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e=>{ if(e.target===lightbox) closeLightbox(); });

    // keyboard nav
    document.addEventListener('keydown', e=>{
      if(lightbox.classList.contains('open')){
        if(e.key==='ArrowLeft') goto(-1);
        if(e.key==='ArrowRight') goto(1);
        if(e.key==='Escape') closeLightbox();
      }
    });

    // Image filter toggles (applies CSS filter to img)
    const grayscaleToggle = document.getElementById('grayscaleToggle');
    const blurToggle = document.getElementById('blurToggle');
    const sepiaToggle = document.getElementById('sepiaToggle');

    function refreshFilters(){
      let f = [];
      if(grayscaleToggle.classList.contains('active')) f.push('grayscale(100%)');
      if(blurToggle.classList.contains('active')) f.push('blur(4px)');
      if(sepiaToggle.classList.contains('active')) f.push('sepia(60%)');
      lbImg.style.filter = f.join(' ');
    }
    grayscaleToggle.addEventListener('click', ()=>{grayscaleToggle.classList.toggle('active'); refreshFilters();});
    blurToggle.addEventListener('click', ()=>{blurToggle.classList.toggle('active'); refreshFilters();});
    sepiaToggle.addEventListener('click', ()=>{sepiaToggle.classList.toggle('active'); refreshFilters();});

    // Accessibility: focus trap simple version
    document.addEventListener('focusin', (e)=>{
      if(lightbox.classList.contains('open')){
        const panel = lightbox.querySelector('.panel');
        if(!panel.contains(e.target)) panel.querySelector('.panel')?.focus();
      }
    });

    // Make gallery images keyboard-focusable
    galleryEl.addEventListener('keydown', e=>{
      if(e.key==='Enter' || e.key===' ') { e.preventDefault(); const c = e.target.closest('.card'); if(c) c.click(); }
    });

    // Upload functionality
    uploadBtn.addEventListener('click', () => uploadInput.click());
    uploadInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const newImage = {
              id: Date.now() + Math.random(),
              cat: 'albums', // default category for uploads
              title: file.name,
              src: event.target.result
            };
            IMAGES.push(newImage);
            if (activeCat === 'all' || activeCat === 'albums') {
              shown.push(newImage);
              renderGallery(shown);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    });

    // Re-render with indexes when window resizes / images changed
    window.addEventListener('resize', ()=> renderGallery(shown));
