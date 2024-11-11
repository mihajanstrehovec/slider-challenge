class CircularSlider {
    constructor(options){
        const {
            minValue = 0,
            maxValue = 100,
            step = 1,
            radius = 90,
            color = 'blue',
            container = document.body,
            name = ''
        } = options;

        this.minValue = minValue;
        this.maxValue = maxValue;
        this.step = step;
        this.radius = radius;
        this.color = color;
        this.container = container;
        this.name = name
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
        this.sliderValueContainer = document.createElement('div');
        this.sliderValueContainer.classList.add("slider-value-container");
        document.getElementById('slider-values').appendChild(this.sliderValueContainer);
        this.sliderValueDisplay = document.createElement("h1");
        this.sliderValueDisplay.classList.add("slider-value");
        this.sliderValueDisplay.innerText = `asdasds ${this.minValue}`;
        this.sliderValueContainer.appendChild(this.sliderValueDisplay);
        this.sliderValueDisplayName = document.createElement("p");
        this.sliderValueDisplayName.classList.add("slider-value-name");
        this.sliderValueDisplayName.innerText = this.name;
        this.sliderValueContainer.appendChild(this.sliderValueDisplayName);

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
        this.setCircleSize(this.sliderTrack)
        this.setCircleStroke(this.sliderTrack)
        this.svgContainer.appendChild(this.sliderTrack);

        // progress circle
        this.sliderProgress = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.setCircleSize(this.sliderProgress)
        // HEREE
        this.sliderProgress.setAttribute("stroke", `url(#${this.color}-gradient)`);
        this.sliderProgress.setAttribute("stroke-width", "25");
        this.sliderProgress.setAttribute("stroke-dasharray", this.circumference);
        this.sliderProgress.setAttribute("stroke-dashoffset", this.circumference);
        this.sliderProgress.setAttribute("transform", "rotate(-90)");
        this.sliderProgress.style.transformOrigin=`${this.radius+12.5}px ${this.radius+12.5}px`
        this.svgContainer.appendChild(this.sliderProgress);

        // pseudo track for detecting clicks
        this.pseudoSliderTrack = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.setCircleSize(this.pseudoSliderTrack)
        this.setCircleStroke(this.pseudoSliderTrack, "transparent", "25")
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
            case 'orange':
                lightStop.setAttribute("stop-color", "rgba(255, 87, 51, 0.5)");
                darkStop.setAttribute("stop-color", "rgba(175, 62, 38, 0.5)");
                break;
            case 'yellow':
                lightStop.setAttribute("stop-color", "rgba(255, 243, 52, 0.5)");
                darkStop.setAttribute("stop-color", "rgba(219, 208, 45, 0.5)");
                break;
            case 'cyan':
                lightStop.setAttribute("stop-color", "rgba(46, 246, 255, 0.5)");
                darkStop.setAttribute("stop-color", "rgba(45, 211, 219, 0.5)");
                break;
            case 'blue':
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

        const screenWidth = window.screen.width;
        const sliderContainers = document.querySelectorAll('.slider-container')
        let maxSliderWidth = 0;
        sliderContainers.forEach((slider)=>{
            maxSliderWidth = slider.offsetWidth > maxSliderWidth ? slider.offsetWidth : maxSliderWidth
        })
        if (screenWidth < maxSliderWidth){
            const transformScale = (screenWidth-40)/maxSliderWidth
            console.log(transformScale)
            this.sliderContainer.style.transform = `scale(${transformScale})`
        }
        

        this.addEventListeners();
    }

    addEventListeners() {
        document.addEventListener("mousedown", (e) => {

            // storing mouse position
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            this.checkIfDialIsClosest(mouseX, mouseY);

            // get pseudo track position
            const trackRect = this.pseudoSliderTrack.getBoundingClientRect();
            const trackCenterX = trackRect.left + trackRect.width / 2;
            const trackCenterY = trackRect.top + trackRect.height / 2;

            // calculating the stroke size
            const trackRadius = this.pseudoSliderTrack.getAttribute("r");
            const strokeWidth = this.pseudoSliderTrack.getAttribute("stroke-width");
            const outerRadius = parseFloat(trackRadius) + parseFloat(strokeWidth) / 2;
            const innerRadius = parseFloat(trackRadius) - parseFloat(strokeWidth) / 2;

            // calculating the distance between mouse and track circle
            const distanceToCenter = Math.sqrt(
                Math.pow(mouseX - trackCenterX, 2) + Math.pow(mouseY - trackCenterY, 2)
            );

            // checking if the mouse is within the stroke
            if (distanceToCenter >= innerRadius && distanceToCenter <= outerRadius) {
                this.moveToAngle(e)
            }
        });

        document.addEventListener("mouseup", () => {
            this.isClicked = false
        });
        document.addEventListener("mousemove", (e) => {
            this.controlSlider(e)
        });
    
        document.addEventListener("touchstart", (e) => {
            const touch = e.touches[0];
            this.checkIfDialIsClosest(touch.clientX, touch.clientY)
        });

        document.addEventListener("touchmove", (e) => {
            if (this.isClicked) {
                const touch = e.touches[0];
                this.controlSlider(touch);
            }
        });

        document.addEventListener("touchend", () => {
            this.isClicked = false;
        });

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
        this.sliderValueDisplay.innerText = `$${this.calculateValue(angle)}`;
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

    checkIfDialIsClosest(x, y){
        const dialRect = this.dial.getBoundingClientRect();

        // getting the center of the dial
        const dialCenterX = dialRect.left + dialRect.width / 2;
        const dialCenterY = dialRect.top + dialRect.height / 2;

        // calculating the distance between mouse and dial
        const distance = Math.sqrt(Math.pow(x - dialCenterX, 2) + Math.pow(y - dialCenterY, 2));

        if (distance <= 15) {
            this.isClicked = true;
        }
    }

    setCircleSize(element){
        element.setAttribute("r", this.radius);
        element.setAttribute("cx", this.radius + 12.5);
        element.setAttribute("cy", this.radius + 12.5);
        element.setAttribute("fill", "none");
    }

    setCircleStroke(element, color="#cfcfcf", width="25", dashArray="10,2"){
        element.setAttribute("stroke", color);
        element.setAttribute("stroke-width", width);
        element.setAttribute("stroke-dasharray", dashArray);
    }
}