import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Categoria } from "../entities/categoria.entity";
import { DeleteResult, ILike, Repository } from "typeorm";

@Injectable()
export class CategoriaService {
    
    constructor(
        @InjectRepository(Categoria)
        private categoriaRepository: Repository<Categoria>
    ) { }

    async findAll(): Promise<Categoria[]> {
        const categorias = await this.categoriaRepository.find({
            relations: {
                produtos: true
            }
        });
        return categorias;
    }

    async findById(id: number): Promise<Categoria> {
        const categoria = await this.categoriaRepository.findOne({
            where: {
                id: id
            },
            relations: {
                produtos: true
            }
        });

        if (!categoria) {
            throw new HttpException("Categoria não encontrada!", HttpStatus.NOT_FOUND);
        }

        return categoria;
    }

    async findByTitulo(titulo: string): Promise<Categoria[]> {
        const categorias = await this.categoriaRepository.find({
            where: {
                titulo: ILike(`%${titulo}%`)
            },
            relations: {
                produtos: true
            }
        });

        if (!categorias || categorias.length === 0) {
            throw new HttpException("Categoria não encontrada!", HttpStatus.NOT_FOUND);
        }

        return categorias;
    }

    async create(categoria: Categoria): Promise<Categoria> {
        const buscaCateg = await this.categoriaRepository.findOne({
            where: { titulo: categoria.titulo }
        });
        
        if (buscaCateg) {
            throw new HttpException("Categoria já existe!", HttpStatus.CONFLICT);
        }

        categoria.titulo = categoria.titulo.toLowerCase();
        categoria.descricao = categoria.descricao.toLowerCase();

        return await this.categoriaRepository.save(categoria);
    }

    async update(categoria: Categoria): Promise<Categoria> {
        const buscaCateg = await this.findById(categoria.id);

        if (!buscaCateg) {
            throw new HttpException("Categoria não encontrada!", HttpStatus.NOT_FOUND);
        }

        categoria.titulo = categoria.titulo.toLowerCase();

        const validaCateg = await this.categoriaRepository.findOne({
            where: { titulo: categoria.titulo }
        });
        
        if (validaCateg && validaCateg.id !== categoria.id) {
            throw new HttpException("Categoria já existe!", HttpStatus.CONFLICT);
        }

        categoria.descricao = categoria.descricao.toLowerCase();

        return this.categoriaRepository.save(categoria);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findById(id);

        return await this.categoriaRepository.delete(id);
    }
}