import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { ProductImage } from "./ProductImage";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "boolean", default: false })
  is_trending: boolean;

  @Column({ type: "integer", default: 0 })
  stock: number;

  @Column({ type: "text", nullable: true })
  category: string | null;

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
    eager: false,
  })
  images: ProductImage[];

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}
