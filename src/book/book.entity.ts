import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Book extends BaseEntity {
   @PrimaryGeneratedColumn()
   id : Number;

   @Column()
   title:string;

   @Column()
   author:string;

   @Column()
   year:number;

   @Column({type : 'text'})
   deskripsi:string;

   @Column({type : 'datetime' , default : () => 'CURRENT_TIMESTAMP'})
   create_at: Date;

   @Column({type : 'datetime' , default : () => 'CURRENT_TIMESTAMP'})
   update_at: Date;
}