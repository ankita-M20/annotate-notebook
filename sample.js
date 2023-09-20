//drawing shapes
class Shape {
  constructor(canvas, ctx, color, isFilled) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.color = color;
    this.isFilled = isFilled;
    this.points = [];
    this.clearCanvas = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
  }
}

class Rectangle extends Shape {
  constructor(canvas, ctx, color, isFilled, drawingApp) {
    super(canvas, ctx, color);
    this.isDrawing = false;
    this.startPoints = []; // Array to store the starting coordinates of the rectangle
    this.endPoints = []; // Array to store the ending coordinates of the rectangle
    this.isFilled = isFilled;
    this.drawingApp = drawingApp;
  }

  startDrawing(x, y) {
    if (!this.isDrawing && !this.startPoint) {
      this.isDrawing = true;

      this.startPoints = [x, y]; // Store the starting point
      this.endPoints = [x, y]; // Initialize the ending point to the same position
    }
  }

  continueDrawing(x, y) {
    if (!this.isDrawing) return;

    // Update the coordinates of the rectangle
    this.endPoints = [x, y]; // Update the ending point only

    this.clearCanvas();
    this.drawingApp.redrawRectangles();

    // Draw the current rectangle
    const [x1, y1] = this.startPoints; // Use the starting points
    const [x2, y2] = this.endPoints; // Use the ending points

    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2;

    if (this.isFilled) {
      this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    } else {
      this.ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    }
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  draw() {
    if (this.startPoints.length !== 2 || this.endPoints.length !== 2) return;

    const [x1, y1] = this.startPoints;
    const [x2, y2] = this.endPoints;

    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2;

    if (this.isFilled) {
      this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    } else {
      this.ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    }
  }
}

class Circle extends Shape {
  constructor(canvas, ctx, color, isFilled, drawingApp) {
    super(canvas, ctx, color);
    this.isDrawing = false;
    this.points = []; // Array to store the center and radius of the circle
    this.isFilled = isFilled;
    this.drawingApp = drawingApp;
  }

  startDrawing(x, y) {
    this.isDrawing = true;
    // Set the initial center point
    this.points = [x, y, 0];
  }

  continueDrawing(x, y) {
    if (!this.isDrawing) return;

    const radius = Math.sqrt(
      (x - this.points[0]) ** 2 + (y - this.points[1]) ** 2
    );

    this.points = [this.points[0], this.points[1], radius];

    this.clearCanvas();
    this.drawingApp.redrawRectangles();

    // Draw the current circle
    if (
      this.points[0] !== undefined &&
      this.points[1] !== undefined &&
      this.points[2] !== undefined
    ) {
      const [centerX, centerY, r] = this.points;
      this.ctx.fillStyle = this.color;
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = 2;

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      if (this.isFilled) {
        this.ctx.fill();
      } else {
        this.ctx.stroke();
      }
      this.ctx.closePath();
    }
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  draw() {
    if (this.points.length < 3) return;

    const [centerX, centerY, r] = this.points;
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, r, 0, Math.PI * 2);

    if (this.isFilled) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
    this.ctx.closePath();
  }
}

class Triangle extends Shape {
  constructor(canvas, ctx, color, isFilled, drawingApp) {
    super(canvas, ctx, color);
    this.isDrawing = false;
    this.points = []; // Array to store the vertices of the triangle
    this.isFilled = isFilled;
    this.drawingApp = drawingApp;
  }

  startDrawing(x, y) {
    this.isDrawing = true;
    // Initialize the first vertex of the triangle
    this.points = [x, y, x, y, x, y]; // Three vertices (x, y, x, y, x, y)
  }

