import { Request, Response } from "express";
import { PostagemService } from "../services/PostagemService";

const postagemService = new PostagemService();

export class PostagemController {
    async criarPostagem(req: Request, res: Response) {
        try {
            const usuarioLogadoId = (req as any).usuarioId;

            const postagem = await postagemService.criarPostagem(usuarioLogadoId, req.body);

            return res.status(201).json(postagem);
        } catch (error: any) {
            return res.status(400).json({ erro: "Erro ao criar a postagem: " + error.message });
        }
    }

    async listarPostagens(req: Request, res: Response) {
        try {
            const postagens = await postagemService.listarPostagens();
            return res.json(postagens);
        } catch (error: any) {
            return res.status(500).json({ erro: "Erro ao listar as postagens" });
        }
    }

    async atualizarPostagem(req: Request, res: Response) {
        try {
            const postagemId = Number(req.params.id);
            const usuarioLogadoId = (req as any).usuarioId;

            const postagem = await postagemService.atualizarPostagem(postagemId, usuarioLogadoId, req.body);

            return res.json(postagem);
        } catch (error: any) {
            return res.status(400).json({
                erro: "Erro ao atualizar a postagem: " + error.message
            })
        }
    }

    async deletarPostagem(req: Request, res: Response) {
        try {
            const postagemId = Number(req.params.id);
            const usuarioLogadoId = (req as any).usuarioId;

            const resultado = await postagemService.deletarPostagem(postagemId, usuarioLogadoId);

            return res.json(resultado);
        }
        catch (error: any) {
            return res.status(400).json({
                erro: "Erro ao deletar a postagem: " + error.message
            })
        }
    }

    async buscarPostagemPorId(req: Request, res: Response) {
        try {

            const id = Number(req.params.id);

            const postagem = await postagemService.buscarPostagemPorId(id);

            return res.json(postagem);

        } catch (error: any) {

            return res.status(400).json({
                erro: error.message
            });

        }
    }

    async listarPostagensPorUsuario(req: Request, res: Response) {
        try {

            const usuarioId = Number(req.params.id);

            const postagens = await postagemService.listarPostagensPorUsuario(
                usuarioId
            );

            return res.json(postagens);

        } catch (error: any) {

            return res.status(400).json({
                erro: error.message
            });

        }
    }
}