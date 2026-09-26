import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from "typeorm";
import { Product } from "./Product";

@Entity("product_sizes")
@Unique(["product_id", "size"])
export class ProductSize {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  product_id: string;

  @ManyToOne(() => Product, (product) => product.sizes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ type: "text" })
  size: string;

  @Column({ type: "integer", default: 0 })
  stock: number;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