  continueDrawing(x, y) {
    if (!this.isDrawing) return;

    // Update the second vertex and calculate the third vertex based on mouse movement
    this.points[2] = x;
    this.points[3] = y;

    const [x1, y1, x2, y2] = this.points;

    // Calculate the length of each side of the equilateral triangle
    const sideLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    // Calculate the position of the third vertex
    const angle = Math.PI / 3; // 60 degrees in radians
    const x3 = x1 + sideLength * Math.cos(angle);
    const y3 = y1 + sideLength * Math.sin(angle);

    this.points[4] = x3;
    this.points[5] = y3;

    // Clear the canvas and redraw previous shapes
    this.clearCanvas();
    this.drawingApp.redrawRectangles();

    // Draw the current equilateral triangle
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    const [x1_, y1_, x2_, y2_, x3_, y3_] = this.points;
    this.ctx.moveTo(x1_, y1_);
    this.ctx.lineTo(x2_, y2_);
    this.ctx.lineTo(x3_, y3_);
    this.ctx.closePath();

    /* random triangle
    // Calculate the position of the third vertex based on the current mouse position
    const [x1, y1, x2, y2] = this.points;
    const x3 = x1 + (x2 - x1) * 2; // Example: Extend the triangle base by doubling its length
    const y3 = y2; // Keep the y-coordinate the same

    this.points[4] = x3;
    this.points[5] = y3;

  
    // Clear the canvas and redraw previous shapes
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
   this.drawingApp.redrawRectangles();

    // Draw the current triangle
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
    const [x1_, y1_, x2_, y2_, x3_, y3_] = this.points;
    this.ctx.moveTo(x1_, y1_);
    this.ctx.lineTo(x2_, y2_);
    this.ctx.lineTo(x3_, y3_);
    this.ctx.closePath();*/

    if (this.isFilled) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  draw() {
    if (this.points.length < 6) return; // You need at least 3 vertices to draw a triangle

    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    const [x1, y1, x2, y2, x3, y3] = this.points;
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.closePath();

    if (this.isFilled) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }
}

class Pen extends Shape {
  constructor(canvas, ctx, color, lineWidth, drawingApp) {
    super(canvas, ctx, color, false); // Pen is not filled
    this.lineWidth = lineWidth;
    this.points = [];
    this.drawingApp = drawingApp;
    // this.strokes = []; // Array to store completed strokes
    // this.currentStroke = []; // Temporary storage for the current stroke
  }

  startDrawing(x, y) {
    this.isDrawing = true;
    this.points = [{ x, y }];
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  continueDrawing(x, y) {
    if (!this.isDrawing) return;
    this.points.push({ x, y });
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  stopDrawing() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    // Push the current pen stroke into the rectangles array
    this.drawingApp.rectangles.push({
      type: "pen", // You can set the type to "pen" to distinguish it from other shapes
      color: this.color,
      lineWidth: this.lineWidth,
      points: this.points,
    });
    this.points = []; // Clear the points for the next stroke
  }
  draw() {
    // Pens are drawn as a sequence of lines connecting points
    if (this.points.length < 2) return;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }
}

class DrawingApp {
  isDrawing = false;
  prevX = 0;
  prevY = 0;
  currentShape = null;
  // rectangles = [];

  constructor(activetool, canvas, ctx, clearCanvas) {
    this.selectedTool = activetool;
    this.shapes = [];
    this.rectangles = []; // Array to store drawn rectangles
    this.canvas = canvas;
    this.ctx = ctx;
    this.clearCanvas = clearCanvas;
  }

  setActiveShape(shapeType) {
    this.selectedTool = shapeType;
  }
  startDrawing(event, ctx) {
    this.isDrawing = true;
    const { offsetX, offsetY } = event;
    console.log("startdrawing function");

    switch (this.selectedTool) {
      case "triangle":
        this.currentShape = new Triangle(
          ctx.canvas,
          ctx,
          globalcolor,
          isFilledGlobally,
          this
        );
        this.currentShape.startDrawing(offsetX, offsetY);
        break;

        break;
      case "rectangle":
        this.currentShape = new Rectangle(
          ctx.canvas,
          ctx,
          globalcolor,
          isFilledGlobally,
          this
        );
        this.currentShape.startDrawing(offsetX, offsetY);
        break;
      case "circle":
        this.currentShape = new Circle(
          ctx.canvas,
          ctx,
          globalcolor,
          isFilledGlobally,
          this
        );
        this.currentShape.startDrawing(offsetX, offsetY);
        break;
      case "brush":
        this.isDrawing = false;
      default:
        this.isDrawing = false;
        break;
    }

    this.prevX = offsetX;
    this.prevY = offsetY;

    console.log(this.prevX, this.prevY);
    //  this.stopDrawing();
  }

  continueDrawing(event) {
    if (!this.isDrawing) return;
    this.redrawRectangles();
    console.log("DrawApp continue drawing");
    const { offsetX, offsetY } = event;
    this.currentShape.continueDrawing(offsetX, offsetY);
  }

  stopDrawing(event) {
    this.isDrawing = false;
    if (this.currentShape) {
      this.rectangles.push(this.currentShape); // Add the completed shape to the array
      console.log(this.rectangles);
      this.currentShape = "brush"; // Reset the current shape
    }
    //this.currentShape.stopDrawing();
  }

