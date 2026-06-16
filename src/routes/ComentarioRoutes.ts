import { Router } from "express";
import { ComentarioController } from "../controllers/ComentarioController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new ComentarioController();

// apenas rotas protegidas:
router.get("/postagens/:postagemId/comentarios", authMiddleware, controller.listarComentarios);
router.post("/postagens/:postagemId/comentarios", authMiddleware, controller.criarComentario);
router.put("/comentarios/:id", authMiddleware, controller.atualizarComentario);
router.delete("/comentarios/:id", authMiddleware, controller.deletarComentario);

export default router;
