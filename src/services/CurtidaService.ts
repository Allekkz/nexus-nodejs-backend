import { prisma } from "../lib/PrismaCliente";

export class CurtidaService {

    async toggleCurtida(usuarioId: number, postagemId: number) {

        const postagemExiste = await prisma.postagem.findUnique({
            where: { id: postagemId },
            select: { id: true }
        });

        if (!postagemExiste) {
            throw new Error("Postagem não encontrada.");
        }

        const curtidaExiste = await prisma.curtida.findUnique({
            where: {
                usuarioId_postagemId: {
                    usuarioId,
                    postagemId
                }
            }
        });

        // SE JÁ CURTIU → REMOVE CURTIDA
        if (curtidaExiste) {
            await prisma.curtida.delete({
                where: {
                    usuarioId_postagemId: {
                        usuarioId,
                        postagemId
                    }
                }
            });

            return {
                curtido: false,
                mensagem: "Curtida removida"
            };
        }

        // SE NÃO CURTIU → CRIA CURTIDA
        await prisma.curtida.create({
            data: {
                usuarioId,
                postagemId
            }
        });

        return {
            curtido: true,
            mensagem: "Postagem curtida"
        };
    }

    async listarCurtidas(postagemId: number) {

        return await prisma.curtida.findMany({
            where: { postagemId },
            select: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        imgUrl: true
                    }
                }
            }
        });
    }
}