  redrawRectangles(ctx) {
    // Clear the canvas if needed
    // this.clearCanvas();

    // Draw pen strokes
    for (const shape of this.rectangles) {
      if (shape.type === "pen") {
        // Draw pen strokes
        const pen = new Pen(
          this.canvas,
          this.ctx,
          shape.color,
          shape.lineWidth,
          this
        );
        pen.points = shape.points.slice(); // Copy the points array
        pen.draw();
        console.log("hi pen");
      }
    }

    // Draw other shapes (rectangles, circles, etc.)
    for (const shape of this.rectangles) {
      if (shape.type !== "pen" && shape !== "brush") {
        console.log(shape, "shape draw hi");
        shape.draw(); // Draw other shapes
      }
    }
  }
}

//--------------------------------------------------------------------------------------------

class DrawingCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.clearCanvas = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    this.mouse = {
      x: null,
      y: null,
    };

    this.drawingApp = new DrawingApp(
      this.activeShape,
      this.canvas,
      this.ctx,
      this.clearCanvas
    );

    this.rectangles = [[]];

    this.strokes = [[]];

    this.DrawingShapeRectangle = false; // this is shapes in general

    this.isDrawingEnabled = false;
    this.activeButton = null;

    this.pens = [];
    this.currentPen = null;
    this.isDrawingPen = false; // Flag to determine if the current tool is the pen

    this.undoStack = [];
    this.redoStack = [];

    // Add event listeners for the "Undo" and "Redo" buttons
    const undoButton = document.getElementById("undo-btn");
    undoButton.addEventListener("click", () => {
      this.undo();
    });

    const redoButton = document.getElementById("redo-btn");
    redoButton.addEventListener("click", () => {
      this.redo();
    });

    this.canvas.addEventListener("click", (event) => {
      if (this.isDrawingEnabled) {
        if (this.drawingApp.selectedTool === "brush") {
          // this.drawingApp.stopDrawing();
          console.log("pointer");
          handleDrawingClick();
        } else if (
          this.drawingApp.selectedTool === "rectangle" ||
          this.drawingApp.selectedTool === "triangle" ||
          this.drawingApp.selectedTool === "circle"
        ) {
          this.drawingApp.startDrawing(event, this.ctx);
        }
      }
      this.toggleDrawing();
    });

    this.canvas.addEventListener("pointermove", (event) => {
      /*if (this.isDrawingEnabled) {
        if (this.DrawingApp.selectedTool === "brush") {
          this.handlePointerMove(event);
        } else if (
         this.drawingApp.selectedTool === "rectangle" ||
         this.drawingApp.selectedTool === "triangle" ||
         this.drawingApp.selectedTool === "circle"
        ) {
         this.drawingApp.continueDrawing(event);
        }
      }*/
      if (this.isDrawingEnabled) {
        if (this.isDrawingPen) {
          // If drawing with the pen, continue drawing with it
          const x = event.clientX - this.canvas.getBoundingClientRect().left;
          const y = event.clientY - this.canvas.getBoundingClientRect().top;
          this.currentPen.continueDrawing(x, y);
        } else {
          // If drawing with another tool, continue drawing with that tool
          this.drawingApp.continueDrawing(event);
        }
      }
    });

    this.canvas.addEventListener("pointerdown", (event) => {
      if (this.isDrawingEnabled) {
        if (this.currentPen) {
          // If a pen is selected, start drawing with it
          this.isDrawingPen = true;
          const x = event.clientX - this.canvas.getBoundingClientRect().left;
          const y = event.clientY - this.canvas.getBoundingClientRect().top;
          this.currentPen.startDrawing(x, y);
        } else {
          // If another shape tool is selected, start drawing with that tool
          this.isDrawingPen = false;
          this.drawingApp.startDrawing(event, this.ctx);
        }
      }
    });

    this.canvas.addEventListener("pointerup", (event) => {
      if (this.isDrawingEnabled) {
        // If a pen is selected, stop drawing with it
        if (this.isDrawingPen) {
          this.currentPen.stopDrawing();
          this.pens.push(this.currentPen);
          this.currentPen = null;
        } else {
          this.drawingApp.stopDrawing();
        }
      }
    });

    window.addEventListener("resize", () => {
      this.canvas.height = window.innerHeight;
      this.canvas.width = window.innerWidth;
    });
  }

