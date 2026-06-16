import { Request, Response } from "express";
import { ComentarioService } from "../services/ComentarioService";

const service = new ComentarioService();

export class ComentarioController {

    async criarComentario(req: Request, res: Response) {
        try {

            const usuarioLogadoId = (req as any).usuarioId;
            const postagemId = Number(req.params.postagemId);

            const comentario = await service.criarComentario(
                usuarioLogadoId,
                postagemId,
                req.body
            );

            return res.status(201).json(comentario);

        } catch (error: any) {

            return res.status(400).json({
                erro: error.message
            });

        }
    }

    async listarComentarios(req: Request, res: Response) {
        try {

            const postagemId = Number(req.params.postagemId);

            const comentarios = await service.listarComentarios(
                postagemId
            );

            return res.json(comentarios);

        } catch (error: any) {

            return res.status(400).json({
                erro: error.message
            });

        }
    }

    async atualizarComentario(req: Request, res: Response) {
        try {

            const comentarioId = Number(req.params.id);
            const usuarioLogadoId = (req as any).usuarioId;

            const comentario = await service.atualizarComentario(
                comentarioId,
                usuarioLogadoId,
                req.body
            );

            return res.json(comentario);

        } catch (error: any) {

            return res.status(400).json({
                erro: error.message
            });

        }
    }

    async deletarComentario(req: Request, res: Response) {
        try {

            const comentarioId = Number(req.params.id);
            const usuarioLogadoId = (req as any).usuarioId;

            const resultado = await service.deletarComentario(
                comentarioId,
                usuarioLogadoId
            );

            return res.json(resultado);

        } catch (error: any) {

            return res.status(400).json({
                erro: error.message
            });

        }
    }
}