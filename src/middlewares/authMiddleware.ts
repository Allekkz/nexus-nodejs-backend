import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"


interface TokenPayload {
    id: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: "Token não fornecido" });
    }

    const [, token] = authHeader.split(" ");

    try {

        const decoded = jwt.verify(token, "segredo") as TokenPayload;

        (req as any).usuarioId = decoded.id;

        return next();

    } catch (error) {
        return res.status(401).json({ erro: "Token inválido" })
    }
}