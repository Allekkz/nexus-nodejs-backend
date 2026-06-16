import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new UsuarioController();

// públicas
router.post("/register", controller.registrar);
router.post("/login", controller.login);

// protegidas
router.put("/:id", authMiddleware, controller.atualizar);
router.delete("/:id", authMiddleware, controller.excluir);
router.get("/", authMiddleware, controller.listar);
router.get("/me", authMiddleware, controller.perfil);
router.get("/:id", authMiddleware, controller.buscarPorId);

export default router;