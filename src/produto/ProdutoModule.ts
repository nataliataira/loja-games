import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Produto } from "src/produto/entities/produto.entity";
import { ProdutoService } from "./services/produto.service";
import { ProdutoController } from "./controllers/produto.controller";
import { CategoriaService } from "src/categoria/services/categoria.service";
import { CategoriaModule } from "src/categoria/CategoriaModule";

@Module({
    imports: [
        TypeOrmModule.forFeature([Produto]),
        CategoriaModule
    ],
    providers: [ProdutoService],
    controllers: [ProdutoController],
    exports: [TypeOrmModule]
})
export class ProdutoModule {}