-- AlterTable
CREATE SEQUENCE foodcategory_id_seq;
ALTER TABLE "Foodcategory" ALTER COLUMN "id" SET DEFAULT nextval('foodcategory_id_seq');
ALTER SEQUENCE foodcategory_id_seq OWNED BY "Foodcategory"."id";
