import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

export type UserRole = "admin" | "user";

@Entity("profiles")
export class Profile {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "text", default: "user" })
  role: UserRole;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
