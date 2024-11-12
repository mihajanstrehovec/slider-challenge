# Circular Slider Challenge

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technical Approach](#technical-approach)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [Responsive and Mobile Optimization](#responsive-and-mobile-optimization)
- [Event Handling and Customization](#event-handling-and-customization)
- [Challenges and Solutions](#challenges-and-solutions)
- [Future Improvements](#future-improvements)
- [Credits](#credits)

---

## Overview
This is my solution for the challenge provided during the interview process for Junior software developer at Celtra.
As part of the challenge I had to build a reusable JavaScript class that creates a circular slider, provides interactivity both on desktop and mobile devices.
At first the challenge scared me a bit, as I haven't done anything similar for a while, but during the challenge I had so much fun. Especially when thinking about how I will implement the progress slider, doing some maths and to see it work was so much more rewarding.

## Features
- **Customizable**: The slider can be customized through the options object during initialization. It allows the user to set the radius of the slider, it's container and container for the values, color, min/max values, step, and name of the slider.
- **Desktop Interaction**: The user can interact with the slider on desktop with his mouse.
- **Mobile Display**: The slider will automatically scale down when the container is bigger than the width of the screen using transform-scale. 
- **Mobile-Interaction**: Users can interact with the slider through touch events - `touchstart`, `touchmove`, and `touchend`.
- **Event Emission**: The slider also emits events so the developer can listen to the event `valueChange` which returns the current value of the slider.
  
## Technical Approach
- **Creating the sliders**: The sliders are created with SVG elements. With a circle that has no fill and stroke with stroke-dasharray set to 10,2 we create the progress track. Then with another circle that has the same properties as the progress track circle except stroke-dasharray and stroke-offset placed on top of the progress track we create the progress itself. The dial is made of two elements a container div which has height set to the radius of the circle and has it's transform origin set to its end (center of the circle) that is used to rotate the dial. The dial itself is a div inside the container with border radius set to 50% and positioned on the other end of the transform origin of the container.
- **Slider interaction**: Interaction with the slider is based on event listeners. To control the dial we always listen for `mousemove` events on the document, which calls the function for controlling the slider. That funcion checks if the dial was actually clicked - this is done with another event listener on the document `mousedown` which calculates the distance between the cursor position and the dial. I used this approach as a click event listener on the dial wouldn't work, because when there is multiple sliders they begin to overlap. Same approach of calculating the distance was used for the click to move the slider, but because there are some negative spaces on the progress track due to the stroke dash-array stroke I created a pseudo circle on top of the track circle with a full stroke that is transparent. The same approach was used for mobile, switching out the mouse to touch events.
- **Displaying the values**: We calculate the values of the slider based on the angle and the max value of the slider takin the step into count, then update the value when the slider is moved. 

## Improvements
Provided with more resources I would like to improve the responsivness of the slider on different screen sizes. I would also like to improve how the stroke of the progress track is displayed as currently there is some offset at the begining and some stroke dashes that are bigger than other ones.

## Installation and Setup
To view the sliders locally open the index.html file with your preffered browser.
If you wish to preview the site on your mobile device open your terminal, navigate to the folder with the index file and start a local server (if you have pyton3 installed - python3 -m http.server 8000). Then connect with your mobile device to the same network and open the website: your_computers_ip:port_number.