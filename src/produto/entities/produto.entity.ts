import { IsNotEmpty, Min } from "class-validator";
import { Categoria } from "src/categoria/entities/categoria.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tb_produtos'})
export class Produto {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({length: 100, nullable: false})
    titulo: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    valor: number;

    @Min(0)
    @Column({ type: 'int'})
    quantidade: number;

    @Column({length: 200, nullable: false, unique: true})
    sku: string;


    @ManyToOne(() => Categoria, (categoria) => categoria.produtos, { onDelete: 'CASCADE' })
    categoria: Categoria;
}