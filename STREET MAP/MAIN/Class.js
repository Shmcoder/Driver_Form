class ShapeManager {
  constructor(mapContainerId) {
    this.map = L.map(mapContainerId).setView([11.0168, 76.9558], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.shapes = [];
    this.currentShape = null;

    // Map click event
    this.map.on("click", (event) => {
      if (this.currentShape) {
        const lat = event.latlng.lat;
        const lng = event.latlng.lng;

        // Prompt for radius or side length
        let dimension = prompt(
          "Enter dimension (radius for circle, side for triangle and rectangle) in meters:",
          200
        );
        if (dimension && !isNaN(dimension)) {
          dimension = parseFloat(dimension);

          // Draw based on the current shape type
          if (this.currentShape === "circle") {
            this.drawCircle(lat, lng, dimension);
          } else if (this.currentShape === "triangle") {
            this.drawTriangle(lat, lng, dimension);
          } else if (this.currentShape === "rectangle") {
            this.drawRectangle(lat, lng, dimension);
          }
        } else {
          alert("Invalid dimension entered.");
        }
      } else {
        console.log("No shape selected");
      }
    });
  }

  setCurrentShape(shapeType) {
    this.currentShape = shapeType;
  }

  drawCircle(lat, lng, radius) {
    const circle = L.circle([lat, lng], {
      color: "blue",
      fillColor: "blue",
      fillOpacity: 0.5,
      radius: radius,
    }).addTo(this.map);

    this.shapes.push({ shape: "circle", lat, lng, obj: circle });
    circle
      .bindPopup(
        `
            <b>Circle Information</b><br>
            Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}<br>
            Radius: ${radius} meters<br>
            <button onclick="shapeManager.editCircle(${lat}, ${lng})">Edit</button>
            <button onclick="shapeManager.removeCircle(${lat}, ${lng})">Remove</button>
        `
      )
      .openPopup();
  }

  drawTriangle(lat, lng, side) {
    const triangle = L.polygon(
      [
        [lat, lng],
        [lat + side * 0.00018, lng - side * 0.00018],
        [lat + side * 0.00018, lng + side * 0.00018],
      ],
      {
        color: "red",
        fillColor: "red",
        fillOpacity: 0.5,
      }
    ).addTo(this.map);

    this.shapes.push({ shape: "triangle", lat, lng, obj: triangle });
    triangle
      .bindPopup(
        `
            <b>Triangle Information</b><br>
            Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}<br>
            Side Length: ${side} meters<br>
            <button onclick="shapeManager.editTriangle(${lat}, ${lng})">Edit</button>
            <button onclick="shapeManager.removeTriangle(${lat}, ${lng})">Remove</button>
        `
      )
      .openPopup();
  }

  drawRectangle(lat, lng, side) {
    const rectangle = L.rectangle(
      [
        [lat, lng],
        [lat + side * 0.00018, lng + side * 0.00018],
      ],
      {
        color: "green",
        fillColor: "green",
        fillOpacity: 0.5,
      }
    ).addTo(this.map);

    this.shapes.push({ shape: "rectangle", lat, lng, obj: rectangle });
    rectangle
      .bindPopup(
        `
            <b>Rectangle Information</b><br>
            Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}<br>
            Side Length: ${side} meters<br>
            <button onclick="shapeManager.editRectangle(${lat}, ${lng})">Edit</button>
            <button onclick="shapeManager.removeRectangle(${lat}, ${lng})">Remove</button>
        `
      )
      .openPopup();
  }

  removeShape(lat, lng, shapeType) {
    this.shapes = this.shapes.filter((shape) => {
      if (shape.shape === shapeType && shape.lat === lat && shape.lng === lng) {
        this.map.removeLayer(shape.obj);
        return false;
      }
      return true;
    });
  }

  removeCircle(lat, lng) {
    this.removeShape(lat, lng, "circle");
  }
  removeTriangle(lat, lng) {
    this.removeShape(lat, lng, "triangle");
  }
  removeRectangle(lat, lng) {
    this.removeShape(lat, lng, "rectangle");
  }

  editCircle(lat, lng) {
    const newRadius = prompt("Enter new radius (meters):", 200);
    if (newRadius && !isNaN(newRadius)) {
      this.shapes.forEach((shape) => {
        if (
          shape.shape === "circle" &&
          shape.lat === lat &&
          shape.lng === lng
        ) {
          shape.obj.setRadius(parseFloat(newRadius));
          shape.obj.openPopup();
        }
      });
    } else {
      alert("Invalid radius entered.");
    }
  }

  editTriangle(lat, lng) {
    const newSide = prompt("Enter new side length (meters):", 200);
    if (newSide && !isNaN(newSide)) {
      const newTriangle = L.polygon(
        [
          [lat, lng],
          [lat + newSide * 0.00018, lng - newSide * 0.00018],
          [lat + newSide * 0.00018, lng + newSide * 0.00018],
        ],
        {
          color: "red",
          fillColor: "red",
          fillOpacity: 0.5,
        }
      ).addTo(this.map);

      this.removeTriangle(lat, lng); // Remove the old triangle
      this.shapes.push({ shape: "triangle", lat, lng, obj: newTriangle });

      newTriangle
        .bindPopup(
          `
                <b>Triangle Information</b><br>
                Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}<br>
                Side Length: ${newSide} meters<br>
                <button onclick="shapeManager.editTriangle(${lat}, ${lng})">Edit</button>
                <button onclick="shapeManager.removeTriangle(${lat}, ${lng})">Remove</button>
            `
        )
        .openPopup();
    } else {
      alert("Invalid side length entered.");
    }
  }

  editRectangle(lat, lng) {
    const newSide = prompt("Enter new side length (meters):", 200);
    if (newSide && !isNaN(newSide)) {
      const newRectangle = L.rectangle(
        [
          [lat, lng],
          [lat + newSide * 0.00018, lng + newSide * 0.00018],
        ],
        {
          color: "green",
          fillColor: "green",
          fillOpacity: 0.5,
        }
      ).addTo(this.map);

      this.removeRectangle(lat, lng); // Remove the old rectangle
      this.shapes.push({ shape: "rectangle", lat, lng, obj: newRectangle });

      newRectangle
        .bindPopup(
          `
                <b>Rectangle Information</b><br>
                Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}<br>
                Side Length: ${newSide} meters<br>
                <button onclick="shapeManager.editRectangle(${lat}, ${lng})">Edit</button>
                <button onclick="shapeManager.removeRectangle(${lat}, ${lng})">Remove</button>
            `
        )
        .openPopup();
    } else {
      alert("Invalid side length entered.");
    }
  }
}

// Usage
const shapeManager = new ShapeManager("map");

// Buttons to select shapes
document.getElementById("circle-btn").onclick = function () {
  shapeManager.setCurrentShape("circle");
  console.log("Circle selected");
};

document.getElementById("triangle-btn").onclick = function () {
  shapeManager.setCurrentShape("triangle");
  console.log("Triangle selected");
};

document.getElementById("rectangle-btn").onclick = function () {
  shapeManager.setCurrentShape("rectangle");
  console.log("Rectangle selected");
};
