import { InjectRepository } from "@nestjs/typeorm";
import { Produto } from "../entities/produto.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, ILike, Repository } from "typeorm";
import { CategoriaService } from "src/categoria/services/categoria.service";

@Injectable()
export class ProdutoService {

    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
        private categoriaService: CategoriaService
    ) { }

    async findAll(): Promise<Produto[]> {
        return await this.produtoRepository.find();
    }

    async findById(id: number): Promise<Produto> {
        const produto = await this.produtoRepository.findOne({
            where: {
                id: id
            }
        });

        if (!produto) {
            throw new HttpException("Produto não encontrado!", HttpStatus.NOT_FOUND);
        }

        return produto;
    }

    async findByTitulo(titulo: string): Promise<Produto[]> {
        const produtos = await this.produtoRepository.find({
            where: {
                titulo: ILike(`%${titulo}%`)
            }
        });

        if (!produtos || produtos.length === 0) {
            throw new HttpException("Produto não encontrado!", HttpStatus.NOT_FOUND);
        }

        return produtos;
    }

    async create(produto: Produto): Promise<Produto> {
        const buscaCateg = await this.categoriaService.findById(produto.categoria.id);

        const buscaProd = await this.produtoRepository.findOne({
            where: {
                sku: produto.sku
             }
        });

        if (buscaProd != null) {
            throw new HttpException("O SKU desse produto já foi registrado!", HttpStatus.CONFLICT);
        }

        produto.titulo = produto.titulo.toLowerCase();
        produto.sku = produto.sku.toUpperCase();

        return await this.produtoRepository.save(produto);
    }

    async update(produto: Produto): Promise<Produto> {
        const buscaCateg = await this.categoriaService.findById(produto.categoria.id);
        const buscaProd = await this.findById(produto.id);

        produto.titulo = produto.titulo.toLowerCase();

        const validaProd = await this.produtoRepository.findOne({
            where: { titulo: produto.titulo }
        });
        
        if (validaProd && validaProd.id !== produto.id) {
            throw new HttpException("Produto já existe!", HttpStatus.CONFLICT);
        }

        produto.sku = produto.sku.toLowerCase();

        return await this.produtoRepository.save(produto);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findById(id);

        return await this.produtoRepository.delete(id);
    }
}