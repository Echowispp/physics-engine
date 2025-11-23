# Collision detector

This is a simple program that detects if two shapes are touching.

Pretty simple to use, just click one of the buttons to select a shape, then click on the canvas (darkish gray area) to place a shape. After that, place another shape. Then, the program will detect the second shape and check for collisions.

About the week's theme it's fine if this doesn't count I understand it is kind of on the edge of counting as a 'framework'... now that I think about it, this really doesn't fit too well, it could be argued this is a framework for building a physics engine. This project was going to be a full-on physics engine before I realised that would've been way too much for me in one week, especially as I had a bunch of school stuff this week. Hence the repo name. I want to continue this project later at some point though, maybe during a later siege week, maybe after siege, maybe I'll forget to update this

<h1>Tech stack</h1>
1. I did a simple framework to build off of later, can be seen in the first commit. It includes the doCollisions function (not the collision functions, just the switch that checks which collision function to call) and the basic static HTML/CSS layout
2. With the framework in place I did some work on figuring out canvases and drawing on them, after doing some research I figured out the arc() method works for making a circle. 
3. After that, I fixed a couple minor bugs and added the current grid layout to the page, along with the rectangle button
4. The collision functions basically get the rectangle corners and then check for different positions relative to them, do some math and plop out the answers idk how to explain it

# Credits

Thanks to @Lesbiswan on Discord (queerchaosgremlin on Github) for teaching me the circle-circle and circle-rectangle collisions, no way I would have figured them out myself
