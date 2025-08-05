/*
 * ██╗     ███╗   ██╗██████╗      ██████╗ ███████╗██╗ ██████╗██╗ █████╗ ██╗     
 * ██║     ████╗  ██║██╔══██╗    ██╔═══██╗██╔════╝██║██╔════╝██║██╔══██╗██║     
 * ██║     ██╔██╗ ██║██████╔╝    ██║   ██║█████╗  ██║██║     ██║███████║██║     
 * ██║     ██║╚██╗██║██╔══██╗    ██║   ██║██╔══╝  ██║██║     ██║██╔══██║██║     
 * ███████╗██║ ╚████║██████╔╝    ╚██████╔╝██║     ██║╚██████╗██║██║  ██║███████╗
 * ╚══════╝╚═╝  ╚═══╝╚═════╝      ╚═════╝ ╚═╝     ╚═╝ ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝
 * 
 * BOT OFICIAL LNB - PARTIDOS DE COMPETENCIA
 * Sistema especializado para torneos y partidos oficiales
*/
// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ═══════════════════════════════════════════════════════════════════════════════


const roomName = "🏆 LNB OFICIAL - DD VS ??? 🏆"; // CAMBIAR DD Y ??? POR LOS TEAMS
const roomPassword = null; // 
const maxPlayers = 28; // REEMPLAZAR 28 POR LA CANTIDAD MAXIMA DE JUGADORES DESEADA
const roomPublic = false; // Privada para control en competencias (nadie que no tenga el link puede entrar)
const token = "thr1.AAAAAGiSLqNBbT_v20_gTA.iiDZqI5L5lw";
const geo = { "code": "ar", "lat": -34.6118, "lon": -58.3960 }; // Buenos Aires, Argentina

// Variables para detección de cierre abrupto
let datosParaEnviarEnCierreAbrupto = null;
let intervalAutoGuardado = null;
let ultimoAutoGuardado = Date.now();
const INTERVALO_AUTO_GUARDADO = 5000; // 5 segundos (más frecuente para prevenir pérdida de datos)
const INTERVALO_GUARDADO_EMERGENCIA = 2000; // 2 segundos durante partidos activos

// Detectar si estamos en Node.js o navegador
const isNode = typeof window === 'undefined';

// ═══════════════════════════════════════════════════════════════════════════════
// SISTEMA DE COLORES LNB
// ═══════════════════════════════════════════════════════════════════════════════

const COLORES = {
    // Colores principales LNB
    PRIMARIO: "0066FF",      // Azul LNB principal
    SECUNDARIO: "87CEEB",    // Celeste LNB secundario
    
    // Colores de estado
    EXITO: "00FF00",         // Verde para éxitos
    ERROR: "FF0000",         // Rojo para errores
    ADVERTENCIA: "FFA500",   // Naranja para advertencias
    INFO: "87CEEB",          // Celeste para información
    
    // Colores especiales
    DORADO: "FFD700",        // Oro para destacados/premios
    OFICIAL: "FFD700",       // Dorado para modo oficial
    GRIS: "BBBBBB",          // Gris claro para mensajes secundarios
    
    // Colores de equipos (más claros y vibrantes para canchas grises)
    ROJO: "FF6B6B",          // Equipo rojo - coral claro vibrante
    AZUL: "5DADE2",          // Equipo azul - azul claro brillante
    
    FIRMA: "00FF00",         // Color para firmas
    VERIFICACION: "FFA500",  // Color para verificaciones
};

// Mantener compatibilidad
const AZUL_LNB = COLORES.PRIMARIO;
const CELESTE_LNB = COLORES.SECUNDARIO;

// ═══════════════════════════════════════════════════════════════════════════════
// WEBHOOKS DE DISCORD
// ═══════════════════════════════════════════════════════════════════════════════

// Webhook para reportes oficiales (nuevo webhook para la mayoría de reportes)
const webhookOficial = "https://discord.com/api/webhooks/1393029947018448966/C43K_d3JK-HOc6_awEv3LnGrSEtJdpHYAh0036R-FWCLuYuPZQnYEpI3P4-9xE0oNu89"; // Nuevo webhook para la mayoría de reportes

// Webhook específico para informes con formato :tld: (mantener el webhook original)
const webhookInformeTLD = "https://discord.com/api/webhooks/1390380586731962419/OZMBhBvzswFV45FMw8RSxaT_cSDb6jhaxrXkNqRmEJDg6kbtviSgsgbJ_K_hQDM7m-2H"; // Webhook original para informes específicos con :tld:

// Webhook para partidos amistosos
const webhookAmistoso = "https://discord.com/api/webhooks/1390784970192064552/snFojd01WfiOsAUf0txm6AAbGsiTe601tS9Qt5FF-yc7AYdym37UdSzH2COsJ5Z8WKr9"; // Webhook para partidos amistosos

// Webhook para verificación de firmas
let webhookFirmas = "https://discord.com/api/webhooks/1382500415651709039/XX6fUUPNDroa4FWl3-go7z5lgOWQb7j3ewHfRUIOS9eZ9AsfFS_9QqpQMod_l4NCjrBs";

// Webhook para notificaciones de creación de host
const webhookCreacionHost = "https://discord.com/api/webhooks/1390540202044424242/7aFfvwyhHcNFCizM2abV-W-zHwTb2hNe4ut-KX-VmqRCudS5VMMzERUhju0at59CP6Nm";

// ═══════════════════════════════════════════════════════════════════════════════
// MAPAS OFICIALES DE COMPETENCIA
// ═══════════════════════════════════════════════════════════════════════════════

const mapasOficiales = {
    biggerx7: {
        nombre: "Bigger x7 OFICIAL",
        minJugadores: 10,
        maxJugadores: 14,
        oficial: true,
        hbs: `{"name":"Bigger x7","width":1300,"height":670,"bg":{"width":1150,"height":600,"kickOffRadius":180,"color":"444444"},"vertexes":[{"x":0,"y":600,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-600,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":1150,"y":320,"cMask":[]},{"x":840,"y":320,"cMask":[]},{"x":1150,"y":-320,"cMask":[]},{"x":840,"y":-320,"cMask":[]},{"x":1150,"y":180,"cMask":[]},{"x":1030,"y":180,"cMask":[]},{"x":1150,"y":-180,"cMask":[]},{"x":1030,"y":-180,"cMask":[]},{"x":840,"y":-130,"cMask":[]},{"x":840,"y":130,"cMask":[]},{"x":-1150,"y":-320,"cMask":[]},{"x":-840,"y":-320,"cMask":[]},{"x":-1150,"y":320,"cMask":[]},{"x":-840,"y":320,"cMask":[]},{"x":-1150,"y":-180,"cMask":[]},{"x":-1030,"y":-180,"cMask":[]},{"x":-1150,"y":180,"cMask":[]},{"x":-1030,"y":180,"cMask":[]},{"x":-840,"y":130,"cMask":[]},{"x":-840,"y":-130,"cMask":[]},{"x":935,"y":3,"cMask":[]},{"x":935,"y":-3,"cMask":[]},{"x":-935,"y":3,"cMask":[]},{"x":-935,"y":-3,"cMask":[]},{"x":0,"y":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":0,"y":-180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":0,"y":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":-1150,"y":-130,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":-1215,"y":-80,"bCoef":0,"cMask":["ball"]},{"x":-1150,"y":130,"bCoef":0,"cMask":["red","blue","ball"]},{"x":-1215,"y":80,"bCoef":0,"cMask":["ball"]},{"x":1150,"y":130,"bCoef":0,"cMask":["red","blue","ball"]},{"x":1215,"y":80,"bCoef":0,"cMask":["ball"]},{"x":1150,"y":-130,"bCoef":0,"cMask":["red","blue","ball"]},{"x":1215,"y":-80,"bCoef":0,"cMask":["ball"]},{"x":-1150,"y":600,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":1150,"y":600,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":-1150,"y":130,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":-1150,"y":-600,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":1150,"y":-600,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":1150,"y":-130,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":1150,"y":130,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":1160,"y":130,"cMask":["ball"],"cGroup":["ball"]},{"x":-1160,"y":130,"cMask":["ball"],"cGroup":["ball"]},{"x":-1160,"y":-130,"cMask":["ball"],"cGroup":["ball"]},{"x":1160,"y":-130,"cMask":["ball"],"cGroup":["ball"]},{"x":-1215,"y":-3,"bCoef":0,"cMask":["ball"]},{"x":-1215,"y":10,"bCoef":0,"cMask":["ball"]},{"x":1215,"y":10,"bCoef":0,"cMask":["ball"]},{"x":1215,"y":-10,"bCoef":0,"cMask":["ball"]},{"x":-1150,"y":-130,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":1150,"y":130},{"x":1150,"y":-130},{"x":1150,"y":130,"cMask":[]},{"x":1150,"y":-130,"cMask":[]},{"x":0,"y":180,"cMask":[]},{"x":0,"y":-180,"cMask":[]},{"x":0,"y":-670,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":670,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]}],"segments":[{"v0":0,"v1":1,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":2,"v1":3,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":4,"v1":5,"cMask":[]},{"v0":5,"v1":7,"cMask":[]},{"v0":6,"v1":7,"cMask":[]},{"v0":8,"v1":9,"cMask":[]},{"v0":9,"v1":11,"cMask":[]},{"v0":10,"v1":11,"cMask":[]},{"v0":13,"v1":12,"curve":130,"cMask":[],"curveF":0.4663076581549986},{"v0":14,"v1":15,"cMask":[]},{"v0":15,"v1":17,"cMask":[]},{"v0":16,"v1":17,"cMask":[]},{"v0":18,"v1":19,"cMask":[]},{"v0":19,"v1":21,"cMask":[]},{"v0":20,"v1":21,"cMask":[]},{"v0":23,"v1":22,"curve":130,"cMask":[],"curveF":0.4663076581549986},{"v0":25,"v1":24,"curve":180,"color":"C7E6BD","cMask":[],"curveF":6.123233995736766e-17},{"v0":27,"v1":26,"curve":180,"color":"C7E6BD","cMask":[],"curveF":6.123233995736766e-17},{"v0":24,"v1":25,"curve":180,"color":"C7E6BD","cMask":[],"curveF":6.123233995736766e-17},{"v0":26,"v1":27,"curve":180,"color":"C7E6BD","cMask":[],"curveF":6.123233995736766e-17},{"v0":24,"v1":25,"curve":89.99999999999999,"color":"C7E6BD","cMask":[],"curveF":1.0000000000000002},{"v0":26,"v1":27,"curve":89.99999999999999,"color":"C7E6BD","cMask":[],"curveF":1.0000000000000002},{"v0":25,"v1":24,"curve":89.99999999999999,"color":"C7E6BD","cMask":[],"curveF":1.0000000000000002},{"v0":27,"v1":26,"curve":89.99999999999999,"color":"C7E6BD","cMask":[],"curveF":1.0000000000000002},{"v0":24,"v1":25,"color":"C7E6BD","cMask":[]},{"v0":26,"v1":27,"color":"C7E6BD","cMask":[]},{"v0":28,"v1":29,"curve":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"],"curveF":6.123233995736766e-17},{"v0":29,"v1":30,"curve":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"],"curveF":6.123233995736766e-17},{"v0":32,"v1":31,"curve":89.99999999999999,"color":"000000","bCoef":0,"cMask":["red","blue","ball"],"curveF":1.0000000000000002},{"v0":33,"v1":34,"curve":89.99999999999999,"color":"000000","bCoef":0,"cMask":["red","blue","ball"],"curveF":1.0000000000000002},{"v0":34,"v1":32,"color":"000000","bCoef":0,"cMask":["red","blue","ball"]},{"v0":36,"v1":35,"curve":89.99999999999999,"color":"000000","bCoef":0,"cMask":["red","blue","ball"],"curveF":1.0000000000000002},{"v0":37,"v1":38,"curve":89.99999999999999,"color":"000000","bCoef":0,"cMask":["red","blue","ball"],"curveF":1.0000000000000002},{"v0":36,"v1":38,"color":"000000","bCoef":0,"cMask":["red","blue","ball"]},{"v0":39,"v1":40,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":60},{"v0":39,"v1":41,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":-65},{"v0":31,"v1":42,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":-65},{"v0":42,"v1":43,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":-60},{"v0":43,"v1":44,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":-65},{"v0":40,"v1":45,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":65},{"v0":50,"v1":51,"color":"000000","bCoef":0,"cMask":["ball"]},{"v0":52,"v1":53,"color":"000000","bCoef":0,"cMask":["ball"]},{"v0":41,"v1":54,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"v0":57,"v1":58,"cMask":[]},{"v0":3,"v1":61,"vis":false,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":0,"v1":62,"vis":false,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]}],"planes":[{"normal":[0,1],"dist":-670,"bCoef":0},{"normal":[1,0],"dist":-1300,"bCoef":0},{"normal":[-1,0],"dist":-1300,"bCoef":0}],"goals":[{"p0":[-1161.3,130],"p1":[-1161.3,-130],"team":"red"},{"p0":[1161.3,130],"p1":[1161.3,-130],"team":"blue"}],"discs":[{"radius":8.75,"invMass":1.11,"pos":[0,0],"color":"FFFFFF","cGroup":["ball","kick","score"],"damping":0.991},{"radius":0,"invMass":0,"pos":[-1311,-19],"color":"transparent","bCoef":0,"cMask":["red"],"cGroup":["ball"]},{"radius":0,"invMass":0,"pos":[-1310,29],"color":"transparent","bCoef":0,"cMask":["blue"],"cGroup":["ball"]},{"radius":0,"invMass":0,"pos":[-1308,62],"color":"transparent","bCoef":0,"cMask":["red","blue"],"cGroup":["ball"]},{"radius":8,"invMass":0,"pos":[-1150,130],"color":"e56e56","cGroup":["ball"]},{"radius":8,"invMass":0,"pos":[1150,-130],"color":"5689e5","cGroup":["ball"]},{"radius":8,"invMass":0,"pos":[1150,130],"color":"5689e5","cGroup":["ball"]},{"radius":0,"pos":[-1149,-485],"cMask":[]},{"radius":0,"pos":[-1149,-485],"cMask":[]},{"radius":0,"pos":[1150,-130],"cMask":[]},{"radius":0,"pos":[-1149,485],"cMask":[]},{"radius":0,"pos":[1149,485],"cMask":[]},{"radius":0,"pos":[-1149,485],"cMask":[]},{"radius":0,"pos":[1149,485],"cMask":[]},{"radius":8,"invMass":0,"pos":[-1150,-130],"color":"e56e56","cGroup":["ball"]},{"radius":2.003390790792821,"pos":[-0.3579305730959277,599.1800461283714],"color":"5689e5","cMask":[]}],"playerPhysics":{"bCoef":0.4,"damping":0.9605,"acceleration":0.12,"kickStrength":5.75,"cGroup":["red","blue"]},"ballPhysics":"disc0","spawnDistance":600}`
    },
    biggerx4: {
        nombre: "Bigger x4 OFICIAL",
        minJugadores: 6,
        maxJugadores: 10,
        oficial: true,
        hbs: `{"name":"Bigger x5","width":870,"height":445,"bg":{"width":750,"height":400,"kickOffRadius":180,"color":"444444"},"vertexes":[{"x":0,"y":400,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":120,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-120,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-400,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":750,"y":215,"cMask":[]},{"x":560,"y":215,"cMask":[]},{"x":750,"y":-215,"cMask":[]},{"x":560,"y":-215,"cMask":[]},{"x":750,"y":140,"cMask":[]},{"x":665,"y":140,"cMask":[]},{"x":750,"y":-140,"cMask":[]},{"x":665,"y":-140,"cMask":[]},{"x":560,"y":-130,"cMask":[]},{"x":560,"y":130,"cMask":[]},{"x":-750,"y":-215,"cMask":[]},{"x":-560,"y":-215,"cMask":[]},{"x":-750,"y":215,"cMask":[]},{"x":-560,"y":215,"cMask":[]},{"x":-750,"y":-140,"cMask":[]},{"x":-665,"y":-140,"cMask":[]},{"x":-750,"y":140,"cMask":[]},{"x":-665,"y":140,"cMask":[]},{"x":-560,"y":130,"cMask":[]},{"x":-560,"y":-130,"cMask":[]},{"x":615,"y":3,"cMask":[]},{"x":615,"y":-3,"cMask":[]},{"x":-615,"y":3,"cMask":[]},{"x":-615,"y":-3,"cMask":[]},{"x":0,"y":120,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":0,"y":-120,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":0,"y":120,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":-750,"y":-100,"cMask":["ball"],"cGroup":["red","blue","wall"],"color":"000000"},{"x":-805,"y":-70,"bCoef":0,"cMask":["ball"],"color":"000000"},{"x":-750,"y":100,"bCoef":0,"cMask":["red","blue","ball"],"color":"000000"},{"x":-805,"y":70,"bCoef":0,"cMask":["ball"],"color":"000000"},{"x":750,"y":100,"bCoef":0,"cMask":["red","blue","ball"],"color":"000000"},{"x":805,"y":70,"bCoef":0,"cMask":["ball"],"color":"000000"},{"x":750,"y":-100,"bCoef":0,"cMask":["red","blue","ball"],"color":"000000"},{"x":805,"y":-70,"bCoef":0,"cMask":["ball"],"color":"000000"},{"x":-750,"y":400,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":750,"y":400,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":-750,"y":100,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":-750,"y":-400,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":750,"y":-400,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":750,"y":-100,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":750,"y":100,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":-805,"y":-10,"bCoef":0,"cMask":["ball"],"color":"000000"},{"x":-805,"y":10,"bCoef":0,"cMask":["ball"],"color":"000000"},{"x":805,"y":10,"bCoef":0,"cMask":["ball"],"color":"000000"},{"x":805,"y":-10,"bCoef":0,"cMask":["ball"],"color":"000000"},{"x":-750,"y":-100,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":750,"y":100,"cMask":[]},{"x":750,"y":-100,"cMask":[]},{"x":0,"y":120,"cMask":[]},{"x":0,"y":-120,"cMask":[]},{"x":0,"y":-445,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":445,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-120,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":120,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]}],"segments":[{"v0":0,"v1":1,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":2,"v1":3,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":4,"v1":5,"cMask":[]},{"v0":5,"v1":7,"cMask":[]},{"v0":6,"v1":7,"cMask":[]},{"v0":8,"v1":9,"cMask":[]},{"v0":9,"v1":11,"cMask":[]},{"v0":10,"v1":11,"cMask":[]},{"v0":13,"v1":12,"curve":130,"cMask":[],"curveF":0.4663076581549986},{"v0":14,"v1":15,"cMask":[]},{"v0":15,"v1":17,"cMask":[]},{"v0":16,"v1":17,"cMask":[]},{"v0":18,"v1":19,"cMask":[]},{"v0":19,"v1":21,"cMask":[]},{"v0":20,"v1":21,"cMask":[]},{"v0":23,"v1":22,"curve":130,"cMask":[],"curveF":0.4663076581549986},{"v0":25,"v1":24,"curve":180,"color":"C7E6BD","cMask":[],"curveF":6.123233995736766e-17},{"v0":27,"v1":26,"curve":180,"color":"C7E6BD","cMask":[],"curveF":6.123233995736766e-17},{"v0":24,"v1":25,"curve":180,"color":"C7E6BD","cMask":[],"curveF":6.123233995736766e-17},{"v0":26,"v1":27,"curve":180,"color":"C7E6BD","cMask":[],"curveF":6.123233995736766e-17},{"v0":24,"v1":25,"curve":89.99999999999999,"color":"C7E6BD","cMask":[],"curveF":1.0000000000000002},{"v0":26,"v1":27,"curve":89.99999999999999,"color":"C7E6BD","cMask":[],"curveF":1.0000000000000002},{"v0":25,"v1":24,"curve":89.99999999999999,"color":"C7E6BD","cMask":[],"curveF":1.0000000000000002},{"v0":27,"v1":26,"curve":89.99999999999999,"color":"C7E6BD","cMask":[],"curveF":1.0000000000000002},{"v0":24,"v1":25,"color":"C7E6BD","cMask":[]},{"v0":26,"v1":27,"color":"C7E6BD","cMask":[]},{"v0":28,"v1":29,"curve":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"],"curveF":6.123233995736766e-17},{"v0":29,"v1":30,"curve":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"],"curveF":6.123233995736766e-17},{"v0":32,"v1":31,"curve":89.99999999999999,"color":"000000","bCoef":0,"cMask":["red","blue","ball"],"curveF":1.0000000000000002},{"v0":33,"v1":34,"curve":89.99999999999999,"color":"000000","bCoef":0,"cMask":["red","blue","ball"],"curveF":1.0000000000000002},{"v0":34,"v1":32,"color":"000000","bCoef":0,"cMask":["red","blue","ball"]},{"v0":36,"v1":35,"curve":89.99999999999999,"color":"000000","bCoef":0,"cMask":["red","blue","ball"],"curveF":1.0000000000000002},{"v0":37,"v1":38,"curve":89.99999999999999,"color":"000000","bCoef":0,"cMask":["red","blue","ball"],"curveF":1.0000000000000002},{"v0":36,"v1":38,"color":"000000","bCoef":0,"cMask":["red","blue","ball"]},{"v0":39,"v1":40,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":50},{"v0":39,"v1":41,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":-60},{"v0":31,"v1":42,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":-60},{"v0":42,"v1":43,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":-50},{"v0":43,"v1":44,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":-60},{"v0":40,"v1":45,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":60},{"v0":46,"v1":47,"color":"000000","bCoef":0,"cMask":["ball"]},{"v0":48,"v1":49,"color":"000000","bCoef":0,"cMask":["ball"]},{"v0":41,"v1":50,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"v0":51,"v1":52,"cMask":[]},{"v0":3,"v1":55,"vis":false,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":0,"v1":56,"vis":false,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]}],"planes":[{"normal":[0,1],"dist":-445,"bCoef":0},{"normal":[0,-1],"dist":-445,"bCoef":0},{"normal":[1,0],"dist":-870,"bCoef":0},{"normal":[-1,0],"dist":-870,"bCoef":0}],"goals":[{"p0":[-761.3,100],"p1":[-761.3,-100],"team":"red"},{"p0":[761.3,100],"p1":[761.3,-100],"team":"blue"}],"discs":[{"radius":8.75,"invMass":1.11,"pos":[0,0],"color":"FFFFFF","cGroup":["ball","kick","score"],"damping":0.991},{"radius":0,"invMass":0,"pos":[-1311,-19],"color":"transparent","bCoef":0,"cMask":["red"],"cGroup":["ball"]},{"radius":0,"invMass":0,"pos":[-1310,29],"color":"transparent","bCoef":0,"cMask":["blue"],"cGroup":["ball"]},{"radius":0,"invMass":0,"pos":[-1308,62],"color":"transparent","bCoef":0,"cMask":["red","blue"],"cGroup":["ball"]},{"radius":8,"invMass":0,"pos":[-750,100],"color":"e56e56","cGroup":["ball"]},{"radius":8,"invMass":0,"pos":[750,-100],"color":"5689e5","cGroup":["ball"]},{"radius":8,"invMass":0,"pos":[750,100],"color":"5689e5","cGroup":["ball"]},{"radius":0,"pos":[-1149,-485],"cMask":[]},{"radius":0,"pos":[-1149,-485],"cMask":[]},{"radius":0,"pos":[1155.671526641948,-102.2725364171434],"cMask":[]},{"radius":0,"pos":[-1149,485],"cMask":[]},{"radius":0,"pos":[1149,485],"cMask":[]},{"radius":0,"pos":[-1149,485],"cMask":[]},{"radius":0,"pos":[1149,485],"cMask":[]},{"radius":8,"invMass":0,"pos":[-750,-100],"color":"e56e56","cGroup":["ball"]}],"playerPhysics":{"bCoef":0.4,"damping":0.9605,"acceleration":0.12,"kickStrength":5.75,"cGroup":["red","blue"]},"ballPhysics":"disc0","spawnDistance":400}`
    },
    biggerx3: {
        nombre: "Bigger x3 OFICIAL",
        minJugadores: 4,
        maxJugadores: 6,
        oficial: true,
        hbs: `{"name":"Bigger x3","width":600,"height":270,"bg":{"width":550,"height":240,"kickOffRadius":180,"color":"444444"},"vertexes":[{"x":-1.5884550345839648,"y":240.39711375864601,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":120,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-120,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-240,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":750,"y":215,"cMask":[]},{"x":750,"y":140,"cMask":[]},{"x":750,"y":-140,"cMask":[]},{"x":-750,"y":215,"cMask":[]},{"x":-750,"y":140,"cMask":[]},{"x":0,"y":120,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":0,"y":-120,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"]},{"x":0,"y":120,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"]},{"x":-556.8105676799998,"y":-108.16293376,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":-550,"y":90,"bCoef":0,"cMask":["red","blue","ball"]},{"x":550,"y":90,"bCoef":0,"cMask":["red","blue","ball"]},{"x":605,"y":65,"bCoef":0,"cMask":["ball"]},{"x":550,"y":-90,"bCoef":0,"cMask":["red","blue","ball"]},{"x":605,"y":-60,"bCoef":0,"cMask":["ball"]},{"x":-550,"y":240,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":550,"y":240,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":-550,"y":90,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":-550,"y":-240,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":550,"y":-240,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":550,"y":-90,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":550,"y":90,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":605,"y":10,"bCoef":0,"cMask":["ball"]},{"x":605,"y":-10,"bCoef":0,"cMask":["ball"]},{"x":-550,"y":-100,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":550,"y":90,"cMask":[]},{"x":550,"y":-90,"cMask":[]},{"x":0,"y":120,"cMask":[]},{"x":0,"y":-120,"cMask":[]},{"x":0,"y":-445,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":445,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-120,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":120,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":-550,"y":-240,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":550,"y":-240,"cMask":["ball"],"cGroup":["ball"]},{"x":550,"y":-90,"cMask":["ball"],"cGroup":["ball"]},{"x":550,"y":90,"cMask":[]},{"x":550,"y":-90,"cMask":[]},{"x":-550,"y":-90},{"x":-550,"y":90},{"x":-605,"y":-65,"bCoef":0},{"x":-605,"y":65,"bCoef":0},{"x":-550,"y":90},{"x":-550,"y":90,"cMask":[]},{"x":-550,"y":-90,"cMask":[]},{"x":-550,"y":-240,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":-550,"y":-90,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":-550,"y":-240,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":-550,"y":-90,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":0,"y":-294.23859342943956,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":-1.5884550345839648,"y":292.97791388580566,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]}],"segments":[{"v0":0,"v1":1,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":2,"v1":3,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":9,"v1":10,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"cMask":["red","blue"],"cGroup":["blueKO"]},{"v0":10,"v1":11,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"cMask":["red","blue"],"cGroup":["redKO"]},{"v0":15,"v1":14,"bCoef":0,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["red","blue","ball"]},{"v0":16,"v1":17,"bCoef":0,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["red","blue","ball"]},{"v0":15,"v1":17,"bCoef":0,"cMask":["red","blue","ball"]},{"v0":18,"v1":19,"bias":50,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"v0":18,"v1":20,"bias":-60,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"v0":19,"v1":24,"bias":60,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"v0":25,"v1":26,"bCoef":0,"cMask":["ball"]},{"v0":28,"v1":29,"cMask":[]},{"v0":36,"v1":37,"bias":-50,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"v0":37,"v1":38,"bias":-60,"cMask":["ball"],"cGroup":["ball"]},{"v0":43,"v1":41,"curve":89.99999998999999,"curveF":1.000000000174533},{"v0":43,"v1":44,"bCoef":0},{"v0":45,"v1":44,"curve":89.99999998999999,"curveF":1.000000000174533},{"v0":46,"v1":47,"cMask":[]},{"v0":50,"v1":51,"bias":50,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"v0":3,"v1":52,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":53,"v1":0,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]}],"planes":[{"normal":[0,1],"dist":-295.5069602335031,"bCoef":0},{"normal":[0,-1],"dist":-307.1558067516866,"bCoef":0},{"normal":[1,0],"dist":-608.1657367142399,"bCoef":0},{"normal":[-1,0],"dist":-604.9919880683518,"bCoef":0}],"goals":[{"p0":[-561.3,80],"p1":[-561.3,-80],"team":"red"},{"p0":[561.3,80],"p1":[561.3,-80],"team":"blue"}],"discs":[{"radius":8.75,"invMass":1.11,"damping":0.991,"cGroup":["ball","kick","score"]},{"pos":[-1311,-19],"radius":0,"bCoef":0,"invMass":0,"color":"transparent","cMask":["red"],"cGroup":["ball"]},{"pos":[-1310,29],"radius":0,"bCoef":0,"invMass":0,"color":"transparent","cMask":["blue"],"cGroup":["ball"]},{"pos":[-1308,62],"radius":0,"bCoef":0,"invMass":0,"color":"transparent","cMask":["red","blue"],"cGroup":["ball"]},{"pos":[-550,-90],"radius":8,"invMass":0,"color":"E56E56","cGroup":["ball"]},{"pos":[550,-90],"radius":8,"invMass":0,"color":"5689E5","cGroup":["ball"]},{"pos":[550,90],"radius":8,"invMass":0,"color":"5689E5","cGroup":["ball"]},{"pos":[-1149,-485],"radius":0,"cMask":[]},{"pos":[-1149,-485],"radius":0,"cMask":[]},{"pos":[1155.671526641948,-102.2725364171434],"radius":0,"cMask":[]},{"pos":[-1149,485],"radius":0,"cMask":[]},{"pos":[1149,485],"radius":0,"cMask":[]},{"pos":[-1149,485],"radius":0,"cMask":[]},{"pos":[1149,485],"radius":0,"cMask":[]},{"pos":[-550,90],"radius":8,"invMass":0,"color":"E56E56","cGroup":["ball"]}],"playerPhysics":{"bCoef":0.4,"damping":0.9605,"acceleration":0.12,"kickStrength":5.75,"cGroup":["red","blue"]},"ballPhysics":"disc0","spawnDistance":400}`
    },
    training: {
        nombre: "Training LNB Bigger",
        minJugadores: 1,
        maxJugadores: 28,
        oficial: false,
        hbs: `{
	"name": "LNB Training Bigger",
	"width": 640,
	"height": 240,
	"bg": {
		"width": 600,
		"height": 200,
		"cornerRadius": 0,
		"kickOffRadius": 0,
		"color": "444444"
	},
	"vertexes": [
		{
			"x": -598.63951104,
			"y": -57.67413248,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": 600,
			"y": -56.398647452781994,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": -414,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": -412.14722604766126,
			"y": -58.788227917036046,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": -202,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": -201.3698303731169,
			"y": -57.355250447273065,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": 201.07361302383063,
			"y": -56.93545396469731,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": 202,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": 407.85277395233874,
			"y": -56.93545396469731,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": 406,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": 0,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": -600,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": -600,
			"y": 200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": 600,
			"y": 200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": 600,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": 0,
			"y": -56.558037048480166,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": -203,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": -412.72097792,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": -412.25778443191535,
			"y": -57.398647452781994,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": -201.3110917096094,
			"y": -57.35525044727308,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": -2,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": -1.1422342813246593,
			"y": -56.558037048480166,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": 200,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": 202.3159674404234,
			"y": -57.398647452781994,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": 408,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": 407.53680651191536,
			"y": -56.93545396469731,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": 21.28664857801301,
			"y": -56.55803704848016,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": 20,
			"y": 200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": -20,
			"y": 200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": -19.57111714066233,
			"y": -56.55803704848016,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": -0.399993896484375,
			"y": -18.399999618530273,
			"bCoef": 0.5,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": -0.399993896484375,
			"y": -18.399999618530273,
			"bCoef": 0.5,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": -598.63951104,
			"y": -57.03462144,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": 600,
			"y": -55.67413248,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": 0,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": 0.8577657186753413,
			"y": -56.1291541891425,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": -412,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": -411.53680651191536,
			"y": -59.195508976592784,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": -203,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": -202.7396607462338,
			"y": -57.355250447273065,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": -4,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": -1.4267028439739775,
			"y": -56.558037048480166,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": 200,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": 200,
			"y": -57.398647452781994,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": 410,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": 409.5368065119153,
			"y": -56.00906698852794,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": -601.36048896,
			"y": -58.31364352,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": 600,
			"y": -56.953154559999994,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"x": 204,
			"y": -200,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"x": 203.07361302383063,
			"y": -56.472260476612625,
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {}
			}
		}
	],
	"segments": [
		{
			"v0": 0,
			"v1": 1,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 2,
			"v1": 3,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 4,
			"v1": 5,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 6,
			"v1": 7,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 8,
			"v1": 9,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 11,
			"v1": 12,
			"color": "FFFFFF",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {},
				"arc": {
					"a": [
						-600,
						-200
					],
					"b": [
						-600,
						200
					],
					"curve": 0.03191808732129907,
					"radius": 718035.2591580878,
					"center": [
						-718635.2313043019,
						0
					],
					"from": -0.000278537857347863,
					"to": 0.000278537857347863
				}
			},
			"curve": 0.03191808732129907
		},
		{
			"v0": 12,
			"v1": 13,
			"color": "FFFFFF",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 13,
			"v1": 14,
			"color": "FFFFFF",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 11,
			"v1": 14,
			"color": "FFFFFF",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {},
				"arc": {
					"a": [
						-600,
						-200
					],
					"b": [
						600,
						-200
					],
					"radius": null,
					"center": [
						null,
						null
					],
					"from": null,
					"to": null
				}
			}
		},
		{
			"v0": 15,
			"v1": 10,
			"vis": false,
			"color": "FFFFFF",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 17,
			"v1": 18,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {},
				"arc": {
					"a": [
						-412.72097792,
						-200
					],
					"b": [
						-412.25778443191535,
						-57.398647452781994
					],
					"radius": null,
					"center": [
						null,
						null
					],
					"from": null,
					"to": null
				}
			}
		},
		{
			"v0": 16,
			"v1": 19,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {},
				"arc": {
					"a": [
						-203,
						-200
					],
					"b": [
						-201.3110917096094,
						-57.35525044727308
					],
					"radius": null,
					"center": [
						null,
						null
					],
					"from": null,
					"to": null
				}
			}
		},
		{
			"v0": 20,
			"v1": 21,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 22,
			"v1": 23,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 24,
			"v1": 25,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 26,
			"v1": 27,
			"color": "FFFFFF",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 29,
			"v1": 28,
			"color": "FFFFFF",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 32,
			"v1": 33,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {},
				"arc": {
					"a": [
						-598.63951104,
						-57.03462144
					],
					"b": [
						600,
						-55.67413248
					],
					"radius": null,
					"center": [
						null,
						null
					],
					"from": null,
					"to": null
				}
			}
		},
		{
			"v0": 34,
			"v1": 35,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 36,
			"v1": 37,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {},
				"arc": {
					"a": [
						-412,
						-200
					],
					"b": [
						-411.53680651191536,
						-59.195508976592784
					],
					"radius": null,
					"center": [
						null,
						null
					],
					"from": null,
					"to": null
				}
			}
		},
		{
			"v0": 38,
			"v1": 39,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"mirror": {},
				"arc": {
					"a": [
						-203,
						-200
					],
					"b": [
						-202.7396607462338,
						-57.355250447273065
					],
					"radius": null,
					"center": [
						null,
						null
					],
					"from": null,
					"to": null
				}
			}
		},
		{
			"v0": 40,
			"v1": 41,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 42,
			"v1": 43,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 44,
			"v1": 45,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		},
		{
			"v0": 46,
			"v1": 47,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			],
			"_data": {
				"arc": {
					"a": [
						-601.36048896,
						-58.31364352
					],
					"b": [
						600,
						-56.953154559999994
					],
					"curve": -0.9906195726473764,
					"radius": 69485.5917224418,
					"center": [
						78.00620168229217,
						-69540.58417289691
					],
					"from": 1.5632839966095118,
					"to": 1.5805735697869079
				},
				"mirror": {}
			},
			"curve": -0.9906195726473764
		},
		{
			"v0": 48,
			"v1": 49,
			"color": "FEFEFE",
			"cMask": [
				"ball"
			],
			"cGroup": [
				"ball"
			]
		}
	],
	"planes": [
		{
			"normal": [
				0,
				1
			],
			"dist": -250.24609375,
			"bCoef": 0.5,
			"cGroup": [
				"ball"
			],
			"_data": {
				"extremes": {
					"normal": [
						0,
						1
					],
					"dist": -250.24609375,
					"canvas_rect": [
						-479.9744938760839,
						-183.7574631991133,
						481.4445535816768,
						184.49249305190975
					],
					"a": [
						-479.9744938760839,
						-250.24609375
					],
					"b": [
						481.4445535816768,
						-250.24609375
					]
				}
			}
		},
		{
			"normal": [
				0,
				-1
			],
			"dist": -250.75390625,
			"bCoef": 0.5,
			"cGroup": [
				"ball"
			],
			"_data": {
				"extremes": {
					"normal": [
						0,
						-1
					],
					"dist": -250.75390625,
					"canvas_rect": [
						-479.9744938760839,
						-183.7574631991133,
						481.4445535816768,
						184.49249305190975
					],
					"a": [
						-479.9744938760839,
						250.75390625
					],
					"b": [
						481.4445535816768,
						250.75390625
					]
				}
			}
		},
		{
			"normal": [
				1,
				0
			],
			"dist": -653.5,
			"bCoef": 0.5,
			"cGroup": [
				"ball"
			],
			"_data": {
				"extremes": {
					"normal": [
						1,
						0
					],
					"dist": -653.5,
					"canvas_rect": [
						-479.9744938760839,
						-183.7574631991133,
						481.4445535816768,
						184.49249305190975
					],
					"a": [
						-653.5,
						-183.7574631991133
					],
					"b": [
						-653.5,
						184.49249305190975
					]
				}
			}
		},
		{
			"normal": [
				-1,
				0
			],
			"dist": -654.5,
			"bCoef": 0.5,
			"cGroup": [
				"ball"
			],
			"_data": {
				"extremes": {
					"normal": [
						-1,
						0
					],
					"dist": -654.5,
					"canvas_rect": [
						-479.9744938760839,
						-183.7574631991133,
						481.4445535816768,
						184.49249305190975
					],
					"a": [
						654.5,
						-183.7574631991133
					],
					"b": [
						654.5,
						184.49249305190975
					]
				}
			}
		}
	],
	"goals": [],
	"discs": [
		{
			"invMass": 0.0001,
			"pos": [
				0,
				0
			],
			"color": "transparent",
			"cGroup": [
				"ball",
				"kick",
				"score"
			],
			"_data": {
				"mirror": {}
			}
		},
		{
			"radius": 8.75,
			"invMass": 1.11,
			"pos": [
				-505,
				-135
			],
			"color": "ffffff",
			"cGroup": [
				"ball",
				"kick",
				"score"
			],
			"damping": 0.991,
			"_data": {
				"mirror": {}
			}
		},
		{
			"radius": 8.75,
			"invMass": 1.11,
			"pos": [
				-310.44195584,
				-135
			],
			"color": "ffffff",
			"cGroup": [
				"ball",
				"kick",
				"score"
			],
			"damping": 0.991,
			"_data": {
				"mirror": {}
			}
		},
		{
			"radius": 8.75,
			"invMass": 1.11,
			"pos": [
				-100,
				-135
			],
			"color": "ffffff",
			"cGroup": [
				"ball",
				"kick",
				"score"
			],
			"damping": 0.991,
			"_data": {
				"mirror": {}
			}
		},
		{
			"radius": 8.75,
			"invMass": 1.11,
			"pos": [
				100,
				-135
			],
			"color": "ffffff",
			"cGroup": [
				"ball",
				"kick",
				"score"
			],
			"damping": 0.991,
			"_data": {
				"mirror": {}
			}
		},
		{
			"radius": 8.75,
			"invMass": 1.11,
			"pos": [
				305,
				-135
			],
			"color": "ffffff",
			"cGroup": [
				"ball",
				"kick",
				"score"
			],
			"damping": 0.991,
			"_data": {
				"mirror": {}
			}
		},
		{
			"radius": 8.75,
			"invMass": 1.11,
			"pos": [
				505,
				-135
			],
			"color": "ffffff",
			"cGroup": [
				"ball",
				"kick",
				"score"
			],
			"damping": 0.991,
			"_data": {
				"mirror": {}
			}
		},
		{
			"radius": 8.75,
			"invMass": 1.11,
			"pos": [
				200,
				5
			],
			"color": "ffffff",
			"cGroup": [
				"ball",
				"kick",
				"score"
			],
			"damping": 0.991,
			"_data": {
				"mirror": {}
			}
		},
		{
			"radius": 8.75,
			"invMass": 1.11,
			"pos": [
				450,
				5
			],
			"color": "ffffff",
			"cGroup": [
				"ball",
				"kick",
				"score"
			],
			"damping": 0.991,
			"_data": {
				"mirror": {}
			}
		},
		{
			"radius": 8.795853442032572,
			"invMass": 1.11,
			"pos": [
				200,
				150
			],
			"color": "ffffff",
			"cGroup": [
				"ball",
				"kick",
				"score"
			],
			"damping": 0.991,
			"_data": {
				"mirror": {}
			}
		},
		{
			"radius": 8.75,
			"invMass": 1.11,
			"pos": [
				-500,
				5
			],
			"color": "ffffff",
			"cGroup": [
				"ball",
				"kick",
				"score"
			],
			"damping": 0.991,
			"_data": {
				"mirror": {}
			}
		},
		{
			"radius": 8.75,
			"invMass": 1.11,
			"pos": [
				-200,
				5
			],
			"color": "ffffff",
			"cGroup": [
				"ball",
				"kick",
				"score"
			],
			"damping": 0.991,
			"_data": {
				"mirror": {}
			}
		},
		{
			"radius": 8.75,
			"invMass": 1.11,
			"pos": [
				-500,
				150
			],
			"color": "ffffff",
			"cGroup": [
				"ball",
				"kick",
				"score"
			],
			"damping": 0.991,
			"_data": {
				"mirror": {}
			}
		},
		{
			"radius": 8.75,
			"invMass": 1.11,
			"pos": [
				-200,
				150
			],
			"color": "ffffff",
			"cGroup": [
				"ball",
				"kick",
				"score"
			],
			"damping": 0.991,
			"_data": {
				"mirror": {}
			}
		},
		{
			"radius": 8.75,
			"invMass": 1.11,
			"pos": [
				450,
				150
			],
			"color": "ffffff",
			"cGroup": [
				"ball",
				"kick",
				"score"
			],
			"damping": 0.991,
			"_data": {
				"mirror": {}
			}
		}
	],
	"playerPhysics": {},
	"ballPhysics": "disc0",
	"spawnDistance": 500,
	"traits": {},
	"joints": [],
	"redSpawnPoints": [],
	"blueSpawnPoints": [],
	"canBeStored": false
}`
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SISTEMA DE ROLES Y ADMINISTRADORES
// ═══════════════════════════════════════════════════════════════════════════════

const ROLES = {
    CAPITAN: {
        nombre: "Capitán",
        prefix: "👑",
        permisos: ["kick", "ban", "cambiar_mapa", "oficializar", "ver_firmas", "control_partido"],
        color: COLORES.DORADO
    }
};

// Administradores predefinidos (auth strings de HaxBall)
const ADMINS_OFICIALES = {
    // Agregar administradores aquí según sea necesario
    // Formato: "AUTH_STRING": { role: "ADMIN", nombre: "NombreAdmin" }
};

// ═══════════════════════════════════════════════════════════════════════════════
// VARIABLES GLOBALES DEL BOT OFICIAL
// ═══════════════════════════════════════════════════════════════════════════════

let room;
let modoOficial = false; // Comienza en modo amistoso, se activa con !oficial
let mapaActual = "biggerx7";
let partidoEnCurso = false;
let tiempoInicioPartido = null;
let mapaNoOficial = false; // Variable para trackear si el mapa actual no es oficial

// Sistema de replays
let replayData = null;
let replayActual = null; // Identificador del replay actual
let reporteEnviado = false;
// Variable para controlar si hay un envío de replay e informe en proceso
let envioEnProceso = false;
let enviarReplaysDiscord = true; // Siempre enviar replays en modo oficial
let guardarReplaysOficiales = true;
let guardarReplaysAmistosos = false; // En bot oficial solo guardamos oficiales
let guardarReplaysEnPC = false; // Para compatibilidad
let segundosMinimoPartido = 60; // 1 minuto mínimo

// Estadísticas del partido
let estadisticasPartido = {
    jugadores: {},
    golesRed: 0,
    golesBlue: 0,
    duracion: 0,
    iniciado: false,
    arqueroRed: null,
    arqueroBlue: null,
    tiempoVallaInvictaRed: 0,
    tiempoVallaInvictaBlue: 0
};

// Sistema de persistencia para recuperar datos en caso de cierre inesperado
const PERSISTENCIA_KEY = 'bot_lnb_datos_persistentes';
let datosPartidoPendiente = null;
let intentosRecuperacion = 0;
const MAX_INTENTOS_RECUPERACION = 3;

// Función para guardar datos del partido en localStorage
function guardarDatosPartido() {
    if (!partidoEnCurso) return;
    
    try {
        // Calcular debeEnviarReplay localmente
        const debeEnviarReplayLocal = enviarReplaysDiscord && (modoOficial ? guardarReplaysOficiales : true);
        
        const datos = {
            timestamp: Date.now(),
            partidoEnCurso: partidoEnCurso,
            tiempoInicioPartido: tiempoInicioPartido ? tiempoInicioPartido.getTime() : null,
            mapaActual: mapaActual,
            modoOficial: modoOficial,
            estadisticasPartido: estadisticasPartido,
            nombreEquipoRojo: nombreEquipoRojo,
            nombreEquipoAzul: nombreEquipoAzul,
            replayData: replayData,
            debeEnviarReplay: debeEnviarReplayLocal,
            reporteEnviado: reporteEnviado,
            firmasRecibidas: firmasRecibidas ? Array.from(firmasRecibidas.entries()) : [],
            jugadoresVerificados: jugadoresVerificados ? Array.from(jugadoresVerificados.entries()) : [],
            versión: '1.0'
        };
        
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(PERSISTENCIA_KEY, JSON.stringify(datos));
            console.log('💾 Datos del partido guardados en localStorage');
        } else if (typeof require !== 'undefined') {
            // En Node.js, guardar en archivo
            const fs = require('fs');
            const path = require('path');
            const archivoTemporal = path.join(__dirname, 'datos_temporales_bot.json');
            fs.writeFileSync(archivoTemporal, JSON.stringify(datos, null, 2));
            console.log('💾 Datos del partido guardados en archivo temporal');
        }
    } catch (error) {
        console.log('❌ Error al guardar datos del partido:', error);
    }
}

// Función para recuperar datos del partido en caso de reinicio
function recuperarDatosPartido() {
    try {
        let datos = null;
        
        if (typeof localStorage !== 'undefined') {
            const datosGuardados = localStorage.getItem(PERSISTENCIA_KEY);
            if (datosGuardados) {
                datos = JSON.parse(datosGuardados);
                console.log('🔄 Datos del partido recuperados de localStorage');
            }
        } else if (typeof require !== 'undefined') {
            // En Node.js, leer desde archivo
            const fs = require('fs');
            const path = require('path');
            const archivoTemporal = path.join(__dirname, 'datos_temporales_bot.json');
            
            if (fs.existsSync(archivoTemporal)) {
                const contenido = fs.readFileSync(archivoTemporal, 'utf8');
                datos = JSON.parse(contenido);
                console.log('🔄 Datos del partido recuperados de archivo temporal');
            }
        }
        
        if (datos && datos.timestamp) {
            const tiempoTranscurrido = Date.now() - datos.timestamp;
            const TIEMPO_MAXIMO_RECUPERACION = 10 * 60 * 1000; // 10 minutos
            
            if (tiempoTranscurrido < TIEMPO_MAXIMO_RECUPERACION) {
                console.log(`⏰ Datos encontrados de hace ${Math.floor(tiempoTranscurrido / 1000)} segundos`);
                
                // Verificar si hay datos de un partido que no se envió
                if (datos.partidoEnCurso === false && datos.estadisticasPartido && 
                    datos.estadisticasPartido.iniciado && !datos.reporteEnviado) {
                    
                    console.log('🚨 ¡PARTIDO TERMINADO DETECTADO SIN ENVIAR!');
                    console.log(`📊 Partido ${datos.modoOficial ? 'oficial' : 'amistoso'} pendiente de envío`);
                    
                    // Restaurar datos necesarios
                    estadisticasPartido = datos.estadisticasPartido;
                    nombreEquipoRojo = datos.nombreEquipoRojo;
                    nombreEquipoAzul = datos.nombreEquipoAzul;
                    mapaActual = datos.mapaActual;
                    modoOficial = datos.modoOficial;
                    replayData = datos.replayData;
                    debeEnviarReplay = datos.debeEnviarReplay;
                    
                    // Restaurar firmas y jugadores verificados
                    if (datos.firmasRecibidas) {
                        firmasRecibidas = new Map(datos.firmasRecibidas);
                    }
                    if (datos.jugadoresVerificados) {
                        jugadoresVerificados = new Map(datos.jugadoresVerificados);
                    }
                    
                    datosPartidoPendiente = datos;
                    
                    // Programar envío automático con retraso
                    setTimeout(() => {
                        enviarPartidoPendiente();
                    }, 5000); // 5 segundos de espera
                    
                    return true;
                } else {
                    console.log('ℹ️ No hay partidos pendientes de envío');
                }
            } else {
                console.log('⏰ Datos demasiado antiguos, descartando...');
                limpiarDatosTemporales();
            }
        } else {
            console.log('ℹ️ No se encontraron datos temporales');
        }
        
        return false;
    } catch (error) {
        console.log('❌ Error al recuperar datos del partido:', error);
        return false;
    }
}

// Función para enviar partido pendiente recuperado
function enviarPartidoPendiente() {
    if (!datosPartidoPendiente) return;
    
    intentosRecuperacion++;
    
    if (intentosRecuperacion > MAX_INTENTOS_RECUPERACION) {
        console.log('❌ Máximo de intentos de recuperación alcanzado');
        limpiarDatosTemporales();
        return;
    }
    
    console.log(`🔄 Enviando partido pendiente (intento ${intentosRecuperacion}/${MAX_INTENTOS_RECUPERACION})`);
    
    try {
        // Verificar que tenemos datos válidos
        if (!estadisticasPartido || !estadisticasPartido.iniciado) {
            console.log('❌ Estadísticas del partido no válidas');
            limpiarDatosTemporales();
            return;
        }
        
        // Forzar envío del reporte
        reporteEnviado = false;
        
        // Llamar a la función de envío de reporte
        enviarReporteDiscord();
        
        // Marcar como enviado después de un breve retraso
        setTimeout(() => {
            limpiarDatosTemporales();
            console.log('✅ Partido pendiente procesado exitosamente');
        }, 3000);
        
    } catch (error) {
        console.log('❌ Error al enviar partido pendiente:', error);
        
        // Reintentar después de un tiempo
        setTimeout(() => {
            enviarPartidoPendiente();
        }, 10000); // 10 segundos
    }
}

// Función para limpiar datos temporales
function limpiarDatosTemporales() {
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(PERSISTENCIA_KEY);
            console.log('🗑️ Datos temporales limpiados de localStorage');
        } else if (typeof require !== 'undefined') {
            const fs = require('fs');
            const path = require('path');
            const archivoTemporal = path.join(__dirname, 'datos_temporales_bot.json');
            
            if (fs.existsSync(archivoTemporal)) {
                fs.unlinkSync(archivoTemporal);
                console.log('🗑️ Archivo temporal eliminado');
            }
        }
        
        datosPartidoPendiente = null;
        intentosRecuperacion = 0;
    } catch (error) {
        console.log('❌ Error al limpiar datos temporales:', error);
    }
}

// Función para guardar periódicamente durante el partido
function iniciarGuardadoPeriodico() {
    setInterval(() => {
        if (partidoEnCurso) {
            guardarDatosPartido();
        }
    }, 30000); // Guardar cada 30 segundos durante el partido
}

// Sistema de firmas
let firmasRequeridas = new Set(); // Jugadores que deben firmar
let firmasRecibidas = new Map(); // {playerID: {nombre, auth, timestamp, firmaID}}
let jugadoresVerificados = new Map(); // {playerID: {nombre, verificado, timestamp}}
let intervalosRecordatorio = new Map(); // {playerID: intervalID} para recordatorios
let contadorFirmaID = 1; // Contador para generar IDs únicos de firmas
let firmasPorAuth = new Map(); // {auth: [firmaData1, firmaData2, ...]} para detectar firmas múltiples
let datosJugadores = new Map(); // {playerID: {name, auth, conn, team, timestamp}} para almacenar datos completos de jugadores

// Sistema de estadísticas persistentes
let estadisticasGlobales = {
    jugadores: {},
    records: {
        mayorGoles: {jugador: "", cantidad: 0, fecha: ""},
        mayorAsistencias: {jugador: "", cantidad: 0, fecha: ""},
        partidoMasLargo: {duracion: 0, fecha: "", equipos: ""},
        goleadaMasGrande: {diferencia: 0, resultado: "", fecha: ""},
        hatTricks: [],
        vallasInvictas: []
    },
    totalPartidos: 0,
    fechaCreacion: new Date().toISOString(),
    contadorJugadores: 0
};

// Variables para el seguimiento de la pelota (para asistencias)
let ultimoTocador = null;
let penultimoTocador = null;
let tiempoUltimoToque = 0;

// Sistema de administradores
let jugadoresConRoles = new Map(); // {playerID: {role, assignedBy, timestamp}}
let adminActual = null;

// Sistema de nombres de equipos personalizados
let nombreEquipoRojo = null; // Nombre personalizado del equipo rojo
let nombreEquipoAzul = null; // Nombre personalizado del equipo azul
let equiposDefinidos = false; // Si ambos equipos han definido sus nombres

// Variable para almacenar el enlace real de la sala
let enlaceRealSala = "https://www.haxball.com/play?c=abcd1234"; // Valor por defecto

// Sistema de filtro de mensajes para equipos
let jugadoresEnOnlyTeams = new Set(); // Jugadores que tienen activado el modo only teams

// Sistema de mute/silenciamiento
let jugadoresSilenciados = new Map();
let tiemposSilencio = new Map();

function toggleOnlyTeams(jugador) {
    if (jugadoresEnOnlyTeams.has(jugador.id)) {
        jugadoresEnOnlyTeams.delete(jugador.id);
        // MENSAJE PRIVADO: Solo el jugador puede verlo
        anunciarInfo(`🔓 Modo de mensajes estándar activado. Ahora verás mensajes de todos (equipos y espectadores)`, jugador.id);
    } else {
        jugadoresEnOnlyTeams.add(jugador.id);
        // MENSAJE PRIVADO: Solo el jugador puede verlo
        anunciarInfo(`ℹ️ 🔒 Modo 'Only Teams' activado, not spect (lag)2s. Solo verás mensajes de jugadores en equipos (no espectadores)`, jugador.id);
    }
}

// Función para verificar si el enlace real está disponible
function tieneEnlaceReal() {
    return enlaceRealSala && enlaceRealSala !== "https://www.haxball.com/play?c=abcd1234";
}

// Función para generar el informe de la sala
function generarInformeSala() {
    console.log("🔍 DEBUG: Generando informe de sala...");
    console.log("🔍 DEBUG: enlaceRealSala actual = " + enlaceRealSala);
    console.log("🔍 DEBUG: tieneEnlaceReal() = " + tieneEnlaceReal());
    
    const sala = room.getPlayerList();
    const jugadores = sala.filter(p => p.id !== 0); // Excluir al bot
    const totalJugadores = jugadores.length;
    const maxJugadores = 28; // Máximo para el bot oficial
    
    // Determinar si la sala es pública o privada
    const esPublica = !roomPassword || roomPassword === null;
    const tipoSala = esPublica ? "Partido oficial LNB" : "Partido oficial LNB (Privado)";
    const iconoContraseña = esPublica ? "🔓" : "🔒";
    const textoContraseña = esPublica ? "Sin contraseña" : "*****";
    
    console.log("🔍 DEBUG: esPublica =", esPublica);
    console.log("🔍 DEBUG: tipoSala =", tipoSala);
    
    // Determinar estado del partido y emoji correspondiente
    let estadoTexto = "Esperando jugadores...";
    
    const scores = room.getScores();
    if (totalJugadores >= 2 && !scores) {
        estadoTexto = "Jugadores presentes, pero sin juego aún";
    } else if (scores) {
        const tiempo = Math.floor(scores.time / 60);
        estadoTexto = `Partido en juego » ["${tiempo}'"] 🔴 "${scores.red} - ${scores.blue}" 🔵`;
    }
    
    const mensaje = `╭━━━ 🏟️ *${tipoSala}* ━━━╮
┃ 🏷️ Nombre: \`${roomName}\`
┃ 🔗 Enlace: [Entrar a la sala](${enlaceRealSala})
┃ 👥 Jugadores: \`${totalJugadores} / ${maxJugadores}\`
┃ ${iconoContraseña} Contraseña: \`${textoContraseña}\`
┃ ⏳ Estado: *${estadoTexto}*
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;
    
    console.log("🔍 DEBUG: Mensaje generado con enlace: " + enlaceRealSala);
    return mensaje;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE UTILIDAD
// ═══════════════════════════════════════════════════════════════════════════════

// Función para anunciar mensajes generales
function anunciarGeneral(mensaje, color = COLORES.INFO, estilo = "normal") {
    room.sendAnnouncement(mensaje, null, hexToNumber(color), estilo, 2);
}

// Función para anunciar mensajes informativos
function anunciarInfo(mensaje, jugador = null) {
    room.sendAnnouncement(mensaje, jugador, hexToNumber(COLORES.INFO), "normal", 1);
}

// Función para anunciar errores
function anunciarError(mensaje, jugador = null) {
    room.sendAnnouncement(mensaje, jugador, hexToNumber(COLORES.ERROR), "bold", 2);
}

// Función para anunciar éxitos
function anunciarExito(mensaje, jugador = null) {
    room.sendAnnouncement(mensaje, jugador, hexToNumber(COLORES.EXITO), "bold", 1);
}

// Función para anunciar modo oficial
function anunciarOficial(mensaje, jugador = null) {
    room.sendAnnouncement(mensaje, jugador, hexToNumber(COLORES.OFICIAL), "bold", 2);
}

// Convertir color hex a número
function hexToNumber(hex) {
    return parseInt(hex, 16);
}

// Función para verificar permisos
function tienePermiso(jugador, permiso) {
    if (!jugador) return false;
    
    const rolInfo = jugadoresConRoles.get(jugador.id);
    if (!rolInfo) return false;
    
    const rol = ROLES[rolInfo.role];
    return rol && rol.permisos.includes(permiso);
}

// Función para verificar si es admin
function esAdmin(jugador) {
    return tienePermiso(jugador, "kick") || tienePermiso(jugador, "ban");
}

// ═══════════════════════════════════════════════════════════════════════════════
// SISTEMA DE FIRMAS
// ═══════════════════════════════════════════════════════════════════════════════

// Función para generar ID único de firma
function generarFirmaID() {
    return `LNB-${String(contadorFirmaID++).padStart(4, '0')}`;
}

// Función para requerir firma de un jugador
function requerirFirma(jugador, motivo = "Verificación de identidad") {
    firmasRequeridas.add(jugador.id);
    
    // Enviar mensaje unificado y embellecido
    const mensajeUnificado = `🖊️ ${jugador.name}, aún no has firmado\n📝 Motivo: ${motivo}\n💡 Escribe: !firmo para verificarte`;
    anunciarOficial(mensajeUnificado, jugador.id);
    
    // Configurar recordatorio cada minuto
    iniciarRecordatorioFirma(jugador);
    
    console.log(`🖊️ Firma requerida para ${jugador.name} (ID: ${jugador.id}) - Motivo: ${motivo}`);
}

// Función para iniciar recordatorios automáticos
function iniciarRecordatorioFirma(jugador) {
    // Limpiar recordatorio previo si existe
    detenerRecordatorioFirma(jugador.id);
    
    // Crear nuevo recordatorio cada 60 segundos
    const intervalo = setInterval(() => {
        // Verificar si el jugador sigue en la sala y sin firmar
        const jugadorActual = room.getPlayerList().find(p => p.id === jugador.id);
        if (!jugadorActual || !firmasRequeridas.has(jugador.id)) {
            detenerRecordatorioFirma(jugador.id);
            return;
        }
        
        // Mensaje de recordatorio unificado y embellecido
        const recordatorioUnificado = `⏰ ${jugadorActual.name}, recordatorio de firma\n💡 Escribe: !firmo para verificarte`;
        anunciarOficial(recordatorioUnificado, jugadorActual.id);
        console.log(`⏰ Recordatorio de firma enviado a ${jugadorActual.name}`);
    }, 60000); // 60 segundos
    
    intervalosRecordatorio.set(jugador.id, intervalo);
    console.log(`⏰ Recordatorio automático iniciado para ${jugador.name}`);
}

// Función para detener recordatorios
function detenerRecordatorioFirma(jugadorID) {
    const intervalo = intervalosRecordatorio.get(jugadorID);
    if (intervalo) {
        clearInterval(intervalo);
        intervalosRecordatorio.delete(jugadorID);
        console.log(`⏰ Recordatorio detenido para jugador ID: ${jugadorID}`);
    }
}

// Función para procesar firma automática (sin parámetros)
function procesarFirmaAutomatica(jugador) {
    // Verificar si ya firmó
    if (firmasRecibidas.has(jugador.id)) {
        anunciarError("❌ Ya has firmado anteriormente.", jugador.id);
        return false;
    }
    
    // NUEVA LÓGICA: Permitir firmar a cualquier persona, incluso espectadores
    // No mostrar mensajes informativos adicionales sobre el tipo de firma
    
    // OBTENER DATOS REALES DEL JUGADOR desde el Map de datos almacenados
    const datosAlmacenados = datosJugadores.get(jugador.id);
    let authJugador, connJugador;
    
    if (datosAlmacenados) {
        // Usar datos reales almacenados al ingresar
        authJugador = datosAlmacenados.auth;
        connJugador = datosAlmacenados.conn;
        console.log(`✅ Usando datos almacenados para ${jugador.name}: AUTH=${authJugador}, CONN=${connJugador}`);
    } else {
        // Fallback a los datos del objeto jugador actual
        authJugador = jugador.auth || "SIN_AUTH";
        connJugador = jugador.conn || "SIN_CONN";
        console.log(`⚠️ Usando datos del objeto jugador para ${jugador.name}: AUTH=${authJugador}, CONN=${connJugador}`);
    }
    
    const firmasAnteriores = firmasPorAuth.get(authJugador) || [];
    
    // Generar ID único para la firma
    const firmaID = generarFirmaID();
    
    // Registrar la firma con todos los datos requeridos
    const datosJugador = {
        firmaID: firmaID,
        nombre: jugador.name, // Nombre en sala
        nombreSala: jugador.name,
        playerID: jugador.id,
        conn: connJugador,
        auth: authJugador,
        timestamp: new Date().toISOString(),
        ip: "PROTEGIDA" // Por seguridad
    };
    
    // Detectar firma múltiple
    if (firmasAnteriores.length > 0) {
        datosJugador.firmaMultiple = true;
        datosJugador.firmasAnteriores = firmasAnteriores;
        
        // Solo registrar en consola, sin alertar en chat
        console.log(`⚠️ FIRMA MÚLTIPLE DETECTADA: ${jugador.name} (Auth: ${authJugador})`);
        
        // Enviar alerta especial a Discord
        enviarAlertaFirmaMultiple(datosJugador, firmasAnteriores);
    }
    
    // Agregar esta firma al registro por auth
    firmasAnteriores.push(datosJugador);
    firmasPorAuth.set(authJugador, firmasAnteriores);
    
    firmasRecibidas.set(jugador.id, datosJugador);
    firmasRequeridas.delete(jugador.id);
    jugadoresVerificados.set(jugador.id, {
        firmaID: firmaID,
        nombreSala: jugador.name,
        verificado: true,
        timestamp: new Date().toISOString()
    });
    
    // Detener recordatorios
    detenerRecordatorioFirma(jugador.id);
    
        anunciarExito(`¡${jugador.name} has firmado correctamente!`, jugador.id);
        
        // Enviar firma al webhook de verificación
        enviarFirmaDiscord(datosJugador);
        
        console.log(`✅ Firma automática procesada: ${jugador.name} → ID: ${firmaID} (CONN: ${connJugador})`);
        return true;
}

// Función para procesar firma manual (con nombre real - mantenida para compatibilidad)
function procesarFirma(jugador, nombreReal) {
    if (!firmasRequeridas.has(jugador.id)) {
        anunciarError("❌ No se requiere tu firma en este momento.", jugador.id);
        return false;
    }
    
    // OBTENER DATOS REALES DEL JUGADOR desde el Map de datos almacenados
    const datosAlmacenados = datosJugadores.get(jugador.id);
    let authJugador, connJugador;
    
    if (datosAlmacenados) {
        // Usar datos reales almacenados al ingresar
        authJugador = datosAlmacenados.auth;
        connJugador = datosAlmacenados.conn;
        console.log(`✅ Usando datos almacenados para ${jugador.name}: AUTH=${authJugador}, CONN=${connJugador}`);
    } else {
        // Fallback a los datos del objeto jugador actual
        authJugador = jugador.auth || "SIN_AUTH";
        connJugador = jugador.conn || "SIN_CONN";
        console.log(`⚠️ Usando datos del objeto jugador para ${jugador.name}: AUTH=${authJugador}, CONN=${connJugador}`);
    }
    
    const firmasAnteriores = firmasPorAuth.get(authJugador) || [];
    
    // Generar ID único para la firma
    const firmaID = generarFirmaID();
    
    // Registrar la firma con todos los datos requeridos
    const datosJugador = {
        firmaID: firmaID,
        nombre: nombreReal,
        nombreSala: jugador.name,
        playerID: jugador.id,
        conn: connJugador,
        auth: authJugador,
        timestamp: new Date().toISOString(),
        ip: "PROTEGIDA" // Por seguridad
    };
    
    // Detectar firma múltiple
    if (firmasAnteriores.length > 0) {
        datosJugador.firmaMultiple = true;
        datosJugador.firmasAnteriores = firmasAnteriores;
        
        // Solo registrar en consola, sin alertar en chat
        console.log(`⚠️ FIRMA MÚLTIPLE DETECTADA: ${jugador.name} (Auth: ${authJugador})`);
        
        // Enviar alerta especial a Discord
        enviarAlertaFirmaMultiple(datosJugador, firmasAnteriores);
    }
    
    // Agregar esta firma al registro por auth
    firmasAnteriores.push(datosJugador);
    firmasPorAuth.set(authJugador, firmasAnteriores);
    
    firmasRecibidas.set(jugador.id, datosJugador);
    firmasRequeridas.delete(jugador.id);
    jugadoresVerificados.set(jugador.id, {
        firmaID: firmaID,
        nombre: nombreReal,
        nombreSala: jugador.name,
        verificado: true,
        timestamp: new Date().toISOString()
    });
    
    // Detener recordatorios
    detenerRecordatorioFirma(jugador.id);
    
        anunciarExito(`¡${jugador.name} has firmado correctamente!`, jugador.id);
        
        // Enviar firma al webhook de verificación
        enviarFirmaDiscord(datosJugador);
        
        console.log(`✅ Firma procesada: ${jugador.name} → ${nombreReal} (ID: ${firmaID}) (CONN: ${connJugador})`);
        return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE DISCORD
// ═══════════════════════════════════════════════════════════════════════════════

// Función para enviar reportes oficiales
async function enviarReporteOficial(mensaje) {
    if (!webhookOficial) {
        console.log("⚠️ Webhook oficial no configurado");
        return;
    }
    
    try {
        const payload = {
            embeds: [{
                title: "Reporte Oficial LNB",
                description: mensaje,
                color: hexToNumber(COLORES.OFICIAL),
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Liga Nacional de Bigger - Partido Oficial"
                }
            }]
        };
        
        const response = await fetch(webhookOficial, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            console.log("📤 Reporte oficial enviado a Discord");
        } else {
            console.log("❌ Error al enviar reporte oficial:", response.status);
        }
    } catch (error) {
        console.log("❌ Error al enviar reporte oficial:", error);
    }
}

// Función para enviar reportes amistosos
async function enviarReporteAmistoso(mensaje) {
    if (!webhookAmistoso) {
        console.log("⚠️ Webhook amistoso no configurado");
        return;
    }
    
    try {
        const payload = {
            embeds: [{
                title: "⚽ REPORTE AMISTOSO LNB",
                description: mensaje,
                color: hexToNumber(COLORES.INFO),
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Liga Nacional de Bigger - Partido Amistoso"
                }
            }]
        };
        
        const response = await fetch(webhookAmistoso, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            console.log("📤 Reporte amistoso enviado a Discord");
        } else {
            console.log("❌ Error al enviar reporte amistoso:", response.status);
        }
    } catch (error) {
        console.log("❌ Error al enviar reporte amistoso:", error);
    }
}

// Función para enviar alerta de firma múltiple
async function enviarAlertaFirmaMultiple(nuevaFirma, firmasAnteriores) {
    // CORRECCIÓN: Las alertas de firmas múltiples van SOLO al webhook de FIRMAS
    if (!webhookFirmas) {
        console.log("⚠️ Webhook de firmas no configurado para alertas");
        return;
    }
    
    try {
let descripcion = `🧍‍♂️ **Jugador actual:** \`${nuevaFirma.nombreSala}\`  \n`;
        descripcion += `🔑 **Auth:** \`${nuevaFirma.auth}\`  \n`;
        descripcion += `🆔 **ID de Firma actual:** \`${nuevaFirma.firmaID}\`\n\n`;
        
        descripcion += `📄 **Firmas anteriores en este partido:**  \n`;
        firmasAnteriores.forEach((firma, index) => {
            const nombreInfo = firma.nombre ? `${firma.nombreSala} → ${firma.nombre}` : firma.nombreSala;
            descripcion += `• \`${nombreInfo}\` (🆔 \`${firma.firmaID}\`)  \n`;
            descripcion += `🕒 Firmado el: \`${new Date(firma.timestamp).toLocaleString()}\`\n\n`;
        });
        
        descripcion += `⚠️ **Este jugador firmó *${firmasAnteriores.length + 1} veces* en el mismo partido.**\n\n<@1205369907106287647>`;
        
        const payload = {
            embeds: [{
                title: "🚨 ALERTA: FIRMA MÚLTIPLE",
                description: descripcion,
                color: hexToNumber(COLORES.ERROR),
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Sistema de Detección de Firmas Múltiples - LNB"
                }
            }]
        };
        
        // SOLO enviar al webhook de firmas
        const response = await fetch(webhookFirmas, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            console.log("🚨 Alerta de firma múltiple enviada SOLO a webhook de firmas");
        } else {
            console.log("❌ Error al enviar alerta de firma múltiple:", response.status);
        }
    } catch (error) {
        console.log("❌ Error al enviar alerta de firma múltiple:", error);
    }
}

// Función para enviar firmas al webhook de verificación
async function enviarFirmaDiscord(datosJugador) {
    if (!webhookFirmas) {
        console.log("⚠️ Webhook de firmas no configurado");
        return;
    }
    
    try {
        let descripcion = `> 🆔 **ID de Firma:** \`${datosJugador.firmaID}\`  
> 👤 **Nombre:** \`${datosJugador.nombre || datosJugador.nombreSala}\`  
> 🔢 **ID:** \`${datosJugador.playerID.toString()}\`  
> 🌐 **Conexión:** \`${datosJugador.conn}\`  
> 🔐 **Auth:** \`${datosJugador.auth}\`  
> ⏰ **Timestamp:** \`${datosJugador.timestamp}\``;
        
        // Agregar información de firma múltiple si aplica
        if (datosJugador.firmaMultiple) {
            descripcion += `\n\n🚨 **FIRMA MÚLTIPLE:** Esta persona ya firmó ${datosJugador.firmasAnteriores.length} vez(es) antes`;
        }
        
        const titulo = datosJugador.firmaMultiple ? "🚨 **Firma Múltiple Detectada**" : "🖊️ **Nueva Firma Registrada**";
        const color = datosJugador.firmaMultiple ? COLORES.ERROR : COLORES.FIRMA;
        
        const payload = {
            embeds: [{
                title: titulo,
                description: descripcion,
                color: hexToNumber(color),
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Scripy by ИФT"
                }
            }]
        };
        
        const response = await fetch(webhookFirmas, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            console.log("📤 Firma enviada a Discord para verificación");
        } else {
            console.log("❌ Error al enviar firma:", response.status);
        }
    } catch (error) {
        console.log("❌ Error al enviar firma:", error);
    }
}

// Función para enviar datos de login (replicando bot original)
function enviarDatosLogin(nombre, id, conn, auth) {
    if (!webhookFirmas) {
        console.log("⚠️ Webhook de firmas no configurado para datos de login");
        return;
    }
    
    try {
        const payload = {
            embeds: [{
                title: "👤 **Jugador Ingresó**",
                description: `> 🧑 **Nombre:** \`${nombre}\`  
> 🔢 **ID:** \`${id.toString()}\`  
> 🌐 **Conexión:** \`${conn}\`  
> 🔐 **Auth:** \`${auth}\`  
> ⏰ **Timestamp:** \`${new Date().toISOString()}\``,
                fields: [],
                color: hexToNumber(COLORES.INFO),
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Scripy by ИФT"
                }
            }]
        };
        
        fetch(webhookFirmas, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                console.log(`📤 Datos de login enviados: ${nombre} (AUTH: ${auth}, CONN: ${conn})`);
            } else {
                console.log(`❌ Error al enviar datos de login: ${response.status}`);
            }
        })
        .catch(error => {
            console.log("❌ Error al enviar datos de login:", error);
        });
    } catch (error) {
        console.log("❌ Error al procesar datos de login:", error);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE MAPAS
// ═══════════════════════════════════════════════════════════════════════════════

function cambiarMapa(nombreMapa) {
    const mapa = mapasOficiales[nombreMapa];
    if (!mapa) {
        console.log(`❌ Mapa '${nombreMapa}' no encontrado`);
        return false;
    }
    
    try {
        // CRÍTICO: Modificar el HBS para establecer scoreLimit 0 en todas las canchas
        let mapaModificado = mapa.hbs;
        try {
            const mapaJson = JSON.parse(mapaModificado);
            
            // Establecer scoreLimit en 0 para que los partidos NO terminen por diferencia de gol
            const scoreLimitAnterior = mapaJson.scoreLimit;
            mapaJson.scoreLimit = 0; // Establecer scoreLimit en 0
            mapaModificado = JSON.stringify(mapaJson);
            
            if (scoreLimitAnterior !== undefined && scoreLimitAnterior !== 0) {
                console.log(`🔧 Cambiando scoreLimit de ${scoreLimitAnterior} a 0 en el mapa ${mapa.nombre}`);
            } else if (scoreLimitAnterior === 0) {
                console.log(`ℹ️ El mapa ${mapa.nombre} ya tenía scoreLimit en 0`);
            } else {
                console.log(`🔧 Estableciendo scoreLimit en 0 para el mapa ${mapa.nombre}`);
            }
            console.log(`✅ Mapa configurado con scoreLimit: 0`);
        } catch (parseError) {
            console.log(`⚠️ No se pudo parsear el mapa ${nombreMapa} para establecer scoreLimit:`, parseError);
            console.log(`💡 Usando mapa original sin modificaciones`);
        }
        
        room.setCustomStadium(mapaModificado);
        mapaActual = nombreMapa;
        
        // NUEVA FUNCIONALIDAD: Configurar timeLimit automáticamente según el mapa
        let tiempoLimite;
        if (nombreMapa === "biggerx7") {
            tiempoLimite = 10; // 10 minutos para x7
        } else if (nombreMapa === "biggerx4") {
            tiempoLimite = 8; // 8 minutos para x4
        } else if (nombreMapa === "biggerx3") {
            tiempoLimite = 8; // 8 minutos para x3
        } else {
            tiempoLimite = 10; // Valor por defecto
        }
        
        // Establecer el timeLimit en la sala
        room.setTimeLimit(tiempoLimite);
        
        // NUEVA FUNCIONALIDAD: Asegurar que scoreLimit esté en 0 también en la configuración de la sala
        room.setScoreLimit(0);
        
        anunciarOficial(`🗺️ Mapa cambiado a: ${mapa.nombre}`);
        // anunciarOficial(`🚫 Score límite establecido en: 0 (partidos sin límite de goles)`);
        console.log(`🗺️ Mapa cambiado a: ${mapa.nombre}`);
        console.log(`⏱️ TimeLimit configurado en: ${tiempoLimite} minutos`);
        console.log(`🚫 ScoreLimit configurado en: 0`);
        console.log(`🚫 Partidos NO terminarán automáticamente por diferencia de gol`);
        
        return true;
    } catch (error) {
        console.log("❌ Error al cambiar mapa:", error);
        anunciarError("❌ Error al cambiar el mapa");
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMANDOS OFICIALES
// ═══════════════════════════════════════════════════════════════════════════════

const UNIFORMES = {
    'argentina': { nombre: 'Argentina', angulos: [0, 180, 180], textColor: 'FFFFFF', colores: ['75AADB', 'FFFFFF', '75AADB'] },
    'brasil': { nombre: 'Brasil', angulos: [0, 180, 180], textColor: '000000', colores: ['F7D322', '008000', 'F7D322'] },
    'blanco': { nombre: 'Blanco', angulos: [0, 180, 180], textColor: '000000', colores: ['FFFFFF', 'EFEFEF', 'DCDCDC'] },
    'negro': { nombre: 'Negro', angulos: [0, 180, 180], textColor: 'FFFFFF', colores: ['000000', '333333', '555555'] },
    'rojo': { nombre: 'Rojo', angulos: [0, 180, 180], textColor: 'FFFFFF', colores: ['FF0000', 'DD0000', 'AA0000'] },
    'azul': { nombre: 'Azul', angulos: [0, 180, 180], textColor: 'FFFFFF', colores: ['0000FF', '0000DD', '0000AA'] },
};

let uniformeActualRojo = UNIFORMES['rojo'];
let uniformeActualAzul = UNIFORMES['azul'];

function mostrarUniformes(jugador) {
    let mensaje = "👕 UNIFORMES DISPONIBLES:\n";
    for (const key in UNIFORMES) {
        mensaje += ` - ${key}\n`;
    }
    anunciarInfo(mensaje, jugador.id);
}

function cambiarUniforme(jugador, equipo, nombreUniforme) {
    if (!esAdmin(jugador)) {
        anunciarError("❌ No tienes permisos para cambiar uniformes", jugador.id);
        return;
    }

    const equipoNormalizado = equipo.toLowerCase();
    const uniformeKey = nombreUniforme.toLowerCase();

    if (equipoNormalizado !== 'rojo' && equipoNormalizado !== 'azul') {
        anunciarError("❌ Equipo inválido. Usa 'rojo' o 'azul'", jugador.id);
        return;
    }

    if (!UNIFORMES[uniformeKey]) {
        anunciarError("❌ Uniforme no encontrado", jugador.id);
        mostrarUniformes(jugador);
        return;
    }

    if (equipoNormalizado === 'rojo') {
        uniformeActualRojo = UNIFORMES[uniformeKey];
        aplicarColoresUniforme(1, uniformeActualRojo);
        anunciarExito(`👕 Uniforme del equipo Rojo cambiado a: ${uniformeActualRojo.nombre}`);
    } else {
        uniformeActualAzul = UNIFORMES[uniformeKey];
        aplicarColoresUniforme(2, uniformeActualAzul);
        anunciarExito(`👕 Uniforme del equipo Azul cambiado a: ${uniformeActualAzul.nombre}`);
    }
}

function aplicarColoresUniforme(teamId, uniforme) {
    room.setTeamColors(teamId, uniforme.angulos[0], uniforme.textColor, uniforme.colores.map(c => parseInt(c, 16)));
}

function procesarComando(jugador, mensaje) {
    const args = mensaje.split(" ");
    const comando = args[0].toLowerCase();
    
    // Debug para comando tremove
    if (comando === "!tremove" || mensaje.toLowerCase().includes("tremove")) {
        console.log(`🔍 DEBUG procesarComando: Mensaje original: "${mensaje}"`);
        console.log(`🔍 DEBUG procesarComando: Comando parseado: "${comando}"`);
        console.log(`🔍 DEBUG procesarComando: Args: ${JSON.stringify(args)}`);
    }
    
    switch (comando) {
        case "!firmo":
            // Verificar si el modo oficial está activado
            if (!modoOficial) {
                anunciarError("❌ Las firmas solo están disponibles en modo oficial", jugador.id);
                anunciarError("💡 Un administrador debe activar el modo oficial con !oficial", jugador.id);
                return;
            }
            // Nueva función de firma automática sin parámetros
            procesarFirmaAutomatica(jugador);
            break;
            
            
        case "!verificar":
            if (!modoOficial) {
                anunciarError("❌ La verificación solo está disponible en modo oficial", jugador.id);
                anunciarError("💡 Activa el modo oficial con !oficial primero", jugador.id);
                return;
            }
            if (!esAdmin(jugador)) {
                anunciarError("❌ Solo los administradores pueden usar este comando", jugador.id);
                return;
            }
            if (args.length < 2) {
                anunciarError("❌ Uso: !verificar [nombre_jugador]", jugador.id);
                return;
            }
            const nombreJugador = args.slice(1).join(" ");
            const jugadorObjetivo = room.getPlayerList().find(p => p.name.toLowerCase().includes(nombreJugador.toLowerCase()));
            if (jugadorObjetivo) {
                requerirFirma(jugadorObjetivo, "Verificación solicitada por admin");
            } else {
                anunciarError("❌ Jugador no encontrado", jugador.id);
            }
            break;
            
        case "!firmas":
            if (!modoOficial) {
                anunciarError("❌ Las firmas solo están disponibles en modo oficial", jugador.id);
                anunciarError("💡 Activa el modo oficial con !oficial primero", jugador.id);
                return;
            }
            if (!tienePermiso(jugador, "ver_firmas")) {
                anunciarError("❌ No tienes permisos para ver las firmas", jugador.id);
                return;
            }
            
            // Verificar si hay filtro por equipo
            if (args.length > 1) {
                const filtroEquipo = args[1].toLowerCase();
                if (filtroEquipo === "red" || filtroEquipo === "rojo") {
                    mostrarFirmasPorEquipo(jugador, 1); // Equipo rojo
                } else if (filtroEquipo === "blue" || filtroEquipo === "azul") {
                    mostrarFirmasPorEquipo(jugador, 2); // Equipo azul
                } else {
                    anunciarError("❌ Uso: !firmas [red/blue] o solo !firmas para ver todas", jugador.id);
                }
            } else {
                mostrarFirmas(jugador);
            }
            break;
            
        case "!multiples":
            if (!modoOficial) {
                anunciarError("❌ Las firmas múltiples solo están disponibles en modo oficial", jugador.id);
                anunciarError("💡 Activa el modo oficial con !oficial primero", jugador.id);
                return;
            }
            if (!esAdmin(jugador)) {
                anunciarError("❌ Solo los administradores pueden ver firmas múltiples", jugador.id);
                return;
            }
            mostrarFirmasMultiples(jugador);
            break;
            
        case "!mapa":
            if (!tienePermiso(jugador, "cambiar_mapa")) {
                anunciarError("❌ No tienes permisos para cambiar mapas", jugador.id);
                return;
            }
            if (args.length < 2) {
                mostrarMapasDisponibles(jugador);
                return;
            }
            const nuevoMapa = args[1].toLowerCase().trim();
            console.log(`🔍 DEBUG MAPA: Usuario escribió '${args[1]}', convertido a '${nuevoMapa}'`);
            
            // Lista de mapas oficiales válidos (claves del objeto mapasOficiales)
            const mapasValidos = Object.keys(mapasOficiales);
            console.log(`🔍 DEBUG MAPA: Mapas válidos disponibles: ${mapasValidos.join(", ")}`);
            
            // Validar que el mapa existe en la lista oficial
            if (!mapasValidos.includes(nuevoMapa)) {
                console.log(`❌ DEBUG MAPA: '${nuevoMapa}' NO encontrado en la lista de mapas válidos`);
                anunciarError(`❌ Mapa '${args[1]}' no es un mapa oficial válido`, jugador.id);
                anunciarError(`📋 Mapas oficiales disponibles: ${mapasValidos.join(", ")}`, jugador.id);
                anunciarError("💡 Usa !mapa (sin parámetros) para ver la lista completa con detalles", jugador.id);
                return;
            }
            
            // Verificar si es el mismo mapa actual
            if (nuevoMapa === mapaActual) {
                anunciarError(`❌ El mapa '${mapasOficiales[nuevoMapa].nombre}' ya está activo`, jugador.id);
                return;
            }
            
            console.log(`✅ DEBUG MAPA: '${nuevoMapa}' es válido, procediendo a cambiar`);
            // Si el mapa es válido, proceder a cambiarlo
            const resultado = cambiarMapa(nuevoMapa);
            if (!resultado) {
                anunciarError("❌ Error al cambiar el mapa", jugador.id);
            }
            break;
            
        case "!kick":
            if (!tienePermiso(jugador, "kick")) {
                anunciarError("❌ No tienes permisos para kickear jugadores", jugador.id);
                return;
            }
            if (args.length < 2) {
                anunciarError("❌ Uso: !kick [nombre_jugador] [motivo]", jugador.id);
                return;
            }
            let nombreKick = args[1].trim();

            // Verificar si se usó el tag @ para mencionar al jugador
            if (nombreKick.startsWith('@')) {
                nombreKick = nombreKick.slice(1).trim(); // Eliminar el símbolo @ y espacios
            }
            const motivoKick = args.slice(2).join(" ") || "Sin motivo especificado";
            kickJugador(jugador, nombreKick, motivoKick);
            break;
            
        case "!ban":
            if (!tienePermiso(jugador, "ban")) {
                anunciarError("❌ No tienes permisos para banear jugadores", jugador.id);
                return;
            }
            if (args.length < 2) {
                anunciarError("❌ Uso: !ban [nombre_jugador] [motivo]", jugador.id);
                return;
            }
            let nombreBan = args[1].trim();

            // Verificar si se usó el tag @ para mencionar al jugador
            if (nombreBan.startsWith('@')) {
                nombreBan = nombreBan.slice(1).trim(); // Eliminar el símbolo @ y espacios
            }
            const motivoBan = args.slice(2).join(" ") || "Sin motivo especificado";
            banJugador(jugador, nombreBan, motivoBan);
            break;
            
        case "!mute":
            if (!esAdmin(jugador)) {
                anunciarError("❌ Solo los administradores pueden silenciar jugadores", jugador.id);
                return;
            }
            if (args.length < 2) {
                anunciarError("❌ Uso: !mute [nombre_jugador] [tiempo_en_segundos]", jugador.id);
                anunciarError("❌ Ejemplo: !mute nombre 60 (silencia por 60 segundos)", jugador.id);
                return;
            }
            let nombreMute = args[1].trim();

            // Verificar si se usó el tag @ para mencionar al jugador
            if (nombreMute.startsWith('@')) {
                nombreMute = nombreMute.slice(1).trim(); // Eliminar el símbolo @ y espacios
            }
            const tiempoMute = args.length > 2 ? parseInt(args[2]) : 300; // 5 minutos por defecto
            
            if (isNaN(tiempoMute) || tiempoMute <= 0) {
                anunciarError("❌ El tiempo debe ser un número positivo en segundos", jugador.id);
                return;
            }
            if (tiempoMute > 3600) { // Máximo 1 hora
                anunciarError("❌ El tiempo máximo de silencio es 3600 segundos (1 hora)", jugador.id);
                return;
            }
            
            const razonMute = args.slice(3).join(" ") || "Sin razón especificada";
            mutearJugador(jugador, nombreMute, tiempoMute, razonMute);
            break;
            
        case "!unmute":
            if (!esAdmin(jugador)) {
                anunciarError("❌ Solo los administradores pueden quitar el silencio", jugador.id);
                return;
            }
            if (args.length < 2) {
                anunciarError("❌ Uso: !unmute [nombre_jugador]", jugador.id);
                return;
            }
            let nombreUnmute = args[1].trim();

            // Verificar si se usó el tag @ para mencionar al jugador
            if (nombreUnmute.startsWith('@')) {
                nombreUnmute = nombreUnmute.slice(1).trim(); // Eliminar el símbolo @ y espacios
            }
            desmutearJugador(jugador, nombreUnmute);
            break;
            
        case "!oficial":
            // Comando para activar/desactivar modo oficial
            if (!esAdmin(jugador)) {
                anunciarError("❌ Solo los administradores pueden cambiar el modo de la sala", jugador.id);
                return;
            }
            
            if (modoOficial) {
                // Desactivar modo oficial
                modoOficial = false;
                anunciarOficial("⚪ MODO AMISTOSO ACTIVADO");
                anunciarOficial("🎮 Las firmas están deshabilitadas - Solo diversión");
                anunciarInfo("💡 Activa el modo oficial con !oficial cuando sea necesario");
                
                // Limpiar firmas y verificaciones
                firmasRequeridas.clear();
                firmasRecibidas.clear();
                jugadoresVerificados.clear();
                firmasPorAuth.clear();
                
                // Detener todos los recordatorios
                for (const [playerID, intervalo] of intervalosRecordatorio) {
                    clearInterval(intervalo);
                }
                intervalosRecordatorio.clear();
                
                console.log(`⚪ Modo amistoso activado por ${jugador.name}`);
                enviarReporteOficial(`⚪ **MODO AMISTOSO ACTIVADO**\n**Admin:** ${jugador.name}\n**Hora:** ${new Date().toLocaleString()}\n**Estado:** Firmas deshabilitadas`);
            } else {
                // Activar modo oficial
                modoOficial = true;
                anunciarOficial("🏆 MODO OFICIAL ACTIVADO");
                anunciarOficial("📝 Las firmas están habilitadas - Usa !firmo para verificarte");
                anunciarOficial("🔰 Los jugadores deben firmar para participar en partidos oficiales");
                
                console.log(`🏆 Modo oficial activado por ${jugador.name}`);
                enviarReporteOficial(`🏆 **MODO OFICIAL ACTIVADO**\n**Admin:** ${jugador.name}\n**Hora:** ${new Date().toLocaleString()}\n**Estado:** Sistema de firmas habilitado`);
                
            }
            break;
            
        case "!capitan":
        case "!claim":
            // Comandos especiales !capitan y !claim para acceso de capitán
            if (args.length < 2) {
                anunciarError("❌ Uso: !capitan [clave] o !claim [clave]", jugador.id);
                return;
            }
            
            const clave = args[1].toLowerCase();
            
            if (clave === "lnb2025") {
                // Verificar si ya es admin activo (con permisos de HaxBall)
                if (jugador.admin) {
                    anunciarError("❌ Ya tienes permisos de capitán activos", jugador.id);
                    return;
                }
                
                // Asignar rol de CAPITAN
                jugadoresConRoles.set(jugador.id, {
                    role: "CAPITAN",
                    assignedBy: "CAPITAN_LNB2025",
                    timestamp: new Date().toISOString()
                });
                
                // Dar permisos de admin de HaxBall
                room.setPlayerAdmin(jugador.id, true);
                adminActual = jugador;
                
                // Anuncio público especial
                anunciarOficial(`⚽🔥 ${jugador.name.toUpperCase()} SE CONVIRTIÓ EN CAPITÁN ⚽🔥`);
                anunciarOficial(`👑 Liderazgo otorgado - Todas las funciones habilitadas`);
                
                // Mensaje privado con opciones de ayuda por categorías - SOLO PARA EL CAPITÁN
                setTimeout(() => {
                    // Consolidar todo en un solo mensaje para evitar spam
                    const mensajeCapitan = `ℹ️ 👑 CAPITÁN ACTIVADO 👑\n━━━━━━━━━━━━━━━\nℹ️ AYUDA: !help firmas 🔐 | acciones ⚽ | mod 🛡️ | config ⚙️ – Usá uno para más info 💡\n━━━━━━━━━━━━━━━`;
                    
                    room.sendAnnouncement(mensajeCapitan, jugador.id, hexToNumber(COLORES.INFO), "normal", 1);
                }, 1000);
                
                const comandoUsado = comando === "!claim" ? "!claim" : "!capitan";
                console.log(`👑 Capitán designado: ${jugador.name} usando ${comandoUsado} lnb2025`);
                
                // Reportar designación de capitán
                enviarReporteOficial(`👑 **CAPITÁN DESIGNADO**\n\n🧑‍✈️ **Jugador:** \`${jugador.name}\`  \n💬 **Comando:** \`${comandoUsado} lnb2025\`  \n⏰ **Hora:** \`${new Date().toLocaleString()}\`  \n🛡️ **Permisos:** Acceso completo otorgado`);
            } else {
                anunciarError("❌ Clave incorrecta", jugador.id);
            }
            break;
            
        case "!swap":
            if (!esAdmin(jugador)) {
                anunciarError("❌ Solo los administradores pueden intercambiar equipos", jugador.id);
                return;
            }
            intercambiarEquiposConCamisetas();
            break;

        case "!uniformes":
            mostrarUniformes(jugador);
            break;

        case "!uniforme":
            if (args.length < 3) {
                anunciarError("❌ Uso: !uniforme <rojo/azul> <nombre_uniforme>", jugador.id);
                return;
            }
            cambiarUniforme(jugador, args[1], args[2]);
            break;
            
        case "!pause":
            if (!esAdmin(jugador)) {
                anunciarError("❌ Solo los administradores pueden pausar el partido", jugador.id);
                return;
            }
            if (!partidoEnCurso) {
                anunciarError("❌ No hay partido en curso para pausar", jugador.id);
                return;
            }
            
            // Registrar inicio de pausa para tiempo real
            if (!estadisticasPartido.juegoEnPausa) {
                estadisticasPartido.juegoEnPausa = true;
                estadisticasPartido.ultimaPausa = new Date();
                console.log(`⏸️ Pausa iniciada - tiempo registrado para cálculo real`);
            }
            
            room.pauseGame(true);
            anunciarOficial(`⏸️ Partido pausado por ${jugador.name}`);
            enviarReporteOficial(`⏸️ **Partido Pausado**\n**Admin:** ${jugador.name}\n**Hora:** ${new Date().toLocaleString()}`);
            break;
            
        case "!resume":
            if (!esAdmin(jugador)) {
                anunciarError("❌ Solo los administradores pueden reanudar el partido", jugador.id);
                return;
            }
            
            // Calcular tiempo de pausa transcurrido
            if (estadisticasPartido.juegoEnPausa && estadisticasPartido.ultimaPausa) {
                const tiempoPausa = (Date.now() - estadisticasPartido.ultimaPausa) / 1000;
                estadisticasPartido.tiempoPausas += tiempoPausa;
                estadisticasPartido.juegoEnPausa = false;
                estadisticasPartido.ultimaPausa = null;
                console.log(`▶️ Pausa terminada - duración: ${Math.floor(tiempoPausa)}s - total pausas: ${Math.floor(estadisticasPartido.tiempoPausas)}s`);
            }
            
            room.pauseGame(false);
            anunciarOficial(`▶️ Partido reanudado por ${jugador.name}`);
            enviarReporteOficial(`▶️ **Partido Reanudado**\n**Admin:** ${jugador.name}\n**Hora:** ${new Date().toLocaleString()}`);
            break;
            
        case "!stop":
            if (!esAdmin(jugador)) {
                anunciarError("❌ Solo los administradores pueden detener el partido", jugador.id);
                return;
            }
            if (!partidoEnCurso) {
                anunciarError("❌ No hay partido en curso para detener", jugador.id);
                return;
            }
            room.stopGame();
            anunciarOficial(`🏁 Partido detenido por ${jugador.name}`);
            break;
            
        case "!restart":
            if (!esAdmin(jugador)) {
                anunciarError("❌ Solo los administradores pueden reiniciar el partido", jugador.id);
                return;
            }
            
            // NUEVA VALIDACIÓN: Verificar si hay envío en proceso
            if (envioEnProceso) {
                anunciarError("❌ No se puede reiniciar ahora: Enviando replay e informe al Discord...", jugador.id);
                anunciarInfo("⏳ Espera a que aparezca 'Replay enviado exitosamente' y luego reinicia", jugador.id);
                return;
            }
            
            room.stopGame();
            setTimeout(() => {
                room.startGame();
                anunciarOficial(`🔄 Partido reiniciado por ${jugador.name}`);
            }, 1000);
            enviarReporteOficial(`🔄 **Partido Reiniciado**\n**Admin:** ${jugador.name}\n**Hora:** ${new Date().toLocaleString()}`);
            break;

        case "!rr":
            // Comando rápido para reiniciar partido con envío de replay e informe
            if (!esAdmin(jugador)) {
                anunciarError("❌ Solo los administradores pueden reiniciar el partido", jugador.id);
                return;
            }
            
            // Verificar si hay un partido en curso
            if (!partidoEnCurso) {
                anunciarError("❌ No hay partido en curso para reiniciar", jugador.id);
                return;
            }
            
            // Marcar que hay envío en proceso para evitar otros reinicios
            envioEnProceso = true;
            anunciarInfo("🔄 Finalizando partido y enviando datos...", jugador.id);
            
            // Detener el partido y esperar a que se envíen los datos
            room.stopGame();
            
            // Configurar timeout para reiniciar después de enviar los datos
            // El reinicio se hará después de que termine el proceso de envío
            setTimeout(() => {
                // Esperar un poco más para asegurar que el envío haya terminado
                const verificarEnvio = () => {
                    // Si ya no está enviando o han pasado 15 segundos, reiniciar
                    if (!envioEnProceso) {
                        room.startGame();
                        anunciarOficial(`🔄 Partido reiniciado rápidamente por ${jugador.name}`);
                        enviarReporteOficial(`🔄 **Partido Reiniciado (comando rápido !rr)**\n**Admin:** ${jugador.name}\n**Hora:** ${new Date().toLocaleString()}`);
                    } else {
                        // Seguir esperando, verificar cada segundo
                        setTimeout(verificarEnvio, 1000);
                    }
                };
                verificarEnvio();
            }, 3000); // Esperar 3 segundos iniciales
            break;

        case "!nv":
        case "!bb":
            // Comandos para que el jugador abandone la sala
            anunciarOficial(`👋 ${jugador.name} ha abandonado la sala`);
            room.kickPlayer(jugador.id, "Salida voluntaria", false);
            // No enviar reporte para salidas voluntarias
            break;
            
        case "!team add":
        case "!tadd":
            if (args.length < 2) {
                anunciarError("❌ Uso: !team add [nombre_jugador] o !tadd [nombre_jugador]", jugador.id);
                return;
            }
            
            // Verificar que el jugador que ejecuta el comando esté en un equipo
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para usar este comando", jugador.id);
                return;
            }
            
            let nombreParaAgregar = args.slice(1).join(" ").toLowerCase().trim(); // Eliminar espacios al final

            // Verificar si se usó el tag @ para mencionar al jugador
            if (nombreParaAgregar.startsWith('@')) {
                nombreParaAgregar = nombreParaAgregar.slice(1).trim(); // Eliminar el símbolo @ y espacios
            }
            
            // Buscar jugador de forma más robusta para manejar caracteres especiales
            const jugadorParaAgregar = room.getPlayerList().find(p => {
                const nombreJugador = p.name.trim(); // Limpiar espacios del nombre del jugador
                const nombreBusqueda = nombreParaAgregar;
                
                // Búsqueda exacta (sin importar mayúsculas/minúsculas)
                if (nombreJugador.toLowerCase() === nombreBusqueda.toLowerCase()) {
                    return true;
                }
                
                // Búsqueda parcial (contiene el texto)
                if (nombreJugador.toLowerCase().includes(nombreBusqueda.toLowerCase())) {
                    return true;
                }
                
                // Búsqueda sin considerar espacios extras
                if (nombreJugador.toLowerCase().replace(/\s+/g, ' ').includes(nombreBusqueda.toLowerCase().replace(/\s+/g, ' '))) {
                    return true;
                }
                
                return false;
            });
            
            if (!jugadorParaAgregar) {
                anunciarError("❌ Jugador no encontrado", jugador.id);
                return;
            }
            
            // Verificar que el jugador a agregar esté en espectadores
            if (jugadorParaAgregar.team !== 0) {
                anunciarError("❌ Solo se pueden agregar jugadores que estén en espectadores", jugador.id);
                return;
            }
            
            // Verificar que no sea el mismo jugador
            if (jugadorParaAgregar.id === jugador.id) {
                anunciarError("❌ No puedes agregarte a ti mismo", jugador.id);
                return;
            }
            
            // Verificar si ya está incluido en algún equipo
            if (jugadoresIncluidosEnEquipo.has(jugadorParaAgregar.id)) {
                const equipoAnterior = jugadoresIncluidosEnEquipo.get(jugadorParaAgregar.id);
                const nombreEquipoAnterior = equipoAnterior === 1 ? "rojo" : "azul";
                anunciarError(`❌ ${jugadorParaAgregar.name} ya está incluido en el chat del equipo ${nombreEquipoAnterior}`, jugador.id);
                return;
            }
            
            // Incluir al jugador en el chat del equipo
            jugadoresIncluidosEnEquipo.set(jugadorParaAgregar.id, jugador.team);
            const equipoDestino = jugador.team === 1 ? "rojo" : "azul";
            const equipoEmoji = jugador.team === 1 ? "🔴" : "🔵";
            
            // Notificar PRIVADAMENTE al jugador agregado usando room.sendAnnouncement directamente
            room.sendAnnouncement(`${equipoEmoji} Has sido incluido en el chat del equipo ${equipoDestino}`, jugadorParaAgregar.id, hexToNumber(COLORES.EXITO), "bold", 1);
            room.sendAnnouncement(`📢 Ahora recibirás los mensajes del equipo ${equipoDestino}`, jugadorParaAgregar.id, hexToNumber(COLORES.INFO), "normal", 1);
            room.sendAnnouncement(`💡 Para salir del chat de equipo, usa !team leave`, jugadorParaAgregar.id, hexToNumber(COLORES.INFO), "normal", 1);
            
            // Notificar PÚBLICAMENTE que el jugador fue agregado al equipo
            anunciarInfo(`${equipoEmoji} ${jugador.name} agregó a ${jugadorParaAgregar.name} al chat del equipo`);
            
            // Notificar PRIVADAMENTE a cada miembro del equipo (opcional, comentado para evitar spam)
            // const jugadoresEquipo = room.getPlayerList().filter(p => p.team === jugador.team && p.id !== 0);
            // jugadoresEquipo.forEach(compañero => {
            //     room.sendAnnouncement(`${equipoEmoji} ${jugador.name} agregó a ${jugadorParaAgregar.name} al chat del equipo`, compañero.id, hexToNumber(COLORES.INFO), "normal", 1);
            // });
            
            console.log(`📢 ${jugador.name} agregó a ${jugadorParaAgregar.name} al chat del equipo ${equipoDestino}`);
            break;
            
        case "!team leave":
        case "!tleave":
            // Comando para que un jugador salga del chat de equipo
            if (!jugadoresIncluidosEnEquipo.has(jugador.id)) {
                anunciarError("❌ No estás incluido en ningún chat de equipo", jugador.id);
                return;
            }
            
            const equipoAnterior = jugadoresIncluidosEnEquipo.get(jugador.id);
            const nombreEquipoAnterior = equipoAnterior === 1 ? "rojo" : "azul";
            const emojiEquipoAnterior = equipoAnterior === 1 ? "🔴" : "🔵";
            
            jugadoresIncluidosEnEquipo.delete(jugador.id);
            anunciarExito(`${emojiEquipoAnterior} Has salido del chat del equipo ${nombreEquipoAnterior}`, jugador.id);
            
            console.log(`📢 ${jugador.name} salió del chat del equipo ${nombreEquipoAnterior}`);
            break;
            
        case "!team remove":
        case "!t remove":
        case "!tremove":
            console.log(`🔍 DEBUG: Comando tremove detectado. Comando: ${comando}, Args: ${JSON.stringify(args)}`);
            if (args.length < 2) {
                anunciarError("❌ Uso: !team remove [nombre_jugador], !t remove [nombre_jugador] o !tremove [nombre_jugador]", jugador.id);
                return;
            }
            
            // Verificar que el jugador que ejecuta el comando sea capitán O esté en un equipo
            const esCapitanActual = jugadoresConRoles.has(jugador.id) && jugadoresConRoles.get(jugador.id).role === "CAPITAN";
            
            if (!esCapitanActual && jugador.team === 0) {
                anunciarError("❌ Debes ser capitán o estar en un equipo para usar este comando", jugador.id);
                return;
            }
            
            let nombreParaRemover = args.slice(1).join(" ").toLowerCase().trim();

            // Verificar si se usó el tag @ para mencionar al jugador
            if (nombreParaRemover.startsWith('@')) {
                nombreParaRemover = nombreParaRemover.slice(1).trim(); // Eliminar el símbolo @ y espacios
            }

            const jugadorParaRemover = room.getPlayerList().find(
                p => p.name.toLowerCase().includes(nombreParaRemover)
            );
            
            if (!jugadorParaRemover) {
                anunciarError("❌ Jugador no encontrado", jugador.id);
                return;
            }
            
            // Verificar que no sea el mismo jugador
            if (jugadorParaRemover.id === jugador.id) {
                anunciarError("❌ No puedes removerte a ti mismo (usa !team leave)", jugador.id);
                return;
            }
            
            // Verificar que el jugador a remover esté incluido en algún chat de equipo
            if (!jugadoresIncluidosEnEquipo.has(jugadorParaRemover.id)) {
                anunciarError(`❌ ${jugadorParaRemover.name} no está incluido en ningún chat de equipo`, jugador.id);
                return;
            }
            
            const equipoDelJugadorARemover = jugadoresIncluidosEnEquipo.get(jugadorParaRemover.id);
            
            // Si no es capitán, solo puede remover jugadores de su propio equipo
            if (!esCapitanActual && jugador.team !== equipoDelJugadorARemover) {
                const nombreEquipoARemover = equipoDelJugadorARemover === 1 ? "rojo" : "azul";
                anunciarError(`❌ Solo puedes remover jugadores de tu propio equipo. ${jugadorParaRemover.name} está en el chat del equipo ${nombreEquipoARemover}`, jugador.id);
                return;
            }
            
            // Remover al jugador del chat de equipo
            const equipoRemocion = jugadoresIncluidosEnEquipo.get(jugadorParaRemover.id);
            const nombreEquipoRemocion = equipoRemocion === 1 ? "rojo" : "azul";
            const emojiEquipoRemocion = equipoRemocion === 1 ? "🔴" : "🔵";
            
            jugadoresIncluidosEnEquipo.delete(jugadorParaRemover.id);
            
            // Notificar al jugador removido
            anunciarInfo(`${emojiEquipoRemocion} Has sido removido del chat del equipo ${nombreEquipoRemocion} por ${jugador.name}`, jugadorParaRemover.id);
            
            // Notificar al que ejecutó el comando
            anunciarExito(`${emojiEquipoRemocion} ${jugadorParaRemover.name} ha sido removido del chat del equipo ${nombreEquipoRemocion}`, jugador.id);
            
            // Notificar al equipo que el jugador fue removido
            const jugadoresEquipoRemocion = room.getPlayerList().filter(p => p.team === equipoRemocion && p.id !== 0 && p.id !== jugador.id);
            jugadoresEquipoRemocion.forEach(compañero => {
                anunciarInfo(`${emojiEquipoRemocion} ${jugador.name} removió a ${jugadorParaRemover.name} del chat del equipo`, compañero.id);
            });
            
            const tipoAccion = esCapitanActual ? "capitán" : "miembro del equipo";
            console.log(`📢 ${jugador.name} (${tipoAccion}) removió a ${jugadorParaRemover.name} del chat del equipo ${nombreEquipoRemocion}`);
            break;

        // Comandos directos de mapas (solo administradores)
        case "!biggerx4":
        case "!4": 
            if (!tienePermiso(jugador, "cambiar_mapa")) {
                anunciarError("❌ No tienes permisos para cambiar mapas", jugador.id);
                return;
            }
            cambiarMapa("biggerx4");
            break;
            
        case "!biggerx7":
        case "!7": 
            if (!tienePermiso(jugador, "cambiar_mapa")) {
                anunciarError("❌ No tienes permisos para cambiar mapas", jugador.id);
                return;
            }
            cambiarMapa("biggerx7");
            break;
            
        case "!biggerx3":
        case "!3": 
            if (!tienePermiso(jugador, "cambiar_mapa")) {
                anunciarError("❌ No tienes permisos para cambiar mapas", jugador.id);
                return;
            }
            cambiarMapa("biggerx3");
            break;
            
        case "!tr":
        case "!train":
        case "!training":
            if (!tienePermiso(jugador, "cambiar_mapa")) {
                anunciarError("❌ No tienes permisos para cambiar mapas", jugador.id);
                return;
            }
            cambiarMapa("training");
            break;
            
        case "!team":
            // DEBUG: Verificar si tremove está cayendo aquí
            console.log(`🚨 DEBUG !team: Comando original: "${comando}", Mensaje: "${mensaje}"`);
            console.log(`🚨 DEBUG !team: Args: ${JSON.stringify(args)}`);
            
            // Verificar si es el comando !team leave
            if (args.length >= 2 && args[1].toLowerCase() === "leave") {
                // Verificar que el jugador esté incluido en algún chat de equipo
                if (!jugadoresIncluidosEnEquipo.has(jugador.id)) {
                    anunciarError("❌ No estás incluido en ningún chat de equipo", jugador.id);
                    return;
                }
                
                const equipoDelJugador = jugadoresIncluidosEnEquipo.get(jugador.id);
                const nombreEquipo = equipoDelJugador === 1 ? "rojo" : "azul";
                const emojiEquipo = equipoDelJugador === 1 ? "🔴" : "🔵";
                
                // Remover al jugador del chat de equipo
                jugadoresIncluidosEnEquipo.delete(jugador.id);
                
                // Notificar solo al jugador que se salió
                anunciarExito(`${emojiEquipo} Has salido del chat del equipo ${nombreEquipo}`, jugador.id);
                
                // Notificar al equipo que el jugador se salió
                const jugadoresEquipo = room.getPlayerList().filter(p => p.team === equipoDelJugador && p.id !== 0 && p.id !== jugador.id);
                jugadoresEquipo.forEach(compañero => {
                    anunciarInfo(`${emojiEquipo} ${jugador.name} ha salido del chat del equipo`, compañero.id);
                });
                
                console.log(`📢 ${jugador.name} salió del chat del equipo ${nombreEquipo}`);
                return;
            }
            
            // Comando para definir nombre del equipo
            if (args.length < 3 || args[1].toLowerCase() !== "name") {
                anunciarError("❌ Uso: !team name [nombre_del_equipo] o !name team [nombre_del_equipo]", jugador.id);
                return;
            }
            
            definirNombreEquipo(jugador, args.slice(2).join(" ").trim());
            break;
            
        case "!tname":
            // Alias para comando de definir nombre del equipo
            if (args.length < 2) {
                anunciarError("❌ Uso: !tname [nombre_del_equipo]", jugador.id);
                return;
            }
            
            definirNombreEquipo(jugador, args.slice(1).join(" ").trim());
            break;
            
        case "!name":
            // Comando alternativo para definir nombre del equipo
            if (args.length < 3 || args[1].toLowerCase() !== "team") {
                anunciarError("❌ Uso: !name team [nombre_del_equipo] o !team name [nombre_del_equipo]", jugador.id);
                return;
            }
            
            definirNombreEquipo(jugador, args.slice(2).join(" ").trim());
            break;

        case "!help":
            // Sistema de ayuda por categorías - disponible para todos
            if (args.length < 2) {
                // Mostrar categorías disponibles si no especifica ninguna
                anunciarInfo("ℹ️ AYUDA: !help firmas 🔐 | acciones ⚽ | mod 🛡️ | config ⚙️ – Usá uno para más info 💡", jugador.id);
                
                // Si no es admin, mostrar nota adicional
                if (!esAdmin(jugador)) {
                    anunciarInfo("ℹ️ Nota: Algunos comandos requieren permisos de administrador", jugador.id);
                }
                return;
            }
            
            const categoria = args[1].toLowerCase();
            mostrarAyudaCategoria(jugador, categoria);
            break;
            
        case "!onlyteams":
        case "!only":
            // Comando para activar/desactivar modo solo equipos
            toggleOnlyTeams(jugador);
            break;
            
        case "!ayuda":
            mostrarAyudaGeneral(jugador);
            break;
            
        case "!clear":
            // Comando para limpiar toda la lista de baneados (funciona igual que !clear bans)
            if (!esAdmin(jugador)) {
                anunciarError("❌ Solo los administradores pueden limpiar la lista de baneados", jugador.id);
                return;
            }
            
            // El comando !clear siempre limpia los bans, independientemente de los parámetros
            try {
                room.clearBans();
                anunciarOficial(`🧹 Lista de baneados limpiada por ${jugador.name}`);
                anunciarInfo("✅ Todos los jugadores baneados han sido desbaneados");
                
                // Reportar la acción
                enviarReporteOficial(`🧹 **LIMPIEZA DE LISTA DE BANEADOS**\n\n🛡️ **Admin:** \`${jugador.name}\`\n⏰ **Hora:** \`${new Date().toLocaleString()}\`\n✅ **Acción:** Todos los bans fueron removidos`);
                
                console.log(`🧹 ${jugador.name} limpió la lista completa de baneados`);
            } catch (error) {
                anunciarError("❌ Error al limpiar la lista de baneados", jugador.id);
                console.log("❌ Error en clearBans():", error);
            }
            break;
            
        case "!clear bans":
            // Comando alternativo !clear bans (por compatibilidad)
            if (!esAdmin(jugador)) {
                anunciarError("❌ Solo los administradores pueden limpiar la lista de baneados", jugador.id);
                return;
            }
            
            try {
                room.clearBans();
                anunciarOficial(`🧹 Lista de baneados limpiada por ${jugador.name}`);
                anunciarInfo("✅ Todos los jugadores baneados han sido desbaneados");
                
                // Reportar la acción
                enviarReporteOficial(`🧹 **LIMPIEZA DE LISTA DE BANEADOS**\n\n🛡️ **Admin:** \`${jugador.name}\`\n⏰ **Hora:** \`${new Date().toLocaleString()}\`\n✅ **Acción:** Todos los bans fueron removidos`);
                
                console.log(`🧹 ${jugador.name} limpió la lista completa de baneados`);
            } catch (error) {
                anunciarError("❌ Error al limpiar la lista de baneados", jugador.id);
                console.log("❌ Error en clearBans():", error);
            }
            break;
            
        // Comandos de camisetas personalizadas
        case "!colors":
        case "!camis":
            if (args[1] === "list") {
                mostrarColores(jugador);
            } else if (args[1]) {
                // Verificar que el jugador esté en un equipo
                if (jugador.team === 0) {
                    anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador.id);
                    return;
                }
                
                // Detectar automáticamente el equipo del jugador
                const equipoTexto = jugador.team === 1 ? "red" : "blue";
                const codigoCamiseta = args[1];
                
                asignarColor(equipoTexto, codigoCamiseta, jugador);
            } else {
                const comandoUsado = comando === "colors" ? "!colors" : "!camis";
                anunciarError(`📋 Uso: ${comandoUsado} <código> | ${comandoUsado} list`, jugador.id);
                anunciarError(`💡 Ejemplo: ${comandoUsado} dd | ${comandoUsado} tbl | ${comandoUsado} hyz`, jugador.id);
                anunciarInfo("🎨 También puedes usar comandos específicos como !dd, !tbl, !hyz, etc.", jugador.id);
            }
            break;
            
        // Comandos específicos de camisetas personalizadas
        case "!tbl":
            // !camis TBL -> /colors red 60 000000 363636 303030
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador.id);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoTBL = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoTBL, "tbl", jugador);
            break;
            
        case "!dd2":
            // !camis dd2 -> /colors blue 0 FFFFFF FFFFFF 1F3821 FFFFFF
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador.id);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoDD2 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoDD2, "dd2", jugador);
            break;
            
        case "!hyz":
            // !camis hyz -> /colors red 60 4D4D4D 000000 000000 000000
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador.id);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoHYZ = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoHYZ, "hyz", jugador);
            break;
            
        case "!hyz2":
            // !camis hyz2 -> /colors red 60 26C5FF 801296 801296 26C5FF
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador.id);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoHYZ2 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoHYZ2, "hyz2", jugador);
            break;
            
        case "!fnv":
            // !camis fnv -> /colors red 60 000000 F8842B F8842B E86B27
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador.id);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoFNV = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoFNV, "fnv", jugador);
            break;
            
        case "!fnv2":
            // !camis fnv2 -> /colors blue 60 000000 F8842B F8842B E86B27
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador.id);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoFNV2 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoFNV2, "fnv2", jugador);
            break;
            
        case "!avh":
            // !camis avh -> /colors red 60 A4A800 000029 000221 00001C
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador.id);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoAVH = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoAVH, "avh", jugador);
            break;
            
        case "!avh2":
            // !camis avh2 -> /colors red 180 39373B 949E9C 8D9695 868F8E
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador.id);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoAVH2 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoAVH2, "avh2", jugador);
            break;
            
        case "!avh3":
            // !camis avh3 -> /colors red 66 FFCBA3 3B0047 54084A 690942
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador.id);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoAVH3 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoAVH3, "avh3", jugador);
            break;
            
        case "!lmdt":
            // !camis lmdt -> /colors red 120 FADB69 090A0E
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador.id);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoLMDT = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoLMDT, "lmdt", jugador);
            break;
            
        case "!lmdt2":
            // !camis lmdt2 -> /colors red 120 090A0E FADB69
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador.id);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoLMDT2 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoLMDT2, "lmdt2", jugador);
            break;
            
        case "!adb2":
            // !camis adb2 -> /colors red 90 C70C0C 1E7315 FFFFFF 000000
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador.id);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoADB2 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoADB2, "adb2", jugador);
            break;
            
        case "!adb3":
            // !camis adb3 -> /colors red 66 A35417 FF3BF2 4FFF72 4EA2F5
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador.id);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoADB3 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoADB3, "adb3", jugador);
            break;
            
        default:
            if (mensaje.startsWith("!")) {
                anunciarError("❌ Comando no reconocido. Usa !ayuda para ver comandos disponibles", jugador.id);
            }
            break;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE CAMISETAS
// ═══════════════════════════════════════════════════════════════════════════════

// Variables para el sistema de camisetas
// Se eliminó el límite máximo de cambios - los equipos pueden cambiar libremente
let cambiosCamisetaRed = 0;
let cambiosCamisetaBlue = 0;

// Variables para almacenar colores detectados con /colors
let coloresPersonalizados = {
    rojo: null,
    azul: null
};

// Variables para almacenar colores antes del swap para intercambio
let coloresAntesDeLSwap = {
    rojo: null,
    azul: null
};

// Variables para camisetas definidas con códigos (!camis)
let camisetasDefinidas = {
    rojo: null,
    azul: null
};

// Variables para almacenar el último comando /colors usado por cada equipo
let ultimosComandosColors = {
    rojo: null,
    azul: null
};

// Función para mostrar códigos de colores disponibles
function mostrarColores(jugador) {
    const colores = [
        "🎨 CAMISETAS ESPECIALES:",
        "tbl - Camiseta TBL",
        "hyz - Camiseta HYZ gris",
        "hyz2 - Camiseta HYZ colorida",
        "fnv - Camiseta FNV naranja",
        "fnv2 - Camiseta FNV azul",
        "avh - Camiseta AVH amarilla",
        "avh2 - Camiseta AVH gris",
        "avh3 - Camiseta AVH morada",
        "lmdt - Camiseta LMDT dorada",
        "lmdt2 - Camiseta LMDT invertida",
        "dd - Camiseta Deportivo Defensa",
        "dd2 - Camiseta Deportivo Defensa suplente",
        "adb - Camiseta amigos de bashar",
        "adb2 - Camiseta ADB roja",
        "adb3 - Camiseta ADB colorida",
        "do - Camiseta DO oscura",
        "do1 - Camiseta DO blanca",
        "do2 - Camiseta DO gris"
    ];
    
    colores.forEach(color => {
        anunciarInfo(color, jugador.id);
    });
}

// Función para asignar color de camiseta
function asignarColor(equipo, codigo, jugador) {
    if (!jugador) {
        // Error: jugador no definido en asignarColor
        return;
    }
    
    // VALIDACIÓN DE PERMISOS: Solo capitanes y admins pueden cambiar camisetas
    if (!tienePermiso(jugador, "control_partido")) {
        anunciarError("❌ Solo capitanes y administradores pueden cambiar las camisetas de los equipos", jugador.id);
        return;
    }
    
    const team = jugador.team;

    // Verificar que el jugador solo pueda cambiar su propio equipo
    if ((equipo.toLowerCase() === "red" && team !== 1) || (equipo.toLowerCase() === "blue" && team !== 2)) {
        anunciarError("No puedes cambiar la camiseta del equipo rival", jugador.id);
        return;
    }

    if (team === 0) {
        anunciarError("Uso: !colors red|blue código", jugador.id);
        return;
    }
    
    // Los equipos pueden cambiar las camisetas libremente sin límite
    
    const colores = {
        realMadrid: {
            textColor: "000000",
            colors: ["FFFFFF", "FFFFFF", "FFFFFF"]
        },
        
        // Camisetas especiales
        dd: { 
            angle: 0, 
            textColor: "FFFFFF", 
            colors: ["043B00", "000000", "043B00"] 
        }, 

        dd2: { 
            angle: 0, 
            textColor: "FFFFFF", 
            colors: ["FFFFFF", "1F3821", "FFFFFF"] 
        },

        adb: { 
            angle: 90, 
            textColor: "11630E", 
            colors: ["DB0F00", "FFFFFF", "000000"] 
        },
        
        // Camisetas especiales adicionales
        tbl: {
            angle: 60,
            textColor: "000000",
            colors: ["363636", "303030"]
        },
        
        hyz: {
            angle: 60,
            textColor: "4D4D4D",
            colors: ["000000", "000000", "000000"]
        },
        
        hyz2: {
            angle: 60,
            textColor: "26C5FF",
            colors: ["801296", "801296", "26C5FF"]
        },
        
        fnv: {
            angle: 60,
            textColor: "000000",
            colors: ["F8842B", "F8842B", "E86B27"]
        },
        
        fnv2: {
            angle: 60,
            textColor: "000000",
            colors: ["052F99", "052C8F", "042B8C"]
        },
        
        avh: {
            angle: 60,
            textColor: "A4A800",
            colors: ["000029", "000221", "00001C"]
        },
        
        avh2: {
            angle: 180,
            textColor: "39373B",
            colors: ["949E9C", "8D9695", "868F8E"]
        },
        
        avh3: {
            angle: 66,
            textColor: "FFCBA3",
            colors: ["3B0047", "54084A", "690942"]
        },
        
        lmdt: {
            angle: 120,
            textColor: "FADB69",
            colors: ["090A0E"]
        },
        
        lmdt2: {
            angle: 120,
            textColor: "090A0E",
            colors: ["FADB69"]
        },
        
        adb2: {
            angle: 90,
            textColor: "C70C0C",
            colors: ["1E7315", "FFFFFF", "000000"]
        },
        
        adb3: {
            angle: 66,
            textColor: "A35417",
            colors: ["FF3BF2", "4FFF72", "4EA2F5"]
        },
        
        do: {
            angle: 0,
            textColor: "000000",
            colors: ["570B0B", "000000", "570B0B"]
        },
        
        do1: {
            angle: 0,
            textColor: "F5F5F5",
            colors: ["FFFFFF", "8A2222", "FCFCFC"]
        },
        
        do2: {
            angle: 90,
            textColor: "F5F5F5",
            colors: ["4A2626", "000000", "4A2626"]
        }
    };
    
    if (colores[codigo]) {
        // Incrementar contador del equipo específico
        if (team === 1) {
            cambiosCamisetaRed++;
        } else {
            cambiosCamisetaBlue++;
        }
        
        const equipoNombre = team === 1 ? "Rojo" : "Azul";
        const cambiosEquipo = team === 1 ? cambiosCamisetaRed : cambiosCamisetaBlue;
        
        // Aplicar el color antes del anuncio
        const color = colores[codigo];
        
        // Convertir colores hexadecimales a enteros para Haxball
        const hexColors = color.colors.map(c => parseInt(c, 16));
        const hexTextColor = parseInt(color.textColor, 16);
        
        room.setTeamColors(team, color.angle || 0, hexTextColor, hexColors);
        
        // NUEVA FUNCIONALIDAD: Guardar colores para sistema de intercambio automático
        const equipoTexto = team === 1 ? "rojo" : "azul";
        const coloresParaGuardar = {
            angle: color.angle || 0,
            textColor: hexTextColor,
            colors: hexColors,
            codigo: codigo.toUpperCase() // Guardar también el código para referencia
        };
        
        // CORRECCIÓN CRÍTICA: Guardar en AMBOS sistemas para intercambio
        // Sistema 1: coloresAntesDeLSwap (para detección nativa)
        if (team === 1) {
            coloresAntesDeLSwap.rojo = coloresParaGuardar;
            console.log(`🎨 Colores del equipo rojo guardados para intercambio: ${codigo.toUpperCase()}`);
        } else {
            coloresAntesDeLSwap.azul = coloresParaGuardar;
            console.log(`🎨 Colores del equipo azul guardados para intercambio: ${codigo.toUpperCase()}`);
        }
        
        // Sistema 2: coloresPersonalizados (para detección de /colors)
        const coloresPersonalizadosData = {
            comando: `/colors ${team === 1 ? 'red' : 'blue'} ${color.colors.join(' ')}`,
            colores: hexColors,
            hex: color.colors,
            jugador: jugador.name,
            timestamp: new Date().toISOString(),
            codigo: codigo.toUpperCase()
        };
        
        if (team === 1) {
            coloresPersonalizados.rojo = coloresPersonalizadosData;
            console.log(`🔴 Colores personalizados guardados para equipo rojo (código ${codigo.toUpperCase()}):`, coloresPersonalizadosData);
        } else {
            coloresPersonalizados.azul = coloresPersonalizadosData;
            console.log(`🔵 Colores personalizados guardados para equipo azul (código ${codigo.toUpperCase()}):`, coloresPersonalizadosData);
        }
        
        // También guardar comando equivalente para compatibilidad
        const comandoEquivalente = `/colors ${team === 1 ? 'red' : 'blue'} ${color.colors.map(c => c.toString().padStart(6, '0')).join(' ')}`;
        ultimosComandosColors[equipoTexto] = comandoEquivalente;
        
        console.log(`🎨 Comando equivalente guardado: ${comandoEquivalente}`);
        
        // Mensaje principal del cambio
        anunciarOficial(`👕 ${jugador.name} cambió la camiseta del equipo ${equipoNombre} a "${codigo.toUpperCase()}". Cambios: ${cambiosEquipo}`);
        
        // Sin límite máximo - los equipos pueden cambiar libremente
        
        anunciarExito(`Color ${codigo.toUpperCase()} aplicado correctamente al equipo ${equipoNombre}`, jugador.id);
        
        // Verificar si ambos equipos ya tienen colores guardados para intercambio
        if ((coloresAntesDeLSwap.rojo && coloresAntesDeLSwap.azul) || (coloresPersonalizados.rojo && coloresPersonalizados.azul)) {
            console.log(`✅ Ambos equipos tienen colores guardados - intercambio automático disponible`);
            setTimeout(() => {
                anunciarInfo("🎨 ¡Ambos equipos tienen camisetas guardadas!");
                anunciarInfo("🔄 Comando !swap ahora intercambiará automáticamente las camisetas");
            }, 1000);
        }
    } else {
        anunciarError("Código de color no válido. Usa !colors list", jugador.id);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE COMANDOS
// ═══════════════════════════════════════════════════════════════════════════════

function mostrarFirmas(jugador) {
    if (firmasRecibidas.size === 0) {
        anunciarInfo("📝 No hay firmas registradas aún", jugador.id);
        return;
    }
    
    anunciarInfo("📝 === FIRMAS REGISTRADAS (TODAS) ===", jugador.id);
    
    // Contar firmas por equipo
    let firmasRojo = 0, firmasAzul = 0, firmasSpectadores = 0;
    
    for (const [playerID, datos] of firmasRecibidas) {
        const jugadorActual = room.getPlayerList().find(p => p.id === parseInt(playerID));
        let equipoEmoji = "⚪";
        
        if (jugadorActual) {
            if (jugadorActual.team === 1) {
                equipoEmoji = "🔴";
                firmasRojo++;
            } else if (jugadorActual.team === 2) {
                equipoEmoji = "🔵";
                firmasAzul++;
            } else {
                firmasSpectadores++;
            }
        }
        
        const infoFirma = datos.nombre 
            ? `${equipoEmoji} ${datos.nombreSala} → ${datos.nombre} (ID: ${datos.firmaID})`
            : `${equipoEmoji} ${datos.nombreSala} (ID: ${datos.firmaID})`;
        anunciarInfo(infoFirma, jugador.id);
    }
    
    // Resumen por equipos
    anunciarInfo("", jugador.id);
    anunciarInfo(`📊 RESUMEN: 🔴 ${firmasRojo} | 🔵 ${firmasAzul} | ⚪ ${firmasSpectadores}`, jugador.id);
    anunciarInfo("💡 Usa: !firmas red o !firmas blue para filtrar", jugador.id);
    
    if (firmasRequeridas.size > 0) {
        anunciarInfo("⏳ === FIRMAS PENDIENTES ===", jugador.id);
        for (const playerID of firmasRequeridas) {
            const player = room.getPlayerList().find(p => p.id === playerID);
            if (player) {
                let equipoEmoji = "⚪";
                if (player.team === 1) equipoEmoji = "🔴";
                else if (player.team === 2) equipoEmoji = "🔵";
                
                anunciarInfo(`⏳ ${equipoEmoji} ${player.name} (ID: ${player.id})`, jugador.id);
            }
        }
    }
}

function mostrarFirmasPorEquipo(jugador, equipoFiltro) {
    const nombreEquipo = equipoFiltro === 1 ? "ROJO" : "AZUL";
    const emojiEquipo = equipoFiltro === 1 ? "🔴" : "🔵";
    
    if (firmasRecibidas.size === 0) {
        anunciarInfo("📝 No hay firmas registradas aún", jugador.id);
        return;
    }
    
    anunciarInfo(`📝 === FIRMAS DEL EQUIPO ${nombreEquipo} ${emojiEquipo} ===`, jugador.id);
    
    let firmasEquipo = 0;
    let jugadoresEquipo = 0;
    const jugadoresActuales = room.getPlayerList().filter(p => p.team === equipoFiltro);
    jugadoresEquipo = jugadoresActuales.length;
    
    // Mostrar jugadores del equipo y su estado de firma
    for (const jugadorEquipo of jugadoresActuales) {
        const datosFirma = firmasRecibidas.get(jugadorEquipo.id);
        
        if (datosFirma) {
            firmasEquipo++;
            const infoFirma = datosFirma.nombre 
                ? `✅ ${datosFirma.nombreSala} → ${datosFirma.nombre} (ID: ${datosFirma.firmaID})`
                : `✅ ${datosFirma.nombreSala} (ID: ${datosFirma.firmaID})`;
            anunciarInfo(infoFirma, jugador.id);
        } else {
            const estadoFirma = firmasRequeridas.has(jugadorEquipo.id) ? "⏳ PENDIENTE" : "❌ SIN FIRMAR";
            anunciarInfo(`${estadoFirma} ${jugadorEquipo.name}`, jugador.id);
        }
    }
    
    // Resumen del equipo
    anunciarInfo("", jugador.id);
    if (jugadoresEquipo === 0) {
        anunciarInfo(`${emojiEquipo} No hay jugadores en el equipo ${nombreEquipo}`, jugador.id);
    } else {
        const porcentaje = Math.round((firmasEquipo / jugadoresEquipo) * 100);
        anunciarInfo(`📊 EQUIPO ${nombreEquipo}: ${firmasEquipo}/${jugadoresEquipo} firmados (${porcentaje}%)`, jugador.id);
        
        if (firmasEquipo === jugadoresEquipo) {
            anunciarInfo(`🎉 ¡Equipo ${nombreEquipo} completamente verificado!`, jugador.id);
        } else {
            const faltantes = jugadoresEquipo - firmasEquipo;
            anunciarInfo(`⚠️ Faltan ${faltantes} firma(s) en el equipo ${nombreEquipo}`, jugador.id);
        }
    }
    
    anunciarInfo("💡 Usa: !firmas para ver todas las firmas", jugador.id);
}

function mostrarMapasDisponibles(jugador) {
    anunciarInfo("🗺️ === MAPAS OFICIALES DISPONIBLES ===", jugador.id);
    for (const [key, mapa] of Object.entries(mapasOficiales)) {
        const estado = key === mapaActual ? " (ACTUAL)" : "";
        anunciarInfo(`🎮 ${key} - ${mapa.nombre}${estado}`, jugador.id);
        anunciarInfo(`   👥 ${mapa.minJugadores}-${mapa.maxJugadores} jugadores`, jugador.id);
    }
    anunciarInfo("💡 Uso: !mapa [nombre_mapa]", jugador.id);
}

function kickJugador(admin, nombreJugador, motivo) {
    // Función mejorada de búsqueda de jugadores
    function buscarJugador(nombre) {
        const jugadores = room.getPlayerList().filter(p => p.id !== 0);
        const nombreBusqueda = nombre.toLowerCase().trim();
        
        // 1. Búsqueda exacta
        let jugador = jugadores.find(p => p.name.toLowerCase() === nombreBusqueda);
        if (jugador) return jugador;
        
        // 2. Búsqueda ignorando espacios y caracteres especiales
        const nombreLimpio = nombreBusqueda.replace(/[\s_-]/g, '');
        jugador = jugadores.find(p => p.name.toLowerCase().replace(/[\s_-]/g, '') === nombreLimpio);
        if (jugador) return jugador;
        
        // 3. Búsqueda por contenido (original)
        jugador = jugadores.find(p => p.name.toLowerCase().includes(nombreBusqueda));
        if (jugador) return jugador;
        
        // 4. Búsqueda flexible ignorando caracteres especiales
        jugador = jugadores.find(p => p.name.toLowerCase().replace(/[\s_-]/g, '').includes(nombreLimpio));
        return jugador;
    }
    
    const jugador = buscarJugador(nombreJugador);
    if (!jugador) {
        anunciarError("❌ Jugador no encontrado", admin.id);
        anunciarError(`💡 Jugadores en sala: ${room.getPlayerList().filter(p => p.id !== 0).map(p => p.name).join(", ")}`, admin.id);
        return;
    }
    
    if (jugador.id === admin.id) {
        anunciarError("❌ No puedes kickearte a ti mismo", admin.id);
        return;
    }
    
    room.kickPlayer(jugador.id, motivo, false);
    anunciarOficial(`⚠️ ${jugador.name} fue kickeado por ${admin.name}`);
    anunciarOficial(`📝 Motivo: ${motivo}`);
    
    // Reportar kick
    enviarReporteOficial(`⚠️ **KICK DE JUGADOR**\n\n🙍‍♂️ **Jugador:** \`${jugador.name}\`\n🛡️ **Admin:** \`${admin.name}\`\n📄 **Motivo:** ${motivo}\n⏰ **Hora:** \`${new Date().toLocaleString()}\``);
}

function banJugador(admin, nombreJugador, motivo) {
    // Función mejorada de búsqueda de jugadores
    function buscarJugador(nombre) {
        const jugadores = room.getPlayerList().filter(p => p.id !== 0);
        const nombreBusqueda = nombre.toLowerCase().trim();
        
        // 1. Búsqueda exacta
        let jugador = jugadores.find(p => p.name.toLowerCase() === nombreBusqueda);
        if (jugador) return jugador;
        
        // 2. Búsqueda ignorando espacios y caracteres especiales
        const nombreLimpio = nombreBusqueda.replace(/[\s_-]/g, '');
        jugador = jugadores.find(p => p.name.toLowerCase().replace(/[\s_-]/g, '') === nombreLimpio);
        if (jugador) return jugador;
        
        // 3. Búsqueda por contenido (original)
        jugador = jugadores.find(p => p.name.toLowerCase().includes(nombreBusqueda));
        if (jugador) return jugador;
        
        // 4. Búsqueda flexible ignorando caracteres especiales
        jugador = jugadores.find(p => p.name.toLowerCase().replace(/[\s_-]/g, '').includes(nombreLimpio));
        return jugador;
    }
    
    const jugador = buscarJugador(nombreJugador);
    if (!jugador) {
        anunciarError("❌ Jugador no encontrado", admin.id);
        anunciarError(`💡 Jugadores en sala: ${room.getPlayerList().filter(p => p.id !== 0).map(p => p.name).join(", ")}`, admin.id);
        return;
    }
    
    if (jugador.id === admin.id) {
        anunciarError("❌ No puedes banearte a ti mismo", admin.id);
        return;
    }
    
    room.kickPlayer(jugador.id, motivo, true);
    anunciarOficial(`🔨 ${jugador.name} fue baneado por ${admin.name}`);
    anunciarOficial(`📝 Motivo: ${motivo}`);
    
    // Reportar ban
    enviarReporteOficial(`🔨 **BAN DE JUGADOR**\n\n🙍‍♂️ **Jugador:** \`${jugador.name}\`  \n🛡️ **Admin:** \`${admin.name}\`  \n📄 **Motivo:** ${motivo}  \n⏰ **Hora:** \`${new Date().toLocaleString()}\``);
}

// Función para silenciar jugador por tiempo específico
function mutearJugador(admin, nombreJugador, tiempoSegundos, razon) {
    const jugador = room.getPlayerList().find(p => p.name.toLowerCase().includes(nombreJugador.toLowerCase()));
    if (!jugador) {
        anunciarError("❌ Jugador no encontrado", admin.id);
        return;
    }
    
    if (jugador.id === admin.id) {
        anunciarError("❌ No puedes silenciarte a ti mismo", admin.id);
        return;
    }
    
    // Verificar si ya está silenciado
    if (jugadoresSilenciados.has(jugador.id)) {
        const datosActuales = jugadoresSilenciados.get(jugador.id);
        const tiempoRestante = Math.max(0, (datosActuales.tiempoInicio + datosActuales.duracionSegundos * 1000 - Date.now()) / 1000);
        anunciarError(`❌ ${jugador.name} ya está silenciado (${Math.ceil(tiempoRestante)}s restantes)`, admin.id);
        return;
    }
    
    // Limpiar timer anterior si existe
    const timerAnterior = tiemposSilencio.get(jugador.id);
    if (timerAnterior) {
        clearTimeout(timerAnterior);
        tiemposSilencio.delete(jugador.id);
    }
    
    // Registrar silenciamiento
    const tiempoInicio = Date.now();
    const datosJugadorSilenciado = {
        mutedBy: admin.name,
        adminId: admin.id,
        razon: razon,
        tiempoInicio: tiempoInicio,
        duracionSegundos: tiempoSegundos
    };
    
    jugadoresSilenciados.set(jugador.id, datosJugadorSilenciado);
    
    // Configurar timer para unmute automático
    const timeoutID = setTimeout(() => {
        desmutearJugadorAutomatico(jugador.id);
    }, tiempoSegundos * 1000);
    
    tiemposSilencio.set(jugador.id, timeoutID);
    
    // Formatear tiempo para mostrar
    const minutos = Math.floor(tiempoSegundos / 60);
    const segundos = tiempoSegundos % 60;
    let tiempoTexto;
    if (minutos > 0) {
        tiempoTexto = `${minutos}m ${segundos}s`;
    } else {
        tiempoTexto = `${segundos}s`;
    }
    
    // Anunciar silenciamiento en un solo mensaje unificado
    const mensajeUnificado = `🔇 ${jugador.name} fue silenciado por ${admin.name}\n⏰ Duración: ${tiempoTexto}\n📝 Razón: ${razon}`;
    anunciarOficial(mensajeUnificado);
    
    // Mensajes privados al jugador silenciado
    room.sendAnnouncement(`🔇 Has sido silenciado por ${tiempoTexto}`, jugador.id, hexToNumber(COLORES.ERROR), "bold", 2);
    room.sendAnnouncement(`📝 Razón: ${razon}`, jugador.id, hexToNumber(COLORES.ERROR), "normal", 1);
    room.sendAnnouncement(`ℹ️ No podrás enviar mensajes hasta que termine el silencio`, jugador.id, hexToNumber(COLORES.INFO), "normal", 1);
    
    // Reportar a Discord
    enviarReporteOficial(`🔇 **Jugador Silenciado**\n**Jugador:** ${jugador.name}\n**Admin:** ${admin.name}\n**Duración:** ${tiempoTexto}\n**Razón:** ${razon}\n**Hora:** ${new Date().toLocaleString()}`);
    
    console.log(`🔇 Jugador silenciado: ${jugador.name} por ${admin.name} durante ${tiempoTexto} - Razón: ${razon}`);
}

// Función para quitar silencio manualmente
function desmutearJugador(admin, nombreJugador) {
    const jugador = room.getPlayerList().find(p => p.name.toLowerCase().includes(nombreJugador.toLowerCase()));
    if (!jugador) {
        anunciarError("❌ Jugador no encontrado", admin.id);
        return;
    }
    
    // Verificar si está silenciado
    if (!jugadoresSilenciados.has(jugador.id)) {
        anunciarError(`❌ ${jugador.name} no está silenciado`, admin.id);
        return;
    }
    
    const datosJugadorSilenciado = jugadoresSilenciados.get(jugador.id);
    
    // Limpiar timer de unmute automático
    const timerActual = tiemposSilencio.get(jugador.id);
    if (timerActual) {
        clearTimeout(timerActual);
        tiemposSilencio.delete(jugador.id);
    }
    
    // Remover de jugadores silenciados
    jugadoresSilenciados.delete(jugador.id);
    
    // Anunciar que se quitó el silencio
    anunciarOficial(`🔊 ${admin.name} quitó el silencio a ${jugador.name}`);
    
    // Mensaje privado al jugador
    anunciarExito(`🔊 Tu silencio fue removido por ${admin.name}`, jugador.id);
    anunciarInfo(`ℹ️ Ya puedes enviar mensajes nuevamente`, jugador.id);
    
    // Reportar a Discord
    const tiempoTranscurrido = Math.floor((Date.now() - datosJugadorSilenciado.tiempoInicio) / 1000);
    const minutos = Math.floor(tiempoTranscurrido / 60);
    const segundos = tiempoTranscurrido % 60;
    const tiempoTexto = minutos > 0 ? `${minutos}m ${segundos}s` : `${segundos}s`;
    
    enviarReporteOficial(`🔊 **Silencio Removido**\n**Jugador:** ${jugador.name}\n**Admin:** ${admin.name}\n**Tiempo transcurrido:** ${tiempoTexto}\n**Razón original:** ${datosJugadorSilenciado.razon}\n**Hora:** ${new Date().toLocaleString()}`);
    
    console.log(`🔊 Silencio removido: ${jugador.name} por ${admin.name} después de ${tiempoTexto}`);
}

// Función para unmute automático cuando se acaba el tiempo
function desmutearJugadorAutomatico(jugadorId) {
    const jugador = room.getPlayerList().find(p => p.id === jugadorId);
    
    if (!jugador || !jugadoresSilenciados.has(jugadorId)) {
        // El jugador se fue o ya fue desilenciado manualmente
        jugadoresSilenciados.delete(jugadorId);
        tiemposSilencio.delete(jugadorId);
        return;
    }
    
    const datosJugadorSilenciado = jugadoresSilenciados.get(jugadorId);
    
    // Remover de jugadores silenciados
    jugadoresSilenciados.delete(jugadorId);
    tiemposSilencio.delete(jugadorId);
    
    // Anunciar que el silencio terminó
    anunciarOficial(`🔊 El silencio de ${jugador.name} ha terminado`);
    
    // Mensaje privado al jugador
    anunciarExito(`🔊 Tu silencio ha terminado`, jugador.id);
    anunciarInfo(`ℹ️ Ya puedes enviar mensajes nuevamente`, jugador.id);
    
    console.log(`🔊 Silencio automático terminado: ${jugador.name}`);
}

function generarReportePartido() {
    const jugadores = room.getPlayerList().filter(p => p.id !== 0);
    const scores = room.getScores();
    
    if (scores) {
        // Llamar a la función específica de envío de reportes con replay
        enviarReporteDiscord();
        return;
    }
    
        if (firmasRecibidas.size > 0) {
            reporte += `✅ **JUGADORES VERIFICADOS (${firmasRecibidas.size})**\n`;
            for (const [playerID, datos] of firmasRecibidas) {
                const infoJugador = datos.nombre 
                    ? `• ${datos.nombreSala} → ${datos.nombre} (ID: ${datos.firmaID})`
                    : `• ${datos.nombreSala} (ID: ${datos.firmaID})`;
                reporte += `${infoJugador}\n`;
            }
            reporte += "\n";
        }
    
    if (firmasRequeridas.size > 0) {
        reporte += `⚠️ **VERIFICACIONES PENDIENTES (${firmasRequeridas.size})**\n`;
        for (const playerID of firmasRequeridas) {
            const player = room.getPlayerList().find(p => p.id === playerID);
            if (player) {
                reporte += `• ${player.name}\n`;
            }
        }
    }
    
    enviarReporteOficial(reporte);
    anunciarOficial("📤 Reporte de partido enviado a Discord");
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIÓN PARA ENVIAR REPORTE A DISCORD CON REPLAY
// ═══════════════════════════════════════════════════════════════════════════════

function enviarReporteDiscord() {
    // Evitar envíos duplicados
    if (reporteEnviado) {
        console.log("⚠️ Reporte ya enviado para este partido, evitando duplicado");
        return;
    }
    
    // NO ENVIAR REPORTES SOLO EN MAPA DE TRAINING
    // SE ENVÍAN REPORTES TANTO EN MODO OFICIAL COMO AMISTOSO
    
    if (mapaActual === "training") {
        console.log("🚫 No se envían reportes en mapa de training (calentamiento)");
        anunciarInfo("ℹ️ Mapa de training - No se genera reporte (calentamiento)");
        return;
    }
    
    // SE ENVÍAN REPORTES TANTO EN MODO OFICIAL COMO AMISTOSO
    // Los webhooks se determinan automáticamente según el modo
    
    // Validar duración mínima del partido
    const scores = room.getScores();
    
    // IMPORTANTE: Los partidos NO terminan por límite de goles automáticamente
    // Solo terminan por tiempo o intervención manual
    const terminoPorGoles = false; // Deshabilitado: no terminar por límite de goles
    
    // NOTA: Se eliminaron los límites de goles de respaldo
    // Los partidos solo deben terminar por tiempo o decisión manual
    let limiteGolesRespaldo = 0; // Deshabilitado
    
    const terminoPorGolesRespaldo = false; // Deshabilitado: no terminar por límites
    
    // Los partidos solo terminan por tiempo o intervención manual
    // NO se considera ningún límite de gol como criterio de finalización automática
    
    // Los partidos NO terminan automáticamente por goles
    const terminoEfectivoPorGoles = false; // Completamente deshabilitado
    
    // Debug: Mostrar información detallada
    console.log(`🔍 DEBUG - Análisis del partido:`);
    console.log(`   Scores: scoreLimit=${scores?.scoreLimit}, golesRed=${estadisticasPartido.golesRed}, golesBlue=${estadisticasPartido.golesBlue}`);
    console.log(`   Duración: ${estadisticasPartido.duracion}s, mínimo: ${segundosMinimoPartido}s`);
    console.log(`   Mapa: ${mapaActual}, límiteRespaldo: ${limiteGolesRespaldo}`);
    console.log(`   TerminoPorGoles: ${terminoPorGoles}, TerminoPorRespaldo: ${terminoPorGolesRespaldo}`);
    console.log(`   TerminoEfectivoPorGoles: ${terminoEfectivoPorGoles}`);
    
    // Si es muy corto Y NO terminó por goles, NO ENVIAR REPORTE
    if (estadisticasPartido.duracion < segundosMinimoPartido && !terminoEfectivoPorGoles) {
        console.log(`⚠️ Partido muy corto (${estadisticasPartido.duracion}s < ${segundosMinimoPartido}s) y no terminó por goles, NO se envía reporte`);
        anunciarInfo(`⚠️ Partido muy corto para generar reporte (${Math.floor(estadisticasPartido.duracion/60)}:${(estadisticasPartido.duracion%60).toString().padStart(2,'0')} < ${Math.floor(segundosMinimoPartido/60)}:${(segundosMinimoPartido%60).toString().padStart(2,'0')})`);
        
        // NO continuar con el envío - salir de la función
        return;
    }
    
    // Si terminó por goles (incluso si fue corto), enviar reporte
    if (estadisticasPartido.duracion < segundosMinimoPartido && terminoEfectivoPorGoles) {
        let motivoTermino = "";
        if (terminoPorGoles || terminoPorGolesRespaldo) {
            motivoTermino = "límite de goles alcanzado";
        }
        
        console.log(`✅ Partido corto pero terminó por ${motivoTermino} (${estadisticasPartido.golesRed}-${estadisticasPartido.golesBlue}), enviando reporte`);
        anunciarInfo(`✅ Partido terminó por ${motivoTermino} - enviando reporte y replay al Discord`);
    }
    
    if (!validarMapaPersonalizado()) return;
    
    const duracionMinutos = Math.floor(estadisticasPartido.duracion / 60);
    const duracionSegundos = estadisticasPartido.duracion % 60;
    
    // Verificar si debe enviar replay (TANTO para oficiales COMO amistosos)
    const debeEnviarReplay = enviarReplaysDiscord && (modoOficial ? guardarReplaysOficiales : true);
    
    // Generar reporte con estadísticas
    const mejorJugador = calcularMejorJugador();
    
    // Separar jugadores por equipos USANDO LAS ESTADÍSTICAS GUARDADAS (no room.getPlayerList())
    // Esto garantiza que aunque el jugador se haya ido, sus stats se mantengan
    const jugadoresRed = Object.values(estadisticasPartido.jugadores).filter(j => j.equipo === 1);
    const jugadoresBlue = Object.values(estadisticasPartido.jugadores).filter(j => j.equipo === 2);
    
    // Crear listas de jugadores para cada equipo USANDO DATOS GUARDADOS
    const listaRed = jugadoresRed.map(j => j.nombre).join(" - ") || "Sin jugadores";
    const listaBlue = jugadoresBlue.map(j => j.nombre).join(" - ") || "Sin jugadores";
    
    // Crear lista de goles RED usando ESTADÍSTICAS GUARDADAS (incluye goles normales del equipo rojo + autogoles del equipo azul)
    const golesRedNormales = jugadoresRed
        .filter(j => j.goles > 0)
        .map(j => `${j.nombre} x${j.goles}`)
        .join(", ");

    // Obtener autogoles del equipo azul para mostrar en goles del equipo rojo
    const autogolesBlue = jugadoresBlue
        .filter(j => j.autogoles > 0)
        .map(j => `${j.nombre} (e/c) x${j.autogoles}`)
        .join(", ");

    // CORRECCIÓN: Asegurar que los goles siempre aparezcan incluso si el jugador salió
    const golesRed = [golesRedNormales, autogolesBlue]
        .filter(str => str && str !== "---")
        .join(", ");

    // Crear lista de goles BLUE (incluye goles normales del equipo azul + autogoles del equipo rojo)
    const golesBlueNormales = jugadoresBlue
        .filter(j => j.goles > 0)
        .map(j => `${j.nombre} x${j.goles}`)
        .join(", ");
    
    const autogolesRed = jugadoresRed
        .filter(j => j.autogoles > 0)
        .map(j => `${j.nombre} (e/c) x${j.autogoles}`)
        .join(", ");
    
    const golesBlue = [golesBlueNormales, autogolesRed]
        .filter(str => str)
        .join(", ");
    
    // Crear lista de asistencias RED
    const asistenciasRed = jugadoresRed
        .filter(j => j.asistencias > 0)
        .map(j => `${j.nombre} x${j.asistencias}`)
        .join(", ");
    
    // Crear lista de asistencias BLUE
    const asistenciasBlue = jugadoresBlue
        .filter(j => j.asistencias > 0)
        .map(j => `${j.nombre} x${j.asistencias}`)
        .join(", ");
    
    // Crear top 3 mejores jugadores
    const todosJugadores = Object.values(estadisticasPartido.jugadores)
        .map(j => ({...j, puntuacion: (j.goles * 3) + (j.asistencias * 2) - (j.autogoles * 2)}))
        .sort((a, b) => b.puntuacion - a.puntuacion)
        .slice(0, 3);
    
    const top3 = todosJugadores.map(j => j.nombre).join(", ");
    
    // Calcular tiempos de valla invicta correctamente
    let tiempoVallaRealRed, tiempoVallaRealBlue;
    
    if (estadisticasPartido.golesBlue === 0) {
        // Equipo rojo no recibió goles: tiempo total del partido
        tiempoVallaRealRed = scores ? Math.floor(scores.time) : estadisticasPartido.duracion;
    } else {
        // Equipo rojo recibió goles: tiempo hasta el primer gol
        tiempoVallaRealRed = estadisticasPartido.tiempoVallaInvictaRed;
    }
    if (estadisticasPartido.golesRed === 0) {
        // Equipo azul no recibió goles: tiempo total del partido real
        if (scores && scores.time) {
            tiempoVallaRealBlue = Math.floor(scores.time);
        } else {
            tiempoVallaRealBlue = estadisticasPartido.duracion;
        }
    } else {
        // Equipo azul recibió goles: tiempo hasta el primer gol
        tiempoVallaRealBlue = estadisticasPartido.tiempoVallaInvictaBlue;
    }
    
    // Asegurar que los tiempos no sean negativos
    tiempoVallaRealRed = Math.max(0, tiempoVallaRealRed);
    tiempoVallaRealBlue = Math.max(0, tiempoVallaRealBlue);
    
    const minVallaRed = Math.floor(tiempoVallaRealRed / 60);
    const segVallaRed = tiempoVallaRealRed % 60;
    const minVallaBlue = Math.floor(tiempoVallaRealBlue / 60);
    const segVallaBlue = tiempoVallaRealBlue % 60;
    
    // Usar nombres personalizados de equipos de las estadísticas guardadas o fallback
    const nombreRojo = estadisticasPartido.nombreEquipoRojo || "RED";
    const nombreAzul = estadisticasPartido.nombreEquipoAzul || "BLUE";
    
    // Mapeo de nombres de equipos a IDs de stickers personalizados
    const stickerIDs = {
        'DO': '<:DO:1393336789300678807>',
        'DD': '<:DD:1378054971026702436>',
        'AVH': '<:AVH:1393336865100271788>',
        'ADB': '<:ADB:1377357671774027938>',
        'HYZ': '<:HYZ:1393336690579607582>',
        'FNV': '<:FNV:1393336738503463023>',
        'CAL': '<:CAL:1399286136932794559>',
        'JBL': '<:JBL:1399286044783808522>',
        'CATE': '<:CATE:1393336623772733583>',
        'TBL': '<:TBL:1378572927909232820>',
        'LMDT':'<:LMDT:1399887694129139812>',
        'SNB':'<:SNB:1389310007081828362>',
        'ESC':'<:ESC:1399891867625193543>',
    };
    
    // Usar formato personalizado para stickers en Discord
    const stickerRojo = estadisticasPartido.nombreEquipoRojo ? 
        (stickerIDs[estadisticasPartido.nombreEquipoRojo] || `:${estadisticasPartido.nombreEquipoRojo}:`) : "🔴";
    const stickerAzul = estadisticasPartido.nombreEquipoAzul ? 
        (stickerIDs[estadisticasPartido.nombreEquipoAzul] || `:${estadisticasPartido.nombreEquipoAzul}:`) : "🔵";
    
    // Generar el reporte con estadísticas usando nombres personalizados
let reporteTexto = `# **${nombreRojo}** ${stickerRojo} ${estadisticasPartido.golesRed} - ${estadisticasPartido.golesBlue} ${stickerAzul} **${nombreAzul}**${modoOficial ? ' | FECHA *' : ''}

${stickerRojo} : ${listaRed}
${stickerAzul} : ${listaBlue}

⚽ ${stickerRojo} : ${golesRed || "---"}
👟 ${stickerRojo} : ${asistenciasRed || "---"}
🥅 ${stickerRojo} : ${estadisticasPartido.arqueroRed || "---"} \`${minVallaRed}:${segVallaRed.toString().padStart(2, "0")}\`

⚽ ${stickerAzul} : ${golesBlue || "---"}
👟 ${stickerAzul} : ${asistenciasBlue || "---"}
🥅 ${stickerAzul} : ${estadisticasPartido.arqueroBlue || "---"} \`${minVallaBlue}:${segVallaBlue.toString().padStart(2, "0")}\`

⭐ MVP: ${mejorJugador ? mejorJugador.nombre + " " + (jugadoresRed.some(jr => jr.nombre === mejorJugador.nombre) ? stickerRojo : stickerAzul) : "---"}
🏅 Destacados: ${(top3.split(", ").filter(j => j !== (mejorJugador ? mejorJugador.nombre : "")).map(j => `${j} ${jugadoresRed.some(jr => jr.nombre === j) ? stickerRojo : stickerAzul}`).join(", ") || "---")}

`;
    
    // AGREGAR INFORMACIÓN DE FIRMAS PARA PARTIDOS OFICIALES - SEPARADAS POR JUGARON/NO JUGARON
    if (firmasRecibidas.size > 0) {
        // Separar firmas entre quienes jugaron y quienes no
        const firmasQuienJugaron = [];
        const firmasQuienNoJugaron = [];
        
        for (const [playerID, datos] of firmasRecibidas) {
            // Verificar si el jugador está en las estadísticas del partido (jugó)
            const estadisticasJugador = estadisticasPartido.jugadores[parseInt(playerID)];

            if (estadisticasJugador) {
                // Jugó - mostrar en el equipo donde jugó
                const equipoEmoji = estadisticasJugador.equipo === 1 ? stickerRojo : stickerAzul;
                const infoFirma = datos.nombre 
                    ? `\n${equipoEmoji} ${datos.nombreSala} → ${datos.nombre} (ID: ${datos.firmaID})`
                    : `\n${equipoEmoji} ${datos.nombreSala} (ID: ${datos.firmaID})`;
                firmasQuienJugaron.push(infoFirma);
            } else {
                // No jugó - se queda en espectadores
                const infoFirma = datos.nombre 
                    ? `\n⚪ ${datos.nombreSala} → ${datos.nombre} (ID: ${datos.firmaID})`
                    : `\n⚪ ${datos.nombreSala} (ID: ${datos.firmaID})`;
                firmasQuienNoJugaron.push(infoFirma);
            }
        }
        
        // Mostrar firmas de quienes jugaron - COMENTADO
        // if (firmasQuienJugaron.length > 0) {
        //     reporteTexto += `\n\n📝 **FIRMAS - JUGADORES QUE PARTICIPARON (${firmasQuienJugaron.length}):**`;
        //     firmasQuienJugaron.forEach(firma => reporteTexto += firma);
        // }
        
        // Mostrar firmas de quienes no jugaron
        if (firmasQuienNoJugaron.length > 0) {
            reporteTexto += `⚪ FIRMAS - ESPECTADORES (${firmasQuienNoJugaron.length}):`;
            firmasQuienNoJugaron.forEach(firma => reporteTexto += firma);
        }
        
        // Agregar separación estética entre firmas y la información del partido
        reporteTexto += "\n────────────\n";
    }
    
    if (firmasRequeridas.size > 0) {
        reporteTexto += `\n\n⚠️ FIRMAS PENDIENTES (${firmasRequeridas.size}):`;
        for (const playerID of firmasRequeridas) {
            const player = room.getPlayerList().find(p => p.id === playerID);
            if (player) {
                let equipoEmoji = "⚪";
                if (player.team === 1) equipoEmoji = stickerRojo;
                else if (player.team === 2) equipoEmoji = stickerAzul;
                reporteTexto += `\n${equipoEmoji} ${player.name} (ID: ${player.id})`;
            }
        }
        // Agregar renglón de separación después de firmas pendientes
        reporteTexto += "\n";
    }
    
    // Agregar información adicional al final del reporte con formato mejorado
    const modoTexto = modoOficial ? "OFICIAL" : "AMISTOSO";
    reporteTexto += `📢 **INFORMACION DEL PARTIDO:**\n🗺️ **Mapa:** \`${mapasOficiales[mapaActual].nombre}\`\n🏟️ **Modo:** \`${modoTexto}\`\n⏱️ **Duración:** \`${duracionMinutos}:${duracionSegundos.toString().padStart(2,"0")}\`\n`;
    
    // Configurar título y color según el modo
    const tituloEmbed = modoOficial ? "🏆 **PARTIDO OFICIAL COMPLETADO**" : "⚽ **PARTIDO AMISTOSO COMPLETADO**";
    const colorEmbed = modoOficial ? parseInt(COLORES.OFICIAL, 16) : parseInt(COLORES.INFO, 16);
    
    const embed = {
        title: tituloEmbed,
        description: reporteTexto,
        color: colorEmbed,
        fields: []
    };
    
    // Agregar footer al embed
    embed.footer = {
        text: "Script by ИФT"
    };
    
    // Payload base
    const payload = {
        embeds: [embed]
    };

    // Verificar si es un informe con formato :tld: (contiene nombres de equipos personalizados con formato :nombre:)
    const esInformeTLD = (estadisticasPartido.nombreEquipoRojo && estadisticasPartido.nombreEquipoAzul && 
                         reporteTexto.includes(`:${estadisticasPartido.nombreEquipoRojo}:`) && 
                         reporteTexto.includes(`:${estadisticasPartido.nombreEquipoAzul}:`));
    
    // Enviar reporte sin lógica de edición
    enviarSinReplay(payload, false, esInformeTLD);
    
    // TANTO partidos amistosos COMO oficiales envían replay si está disponible
    console.log(`📤 Reporte ${modoOficial ? 'oficial' : 'amistoso'} enviado al webhook correspondiente`);
    const tipoPartido = modoOficial ? 'oficial' : 'amistoso';
    anunciarInfo(`📤 Reporte del partido ${tipoPartido} enviado al Discord`);
    
    // Continuar con el envío de replay independientemente del modo
    
    // Si hay replay, enviarlo inmediatamente (TANTO para oficiales COMO amistosos)
    if (debeEnviarReplay && replayData && typeof FormData !== 'undefined') {
        console.log(`🎬 Preparando envío de replay completo para ${tipoPartido} (${replayData.length} bytes)`);
        // CRÍTICO: No establecer envioEnProceso = false hasta que AMBOS (reporte Y replay) estén enviados
        // Resetear la bandera para que el replay también la controle
        envioEnProceso = true;
        setTimeout(() => {
            enviarReplaySolo();
        }, 200); // REDUCIDO: Solo 200ms de delay para evitar conflictos
    } else {
        if (!replayData) {
            console.log(`⚠️ No hay datos de replay disponibles`);
            anunciarInfo("⚠️ No se pudo generar el replay del partido");
        } else if (typeof FormData === 'undefined') {
            console.log(`⚠️ FormData no disponible para enviar replay`);
            anunciarInfo("⚠️ Sistema de envío de archivos no disponible");
        }
    }
}

// FUNCIÓN PARA ENVIAR SOLO EL REPLAY (después del reporte)
function enviarReplaySolo() {
    try {
        const formData = new FormData();
        
        // Crear archivo de replay con nombre según el modo
        const fecha = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const tipoModo = modoOficial ? 'OFICIAL' : 'AMISTOSO';
        const nombreArchivo = `LNB_${tipoModo}_${fecha}_${estadisticasPartido.golesRed}-${estadisticasPartido.golesBlue}.hbr2`;
        const blob = new Blob([replayData], { type: 'application/octet-stream' });
        
        // Payload con información del replay completo
        const duracionMinutos = Math.floor(estadisticasPartido.duracion / 60);
        const duracionSegundos = estadisticasPartido.duracion % 60;
        const payloadReplay = {
            content: ``
        };
        
        formData.append('payload_json', JSON.stringify(payloadReplay));
        formData.append('files[0]', blob, nombreArchivo);
        
        // Determinar el webhook correcto según el modo del partido
        let webhookAUsar;
        let tipoPartido;
        
        if (modoOficial) {
            // Partidos oficiales: usar webhook de informes TLD
            webhookAUsar = webhookInformeTLD;
            tipoPartido = 'oficial';
        } else {
            // Partidos amistosos: usar webhook de amistosos
            webhookAUsar = webhookAmistoso;
            tipoPartido = 'amistoso';
        }
        
        fetch(webhookAUsar, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // IMPORTANTE: También establecer envioEnProceso = false cuando se envía replay exitosamente
                envioEnProceso = false;
                anunciarExito(`🎬 Replay ${tipoPartido} enviado a Discord exitosamente`);
                console.log(`🎬 Replay ${tipoPartido} enviado: ${nombreArchivo}`);
                console.log(`✅ envioEnProceso establecido a false después de envío de replay`);
            } else {
                envioEnProceso = false;
                anunciarError(`❌ Error al enviar replay ${tipoPartido} a Discord`, null);
                console.log(`❌ Error al enviar replay ${tipoPartido}: ${response.status}`);
                console.log(`⚠️ envioEnProceso establecido a false debido a error en envío de replay`);
            }
        })
        .catch(error => {
            // Establecer a false en caso de error de conexión con replay
            envioEnProceso = false;
            anunciarError(`❌ Error de conexión al enviar replay ${tipoPartido} a Discord`, null);
            console.log(`Error al enviar replay ${tipoPartido}:`, error);
            console.log(`⚠️ envioEnProceso establecido a false debido a error de conexión de replay`);
        });
    } catch (error) {
        console.log("❌ Error al preparar envío de replay:", error);
    }
}

// FUNCIÓN PARA ENVIAR SIN REPLAY
function enviarSinReplay(payload, incluyeNotaReplay = false, esInformeTLD = false) {
    if (incluyeNotaReplay) {
        payload.content += "\n🎬 *Replay disponible - contacta admin para obtenerlo*";
    }
    
    // Determinar el webhook a usar según el modo y tipo de informe
    let webhookAUsar;
    if (modoOficial) {
        // Para partidos oficiales:
        // - Si es informe TLD (con formato :equipo: y footer "Script by ИФT") → webhook original
        // - Todos los demás informes oficiales → nuevo webhook
        if (esInformeTLD) {
            webhookAUsar = webhookInformeTLD;
            console.log(`📤 Usando webhook TLD para informe con formato especial`);
        } else {
            webhookAUsar = webhookOficial;
            console.log(`📤 Usando webhook nuevo para informe oficial estándar`);
        }
    } else {
        // Para partidos amistosos: usar webhook de amistosos
        webhookAUsar = webhookAmistoso;
        console.log(`📤 Usando webhook de amistosos`);
    }
    const tipoPartido = modoOficial ? "oficial" : "amistoso";
    
    if (webhookAUsar && webhookAUsar.length > 0) {
        fetch(webhookAUsar, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                reporteEnviado = true;
                // NUEVA LÓGICA: Solo establecer envioEnProceso = false si NO hay replay pendiente
                const hayReplayPendiente = debeEnviarReplay && replayData && typeof FormData !== 'undefined';
                if (!hayReplayPendiente) {
                    envioEnProceso = false;
                    console.log(`✅ envioEnProceso establecido a false - No hay replay, comando !rr puede proceder`);
                } else {
                    console.log(`⏳ Reporte enviado exitosamente, esperando envío de replay para liberar envioEnProceso`);
                }
                const mensaje = incluyeNotaReplay ? 
                    `📤 Informe ${tipoPartido} enviado a Discord (replay disponible localmente)` : 
                    `📤 Informe ${tipoPartido} enviado a Discord exitosamente`;
                anunciarExito(mensaje);
                console.log(`📤 Reporte ${tipoPartido} enviado exitosamente`);
            } else {
                // También establecer a false en caso de error para no bloquear futuros reinicios
                envioEnProceso = false;
                anunciarError(`❌ Error al enviar reporte ${tipoPartido} a Discord`, null);
                console.log(`❌ Error al enviar reporte ${tipoPartido}: ${response.status}`);
                console.log(`⚠️ envioEnProceso establecido a false debido a error`);
            }
        })
        .catch(error => {
            // Establecer a false en caso de error de conexión
// No mostrar mensaje de error falso a menos que sea necesario
            envioEnProceso = false;
            console.log(`Error al enviar reporte ${tipoPartido}:`, error);
            console.log(`⚠️ envioEnProceso establecido a false debido a error de conexión`);
        });
    } else {
        console.log(`⚠️ No se encontró webhook configurado para partidos ${tipoPartido}s`);
        anunciarError(`❌ No se encontró webhook configurado para partidos ${tipoPartido}s`, null);
    }
}


// FUNCIÓN PARA VALIDAR MAPA PERSONALIZADO
function validarMapaPersonalizado() {
    if (!mapasOficiales[mapaActual]) {
        console.log("⚠️ Mapa no válido para reportes oficiales:", mapaActual);
        anunciarInfo("⚠️ El mapa actual no es válido para generar reportes oficiales");
        return false;
    }
    return true;
}

// FUNCIÓN PARA CALCULAR MEJOR JUGADOR
function calcularMejorJugador() {
    const jugadores = Object.values(estadisticasPartido.jugadores);
    if (jugadores.length === 0) return null;
    
    return jugadores.reduce((mejor, actual) => {
        const puntuacionActual = (actual.goles * 3) + (actual.asistencias * 2) - (actual.autogoles * 2);
        const puntuacionMejor = (mejor.goles * 3) + (mejor.asistencias * 2) - (mejor.autogoles * 2);
        return puntuacionActual > puntuacionMejor ? actual : mejor;
    });
}

// FUNCIÓN PARA INICIALIZAR ESTADÍSTICAS
function inicializarEstadisticas() {
    estadisticasPartido = {
        jugadores: {},
        golesRed: 0,
        golesBlue: 0,
        duracion: 0,
        iniciado: false,
        arqueroRed: null,
        arqueroBlue: null,
        tiempoVallaInvictaRed: 0,
        tiempoVallaInvictaBlue: 0
    };
    
    reporteEnviado = false;
    replayData = null;
    
    // Registrar jugadores iniciales en estadísticas
    const jugadores = room.getPlayerList();
    jugadores.forEach(jugador => {
        if (jugador.team !== 0) {
            estadisticasPartido.jugadores[jugador.id] = {
                nombre: jugador.name,
                equipo: jugador.team,
                goles: 0,
                asistencias: 0,
                autogoles: 0,
                arquero: false,
                tiempo: 0
            };
        }
    });
    
    console.log("📊 Estadísticas de partido reiniciadas");
}

// FUNCIÓN PARA DETECTAR ARQUEROS
function detectarArqueros() {
    // Lógica simplificada: el jugador más cercano al arco
    const jugadores = room.getPlayerList();
    let arqueroRed = null, arqueroBlue = null;
    
    jugadores.forEach(jugador => {
        if (jugador.team === 1 && jugador.position) {
            if (!arqueroRed || jugador.position.x < arqueroRed.position.x) {
                arqueroRed = jugador;
            }
        } else if (jugador.team === 2 && jugador.position) {
            if (!arqueroBlue || jugador.position.x > arqueroBlue.position.x) {
                arqueroBlue = jugador;
            }
        }
    });
    
    if (arqueroRed) {
        estadisticasPartido.arqueroRed = arqueroRed.name;
        // Si el arquero no existe en las estadísticas, agregarlo
        if (!estadisticasPartido.jugadores[arqueroRed.id]) {
            estadisticasPartido.jugadores[arqueroRed.id] = {
nombre: "(" + arqueroRed.name + ")",
                equipo: arqueroRed.team,
                goles: 0,
                asistencias: 0,
                autogoles: 0,
                arquero: false,
                tiempo: 0
            };
            console.log(`📊 Arquero ${arqueroRed.name} agregado a estadísticas (ingresó durante el partido)`);
        }
        const stats = estadisticasPartido.jugadores[arqueroRed.id];
        if (stats) stats.arquero = true;
    }
    
    if (arqueroBlue) {
        estadisticasPartido.arqueroBlue = arqueroBlue.name;
        // Si el arquero no existe en las estadísticas, agregarlo
        if (!estadisticasPartido.jugadores[arqueroBlue.id]) {
            estadisticasPartido.jugadores[arqueroBlue.id] = {
nombre: "(" + arqueroBlue.name + ")",
                equipo: arqueroBlue.team,
                goles: 0,
                asistencias: 0,
                autogoles: 0,
                arquero: false,
                tiempo: 0
            };
            console.log(`📊 Arquero ${arqueroBlue.name} agregado a estadísticas (ingresó durante el partido)`);
        }
        const stats = estadisticasPartido.jugadores[arqueroBlue.id];
        if (stats) stats.arquero = true;
    }
}

// FUNCIÓN PARA ACTUALIZAR REPLAY (basada en bot_lnb1.js)
function actualizarReplay() {
    try {
        // Intentar obtener el replay usando diferentes métodos
        if (typeof room.stopRecording === 'function') {
            // Si tenemos stopRecording, usarlo para obtener el replay
            replayData = room.stopRecording();
            // Reiniciar grabación inmediatamente para continuar grabando
            if (partidoEnCurso && typeof room.startRecording === 'function') {
                room.startRecording();
            }
        } else if (typeof room.getReplay === 'function') {
            replayData = room.getReplay();
        }
        
        if (replayData) {
            replayActual = `Replay_${Date.now()}_${estadisticasPartido.golesRed}_${estadisticasPartido.golesBlue}`;
            console.log(`🎬 Replay actualizado: ${replayActual} (${replayData.length} bytes)`);
        } else {
            // Crear identificador para el replay aunque no tengamos datos
            replayActual = `Replay_${Date.now()}_${estadisticasPartido.golesRed}_${estadisticasPartido.golesBlue}`;
            console.log(`🎬 Replay identificador creado: ${replayActual}`);
        }
    } catch (error) {
        console.log("❌ Error al obtener replay:", error);
        replayActual = `Replay_${Date.now()}_${estadisticasPartido.golesRed}_${estadisticasPartido.golesBlue}_error`;
    }
}

// FUNCIÓN PARA OBTENER REPLAY FINAL COMPLETO
function obtenerReplayFinal() {
    try {
        // Usar actualizarReplay() que es más robusta
        actualizarReplay();
        
        if (replayData) {
            console.log(`🎬 Replay COMPLETO obtenido: ${replayData.length} bytes`);
            console.log(`🎬 El replay contiene todo el partido desde el inicio hasta el final`);
        } else {
            console.log(`⚠️ No se pudo obtener datos de replay`);
        }
        
        return replayData;
    } catch (error) {
        console.log("❌ Error al obtener replay final:", error);
        return null;
    }
}

// FUNCIÓN PARA GUARDAR REPLAY EN PC (solo para referencia)
function guardarReplayEnPC() {
    if (!guardarReplaysEnPC) return;
    
    try {
        if (replayData && typeof window !== 'undefined' && window.URL) {
            // Solo funciona en navegador
            const fecha = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const nombreArchivo = `LNB_OFICIAL_${fecha}_${estadisticasPartido.golesRed}-${estadisticasPartido.golesBlue}.hbr2`;
            
            const blob = new Blob([replayData], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = nombreArchivo;
            a.click();
            window.URL.revokeObjectURL(url);
            
            anunciarExito(`💾 Replay guardado: ${nombreArchivo}`);
        } else {
            console.log(`💾 Replay registrado para guardar: ${replayActual}`);
        }
    } catch (error) {
        console.log("❌ Error al guardar replay:", error);
    }
}

// FUNCIÓN PARA VERIFICAR ESTADO DE GRABACIÓN
function verificarGrabacion() {
    try {
        if (typeof room.stopRecording === 'function') {
            console.log(`🎬 Sistema de grabación disponible - Grabando desde el inicio`);
            return true;
        } else if (typeof room.getReplay === 'function') {
            console.log(`🎬 Sistema de replay disponible via getReplay`);
            return true;
        } else {
            console.log(`⚠️ No hay sistema de replay disponible`);
            return false;
        }
    } catch (error) {
        console.log("❌ Error al verificar grabación:", error);
        return false;
    }
}

// FUNCIÓN PARA ENVIAR PUNTUACIONES PRIVADAS A JUGADORES
function enviarPuntuacionesPrivadas() {
    const jugadores = room.getPlayerList().filter(p => p.id !== 0);
    
    jugadores.forEach(jugador => {
        const statsJugador = estadisticasPartido.jugadores[jugador.id];
        if (statsJugador) {
            const puntuacion = calcularPuntuacion(statsJugador);
            const equipoColor = statsJugador.equipo === 1 ? "🔴" : "🔵";
            
            // Determinar el mensaje según la puntuación
            let mensajeCalificacion = "";
            if (puntuacion >= 9) {
                mensajeCalificacion = "🌟 ¡EXCELENTE PARTIDO!";
            } else if (puntuacion >= 7) {
                mensajeCalificacion = "👏 ¡Muy buen partido!";
            } else if (puntuacion >= 5) {
                mensajeCalificacion = "👍 Buen partido";
            } else if (puntuacion >= 3) {
                mensajeCalificacion = "📈 Puedes mejorar";
            } else {
                mensajeCalificacion = "💪 ¡Sigue practicando!";
            }
            
            anunciarInfo(`🏆 TU RENDIMIENTO EN EL PARTIDO`, jugador.id);
            anunciarInfo(`📊 Puntuación: ${puntuacion}/10 ${mensajeCalificacion}`, jugador.id);
            anunciarInfo(`${equipoColor} ⚽ Goles: ${statsJugador.goles} | 🎯 Asistencias: ${statsJugador.asistencias} | 💀 Autogoles: ${statsJugador.autogoles}`, jugador.id);
            
            if (statsJugador.arquero) {
                anunciarInfo(`🥅 Fuiste arquero en este partido`, jugador.id);
            }
        }
    });
}

// FUNCIÓN PARA REGISTRAR GOL CON ESTADÍSTICAS INDIVIDUALES
function registrarGolOficial(goleador, equipo, asistente) {
    // Si el jugador no existe en las estadísticas (ingresó durante el partido), agregarlo
    if (!estadisticasPartido.jugadores[goleador.id]) {
        estadisticasPartido.jugadores[goleador.id] = {
nombre: "(" + goleador.name + ")",
            equipo: goleador.team,
            goles: 0,
            asistencias: 0,
            autogoles: 0,
            arquero: false,
            tiempo: 0
        };
        console.log(`📊 Jugador ${goleador.name} agregado a estadísticas (ingresó durante el partido)`);
    }
    
    const statsGoleador = estadisticasPartido.jugadores[goleador.id];
    if (statsGoleador) {
        const nombreGoleador = goleador.name;
        
        // Obtener tiempo del gol
        const scores = room.getScores();
        const tiempoMinutos = Math.floor(scores.time / 60);
        const tiempoSegundos = Math.floor(scores.time % 60);
        const tiempoFormateado = `${tiempoMinutos.toString().padStart(2, '0')}:${tiempoSegundos.toString().padStart(2, '0')}`;
        
        // Verificar si es autogol: el goleador es de equipo diferente al que anotó
        if (goleador.team === equipo) {
            // Gol normal: el goleador pertenece al equipo que anotó
            statsGoleador.goles++;
            
            // Mensaje de gol
            let mensajeGol = `⚽ [${tiempoFormateado}] Gol de ${nombreGoleador}`;
            
            // Agregar asistencia si existe (SOLO para goles normales, NO para autogoles)
            if (asistente && asistente.id !== goleador.id) {
                // Si el asistente no existe en las estadísticas (ingresó durante el partido), agregarlo
                if (!estadisticasPartido.jugadores[asistente.id]) {
                    estadisticasPartido.jugadores[asistente.id] = {
nombre: "(" + asistente.name + ")",
                        equipo: asistente.team,
                        goles: 0,
                        asistencias: 0,
                        autogoles: 0,
                        arquero: false,
                        tiempo: 0
                    };
                    console.log(`📊 Asistente ${asistente.name} agregado a estadísticas (ingresó durante el partido)`);
                }
                
                const statsAsistente = estadisticasPartido.jugadores[asistente.id];
                if (statsAsistente && asistente.team === equipo) {
                    const nombreAsistente = asistente.name;
                    mensajeGol += ` • Asistencia de ${nombreAsistente}`;
                    
                    // Registrar asistencia
                    statsAsistente.asistencias++;
                }
            }
            
            anunciarOficial(mensajeGol);
        } else {
            // Es un autogol: el goleador pertenece al equipo contrario al que anotó
            statsGoleador.autogoles++;
            const mensajeAutogol = `⚽💀 [${tiempoFormateado}] Gol en contra de ${nombreGoleador}`;
            anunciarOficial(mensajeAutogol);
            
            // Mostrar información de debug para verificar el autogol
            console.log(`🚨 AUTOGOL DETECTADO: ${nombreGoleador} (equipo ${goleador.team}) anotó para equipo ${equipo}`);
            console.log(`📊 Autogoles actuales de ${nombreGoleador}: ${statsGoleador.autogoles}`);
            
            // DEBUG ADICIONAL: Verificar que se está guardando en el jugador correcto
            console.log(`🔍 Datos del jugador:`, {
                id: goleador.id,
                nombre: nombreGoleador,
                equipo: goleador.team,
                autogoles: statsGoleador.autogoles
            });
            
            // IMPORTANTE: No registrar asistencias en autogoles
        }
    }

    // Actualizar contadores del partido
    if (equipo === 1) {
        estadisticasPartido.golesRed++;
    } else {
        estadisticasPartido.golesBlue++;
    }

    // NO actualizar replay durante el partido - HaxBall graba automáticamente
    // El replay completo se obtendrá al final con room.getReplay()
}

// FUNCIÓN PARA CREAR IDENTIFICADOR DE REPLAY (sin interferir con la grabación)
function crearIdentificadorReplay() {
    try {
        // Solo crear un identificador único para el replay sin interrumpir la grabación automática
        replayActual = `Replay_${Date.now()}_${estadisticasPartido.golesRed}_${estadisticasPartido.golesBlue}`;
        console.log(`🎬 Identificador de replay creado: ${replayActual}`);
        
        // NO tocar room.stopRecording() ni room.startRecording() durante el partido
        // HaxBall graba automáticamente desde el inicio hasta el final
        
    } catch (error) {
        console.log("❌ Error al crear identificador de replay:", error);
        replayActual = `Replay_${Date.now()}_${estadisticasPartido.golesRed}_${estadisticasPartido.golesBlue}_error`;
    }
}


// Sistema de jugadores incluidos en chat de equipo
let jugadoresIncluidosEnEquipo = new Map(); // {playerID: teamNumber} - Para espectadores incluidos en chat de equipo


// Función para capturar colores actuales mediante observación
function capturarColoresActuales() {
    console.log('🎨 Capturando colores actuales de los equipos...');
    
    // PRIORIDAD 1: Usar colores personalizados detectados con /colors
    if (coloresPersonalizados.rojo && coloresPersonalizados.azul) {
        console.log('✅ Usando colores personalizados detectados con /colors');
        console.log('  Rojo:', coloresPersonalizados.rojo);
        console.log('  Azul:', coloresPersonalizados.azul);
        
        coloresAntesDeLSwap.rojo = {
            angle: 0,
            textColor: 0xFFFFFF,
            colors: coloresPersonalizados.rojo.colores
        };
        coloresAntesDeLSwap.azul = {
            angle: 0,
            textColor: 0xFFFFFF,
            colors: coloresPersonalizados.azul.colores
        };
        
        console.log('✅ Colores asignados desde detección /colors:', coloresAntesDeLSwap);
        return true;
    }
    
    // PRIORIDAD 2: Intentar obtener colores con las funciones nativas
    try {
        if (typeof room.getTeamColors === 'function') {
            const coloresRojo = room.getTeamColors(1);
            const coloresAzul = room.getTeamColors(2);
            
            console.log('🔍 Colores obtenidos por función nativa:');
            console.log('  Rojo:', coloresRojo);
            console.log('  Azul:', coloresAzul);
            
            // Verificar que los colores son válidos y NO son los por defecto
            if (coloresRojo && coloresAzul && 
                coloresRojo.colors && coloresAzul.colors &&
                Array.isArray(coloresRojo.colors) && Array.isArray(coloresAzul.colors) &&
                coloresRojo.colors.length >= 3 && coloresAzul.colors.length >= 3) {
                
                // Verificar si son colores por defecto (rechazar estos)
                const esDefaultRojo = (coloresRojo.colors[0] === 0xE56E56 || coloresRojo.colors[0] === 15035478) && 
                                     (coloresRojo.colors[1] === 0xFFFFFF || coloresRojo.colors[1] === 16777215);
                const esDefaultAzul = (coloresAzul.colors[0] === 0x5689E5 || coloresAzul.colors[0] === 5670373) && 
                                     (coloresAzul.colors[1] === 0xFFFFFF || coloresAzul.colors[1] === 16777215);
                
                if (!esDefaultRojo || !esDefaultAzul) {
                    // Al menos uno de los equipos tiene colores personalizados
                    coloresAntesDeLSwap.rojo = coloresRojo;
                    coloresAntesDeLSwap.azul = coloresAzul;
                    
                    console.log('✅ Colores personalizados capturados exitosamente:', coloresAntesDeLSwap);
                    return true;
                } else {
                    console.log('ℹ️ Solo colores por defecto detectados - no se puede intercambiar automáticamente');
                }
            }
        }
    } catch (error) {
        console.log('⚠️ Error al capturar colores con funciones nativas:', error.message);
    }
    
    // PRIORIDAD 3: Verificar si solo uno de los equipos tiene colores personalizados
    if (coloresPersonalizados.rojo || coloresPersonalizados.azul) {
        console.log('⚠️ Solo uno de los equipos tiene colores personalizados detectados');
        console.log('  Rojo:', coloresPersonalizados.rojo ? '✅ Detectado' : '❌ No detectado');
        console.log('  Azul:', coloresPersonalizados.azul ? '✅ Detectado' : '❌ No detectado');
        
        anunciarInfo('⚠️ Solo uno de los equipos tiene camisetas personalizadas detectadas');
        anunciarInfo('💡 Para intercambio automático: ambos equipos deben usar /colors primero');
        
        if (coloresPersonalizados.rojo) {
            anunciarInfo('🔴 Equipo rojo: ✅ Camiseta detectada');
        } else {
            anunciarInfo('🔴 Equipo rojo: ❌ Usa /colors red [color1] [color2] [color3]');
        }
        
        if (coloresPersonalizados.azul) {
            anunciarInfo('🔵 Equipo azul: ✅ Camiseta detectada');
        } else {
            anunciarInfo('🔵 Equipo azul: ❌ Usa /colors blue [color1] [color2] [color3]');
        }
        
        return false;
    }
    
    // Si llegamos aquí, no hay colores personalizados válidos para intercambiar
    console.log('⚠️ No se detectaron colores personalizados en ningún equipo');
    
    // Limpiar colores anteriores para evitar usar datos obsoletos
    coloresAntesDeLSwap.rojo = null;
    coloresAntesDeLSwap.azul = null;
    
    return false;
}

// Función para intercambiar colores manualmente haciendo que el bot se mueva entre equipos
function intercambiarColoresManualmente() {
    console.log('🎨 Iniciando intercambio manual de colores...');
    
    // Verificar que tenemos los colores guardados
    if (!coloresAntesDeLSwap.rojo || !coloresAntesDeLSwap.azul) {
        console.log('⚠️ No se tienen colores guardados para intercambiar');
        return false;
    }
    
    try {
        // Función para formatear colores a hex
        function colorToHex(color) {
            const hex = color.toString(16).padStart(6, '0');
            return hex;
        }
        
        // CORRECCIÓN: Preparar comandos para INTERCAMBIAR los colores correctamente
        const coloresRojoOriginal = coloresAntesDeLSwap.rojo.colors;
        const coloresAzulOriginal = coloresAntesDeLSwap.azul.colors;
        
        // Intercambiar colores: el equipo rojo toma los colores del azul y viceversa
        const comandoRojo = `/colors red ${colorToHex(coloresAzulOriginal[0])} ${colorToHex(coloresAzulOriginal[1])} ${colorToHex(coloresAzulOriginal[2])}`;
        const comandoAzul = `/colors blue ${colorToHex(coloresRojoOriginal[0])} ${colorToHex(coloresRojoOriginal[1])} ${colorToHex(coloresRojoOriginal[2])}`;
        
        console.log('🎨 Comandos a ejecutar (intercambiando colores correctamente):');
        console.log('  - Para rojo (tomar colores del azul):', comandoRojo);
        console.log('  - Para azul (tomar colores del rojo):', comandoAzul);
        
        anunciarInfo('🤖 Moviendo bot entre equipos para intercambiar colores');
        
        // ESTRATEGIA NUEVA: Hacer que el bot se mueva físicamente entre equipos
        ejecutarCambioColoresPorMovimiento(comandoRojo, comandoAzul);
        
        return true;
        
    } catch (error) {
        console.log('⚠️ Error al preparar intercambio manual de colores:', error.message);
        anunciarError('❌ Error al preparar intercambio de colores');
        return false;
    }
}

// Nueva función mejorada para intercambios automáticos de camisetas con mejor manejo de errores
function ejecutarIntercambioCamisetasConBotMejorado(comandoRojo, comandoAzul) {
    if (ultimosComandosColors.rojo && ultimosComandosColors.azul) {
        // Intercambiar comandos
        const temp = ultimosComandosColors.rojo;
        ultimosComandosColors.rojo = ultimosComandosColors.azul;
        ultimosComandosColors.azul = temp;
        console.log('🔄 Comandos de camisetas intercambiados:');
        console.log('  - Rojo (ahora azul):', ultimosComandosColors.azul);
        console.log('  - Azul (ahora rojo):', ultimosComandosColors.rojo);

        // Usar comandos de camisetas intercambiados
        comandoRojo = ultimosComandosColors.rojo;
        comandoAzul = ultimosComandosColors.azul;
    }
    console.log('🔄 === INICIANDO INTERCAMBIO MEJORADO DE CAMISETAS ===');
    console.log('🎨 Comando para rojo:', comandoRojo);
    console.log('🎨 Comando para azul:', comandoAzul);
    
    // El bot headless (id:0) no siempre aparece en la lista de jugadores.
    // Asumimos que su equipo original es Espectadores (0) y lo movemos desde ahí.
    const equipoOriginalBot = 0; 
    console.log(`🤖 Posición original del bot: equipo ${equipoOriginalBot}`);
    
    try {
        // Secuencia automatizada con promesas para mejor control
        return new Promise((resolve) => {
            let pasoCompletado = 0;
            const totalPasos = 2;
            
            // Paso 1: Aplicar colores al equipo rojo
            setTimeout(() => {
                console.log('🎨 Paso 1: Aplicando colores al equipo rojo...');
                
                try {
                    // Mover bot al equipo rojo
                    room.setPlayerTeam(0, 1);
                    
                    // Aplicar colores después de un pequeño delay
                    setTimeout(() => {
                        try {
                            procesarComandoColoresDirecto(comandoRojo);
                            console.log('✅ Colores aplicados al equipo rojo');
                            pasoCompletado++;
                            
                            // Continuar con equipo azul
                            continuarConEquipoAzul();
                            
                        } catch (error) {
                            console.log('⚠️ Error al aplicar colores rojos:', error.message);
                            anunciarInfo(`🔴 Ejecuta manualmente: ${comandoRojo}`);
                            continuarConEquipoAzul(); // Continuar de todas formas
                        }
                    }, 800);
                    
                } catch (error) {
                    console.log('⚠️ Error al mover bot al equipo rojo:', error.message);
                    resolve(false);
                }
            }, 300);
            
            // Función para continuar con el equipo azul
            function continuarConEquipoAzul() {
                setTimeout(() => {
                    console.log('🎨 Paso 2: Aplicando colores al equipo azul...');
                    
                    try {
                        // Mover bot al equipo azul
                        room.setPlayerTeam(0, 2);
                        
                        // Aplicar colores después de un pequeño delay
                        setTimeout(() => {
                            try {
                                procesarComandoColoresDirecto(comandoAzul);
                                console.log('✅ Colores aplicados al equipo azul');
                                pasoCompletado++;
                                
                            } catch (error) {
                                console.log('⚠️ Error al aplicar colores azules:', error.message);
                                anunciarInfo(`🔵 Ejecuta manualmente: ${comandoAzul}`);
                            }
                            
                            // Finalizar secuencia
                            finalizarSecuencia();
                            
                        }, 800);
                        
                    } catch (error) {
                        console.log('⚠️ Error al mover bot al equipo azul:', error.message);
                        finalizarSecuencia(); // Finalizar de todas formas
                    }
                }, 1000);
            }
            
            // Función para finalizar la secuencia
            function finalizarSecuencia() {
                setTimeout(() => {
                    try {
                        room.setPlayerTeam(0, equipoOriginalBot);
                        anunciarExito('🎨 ¡Intercambio de camisetas completado exitosamente!');
                        console.log('✅ Intercambio mejorado completado exitosamente');
                        
                        // Resolver con éxito si se completaron ambos pasos
                        const exito = pasoCompletado >= totalPasos;
                        console.log(`📊 Pasos completados: ${pasoCompletado}/${totalPasos}, éxito: ${exito}`);
                        resolve(exito);
                        
                    } catch (error) {
                        console.log('⚠️ Error al regresar bot:', error.message);
                        resolve(false);
                    }
                }, 800);
            }
        });
        
    } catch (error) {
        console.log('❌ Error general en intercambio mejorado:', error.message);
        anunciarError('❌ Error en el intercambio automático de camisetas');
        return false;
    }
}

// Nueva función específica para intercambios automáticos de camisetas - MEJORADA
function ejecutarIntercambioCamisetasConBot(comandoRojo, comandoAzul) {
    console.log('🔄 === INICIANDO INTERCAMBIO AUTOMÁTICO DE CAMISETAS ===');
    console.log('🎨 Comando para rojo:', comandoRojo);
    console.log('🎨 Comando para azul:', comandoAzul);
    
    // NUEVA LÓGICA: Hacer visible al bot temporalmente
    console.log('🤖 Haciendo visible al bot temporalmente para intercambio...');
    
    // Intentar hacer visible al bot modificando su estado
    let botHechoVisible = false;
    try {
        // Si existe una función para controlar la visibilidad del bot
        if (typeof room.setPlayerVisibility === 'function') {
            room.setPlayerVisibility(0, true);
            botHechoVisible = true;
            console.log('✅ Bot hecho visible usando setPlayerVisibility');
        } else {
            // Método alternativo: recrear el bot temporalmente como visible
            console.log('⚠️ setPlayerVisibility no disponible, el bot ya debe estar configurado como visible');
        }
    } catch (error) {
        console.log('⚠️ Error al hacer visible al bot:', error.message);
    }
    
    // Pequeña demora para que el cambio de visibilidad se registre
    setTimeout(() => {
        // Obtener el bot (ahora debería ser visible)
        const bot = room.getPlayerList().find(p => p.name === "BOT OFICIAL LNB" || p.id === 0);
        if (!bot) {
            console.log('⚠️ No se pudo encontrar al bot para intercambio automático');
            anunciarError('❌ Bot no encontrado para intercambio automático');
            // Fallback: mostrar comandos manuales
            anunciarInfo('💡 Ejecuta manualmente:');
            anunciarInfo(`🔴 ${comandoRojo}`);
            anunciarInfo(`🔵 ${comandoAzul}`);
            return;
        }
    
        const equipoOriginalBot = bot.team;
        console.log(`🤖 Posición original del bot: equipo ${equipoOriginalBot}`);
        
        try {
            // PASO 1: Aplicar colores al equipo rojo
            console.log('🎨 Paso 1: Aplicando colores al equipo rojo...');
            room.setPlayerTeam(0, 1); // Mover bot al equipo rojo
            
            // Esperar un poco para que el movimiento se registre
            setTimeout(() => {
                try {
                    procesarComandoColoresDirecto(comandoRojo);
                    console.log('✅ Colores aplicados al equipo rojo exitosamente');
                    
                    // PASO 2: Aplicar colores al equipo azul
                    setTimeout(() => {
                        console.log('🎨 Paso 2: Aplicando colores al equipo azul...');
                        room.setPlayerTeam(0, 2); // Mover bot al equipo azul
                        
                        setTimeout(() => {
                            try {
                                procesarComandoColoresDirecto(comandoAzul);
                                console.log('✅ Colores aplicados al equipo azul exitosamente');
                                
                                // PASO 3: Regresar bot a posición original y ocultarlo nuevamente
                                setTimeout(() => {
                                    room.setPlayerTeam(0, equipoOriginalBot);
                                    
                                    // NUEVA FUNCIONALIDAD: Ocultar bot nuevamente después del intercambio
                                    setTimeout(() => {
                                        try {
                                            if (typeof room.setPlayerVisibility === 'function' && botHechoVisible) {
                                                room.setPlayerVisibility(0, false);
                                                console.log('🤖 Bot ocultado nuevamente después del intercambio');
                                            }
                                        } catch (error) {
                                            console.log('⚠️ Error al ocultar bot:', error.message);
                                        }
                                    }, 500);
                                    
                                    anunciarExito('🎨 ¡Intercambio automático de camisetas completado!');
                                    console.log('✅ Intercambio automático de camisetas completado exitosamente');
                                }, 500);
                                
                            } catch (error) {
                                console.log('⚠️ Error al aplicar colores azules:', error.message);
                                anunciarInfo(`🔵 Ejecuta manualmente: ${comandoAzul}`);
                                // Regresar bot de todas formas
                                setTimeout(() => room.setPlayerTeam(0, equipoOriginalBot), 500);
                            }
                        }, 800);
                    }, 1000);
                    
                } catch (error) {
                    console.log('⚠️ Error al aplicar colores rojos:', error.message);
                    anunciarInfo(`🔴 Ejecuta manualmente: ${comandoRojo}`);
                    // Regresar bot de todas formas
                    setTimeout(() => room.setPlayerTeam(0, equipoOriginalBot), 500);
                }
            }, 800);
            
        } catch (error) {
            console.log('❌ Error en intercambio automático:', error.message);
            anunciarError('❌ Error en el intercambio automático');
        }
    }, 100);
}

// Nueva función para ejecutar cambio de colores moviendo el bot entre equipos (OPTIMIZADA)
function ejecutarCambioColoresPorMovimiento(comandoRojo, comandoAzul) {
    console.log('🤖 Iniciando secuencia optimizada de intercambio automático de colores');
    
    // Obtener el bot
    const bot = room.getPlayerList().find(p => p.name === "BOT OFICIAL LNB" || p.id === 0);
    if (!bot) {
        console.log('⚠️ No se pudo encontrar al bot');
        anunciarError('❌ Error: Bot no encontrado para intercambio automático');
        // Fallback: mostrar comandos manuales
        anunciarInfo('💡 Ejecuta manualmente:');
        anunciarInfo(`🔴 ${comandoRojo}`);
        anunciarInfo(`🔵 ${comandoAzul}`);
        return;
    }
    
    const equipoOriginalBot = bot.team;
    console.log(`🤖 Posición original del bot: equipo ${equipoOriginalBot}`);
    
    // Guardar los comandos de camisetas para uso futuro
    camisetasDefinidas.rojo = comandoRojo;
    camisetasDefinidas.azul = comandoAzul;
    
    // Secuencia optimizada con mejores validaciones
    
    // Paso 1: Aplicar colores al equipo rojo
    setTimeout(() => {
        console.log('🎨 Paso 1: Aplicando colores al equipo rojo...');
        
        try {
            // Mover bot al equipo rojo
            room.setPlayerTeam(0, 1);
            
            // Aplicar colores después de confirmar el movimiento
            setTimeout(() => {
                try {
                    procesarComandoColoresDirecto(comandoRojo);
                    console.log('✅ Colores aplicados al equipo rojo');
                    
                    // Continuar con equipo azul inmediatamente
                    continuarConEquipoAzul();
                    
                } catch (error) {
                    console.log('⚠️ Error al aplicar colores rojos:', error.message);
                    anunciarInfo(`🔴 Ejecuta manualmente: ${comandoRojo}`);
                    continuarConEquipoAzul(); // Continuar de todas formas
                }
            }, 800);
            
        } catch (error) {
            console.log('⚠️ Error al mover bot al equipo rojo:', error.message);
            anunciarError('❌ Error al mover el bot');
        }
    }, 300);
    
    // Función para continuar con el equipo azul
    function continuarConEquipoAzul() {
        setTimeout(() => {
            console.log('🎨 Paso 2: Aplicando colores al equipo azul...');
            
            try {
                // Mover bot al equipo azul
                room.setPlayerTeam(0, 2);
                
                // Aplicar colores después de confirmar el movimiento
                setTimeout(() => {
                    try {
                        procesarComandoColoresDirecto(comandoAzul);
                        console.log('✅ Colores aplicados al equipo azul');
                        
                    } catch (error) {
                        console.log('⚠️ Error al aplicar colores azules:', error.message);
                        anunciarInfo(`🔵 Ejecuta manualmente: ${comandoAzul}`);
                    }
                    
                    // Finalizar secuencia
                    finalizarSecuencia();
                    
                }, 800);
                
            } catch (error) {
                console.log('⚠️ Error al mover bot al equipo azul:', error.message);
                finalizarSecuencia(); // Finalizar de todas formas
            }
        }, 1000);
    }
    
    // Función para finalizar la secuencia
    function finalizarSecuencia() {
        setTimeout(() => {
            try {
                room.setPlayerTeam(0, equipoOriginalBot);
                anunciarExito('🎨 ¡Intercambio automático de camisetas completado!');
                console.log('✅ Secuencia de intercambio completada exitosamente');
            } catch (error) {
                console.log('⚠️ Error al regresar bot:', error.message);
            }
        }, 800);
    }
}

// Función para procesar comandos de colores directamente
function procesarComandoColoresDirecto(comando) {
    console.log('🎨 Procesando comando de colores:', comando);
    
    // Parsear el comando /colors
    const partes = comando.trim().split(' ');
    
    // Soportar tanto formato de 5 parámetros como 7 parámetros
    if ((partes.length >= 5 && partes.length <= 7) && partes[0] === '/colors') {
        const equipo = partes[1].toLowerCase(); // 'red' o 'blue'
        
        let color1, color2, color3;
        
        if (partes.length === 7) {
            // Formato: /colors red 0 FFFFFF 043B00 000000 043B00
            // Parámetros: [/colors, red, 0, FFFFFF, 043B00, 000000, 043B00]
            // Usamos los colores en posiciones 3, 4, 5
            color1 = partes[3];
            color2 = partes[4];
            color3 = partes[5];
        } else {
            // Formato tradicional: /colors red FFFFFF 043B00 000000
            // Parámetros: [/colors, red, FFFFFF, 043B00, 000000]
            color1 = partes[2];
            color2 = partes[3];
            color3 = partes[4];
        }
        
        // Validar que sean colores hexadecimales válidos
        const esHexValido = (hex) => /^[0-9a-fA-F]{6}$/.test(hex);
        
        if (esHexValido(color1) && esHexValido(color2) && esHexValido(color3)) {
            // Convertir hex a números
            const colorNum1 = parseInt(color1, 16);
            const colorNum2 = parseInt(color2, 16);
            const colorNum3 = parseInt(color3, 16);
            
            const equipoNum = equipo === 'red' ? 1 : 2;
            
            console.log(`🎨 Aplicando colores al equipo ${equipo}: ${color1}, ${color2}, ${color3}`);
            console.log(`🎨 Números de colores: [${colorNum1}, ${colorNum2}, ${colorNum3}]`);
            
            // Verificar disponibilidad de setTeamColors
            if (typeof room.setTeamColors === 'function') {
                try {
                    // Aplicar colores al equipo específico
                    room.setTeamColors(equipoNum, 0, 0xFFFFFF, [colorNum1, colorNum2, colorNum3]);
                    console.log(`✅ Colores aplicados exitosamente al equipo ${equipo} (${equipoNum})`);
                    
                    // Verificar que los colores se aplicaron correctamente
                    setTimeout(() => {
                        try {
                            const coloresActuales = room.getTeamColors(equipoNum);
                            console.log(`🔍 Verificación: colores actuales del equipo ${equipo}:`, coloresActuales);
                        } catch (e) {
                            console.log('⚠️ No se pudo verificar los colores aplicados');
                        }
                    }, 100);
                    
                    return true;
                } catch (error) {
                    console.log(`❌ Error al aplicar colores con setTeamColors: ${error.message}`);
                    throw error;
                }
            } else {
                console.log('⚠️ setTeamColors no disponible en este entorno');
                throw new Error('setTeamColors no disponible');
            }
        } else {
            console.log('⚠️ Colores hexadecimales inválidos:', [color1, color2, color3]);
            throw new Error('Colores hexadecimales inválidos');
        }
    } else {
        console.log('⚠️ Formato de comando inválido. Esperado: /colors [red|blue] [parámetros...]');
        console.log('⚠️ Comando recibido:', comando);
        console.log('⚠️ Partes parseadas:', partes);
        throw new Error('Formato de comando inválido');
    }
}

// Nueva función para el fallback de intercambio de camisetas
function ejecutarIntercambioDirecto(comandoRojo, comandoAzul) {
    console.log('🔄 Ejecutando fallback de intercambio directo de camisetas...');
    let exito = true;
    try {
        console.log(`🎨 Aplicando (fallback): ${comandoRojo}`);
        procesarComandoColoresDirecto(comandoRojo);
    } catch (error) {
        console.log(`❌ Error en fallback aplicando a Rojo: ${error.message}`);
        anunciarError('❌ Error en fallback para equipo Rojo.');
        exito = false;
    }
    try {
        console.log(`🎨 Aplicando (fallback): ${comandoAzul}`);
        procesarComandoColoresDirecto(comandoAzul);
    } catch (error) {
        console.log(`❌ Error en fallback aplicando a Azul: ${error.message}`);
        anunciarError('❌ Error en fallback para equipo Azul.');
        exito = false;
    }
    
    if (exito) {
        console.log('✅ Fallback de intercambio directo completado.');
        anunciarExito('🎨 ¡Camisetas intercambiadas usando método alternativo!');
    } else {
        anunciarInfo('💡 Si las camisetas no se actualizaron, los capitanes pueden usar /colors manualmente.');
    }
    return exito;
}

// Función para detectar y guardar colores personalizados cuando se usa /colors
function detectarYGuardarColores(jugador, comando) {
    try {
        console.log(`🎨 Detectando comando de colores de ${jugador.name}: ${comando}`);
        
        // Parsear el comando /colors
        const partes = comando.trim().split(' ');
        console.log(`🔍 DEBUG: Partes del comando parseado:`, partes);
        console.log(`🔍 DEBUG: Longitud del array:`, partes.length);
        
        // Mejorar validación para soportar más formatos
        if (partes.length >= 5 && partes[0] === '/colors') {
            const equipo = partes[1].toLowerCase(); // 'red' o 'blue'
            console.log(`🔍 DEBUG: Equipo detectado: ${equipo}`);
            
            let color1, color2, color3;
            
            if (partes.length === 7) {
                // Formato: /colors red 0 FFFFFF 043B00 000000 043B00
                // Parámetros: [/colors, red, 0, FFFFFF, 043B00, 000000, 043B00]
                // Usamos los colores en posiciones 3, 4, 6 (saltamos el 5 que parece ser repetido)
                color1 = partes[3];
                color2 = partes[4];
                color3 = partes[6];
                console.log(`🔍 DEBUG: Formato de 7 parámetros detectado`);
            } else if (partes.length === 6) {
                // Formato: /colors red 0 FFFFFF 043B00 000000
                // Parámetros: [/colors, red, 0, FFFFFF, 043B00, 000000]
                // Usamos los colores en posiciones 3, 4, 5
                color1 = partes[3];
                color2 = partes[4];
                color3 = partes[5];
                console.log(`🔍 DEBUG: Formato de 6 parámetros detectado`);
            } else {
                // Formato tradicional: /colors red FFFFFF 043B00 000000
                // Parámetros: [/colors, red, FFFFFF, 043B00, 000000]
                color1 = partes[2];
                color2 = partes[3];
                color3 = partes[4];
                console.log(`🔍 DEBUG: Formato tradicional de 5 parámetros detectado`);
            }
            
            console.log(`🔍 DEBUG: Colores extraídos: ${color1}, ${color2}, ${color3}`);
            
            // Limpiar posibles caracteres no deseados y normalizar
            if (color1) color1 = color1.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
            if (color2) color2 = color2.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
            if (color3) color3 = color3.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
            
            console.log(`🔍 DEBUG: Colores después de limpiar: ${color1}, ${color2}, ${color3}`);
            
            // Validar que sean colores hexadecimales válidos (pueden ser de 3 o 6 caracteres)
            const esHexValido = (hex) => {
                if (!hex) return false;
                // Aceptar hex de 3 caracteres (ej: FF0, A0B) o 6 caracteres (FF0000, A0B1C2)
                if (hex.length === 3) {
                    // Expandir hex de 3 a 6 caracteres: F0A -> FF00AA
                    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
                }
                return /^[0-9A-F]{6}$/.test(hex);
            };
            
            // Función para expandir hex corto a completo
            const expandirHex = (hex) => {
                if (!hex) return "000000";
                if (hex.length === 3) {
                    return hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
                }
                return hex.padEnd(6, '0'); // Completar con ceros si es necesario
            };
            
            console.log(`🔍 DEBUG: Validando colores hex...`);
            console.log(`🔍 DEBUG: Color1 válido: ${esHexValido(color1)}`);
            console.log(`🔍 DEBUG: Color2 válido: ${esHexValido(color2)}`);
            console.log(`🔍 DEBUG: Color3 válido: ${esHexValido(color3)}`);
            
            if (esHexValido(color1) && esHexValido(color2) && esHexValido(color3)) {
                // Expandir colores hex si es necesario
                color1 = expandirHex(color1);
                color2 = expandirHex(color2);
                color3 = expandirHex(color3);
                
                console.log(`🔍 DEBUG: Colores finales: ${color1}, ${color2}, ${color3}`);
                
                // Convertir hex a números
                const colorNum1 = parseInt(color1, 16);
                const colorNum2 = parseInt(color2, 16);
                const colorNum3 = parseInt(color3, 16);
                
                console.log(`🔍 DEBUG: Colores como números: ${colorNum1}, ${colorNum2}, ${colorNum3}`);
                
                // Guardar colores personalizados para uso en !swap
                const coloresPersonalizadosData = {
                    comando: comando,
                    colores: [colorNum1, colorNum2, colorNum3],
                    hex: [color1, color2, color3],
                    jugador: jugador.name,
                    timestamp: new Date().toISOString()
                };
                
                // Validar el equipo con más flexibilidad
                if (equipo === 'red' || equipo === 'rojo' || equipo === 'r') {
                    coloresPersonalizados.rojo = coloresPersonalizadosData;
                    console.log(`🔴 ✅ Colores personalizados guardados para equipo rojo:`, coloresPersonalizadosData);
                    
                    // Anunciar al jugador que se guardaron
                    setTimeout(() => {
                        room.sendAnnouncement(`🔴 ✅ Colores guardados para equipo rojo`, jugador.id, parseInt('FF0000', 16), "normal", 1);
                        room.sendAnnouncement(`🎨 Listos para intercambio con !swap`, jugador.id, parseInt('00FF00', 16), "normal", 1);
                    }, 500);
                    
                } else if (equipo === 'blue' || equipo === 'azul' || equipo === 'b') {
                    coloresPersonalizados.azul = coloresPersonalizadosData;
                    console.log(`🔵 ✅ Colores personalizados guardados para equipo azul:`, coloresPersonalizadosData);
                    
                    // Anunciar al jugador que se guardaron
                    setTimeout(() => {
                        room.sendAnnouncement(`🔵 ✅ Colores guardados para equipo azul`, jugador.id, parseInt('0000FF', 16), "normal", 1);
                        room.sendAnnouncement(`🎨 Listos para intercambio con !swap`, jugador.id, parseInt('00FF00', 16), "normal", 1);
                    }, 500);
                } else {
                    console.log(`❌ Equipo no reconocido: ${equipo}`);
                    room.sendAnnouncement(`❌ Equipo no válido: "${equipo}". Usa 'red' o 'blue'`, jugador.id, parseInt('FF0000', 16), "normal", 1);
                    return;
                }
                
                console.log(`✅ Colores personalizados detectados y guardados exitosamente para equipo ${equipo}`);
                
                // Mostrar estado actual de ambos equipos
                console.log(`🎨 ESTADO ACTUAL DE COLORES PERSONALIZADOS:`);
                console.log(`   🔴 Rojo:`, coloresPersonalizados.rojo ? 'GUARDADO' : 'NO DETECTADO');
                console.log(`   🔵 Azul:`, coloresPersonalizados.azul ? 'GUARDADO' : 'NO DETECTADO');
                
                // Si ambos equipos tienen colores, avisar que están listos para swap
                if (coloresPersonalizados.rojo && coloresPersonalizados.azul) {
                    setTimeout(() => {
                        room.sendAnnouncement(`🎨 ✅ ¡Ambos equipos tienen colores guardados!`, null, parseInt('00FF00', 16), "bold", 2);
                        room.sendAnnouncement(`🔄 Ya puedes usar !swap para intercambiar`, null, parseInt('00FF00', 16), "normal", 1);
                    }, 1000);
                }
                
            } else {
                console.log('⚠️ Colores hexadecimales inválidos en comando /colors');
                console.log(`⚠️ Colores recibidos: ${color1}, ${color2}, ${color3}`);
                room.sendAnnouncement(`❌ Colores hexadecimales inválidos: ${color1}, ${color2}, ${color3}`, jugador.id, parseInt('FF0000', 16), "normal", 1);
                room.sendAnnouncement(`💡 Ejemplo: /colors red FF0000 FFFFFF 000000`, jugador.id, parseInt('FFFF00', 16), "normal", 1);
            }
        } else {
            console.log('⚠️ Formato de comando /colors inválido');
            console.log(`⚠️ Comando recibido: ${comando}`);
            console.log(`⚠️ Partes: ${partes.length} elementos:`, partes);
            room.sendAnnouncement(`❌ Formato inválido. Uso: /colors [red|blue] [color1] [color2] [color3]`, jugador.id, parseInt('FF0000', 16), "normal", 1);
            room.sendAnnouncement(`💡 Ejemplo: /colors red FF0000 FFFFFF 000000`, jugador.id, parseInt('FFFF00', 16), "normal", 1);
        }
    } catch (error) {
        console.log('⚠️ Error al detectar colores personalizados:', error.message);
        console.log('⚠️ Stack:', error.stack);
        room.sendAnnouncement(`❌ Error al procesar comando de colores`, jugador.id, parseInt('FF0000', 16), "normal", 1);
    }
}

// Nueva función para procesar comandos de colores internamente
function procesarComandoColores(jugador, comando) {
    try {
        // Parsear el comando /colors
        const partes = comando.trim().split(' ');
        
        if (partes.length >= 5 && partes[0] === '/colors') {
            const equipo = partes[1].toLowerCase(); // 'red' o 'blue'
            const color1 = partes[2];
            const color2 = partes[3];
            const color3 = partes[4];
            
            // Validar que sean colores hexadecimales válidos
            const esHexValido = (hex) => /^[0-9a-fA-F]{6}$/.test(hex);
            
            if (esHexValido(color1) && esHexValido(color2) && esHexValido(color3)) {
                // Convertir hex a números
                const colorNum1 = parseInt(color1, 16);
                const colorNum2 = parseInt(color2, 16);
                const colorNum3 = parseInt(color3, 16);
                
                const equipoNum = equipo === 'red' ? 1 : 2;
                
                console.log(`🎨 Aplicando colores al equipo ${equipo}: ${color1}, ${color2}, ${color3}`);
                
                // Intentar aplicar colores usando setTeamColors
                if (typeof room.setTeamColors === 'function') {
                    room.setTeamColors(equipoNum, 0, 0xFFFFFF, [colorNum1, colorNum2, colorNum3]);
                    console.log(`✅ Colores aplicados exitosamente al equipo ${equipo}`);
                } else {
                    console.log('⚠️ setTeamColors no disponible, colores no aplicados');
                    throw new Error('setTeamColors no disponible');
                }
                
                // Verificar si setTeamColors se aplicó correctamente
                setTimeout(() => {
                    try {
                        const coloresVerificados = room.getTeamColors(equipoNum);
                        console.log(`🔍 Verificación: colores actuales aplicado al equipo ${equipo}:`, coloresVerificados);
                    } catch (e) {
                        console.log('⚠️ No se pudo verificar los colores aplicados');
                    }
                }, 100);
            } else {
                console.log('⚠️ Colores hexadecimales inválidos');
                throw new Error('Colores hexadecimales inválidos');
            }
        } else {
            console.log('⚠️ Formato de comando inválido');
            throw new Error('Formato de comando inválido');
        }
    } catch (error) {
        console.log('⚠️ Error en procesarComandoColores:', error.message);
        throw error;
    }
}


// Función para definir nombre de equipo (compartida entre !team name y !name team)
function definirNombreEquipo(jugador, nombreEquipo) {
    // Verificar que el jugador sea capitán o admin
    if (!tienePermiso(jugador, "control_partido")) {
        anunciarError("❌ Solo capitanes y administradores pueden definir nombres de equipos", jugador.id);
        return;
    }
    
    // Verificar que el jugador esté en un equipo
    if (jugador.team === 0) {
        anunciarError("❌ Debes estar en un equipo para definir su nombre", jugador.id);
        return;
    }
    
    // Validar nombre del equipo
    if (nombreEquipo.length < 2 || nombreEquipo.length > 20) {
        anunciarError("❌ El nombre del equipo debe tener entre 2 y 20 caracteres", jugador.id);
        return;
    }
    
    // Verificar caracteres válidos (letras, números, espacios y algunos símbolos)
    if (!/^[a-zA-Z0-9\s._-]+$/.test(nombreEquipo)) {
        anunciarError("❌ El nombre solo puede contener letras, números, espacios, puntos, guiones y guiones bajos", jugador.id);
        return;
    }
    
    // NUEVA VALIDACIÓN: Verificar que el nombre esté en mayúsculas (abreviaciones de equipos)
    if (nombreEquipo !== nombreEquipo.toUpperCase()) {
        anunciarError("❌ Solo se aceptan abreviaciones de equipos en mayúsculas", jugador.id);
        return;
    }
    
    // NUEVA VALIDACIÓN: Verificar que el nombre no esté ya siendo usado por el otro equipo
    const nombreNormalizado = nombreEquipo.toLowerCase().trim();
    
    if (jugador.team === 1) {
        // El jugador está en equipo rojo, verificar que el nombre no sea igual al del equipo azul
        if (nombreEquipoAzul && nombreEquipoAzul.toLowerCase().trim() === nombreNormalizado) {
            anunciarError(`❌ El nombre "${nombreEquipo}" ya está siendo usado por el equipo azul`, jugador.id);
            anunciarError(`💡 Por favor elige un nombre diferente para tu equipo`, jugador.id);
            return;
        }
    } else if (jugador.team === 2) {
        // El jugador está en equipo azul, verificar que el nombre no sea igual al del equipo rojo
        if (nombreEquipoRojo && nombreEquipoRojo.toLowerCase().trim() === nombreNormalizado) {
            anunciarError(`❌ El nombre "${nombreEquipo}" ya está siendo usado por el equipo rojo`, jugador.id);
            anunciarError(`💡 Por favor elige un nombre diferente para tu equipo`, jugador.id);
            return;
        }
    }
    
    if (jugador.team === 1) {
        // Equipo rojo
        nombreEquipoRojo = nombreEquipo;
        anunciarOficial(`🔴 Equipo Rojo ahora se llama: ${nombreEquipo}`);
        console.log(`🔴 Nombre de equipo rojo definido: ${nombreEquipo} por ${jugador.name}`);
    } else if (jugador.team === 2) {
        // Equipo azul
        nombreEquipoAzul = nombreEquipo;
        anunciarOficial(`🔵 Equipo Azul ahora se llama: ${nombreEquipo}`);
        console.log(`🔵 Nombre de equipo azul definido: ${nombreEquipo} por ${jugador.name}`);
    }
    
    // Verificar si ambos equipos ya tienen nombres
    if (nombreEquipoRojo && nombreEquipoAzul) {
        equiposDefinidos = true;
        anunciarOficial(`✅ Ambos equipos definidos: ${nombreEquipoRojo} vs ${nombreEquipoAzul}`);
        anunciarOficial(`⚽ ¡Ya se puede iniciar el partido!`);
        
        // Reportar nombres de equipos definidos
        enviarReporteOficial(`🏷️ **EQUIPOS DEFINIDOS**\n\n🔴 **Equipo Rojo:** \`${nombreEquipoRojo}\`\n🔵 **Equipo Azul:** \`${nombreEquipoAzul}\`\n🛡️ **Definido por:** \`${jugador.name}\`\n⏰ **Hora:** \`${new Date().toLocaleString()}\``);
    } else {
        const equipoFaltante = !nombreEquipoRojo ? "Rojo" : "Azul";
        anunciarOficial(`⏳ Falta que el equipo ${equipoFaltante} defina su nombre con !team name [nombre] o !name team [nombre]`);
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL DE INTERCAMBIO CON CAMISETAS
// ═══════════════════════════════════════════════════════════════════════════════

function intercambiarEquiposConCamisetas() {
    console.log('🔄 === INICIANDO INTERCAMBIO (EQUIPOS + CAMISETAS) ===');

    const jugadores = room.getPlayerList().filter(p => p.id !== 0); // Excluir bot

    if (jugadores.filter(p => p.team !== 0).length === 0) {
        anunciarError("❌ No hay jugadores en equipos para intercambiar");
        return;
    }

    // Guardar nombres de equipos antes de intercambiarlos
    const nombreRojoOriginal = nombreEquipoRojo;
    const nombreAzulOriginal = nombreEquipoAzul;
    let nombresIntercambiados = false;
    let camisetasIntercambiadas = false;

    // Intentar capturar colores ANTES de cualquier cambio
    let coloresRojo, coloresAzul;
    let tieneColoresPersonalizados = false;
    
    // PRIORIDAD 1: Verificar si hay colores guardados desde comandos !camisetas o /colors
    if ((coloresPersonalizados.rojo && coloresPersonalizados.azul) || 
        (coloresAntesDeLSwap.rojo && coloresAntesDeLSwap.azul)) {
        
        console.log('✅ Usando colores guardados desde comandos de camisetas');
        
        // Usar colores guardados previamente
        if (coloresPersonalizados.rojo && coloresPersonalizados.azul) {
            coloresRojo = {
                angle: 0,
                textColor: 0xFFFFFF,
                colors: coloresPersonalizados.rojo.colores
            };
            coloresAzul = {
                angle: 0,
                textColor: 0xFFFFFF, 
                colors: coloresPersonalizados.azul.colores
            };
        } else {
            coloresRojo = coloresAntesDeLSwap.rojo;
            coloresAzul = coloresAntesDeLSwap.azul;
        }
        tieneColoresPersonalizados = true;
        console.log('🎨 Colores a intercambiar:', { rojo: coloresRojo, azul: coloresAzul });
        
    } else {
        // PRIORIDAD 2: Intentar obtener colores actuales con funciones nativas
        try {
            coloresRojo = room.getTeamColors(1);
            coloresAzul = room.getTeamColors(2);
            
            if (coloresRojo && coloresAzul && 
                coloresRojo.colors && coloresAzul.colors &&
                Array.isArray(coloresRojo.colors) && Array.isArray(coloresAzul.colors) &&
                coloresRojo.colors.length >= 3 && coloresAzul.colors.length >= 3) {
                
                tieneColoresPersonalizados = true;
                console.log('🎨 Colores capturados desde funciones nativas:', { rojo: coloresRojo, azul: coloresAzul });
            } else {
                throw new Error("Colores nativos inválidos o incompletos");
            }
        } catch (e) {
            console.log('⚠️ Error capturando colores nativos:', e.message);
            tieneColoresPersonalizados = false;
        }
    }

    // Si no se pueden capturar colores, hacer intercambio simple
    if (!tieneColoresPersonalizados) {
        anunciarInfo("⚠️ No se detectaron camisetas personalizadas para intercambiar");
        anunciarInfo("💡 El intercambio se realizará solo con jugadores");
        console.log('⚠️ Intercambio sin camisetas - no hay colores válidos');
        intercambiarSoloJugadores();
        return;
    }

    // 1. Intercambiar jugadores de equipos
    console.log('🔄 Intercambiando jugadores de equipos...');
    jugadores.forEach(jugador => {
        if (jugador.team === 1) {
            room.setPlayerTeam(jugador.id, 2);
        } else if (jugador.team === 2) {
            room.setPlayerTeam(jugador.id, 1);
        }
    });

    // 2. Intercambiar nombres de equipos si existen
    if (nombreRojoOriginal && nombreAzulOriginal) {
        nombreEquipoRojo = nombreAzulOriginal;
        nombreEquipoAzul = nombreRojoOriginal;
        nombresIntercambiados = true;
        console.log('🏷️ Nombres de equipos intercambiados.');
    }

    // 3. Intercambiar camisetas moviendo el bot
    anunciarInfo("🤖 Moviendo bot para intercambiar camisetas...");
    const bot = room.getPlayerList().find(p => p.id === 0);
    const equipoOriginalBot = bot ? bot.team : 0;

    // Secuencia de movimiento del bot para aplicar colores
    // Mover a Rojo para aplicar los colores de Azul
    room.setPlayerTeam(0, 1);

    setTimeout(() => {
        try {
            room.setTeamColors(1, coloresAzul.angle, coloresAzul.textColor, coloresAzul.colors);
            console.log('🎨 Colores del equipo azul aplicados al equipo rojo.');
        } catch (e) {
            console.log(`⚠️ Error al aplicar colores al equipo rojo: ${e.message}`);
        }

        // Mover a Azul para aplicar los colores de Rojo
        setTimeout(() => {
            room.setPlayerTeam(0, 2);

            setTimeout(() => {
                try {
                    room.setTeamColors(2, coloresRojo.angle, coloresRojo.textColor, coloresRojo.colors);
                    console.log('🎨 Colores del equipo rojo aplicados al equipo azul.');
                } catch (e) {
                    console.log(`⚠️ Error al aplicar colores al equipo azul: ${e.message}`);
                }

                // Devolver bot a su equipo original
                setTimeout(() => {
                    room.setPlayerTeam(0, equipoOriginalBot);
                    console.log('🤖 Bot devuelto a su posición original.');
                    anunciarExito("✅ ¡Intercambio de equipos y camisetas completado!");
                    if (nombresIntercambiados) {
                       anunciarOficial(`🏷️ Equipos: 🔴 ${nombreEquipoRojo} vs ${nombreEquipoAzul} 🔵`);
                    }
                }, 500);
            }, 500);
        }, 500);
    }, 500);
}

function intercambiarSoloJugadores() {
    console.log('🔄 Intercambiando solo jugadores...');
    const jugadores = room.getPlayerList().filter(p => p.id !== 0);
    let intercambiados = 0;
    jugadores.forEach(jugador => {
        if (jugador.team === 1) {
            room.setPlayerTeam(jugador.id, 2);
            intercambiados++;
        } else if (jugador.team === 2) {
            room.setPlayerTeam(jugador.id, 1);
            intercambiados++;
        }
    });
    if (intercambiados > 0) {
        anunciarExito(`✅ ${intercambiados} jugadores han sido intercambiados de equipo.`);
    } else {
        anunciarError("❌ No se intercambió ningún jugador.");
    }
}

function intercambiarEquiposSinCamisetas() {
    console.log('🔄 === INICIANDO INTERCAMBIO (SOLO JUGADORES) ===');

    const jugadores = room.getPlayerList().filter(p => p.id !== 0);
    let intercambiados = 0;

    if (jugadores.filter(p => p.team !== 0).length === 0) {
        anunciarError("❌ No hay jugadores en equipos para intercambiar");
        return;
    }

    const nombreRojoOriginal = nombreEquipoRojo;
    const nombreAzulOriginal = nombreEquipoAzul;
    let nombresIntercambiados = false;

    // 1. Intercambiar jugadores
    jugadores.forEach(jugador => {
        if (jugador.team === 1) {
            room.setPlayerTeam(jugador.id, 2);
            intercambiados++;
        } else if (jugador.team === 2) {
            room.setPlayerTeam(jugador.id, 1);
            intercambiados++;
        }
    });

    // 2. Intercambiar nombres de equipos
    if (nombreRojoOriginal && nombreAzulOriginal) {
        nombreEquipoRojo = nombreAzulOriginal;
        nombreEquipoAzul = nombreRojoOriginal;
        nombresIntercambiados = true;
        console.log('🏷️ Nombres de equipos intercambiados.');
    }

    // 3. Intercambiar CHAT de equipo para jugadores con chat individual
    const jugadoresEnChatDeEquipo = getJugadoresEnChatDeEquipo();
    let jugadoresIntercambiadosEnChat = 0;

    jugadores.forEach(jugadorAfectado => {
        const jugadorEnChat = jugadoresEnChatDeEquipo.find(j => j.id === jugadorAfectado.id);
        if (jugadorEnChat) {
            const equipoAnterior = jugadorEnChat.equipoChat === 1 ? "rojo" : "azul";
            const nuevoEquipo = jugadorEnChat.equipoChat === 1 ? 2 : 1;
            
            // Actualizar el estado del chat del jugador
            jugadorEnChat.equipoChat = nuevoEquipo;
            jugadoresIntercambiadosEnChat++;
            
            const nuevoEquipoNombre = nuevoEquipo === 1 ? "rojo" : "azul";
            const nuevoEquipoEmoji = nuevoEquipo === 1 ? "🔴" : "🔵";
            
            room.sendAnnouncement(`${nuevoEquipoEmoji} Tu chat de equipo cambió del equipo ${equipoAnterior} al equipo ${nuevoEquipoNombre}`, jugadorAfectado.id, hexToNumber(COLORES.INFO), "bold", 1);
            console.log(`📢 ${jugadorAfectado.name} cambió del chat ${equipoAnterior} al chat ${nuevoEquipoNombre}`);
        }
    });
    
    if (jugadoresIntercambiadosEnChat > 0) {
        console.log(`✅ ${jugadoresIntercambiadosEnChat} jugadores intercambiados en chat de equipo`);
    } else {
        console.log('ℹ️ No había jugadores incluidos en chat de equipo para intercambiar');
    }
    
    // === REPORTAR RESULTADO (SIN MENCIONAR CAMISETAS) ===
    if (intercambiados > 0) {
        let mensajeResultado = `🔄 ¡INTERCAMBIO COMPLETADO! (${intercambiados} jugadores)`;
        
        if (nombresIntercambiados) {
            anunciarOficial(mensajeResultado);
            anunciarOficial(`🏷️ Equipos: 🔴 ${nombreEquipoRojo} vs ${nombreEquipoAzul} 🔵`);
            console.log(`🔄 INTERCAMBIO COMPLETO: ${intercambiados} jugadores y nombres`);
        } else {
            anunciarOficial(mensajeResultado);
            anunciarInfo('🏷️ 💡 Define nombres: !team name [nombre]');
            console.log(`🔄 Intercambio básico: solo ${intercambiados} jugadores`);
        }
        
        // Nota sobre camisetas
        anunciarInfo('🎨 Las camisetas mantuvieron sus colores actuales');
        anunciarInfo('💡 Usa códigos de camisetas (!dd, !tbl, etc.) para cambiar colores');
    } else {
        anunciarError("❌ No se pudo realizar el intercambio - no hay jugadores en equipos");
    }
    
    console.log('🏁 === INTERCAMBIO SIMPLE FINALIZADO ===');
}


function generarReporteFirmasMultiples() {
    let firmasMultiplesEncontradas = 0;
    let reporte = "🚨 **REPORTE DE FIRMAS MÚLTIPLES**\n\n";
    
    for (const [auth, firmas] of firmasPorAuth) {
        if (firmas.length > 1) {
            firmasMultiplesEncontradas++;
            reporte += `🚨 **Auth ${firmasMultiplesEncontradas}:** ${auth}\n`;
            reporte += `**Total de firmas:** ${firmas.length}\n\n`;
            
            firmas.forEach((firma, index) => {
                const nombreInfo = firma.nombre ? `${firma.nombreSala} → ${firma.nombre}` : firma.nombreSala;
                reporte += `${index + 1}. **${nombreInfo}** (ID: ${firma.firmaID})\n`;
                reporte += `   Firmado: ${new Date(firma.timestamp).toLocaleString()}\n`;
            });
            reporte += "\n";
        }
    }
    
    if (firmasMultiplesEncontradas === 0) {
        reporte += "✅ **No se detectaron firmas múltiples en este partido**";
    } else {
        reporte += `⚠️ **Total de dispositivos con firmas múltiples:** ${firmasMultiplesEncontradas}`;
    }
    
    // Solo enviar si hay firmas múltiples o si es necesario para registro
    if (firmasMultiplesEncontradas > 0) {
        enviarReporteOficial(reporte);
        // anunciarOficial(`🚨 Detectadas ${firmasMultiplesEncontradas} firmas múltiples - Reporte enviado`);
    }
}

function mostrarFirmasMultiples(jugador) {
    let firmasMultiplesEncontradas = 0;
    
    anunciarInfo("🚨 === FIRMAS MÚLTIPLES DETECTADAS ===", jugador.id);
    
    for (const [auth, firmas] of firmasPorAuth) {
        if (firmas.length > 1) {
            firmasMultiplesEncontradas++;
            anunciarInfo(`🚨 Auth: ${auth} (${firmas.length} firmas)`, jugador.id);
            firmas.forEach((firma, index) => {
                const nombreInfo = firma.nombre ? `${firma.nombreSala} → ${firma.nombre}` : firma.nombreSala;
                anunciarInfo(`  ${index + 1}. ${nombreInfo} (ID: ${firma.firmaID})`, jugador.id);
                anunciarInfo(`     Firmado: ${new Date(firma.timestamp).toLocaleString()}`, jugador.id);
            });
            anunciarInfo("", jugador.id); // Línea en blanco
        }
    }
    
    if (firmasMultiplesEncontradas === 0) {
        anunciarInfo("✅ No se detectaron firmas múltiples", jugador.id);
    } else {
        anunciarInfo(`⚠️ Total de auths con firmas múltiples: ${firmasMultiplesEncontradas}`, jugador.id);
    }
}

// Función para mostrar ayuda por categorías
function mostrarAyudaCategoria(jugador, categoria) {
    const esAdminUsuario = esAdmin(jugador);
    
    switch (categoria) {
        case "firmas":
            anunciarInfo("🔐 === COMANDOS DE VERIFICACIÓN ===", jugador.id);
            anunciarInfo("  !firmo - Firmar automáticamente", jugador.id);
            
            if (esAdminUsuario) {
                anunciarInfo("  !verificar [jugador] - Requerir firma de un jugador", jugador.id);
                anunciarInfo("  !firmas - Ver todas las firmas registradas", jugador.id);
                anunciarInfo("  !firmas red - Ver firmas del equipo rojo", jugador.id);
                anunciarInfo("  !firmas blue - Ver firmas del equipo azul", jugador.id);
                anunciarInfo("  !multiples - Ver firmas múltiples detectadas", jugador.id);
            } else {
                anunciarInfo("  (Otros comandos requieren permisos de administrador)", jugador.id);
            }
            break;
            
        case "acciones":
            anunciarInfo("⚽ === CONTROL DE PARTIDO ===", jugador.id);
            
            if (esAdminUsuario) {
                anunciarInfo("  !pause - Pausar el partido", jugador.id);
                anunciarInfo("  !resume - Reanudar el partido", jugador.id);
                anunciarInfo("  !stop - Detener el partido", jugador.id);
                anunciarInfo("  !restart - Reiniciar el partido", jugador.id);
                anunciarInfo("  !rr - Reiniciar partido rápido", jugador.id);
                anunciarInfo("  !swap - Intercambiar equipos y camisetas", jugador.id);
            } else {
                anunciarInfo("  (Estos comandos requieren permisos de administrador)", jugador.id);
            }
            break;
            
        case "mod":
        case "moderacion":
            anunciarInfo("🛡️ === COMANDOS DE MODERACIÓN ===", jugador.id);
            
            if (esAdminUsuario) {
                anunciarInfo("  !kick [jugador] [motivo] - Expulsar jugador", jugador.id);
                anunciarInfo("  !ban [jugador] [motivo] - Banear jugador", jugador.id);
                anunciarInfo("  !mute [jugador] [segundos] [razón] - Silenciar jugador", jugador.id);
                anunciarInfo("  !unmute [jugador] - Quitar silencio", jugador.id);
                anunciarInfo("  !clear - Limpiar lista de baneados", jugador.id);
                anunciarInfo("  !oficial - Activar/desactivar modo oficial", jugador.id);
            } else {
                anunciarInfo("  (Estos comandos requieren permisos de administrador)", jugador.id);
            }
            break;
            
        case "config":
        case "configuracion":
            anunciarInfo("⚙️ === COMANDOS DE CONFIGURACIÓN ===", jugador.id);
            anunciarInfo("  !capitan [clave] - Obtener permisos de capitán", jugador.id);
            anunciarInfo("  !claim [clave] - Obtener permisos de capitán (alternativo)", jugador.id);
            anunciarInfo("  !team name [nombre] - Definir nombre del equipo", jugador.id);
            anunciarInfo("  !tname [nombre] - Alias para definir nombre del equipo", jugador.id);
            anunciarInfo("  !name team [nombre] - Definir nombre del equipo (alternativo)", jugador.id);
            
            if (esAdminUsuario) {
                anunciarInfo("  !mapa [nombre] - Cambiar mapa", jugador.id);
                anunciarInfo("  !biggerx3 o !3 - Cargar mapa Bigger x3", jugador.id);
                anunciarInfo("  !biggerx4 o !4 - Cargar mapa Bigger x4", jugador.id);
                anunciarInfo("  !biggerx7 o !7 - Cargar mapa Bigger x7", jugador.id);
                anunciarInfo("  !tr o !train o !training - Cargar mapa Training", jugador.id);
            } else {
                anunciarInfo("  (Comandos de mapas requieren permisos de administrador)", jugador.id);
            }
            break;
            
        case "chat":
            anunciarInfo("💬 === COMANDOS DE CHAT ===", jugador.id);
            anunciarInfo("  t [mensaje] - Mensaje solo a tu equipo", jugador.id);
            anunciarInfo("  @@nombre [mensaje] - Mensaje privado", jugador.id);
            anunciarInfo("  !onlyteams o !only - Filtrar mensajes (solo equipos, no espectadores)", jugador.id);
            anunciarInfo("", jugador.id);
            anunciarInfo("👥 INCLUSIÓN EN CHAT DE EQUIPO:", jugador.id);
            anunciarInfo("  !team add [nombre] o !tadd [nombre] - Incluir espectador en chat de equipo", jugador.id);
            anunciarInfo("  !team remove [nombre] o !tremove [nombre] - Remover jugador del chat de equipo", jugador.id);
            anunciarInfo("  !team leave o !tleave - Salir del chat de equipo (si eres espectador)", jugador.id);
            anunciarInfo("  💡 Solo jugadores en equipos pueden agregar espectadores", jugador.id);
            anunciarInfo("", jugador.id);
            anunciarInfo("🎨 COMANDOS DE COLORES:", jugador.id);
            anunciarInfo("  /colors [red/blue] [color1] [color2] [color3] - Cambiar colores", jugador.id);
            anunciarInfo("  Ejemplo: /colors red FF0000 FFFFFF 000000", jugador.id);
            anunciarInfo("  Ejemplo: /colors blue 0000FF FFFFFF FF0000", jugador.id);
            break;
            
        case "otros":
        case "utiles":
            anunciarInfo("🔧 === OTROS COMANDOS ÚTILES ===", jugador.id);
            anunciarInfo("  !help - Ver ayuda por categorías", jugador.id);
            anunciarInfo("  !ayuda - Ver ayuda general", jugador.id);
            anunciarInfo("  !nv o !bb - Salir voluntariamente de la sala", jugador.id);
            break;
            
        default:
            anunciarError("❌ Categoría no válida. Usa: firmas, acciones, mod, config, chat, otros", jugador.id);
            break;
    }
}

// Nueva función para mostrar ayuda general
function mostrarAyudaGeneral(jugador) {
    const mensaje = "ℹ️ AYUDA: !help firmas 🔐 | acciones ⚽ | mod 🛡️ | config ⚙️ – Usá uno para más info 💡";
    
    anunciarInfo(mensaje, jugador.id);
}

function mostrarAyuda(jugador) {
    anunciarInfo("🔵⚡ === COMANDOS BOT OFICIAL LNB === ⚡🔵", jugador.id);
    anunciarInfo("👤 JUGADORES:", jugador.id);
    anunciarInfo("  !firmo - Firmar automáticamente (RECOMENDADO)", jugador.id);
    anunciarInfo("  !ayuda - Mostrar esta ayuda", jugador.id);
    
    if (tienePermiso(jugador, "ver_firmas")) {
        anunciarInfo("🛡️ CAPITANES:", jugador.id);
        anunciarInfo("  !firmas - Ver todas las firmas registradas", jugador.id);
        anunciarInfo("  !firmas red - Ver firmas del equipo rojo", jugador.id);
        anunciarInfo("  !firmas blue - Ver firmas del equipo azul", jugador.id);
    }
    
    if (esAdmin(jugador)) {
        anunciarInfo("⭐ ADMINISTRADORES:", jugador.id);
        anunciarInfo("  !verificar [jugador] - Requerir firma", jugador.id);
        anunciarInfo("  !kick [jugador] [motivo] - Kickear jugador", jugador.id);
        anunciarInfo("  !ban [jugador] [motivo] - Banear jugador", jugador.id);
        anunciarInfo("  !mapa [nombre] - Cambiar mapa", jugador.id);
        anunciarInfo("  !multiples - Ver firmas múltiples detectadas", jugador.id);
    }
    
    anunciarInfo("🏆 Esta sala está en MODO OFICIAL permanente", jugador.id);
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE ESTADÍSTICAS
// ═══════════════════════════════════════════════════════════════════════════════

function registrarJugadorGlobal(nombre) {
    if (!estadisticasGlobales.jugadores[nombre]) {
        estadisticasGlobales.jugadores[nombre] = {
            nombre: nombre,
            partidos: 0,
            victorias: 0,
            derrotas: 0,
            goles: 0,
            asistencias: 0,
            autogoles: 0,
            mejorRachaGoles: 0,
            mejorRachaAsistencias: 0,
            hatTricks: 0,
            vallasInvictas: 0,
            tiempoJugado: 0,
            promedioGoles: 0,
            promedioAsistencias: 0,
            fechaPrimerPartido: new Date().toISOString(),
            fechaUltimoPartido: new Date().toISOString()
        };
    }
    return estadisticasGlobales.jugadores[nombre];
}

function actualizarEstadisticasGlobales(datosPartido) {
    if (!datosPartido.iniciado) return;
    
    const fechaActual = new Date().toISOString().split('T')[0];
    estadisticasGlobales.totalPartidos++;
    
    // Determinar equipos ganador y perdedor
    const equipoGanador = datosPartido.golesRed > datosPartido.golesBlue ? 1 : 
                         datosPartido.golesBlue > datosPartido.golesRed ? 2 : 0;
    
    // Actualizar estadísticas de cada jugador
    Object.values(datosPartido.jugadores).forEach(jugadorPartido => {
        const statsGlobal = registrarJugadorGlobal(jugadorPartido.nombre);
        
        // Estadísticas básicas
        statsGlobal.partidos++;
        statsGlobal.goles += jugadorPartido.goles;
        statsGlobal.asistencias += jugadorPartido.asistencias;
        statsGlobal.autogoles += jugadorPartido.autogoles;
        statsGlobal.tiempoJugado += datosPartido.duracion;
        statsGlobal.fechaUltimoPartido = new Date().toISOString();
        
        // Victorias/Derrotas
        if (equipoGanador !== 0) {
            if (jugadorPartido.equipo === equipoGanador) {
                statsGlobal.victorias++;
            } else {
                statsGlobal.derrotas++;
            }
        }
        
        // Hat-tricks
        if (jugadorPartido.goles >= 3) {
            statsGlobal.hatTricks++;
            estadisticasGlobales.records.hatTricks.push({
                jugador: jugadorPartido.nombre,
                goles: jugadorPartido.goles,
                fecha: fechaActual
            });
        }
        
        // Récords individuales del partido
        if (jugadorPartido.goles > estadisticasGlobales.records.mayorGoles.cantidad) {
            estadisticasGlobales.records.mayorGoles = {
                jugador: jugadorPartido.nombre,
                cantidad: jugadorPartido.goles,
                fecha: fechaActual
            };
        }
        
        if (jugadorPartido.asistencias > estadisticasGlobales.records.mayorAsistencias.cantidad) {
            estadisticasGlobales.records.mayorAsistencias = {
                jugador: jugadorPartido.nombre,
                cantidad: jugadorPartido.asistencias,
                fecha: fechaActual
            };
        }
        
        // Actualizar promedios
        statsGlobal.promedioGoles = (statsGlobal.goles / statsGlobal.partidos).toFixed(2);
        statsGlobal.promedioAsistencias = (statsGlobal.asistencias / statsGlobal.partidos).toFixed(2);
    });
    
    // Récords del partido
    if (datosPartido.duracion > estadisticasGlobales.records.partidoMasLargo.duracion) {
        estadisticasGlobales.records.partidoMasLargo = {
            duracion: datosPartido.duracion,
            fecha: fechaActual,
            equipos: `${datosPartido.golesRed}-${datosPartido.golesBlue}`
        };
    }
    
    const diferencia = Math.abs(datosPartido.golesRed - datosPartido.golesBlue);
    if (diferencia > estadisticasGlobales.records.goleadaMasGrande.diferencia) {
        estadisticasGlobales.records.goleadaMasGrande = {
            diferencia: diferencia,
            resultado: `${datosPartido.golesRed}-${datosPartido.golesBlue}`,
            fecha: fechaActual
        };
    }
}

function mostrarEstadisticasJugador(solicitante, nombreJugador) {
    const stats = estadisticasGlobales.jugadores[nombreJugador];
    
    if (!stats) {
        anunciarError(`❌ No se encontraron estadísticas para ${nombreJugador}`, solicitante.id);
        return;
    }
    
    const winRate = stats.partidos > 0 ? ((stats.victorias / stats.partidos) * 100).toFixed(1) : "0.0";
    const horasJugadas = (stats.tiempoJugado / 3600).toFixed(1);
    const fechaPrimera = new Date(stats.fechaPrimerPartido).toLocaleDateString();
    const fechaUltima = new Date(stats.fechaUltimoPartido).toLocaleDateString();
    
    const lineas = [
        `📊 ESTADÍSTICAS DE ${nombreJugador.toUpperCase()}`,
        `🎮 Partidos: ${stats.partidos} | ⏱️ Tiempo: ${horasJugadas}h`,
        `🏆 V: ${stats.victorias} | 💔 D: ${stats.derrotas} | 📈 WR: ${winRate}%`,
        `⚽ Goles: ${stats.goles} (${stats.promedioGoles}/partido)`,
        `🎯 Asistencias: ${stats.asistencias} (${stats.promedioAsistencias}/partido)`,
        `😱 Autogoles: ${stats.autogoles} | 🎩 Hat-tricks: ${stats.hatTricks}`,
        `🛡️ Vallas invictas: ${stats.vallasInvictas}`,
        `📅 Primer partido: ${fechaPrimera}`,
        `📅 Último partido: ${fechaUltima}`
    ];
    
    lineas.forEach(linea => {
        anunciarInfo(linea, solicitante.id);
    });
}

function mostrarRecords(solicitante) {
    const records = estadisticasGlobales.records;
    
    // Verificar si hay datos
    if (estadisticasGlobales.totalPartidos === 0) {
        anunciarInfo("📊 No hay récords disponibles aún. ¡Juega algunos partidos!", solicitante.id);
        return;
    }
    
    // Top 5 goleadores históricos
    const topGoleadores = Object.values(estadisticasGlobales.jugadores)
        .sort((a, b) => b.goles - a.goles)
        .slice(0, 5);
    
    // Top 5 asistentes históricos
    const topAsistentes = Object.values(estadisticasGlobales.jugadores)
        .sort((a, b) => b.asistencias - a.asistencias)
        .slice(0, 5);
    
    // Top 5 por win rate (mínimo 10 partidos)
    const topWinRate = Object.values(estadisticasGlobales.jugadores)
        .filter(j => j.partidos >= 10)
        .sort((a, b) => (b.victorias/b.partidos) - (a.victorias/a.partidos))
        .slice(0, 5);
    
    const lineas = [
        `🏆 RÉCORDS HISTÓRICOS DE LA SALA`,
        `📊 Total de partidos: ${estadisticasGlobales.totalPartidos}`,
        ``,
        `🥇 RÉCORDS INDIVIDUALES:`,
        `⚽ Más goles en un partido: ${records.mayorGoles.jugador || "---"} (${records.mayorGoles.cantidad || 0}) - ${records.mayorGoles.fecha || "---"}`,
        `🎯 Más asistencias en un partido: ${records.mayorAsistencias.jugador || "---"} (${records.mayorAsistencias.cantidad || 0}) - ${records.mayorAsistencias.fecha || "---"}`,
        ``,
        `🏟️ RÉCORDS DE PARTIDOS:`,
        `⏱️ Partido más largo: ${Math.floor((records.partidoMasLargo.duracion || 0)/60)}:${((records.partidoMasLargo.duracion || 0)%60).toString().padStart(2,'0')} (${records.partidoMasLargo.equipos || "---"}) - ${records.partidoMasLargo.fecha || "---"}`,
        `💥 Mayor goleada: ${records.goleadaMasGrande.resultado || "---"} (dif: ${records.goleadaMasGrande.diferencia || 0}) - ${records.goleadaMasGrande.fecha || "---"}`,
        `🎩 Hat-tricks totales: ${records.hatTricks ? records.hatTricks.length : 0}`,
        ``,
        `👑 TOP 5 GOLEADORES HISTÓRICOS:`
    ];
    
    if (topGoleadores.length > 0) {
        topGoleadores.forEach((jugador, i) => {
            lineas.push(`${i+1}. ${jugador.nombre}: ${jugador.goles} goles (${jugador.promedioGoles}/partido)`);
        });
    } else {
        lineas.push("   No hay datos de goleadores aún");
    }
    
    lineas.push(``);
    lineas.push(`🎯 TOP 5 ASISTENTES HISTÓRICOS:`);
    
    if (topAsistentes.length > 0) {
        topAsistentes.forEach((jugador, i) => {
            lineas.push(`${i+1}. ${jugador.nombre}: ${jugador.asistencias} asistencias (${jugador.promedioAsistencias}/partido)`);
        });
    } else {
        lineas.push("   No hay datos de asistentes aún");
    }
    
    if (topWinRate.length > 0) {
        lineas.push(``);
        lineas.push(`📈 TOP 5 WIN RATE (mín. 10 partidos):`);
        
        topWinRate.forEach((jugador, i) => {
            const wr = ((jugador.victorias/jugador.partidos)*100).toFixed(1);
            lineas.push(`${i+1}. ${jugador.nombre}: ${wr}% (${jugador.victorias}/${jugador.partidos})`);
        });
    }
    
    lineas.forEach(linea => {
        room.sendAnnouncement(linea, solicitante.id, parseInt(COLORES.INFO, 16), "normal", 0);
    });
}

// Función para mostrar puntuación de jugador
function mostrarPuntuacionJugador(jugador) {
    const statsJugador = estadisticasPartido.jugadores[jugador.id];
    if (!statsJugador) {
        anunciarError("❌ No participaste en el partido actual", jugador.id);
        return;
    }
    
    const puntuacion = calcularPuntuacion(statsJugador);
    const equipoColor = statsJugador.equipo === 1 ? "🔴" : "🔵";
    
    // Determinar el mensaje según la puntuación
    let mensajeCalificacion = "";
    if (puntuacion >= 9) {
        mensajeCalificacion = "🌟 ¡EXCELENTE PARTIDO!";
    } else if (puntuacion >= 7) {
        mensajeCalificacion = "👏 ¡Muy buen partido!";
    } else if (puntuacion >= 5) {
        mensajeCalificacion = "👍 Buen partido";
    } else if (puntuacion >= 3) {
        mensajeCalificacion = "📈 Puedes mejorar";
    } else {
        mensajeCalificacion = "💪 ¡Sigue practicando!";
    }
    
    anunciarInfo(`🏆 TU RENDIMIENTO EN EL PARTIDO ACTUAL`, jugador.id);
    anunciarInfo(`📊 Puntuación: ${puntuacion}/10 ${mensajeCalificacion}`, jugador.id);
    anunciarInfo(`${equipoColor} ⚽ Goles: ${statsJugador.goles} | 🎯 Asistencias: ${statsJugador.asistencias} | 💀 Autogoles: ${statsJugador.autogoles}`, jugador.id);
    
    if (statsJugador.arquero) {
        anunciarInfo(`🥅 Fuiste arquero en este partido`, jugador.id);
    }
}

// Función para calcular puntuación de jugador
function calcularPuntuacion(jugador) {
    // Sistema simple de puntuación
    const golesPuntos = jugador.goles * 3;
    const asistenciasPuntos = jugador.asistencias * 2;
    const autogolesPuntos = jugador.autogoles * -2;
    
    let puntuacion = golesPuntos + asistenciasPuntos + autogolesPuntos;
    
    // Bonificación por victoria
    const equipoGanador = estadisticasPartido.golesRed > estadisticasPartido.golesBlue ? 1 : 
                         estadisticasPartido.golesBlue > estadisticasPartido.golesRed ? 2 : 0;
    
    if (equipoGanador !== 0 && jugador.equipo === equipoGanador) {
        puntuacion = Math.max(puntuacion, 5); // Mínimo 5 puntos por ganar
    }
    
    // Limitar entre 1 y 10
    return Math.max(1, Math.min(Math.round(puntuacion), 10));
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENTOS DE HAXBALL
// ═══════════════════════════════════════════════════════════════════════════════

function configurarEventos() {
    // Evento: Jugador entra a la sala
    room.onPlayerJoin = function(jugador) {
        // Capturar datos completos del jugador incluyendo AUTH y CONN - REPLICANDO BOT ORIGINAL
        const datosJugador = {
            name: jugador.name,
            id: jugador.id,
            auth: jugador.auth || "SIN_AUTH",
            conn: jugador.conn || "SIN_CONN",
            team: jugador.team || 0,
            timestamp: new Date().toISOString()
        };
        
        // ALMACENAR DATOS COMPLETOS DEL JUGADOR EN MAP PARA ACCESO POSTERIOR
        datosJugadores.set(jugador.id, datosJugador);
        
        console.log(`👤 ${datosJugador.name} entró a la sala (ID: ${datosJugador.id}, AUTH: ${datosJugador.auth}, CONN: ${datosJugador.conn})`);
        console.log(`💾 Datos del jugador almacenados en datosJugadores Map:`, datosJugador);
        
        // NUEVA FUNCIÓN: Enviar datos de login igual que el bot original
        enviarDatosLogin(datosJugador.name, datosJugador.id, datosJugador.conn, datosJugador.auth);
        
        // DETECTAR AL BOT AUTOMÁTICAMENTE cuando entra
        if (jugador.name === "BOT OFICIAL LNB" || jugador.id === 0) {
            botId = jugador.id;
            console.log(`🤖 Bot detectado automáticamente: ${jugador.name} (ID: ${botId})`);
        }
        
        // Verificar si es admin oficial
        if (jugador.auth && ADMINS_OFICIALES[jugador.auth]) {
            const adminInfo = ADMINS_OFICIALES[jugador.auth];
            jugadoresConRoles.set(jugador.id, {
                role: adminInfo.role,
                assignedBy: "SISTEMA",
                timestamp: new Date().toISOString()
            });
            
            const rol = ROLES[adminInfo.role];
            anunciarOficial(`🔰 ${jugador.name} identificado como ${rol.nombre}`);
            console.log(`🔰 Admin oficial detectado: ${jugador.name} (${adminInfo.role})`);
        }
        
        // Mensaje de bienvenida centrado y llamativo (igual a bot_lnb1.js)
        const mensajeBienvenida = `🔵⚡ ¡BIENVENIDO ${jugador.name.toUpperCase()} A LA LIGA NACIONAL DE BIGGER LNB! ⚡🔵`;
        anunciarGeneral(mensajeBienvenida, "FFD700", "bold");
        
        // Mensajes de bienvenida (iguales a bot_lnb1.js)
        room.sendAnnouncement("📸 ¡LNB ahora tiene TikTok! Seguinos en https://www.tiktok.com/@lnbhaxball y mandanos tus clips para compartir.", jugador.id, parseInt(COLORES.SECUNDARIO, 16), "bold", 0);
        room.sendAnnouncement("🎶 ¡LNB ahora tiene Instagram! Seguinos en https://www.instagram.com/lnbhaxball/ y mandanos tus clips para compartir.", jugador.id, parseInt(COLORES.SECUNDARIO, 16), "bold", 0);
        room.sendAnnouncement("📹 ¡LNB ahora tiene Youtube! Seguinos en https://youtube.com/liganacionaldebigger", jugador.id, parseInt(COLORES.SECUNDARIO, 16), "bold", 0);
        room.sendAnnouncement("📹 ¡LNB ahora tiene Twich! Seguinos en https://twitch.tv/liganacionalbigger", jugador.id, parseInt(COLORES.SECUNDARIO, 16), "bold", 0);
        room.sendAnnouncement("━━━━━━━━━━━━━┓ LNB 🔥 Discord: 'discord.gg/nJRhZXRNCA' ┏━━━━━━━━━━━━━", jugador.id, parseInt(COLORES.SECUNDARIO, 16), "bold", 0);
        room.sendAnnouncement("Script by ИФT", jugador.id, parseInt(COLORES.SECUNDARIO, 16), "bold", 0);
        room.sendAnnouncement("ℹ️ 🔵 Usa !ayuda para ver los comandos disponibles", jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
        
        // Mensaje específico sobre el modo actual de la sala - PRIVADO PARA CADA JUGADOR
        setTimeout(() => {
            if (modoOficial) {
                // Si hay firmas requeridas activas, informar
                if (firmasRequeridas.size > 0 || firmasRecibidas.size > 0) {
                    room.sendAnnouncement("ℹ️ 🖊️ Se requieren firmas para este partido", jugador.id, hexToNumber(COLORES.OFICIAL), "normal", 1);
                }
                room.sendAnnouncement("ℹ️ 🏆 MODO OFICIAL ACTIVO - Usa !firmo para verificarte", jugador.id, hexToNumber(COLORES.OFICIAL), "normal", 1);
            } else {
                room.sendAnnouncement("ℹ️ 🎮 MODO AMISTOSO ACTIVO - Las firmas están deshabilitadas", jugador.id, hexToNumber(COLORES.INFO), "normal", 1);
                room.sendAnnouncement("ℹ️ 💡 Un admin puede activar el modo oficial con !oficial", jugador.id, hexToNumber(COLORES.INFO), "normal", 1);
            }
        }, 1000);
        
        // Mensaje proactivo sobre firmas solo en modo oficial - PRIVADO
        if (modoOficial) {
            setTimeout(() => {
                room.sendAnnouncement("ℹ️ 💡 FIRMA CUANDO QUIERAS CON: !firmo", jugador.id, hexToNumber(COLORES.OFICIAL), "normal", 1);
                room.sendAnnouncement("ℹ️ 🏆 No necesitas esperar al inicio del partido", jugador.id, hexToNumber(COLORES.OFICIAL), "normal", 1);
            }, 3000); // 3 segundos después de ingresar
            
            // Requerir firma automáticamente solo en modo oficial
            setTimeout(() => {
                // Verificar si el jugador sigue en la sala y no está verificado
                const jugadorActual = room.getPlayerList().find(p => p.id === jugador.id);
                if (jugadorActual && !jugadoresVerificados.has(jugador.id) && modoOficial) {
                    requerirFirma(jugadorActual, "Verificación automática para partido oficial");
                }
            }, 60000); // 60 segundos = 1 minuto
        }
        
        // Reportar entrada solo en modo oficial
        if (modoOficial) {
            enviarReporteOficial(`👤 **Jugador Ingresó**\n**Nombre:** ${jugador.name}\n**ID:** ${jugador.id}\n**Hora:** ${new Date().toLocaleString()}`);
        }
    };
    
    // Evento: Jugador sale de la sala
    room.onPlayerLeave = function(jugador) {
        console.log(`👤 ${jugador.name} salió de la sala`);
        
        // Limpiar datos del jugador
        firmasRequeridas.delete(jugador.id);
        jugadoresConRoles.delete(jugador.id);
        jugadoresVerificados.delete(jugador.id);
        
        // Eliminar al jugador de la lista de incluidos en chat de equipo si estaba ahí
        if (jugadoresIncluidosEnEquipo.has(jugador.id)) {
            const equipoAnterior = jugadoresIncluidosEnEquipo.get(jugador.id);
            const nombreEquipoAnterior = equipoAnterior === 1 ? "rojo" : "azul";
            jugadoresIncluidosEnEquipo.delete(jugador.id);
            console.log(`🗑️ Removido ${jugador.name} del chat del equipo ${nombreEquipoAnterior}`);
        }
        
        // Detener recordatorios de firma
        detenerRecordatorioFirma(jugador.id);
        
        // Reportar salida solo en modo oficial
        if (modoOficial) {
            enviarReporteOficial(`👋 **Jugador Salió**\n**Nombre:** ${jugador.name}\n**Hora:** ${new Date().toLocaleString()}`);
        }
    };
    
    // Evento: Mensaje en el chat
    room.onPlayerChat = function(jugador, mensaje) {
        console.log(`💬 ${jugador.name}: ${mensaje}`);
        
        // VERIFICAR SI EL JUGADOR ESTÁ SILENCIADO ANTES DE PROCESAR CUALQUIER MENSAJE
        if (jugadoresSilenciados.has(jugador.id)) {
            const datosJugadorSilenciado = jugadoresSilenciados.get(jugador.id);
            const tiempoRestante = Math.max(0, (datosJugadorSilenciado.tiempoInicio + datosJugadorSilenciado.duracionSegundos * 1000 - Date.now()) / 1000);
            
            if (tiempoRestante > 0) {
                // El jugador sigue silenciado - bloquear su mensaje completamente
                const minutos = Math.floor(tiempoRestante / 60);
                const segundos = Math.ceil(tiempoRestante % 60);
                const tiempoTexto = minutos > 0 ? `${minutos}m ${segundos}s` : `${segundos}s`;
                
                // MENSAJES PRIVADOS: Solo el jugador silenciado puede verlos
                room.sendAnnouncement(`🔇 No puedes enviar mensajes. Tiempo restante: ${tiempoTexto}`, jugador.id, hexToNumber(COLORES.ERROR), "bold", 2);
                room.sendAnnouncement(`ℹ️ Razón del silencio: ${datosJugadorSilenciado.razon}`, jugador.id, hexToNumber(COLORES.INFO), "normal", 1);
                
                console.log(`🔇 MENSAJE BLOQUEADO - ${jugador.name} intentó hablar mientras está silenciado: "${mensaje}"`);
                return false; // Bloquear completamente el mensaje
            } else {
                // El tiempo de silencio ya expiró, limpiar automáticamente
                desmutearJugadorAutomatico(jugador.id);
            }
        }
        
        // Procesar comandos
        if (mensaje.startsWith("!")) {
            procesarComando(jugador, mensaje);
            return false; // Evitar que se muestre el comando en el chat
        }
        
        // Procesar mensaje de equipo con "t " o "T "
        if (mensaje.startsWith("t ") || mensaje.startsWith("T ")) {
            const mensajeEquipo = mensaje.substring(2).trim();
            if (mensajeEquipo.length > 0) {
                // Si el jugador es espectador, enviar a chat de espectadores
                if (jugador.team === 0) {
                    enviarMensajeEspectadores(jugador, mensajeEquipo);
                } else {
                    // Si está en un equipo, enviar mensaje de equipo normal
                    enviarMensajeEquipo(jugador, mensajeEquipo);
                }
                return false; // Evitar que se muestre el mensaje original
            } else {
                const ayudaTexto = jugador.team === 0 ? 
                    "❌ Uso: t [mensaje] - Enviar mensaje a espectadores" : 
                    "❌ Uso: t [mensaje] o T [mensaje] - Enviar mensaje a tu equipo";
                anunciarError(ayudaTexto, jugador.id);
                return false;
            }
        }
        
        // Procesar mensaje privado con "@@"
        if (mensaje.startsWith("@@")) {
            const partes = mensaje.substring(2).trim().split(" ");
            if (partes.length >= 2) {
                const nombreDestino = partes[0];
                const mensajePrivado = partes.slice(1).join(" ").trim();
                if (mensajePrivado.length > 0) {
                    enviarMensajePrivado(jugador, nombreDestino, mensajePrivado);
                    return false; // Evitar que se muestre el mensaje original
                } else {
                    anunciarError("❌ Uso: @@nombre [mensaje] - Enviar mensaje privado", jugador.id);
                    return false;
                }
            } else {
                anunciarError("❌ Uso: @@nombre [mensaje] - Enviar mensaje privado", jugador.id);
                return false;
            }
        }
        
        // Detectar comandos /colors para guardar colores personalizados
        if (mensaje.startsWith("/colors ")) {
            console.log(`🎨 DETECTADO COMANDO /colors de ${jugador.name}: ${mensaje}`);
            detectarYGuardarColores(jugador, mensaje);
            
            // Mostrar estado actual de colores personalizados después de la detección
            setTimeout(() => {
                console.log(`🎨 ESTADO COLORES DESPUÉS DE DETECCIÓN:`);
                console.log(`   Rojo existe:`, coloresPersonalizados.rojo !== null);
                console.log(`   Azul existe:`, coloresPersonalizados.azul !== null);
                console.log(`   Rojo data:`, coloresPersonalizados.rojo);
                console.log(`   Azul data:`, coloresPersonalizados.azul);
            }, 1000);
        }
        
        // Verificar si el jugador es capitán y agregar prefijo
        const rolInfo = jugadoresConRoles.get(jugador.id);
        if (rolInfo && rolInfo.role === "CAPITAN") {
            // Aplicar filtro de mensajes con mismo color que todos pero con prefijo de capitán
            enviarMensajeConFiltro(jugador, `👑 ${jugador.name}: ${mensaje}`);
            return false; // Evitar que se muestre el mensaje original
        }
        
        // Aplicar filtro de mensajes para mensajes normales
        enviarMensajeConFiltro(jugador, `${jugador.name}: ${mensaje}`);
        return false; // Evitar que se muestre el mensaje original (ahora lo controlamos nosotros)
    };
    
    // Evento: Inicio del partido
    room.onGameStart = function(jugador) {
        console.log(`🏁 onGameStart activado - verificando restricciones...`);
        
        // VALIDACIÓN CRÍTICA 1: Verificar que el mapa es oficial
        if (mapaNoOficial) {
            console.log(`❌ BLOQUEO CRÍTICO: Mapa NO oficial detectado en onGameStart`);
            console.log(`❌ Estado del mapa: ${mapaActual}`);
            
            // Obtener información del mapa actual para diagnóstico (sin usar room.getStadium)
            let nombreMapaActual = "Mapa no oficial";
            if (mapaActual && mapaActual !== "no_oficial") {
                nombreMapaActual = mapaActual;
            }
            
            anunciarError(`❌ ERROR CRÍTICO: PARTIDO BLOQUEADO - Mapa NO oficial`);
            anunciarError(`📊 Mapa detectado: ${nombreMapaActual}`);
            
            const mapasValidos = Object.keys(mapasOficiales);
            anunciarError(`📋 Mapas oficiales permitidos: ${mapasValidos.map(m => mapasOficiales[m].nombre).join(", ")}`);
            anunciarError(`🚫 No se pueden iniciar partidos con mapas no oficiales`);
            anunciarOficial(`💡 Cambia a un mapa oficial usando: !mapa [nombre_mapa]`);
            
            // DETENER EL PARTIDO INMEDIATAMENTE - SIN DEMORA
            console.log(`🛑 Deteniendo partido inmediatamente por mapa no oficial`);
            room.stopGame();
            anunciarError(`🛑 Partido detenido automáticamente por seguridad`);
            
            return; // BLOQUEAR COMPLETAMENTE EL INICIO DEL PARTIDO
        }
        
        console.log(`✅ Mapa oficial validado: ${mapasOficiales[mapaActual].nombre}`);
        
        // VALIDACIÓN CRÍTICA 2: Verificar que ambos equipos hayan definido sus nombres
        if (!nombreEquipoRojo || !nombreEquipoAzul) {
            anunciarError("❌ No se puede iniciar el partido: Ambos equipos deben definir sus nombres primero");
            anunciarOficial("⚠️ Usa !team name [nombre] para que cada equipo defina su nombre");
            
            const equipoFaltante = !nombreEquipoRojo ? "Rojo" : (!nombreEquipoAzul ? "Azul" : "ambos");
            anunciarOficial(`⏳ Falta que el equipo ${equipoFaltante} defina su nombre`);
            
            // Detener el partido inmediatamente
            setTimeout(() => {
                room.stopGame();
            }, 100);
            return;
        }
        
        partidoEnCurso = true;
        tiempoInicioPartido = new Date();
        
        // Inicializar estadísticas y replay
        inicializarEstadisticas();
        estadisticasPartido.iniciado = true;
        
        // INICIALIZAR VARIABLES PARA TIEMPO REAL DE JUEGO
        estadisticasPartido.tiempoRealInicio = null; // Se establecerá con el primer toque
        estadisticasPartido.tiempoPausas = 0; // Tiempo acumulado en pausas
        estadisticasPartido.ultimaPausa = null; // Tiempo de inicio de pausa
        estadisticasPartido.juegoEnPausa = false; // Estado actual del juego
        
        // Activar sistema de datos de emergencia
        prepararDatosEmergencia();
        console.log('🛡️ Sistema de emergencia activado para el partido');
        
        // Inicializar grabación de replay TANTO PARA OFICIALES COMO AMISTOSOS (EXCEPTO TRAINING)
        if (mapaActual !== "training") {
            if (typeof room.startRecording === 'function') {
                try {
                    room.startRecording();
                    const tipoModo = modoOficial ? "oficial" : "amistoso";
                    anunciarInfo(`🎬 Grabación de replay iniciada (modo ${tipoModo})`);
                    console.log(`🎬 Grabación iniciada para partido ${tipoModo}`);
                } catch (error) {
                    console.log("❌ Error al iniciar grabación:", error);
                }
            }
        } else {
            console.log("🚫 No se graba replay en mapa de training (calentamiento)");
            anunciarInfo("ℹ️ Mapa de training - No se graba replay (calentamiento)");
        }
        
        if (modoOficial) {
            anunciarOficial("🏁 ¡PARTIDO OFICIAL INICIADO!");
            console.log("🏁 Partido oficial iniciado");
        } else {
            anunciarGeneral("🏁 ¡PARTIDO AMISTOSO INICIADO!", COLORES.INFO);
            console.log("🏁 Partido amistoso iniciado");
        }
        
    };
    
    // Evento: Fin del partido
    room.onGameStop = function(jugador) {
        if (!partidoEnCurso) return;
        
        partidoEnCurso = false;
        const tiempoFin = new Date();
        
        // CALCULAR DURACIÓN REAL DEL PARTIDO
        const scores = room.getScores();
        if (scores && scores.time) {
            // Usar el tiempo oficial del juego de HaxBall (tiempo real de juego)
            estadisticasPartido.duracion = Math.floor(scores.time);
            console.log(`⏱️ Duración real del partido: ${Math.floor(scores.time)} segundos (desde HaxBall)`);
        } else if (estadisticasPartido.tiempoRealInicio) {
            // Calcular tiempo real desde el primer toque hasta ahora, descontando pausas
            const tiempoTranscurrido = (tiempoFin - estadisticasPartido.tiempoRealInicio) / 1000;
            
            // Si el juego está en pausa al terminar, sumar el tiempo de pausa actual
            let tiempoPausasTotal = estadisticasPartido.tiempoPausas;
            if (estadisticasPartido.juegoEnPausa && estadisticasPartido.ultimaPausa) {
                tiempoPausasTotal += (tiempoFin - estadisticasPartido.ultimaPausa) / 1000;
            }
            
            estadisticasPartido.duracion = Math.floor(tiempoTranscurrido - tiempoPausasTotal);
            console.log(`⏱️ Duración calculada: ${estadisticasPartido.duracion}s (transcurrido: ${Math.floor(tiempoTranscurrido)}s - pausas: ${Math.floor(tiempoPausasTotal)}s)`);
        } else {
            // Fallback: usar diferencia de tiempo total (método anterior)
            const duracion = tiempoFin - tiempoInicioPartido;
            estadisticasPartido.duracion = Math.floor(duracion / 1000);
            console.log(`⏱️ Duración por fallback: ${estadisticasPartido.duracion} segundos`);
        }
        
        if (modoOficial) {
            anunciarOficial("🏁 ¡PARTIDO OFICIAL FINALIZADO!");
            console.log("🏁 Partido oficial finalizado");
        } else {
            anunciarGeneral("🏁 ¡PARTIDO AMISTOSO FINALIZADO!", COLORES.INFO);
            console.log("🏁 Partido amistoso finalizado");
        }
        
        // Guardar nombres de equipos en las estadísticas antes de resetear
        estadisticasPartido.nombreEquipoRojo = nombreEquipoRojo;
        estadisticasPartido.nombreEquipoAzul = nombreEquipoAzul;
        
        // Actualizar estadísticas globales
        actualizarEstadisticasGlobales(estadisticasPartido);
        
        // Actualizar replay final antes de enviar reporte TANTO EN OFICIAL COMO AMISTOSO (SI NO ES TRAINING)
        if (mapaActual !== "training") {
            actualizarReplay();
        }
        
        // Guardar replay en PC si está configurado (TANTO para oficiales COMO amistosos)
        if (guardarReplaysEnPC) {
            guardarReplayEnPC();
        }
        
        // GUARDAR DATOS ANTES DE ENVIAR REPORTE (SISTEMA DE PERSISTENCIA)
        console.log('💾 Guardando datos del partido finalizado para persistencia...');
        guardarDatosPartido();
        
    // ENVIAR REPORTES TANTO DE OFICIALES COMO AMISTOSOS (pero NO training)
    if (mapaActual !== "training") {
        const tipoPartido = modoOficial ? "oficial" : "amistoso";
        console.log(`🔍 DEBUG: Partido ${tipoPartido} finalizado, enviando reporte...`);
        reporteEnviado = false; // FORZAR que siempre se envíe si cumple criterios
        setTimeout(() => {
            enviarReporteDiscord();
            // Después de enviar, marcar como enviado y limpiar datos temporales
            setTimeout(() => {
                if (reporteEnviado) {
                    console.log('✅ Reporte enviado exitosamente, limpiando datos temporales');
                    limpiarDatosTemporales();
                } else {
                    console.log('⚠️ Reporte no confirmado como enviado, manteniendo datos temporales');
                }
            }, 2000);
        }, 1000); // Pequeña demora para asegurar consistencia
    } else {
        console.log(`🚫 No se envía reporte en mapa de training`);
        anunciarInfo("ℹ️ Mapa de training - No se envía reporte al finalizar");
        // En training, limpiar inmediatamente
        limpiarDatosTemporales();
    }
        
        // Los nombres de equipos se mantienen para el próximo partido
        // Se elimina el reseteo automático para que los equipos no tengan que redefinir sus nombres
    };
    
    
    // Función mejorada para verificar si el mapa actual es oficial
    // Ahora acepta un parámetro con la información del estadio
    function verificarMapaOficial(estadioInfo = null) {
        const mapasValidos = Object.keys(mapasOficiales);
        
        // Si no se proporciona estadio, solo verificamos por el nombre almacenado
        if (!estadioInfo) {
            console.log(`⚠️ Verificando mapa sin información de estadio`);
            // Verificar si mapaActual ya está configurado como oficial
            if (mapaActual && mapasOficiales[mapaActual]) {
                return true;
            }
            return false;
        }
        
        console.log(`🔍 DEBUG: Verificando mapa '${estadioInfo.name}' contra mapas oficiales...`);
        console.log(`🔍 DEBUG: Mapas oficiales disponibles: ${mapasValidos.join(', ')}`);
        
        // VERIFICACIÓN ESTRICTA: Solo permitir mapas que están EXPLÍCITAMENTE definidos
        // Verificar por nombre del mapa primero (exacto y sin sufijo OFICIAL)
        for (const codigoMapa of mapasValidos) {
            const mapa = mapasOficiales[codigoMapa];
            const nombreSinOficial = mapa.nombre.replace(" OFICIAL", "");
            
            console.log(`🔍 DEBUG: Comparando '${estadioInfo.name}' con '${nombreSinOficial}' (${codigoMapa})`);
            
            if (estadioInfo && estadioInfo.name === nombreSinOficial) {
                console.log(`✅ Mapa oficial detectado por nombre: ${codigoMapa} (${mapa.nombre})`);
                mapaActual = codigoMapa;
                return true;
            }
        }
        
        // Si no se encontró por nombre, verificar por estructura/contenido
        // Solo como fallback para casos donde el nombre puede haber sido modificado
        console.log(`🔍 DEBUG: No encontrado por nombre, verificando por estructura...`);
        for (const codigoMapa of mapasValidos) {
            const mapa = mapasOficiales[codigoMapa];
            try {
                const mapaEsperado = JSON.parse(mapa.hbs);
                if (estadioInfo && 
                    estadioInfo.width === mapaEsperado.width && 
                    estadioInfo.height === mapaEsperado.height) {
                    console.log(`✅ Mapa oficial detectado por estructura: ${codigoMapa} (${mapa.nombre})`);
                    mapaActual = codigoMapa;
                    return true;
                }
            } catch (error) {
                console.log(`⚠️ Error al parsear mapa ${codigoMapa}:`, error);
            }
        }
        
        // RECHAZO EXPLÍCITO: Si llegamos aquí, el mapa NO es oficial
        console.log(`❌ MAPA RECHAZADO: '${estadioInfo.name}' NO está en la lista de mapas oficiales`);
        console.log(`📋 Mapas oficiales permitidos:`);
        mapasValidos.forEach(codigo => {
            console.log(`   - ${codigo}: ${mapasOficiales[codigo].nombre}`);
        });
        
        // Marcar mapa como no oficial
        mapaActual = "no_oficial";
        return false;
    }
    
    // Evento: Cambio de estadio/mapa (incluye picker nativo)
    room.onStadiumChange = function(nuevoMapa, byPlayer) {
        console.log(`🏟️ Cambio de mapa detectado`);
        console.log(`🏟️ Nuevo mapa:`, nuevoMapa);
        console.log(`🏟️ Cambiado por jugador: ${byPlayer ? byPlayer.name : 'Sistema'}`);
        
        // NUEVA LÓGICA: Si el cambio fue hecho por el bot usando !mapa,
        // ya sabemos que el mapa es oficial porque se validó en el comando
        let esMapaOficial = false;
        
        if (byPlayer && byPlayer.name === "BOT OFICIAL LNB") {
            // El bot cambió el mapa usando !mapa - debe ser oficial
            console.log(`🤖 Cambio de mapa por bot - verificando mapaActual: ${mapaActual}`);
            if (mapaActual && mapasOficiales[mapaActual]) {
                esMapaOficial = true;
                mapaNoOficial = false;
                console.log(`✅ Mapa oficial confirmado por bot: ${mapasOficiales[mapaActual].nombre}`);
            } else {
                esMapaOficial = false;
                mapaNoOficial = true;
                console.log(`❌ Mapa del bot no reconocido como oficial`);
            }
        } else if (byPlayer && byPlayer.id !== 0) {
            // Cambio hecho por un jugador humano - verificar si es oficial
            console.log(`👤 Verificando mapa cambiado por jugador: ${byPlayer.name}`);
            
            // NUEVA LÓGICA: Siempre verificar con la información del estadio proporcionada
            // NO confiar en la variable mapaActual cuando un jugador cambia el mapa
            esMapaOficial = verificarMapaOficial(nuevoMapa);
            mapaNoOficial = !esMapaOficial;
        } else {
            // Cambio hecho por el sistema
            console.log(`🤖 Cambio de mapa por sistema`);
            if (mapaActual && mapasOficiales[mapaActual]) {
                esMapaOficial = true;
                mapaNoOficial = false;
            } else {
                esMapaOficial = verificarMapaOficial(nuevoMapa);
                mapaNoOficial = !esMapaOficial;
            }
        }
        
        // Procesar resultado de la verificación
        if (byPlayer && byPlayer.id !== 0 && byPlayer.name !== "BOT OFICIAL LNB") {
            // Cambio hecho por un jugador humano
            if (esMapaOficial) {
                anunciarOficial(`🏟️ ✅ Mapa oficial válido: ${mapasOficiales[mapaActual].nombre}`);
                anunciarOficial(`🏁 Los partidos pueden iniciarse normalmente`);
            } else {
                console.log(`❌ MAPA NO OFICIAL DETECTADO Y RECHAZADO: "${nuevoMapa.name}" por jugador: ${byPlayer.name}`);
                anunciarError(`❌ CRÍTICO: MAPA "${nuevoMapa.name}" RECHAZADO - NO ES OFICIAL`);
                anunciarError(`👤 Jugador responsable: ${byPlayer.name}`);
                
                const mapasValidos = Object.keys(mapasOficiales);
                anunciarError(`📋 Mapas oficiales únicamente: ${mapasValidos.map(m => mapasOficiales[m].nombre).join(", ")}`);
                anunciarError(`🚫 PARTIDOS BLOQUEADOS con mapas no oficiales`);
                anunciarOficial(`🔧 SOLUCIÓN: Usa !mapa [biggerx7/biggerx5/training]`);
                
                // FORZAR CAMBIO AUTOMÁTICO A MAPA OFICIAL
                console.log(`🔧 CORRECCIÓN AUTOMÁTICA: Cambiando a mapa oficial biggerx7`);
                setTimeout(() => {
                    cambiarMapa("biggerx7");
                    anunciarOficial(`🔧 Mapa cambiado automáticamente a: Bigger x7 OFICIAL`);
                    anunciarOficial(`✅ Ahora los partidos pueden iniciarse normalmente`);
                }, 2000);
                
                // Detener partido si está en curso
                if (partidoEnCurso) {
                    console.log(`🛑 Deteniendo partido en curso por mapa no oficial`);
                    room.stopGame();
                    anunciarError(`🛑 Partido detenido automáticamente por mapa no oficial`);
                }
                
                console.log(`🔧 Jugador ${byPlayer.name} cambió a mapa no oficial - CORREGIDO AUTOMÁTICAMENTE`);
            }
        } else {
            // Cambio hecho por el sistema/bot
            console.log(`🤖 Cambio de mapa realizado por el sistema/bot`);
            if (esMapaOficial) {
                console.log(`✅ Mapa oficial del sistema: ${mapasOficiales[mapaActual].nombre}`);
            } else {
                console.log(`⚠️ Mapa no oficial del sistema detectado`);
            }
        }
    };
    
    // Evento: Admin detectado
    room.onPlayerAdminChange = function(jugador, esAdmin) {
        // DETECTAR AL BOT cuando obtiene admin automáticamente
        if (jugador.id === 0 || jugador.name === "BOT OFICIAL LNB") {
            botId = jugador.id;
            console.log(`🤖 Bot detectado por admin change: ${jugador.name} (ID: ${botId})`);
            return; // No procesar como admin normal
        }
        
        if (esAdmin && jugador.id !== 0) {
            console.log(`🔰 ${jugador.name} obtuvo admin`);
            adminActual = jugador;
            
            // Si no tiene rol asignado, darle rol de admin
            if (!jugadoresConRoles.has(jugador.id)) {
                jugadoresConRoles.set(jugador.id, {
                    role: "ADMIN",
                    assignedBy: "HAXBALL_ADMIN",
                    timestamp: new Date().toISOString()
                });
                anunciarOficial(`⭐ ${jugador.name} es ahora administrador`);
            }
        }
    };
    
    // Variables para detectar goleadores y asistencias
    let ultimoToque = null;
    let penultimoToque = null;
    
    // Evento: Jugador toca la pelota
    room.onPlayerBallKick = function(jugador) {
        // REGISTRAR PRIMER TOQUE PARA TIEMPO REAL DEL PARTIDO
        if (partidoEnCurso && !estadisticasPartido.tiempoRealInicio) {
            estadisticasPartido.tiempoRealInicio = new Date();
            console.log(`⏱️ Primer toque registrado - inicio del tiempo real del partido`);
        }
        
        // Si el juego estaba en pausa, reanudar el conteo
        if (estadisticasPartido.juegoEnPausa && estadisticasPartido.ultimaPausa) {
            const tiempoPausa = (Date.now() - estadisticasPartido.ultimaPausa) / 1000;
            estadisticasPartido.tiempoPausas += tiempoPausa;
            estadisticasPartido.juegoEnPausa = false;
            estadisticasPartido.ultimaPausa = null;
            console.log(`⏸️ Pausa terminada - duración: ${Math.floor(tiempoPausa)}s`);
        }
        
        // Actualizar historial de toques
        if (ultimoToque && ultimoToque.id !== jugador.id) {
            penultimoToque = ultimoToque;
        }
        ultimoToque = jugador;
        
        // También actualizar variables globales
        if (ultimoTocador && ultimoTocador.id !== jugador.id) {
            penultimoTocador = ultimoTocador;
        }
        ultimoTocador = jugador;
        tiempoUltimoToque = Date.now();
    };
    
    // Evento: Gol marcado con registro de estadísticas
    room.onTeamGoal = function(equipo) {
        const scores = room.getScores();
        const nombreEquipo = equipo === 1 ? "Rojo" : "Azul";
        const emoji = equipo === 1 ? "🔴" : "🔵";
        
        // REGISTRO DE TIEMPO DE VALLA INVICTA (antes de todo)
        // Registrar tiempo de valla invicta para el equipo que recibió el gol
        if (estadisticasPartido.iniciado) {
            const tiempoJuegoActual = Math.floor(scores ? scores.time : 0); // Tiempo real de juego en segundos
            
            if (equipo === 1) {
                // Gol del equipo rojo, el azul recibió gol - registrar cuánto duró su valla invicta
                if (estadisticasPartido.golesRed === 0) {
                    // Es el primer gol que recibe el azul
                    estadisticasPartido.tiempoVallaInvictaBlue = tiempoJuegoActual;
                }
            } else {
                // Gol del equipo azul, el rojo recibió gol - registrar cuánto duró su valla invicta
                if (estadisticasPartido.golesBlue === 0) {
                    // Es el primer gol que recibe el rojo
                    estadisticasPartido.tiempoVallaInvictaRed = tiempoJuegoActual;
                }
            }
        }
        
        // Determinar goleador y asistente usando las variables globales
        let goleador = null;
        let asistente = null;
        
        if (ultimoTocador) {
            if (ultimoTocador.team === equipo) {
                // Gol normal: el último tocador es del mismo equipo que anotó
                goleador = ultimoTocador;
                
                // Si hay un penúltimo toque del mismo equipo, es asistencia
                if (penultimoTocador && penultimoTocador.team === equipo && penultimoTocador.id !== goleador.id) {
                    asistente = penultimoTocador;
                }
            } else {
                // Autogol: el último tocador es del equipo contrario al que anotó
                goleador = ultimoTocador;
                // En autogoles NO hay asistencias
                asistente = null;
            }
        }
        
        // Registrar estadísticas del gol con goleador y asistente
        if (goleador) {
            registrarGolOficial(goleador, equipo, asistente);
        } else {
            // Gol sin goleador identificado
            if (equipo === 1) {
                estadisticasPartido.golesRed++;
            } else {
                estadisticasPartido.golesBlue++;
            }
        }
        
        // Actualizar duración del partido con tiempo real de juego
        if (scores) {
            estadisticasPartido.duracion = Math.floor(scores.time);
        } else if (estadisticasPartido.tiempoRealInicio) {
            // Calcular duración real descontando pausas
            const tiempoTranscurrido = (Date.now() - estadisticasPartido.tiempoRealInicio) / 1000;
            let tiempoPausasTotal = estadisticasPartido.tiempoPausas;
            if (estadisticasPartido.juegoEnPausa && estadisticasPartido.ultimaPausa) {
                tiempoPausasTotal += (Date.now() - estadisticasPartido.ultimaPausa) / 1000;
            }
            estadisticasPartido.duracion = Math.floor(tiempoTranscurrido - tiempoPausasTotal);
        }
        
        // Detectar arqueros después de cada gol
        detectarArqueros();
        
        // NO actualizar replay durante el partido - grabar completo
        
        // Mostrar resultado actualizado después del gol
        setTimeout(() => {
            // Usar nombres personalizados de equipos si están definidos
            const nombreRojo = nombreEquipoRojo || "🔴";
            const nombreAzul = nombreEquipoAzul || "🔵";
            anunciarOficial(`⚽ RESULTADO: ${nombreRojo} ${scores.red} - ${scores.blue} ${nombreAzul}`);
        }, 500);
        
        console.log(`⚽ Gol registrado: Equipo ${equipo}, Marcador: ${scores.red}-${scores.blue}`);
    };
    
    // Enlace de la sala (CRÍTICO para Headless)
    room.onRoomLink = function(url) {
        console.log("🔗 ENLACE DE LA SALA: " + url);
        console.log("📋 Copia este enlace para acceder a la sala");
        console.log("=".repeat(60));
        
        // Almacenar el enlace real para usar en los informes
        enlaceRealSala = url;
        console.log("✅ enlaceRealSala actualizado a: " + enlaceRealSala);
        
        // Enviar SOLO UNA notificación con el enlace actualizado
        setTimeout(() => {
            enviarNotificacionCreacionHost(url);
            console.log("📤 Reporte único enviado con enlace real: " + enlaceRealSala);
        }, 2000);
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIÓN PARA CONFIGURAR WEBHOOK DE FIRMAS
// ═══════════════════════════════════════════════════════════════════════════════

function configurarWebhookFirmas(url) {
    webhookFirmas = url;
    console.log("✅ Webhook de firmas configurado");
    anunciarOficial("🔗 Sistema de verificación de firmas activado");
}

// Función para iniciar sistema de guardado de emergencia con mayor frecuencia
function iniciarGuardadoEmergencia() {
    console.log('🚨 Iniciando sistema de guardado de emergencia...');
    
    // Guardar cada 5 segundos durante partidos activos
    setInterval(() => {
        if (partidoEnCurso && estadisticasPartido.iniciado) {
            guardarDatosPartido();
            console.log('🛡️ Guardado de emergencia realizado');
        }
    }, INTERVALO_GUARDADO_EMERGENCIA);
    
    // Programar guardado automático cada minuto independientemente
    setInterval(() => {
        if (partidoEnCurso || firmasRecibidas.size > 0) {
            guardarDatosPartido();
        }
    }, INTERVALO_AUTO_GUARDADO);
    
    console.log('✅ Sistema de guardado de emergencia configurado');
}

// Función para preparar datos de emergencia
function prepararDatosEmergencia() {
    // Configurar eventos para guardar automáticamente en situaciones críticas
    
    // Guardar cuando se detecta cierre del navegador
    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
            console.log('🚨 Cierre detectado - guardando datos de emergencia');
            guardarDatosPartido();
        });
        
        window.addEventListener('unload', () => {
            console.log('🚨 Descarga detectada - guardando datos finales');
            guardarDatosPartido();
        });
    }
    
    console.log('🛡️ Sistema de datos de emergencia preparado');
}

// ══════════════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN DEL BOT OFICIAL
// ══════════════════════════════════════════════════════════════════════════════════

function inicializarSistemaPersistencia() {
    console.log('🔄 Inicializando sistema de persistencia...');
    
    // Verificar si hay datos pendientes de partidos anteriores
    try {
        recuperarDatosPartido();
        
        // Si hay datos pendientes, programar envío
        if (datosPartidoPendiente) {
            console.log('⚠️ Datos de partido pendiente encontrados');
            setTimeout(() => {
                if (datosPartidoPendiente && !reporteEnviado) {
                    console.log('📤 Enviando reporte pendiente...');
                    enviarReporteDiscord();
                    
                    // Limpiar después del envío
                    setTimeout(() => {
                        limpiarDatosTemporales();
                        datosPartidoPendiente = null;
                    }, 5000);
                }
            }, 3000); // Esperar 3 segundos antes de enviar
        }
    } catch (error) {
        console.log('❌ Error al inicializar sistema de persistencia:', error);
    }
    
    console.log('✅ Sistema de persistencia inicializado');
}

// ═══════════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN DE LA SALA
// ═══════════════════════════════════════════════════════════════════════════════

// Función para inicializar la sala
function inicializarSala() {
    room = HBInit({
        roomName: roomName,
        password: roomPassword,
        maxPlayers: maxPlayers,
        public: roomPublic,
        noPlayer: true,
        token: token,
        geo: geo
    });

    console.log("🏆 Bot Oficial LNB configurado correctamente");

    // La notificación se enviará automáticamente cuando se obtenga el enlace en onRoomLink
    // No es necesario llamar a intentarEnviarNotificacion aquí
    
    // Configurar eventos
    configurarEventos();
    
    // Inicializar sistema de persistencia
    inicializarSistemaPersistencia();
    
// Configurar detectores de cierre abrupto
    configurarDetectoresCierreAbrupto();
    
    // Inicializar sistema de guardado de emergencia
    iniciarGuardadoEmergencia();
    
    // Establecer mapa inicial oficial
    cambiarMapa("biggerx7");
    
    // Configuración inicial de la sala
    room.setKickRateLimit(5, 1, 0); // Límite de kicks más restrictivo
    
    // Mensajes de bienvenida
    anunciarGeneral("🏆🔵⚡ BOT LNB - SALA MULTIMODO ⚡🔵🏆", COLORES.PRIMARIO, "bold");
    anunciarInfo("🎮 MODO AMISTOSO ACTIVO - Las firmas están deshabilitadas");
    anunciarInfo("💡 Un administrador puede activar el modo oficial con !oficial");
    anunciarInfo("🎮 Usa !ayuda para ver todos los comandos disponibles");
    anunciarInfo("🔰 Solo administradores autorizados pueden gestionar la sala");
    
    console.log("🏆 Bot Oficial LNB iniciado correctamente");
    
    // Reportar inicio del bot solo si se especifica explícitamente
    // No enviar reporte automático al inicio ya que comienza en modo amistoso
    console.log(`🏆 Bot LNB iniciado en modo amistoso - Hora: ${new Date().toLocaleString()}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES GLOBALES EXPORTADAS
// ═══════════════════════════════════════════════════════════════════════════════


// Función global para configurar el webhook de firmas (llamar desde consola)
if (typeof window !== 'undefined') {
    window.configurarWebhookFirmas = configurarWebhookFirmas;
}

// Función para obtener el nombre original de un jugador (compatibilidad con bot_lnb1.js)
function obtenerNombreOriginal(jugador) {
    return jugador.name; // En modo oficial, usamos el nombre tal como aparece
}

// Función para verificar si un jugador es el bot
function esBot(jugador) {
    if (!jugador) return false;
    return jugador.name === "BOT OFICIAL LNB" || jugador.id === 0;
}

// Función para obtener jugadores sin incluir el bot
function obtenerJugadoresSinHost() {
    return room.getPlayerList().filter(j => j.id !== 0); // Filtrar bot (ID 0)
}

// Función para obtener jugador por nombre
function obtenerJugadorPorNombre(nombre) {
    const jugadores = obtenerJugadoresSinHost();
    return jugadores.find(j => 
        j.name.toLowerCase().includes(nombre.toLowerCase())
    );
}

// Función para intentar enviar notificación con reintentos - DESHABILITADA
// Esta función ya no se usa porque onRoomLink maneja directamente el envío
/*
function intentarEnviarNotificacion(intento) {
    const maxIntentos = 10;
    const tiempoEspera = intento * 5000; // 5, 10, 15, 20... segundos
    
    setTimeout(() => {
        console.log(`🔍 Intento ${intento}/${maxIntentos} - Verificando si la sala tiene enlace...`);
        
        // DEBUG: Mostrar toda la información disponible del room
        console.log(`🔍 DEBUG room.link:`, room.link);
        console.log(`🔍 DEBUG room.roomCode:`, room.roomCode);
        console.log(`🔍 DEBUG typeof room.link:`, typeof room.link);
        console.log(`🔍 DEBUG window.location:`, typeof window !== 'undefined' ? window.location.href : 'No disponible');
        
        // Verificar si tenemos un enlace válido
        let enlaceSala = null;
        let metodoUsado = "";
        
        // Método 1: room.link
        if (room.link && typeof room.link === 'string' && room.link.trim().length > 0) {
            if (room.link.startsWith('http')) {
                enlaceSala = room.link;
                metodoUsado = "room.link";
                console.log(`✅ Enlace encontrado via room.link en intento ${intento}: ${enlaceSala}`);
            } else {
                console.log(`⚠️ room.link existe pero no es HTTP: '${room.link}'`);
            }
        } else {
            console.log(`❌ room.link no válido:`, room.link);
        }
        
        // Método 2: room.roomCode (con validación estricta)
        if (!enlaceSala && room.roomCode && typeof room.roomCode === 'string' && room.roomCode.trim().length > 0) {
            const codigo = room.roomCode.trim();
            
            // Validar que NO sea "headless" u otros valores inválidos
            if (codigo !== "headless" && codigo !== "undefined" && codigo !== "null" && codigo.length >= 6) {
                // Validar que sea un código alfanumérico válido
                if (/^[a-zA-Z0-9]{6,}$/.test(codigo)) {
                    enlaceSala = `https://www.haxball.com/play?c=${codigo}`;
                    metodoUsado = "room.roomCode";
                    console.log(`✅ RoomCode VÁLIDO encontrado en intento ${intento}: ${codigo}`);
                } else {
                    console.log(`⚠️ room.roomCode tiene formato inválido: '${codigo}' (debe ser alfanumérico, min 6 chars)`);
                }
            } else {
                console.log(`⚠️ room.roomCode contiene valor temporal inválido: '${codigo}'`);
            }
        } else if (!enlaceSala) {
            console.log(`❌ room.roomCode no válido:`, room.roomCode);
        }
        
        // Método 3: URL del navegador completa
        if (!enlaceSala && typeof window !== 'undefined' && window.location) {
            const urlCompleta = window.location.href;
            console.log(`🔍 URL completa:`, urlCompleta);
            
            // Buscar patrones de sala en la URL
            const urlParams = new URLSearchParams(window.location.search);
            const roomId = urlParams.get('roomid') || urlParams.get('c');
            console.log(`🔍 URL params roomid:`, urlParams.get('roomid'));
            console.log(`🔍 URL params c:`, urlParams.get('c'));
            
            if (roomId && roomId.trim().length > 0) {
                enlaceSala = `https://www.haxball.com/play?c=${roomId}`;
                metodoUsado = "URL params";
                console.log(`✅ Enlace desde URL en intento ${intento}: ${enlaceSala}`);
            } else {
                // Buscar patrones de room en la URL hash o path
                const hashMatch = window.location.hash.match(/room[=:]([a-zA-Z0-9]+)/);
                const pathMatch = window.location.pathname.match(/\/([a-zA-Z0-9]+)$/);
                
                if (hashMatch && hashMatch[1]) {
                    enlaceSala = `https://www.haxball.com/play?c=${hashMatch[1]}`;
                    metodoUsado = "URL hash";
                    console.log(`✅ Enlace desde hash en intento ${intento}: ${enlaceSala}`);
                } else if (pathMatch && pathMatch[1] && pathMatch[1].length > 5) {
                    enlaceSala = `https://www.haxball.com/play?c=${pathMatch[1]}`;
                    metodoUsado = "URL path";
                    console.log(`✅ Enlace desde path en intento ${intento}: ${enlaceSala}`);
                } else {
                    console.log(`❌ No se encontró roomId en URL params, hash o path`);
                }
            }
        } else if (!enlaceSala) {
            console.log(`❌ window.location no disponible`);
        }
        
        // Método 4: Inspeccionar objetos globales de HaxBall
        if (!enlaceSala && typeof window !== 'undefined') {
            console.log(`🔍 Intentando método 4: objetos globales...`);
            
            // Buscar en variables globales comunes de HaxBall
            const posiblesGlobales = ['roomLink', 'gameLink', 'currentRoom', 'hbRoom'];
            
            for (const global of posiblesGlobales) {
                if (window[global] && typeof window[global] === 'string' && window[global].startsWith('http')) {
                    enlaceSala = window[global];
                    metodoUsado = `global.${global}`;
                    console.log(`✅ Enlace desde global ${global} en intento ${intento}: ${enlaceSala}`);
                    break;
                }
            }
        }
        
        // Método 5: Generar enlace temporal si tenemos al menos el código de sala
        if (!enlaceSala && room && typeof room.getRoomLink === 'function') {
            try {
                enlaceSala = room.getRoomLink();
                metodoUsado = "room.getRoomLink()";
                console.log(`✅ Enlace via getRoomLink en intento ${intento}: ${enlaceSala}`);
            } catch (error) {
                console.log(`❌ Error en getRoomLink:`, error.message);
            }
        }
        
        if (enlaceSala && enlaceSala.startsWith('http')) {
            // ¡Tenemos un enlace válido! Enviar notificación
            console.log(`🎉 ENLACE VÁLIDO ENCONTRADO via ${metodoUsado}: ${enlaceSala}`);
            enviarNotificacionCreacionHost(enlaceSala);
        } else {
            console.log(`⏳ Intento ${intento}: Aún no hay enlace válido disponible`);
            console.log(`💡 Esperando ${(maxIntentos - intento) * 5} segundos más en ${maxIntentos - intento} intentos restantes`);
            
            if (intento < maxIntentos) {
                // Intentar de nuevo
                intentarEnviarNotificacion(intento + 1);
            } else {
                console.log(`⚠️ Máximo de intentos alcanzado. Enviando notificación sin enlace.`);
                enviarNotificacionCreacionHost("Sala creada exitosamente - Enlace no disponible");
            }
        }
    }, tiempoEspera);
}
*/

// Función para enviar notificación de creación de host
function enviarNotificacionCreacionHost(enlaceSala) {
    try {
        let payload;
        
        if (enlaceSala.startsWith('http')) {
            // Crear embed con información de la sala
            payload = {
                embeds: [{
                    title: "🏟️ Partido oficial LNB",
                    description: "🏆 **LNB OFICIAL - PARTIDO DE COMPETENCIA** 🏆",
                    color: hexToNumber(COLORES.PRIMARIO), // Azul LNB
                    fields: [
                        {
                            name: "🔗 Enlace",
                            value: `[Entrar a la sala](${enlaceSala})`,
                            inline: true
                        },
                        {
                            name: "👥 Jugadores",
                            value: "0 / 28",
                            inline: true
                        },
                        {
                            name: "🔓 Contraseña",
                            value: "Sin contraseña",
                            inline: true
                        },
                        {
                            name: "⏳ Estado",
                            value: "Esperando jugadores...",
                            inline: false
                        }
                    ],
                    footer: {
                        text: "Script by ИФT"
                    },
                    timestamp: new Date().toISOString()
                }]
            };
        } else {
            // Fallback para enlaces no válidos
            payload = {
                embeds: [{
                    title: "🏟️ Partido oficial LNB",
                    description: enlaceSala,
                    color: hexToNumber(COLORES.ERROR),
                    footer: {
                        text: "Script by ИФT"
                    },
                    timestamp: new Date().toISOString()
                }]
            };
        }

        fetch(webhookCreacionHost, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(response => {
            if (response.ok) {
                console.log("✅ Notificación de creación de host enviada a Discord");
                console.log("🔗 Enlace enviado:", enlaceSala);
            } else {
                console.log("❌ Error al enviar notificación de creación de host:", response.status);
            }
        }).catch(error => {
            console.log("❌ Error de red al enviar notificación:", error);
        });
    } catch (error) {
        console.log("❌ Error al enviar notificación de creación de host:", error);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// INICIO DEL BOT
// ═══════════════════════════════════════════════════════════════════════════════

// Detectar si estamos en HaxBall (ya sea headless o navegador)
if (typeof HBInit !== 'undefined') {
    // HBInit está disponible, podemos inicializar
    console.log("✅ HBInit detectado, iniciando bot oficial...");
    try {
        inicializarSala();
    } catch (error) {
        console.error("❌ Error al inicializar el bot oficial:", error);
    }
} else if (isNode) {
    // Estamos en Node.js - intentar cargar HaxBall Headless
    console.log("🔄 Esperando HBInit de HaxBall Headless...");
    console.log("💡 Asegúrate de tener instalado HaxBall Headless");
    console.log("💡 Comando: npm install haxball");
    
    // Intentar múltiples formas de cargar HaxBall Headless
    let HaxballJS = null;
    const posibleModulos = ['haxball', '@haxball/headless', 'haxball-headless'];
    
    for (const modulo of posibleModulos) {
        try {
            HaxballJS = require(modulo);
            console.log(`✅ Módulo ${modulo} cargado correctamente`);
            break;
        } catch (error) {
            console.log(`⚠️ No se pudo cargar ${modulo}:`, error.message);
        }
    }
    
    if (HaxballJS) {
        // Intentar diferentes formas de obtener HBInit
        if (HaxballJS.HBInit) {
            global.HBInit = HaxballJS.HBInit;
        } else if (typeof HaxballJS === 'function') {
            global.HBInit = HaxballJS;
        } else if (HaxballJS.default && HaxballJS.default.HBInit) {
            global.HBInit = HaxballJS.default.HBInit;
        }
        
        if (typeof global.HBInit === 'function') {
            console.log("✅ HBInit configurado, iniciando bot oficial...");
            try {
                inicializar();
            } catch (error) {
                console.error("❌ Error al inicializar el bot oficial:", error);
            }
        } else {
            console.log("❌ No se pudo encontrar HBInit en el módulo cargado");
            console.log("🔍 Estructura del módulo:", Object.keys(HaxballJS));
        }
    } else {
        console.log("❌ No se pudo cargar ningún módulo de HaxBall Headless");
        console.log("💡 Instala con: npm install haxball");
        console.log("💡 O prueba: npm install @haxball/headless");
    }
} else {
    // Navegador - HBInit no está disponible
    console.log("❌ HBInit no está disponible en el navegador.");
    console.log("💡 Abre este script en haxball.com/headless");
    console.log("💡 O asegúrate de que el API de HaxBall esté cargado");
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE DETECCIÓN DE CIERRE ABRUPTO Y AUTO-GUARDADO
// ═══════════════════════════════════════════════════════════════════════════════

// Función para preparar datos de emergencia
function prepararDatosEmergencia() {
    if (!estadisticasPartido.iniciado) {
        datosParaEnviarEnCierreAbrupto = null;
        return;
    }
    
    // Calcular duración real del partido actual
    let duracionActual;
    const scores = room.getScores();
    if (scores && scores.time) {
        duracionActual = Math.floor(scores.time);
    } else if (estadisticasPartido.tiempoRealInicio) {
        const tiempoTranscurrido = (Date.now() - estadisticasPartido.tiempoRealInicio) / 1000;
        let tiempoPausasTotal = estadisticasPartido.tiempoPausas;
        if (estadisticasPartido.juegoEnPausa && estadisticasPartido.ultimaPausa) {
            tiempoPausasTotal += (Date.now() - estadisticasPartido.ultimaPausa) / 1000;
        }
        duracionActual = Math.floor(tiempoTranscurrido - tiempoPausasTotal);
    } else {
        duracionActual = Math.floor((Date.now() - estadisticasPartido.tiempoInicio) / 1000);
    }
    
    datosParaEnviarEnCierreAbrupto = {
        estadisticas: JSON.parse(JSON.stringify(estadisticasPartido)),
        duracion: duracionActual,
        timestamp: Date.now(),
        enlace: enlaceRealSala || "Enlace no disponible",
        replay: estadisticasPartido.replay || null,
        tipoPartido: modoOficial ? "oficial" : "amistoso"
    };
    
    console.log('📊 Datos de emergencia preparados:', {
        duracion: duracionActual,
        golesRojo: estadisticasPartido.golesRed,
        golesAzul: estadisticasPartido.golesBlue,
        tipoPartido: datosParaEnviarEnCierreAbrupto.tipoPartido
    });
}

// Función para enviar datos de emergencia
function enviarDatosEmergencia() {
    if (!datosParaEnviarEnCierreAbrupto) {
        console.log('⚠️ No hay datos de emergencia para enviar');
        return;
    }
    
    console.log('🚨 ENVIANDO DATOS DE EMERGENCIA POR CIERRE ABRUPTO');
    
    const datos = datosParaEnviarEnCierreAbrupto;
    
    // Crear informe de emergencia
    const informeEmergencia = {
        tipo: "emergencia",
        duracion: datos.duracion,
        golesRojo: datos.estadisticas.golesRed,
        golesAzul: datos.estadisticas.golesBlue,
        tipoPartido: datos.tipoPartido,
        enlace: datos.enlace,
        timestamp: datos.timestamp,
        motivo: "Cierre abrupto detectado"
    };
    
    // Enviar informe (usando fetch síncrono en lo posible)
    try {
        const payload = {
            embeds: [{
                title: "🚨 PARTIDO TERMINADO ABRUPTAMENTE",
                description: `**${datos.tipoPartido.toUpperCase()}** - Cierre abrupto detectado`,
                color: hexToNumber(COLORES.ERROR),
                fields: [
                    {
                        name: "⏱️ Duración",
                        value: `${Math.floor(datos.duracion / 60)}:${String(Math.floor(datos.duracion % 60)).padStart(2, '0')}`,
                        inline: true
                    },
                    {
                        name: "⚽ Resultado",
                        value: `🔴 ${datos.estadisticas.golesRed} - ${datos.estadisticas.golesBlue} 🔵`,
                        inline: true
                    },
                    {
                        name: "🔗 Enlace",
                        value: datos.enlace,
                        inline: false
                    },
                    {
                        name: "⚠️ Motivo",
                        value: informeEmergencia.motivo,
                        inline: false
                    }
                ],
                footer: {
                    text: "Script by ИФT - Envío de emergencia"
                },
                timestamp: new Date(datos.timestamp).toISOString()
            }]
        };
        
        // Usar navigator.sendBeacon si está disponible (más confiable para cierre abrupto)
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            navigator.sendBeacon(webhookPartidos, blob);
            console.log('📡 Datos enviados vía sendBeacon');
        } else {
            // Fallback con fetch
            fetch(webhookPartidos, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                keepalive: true // Importante para cierre abrupto
            }).catch(error => {
                console.log('❌ Error al enviar datos de emergencia:', error);
            });
        }
        
    } catch (error) {
        console.log('❌ Error al preparar datos de emergencia:', error);
    }
}

// Función para configurar detectores de cierre abrupto
function configurarDetectoresCierreAbrupto() {
    if (typeof window !== 'undefined') {
        // Detector de cierre de pestaña/ventana
        window.addEventListener('beforeunload', function(event) {
            console.log('🚨 Detectado cierre de pestaña/ventana');
            enviarDatosEmergencia();
        });
        
        // Detector de cierre de página
        window.addEventListener('unload', function(event) {
            console.log('🚨 Detectado cierre de página');
            enviarDatosEmergencia();
        });
        
        // Detector de pérdida de visibilidad (útil para pestañas)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                console.log('⚪ Página oculta - preparando datos de emergencia');
                prepararDatosEmergencia();
            }
        });
    }
    
    // Configurar auto-guardado periódico
    if (intervalAutoGuardado) {
        clearInterval(intervalAutoGuardado);
    }
    
    intervalAutoGuardado = setInterval(() => {
        if (estadisticasPartido.iniciado) {
            prepararDatosEmergencia();
            ultimoAutoGuardado = Date.now();
            console.log('💾 Auto-guardado realizado');
        }
    }, INTERVALO_AUTO_GUARDADO);
    
    console.log('🛡️ Detectores de cierre abrupto configurados');
}

// Función para limpiar detectores
function limpiarDetectoresCierreAbrupto() {
    if (intervalAutoGuardado) {
        clearInterval(intervalAutoGuardado);
        intervalAutoGuardado = null;
    }
    
    datosParaEnviarEnCierreAbrupto = null;
    console.log('🧹 Detectores de cierre abrupto limpiados');
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE MENSAJES DE EQUIPO Y MENSAJES PRIVADOS
// ═══════════════════════════════════════════════════════════════════════════════

// Función para enviar mensaje de equipo
function enviarMensajeEquipo(jugador, mensaje) {
    // Verificar que el jugador esté en un equipo (no en espectadores) O que sea un espectador incluido en chat de equipo
    let equipoDelMensaje = jugador.team;
    
    if (jugador.team === 0) {
        // Si es espectador, verificar si está incluido en algún chat de equipo
        if (jugadoresIncluidosEnEquipo.has(jugador.id)) {
            equipoDelMensaje = jugadoresIncluidosEnEquipo.get(jugador.id);
        } else {
            anunciarError("❌ Debes estar en un equipo para enviar mensajes de equipo", jugador.id);
            return;
        }
    }
    
    // Obtener jugadores del mismo equipo
    const jugadoresEquipo = room.getPlayerList().filter(p => p.team === equipoDelMensaje && p.id !== 0);
    
    // Obtener espectadores incluidos en este equipo
    const especiadoresIncluidos = room.getPlayerList().filter(p => 
        p.team === 0 && 
        p.id !== 0 && 
        jugadoresIncluidosEnEquipo.has(p.id) && 
        jugadoresIncluidosEnEquipo.get(p.id) === equipoDelMensaje
    );
    
    // Combinar ambas listas para destinatarios del mensaje
    const destinatarios = [...jugadoresEquipo, ...especiadoresIncluidos];
    
    if (destinatarios.length === 0) {
        anunciarError("❌ No hay otros jugadores en tu equipo", jugador.id);
        return;
    }
    
    // Determinar color y emoji del equipo
    const equipoColor = equipoDelMensaje === 1 ? COLORES.ROJO : COLORES.AZUL;
    const equipoEmoji = equipoDelMensaje === 1 ? "🔴" : "🔵";
    const equipoNombre = equipoDelMensaje === 1 ? "EQUIPO" : "EQUIPO";
    
    // Agregar indicador si el que envía es espectador incluido
    const indicadorEspectador = jugador.team === 0 ? " [SPEC]" : "";
    
    // Formatear mensaje de equipo
    const mensajeFormateado = `${equipoEmoji} [${equipoNombre}] ${jugador.name}${indicadorEspectador}: ${mensaje}`;
    
    // Enviar mensaje a todos los destinatarios (jugadores del equipo + espectadores incluidos)
    destinatarios.forEach(destinatario => {
        room.sendAnnouncement(mensajeFormateado, destinatario.id, hexToNumber(equipoColor), "normal", 1);
    });
    
    console.log(`📢 Mensaje de equipo ${equipoDelMensaje} de ${jugador.name}${indicadorEspectador}: ${mensaje}`);
}

// Función para enviar mensaje a espectadores
function enviarMensajeEspectadores(jugador, mensaje) {
    // Verificar que el jugador sea espectador
    if (jugador.team !== 0) {
        anunciarError("❌ Solo los espectadores pueden usar el chat de espectadores", jugador.id);
        return;
    }
    
    // Obtener todos los espectadores (team 0, excluyendo el bot)
    const espectadores = room.getPlayerList().filter(p => p.team === 0 && p.id !== 0);
    
    if (espectadores.length <= 1) {
        anunciarError("❌ No hay otros espectadores en la sala", jugador.id);
        return;
    }
    
    // Formatear mensaje de espectadores
    const mensajeFormateado = `⚪ [SPECS] ${jugador.name}: ${mensaje}`;
    
    // Enviar mensaje a todos los espectadores
    espectadores.forEach(espectador => {
        room.sendAnnouncement(mensajeFormateado, espectador.id, hexToNumber(COLORES.GRIS), "normal", 1);
    });
    
    console.log(`⚪ Mensaje de espectadores de ${jugador.name}: ${mensaje}`);
}

// Función para enviar mensaje privado
function enviarMensajePrivado(remitente, nombreDestino, mensaje) {
    // Función mejorada de búsqueda de jugadores que maneja nombres con espacios
    function buscarJugador(nombre) {
        const jugadores = room.getPlayerList().filter(p => p.id !== 0);
        const nombreBusqueda = nombre.toLowerCase().trim();
        
        console.log(`🔍 DEBUG: Buscando jugador con nombre: "${nombre}"`);
        console.log(`🔍 DEBUG: Nombre normalizado: "${nombreBusqueda}"`);
        console.log(`🔍 DEBUG: Jugadores disponibles: ${jugadores.map(p => `"${p.name}"`).join(', ')}`);
        
        // 1. Búsqueda exacta (sin cambios)
        let jugador = jugadores.find(p => p.name.toLowerCase() === nombreBusqueda);
        if (jugador) {
            console.log(`✅ DEBUG: Encontrado por búsqueda exacta: "${jugador.name}"`);
            return jugador;
        }
        
        // 2. Búsqueda ignorando múltiples espacios consecutivos
        const nombreNormalizadoEspacios = nombreBusqueda.replace(/\s+/g, ' ').trim();
        jugador = jugadores.find(p => p.name.toLowerCase().replace(/\s+/g, ' ').trim() === nombreNormalizadoEspacios);
        if (jugador) {
            console.log(`✅ DEBUG: Encontrado normalizando espacios: "${jugador.name}"`);
            return jugador;
        }
        
        // 3. Búsqueda con caracteres especiales como están (sin reemplazar por _)
        jugador = jugadores.find(p => {
            const nombreJugador = p.name.toLowerCase().trim();
            const coincide = nombreJugador === nombreBusqueda;
            if (coincide) console.log(`✅ DEBUG: Coincidencia con caracteres especiales: "${p.name}"`);
            return coincide;
        });
        if (jugador) return jugador;
        
        // 4. Búsqueda por contenido parcial (respetando espacios)
        jugador = jugadores.find(p => {
            const nombreJugador = p.name.toLowerCase();
            const contiene = nombreJugador.includes(nombreBusqueda);
            if (contiene) console.log(`✅ DEBUG: Encontrado por contenido parcial: "${p.name}"`);
            return contiene;
        });
        if (jugador) return jugador;
        
        // 5. Búsqueda ignorando solo espacios extras pero manteniendo paréntesis
        const nombreSinEspaciosExtras = nombreBusqueda.replace(/\s+/g, '');
        jugador = jugadores.find(p => {
            const nombreJugadorSinEspacios = p.name.toLowerCase().replace(/\s+/g, '');
            const coincide = nombreJugadorSinEspacios === nombreSinEspaciosExtras;
            if (coincide) console.log(`✅ DEBUG: Encontrado sin espacios: "${p.name}"`);
            return coincide;
        });
        if (jugador) return jugador;
        
        // 6. NUEVA: Búsqueda flexible para casos como "not_(_10_)" vs "not ( 10 )"
        const nombreFlexible = nombreBusqueda.replace(/[_\s]/g, '').replace(/[()]/g, '');
        jugador = jugadores.find(p => {
            const nombreJugadorFlexible = p.name.toLowerCase().replace(/[_\s]/g, '').replace(/[()]/g, '');
            const coincide = nombreJugadorFlexible.includes(nombreFlexible) || nombreFlexible.includes(nombreJugadorFlexible);
            if (coincide) console.log(`✅ DEBUG: Encontrado con búsqueda flexible: "${p.name}"`);
            return coincide;
        });
        if (jugador) return jugador;
        
        console.log(`❌ DEBUG: No se encontró jugador para "${nombre}"`);
        return null;
    }
    
    // Buscar al jugador destinatario
    const destinatario = buscarJugador(nombreDestino);
    
    if (!destinatario) {
        anunciarError(`❌ No se encontró al jugador "${nombreDestino}"`, remitente.id);
        return;
    }
    
    // Verificar que no se esté enviando mensaje a sí mismo
    if (destinatario.id === remitente.id) {
        anunciarError("❌ No puedes enviarte un mensaje privado a ti mismo", remitente.id);
        return;
    }
    
    // Formatear mensajes
    const mensajeParaDestinatario = `💬 [PRIVADO] ${remitente.name} → TÚ: ${mensaje}`;
    const mensajeParaRemitente = `💬 [PRIVADO] TÚ → ${destinatario.name}: ${mensaje}`;
    
    // Enviar mensaje al destinatario
    room.sendAnnouncement(mensajeParaDestinatario, destinatario.id, hexToNumber(COLORES.INFO), "normal", 1);
    
    // Confirmar al remitente
    room.sendAnnouncement(mensajeParaRemitente, remitente.id, hexToNumber(COLORES.GRIS), "normal", 1);
    
    console.log(`📧 Mensaje privado de ${remitente.name} a ${destinatario.name}: ${mensaje}`);
}

// Función para enviar mensaje con filtro !onlyteams
function enviarMensajeConFiltro(jugador, mensaje, color = "FFFFFF", estilo = "normal") {
    const jugadoresSala = room.getPlayerList().filter(p => p.id !== 0); // Excluir bot
    
    // Para cada jugador en la sala, determinar si debe ver este mensaje
    jugadoresSala.forEach(receptor => {
        let puedeVerMensaje = true;
        
        // Si el receptor tiene activado !onlyteams
        if (jugadoresEnOnlyTeams.has(receptor.id)) {
            // NUEVA LÓGICA: Solo puede ver mensajes si el que envía está en un equipo (NO espectador)
            // Los receptores con !onlyteams ven mensajes de ambos equipos pero NO de espectadores
            if (jugador.team === 0) {
                // El que envía es espectador - el receptor con onlyteams NO puede verlo
                puedeVerMensaje = false;
            } else {
                // El que envía está en un equipo (rojo o azul) - el receptor puede verlo
                // independientemente de si el receptor está en espectadores o en cualquier equipo
                puedeVerMensaje = true;
            }
        }
        
        // Si puede ver el mensaje, enviarlo
        if (puedeVerMensaje) {
            room.sendAnnouncement(mensaje, receptor.id, hexToNumber(color), estilo, 1);
        }
    });
    
    console.log(`📢 Mensaje enviado por ${jugador.name} (equipo ${jugador.team}): ${mensaje}`);
}

// Función para ejecutar intercambio forzado con movimiento del bot
function ejecutarIntercambioForzadoConBot() {
    console.log('🤖 === INICIANDO INTERCAMBIO FORZADO CON BOT ===');
    
    return new Promise((resolve) => {
        try {
            // Obtener el bot
            const bot = room.getPlayerList().find(p => p.name === "BOT OFICIAL LNB" || p.id === 0);
            if (!bot) {
                console.log('⚠️ Bot no encontrado para intercambio forzado');
                resolve(false);
                return;
            }
            
            const equipoOriginalBot = bot.team;
            console.log(`🤖 Bot encontrado en equipo ${equipoOriginalBot}`);
            
            // Intentar capturar colores actuales de los equipos
            let coloresRojo = null;
            let coloresAzul = null;
            
            try {
                if (typeof room.getTeamColors === 'function') {
                    coloresRojo = room.getTeamColors(1);
                    coloresAzul = room.getTeamColors(2);
                    console.log('🎨 Colores capturados:', { rojo: coloresRojo, azul: coloresAzul });
                }
            } catch (error) {
                console.log('⚠️ Error al capturar colores:', error.message);
            }
            
            // Verificar si tenemos colores válidos para intercambiar
if (coloresRojo && coloresAzul && 
                coloresRojo.colors && coloresAzul.colors &&
                Array.isArray(coloresRojo.colors) && Array.isArray(coloresAzul.colors) &&
                coloresRojo.colors.length >= 3 && coloresAzul.colors.length >= 3 &&
                coloresRojo.colors.some(c => c !== 0xFFFFFF) &&
                coloresAzul.colors.some(c => c !== 0xFFFFFF)) {
                
                console.log('✅ Colores válidos encontrados, procediendo con intercambio');
                
                // Función para convertir color a hex
                function colorToHex(color) {
                    return color.toString(16).padStart(6, '0').toUpperCase();
                }
                
                // CORRECCIÓN: Preparar comandos para INTERCAMBIAR colores correctamente
                const comandoRojo = `/colors red ${colorToHex(coloresAzul.colors[0])} ${colorToHex(coloresAzul.colors[1])} ${colorToHex(coloresAzul.colors[2])}`;
                const comandoAzul = `/colors blue ${colorToHex(coloresRojo.colors[0])} ${colorToHex(coloresRojo.colors[1])} ${colorToHex(coloresRojo.colors[2])}`;
                
                console.log('🔄 Comandos para intercambiar colores correctamente:');
                console.log('  Rojo (tomar colores del azul):', comandoRojo);
                console.log('  Azul (tomar colores del rojo):', comandoAzul);
                
                // Ejecutar intercambio con movimiento del bot
                ejecutarIntercambioCamisetasConBotMejorado(comandoRojo, comandoAzul)
                    .then((exito) => {
                        console.log(`🎯 Resultado del intercambio forzado: ${exito ? 'ÉXITO' : 'PARCIAL'}`);
                        resolve(exito);
                    })
                    .catch((error) => {
                        console.log('❌ Error en intercambio forzado:', error);
                        resolve(false);
                    });
                
            } else {
                console.log('⚠️ No se pudieron obtener colores válidos para intercambio');
                console.log('💡 Intentando usar colores guardados antes del swap');
                
                // Verificar si tenemos colores guardados antes del swap
if (coloresAntesDeLSwap.rojo && coloresAntesDeLSwap.azul && 
                    coloresAntesDeLSwap.rojo.colors && coloresAntesDeLSwap.azul.colors &&
                    Array.isArray(coloresAntesDeLSwap.rojo.colors) && Array.isArray(coloresAntesDeLSwap.azul.colors) &&
                    coloresAntesDeLSwap.rojo.colors.length >= 3 && coloresAntesDeLSwap.azul.colors.length >= 3 &&
                    coloresAntesDeLSwap.rojo.colors.some(c => c !== 0xFFFFFF) &&
                    coloresAntesDeLSwap.azul.colors.some(c => c !== 0xFFFFFF)) {
                    
                    console.log('✅ Usando colores guardados antes del swap');
                    
                    // Función para convertir color a hex
                    function colorToHex(color) {
                        return color.toString(16).padStart(6, '0').toUpperCase();
                    }
                    
                    // CORRECCIÓN: INTERCAMBIAR colores correctamente con colores guardados
                    const comandoRojo = `/colors red ${colorToHex(coloresAntesDeLSwap.azul.colors[0])} ${colorToHex(coloresAntesDeLSwap.azul.colors[1])} ${colorToHex(coloresAntesDeLSwap.azul.colors[2])}`;
                    const comandoAzul = `/colors blue ${colorToHex(coloresAntesDeLSwap.rojo.colors[0])} ${colorToHex(coloresAntesDeLSwap.rojo.colors[1])} ${colorToHex(coloresAntesDeLSwap.rojo.colors[2])}`;
                    
                    console.log('🔄 Comandos para intercambiar colores correctamente con colores guardados:');
                    console.log('  Rojo (tomar colores del azul):', comandoRojo);
                    console.log('  Azul (tomar colores del rojo):', comandoAzul);
                    
                    // Ejecutar intercambio con colores guardados
                    ejecutarIntercambioCamisetasConBotMejorado(comandoRojo, comandoAzul)
                        .then((exito) => {
                            console.log(`🎯 Resultado del intercambio con colores guardados: ${exito ? 'ÉXITO' : 'PARCIAL'}`);
                            resolve(exito);
                        })
                        .catch((error) => {
                            console.log('❌ Error en intercambio con colores guardados:', error);
                            resolve(false);
                        });
                        
                } else {
                    console.log('⚠️ No hay colores guardados válidos para intercambiar');
                    console.log('💡 No se puede hacer intercambio automático');
                    resolve(false);
                }
            }
            
        } catch (error) {
            console.log('❌ Error general en intercambio forzado:', error.message);
            resolve(false);
        }
    });
}
