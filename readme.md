# NodePop

NodePop is a second-hand article sales platform built with Express, EJS, and MongoDB.

## Table of Contents

- [Requirements](#requirements)
- [Install Dependencies](#install-dependencies)
- [Initial Database Setup](#initial-database-setup)
- [Running the Application](#running-the-application)
  - [Production Mode](#production-mode)
  - [Development Mode](#development-mode)
- [Endpoints](#endpoints)

## Requirements

- Node.js v20.18.0 or later
- MongoDB instance (locally or cloud-based)
  
## Install Dependencies

1. First, navigate to the project directory:

   ```cd nodepop```


2. Install the necessary dependencies:
    ```npm install```


## Initial Database Setup
On the first deploy, you can empty the existing database and populate it with initial data by running:

```npm run initDB ```

This command will:

- Delete all users and products.
- Create initial user and product data.

## Running the Application

### Production Mode
To run the app in production mode, use the following command:

``` npm start ```

This will start the server on port 3000 (by default).

### Development Mode
For development mode (with live reloading), run:

``` npm run dev ```

This will run the app using nodemon for automatic restarts.

### Endpoints
Here are the main endpoints available in the application:

- GET / - Home page with product listings
- GET /login - Login page
- POST /login - Login form submission
- POST /products - Create a new product (requires authentication)
- DELETE /products/ - Delete a product (requires authentication)
- PUT /products/ - Edit an existing product (requires authentication)

---
---
---
---
---

# NodePop

NodePop es una plataforma de venta de artículos de segunda mano construida con Express, EJS y MongoDB.

## Tabla de Contenidos

- [Requisitos](#requisitos)
- [Instalar Dependencias](#instalar-dependencias)
- [Configuración Inicial de la Base de Datos](#configuracion-inicial-de-la-base-de-datos)
- [Ejecutando la Aplicación](#ejecutando-la-aplicacion)
  - [Modo Producción](#modo-produccion)
  - [Modo Desarrollo](#modo-desarrollo)
- [Endpoints](#endpoints)

## Requisitos

- Node.js v20.18.0 o superior
- Instancia de MongoDB (local o en la nube)
  
## Instalar Dependencias

1. Primero, navega al directorio del proyecto:

   ```cd nodepop```


2. Instala las dependencias necesarias:
    ```npm install```


## Configuración Inicial de la Base de Datos
En el primer despliegue, puedes vaciar la base de datos existente y llenarla con datos iniciales ejecutando:

```npm run initDB ```

Este comando hará lo siguiente:

- Eliminará todos los usuarios y productos.
- Creará datos iniciales de usuarios y productos.

## Ejecutando la Aplicación

### Modo Producción
Para ejecutar la aplicación en modo producción, usa el siguiente comando:

``` npm start ```

Esto iniciará el servidor en el puerto 3000 (por defecto).

### Modo Desarrollo
Para el modo desarrollo (con recarga en vivo), ejecuta:

``` npm run dev ```

Esto ejecutará la aplicación usando nodemon para reinicios automáticos.

### Endpoints
Estos son los principales endpoints disponibles en la aplicación:

- GET / - Página de inicio con listado de productos
- GET /login - Página de inicio de sesión
- POST /login - Envío del formulario de inicio de sesión
- POST /products - Crear un nuevo producto (requiere autenticación)
- DELETE /products/ - Eliminar un producto (requiere autenticación)
- PUT /products/ - Editar un producto existente (requiere autenticación)

