const radius = 120;
const circumference = 2 * Math.PI * radius;

const sliderContainer = document.getElementById("slider-container");
const sliderDial = document.getElementById("slider-dial");
const svgContainer = document.getElementById("svg-container");
const sliderTrack = document.getElementById("slider-track");
const sliderProgress = document.getElementById("slider-progress");


sliderContainer.style.width=`${radius*2+25}px`
sliderContainer.style.height=`${radius*2+25}px`

sliderDial.style.height=`${radius + 25}px`
sliderDial.style.transformOrigin = `15px ${radius + 12.5}px`

svgContainer.style.width=`${radius*2+25}px`
svgContainer.style.height=`${radius*2+25}px`

sliderTrack.setAttribute('r', radius);
sliderTrack.setAttribute('cx', radius+12.5)
sliderTrack.setAttribute('cy', radius+12.5)

sliderProgress.setAttribute('r', radius);
sliderProgress.setAttribute('cx', radius+12.5)
sliderProgress.setAttribute('cy', radius+12.5)
sliderProgress.style.transformOrigin=`${radius+12.5}px ${radius+12.5}px`
sliderProgress.style.strokeDasharray = circumference;
sliderProgress.style.strokeDashoffset = 560;

