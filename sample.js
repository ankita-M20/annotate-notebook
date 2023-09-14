//drawing shapes
class Shape {
  constructor(canvas, ctx, color, isFilled) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.color = color;
    this.isFilled = isFilled;
    this.points = [];
  }
}

class Rectangle extends Shape {
  constructor(canvas, ctx, color, isFilled) {
    super(canvas, ctx, color, isFilled);
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;

    console.log(...this.points);

    if (this.isFilled) {
      this.ctx.fillRect(...this.points);
    } else {
      this.ctx.strokeRect(...this.points);
    }
  }
}

class Circle extends Shape {
  constructor(canvas, ctx, color, isFilled) {
    super(canvas, ctx, color, isFilled);
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;

    const [x, y, radius] = this.points;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (this.isFilled) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }
}

class Triangle extends Shape {
  constructor(canvas, ctx, color, isFilled) {
    super(canvas, ctx, color, isFilled);
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    const [x1, y1, x2, y2, x3, y3] = this.points;
    this.ctx.beginPath();
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

class DrawingApp {
  static isDrawing = false;
  static prevX = 0;
  static prevY = 0;
  static currentShape = null;
  static shapes = []; // Array to store drawn shapes

  constructor(activetool) {
    this.selectedTool = activetool;
  }

  setActiveShape(shapeType) {
    this.selectedTool = shapeType;
  }

  startDrawing(event, ctx) {
    this.isDrawing = true;
    const { offsetX, offsetY } = event;
    console.log("drawing");

    switch (this.selectedTool) {
      case "triangle":
        this.currentShape = new Triangle(ctx.canvas, ctx, "blue", true);
        // Define the side length of the equilateral triangle
        const sideLength = 200; // You can adjust this value as needed

        // Calculate the height of the equilateral triangle (height = sqrt(3) / 2 * sideLength)
        const height = (Math.sqrt(3) / 2) * sideLength;

        // Calculate the coordinates of the other two points
        const vertex1X = offsetX;
        const vertex1Y = offsetY;

        const vertex2X = offsetX - sideLength / 2;
        const vertex2Y = offsetY + height;

        const vertex3X = offsetX + sideLength / 2;
        const vertex3Y = offsetY + height;

        // Push the coordinates into your array
        this.currentShape.points.push(
          vertex1X,
          vertex1Y, // Point 1 (Mouse position)
          vertex2X,
          vertex2Y, // Point 2 (Calculated)
          vertex3X,
          vertex3Y // Point 3 (Calculated)
        );

        this.currentShape.draw(); // Add this line to start rendering the shape
        break;
      case "rectangle":
        this.currentShape = new Rectangle(ctx.canvas, ctx, "red", false);
        this.currentShape.points.push(offsetX, offsetY, 100, 100);
        this.currentShape.draw();
        break;
      case "circle":
        if (!this.prevX || !this.prevY) break;
        this.currentShape = new Circle(ctx.canvas, ctx, "green", false);
        const dx = offsetX - this.prevX;
        const dy = offsetY - this.prevY;
        const radius = Math.min(Math.sqrt(dx * dx + dy * dy), 100);
        console.log(dx, dy, radius);
        //this.currentShape.points[2] = radius;
        this.currentShape.points.push(offsetX, offsetY, radius);
        this.currentShape.draw();
        this.prevX = null;
        this.prevY = null;
        break;
      default:
        break;
    }

    this.prevX = offsetX;
    this.prevY = offsetY;

    console.log(this.prevX, this.prevY);
  }
  /*
  static draw(event, ctx) {
    if (!this.isDrawing || !this.currentShape) return;


    const { offsetX, offsetY } = event;


    switch (this.selectedTool) {
      case "triangle":
      case "rectangle":
        this.currentShape.points.push(offsetX, offsetY);
        this.currentShape.draw();
        break;
      case "circle":
        const dx = offsetX - this.prevX;
        const dy = offsetY - this.prevY;
        const radius = Math.sqrt(dx * dx + dy * dy);
        this.currentShape.points[2] = radius;
        this.currentShape.draw();
        break;
      default:
        break;
    }
    this.currentShape.draw();
  }*/

  static stopDrawing() {
    this.isDrawing = false;

    if (this.currentShape) {
      this.shapes.push(this.currentShape); // Store the drawn shape
      this.currentShape = null;
    }
  }
}

//--------------------------------------------------------------------------------------------
//Drawing Strokes using shape
class DrawingUtility {
  static drawCircle(ctx, circles, mouse, strokeColor, lineWidth) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (circles.length >= 1) {
      const lastCircle = circles[circles.length - 1];
      ctx.beginPath();
      ctx.moveTo(lastCircle.x, lastCircle.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }

    // Store the current mouse position as a circle
    circles.push({ x: mouse.x, y: mouse.y });
  }

  static drawRect(ctx, rectangles, mouse, isDrawingRect) {
    if (!isDrawingRect) {
      return; // Don't draw rectangles if rectangle drawing mode is off
    }

    // Set the fill color with transparency (e.g., 30% transparent cyan)
    ctx.fillStyle = "rgba(0, 255, 255, 0.3)";

    // Set line width to 0 for filled rectangles
    ctx.lineWidth = 0;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Calculate the fixed size for the rectangle
    const rectWidth = 35; // Set the width of the rectangle
    const rectHeight = 20; // Set the height of the rectangle

    let rectX = mouse.x - rectWidth / 2;
    let rectY = mouse.y - rectHeight / 2;

    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

    // Store the current rectangle
    rectangles.push({
      x: rectX,
      y: rectY,
      width: rectWidth,
      height: rectHeight,
    });
  }
}

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

    this.DrawingApp = new DrawingApp(this.activeShape);
    this.isDrawingCircle = false;
    this.isDrawingRect = false;
    this.isBrush = false;
    this.isEraser = false;

    this.circles = [[]];
    this.rectangles = [[]];

    this.strokes = [[]];
    this.undoStack = [];
    this.redoStack = [];

    this.isDrawingEnabled = false;
    this.activeButton = null;

    this.canvas.addEventListener("click", (event) => {
      if (this.isDrawingEnabled) {
        if (this.DrawingApp.selectedTool === "brush") {
          handleDrawingClick();
        } else if (
          this.DrawingApp.selectedTool === "rectangle" ||
          this.DrawingApp.selectedTool === "triangle" ||
          this.DrawingApp.selectedTool === "circle"
        ) {
          this.DrawingApp.startDrawing(event, this.ctx);
        }
      }
      this.toggleDrawing();
    });

    this.canvas.addEventListener("pointermove", (event) => {
      if (this.isDrawingEnabled) {
        // DrawingApp.draw(event); // Use DrawingApp draw method
        this.handlePointerMove(event);
      }
    });

    window.addEventListener("resize", () => {
      this.canvas.height = window.innerHeight;
      this.canvas.width = window.innerWidth;
    });
  }

