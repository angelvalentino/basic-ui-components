import { handleSwipe } from "../utils.js";

export const imagesUrls = [
  {
    url:'./images/scotland.png',
    alt: `Scotland's green mountains and meadows under a clear sky`
  },
  {
    url: './images/scotland-2.png',
    alt: `Scotland's Glenfinnan Viaduct with a vintage train puffing soft vapor smoke, surrounded by green hills and mountains under a clear sky`
  },
  {
    url: './images/scotland-3.png',
    alt: `Scotland's misty mountains with yellow and brown hues under a foggy sky`
  }
];

export class Slider {
  constructor(root, imagesArray) {
    // Error check to ensure root element and image array are provided
    if (!root) throw new Error("Root element is required");
    if (!root.hasAttribute('id')) throw new Error('Root element does not have an id attribute');
    if (!imagesArray || imagesArray.length === 0) throw new Error("Images Array element is required and must not be empty");

    // Initialize slider properties and render initial slider HTML
    this.images = imagesArray;
    this.imageIndex = 0;
    root.innerHTML = this.generateSlider(root.id);

    // DOM references
    this.lms = {
      imageSliderControlsLm: root.querySelector('.image-slider__controls'),
      imageContainerLm: root.querySelector('.image-slider__img-container'),
      imageSliderLm: root
    }

    this.lms.controls = [...this.lms.imageSliderControlsLm.querySelectorAll('button')];
    this.lms.images = [...this.lms.imageContainerLm.children];

    // Add event listeners for control buttons and slider click events
    this.lms.imageSliderControlsLm.addEventListener('click', this.handleNavClick.bind(this));
    this.lms.imageSliderLm.addEventListener('click', this.handleSliderClick.bind(this));
    this.lms.imageSliderControlsLm.addEventListener('keydown', this.handleKeydown.bind(this));

    this.addSwipeEventsToSlider();

    this.setSlide(this.imageIndex, true);
  }

  handleKeydown(e) {
    let nextIndex = null;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        nextIndex = this.slide('right');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        nextIndex = this.slide('left');
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        this.setSlide(nextIndex);
        break;
      case 'End':
        e.preventDefault();
        nextIndex = this.lms.controls.length - 1;
        this.setSlide(nextIndex)
        break;
      default:
        return;
    }

    this.lms.controls[nextIndex].focus();
  }

  updateSliderControls() {    
    this.lms.controls.forEach((control) => {
      const isActive = Number(control.dataset.index) === this.imageIndex;

      control.classList.toggle('active', isActive);
      control.ariaSelected = isActive;
      control.tabIndex = isActive ? 0 : -1;
    });
  }
  
  updateSliderImage() {
    this.lms.images.forEach((image, i) => {
      image.style.transform = `translateX(${-100 * this.imageIndex}%)`;
      image.ariaHidden = i !== this.imageIndex
    });
  }

  slide(direction) {
    let index = this.imageIndex;

    if (direction === 'left') {
      // Move left: wrap around to the last image if imageIndex is at the beginning
      index = this.imageIndex === 0 ? this.images.length - 1 : --index;
    } 
    else {
      // Move right: wrap around to the first image if imageIndex is at the end
      index = this.imageIndex === this.images.length - 1 ? 0 : ++index;
    }

    this.setSlide(index);
    return index;
  }

  handleNavClick(e) {
    if (e.target.classList.contains('image-slider__control-btn')) {
      const index = Number(e.target.dataset.index);
      this.setSlide(index);
    }
  }

  setSlide(i, bypass) {
    if (!bypass && this.imageIndex === i) {
      console.log('same')
      return;
    }
    this.imageIndex = i;
    this.updateSliderControls();
    this.updateSliderImage();
  }

  // Handle click events for previous and next buttons
  handleSliderClick(e) {
    if (e.target.closest('.image-slider__prev-btn')) {
      // Slide left when the previous button is clicked
      this.slide('left');
    } 
    else if (e.target.closest('.image-slider__next-btn')) {
      // Slide right when the next button is clicked
      this.slide('right');
    }
  }

  // Add touch event listeners to enable swipe functionality
  addSwipeEventsToSlider() {
    const {
      handleTouchStart, 
      handleTouchMove, 
      handleTouchEnd
    } = handleSwipe(this.slide.bind(this, 'right'), this.slide.bind(this, 'left'));
  
    // Attach touch event listeners with passive option for better performance
    this.lms.imageSliderLm.addEventListener('touchstart', handleTouchStart, { passive: true });
    this.lms.imageSliderLm.addEventListener('touchmove', handleTouchMove, { passive: true });
    this.lms.imageSliderLm.addEventListener('touchend', handleTouchEnd);
  }

  generateSliderImages(id) {
    return this.images.map(({url, alt}, i) => (
      /*html*/`
        <img 
          aria-hidden="${this.imageIndex !== i}" 
          aria-roledescription="slide"
          aria-label="${i + 1} of ${this.images.length}"
          role="tabpanel" 
          id="${id}__item-${i + 1}" 
          class="image-slider__img" src="${url}" 
          alt="${alt} (image ${i + 1} of ${this.images.length})"
        >
      `
    )).join('');
  }

  generateSliderControls(id) {
    return this.images.map(({ alt }, i) => (
      /*html*/`
        <li role="presentation">
          <button 
            role="tab" 
            aria-selected="${i === this.imageIndex}"
            aria-controls="${id}__item-${i + 1}"
            aria-label="Select ${alt} (image ${i + 1} of ${this.images.length})"
            class="image-slider__control-btn" 
            data-index="${i}"
            tabindex="${i === this.imageIndex ? 0 : -1}"
            draggable="false"
            title="${alt}"
          >
          </button>
        </li>
      `
    )).join('');
  }
  
  generateSlider(id) {
    return (
      /*html*/`
        <div class="image-slider__img-container">
          ${this.generateSliderImages(id)}
        </div>

        <ul role="tablist" class="image-slider__controls">
          ${this.generateSliderControls(id)}
        </ul>

        <button aria-label="Show previous image" class="image-slider__btn image-slider__prev-btn">
          <svg class="image-slider__chevron-icon" aria-hidden="true" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd" d="m16.75 17l-7.5-5l7.5-5a.901.901 0 1 0-1-1.5l-8.502 5.668a1 1 0 0 0 0 1.664L15.75 18.5a.901.901 0 1 0 1-1.5"></path></svg>
        </button>
        <button aria-label="Show next image" class="image-slider__btn image-slider__next-btn">
          <svg class="image-slider__chevron-icon" aria-hidden="true" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd" d="m7.25 17l7.5-5l-7.5-5a.901.901 0 1 1 1-1.5l8.502 5.668a1 1 0 0 1 0 1.664L8.25 18.5a.901.901 0 1 1-1-1.5"></path>
          </svg>
        </button>
      `
    );
  }
}