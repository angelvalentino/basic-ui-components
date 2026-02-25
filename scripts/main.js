import { 
  Carousel,
  carouselImages
} 
from './components/Carousel.js'

import {
  accordionData,
  Accordion
} from './components/Accordion.js'

import { 
  Slider,
  imagesUrls
} from './components/Slider.js';

import { 
  Tabs, 
  tabsData 
} from './components/Tabs.js';

const imageCarouselLm = document.getElementById('image-carousel');
const accordionContainerLm = document.getElementById('accordion');
const imageSliderLm = document.getElementById('image-slider');
const tabsLm = document.getElementById('tabs');

// Carousel
new Carousel(imageCarouselLm, carouselImages, 'image-slider');

// Accordion
new Accordion(accordionContainerLm, accordionData);

// Image slider
new Slider(imageSliderLm, imagesUrls);

// Tabs
new Tabs(tabsLm, tabsData);