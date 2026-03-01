export const carouselImages = [
  {
    url: 'https://placehold.co/400?text=1',
    alt: ''
  },
  {
    url: 'https://placehold.co/400?text=2',
    alt: ''
  },
  {
    url: 'https://placehold.co/400?text=3',
    alt: ''
  },
  {
    url: 'https://placehold.co/400?text=4',
    alt: ''
  },
  {
    url: 'https://placehold.co/400?text=5',
    alt: ''
  },
  {
    url: 'https://placehold.co/400?text=6',
    alt: ''
  },
  {
    url: 'https://placehold.co/400?text=7',
    alt: ''
  },
  {
    url: 'https://placehold.co/400?text=8',
    alt: ''
  },
]

export class Carousel {
  constructor(root, contentArray, id) {
    // Ensure the root element is provided
    if (!root) throw new Error('Root element is required');
    // Ensure the root element has an id attribute
    if (!id) throw new Error('An ID argument is required to be used in the slider for accessibility purposes');
    // Ensure images array is provided and not empty
    if (!contentArray || contentArray.length === 0) throw new Error('Content array element is required and must not be empty');

    // Generate the carousel HTML and insert it into the root element
    root.innerHTML = Carousel.generateCarousel(contentArray, id);
    
    // DOM references
    this.lms = {
      prevBtn: root.querySelector('.carousel__prev-btn'),
      nextBtn: root.querySelector('.carousel__next-btn'),
      sliderLm: root.querySelector('.carousel__slider')
    }

    // Add event listeners for scrolling and buttons hide/show logic
    this.lms.sliderLm.addEventListener('scroll', this.setSliderButtonVisibility.bind(this));
    this.lms.prevBtn.addEventListener('click', this.slideLeft.bind(this));
    this.lms.nextBtn.addEventListener('click', this.slideRight.bind(this));
  }

  slideLeft() {
    // Adjust scroll position to the left, taking into account the item's width and gap property
    this.lms.sliderLm.scrollLeft -= this.lms.sliderLm.children[0].clientWidth + 30;
  }
  
  slideRight() {
    // Adjust scroll position to the right, taking into account the item's width and gap property
    this.lms.sliderLm.scrollLeft += this.lms.sliderLm.children[0].clientWidth + 30;
  }
  
  // Handle the scroll event to show/hide navigation buttons based on scroll
  setSliderButtonVisibility() {
    // Maximum scrollable width of the carousel
    const maxScroll = this.lms.sliderLm.scrollWidth - this.lms.sliderLm.clientWidth;
    // Current scroll position
    const currentScroll = this.lms.sliderLm.scrollLeft;

    // Hide the next button if scrolled to the maximum width
    // Allow a 1px tolerance to handle fractional scroll values
    if (Math.abs(currentScroll - maxScroll) <= 1) {
      this.lms.nextBtn.style.display = 'none';
    } 
    else if (currentScroll < maxScroll) {
      this.lms.nextBtn.style.display = 'initial';
    }
  
    // Hide the previous button if scrolled to the initial width
    if (currentScroll === 0) {
      this.lms.prevBtn.style.display = 'none';
    } 
    else {
      this.lms.prevBtn.style.display = 'initial';
    }
  }

  static generateImageList(images) {
    return images.map(({ url, alt }) => (
      /*html*/`
        <li>
          <img src="${url}" alt="${alt}">
        </li>
      `
    )).join('');
  }

  static generateCarousel(contentArray, id) {
    return (
       /*html*/`
        <button aria-controls="${id}" class="carousel__btn carousel__prev-btn">
          <svg class="carousel__chevron-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 6l-6 6l6 6" />
          </svg>
        </button>
        <ul id="${id}" class="carousel__slider">
          ${Carousel.generateImageList(contentArray)}
        </ul>
        <button aria-controls="${id}" class="carousel__btn carousel__next-btn">
          <svg class="carousel__chevron-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 6l6 6l-6 6" />
          </svg>
        </button>
      `
    );
  }
}