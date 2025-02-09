const { typeormServer } = require("./setup");

beforeAll(async () => {
  await typeormServer.initialize()
})

afterAll(async () => {
  await typeormServer.destroy()
})