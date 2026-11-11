import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BeforeInsert } from 'typeorm';
import { encryption } from '../database.encryption';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, transformer: encryption })
  email: string;

  @Column({ transformer: encryption })
  passwordHash: string; 

  @Column({ transformer: encryption, nullable: true})
  createdAt: string; 

  @BeforeInsert()
  setDefaultCreatedAt() {
    if (!this.createdAt) {
      this.createdAt = new Date().toISOString();
    }
  }
};

