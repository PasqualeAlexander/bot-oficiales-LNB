# BOT LNB OFICIAL

## Descripción

Este es un bot de HaxBall altamente especializado, diseñado para la gestión de partidos y torneos de la Liga Nacional de Bigger (LNB). Ofrece un conjunto completo de herramientas para garantizar la integridad y la organización de los partidos oficiales, al tiempo que proporciona flexibilidad para partidos amistosos.

## Características Principales

- **Modo Oficial y Amistoso:** El bot puede operar en dos modos. El modo "oficial" activa el sistema de firmas, reportes detallados y otras características de seguridad, mientras que el modo "amistoso" es para partidos casuales.
- **Sistema de Firmas:** En modo oficial, los jugadores deben firmar con `!firmo` para verificar su identidad antes de participar en los partidos. El bot detecta firmas múltiples y envía alertas a Discord.
- **Roles y Permisos:** Sistema de roles (Capitán) con permisos específicos para administrar la sala, como cambiar mapas y uniformes.
- **Comandos de Administración Avanzados:** Los administradores pueden kickear, banear, silenciar, gestionar la sala, y mucho más.
- **Gestión de Partidos:** Comandos para pausar, reanudar, detener y reiniciar partidos, con reportes automáticos.
- **Mapas Oficiales:** El bot incluye mapas oficiales de la LNB para diferentes tamaños de equipos (3v3, 4v4, 7v7) y un mapa de entrenamiento.
- **Uniformes y Camisetas:** Sistema de uniformes predefinidos y camisetas personalizadas para los equipos. Los jugadores pueden elegir su camiseta con `!camis [código]`.
- **Reportes a Discord:** Envío automático de reportes de partidos a un canal de Discord, incluyendo estadísticas detalladas, MVP, repeticiones y alertas de seguridad.
- **Estadísticas Detalladas:** El bot registra goles, asistencias, autogoles y tiempo de juego de cada jugador.
- **Sistema de Chat de Equipo:** Los jugadores pueden comunicarse en privado con sus compañeros de equipo.
- **Persistencia de Datos:** El bot guarda el estado del partido para recuperarlo en caso de un cierre inesperado.

## Comandos

### Comandos para Jugadores

- `!firmo`: Firma para verificar tu identidad en modo oficial.
- `!ayuda`: Muestra una lista de los comandos disponibles.
- `!bb` o `!nv`: Abandona la sala.
- `!stats`: Muestra tus estadísticas personales en el partido actual.
- `!uniformes`: Muestra la lista de uniformes disponibles.
- `!camis list`: Muestra la lista de códigos de camisetas disponibles.
- `!team name [nombre]`: Define el nombre de tu equipo.
- `!tname [nombre]`: Alias para `!team name`.
- `!name team [nombre]`: Alias para `!team name`.

### Comandos de Administración

- `!oficial`: Activa/desactiva el modo oficial.
- `!kick [jugador] [motivo]`: Expulsa a un jugador de la sala.
- `!ban [jugador] [motivo]`: Banea a un jugador de la sala.
- `!mute [jugador] [tiempo] [razon]`: Silencia a un jugador por un tiempo determinado.
- `!unmute [jugador]`: Quita el silencio a un jugador.
- `!clear` o `!clear bans`: Limpia la lista de baneados.
- `!mapa [nombre_mapa]`: Cambia el mapa de la sala.
- `!pause`: Pausa el partido.
- `!resume`: Reanuda el partido.
- `!stop`: Detiene el partido.
- `!restart`: Reinicia el partido.
- `!rr`: Reinicia el partido y envía el reporte del partido anterior.
- `!swap`: Intercambia los equipos y sus camisetas.
- `!verificar [jugador]`: Requiere la firma de un jugador.
- `!firmas`: Muestra todas las firmas registradas.
- `!firmas [red/blue]`: Muestra las firmas de un equipo específico.
- `!multiples`: Muestra las firmas múltiples detectadas.

