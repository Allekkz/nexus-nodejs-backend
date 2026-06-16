import { CriarUsuarioDTO } from "../dtos/CriarUsuarioDTO";
import { LoginDTO } from "../dtos/LoginDTO";
import { UpdateUsuarioDTO } from "../dtos/UpdateUsuarioDTO";
import { prisma } from "../lib/PrismaCliente";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UsuarioService {

    async registrar(data: CriarUsuarioDTO) {

        // campos obrigatórios
        if (!data.nome || !data.email || !data.senha || !data.curso) {
            throw new Error("Os campos 'nome, email, senha e curso' devem ser preenchidos");
        }

        // validação de email:
        if (!data.email.includes("@") || !data.email.includes(".")) {
            throw new Error("Email inválido");
        }

        const emailValido = data.email.toLocaleLowerCase();

        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                email: emailValido
            }
        });

        if (usuarioExiste) {
            throw new Error("Email já cadastrado");
        }

        const hash = await bcrypt.hash(data.senha, 10);

        const usuario = await prisma.usuario.create({
            data: {
                nome: data.nome,
                email: emailValido,
                senha: hash,
                curso: data.curso,
                imgUrl: data.imgUrl,
                bio: data.bio || ""
            },
            select: {
                id: true,
                nome: true,
                email: true,
                imgUrl: true,
                bio: true,
                createdAt: true
            }
        });

        return usuario;

    }

    async login(data: LoginDTO) {
        if (!data.email || !data.senha) {
            throw new Error("Email e senha são obrigatórios");
        }

        const emailValido = data.email.toLowerCase();

        const usuario = await prisma.usuario.findUnique({
            where: {
                email: emailValido
            }
        });

        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }

        const senhaValida = await bcrypt.compare(data.senha, usuario.senha);

        if (!senhaValida) {
            throw new Error("Login ou senha inválidos");
        }

        const token = jwt.sign(
            { id: usuario.id },
            "segredo",
            { expiresIn: "1d" }
        );

        return {
            user: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                imgUrl: usuario.imgUrl,
                bio: usuario.bio,
            },
            token
        };
    }

    async listar() {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                imgUrl: true,
                bio: true,
                curso: true,
                createdAt: true
            }
        });

        return usuarios;
    }

    async atualizar(id: number, data: UpdateUsuarioDTO) {

        if (!id) {
            throw new Error("ID é obrigatório");
        }

        if (data.email) {
            if (!data.email.includes("@") || !data.email.includes(".")) {
                throw new Error("Email inválido");
            }

            data.email = data.email.toLowerCase();

            const emailExiste = await prisma.usuario.findUnique({
                where: { email: data.email }
            });

            if (emailExiste && emailExiste.id !== id) {
                throw new Error("Email já está em uso");
            }
        }

        if (data.senha) {
            data.senha = await bcrypt.hash(data.senha, 10);
        }

        const usuario = await prisma.usuario.update({
            where: { id },
            data,
            select: {
                id: true,
                nome: true,
                email: true,
                imgUrl: true,
                bio: true,
                updatedAt: true
            }
        });

        return usuario;
    }

    async excluir(id: number) {

        if (!id) {
            throw new Error("ID é obrigatório");
        }

        await prisma.usuario.delete({
            where: { id }
        });

        return { mensagem: "Usuário excluído com sucesso" };
    }

    async buscarPerfil(usuarioId: number) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            select: {
                id: true,
                nome: true,
                email: true,
                curso: true,
                imgUrl: true,
                bio: true,
                createdAt: true,

                _count: {
                    select: {
                        postagens: true,
                        comentarios: true,
                    }
                }
            }
        });

        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }

        return usuario;
    }

    async buscarPorId(usuarioId: number) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            select: {
                id: true,
                nome: true,
                email: true,
                curso: true,
                imgUrl: true,
                bio: true,
                createdAt: true,

                _count: {
                    select: {
                        postagens: true,
                        comentarios: true
                    }
                },

                postagens: {
                    orderBy: {
                        createdAt: "desc"
                    },
                    select: {
                        id: true,
                        titulo: true,
                        descricao: true,
                        imgUrl: true,
                        createdAt: true,

                        _count: {
                            select: {
                                comentarios: true,
                                curtidas: true
                            }
                        }
                    }
                }
            }
        });

        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }

        return usuario;
    }

}