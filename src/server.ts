import express from 'express';
import cors from "cors";

import UsuarioRoutes from "./routes/UsuarioRoutes";
import PostagemRoutes from "./routes/PostagemRoutes";
import ComentarioRoutes from "./routes/ComentarioRoutes";
import CurtidaRoutes from "./routes/CurtidaRoutes";

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("A API está online")
})

// registrando as rotas aqui no server.ts:
app.use("/usuarios", UsuarioRoutes);
app.use("/postagens", PostagemRoutes);
app.use("/", ComentarioRoutes);
app.use("/", CurtidaRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT)
})