import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaModule } from './categoria/CategoriaModule';
import { ProdutoModule } from './produto/ProdutoModule';
import { Categoria } from './categoria/entities/categoria.entity';
import { Produto } from './produto/entities/produto.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'westwing',
      database: 'db_loja_games',
      entities: [Categoria, Produto],
      synchronize: true
    }),
    CategoriaModule,
    ProdutoModule
  ]
})
export class AppModule {}
