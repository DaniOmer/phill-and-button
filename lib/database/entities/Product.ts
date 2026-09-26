import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ProductImage } from "./ProductImage";
import { ProductCategory } from "./ProductCategory";
import { ProductSize } from "./ProductSize";

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

  @Column({ type: "boolean", default: false })
  available_on_order: boolean;

  @Column({ type: "uuid", nullable: true })
  category_id: string | null;

  @ManyToOne(() => ProductCategory, {
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: "category_id" })
  category: ProductCategory | null;

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
    eager: false,
  })
  images: ProductImage[];

  @OneToMany(() => ProductSize, (size) => size.product, {
    cascade: true,
    eager: false,
  })
  sizes: ProductSize[];

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}
