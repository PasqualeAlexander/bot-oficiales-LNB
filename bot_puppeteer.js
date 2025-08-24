const puppeteer = require('puppeteer');
const fs = require('fs');

class HaxballBot {
    constructor() {
        this.browser = null;
        this.page = null;
        this.isConnected = false;
        this.config = {
            roomName: "🏆🔹LNB | OFICIAL | HOST AMIS/OFIS🔹🏆",
            roomPassword: "LNB2025",
            maxPlayers: 28,
            roomPublic: true,
            token: "thr1.AAAAAGirYWqdkI8cxNX7Pg.jr6tfDSj5X8",
            geo: { code: 'AR', lat: -34.7000, lon: -58.2800 }
        };
    }

    async init() {
        try {
            console.log('🔄 Inicializando Puppeteer...');
            
            this.browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox', 
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            });

            this.page = await this.browser.newPage();
            
            // Configurar timeout más largo
            await this.page.setDefaultTimeout(30000);
            
            // Configurar user agent
            await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            
            console.log('🔄 Navegando a HaxBall Headless...');
            await this.page.goto('https://www.haxball.com/headless', { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });
            
            // Esperar a que HBInit esté disponible
            await this.page.waitForFunction('typeof HBInit !== "undefined"', { timeout: 30000 });
            
            console.log('✅ HBInit detectado, inyectando código del bot...');
            
            // Leer el código del bot
            const botCode = fs.readFileSync('./bot_lnb_oficiales.js', 'utf8');
            
            // Inyectar el código del bot en la página
            await this.page.evaluate((code) => {
                try {
                    eval(code);
                    console.log('✅ Bot inicializado correctamente');
                } catch (error) {
                    console.error('❌ Error al ejecutar el código del bot:', error);
                    throw error;
                }
            }, botCode);
            
            // Configurar manejador de errores de la página
            this.page.on('error', (err) => {
                console.error('❌ Error de página:', err);
            });

            this.page.on('pageerror', (err) => {
                console.error('❌ Error de JavaScript en página:', err);
            });

            // Configurar captura de logs de la consola del navegador
            this.page.on('console', (msg) => {
                const type = msg.type();
                const text = msg.text();
                
                if (type === 'error') {
                    console.error('🔴 [Browser Error]:', text);
                } else if (type === 'warn') {
                    console.warn('🟡 [Browser Warn]:', text);
                } else if (type === 'info') {
                    console.info('🔵 [Browser Info]:', text);
                } else {
                    console.log('⚪ [Browser]:', text);
                }
            });

            this.isConnected = true;
            console.log('🎉 Bot conectado y ejecutándose exitosamente!');
            
            // Mantener el proceso vivo
            this.keepAlive();
            
        } catch (error) {
            console.error('❌ Error al inicializar el bot:', error);
            await this.cleanup();
            process.exit(1);
        }
    }

    keepAlive() {
        // Verificar estado cada 30 segundos
        setInterval(async () => {
            try {
                if (!this.page || this.page.isClosed()) {
                    console.error('❌ Página cerrada, reiniciando...');
                    await this.restart();
                    return;
                }
                
                // Verificar si la página sigue respondiendo
                await this.page.evaluate(() => Date.now());
                
            } catch (error) {
                console.error('❌ Error en verificación de estado:', error);
                await this.restart();
            }
        }, 30000);
    }

    async restart() {
        console.log('🔄 Reiniciando bot...');
        await this.cleanup();
        setTimeout(() => this.init(), 5000); // Esperar 5 segundos antes de reiniciar
    }

    async cleanup() {
        console.log('🧹 Limpiando recursos...');
        
        try {
            if (this.page && !this.page.isClosed()) {
                await this.page.close();
            }
            if (this.browser) {
                await this.browser.close();
            }
        } catch (error) {
            console.error('❌ Error durante cleanup:', error);
        }
        
        this.isConnected = false;
        this.page = null;
        this.browser = null;
    }

    // Manejador de señales para cerrar limpiamente
    setupSignalHandlers() {
        const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
        
        signals.forEach((signal) => {
            process.on(signal, async () => {
                console.log(`\n📴 Recibida señal ${signal}, cerrando bot...`);
                await this.cleanup();
                process.exit(0);
            });
        });
    }
}

// Inicializar y ejecutar el bot
async function main() {
    const bot = new HaxballBot();
    
    // Configurar manejadores de señales
    bot.setupSignalHandlers();
    
    // Manejar errores no capturados
    process.on('unhandledRejection', async (error) => {
        console.error('❌ Error no manejado:', error);
        await bot.cleanup();
        process.exit(1);
    });
    
    // Inicializar bot
    await bot.init();
}

// Ejecutar si es el archivo principal
if (require.main === module) {
    main().catch(console.error);
}

module.exports = HaxballBot;
