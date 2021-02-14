const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';


//keypress on search box
document.getElementById('search').addEventListener('keypress', function (event) {
  if (event.key == 'Enter') {
    document.getElementById('search-btn').click();
  }
})

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  let p = document.createElement('p');
  p.className = 'container-fluid font-weight-bold text-uppercase text-white text-center bg-success p-2 m-3';
  p.innerHTML = `Found ${images.length} Images`;
  gallery.appendChild(p);
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })

}

const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
}
let imageSelected = 0;
let slideIndex = 0;

const selectItem = (event, img) => {
  let element = event.target;
  let item = sliders.indexOf(img);
  if (item === -1) {
    element.classList.add('added');
    sliders.push(img);
    imageSelected++;
    noOfSelectedImages(sliders);
  } else {
    element.classList.remove('added');
    imageSelected--;

    for (var i = 0; i < sliders.length; i++) {
      if (sliders[i] === img) {
        sliders.splice(i, 1);
      }
    }
    noOfSelectedImages(sliders);

  }
}

//show number of selected images
const noOfSelectedImages = (sliders) => {
  let p = document.getElementById('image-selected');
  p.className = 'container-fluid font-weight-bold text-uppercase text-white text-center bg-success p-2 m-3';
  p.innerHTML = `${sliders.length} Image Selected`;
  galleryHeader.appendChild(p);
  console.log(sliders.length)
}

var timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image area
  imagesArea.style.display = 'none';
  let duration = document.getElementById('duration').value || 1000;

  if (duration < 0) {
    duration = 0;
  }
  if (duration > 0) {
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })
  } else {
    let item = document.createElement('div')
    item.className= 'bg-danger text-white p-2 text-center';
    item.innerHTML = `Duration Must be greater than zero`;
    sliderContainer.appendChild(item)
  }

  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})