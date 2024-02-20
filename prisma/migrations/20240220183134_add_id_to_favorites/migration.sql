-- AlterTable
CREATE SEQUENCE favorites_id_seq;
ALTER TABLE "Favorites" ALTER COLUMN "id" SET DEFAULT nextval('favorites_id_seq');
ALTER SEQUENCE favorites_id_seq OWNED BY "Favorites"."id";
