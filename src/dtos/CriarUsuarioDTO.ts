export interface CriarUsuarioDTO {
    nome: string;
    email: string;
    senha: string;
    curso: string;
    imgUrl?: string;
    bio?: string;
}