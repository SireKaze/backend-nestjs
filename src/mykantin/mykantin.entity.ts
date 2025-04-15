import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mykantin")
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: string;

  @Column()
  imageUrl: string;

  @Column()
  rating: string;
}