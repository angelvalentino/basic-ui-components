import { handleSwipe } from "../utils.js";

export const imagesUrls = [
  {
    url:'./images/scotland.png',
    alt: 'Green Scotland meadow'
  },
  {
    url: './images/scotland-2.png',
    alt: 'Green Scotland meadow'
  },
  {
    url: './images/scotland-3.png',
    alt: 'Green Scotland meadow'
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
    root.innerHTML = Slider.generateSlider(imagesArray, this.imageIndex, root.id);

    // DOM references
    this.lms = {
      imageSliderControlsLm: root.querySelector('.image-slider__controls'),
      imageContainerLm: root.querySelector('.image-slider__img-container'),
      imageSliderLm: root
    }

    // Update the UI of slider controls based on the initial image index
    this.updateSliderControls();

    // Add event listeners for control buttons and slider click events
    this.lms.imageSliderControlsLm.addEventListener('click', this.setSlide.bind(this));
    this.lms.imageSliderLm.addEventListener('click', this.handleSliderClick.bind(this));
    
    // Add swipe event listeners for touch devices
    this.addSwipeEventsToSlider();
  }

  // Update the control buttons to reflect the current slide
  updateSliderControls() {
    const controls = [...this.lms.imageSliderControlsLm.querySelectorAll('button')];
    controls.forEach((control) => {
      // Highlight the active control button and update aria-selected attribute
      if (Number(control.dataset.index) === this.imageIndex) {
        control.classList.add('active');
        control.ariaSelected = true;
      } 
      else {
        control.classList.remove('active');
        control.ariaSelected = false;
      }
    });
  }
  
   // Update the image display and ARIA attributes based on the current slide
  updateSliderImage() {
    const images = [...this.lms.imageContainerLm.children]
    images.forEach((image, i) => {
      // Adjust image position based on the current index and update aria-hidden attribute
      image.style.transform = `translateX(${-100 * this.imageIndex}%)`;
      image.ariaHidden = i !== this.imageIndex
    })
  
    // Update the controls to reflect the new active slide
    this.updateSliderControls();
  }

  // Move to the next or previous slide based on direction
  slide(direction) {
    if (direction === 'left') {
      // Move left: wrap around to the last image if imageIndex is at the beginning
      this.imageIndex = this.imageIndex === 0 ? this.images.length - 1 : --this.imageIndex;
    } 
    else {
      // Move right: wrap around to the first image if imageIndex is at the end
      this.imageIndex = this.imageIndex === this.images.length - 1 ? 0 : ++this.imageIndex;
    }

    // Update the slider to reflect the new slide
    this.updateSliderImage();
  }

  // Set the slide index based on the control button clicked
  setSlide(e) {
    if (e.target.classList.contains('image-slider__control-btn')) {
      // Update image index from the button's data-index attribute
      this.imageIndex = Number(e.target.dataset.index);
      // Update the slider to reflect the selected slide
      this.updateSliderImage();
    }
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

  // Generate accessible HTML for slider images
  static generateSliderImages(images, imageIndex, id) {
    return images.map(({url, alt}, i) => (
      `
        <img 
          role="tabpanel" 
          id="${id}__item-${i + 1}" 
          aria-hidden="${imageIndex !== i}" 
          aria-roledescription="slide"
          aria-label="${i + 1} of ${images.length}"
          class="image-slider__img" src="${url}" 
          alt="${alt}"
        >
      `
    )).join('');
  }

  // Generate accessible HTML for control buttons
  static generateSliderControls(images, imageIndex, id) {
    return images.map((_, i) => (
      `
        <li role="presentation">
          <button 
            role="tab" 
            aria-selected="${i === imageIndex}"
            aria-controls="${id}__item-${i + 1}"
            aria-label="Show image ${i + 1}."
            class="image-slider__control-btn" 
            data-index="${i}">
          </button>
        </li>
      `
    )).join('');
  }
  
  // Generate the complete HTML structure for the slider component
  static generateSlider(images, imageIndex, id) {
    return (
      `
        <div class="image-slider__img-container">
          ${Slider.generateSliderImages(images, imageIndex, id)}
        </div>

        <ul role="tablist" class="image-slider__controls">
          ${Slider.generateSliderControls(images, imageIndex, id)}
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