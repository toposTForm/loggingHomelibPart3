-- AlterTable
CREATE SEQUENCE user_version_seq;
ALTER TABLE "User" ALTER COLUMN "version" SET DEFAULT nextval('user_version_seq');
ALTER SEQUENCE user_version_seq OWNED BY "User"."version";