### Comandos de Capitán

- `!capitan [clave]`: Reclama el rol de capitán.
- `!claim [clave]`: Alias para `!capitan`.
- `!uniforme [rojo/azul] [nombre_uniforme]`: Cambia el uniforme de tu equipo.
- `!camis [código]`: Elige una camiseta personalizada para tu equipo.

### Comandos de Chat

- `t [mensaje]`: Envía un mensaje a tu equipo.
- `@@[nombre] [mensaje]`: Envía un mensaje privado a un jugador.
- `!onlyteams` o `!only`: Filtra los mensajes para que solo los equipos puedan verlos.
- `!team add [nombre]` o `!tadd [nombre]`: Incluye a un espectador en el chat de tu equipo.
- `!team remove [nombre]` o `!tremove [nombre]`: Remueve a un jugador del chat de tu equipo.
- `!team leave` o `!tleave`: Abandona el chat de equipo.

### Comandos de Uniformes y Camisetas

- `!uniformes`: Muestra la lista de uniformes disponibles.
- `!uniforme [rojo/azul] [nombre_uniforme]`: Cambia el uniforme de un equipo.
- `!camis [código]`: Cambia la camiseta de tu equipo.
- `!camis list`: Muestra la lista de códigos de camisetas disponibles.
- `/colors [red/blue] [color1] [color2] [color3]`: Cambia los colores de un equipo.

## Sistema de Firmas

El sistema de firmas es una característica clave para los partidos oficiales. Cuando el modo oficial está activado, los jugadores deben usar el comando `!firmo` para verificar su identidad. El bot registra las firmas, detecta si un jugador está usando múltiples cuentas (firmas múltiples) y envía alertas a Discord si se detecta alguna anomalía.

## Mapas Oficiales

El bot incluye los siguientes mapas oficiales de la LNB:

- `biggerx7`
- `biggerx4`
- `biggerx3`
- `training`

## Sistema de Roles

- **Administrador:** Los administradores tienen acceso a todos los comandos del bot. Se configuran en la variable `ADMINS_OFICIALES`.
- **Capitán:** Los capitanes pueden reclamar su rol con una clave y tienen permisos para gestionar su equipo (cambiar uniformes, camisetas, etc.).

## Configuración

El bot se configura a través de las variables al principio del archivo `bot_lnb_oficiales.js`. Las configuraciones más importantes son:

- `roomName`: Nombre de la sala de HaxBall.
- `roomPassword`: Contraseña de la sala.
- `maxPlayers`: Número máximo de jugadores.
- `token`: Token de Headless Host.
- `webhookOficial`: URL del webhook de Discord para reportes oficiales.
- `webhookAmistoso`: URL del webhook de Discord para reportes de partidos amistosos.
- `webhookFirmas`: URL del webhook de Discord para la verificación de firmas.
- `ADMINS_OFICIALES`: Lista de administradores predefinidos.

## Requisitos del Sistema

El bot puede ser ejecutado de dos maneras:

1.  **Navegador:** Abriendo la consola de HaxBall en `https://www.haxball.com/headless` y pegando el contenido del script.
2.  **Node.js:** Ejecutando el script en un servidor con Node.js y el paquete `haxball-headless`.

## Instalación

### Navegador

1.  Copia el contenido completo del archivo `bot_lnb_oficiales.js`.
2.  Abre `https://www.haxball.com/headless` en tu navegador.
3.  Abre la consola de desarrollador (normalmente con F12).
4.  Pega el script en la consola y presiona Enter.

### Node.js

1.  Asegúrate de tener Node.js instalado.
2.  Instala el paquete de HaxBall Headless:
    ```bash
    npm install haxball
    ```
3.  Ejecuta el bot con Node.js:
    ```bash
    node bot_lnb_oficiales.js
    ```

## Autor

Script by ИФT

