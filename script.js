const radius = 180;
const circumference = 2 * Math.PI * radius;
const minValue = 200
const maxValue = 2350;
const step = 10;
const minAngle = (minValue/maxValue)*360;
const minProgress = (minAngle / 360) * 100;
let isClicked = false;
const color = 'blue'

const sliderContainer = document.getElementById("slider-container");
const sliderDial = document.getElementById("slider-dial");
const svgContainer = document.getElementById("svg-container");
const sliderTrack = document.getElementById("slider-track");
const pseudoSliderTrack = document.getElementById("slider-track-pseudo-element")
const sliderProgress = document.getElementById("slider-progress");
const sliderValue = document.getElementById("slider-value")
const lightGradient = document.getElementById("light-gradient")
const darkGradient = document.getElementById("dark-gradient")

sliderValue.innerHTML = minValue
sliderDial.style.transform = `rotate(${minAngle}deg)`;
const test = circumference - (minProgress / 100) * circumference;

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
sliderProgress.style.strokeDashoffset = test;

switch(color){
    case 'red':
        lightGradient.setAttribute("stop-color", "rgba(255, 0, 0, 0.5)")
        darkGradient.setAttribute("stop-color", "rgba(147, 0, 0, 0.5)")
        break;
    case 'green':
        lightGradient.setAttribute("stop-color", "rgba(0, 255, 0, 0.5)")
        darkGradient.setAttribute("stop-color", "rgba(0, 147, 0, 0.5)")
        break;
    case 'blue':
        lightGradient.setAttribute("stop-color", "rgba(0, 0, 255, 0.5)")
        darkGradient.setAttribute("stop-color", "rgba(0, 0, 147, 0.5)")
        break;

}

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

const calculateValue = (angle) => {
    const value = (angle*maxValue)/360
    const stepValue = Math.round(value/step)
    return stepValue * step
}

const setProgress = (angle) => {
    const progress = (angle / 360) * 100;
    sliderValue.innerHTML = calculateValue(angle);
    const offset = circumference - (progress / 100) * circumference;
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
        if(angle > minAngle){
            sliderDial.style.transform = `rotate(${angle}deg)`;
            setProgress(angle);
        }
    }
};

pseudoSliderTrack.addEventListener('click', (e) => {
    const angle = getAngleFromMouse(e);
    if(angle > minAngle){
        sliderDial.style.transform = `rotate(${angle}deg)`;
        setProgress(angle);
    } else {
        sliderDial.style.transform = `rotate(${minAngle}deg)`;
        setProgress(minAngle);
    }
})

document.addEventListener('mousemove', controlSlider)