// ===============================================
// Archivo: data.js
// Propósito: Definir la estructura de datos compartida (productos/menús).
// ===============================================

const menus = {
  "don_domingo": {
    nombre: "Cafétin Don Domingo",
    imagen: "../imagenes/cafetin_domingo_banner.jpg", 
    productos: [
      { id: "dd-sjc", nombre: "Sandwich de Jamón y Queso", descripcion: "Clásico y delicioso.", precio: 45.00, imagen: "imagenes/sandwich.jpg" , categoria: "Sandwiches" },
      { id: "dd-bp", nombre: "Burrito de Pollo", descripcion: "Con queso, frijoles y aderezo.", precio: 70.00, imagen: "imagenes/burrito_pollo.jpg" , categoria: "Burritos" },
      { id: "dd-jv", nombre: "Jugo del Valle", descripcion: "Sabor a naranja.", precio: 30.00, imagen: "imagenes/jugo_valle.jpg" , categoria: "Bebidas" },
      { id: "dd-fmk", nombre: "Frappe Moka", descripcion: "Sabor Vainilla.", precio: 95, imagen: "imagenes/frappe_moka.jpg" , categoria: "Bebidas frías" }
    ]
  },
  "kilambe": {
    nombre: "Café Kilambe",
    imagen: "../imagenes/cafe_kilambe_banner.jpg",
    productos: [
      { id: "cf-cf", nombre: "Capuccino Frío", descripcion: "Espresso, leche y hielo.", precio: 65.00, imagen: "imagenes/capuccino.jpg" , categoria: "Bebidas frías" },
      { id: "cf-fmk", nombre: "Frapuccino Moka", descripcion: "Chocolate, café y crema batida.", precio: 80.00, imagen: "imagenes/frapuccino.jpg" , categoria: "Bebidas frías" },
      {id: "cf-tca", nombre: "Tostada con Aguacate", descripcion: "Pan integral y aguacate fresco.", precio: 50.00, imagen: "imagenes/tostada.jpg", categoria: "Desayunos" }
    ]
  },
  "el_profe":{ 
    nombre: "El Quiosco del profe",
    imagen: "../imagenes/el_profe_banner.jpg",
    productos: [
       { id: "cf-cf", nombre: "Capuccino Frío", descripcion: "Espresso, leche y hielo.", precio: 65.00, imagen: "imagenes/capuccino.jpg" , categoria: "Bebidas frías" },
      { id: "cf-fmk", nombre: "Frapuccino Moka", descripcion: "Chocolate, café y crema batida.", precio: 80.00, imagen: "imagenes/frapuccino.jpg" , categoria: "Bebidas frías" },
      {id: "cf-tca", nombre: "Tostada con Aguacate", descripcion: "Pan integral y aguacate fresco.", precio: 50.00, imagen: "imagenes/tostada.jpg", categoria: "Desayunos" }
    ]
  },
  "caribeño":{
    nombre: "Caribeño",
    imagen:"../imagenes/caribeño_banner.jpeg",
    productos: []
  },
  
  "el_gueguense":{
    nombre: "El Güegüense",
    imagen: "../imagenes/el_gueguense_banner.jpg",
    productos: []
  },
  "las_margaritas":{
    nombre: "Las Margaritas",
    imagen: "../imagenes/las_margaritas_banner.jpeg",
    productos: []
  }
}