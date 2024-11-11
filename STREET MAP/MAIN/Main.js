class ShapeManager {
  constructor(mapContainerId) {
    this.map = L.map(mapContainerId).setView([11.0168, 76.9558], 5);
    this.shapes = [];
    this.currentShape = null;
    this.circleColor = "green";
    this.triangleColor = "Red";
    this.rectangleColor = "blue";

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.on("click", this.onMapClick.bind(this));
  }

  onMapClick(event) {
    if (!this.currentShape) {
      console.log("No shape selected");
      return;
    }

    const { lat, lng } = event.latlng;
    const dimension = this.getDimension();

    if (dimension !== null) {
      switch (this.currentShape) {
        case "circle":
          this.drawShape("circle", lat, lng, dimension);
          break;
        case "triangle":
          this.drawShape("triangle", lat, lng, dimension);
          break;
        case "rectangle":
          this.drawShape("rectangle", lat, lng, dimension);
          break;
      }
    }
  }

  getDimension() {
    const input = prompt("Enter dimension in meters:", 200);
    const dimension = parseFloat(input);
    return isNaN(dimension)
      ? (alert("Invalid dimension entered."), null)
      : dimension;
  }

  setCurrentShape(shapeType) {
    this.currentShape = shapeType;
  }

  drawShape(type, lat, lng, size) {
    const shape = this.createShape(type, lat, lng, size);
    if (shape) {
      this.shapes.push({ type, lat, lng, obj: shape });
      shape.bindPopup(this.getPopupContent(type, lat, lng, size)).openPopup();
    }
  }

  createShape(type, lat, lng, size) {
    const options = {
      color:
        type === "circle"
          ? this.circleColor
          : type === "triangle"
          ? this.triangleColor
          : this.rectangleColor,
      // fillColor: type === "circle" ? "blue" : type === "triangle" ? "red" : "green",
      // fillOpacity: 0.5,
    };
    const points = {
      circle: () =>
        L.circle([lat, lng], { ...options, radius: size }).addTo(this.map),
      triangle: () =>
        L.polygon(
          [
            [lat, lng],
            [lat + size * 0.00018, lng - size * 0.00018],
            [lat + size * 0.00018, lng + size * 0.00018],
          ],
          options
        ).addTo(this.map),
      rectangle: () =>
        L.rectangle(
          [
            [lat, lng],
            [lat + size * 0.00018, lng + size * 0.00018],
          ],
          options
        ).addTo(this.map),
    };
    return points[type] ? points[type]() : null;
  }

  getPopupContent(type, lat, lng, size) {
    const shapeName = type.toUpperCase();
    return `
      <b>${shapeName} INFORMATION </b><br>
      COORD: ${lat.toFixed(4)}, ${lng.toFixed(4)}<br>
      ${type === "circle" ? "RADIUS" : "SIDE LENGTH"}: ${size} M<br>
      <button onclick="shapeManager.editShape('${type}', ${lat}, ${lng})">Edit</button>
      <button onclick="shapeManager.removeShape('${type}', ${lat}, ${lng})">Remove</button>
    `;
  }

  editShape(type, lat, lng) {
    const newSize = this.getDimension();
    if (newSize !== null) {
      this.removeShape(type, lat, lng);
      this.drawShape(type, lat, lng, newSize);
    }
  }

  removeShape(type, lat, lng) {
    this.shapes = this.shapes.filter((shape) => {
      if (shape.type === type && shape.lat === lat && shape.lng === lng) {
        this.map.removeLayer(shape.obj);
        return false;
      }
      return true;
    });
  }
}

// Usage
const shapeManager = new ShapeManager("map");

// Buttons to select shapes
document.getElementById("circle-btn").onclick = () =>
  shapeManager.setCurrentShape("circle");
document.getElementById("triangle-btn").onclick = () =>
  shapeManager.setCurrentShape("triangle");
document.getElementById("rectangle-btn").onclick = () =>
  shapeManager.setCurrentShape("rectangle");