  setActiveShape(shapeType) {
    this.activeShape = shapeType;
    this.drawingApp.setActiveShape(this.activeShape);

    console.log("drawingpen", this.isDrawingPen);

    // Stop any ongoing pen drawing
    if (this.isDrawingPen) {
      this.isDrawingPen = false;
      this.drawingApp.stopDrawing();
      this.rectangles.push(this.currentPen);
      console.log("stop pen");
      this.currentPen = null;
    }

    /*Toggle the drawing mode based on the selected shape or pen tool
    if (this.activeShape === "pen") {
      this.toggleDrawing();
    } else {
      this.toggleDrawing(true); // Disable drawing when selecting shapes
    }
*/
    //this.redraw(); // Redraw rectangles after changing tools

    //this.DrawingApp.stopDrawing();
    console.log(this.activeShape, "oy");
    console.log(this.drawingApp, "yo");
  }

  setActivePen(penType, color, lineWidth) {
    // Create a new pen and set it as the current pen
    this.drawingApp.stopDrawing();

    this.currentPen = new Pen(
      this.canvas,
      this.ctx,
      color,
      lineWidth,
      this.drawingApp
    );
  }

  toggleDrawing() {
    this.isDrawingEnabled = !this.isDrawingEnabled;
    console.log("ytoggler");
    if (!this.isDrawingEnabled) {
      this.canvas.removeEventListener("pointermove", this.handlePointerMove);
    } else {
      this.canvas.addEventListener("pointermove", this.handlePointerMove);
    }
  }

  //how the mouse moves
  handlePointerMove = (event) => {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;

    console.log("Pointer move handle");
    if (this.isDrawingEnabled && this.currentShape) {
      this.currentShape.continueDrawing(this.mouse.x, this.mouse.y);
    }
  };

  undo() {
    if (this.rectangles.length > 0) {
      console.log(this.drawingApp.rectangles, "stack");

      let lastShape = this.drawingApp.rectangles.pop();
      console.log(lastShape);
      this.undoStack.push(lastShape);
      this.drawingApp.redrawRectangles();
    }
  }

  redo() {
    if (this.undoStack.length > 0) {
      const lastUndoneShape = this.undoStack.pop();
      this.drawingApp.rectangles.push(lastUndoneShape);
      this.redoStack.push(lastUndoneShape); // Store redo operation
      this.redraw();
    }
  }

  redraw() {
    this.clearCanvas();

    // Redraw shapes from this.rectangles
    for (const shape of this.rectangles) {
      shape.draw();
    }
  }

