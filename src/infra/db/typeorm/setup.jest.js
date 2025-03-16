const { typeormServer } = require("./setup");

beforeAll(async () => {
  if (!typeormServer.isInitialized) {
    try {
      await typeormServer.initialize();
      console.log("✅ Banco de dados conectado!");
    } catch (error) {
      console.error("❌ Erro ao conectar ao banco:", error);
      process.exit(1);
    }
  }
});

afterAll(async () => {
  if (typeormServer.isInitialized) {
    try {
      await typeormServer.destroy();
      console.log("🔌 Conexão com banco de dados fechada.");
    } catch (error) {
      console.error("❌ Erro ao fechar a conexão:", error);
    }
  }
});
