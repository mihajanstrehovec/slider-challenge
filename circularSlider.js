class CircularSlider {
    constructor(options){
        const {
            minValue = 0,
            maxValue = 100,
            step = 1,
            radius = 90,
            color = 'blue',
            container = document.body
        } = options;

        this.minValue = minValue;
        this.maxValue = maxValue;
        this.step = step;
        this.radius = radius;
        this.color = color;
        this.container = container;
        this.isClicked = false;
        this.minAngle = (minValue/maxValue)*360;

        this.circumference = 2 * Math.PI * this.radius;
        this.createSliderElements(container);
        this.setSliderValue(this.minValue)
    }

    createSliderElements(container) {
        // container for whole slider
        this.sliderContainer = document.createElement("div");
        this.sliderContainer.classList.add("slider-container");
        this.sliderContainer.style.width=`${this.radius*2+25}px`
        this.sliderContainer.style.height=`${this.radius*2+25}px`

        // displaying the value of range selector
        this.sliderValueDisplay = document.createElement("h3");
        this.sliderValueDisplay.classList.add("slider-value");
        this.sliderValueDisplay.innerText = this.minValue;
        document.getElementById('slider-values').appendChild(this.sliderValueDisplay);

        // container for dial
        this.sliderDial = document.createElement("div");
        this.sliderDial.classList.add("slider-dial");
        this.sliderDial.style.height=`${this.radius + 25}px`;
        this.sliderDial.style.transformOrigin = `15px ${this.radius + 12.5}px`;
        this.dial = document.createElement("div");
        this.dial.classList.add("dial");
        this.sliderDial.appendChild(this.dial);
        this.sliderContainer.appendChild(this.sliderDial);

        // track and progress svg
        this.svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svgContainer.setAttribute("width", this.radius * 2 + 25);
        this.svgContainer.setAttribute("height", this.radius * 2 + 25);

        // track circle
        this.sliderTrack = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.sliderTrack.setAttribute("r", this.radius);
        this.sliderTrack.setAttribute("cx", this.radius + 12.5);
        this.sliderTrack.setAttribute("cy", this.radius + 12.5);
        this.sliderTrack.setAttribute("fill", "none");
        this.sliderTrack.setAttribute("stroke", "#cfcfcf");
        this.sliderTrack.setAttribute("stroke-width", "25");
        this.sliderTrack.setAttribute("stroke-dasharray", "10,2");
        this.svgContainer.appendChild(this.sliderTrack);

        // progress circle
        this.sliderProgress = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.sliderProgress.setAttribute("r", this.radius);
        this.sliderProgress.setAttribute("cx", this.radius + 12.5);
        this.sliderProgress.setAttribute("cy", this.radius + 12.5);
        this.sliderProgress.setAttribute("fill", "none");
        this.sliderProgress.setAttribute("stroke", `url(#${this.color}-gradient)`);
        this.sliderProgress.setAttribute("stroke-width", "25");
        this.sliderProgress.setAttribute("stroke-dasharray", this.circumference);
        this.sliderProgress.setAttribute("stroke-dashoffset", this.circumference);
        this.sliderProgress.setAttribute("transform", "rotate(-90)");
        this.sliderProgress.style.transformOrigin=`${this.radius+12.5}px ${this.radius+12.5}px`
        this.svgContainer.appendChild(this.sliderProgress);

        // pseudo track for detecting clicks
        this.pseudoSliderTrack = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.pseudoSliderTrack.setAttribute("r", this.radius);
        this.pseudoSliderTrack.setAttribute("cx", this.radius + 12.5);
        this.pseudoSliderTrack.setAttribute("cy", this.radius + 12.5);
        this.pseudoSliderTrack.setAttribute("fill", "none");
        this.pseudoSliderTrack.setAttribute("stroke", "transparent");
        this.pseudoSliderTrack.setAttribute("stroke-width", "25");
        this.svgContainer.appendChild(this.pseudoSliderTrack);

        // gradient
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        gradient.setAttribute("id", `${this.color}-gradient`);
        gradient.setAttribute("x1", "39%");
        gradient.setAttribute("y1", "50%");
        gradient.setAttribute("x2", "50%");
        gradient.setAttribute("y2", "0%");

        const lightStop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        lightStop.setAttribute("offset", "0%");
        const darkStop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        darkStop.setAttribute("offset", "80%");

        switch (this.color) {
            case 'red':
                lightStop.setAttribute("stop-color", "rgba(255, 0, 0, 0.5)");
                darkStop.setAttribute("stop-color", "rgba(147, 0, 0, 0.5)");
                break;
            case 'green':
                lightStop.setAttribute("stop-color", "rgba(0, 255, 0, 0.5)");
                darkStop.setAttribute("stop-color", "rgba(0, 147, 0, 0.5)");
                break;
            case 'blue':
            default:
                lightStop.setAttribute("stop-color", "rgba(0, 0, 255, 0.5)");
                darkStop.setAttribute("stop-color", "rgba(0, 0, 147, 0.5)");
                break;
        }

        gradient.appendChild(lightStop);
        gradient.appendChild(darkStop);
        defs.appendChild(gradient);
        this.svgContainer.appendChild(defs);

        this.sliderContainer.appendChild(this.svgContainer);
        container.appendChild(this.sliderContainer);

        this.addEventListeners();
    }

    addEventListeners() {
        this.dial.addEventListener("mousedown", () => (this.isClicked = true));
        document.addEventListener("mouseup", () => (this.isClicked = false));
        document.addEventListener("mousemove", (e) => this.controlSlider(e));

        this.pseudoSliderTrack.addEventListener("click", (e) => this.moveToAngle(e));
    }

    getAngleFromMouse(e) {
        const rect = this.svgContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const radians = Math.atan2(dy, dx);
        let degrees = radians * (180 / Math.PI);
        degrees = (degrees + 90) % 360;
        return degrees < 0 ? degrees + 360 : degrees;
    }

    calculateValue(angle) {
        const value = (angle * this.maxValue) / 360;
        return Math.round(value / this.step) * this.step;
    }

    setProgress(angle) {
        const progress = (angle / 360) * 100;
        const offset = this.circumference - (progress / 100) * this.circumference;
        this.sliderProgress.style.strokeDashoffset = offset;
        this.sliderValueDisplay.innerText = this.calculateValue(angle);
    }

    controlSlider(e) {
        if (this.isClicked) {
            const angle = this.getAngleFromMouse(e);
            if(angle > this.minAngle){
                this.sliderDial.style.transform = `rotate(${angle}deg)`;
                this.setProgress(angle);
            }
        }
    }

    moveToAngle(e) {
        const angle = this.getAngleFromMouse(e);
        if(angle > this.minAngle) {
            this.sliderDial.style.transform = `rotate(${angle}deg)`;
            this.setProgress(angle);
        } else {
            this.sliderDial.style.transform = `rotate(${this.minAngle}deg)`;
            this.setProgress(this.minAngle);
        }
    }

    setSliderValue(value) {
        const angle = (value / this.maxValue) * 360;
        this.sliderDial.style.transform = `rotate(${angle}deg)`;
        this.setProgress(angle);
    }
}