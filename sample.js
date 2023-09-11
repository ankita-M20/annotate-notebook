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
    this.isBrush = false;
    this.isEraser = false;

    this.circles = [[]];
    this.rectangles = [[]];

    this.strokes = [[]];
    this.undoStack = [];
    this.redoStack = [];

    this.isDrawingEnabled = false; // Flag to control pointer event
    this.activeButton = null; // Reference to the active button

    this.canvas.addEventListener("click", () => {
      if (this.isDrawingEnabled) {
        this.handleDrawingClick();
      }
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

    this.resizeCanvas();

    window.addEventListener("load", () => {
      canvas1.resizeCanvasToFitContent();
    });

    // console.log("rect", this.rectangles);
  }

  // Method to set a fixed canvas size
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  resizeCanvasToFitContent() {
    // Create an off-screen canvas with the desired dimensions
    const newCanvas = document.createElement("canvas");
    newCanvas.width = this.canvas.width;
    newCanvas.height = this.canvas.height;
    const newCtx = newCanvas.getContext("2d");

    // Draw the current canvas content onto the off-screen canvas
    newCtx.drawImage(this.canvas, 0, 0);

    // Get the content (drawings) from the off-screen canvas
    const imageData = newCtx.getImageData(
      0,
      0,
      newCanvas.width,
      newCanvas.height
    );

    // Resize the original canvas to the new dimensions
    this.canvas.width = newCanvas.width;
    this.canvas.height = newCanvas.height;

    // Draw the content (drawings) back onto the original canvas
    this.ctx.putImageData(imageData, 0, 0);
  }

  /*--------------------------------------------toggle fuunctions--------------------------------------------------------------------------------------*/
  handleDrawingClick() {
    // Store the current stroke in the strokes array
    const currentStroke = {
      type: this.activeButton.id, // Store the type of the stroke (circle, rectangle, etc.)
      data: this.isBrush ? [] : this.circles.slice(), // Store the data for the current stroke (e.g., circle points)
    };

    this.strokes.push(currentStroke);

    // Clear redo stack since a new stroke is added
    this.redoStack = [];

    console.log("stokes", this.strokes);
  }

  //for click events only
  toggleDrawing() {
    this.isDrawingEnabled = !this.isDrawingEnabled;

    if (!this.isDrawingEnabled) {
      // Disable the pointer event and clear the shapes array based on the drawing mode
      this.canvas.removeEventListener("pointermove", this.handlePointerMove);
      if (this.isDrawingRect) {
        this.rectangles = []; // Clear rectangles
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
    // console.log("brush", this.isBrush);
    if (
      this.isDrawingCircle &&
      !this.isDrawingRect &&
      !this.isDrawingTriangle &&
      !this.isBrush &&
      !this.isEraser
    ) {
      this.drawCircle("red", 2);
    } //
    if (this.isBrush) {
      this.drawCircle("rgba(130, 255, 132, 0.2)", 50);
    } else if (
      !this.isDrawingCircle &&
      !this.isDrawingRect &&
      !this.isDrawingTriangle &&
      !this.isBrush &&
      this.isEraser
    ) {
      this.drawCircle("cornsilk", 60);
    } else if (
      !this.isDrawingCircle &&
      this.isDrawingRect &&
      !this.isDrawingTriangle &&
      !this.isBrush &&
      !this.isEraser
    ) {
      this.drawRect();
    }
  };

  /*-----------------------functions------------------------------------------------------*/

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  undo() {
    if (this.strokes.length > 0) {
      const lastStroke = this.strokes.pop();

      // Push the undone stroke to the redo stack
      this.redoStack.push(lastStroke);

      // Clear the canvas
      this.clearCanvas();

      // Redraw the remaining strokes
      for (const stroke of this.strokes) {
        if (stroke.type === "circle") {
          for (const circle of stroke.data) {
            this.drawCircle("red", 2, circle.x, circle.y);
          }
        } else if (stroke.type === "rectangle") {
          // Redraw rectangles if needed
        } else if (stroke.type === "brush") {
          // Redraw brush strokes if needed
        }
      }
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const nextStroke = this.redoStack.pop();

      // Push the redone stroke back to the strokes array
      this.strokes.push(nextStroke);

      // Clear the canvas
      this.clearCanvas();

      // Redraw all strokes (including the redone ones)
      for (const stroke of this.strokes) {
        if (stroke.type === "circle") {
          for (const circle of stroke.data) {
            this.drawCircle("red", 2, circle.x, circle.y);
          }
        } else if (stroke.type === "rectangle") {
          // Redraw rectangles if needed
        } else if (stroke.type === "brush") {
          // Redraw brush strokes if needed
        }
      }
    }
  }

  redrawStrokes() {
    for (const stroke of this.strokes) {
      if (stroke.data) {
        // Check if stroke.data is defined
        this.setDrawingMode(stroke.type);

        if (!this.isBrush) {
          this.circles = stroke.data;
          this.drawCircle(
            stroke.type === "brush" ? "rgba(130, 255, 132, 0.2)" : "red",
            2
          );
        }
      }
    }
  }

  drawCircle(strokeColor, lineWidth) {
    //console.log("circle");
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

  /*--------------------------Drawing toggle part handling-----------------------------------------------------------------*/
  startDrawing(targetButton) {
    const toggleDrawingButton = document.getElementById("toggle-drawing");
    const brushHighlighter = document.getElementById("brush-highlighter");
    const paintBrushButton = document.getElementById("paintbrush");
    const eraseButton = document.getElementById("erase-button");

    if (targetButton === toggleDrawingButton) {
      this.isDrawingCircle = !this.isDrawingCircle; // Toggle drawing mode
      toggleDrawingButton.classList.toggle("selected-brush");

      // Ensure the other drawing mode is off
      this.isDrawingRect = false;
      this.isBrush = false;
      this.isEraser = false;
      brushHighlighter.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } //
    else if (targetButton === brushHighlighter) {
      this.isDrawingRect = !this.isDrawingRect; // Toggle rectangle drawing mode
      brushHighlighter.classList.toggle("selected-brush");

      this.isDrawingCircle = false;
      this.isBrush = false;
      this.isEraser = false;
      toggleDrawingButton.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } //
    else if (targetButton === paintBrushButton) {
      this.isBrush = !this.isBrush; // Toggle rectangle drawing mode
      paintBrushButton.classList.toggle("selected-brush");

      this.isDrawingCircle = false;
      this.isDrawingRect = false;
      this.isEraser = false;
      toggleDrawingButton.classList.remove("selected-brush");
      brushHighlighter.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } //
    else if (targetButton === eraseButton) {
      this.isEraser = !this.isEraser; // Toggle rectangle drawing mode
      eraseButton.classList.toggle("selected-brush");

      this.isDrawingCircle = false;
      this.isDrawingRect = false;
      this.isBrush = false;
      toggleDrawingButton.classList.remove("selected-brush");
      brushHighlighter.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
    } //

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

const paintBrushButton = document.getElementById("paintbrush");
paintBrushButton.addEventListener("click", () => {
  // console.log("event listner paint");
  canvas1.startDrawing(paintBrushButton);
});

const eraseButton = document.getElementById("erase-button");
eraseButton.addEventListener("click", () => {
  // console.log("event listner erase");
  canvas1.startDrawing(eraseButton);
});
const undoButton = document.getElementById("undo-btn");
undoButton.addEventListener("click", () => {
  console.log("undo");
  canvas1.undo();
});

const redoButton = document.getElementById("redo-btn");
redoButton.addEventListener("click", () => {
  console.log("redo");
  canvas1.redo();
});

// JavaScript code for toggling the white box
document.addEventListener("DOMContentLoaded", function () {
  const dropdownIcon = document.querySelector(".dropdown-icon");
  const whiteBox = document.querySelector(".white-box");

  dropdownIcon.addEventListener("click", function () {
    whiteBox.classList.toggle("hidden");
  });
});