  //if called after shapes and css inside js
  startDrawing(targetButton) {
    const toggleDrawingButton = document.getElementById("toggle-drawing");
    const brushHighlighter = document.getElementById("brush-highlighter");
    const paintBrushButton = document.getElementById("paintbrush");
    const eraseButton = document.getElementById("erase-button");

    if (targetButton === toggleDrawingButton) {
      this.isDrawingCircle = !this.isDrawingCircle;
      toggleDrawingButton.classList.toggle("selected-brush");

      this.drawingApp.stopDrawing();
      this.isDrawingRect = false;
      this.isBrush = false;
      this.isEraser = false;
      brushHighlighter.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } else if (targetButton === brushHighlighter) {
      this.isDrawingRect = !this.isDrawingRect;
      brushHighlighter.classList.toggle("selected-brush");
      this.drawingApp.stopDrawing();

      this.isDrawingCircle = false;
      this.isBrush = false;
      this.isEraser = false;
      toggleDrawingButton.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } else if (targetButton === paintBrushButton) {
      this.isBrush = !this.isBrush;
      paintBrushButton.classList.toggle("selected-brush");
      this.drawingApp.stopDrawing();

      this.isDrawingCircle = false;
      this.isDrawingRect = false;
      this.isEraser = false;
      toggleDrawingButton.classList.remove("selected-brush");
      brushHighlighter.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } else if (targetButton === eraseButton) {
      this.isEraser = !this.isEraser;
      eraseButton.classList.toggle("selected-brush");
      this.drawingApp.stopDrawing();

      this.isDrawingCircle = false;
      this.isDrawingRect = false;
      this.isBrush = false;
      toggleDrawingButton.classList.remove("selected-brush");
      brushHighlighter.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
    } else {
      this.isBrush = false;
      this.isDrawingCircle = false;
      this.isDrawingRect = false;
      this.eraseButton = false;

      toggleDrawingButton.classList.remove("selected-brush");
      brushHighlighter.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    }

    this.activeButton = targetButton;
  }
}

/*****************class ends *****************/
// Create an instance of the DrawingCanvas class and specify the canvas ID
const canvas1 = new DrawingCanvas("canvas1");
canvas1.startDrawing();

//first time before shapes
const toggleDrawingButton = document.getElementById("toggle-drawing");
toggleDrawingButton.addEventListener("click", () => {
  //canvas1.startDrawing(toggleDrawingButton);
  toggleDrawingButton.classList.toggle("selected-brush");
  paintBrushButton.classList.remove("selected-brush");
  brushHighlighter.classList.remove("selected-brush");
  canvas1.setActivePen("pen", "red", 2); // Blue pen with line width 2
});

// Add event listener to toggle between drawing circles and rectangles
const brushHighlighter = document.getElementById("brush-highlighter");
brushHighlighter.addEventListener("click", () => {
  brushHighlighter.classList.toggle("selected-brush");
  paintBrushButton.classList.remove("selected-brush");
  toggleDrawingButton.classList.remove("selected-brush");
  canvas1.setActivePen("pen", "green", 20);
});

const paintBrushButton = document.getElementById("paintbrush");
paintBrushButton.addEventListener("click", () => {
  paintBrushButton.classList.toggle("selected-brush");
  toggleDrawingButton.classList.remove("selected-brush");
  brushHighlighter.classList.remove("selected-brush");
  canvas1.setActivePen("pen", "rgba(255, 255, 0, 1)", 50);
});

const eraseButton = document.getElementById("erase-button");
eraseButton.addEventListener("click", () => {
  eraseButton.classList.toggle("selected-brush");
  toggleDrawingButton.classList.remove("selected-brush");
  brushHighlighter.classList.remove("selected-brush");
  paintBrushButton.classList.remove("selected-brush");
  canvas1.setActivePen("pen", "cornsilk", 60);
  // console.log("event listner erase");
  // canvas1.startDrawing(eraseButton);
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

document.addEventListener("DOMContentLoaded", function () {
  const dropdownIcon = document.querySelector(".dropdown-icon");
  const whiteBox = document.querySelector(".white-box");
  const whiteBoxOptions = whiteBox.querySelectorAll(".options");

  dropdownIcon.addEventListener("click", () => {
    whiteBox.classList.toggle("hidden");
    // Disable drawing modes
    canvas1.startDrawing();

    // Call the toggleDrawing method to update the drawing state
    canvas1.toggleDrawing();
  });

  // Add event listeners to options inside the white box
  whiteBoxOptions.forEach(function (option) {
    option.addEventListener("click", function () {
      whiteBox.classList.add("hidden");
    });
  });

  // Add event listeners to shape options inside the white box
  const shapeOptions = whiteBox.querySelectorAll(".sec-options .icons div");
  shapeOptions.forEach(function (shapeOption) {
    shapeOption.addEventListener("click", function () {
      whiteBox.classList.add("hidden");
    });
  });
});

//shapes

// Add event listeners to shape elements
const radioShape = document.getElementById("radio");
const rectangleShape = document.getElementById("rectangle");
const triangleShape = document.getElementById("triangle");
const circleShape = document.getElementById("circle");
const ovalShape = document.getElementById("oval");

radioShape.addEventListener("click", () => {
  if (canvas1.currentPen) {
    canvas1.currentPen.stopDrawing();
    canvas1.currentPen = null;
  }
  canvas1.setActiveShape("radio"); // Set the active shape type
});

rectangleShape.addEventListener("click", () => {
  if (canvas1.currentPen) {
    canvas1.currentPen.stopDrawing();
    canvas1.currentPen = null;
  }

  canvas1.setActiveShape("rectangle");
});

triangleShape.addEventListener("click", () => {
  if (canvas1.currentPen) {
    canvas1.currentPen.stopDrawing();
    canvas1.currentPen = null;
  }

  canvas1.setActiveShape("triangle");
});

circleShape.addEventListener("click", () => {
  if (canvas1.currentPen) {
    canvas1.currentPen.stopDrawing();
    canvas1.currentPen = null;
  }

  canvas1.setActiveShape("circle");
});

//const canvas1 = new DrawingCanvas("canvas1");
let isFilledGlobally = false;

// Function to update the global isFilled variable
function updateIsFilled() {
  const fillCheckbox = document.getElementById("fill");
  isFilledGlobally = fillCheckbox.checked;
}

// Add an event listener to the checkbox
document.getElementById("fill").addEventListener("change", updateIsFilled);

// Define a global variable to track the selected color
let globalcolor = "black"; // Default color

// Function to update the global color variable
function updateColor(event) {
  const selectedColor = event.target.id;
  if (
    selectedColor === "yellow" ||
    selectedColor === "red" ||
    selectedColor === "green"
  ) {
    globalcolor = selectedColor;
  }
}

// Add event listeners to the color div elements
const colorDivs = document.querySelectorAll(".pen-color");
colorDivs.forEach((div) => {
  div.addEventListener("click", updateColor);
});