  setActiveShape(shapeType) {
    this.activeShape = shapeType;
    this.DrawingApp.setActiveShape(this.activeShape);
    console.log(this.activeShape);
    console.log(this.DrawingApp);
  }

  //Strokes cases
  handleDrawingClick() {
    const currentStroke = {
      type: this.activeButton.id,
      data: this.isBrush ? [] : this.circles.slice(),
    };

    this.strokes.push(currentStroke);
    this.redoStack = [];
  }

  toggleDrawing() {
    this.isDrawingEnabled = !this.isDrawingEnabled;

    if (!this.isDrawingEnabled) {
      this.canvas.removeEventListener("pointermove", this.handlePointerMove);
      if (this.isDrawingRect) {
        this.rectangles = [];
      } else if (this.isDrawingCircle || this.isBrush || this.isEraser) {
        this.circles = [];
      }
    } else {
      this.canvas.addEventListener("pointermove", this.handlePointerMove);
    }
  }

  handlePointerMove = (event) => {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;

    if (
      this.isDrawingCircle &&
      !this.isDrawingRect &&
      !this.isBrush &&
      !this.isEraser
    ) {
      DrawingUtility.drawCircle(this.ctx, this.circles, this.mouse, "red", 2);
    }

    if (this.isBrush) {
      DrawingUtility.drawCircle(
        this.ctx,
        this.circles,
        this.mouse,
        "rgba(130, 255, 132, 0.2)",
        50
      );
    } else if (
      !this.isDrawingCircle &&
      !this.isDrawingRect &&
      !this.isBrush &&
      this.isEraser
    ) {
      DrawingUtility.drawCircle(
        this.ctx,
        this.circles,
        this.mouse,
        "cornsilk",
        60
      );
    } else if (
      !this.isDrawingCircle &&
      this.isDrawingRect &&
      !this.isBrush &&
      !this.isEraser
    ) {
      DrawingUtility.drawRect(
        this.ctx,
        this.rectangles,
        this.mouse,
        this.isDrawingRect
      );
    }
  };

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  //similar to clear canvas

  undo() {
    if (this.strokes.length > 0) {
      const lastStroke = this.strokes.pop();

      this.redoStack.push(lastStroke);
      // this.clearCanvas();

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
  //not working yet
  redo() {
    if (this.redoStack.length > 0) {
      const nextStroke = this.redoStack.pop();

      this.strokes.push(nextStroke);
      this.clearCanvas();

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
  //doesn't work
  redrawStrokes() {
    for (const stroke of this.strokes) {
      if (stroke.data) {
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

  startDrawing(targetButton) {
    const toggleDrawingButton = document.getElementById("toggle-drawing");
    const brushHighlighter = document.getElementById("brush-highlighter");
    const paintBrushButton = document.getElementById("paintbrush");
    const eraseButton = document.getElementById("erase-button");

    if (targetButton === toggleDrawingButton) {
      this.isDrawingCircle = !this.isDrawingCircle;
      toggleDrawingButton.classList.toggle("selected-brush");

      this.isDrawingRect = false;
      this.isBrush = false;
      this.isEraser = false;
      brushHighlighter.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } else if (targetButton === brushHighlighter) {
      this.isDrawingRect = !this.isDrawingRect;
      brushHighlighter.classList.toggle("selected-brush");

      this.isDrawingCircle = false;
      this.isBrush = false;
      this.isEraser = false;
      toggleDrawingButton.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } else if (targetButton === paintBrushButton) {
      this.isBrush = !this.isBrush;
      paintBrushButton.classList.toggle("selected-brush");

      this.isDrawingCircle = false;
      this.isDrawingRect = false;
      this.isEraser = false;
      toggleDrawingButton.classList.remove("selected-brush");
      brushHighlighter.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } else if (targetButton === eraseButton) {
      this.isEraser = !this.isEraser;
      eraseButton.classList.toggle("selected-brush");

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
  canvas1.setActiveShape("radio"); // Set the active shape type
});

rectangleShape.addEventListener("click", () => {
  canvas1.setActiveShape("rectangle");
});

triangleShape.addEventListener("click", () => {
  canvas1.setActiveShape("triangle");
});

circleShape.addEventListener("click", () => {
  canvas1.setActiveShape("circle");
});

ovalShape.addEventListener("click", () => {
  canvas1.setActiveShape("oval");
});

//const canvas1 = new DrawingCanvas("canvas1");
