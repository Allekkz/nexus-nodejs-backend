import { CriarPostagemDTO } from "../dtos/CriarPostagemDTO";
import { UpdatePostagemDTO } from "../dtos/UpdatePostagemDTO";
import { prisma } from "../lib/PrismaCliente";


export class PostagemService {
    async criarPostagem(autorId: number, data: CriarPostagemDTO) {
        if (!data.titulo || !data.descricao) {
            throw new Error("Título e descrição são obrigatórios.");
        }

        const postagem = await prisma.postagem.create({
            data: {
                titulo: data.titulo,
                descricao: data.descricao,
                imgUrl: data.imgUrl,
                autorId
            },

            select: {
                id: true,
                titulo: true,
                descricao: true,
                imgUrl: true,
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

        return postagem;
    }

    async listarPostagens() {
        const postagens = await prisma.postagem.findMany({
            select: {
                id: true,
                titulo: true,
                descricao: true,
                imgUrl: true,
                createdAt: true,

                autor: {
                    select: {
                        id: true,
                        nome: true,
                        imgUrl: true
                    }
                },

                // 🌟 ADICIONADO AQUI: Traz a lista de quem curtiu para o feed geral
                curtidas: true,

                comentarios: {
                    orderBy: {
                        createdAt: "desc"
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
                },

                _count: {
                    select: {
                        comentarios: true,
                        curtidas: true
                    }
                }
            },

            orderBy: {
                createdAt: "desc"
            }
        });

        return postagens;
    }

    async atualizarPostagem(postagemId: number, usuarioLogadoId: number, data: UpdatePostagemDTO) {

        if (!data.titulo && !data.descricao && !data.imgUrl) {
            throw new Error("Informe ao menos um campo para atualizar a postagem.");
        }

        const postagemExiste = await prisma.postagem.findUnique({
            where: { id: postagemId },
            select: {
                autorId: true
            }
        });

        if (!postagemExiste) {
            throw new Error("Postagem não encontrada.");
        }

        if (postagemExiste.autorId !== usuarioLogadoId) {
            throw new Error("Você não tem permissão para atualizar esta postagem.");
        }

        const postagem = await prisma.postagem.update({
            where: { id: postagemId },
            data,
            select: {
                id: true,
                titulo: true,
                descricao: true,
                imgUrl: true,
                updatedAt: true,

                autor: {
                    select: {
                        id: true,
                        nome: true,
                        imgUrl: true
                    }
                }
            }
        });

        return postagem;
    }

    async deletarPostagem(postagemId: number, usuarioLogadoId: number) {
        const postagemExiste = await prisma.postagem.findUnique({
            where: { id: postagemId },
            select: {
                autorId: true
            }
        });

        if (!postagemExiste) {
            throw new Error("Postagem não encontrada.");
        }

        if (postagemExiste.autorId !== usuarioLogadoId) {
            throw new Error("Você não tem permissão para deletar esta postagem.");
        }

        await prisma.postagem.delete({
            where: { id: postagemId }
        });

        return {
            mensagem: "Postagem deletada com sucesso."
        };
    }

    async buscarPostagemPorId(id: number) {

        const postagem = await prisma.postagem.findUnique({

            where: {
                id
            },

            select: {
                id: true,
                titulo: true,
                descricao: true,
                imgUrl: true,
                createdAt: true,
                updatedAt: true,

                autor: {
                    select: {
                        id: true,
                        nome: true,
                        imgUrl: true
                    }
                },

                // 🌟 ADICIONADO AQUI: Garante que as curtidas apareçam na busca por ID individual
                curtidas: true,

                comentarios: {
                    orderBy: {
                        createdAt: "desc"
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
                },

                _count: {
                    select: {
                        comentarios: true,
                        curtidas: true
                    }
                }
            }
        });

        if (!postagem) {
            throw new Error("Postagem não encontrada.");
        }

        return postagem;
    }

    async listarPostagensPorUsuario(usuarioId: number) {

        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                id: usuarioId
            },
            select: {
                id: true
            }
        });

        if (!usuarioExiste) {
            throw new Error("Usuário não encontrado.");
        }

        const postagens = await prisma.postagem.findMany({

            where: {
                autorId: usuarioId
            },

            select: {
                id: true,
                titulo: true,
                descricao: true,
                imgUrl: true,
                createdAt: true,
                autor: {
                    select: {
                        id: true,
                        nome: true,
                        imgUrl: true
                    }
                },

                // 🌟 ADICIONADO AQUI: Garante as curtidas na listagem do perfil de um usuário
                curtidas: true,

                comentarios: {
                    orderBy: {
                        createdAt: "desc"
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
                },

                _count: {
                    select: {
                        comentarios: true,
                        curtidas: true
                    }
                }
            },

            orderBy: {
                createdAt: "desc"
            }
        });

        return postagens;
    }
}