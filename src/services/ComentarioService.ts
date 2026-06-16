import { prisma } from "../lib/PrismaCliente";
import { CriarComentarioDTO } from "../dtos/CriarComentarioDTO";
import { UpdateComentarioDTO } from "../dtos/UpdateComentarioDTO";

export class ComentarioService {
    async criarComentario(autorId: number, postagemId: number, data: CriarComentarioDTO) {
        if (!data.conteudo) {
            throw new Error("O conteúdo do comentário é obrigatório.");
        }

        const postagemExiste = await prisma.postagem.findUnique({
            where: { id: postagemId },
            select: { id: true }
        });

        if (!postagemExiste) {
            throw new Error("A postagem para a qual o comentário está sendo criado não existe.");
        }

        const comentario = await prisma.comentario.create({
            data: {
                conteudo: data.conteudo,
                autorId,
                postagemId
            },

            select: {
                id: true,
                conteudo: true,
                createdAt: true,

                autor: {
                    select: {
                        id: true,
                        nome: true,
                        imgUrl: true
                    }
                }
            }
        });

        return comentario;
    }

    async listarComentarios(postagemId: number) {
        const postagemExiste = await prisma.postagem.findUnique({
            where: { id: postagemId },
            select: { id: true }
        });

        if (!postagemExiste) {
            throw new Error("A postagem para a qual os comentários estão sendo listados não existe.");
        }

        const comentarios = await prisma.comentario.findMany({
            where: { postagemId },

            select: {
                id: true,
                conteudo: true,
                createdAt: true,

                autor: {
                    select: {
                        id: true,
                        nome: true,
                        imgUrl: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return comentarios;
    }

    async atualizarComentario(comentarioId: number, usuarioLogadoId: number, data: UpdateComentarioDTO) {
        if (!data.conteudo) {
            throw new Error("O conteúdo do comentário é obrigatório para atualização.");
        }

        const comentarioExiste = await prisma.comentario.findUnique({
            where: { id: comentarioId },
            select: { autorId: true }
        });

        if (!comentarioExiste) {
            throw new Error("O comentário que você está tentando atualizar não existe.");
        };

        if (comentarioExiste.autorId !== usuarioLogadoId) {
            throw new Error("Você só pode atualizar seus próprios comentários.");
        }

        const comentarioAtualizado = await prisma.comentario.update({
            where: { id: comentarioId },
            data: { conteudo: data.conteudo },
            select: {
                id: true,
                conteudo: true,
                createdAt: true,

                autor: {
                    select: {
                        id: true,
                        nome: true,
                        imgUrl: true
                    }
                }
            }
        });

        return comentarioAtualizado;
    }

    async deletarComentario(comentarioId: number, usuarioLogadoId: number) {
        const comentarioExiste = await prisma.comentario.findUnique({
            where: { id: comentarioId },
            select: { autorId: true }
        });

        if (!comentarioExiste) {
            throw new Error("O comentário que você está tentando deletar não existe.");
        }

        if (comentarioExiste.autorId !== usuarioLogadoId) {
            throw new Error("Você só pode deletar seus próprios comentários.");
        }

        await prisma.comentario.delete({
            where: { id: comentarioId }
        });

        return { message: "Comentário deletado com sucesso." };
    }
}