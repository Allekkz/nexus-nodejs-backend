import { Router } from "express";
import { CurtidaController } from "../controllers/CurtidaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new CurtidaController();

// listar curtidas
router.get(
    "/postagens/:postagemId/curtidas",
    authMiddleware,
    controller.listarCurtidas
);

// TOGGLE (curtir/descurtir)
router.post(
    "/postagens/:postagemId/curtidas",
    authMiddleware,
    controller.toggleCurtida
);

export default router;