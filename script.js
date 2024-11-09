const radius = 90;
const circumference = 2 * Math.PI * radius;
let isClicked = false;

const sliderContainer = document.getElementById("slider-container");
const sliderDial = document.getElementById("slider-dial");
const svgContainer = document.getElementById("svg-container");
const sliderTrack = document.getElementById("slider-track");
const pseudoSliderTrack = document.getElementById("slider-track-pseudo-element")
const sliderProgress = document.getElementById("slider-progress");

sliderContainer.style.width=`${radius*2+25}px`
sliderContainer.style.height=`${radius*2+25}px`

sliderDial.style.height=`${radius + 25}px`
sliderDial.style.transformOrigin = `15px ${radius + 12.5}px`

svgContainer.style.width=`${radius*2+25}px`
svgContainer.style.height=`${radius*2+25}px`

pseudoSliderTrack.setAttribute('r', radius);
pseudoSliderTrack.setAttribute('cx', radius+12.5)
pseudoSliderTrack.setAttribute('cy', radius+12.5)

sliderTrack.setAttribute('r', radius);
sliderTrack.setAttribute('cx', radius+12.5)
sliderTrack.setAttribute('cy', radius+12.5)

sliderProgress.setAttribute('r', radius);
sliderProgress.setAttribute('cx', radius+12.5)
sliderProgress.setAttribute('cy', radius+12.5)
sliderProgress.style.transformOrigin=`${radius+12.5}px ${radius+12.5}px`
sliderProgress.style.strokeDasharray = circumference;
sliderProgress.style.strokeDashoffset = circumference;

const getAngleFromMouse = (e) => {
    const rect = svgContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
  
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI);
  
    degrees = (degrees + 90) % 360;
    if (degrees < 0) degrees += 360;
  
    return degrees;
}

const setProgress = (value) => {
    const offset = circumference - (value / 100) * circumference;
    sliderProgress.style.strokeDashoffset = offset;
}

document.addEventListener("mousedown", (e) => {
    if (e.target.closest("#dial")) {
        isClicked = true;
    }
});

document.addEventListener("mouseup", () => {
    isClicked = false;
});

const controlSlider = (e) => {
    if (isClicked) {
        const angle = getAngleFromMouse(e);
        sliderDial.style.transform = `rotate(${angle}deg)`;
        const progress = (angle / 360) * 100;
        setProgress(progress);
    }
};

pseudoSliderTrack.addEventListener('click', (e) => {
    const angle = getAngleFromMouse(e)
    sliderDial.style.transform = `rotate(${angle}deg)`;
    const progress = (angle / 360) * 100;
    setProgress(progress);
})

document.addEventListener('mousemove', controlSlider)