import { Router } from 'express';
import { PostagemController } from '../controllers/PostagemController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const controller = new PostagemController();

// apenas protegidas:
router.get("/", authMiddleware, controller.listarPostagens);
router.get("/:id", authMiddleware, controller.buscarPostagemPorId);
router.get("/usuario/:id", authMiddleware, controller.listarPostagensPorUsuario);

router.post("/", authMiddleware, controller.criarPostagem);
router.put("/:id", authMiddleware, controller.atualizarPostagem);
router.delete("/:id", authMiddleware, controller.deletarPostagem);

export default router;