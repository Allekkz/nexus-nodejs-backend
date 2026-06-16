import { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";

const service = new UsuarioService();

export class UsuarioController {

    async registrar(req: Request, res: Response) {
        try {
            const usuario = await service.registrar(req.body);
            return res.status(201).json(usuario);
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const result = await service.login(req.body);
            return res.json(result);
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    async listar(req: Request, res: Response) {
        try {
            const usuarios = await service.listar();
            return res.json(usuarios);
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const usuarioLogado = (req as any).usuarioId;

            if (usuarioLogado !== id) {
                return res.status(403).json({
                    erro: "Você não pode atualizar o perfil de outro usuário"
                })
            }

            const usuario = await service.atualizar(id, req.body);
            return res.json(usuario);
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    async excluir(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const usuarioLogado = (req as any).usuarioId;

            if (usuarioLogado !== id) {
                return res.status(403).json({
                    erro: "Você não pode excluir o perfil de outro usuário"
                })
            }

            const result = await service.excluir(id);
            return res.json(result);
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    async perfil(req: Request, res: Response) {
        try {

            const usuarioId = (req as any).usuarioId;

            const usuario = await service.buscarPerfil(usuarioId);

            return res.json(usuario);

        } catch (error: any) {

            return res.status(400).json({
                erro: error.message
            });

        }
    }

    async buscarPorId(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const usuario = await service.buscarPorId(id);

            return res.json(usuario);

        } catch (error: any) {
            return res.status(400).json({
                erro: error.message
            });
        }
    }
}