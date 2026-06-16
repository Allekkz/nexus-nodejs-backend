import { Request, Response } from "express";
import { CurtidaService } from "../services/CurtidaService";

const service = new CurtidaService();

export class CurtidaController {

    async toggleCurtida(req: Request, res: Response) {
        try {

            const usuarioId = (req as any).usuarioId;
            const postagemId = Number(req.params.postagemId);

            const resultado = await service.toggleCurtida(
                usuarioId,
                postagemId
            );

            return res.status(200).json(resultado);

        } catch (error: any) {

            return res.status(400).json({
                erro: error.message
            });

        }
    }

    async listarCurtidas(req: Request, res: Response) {
        try {

            const postagemId = Number(req.params.postagemId);

            const curtidas = await service.listarCurtidas(postagemId);

            return res.json(curtidas);

        } catch (error: any) {

            return res.status(400).json({
                erro: error.message
            });

        }
    }
}