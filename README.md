# 🧇 Crepería App

Aplicación web full-stack para la gestión de pedidos de una crepería.

Incluye:

* Sistema de autenticación
* Creación de pedidos personalizados
* Panel de administrador
* Actualización de estados en tiempo real
* Base de datos con Supabase

---

## 🚀 Tecnologías

* Next.js
* React
* Tailwind CSS
* Supabase (Auth + Database + Realtime)

---

## ⚙️ Instalación

### 1. Clonar repositorio

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

---

### 2. Instalar dependencias

```bash
npm install
```

---

### 3. Configurar variables de entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=TU_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_KEY
```

---

### 4. Configurar base de datos

1. Crear proyecto en Supabase
2. Ir a SQL Editor
3. Ejecutar el archivo:

```text
database.sql
```

---

### 5. Ejecutar proyecto

```bash
npm run dev
```

---

## 👤 Usuario administrador

Después de registrarte:

1. Ir a la tabla `profiles` en Supabase
2. Cambiar:

```text
role = admin
```

---

## 📦 Funcionalidades

* Crear crepas personalizadas
* Selección de ingredientes
* Cálculo automático de precio
* Gestión de pedidos
* Panel de administrador
* Actualización de estado en tiempo real

---

## 🌐 Despliegue

Se puede desplegar en:

* Render
* Vercel
* Railway

Solo asegúrate de configurar las variables de entorno.

---

## ⚠️ Notas

* No subir `.env.local`
* Cada usuario debe crear su propia base de datos en Supabase
* El sistema usa Row Level Security (RLS)

---

## 📄 Licencia

MIT
