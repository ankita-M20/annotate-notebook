class DrawingCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;

    this.mouse = {
      x: null,
      y: null,
    };

    this.isDrawingCircle = false; // Flag to control circle drawing mode
    this.isDrawingRect = false; // Flag to control rectangle drawing mode
    this.isDrawingTriangle = false;
    this.isBrush = false;
    this.isEraser = false;

    this.circles = [];
    this.rectangles = [];
    this.trianglePoints = [];

    this.isDrawingEnabled = false; // Flag to control pointer event
    this.activeButton = null; // Reference to the active button

    this.canvas.addEventListener("click", () => {
      this.toggleDrawing();
    });

    this.canvas.addEventListener("pointermove", (event) => {
      if (this.isDrawingEnabled) {
        this.handlePointerMove(event);
      }
    });

    window.addEventListener("resize", () => {
      this.canvas.height = window.innerHeight;
      this.canvas.width = window.innerWidth;
    });
  }

  /*--------------------------------------------toggle fuunctions--------------------------------------------------------------------------------------*/
  //for click events only
  toggleDrawing() {
    this.isDrawingEnabled = !this.isDrawingEnabled;

    if (!this.isDrawingEnabled) {
      // Disable the pointer event and clear the shapes array based on the drawing mode
      this.canvas.removeEventListener("pointermove", this.handlePointerMove);
      if (this.isDrawingRect) {
        this.rectangles = []; // Clear rectangles
      } else if (this.isDrawingTriangle) {
        this.trianglePoints = [];
      } else if (this.isDrawingCircle || this.isBrush || this.isEraser) {
        this.circles = []; // Clear circles
      }
    } else {
      this.canvas.addEventListener("pointermove", this.handlePointerMove);
    }
  }

  handlePointerMove = (event) => {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;

    console.log("handle Pointer");
    if (
      this.isDrawingCircle &&
      !this.isDrawingRect &&
      !this.isDrawingTriangle &&
      !this.isBrush &&
      !this.isEraser
    ) {
      this.drawCircle("red", 2);
    } //
    else if (
      !this.isDrawingCircle &&
      !this.isDrawingRect &&
      !this.isDrawingTriangle &&
      this.isBrush &&
      !this.isEraser
    ) {
      this.drawCircle("green", 5); //("rgba(0, 255, 255, 0.1)", 20);
    } else if (
      !this.isDrawingCircle &&
      !this.isDrawingRect &&
      !this.isDrawingTriangle &&
      !this.isBrush &&
      this.isEraser
    ) {
      this.drawCircle("cornsilk", 30);
    } else if (
      !this.isDrawingCircle &&
      this.isDrawingRect &&
      !this.isDrawingTriangle &&
      !this.isBrush &&
      !this.isEraser
    ) {
      this.drawRect();
    } else if (
      !this.isDrawingCircle &&
      !this.isDrawingRect &&
      this.isDrawingTriangle &&
      !this.isBrush &&
      !this.isEraser
    ) {
      // Add the current mouse position to the triangle points array
      this.trianglePoints.push({ x: this.mouse.x, y: this.mouse.y });
      if (this.trianglePoints.length === 3) {
        this.drawTriangle();
        this.trianglePoints = [this.trianglePoints[2]]; // Start a new triangle with the last point
      }
    } // extra rect
    else {
      if (this.rectangles.length >= 1) {
        const firstRect = this.rectangles[0];
        const distance = Math.sqrt(
          (firstRect.x - this.mouse.x) ** 2 + (firstRect.y - this.mouse.y) ** 2
        );
        if (distance > 30) {
          this.rectangles.shift(); // Remove the first rectangle
        }
      }
    }
  };

  /*-----------------------functions------------------------------------------------------*/
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawCircle(strokeColor, lineWidth) {
    if (!this.isDrawingCircle) {
      return; // Don't draw if drawing mode is off
    }

    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    if (this.circles.length >= 1) {
      const lastCircle = this.circles[this.circles.length - 1];
      this.ctx.beginPath();
      this.ctx.moveTo(lastCircle.x, lastCircle.y);
      this.ctx.lineTo(this.mouse.x, this.mouse.y);
      this.ctx.stroke();
    }

    // Store the current mouse position as a circle
    this.circles.push({ x: this.mouse.x, y: this.mouse.y });
  }

  drawRect() {
    if (!this.isDrawingRect) {
      return; // Don't draw rectangles if rectangle drawing mode is off
    }

    // Set the fill color with transparency (e.g., 30% transparent cyan)
    this.ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
    //this.highlightCtx.fillStyle = "rgba(0, 255, 255, 0.3)";

    // Set line width to 0 for filled rectangles
    this.ctx.lineWidth = 0;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    // Calculate the fixed size for the rectangle
    const rectWidth = 35; // Set the width of the rectangle
    const rectHeight = 20; // Set the height of the rectangle

    // Initialize the position for the new rectangle
    let rectX = this.mouse.x;
    let rectY = this.mouse.y;

    // Calculate the position for the new rectangle immediately adjacent to the previous one
    if (this.rectangles.length >= 1) {
      const lastRect = this.rectangles[this.rectangles.length - 1];

      // Calculate the x-coordinate for the new rectangle
      rectX = lastRect.x; //+ rectWidth;

      // Check if the new rectangle would go out of the canvas
      if (rectX + rectWidth > this.canvas.width) {
        // Start a new row of rectangles
        rectX = 0;
        rectY = lastRect.y + rectHeight;
      }

      // Fill the gap between the new rectangle and the previous one
      if (rectX > lastRect.x + lastRect.width) {
        const gapWidth = rectX - (lastRect.x + lastRect.width);
        this.ctx.fillRect(
          lastRect.x + lastRect.width,
          rectY,
          gapWidth,
          rectHeight
        );
      }
    }

    // Draw the filled rectangle at the calculated position
    this.ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
  }

  // New method to draw a triangle
  drawTriangle() {
    if (this.trianglePoints.length < 3) {
      // Need at least 3 points to draw a triangle
      return;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(this.trianglePoints[0].x, this.trianglePoints[0].y);

    for (let i = 1; i < 3; i++) {
      this.ctx.lineTo(this.trianglePoints[i].x, this.trianglePoints[i].y);
    }

    this.ctx.closePath();

    if (this.fillColor.checked) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  /*--------------------------Drawing toggle part handling-----------------------------------------------------------------*/
  startDrawing(targetButton) {
    const toggleDrawingButton = document.getElementById("toggle-drawing");
    const brushHighlighter = document.getElementById("brush-highlighter");
    const triangleButton = document.getElementById("triangle-highlighter");
    const paintBrushButton = document.getElementById("paintbrush");
    const eraseButton = document.getElementById("erase-button");

    if (targetButton === toggleDrawingButton) {
      this.isDrawingCircle = !this.isDrawingCircle; // Toggle drawing mode
      toggleDrawingButton.classList.toggle("selected-brush");
      //toggleDrawingButton.classList.toggle("drawing-off");

      // Ensure the other drawing mode is off
      this.isDrawingRect = false;
      this.isDrawingTriangle = false;
      this.isBrush = false;
      this.isEraser = false;
      brushHighlighter.classList.remove("selected-brush");
      triangleButton.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } //
    else if (targetButton === brushHighlighter) {
      this.isDrawingRect = !this.isDrawingRect; // Toggle rectangle drawing mode
      brushHighlighter.classList.toggle("selected-brush");

      this.isDrawingCircle = false;
      this.isDrawingTriangle = false;
      this.isBrush = false;
      this.isEraser = false;
      toggleDrawingButton.classList.remove("selected-brush");
      triangleButton.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } //
    else if (targetButton === paintBrushButton) {
      this.isBrush = !this.isBrush; // Toggle rectangle drawing mode
      paintBrushButton.classList.toggle("selected-brush");

      this.isDrawingCircle = false;
      this.isDrawingTriangle = false;
      this.isDrawingRect = false;
      this.isEraser = false;
      toggleDrawingButton.classList.remove("selected-brush");
      triangleButton.classList.remove("selected-brush");
      brushHighlighter.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } //
    else if (targetButton === eraseButton) {
      this.isEraser = !this.isEraser; // Toggle rectangle drawing mode
      eraseButton.classList.toggle("selected-brush");

      this.isDrawingCircle = false;
      this.isDrawingTriangle = false;
      this.isDrawingRect = false;
      this.isBrush = false;
      toggleDrawingButton.classList.remove("selected-brush");
      triangleButton.classList.remove("selected-brush");
      brushHighlighter.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
    } //
    else if (targetButton === triangleButton) {
      this.isDrawingTriangle = !this.isDrawingTriangle;
      triangleButton.classList.toggle("selected-triangle");

      this.isDrawingCircle = false;
      this.isEraser = false;
      this.isDrawingRect = false;
      this.isBrush = false;
      toggleDrawingButton.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
      brushHighlighter.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
    }

    // Set the active button
    this.activeButton = targetButton;
  }
}

/*****************class ends *****************/
// Create an instance of the DrawingCanvas class and specify the canvas ID
const canvas1 = new DrawingCanvas("canvas1");
//canvas1.startDrawing();

const toggleDrawingButton = document.getElementById("toggle-drawing");
toggleDrawingButton.addEventListener("click", () => {
  canvas1.startDrawing(toggleDrawingButton);
});

// Add event listener to toggle between drawing circles and rectangles
const brushHighlighter = document.getElementById("brush-highlighter");
brushHighlighter.addEventListener("click", () => {
  canvas1.startDrawing(brushHighlighter);
});
/* Add event listener for triangle button
const triangleButton = document.getElementById("triangle-button");
triangleButton.addEventListener("click", () => {
  canvas1.startDrawing(triangleButton);
});*/

const paintBrushButton = document.getElementById("paintbrush");
paintBrushButton.addEventListener("click", () => {
  console.log("event listner paint");
  canvas1.startDrawing(paintBrushButton);
});

const eraseButton = document.getElementById("erase-button");
eraseButton.addEventListener("click", () => {
  console.log("event listner erase");
  canvas1.startDrawing(eraseButton);
});

/* Add event listener for clearing the canvas
const clearButton = document.getElementById("clear-button");
clearButton.addEventListener("click", () => {
  canvas1.clearCanvas();
});*/
