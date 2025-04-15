import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn , ColumnOptions } from 'typeorm';

@Entity('siswa')
export class Siswa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama: string;

  @Column()
  tempat_lahir?: string;

  @Column({ type: 'date', nullable: true })
  tanggal_lahir: Date;

  @Column()
  nisn: string;

  @Column()
  nik: string;

  @Column()
  email?: string;

  @Column()
  alamat: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}