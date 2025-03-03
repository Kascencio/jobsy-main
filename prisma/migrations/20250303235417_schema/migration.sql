-- CreateTable
CREATE TABLE "categoria" (
    "cat_id" SERIAL NOT NULL,
    "cat_nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("cat_id")
);

-- CreateTable
CREATE TABLE "educacion" (
    "edu_id" SERIAL NOT NULL,
    "edu_usuario_id" INTEGER NOT NULL,
    "edu_institucion" VARCHAR(255) NOT NULL,
    "edu_titulo" VARCHAR(255) NOT NULL,
    "edu_fecha_inicio" DATE NOT NULL,
    "edu_fecha_fin" DATE,

    CONSTRAINT "educacion_pkey" PRIMARY KEY ("edu_id")
);

-- CreateTable
CREATE TABLE "empleo" (
    "emp_id" SERIAL NOT NULL,
    "emp_titulo" VARCHAR(255) NOT NULL,
    "emp_descripcion" TEXT,
    "emp_empresa_id" INTEGER NOT NULL,
    "emp_categoria_id" INTEGER NOT NULL,
    "emp_fecha_publicacion" DATE NOT NULL,
    "emp_salario_min" DECIMAL(10,2),
    "emp_salario_max" DECIMAL(10,2),
    "emp_tipo_contrato" VARCHAR(100),
    "emp_requisitos" TEXT,
    "emp_beneficios" TEXT,
    "emp_num_vacantes" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empleo_pkey" PRIMARY KEY ("emp_id")
);

-- CreateTable
CREATE TABLE "empresa" (
    "emp_id" SERIAL NOT NULL,
    "emp_nombre" VARCHAR(255) NOT NULL,
    "emp_sector" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("emp_id")
);

-- CreateTable
CREATE TABLE "experiencia" (
    "exp_id" SERIAL NOT NULL,
    "exp_usuario_id" INTEGER NOT NULL,
    "exp_puesto" VARCHAR(255) NOT NULL,
    "exp_empresa" VARCHAR(255) NOT NULL,
    "exp_fecha_inicio" DATE NOT NULL,
    "exp_fecha_fin" DATE,
    "exp_descripcion" TEXT,

    CONSTRAINT "experiencia_pkey" PRIMARY KEY ("exp_id")
);

-- CreateTable
CREATE TABLE "favorito" (
    "fav_id" SERIAL NOT NULL,
    "fav_usuario_id" INTEGER NOT NULL,
    "fav_empleo_id" INTEGER NOT NULL,

    CONSTRAINT "favorito_pkey" PRIMARY KEY ("fav_id")
);

-- CreateTable
CREATE TABLE "postulacion" (
    "pos_id" SERIAL NOT NULL,
    "pos_usuario_id" INTEGER NOT NULL,
    "pos_empleo_id" INTEGER NOT NULL,
    "pos_fecha_postulacion" DATE NOT NULL,
    "pos_estado" VARCHAR(50) NOT NULL DEFAULT 'Enviada',

    CONSTRAINT "postulacion_pkey" PRIMARY KEY ("pos_id")
);

-- CreateTable
CREATE TABLE "CV" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "content" BYTEA NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "CV_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "usu_id" SERIAL NOT NULL,
    "usu_nombre" VARCHAR(100) NOT NULL,
    "usu_apellido" VARCHAR(100),
    "usu_email" VARCHAR(255) NOT NULL,
    "usu_password" VARCHAR(255) NOT NULL,
    "usu_rol" VARCHAR(50) NOT NULL DEFAULT 'candidato',
    "usu_telefono" VARCHAR(20),
    "usu_direccion" VARCHAR(255),
    "usu_foto" VARCHAR(255),
    "usu_resumen" TEXT,
    "empresa_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("usu_id")
);

-- CreateTable
CREATE TABLE "habilidad" (
    "hab_id" SERIAL NOT NULL,
    "hab_nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "habilidad_pkey" PRIMARY KEY ("hab_id")
);

-- CreateTable
CREATE TABLE "usuario_habilidad" (
    "usuario_id" INTEGER NOT NULL,
    "habilidad_id" INTEGER NOT NULL,

    CONSTRAINT "usuario_habilidad_pkey" PRIMARY KEY ("usuario_id","habilidad_id")
);

-- CreateTable
CREATE TABLE "empleo_habilidad" (
    "empleo_id" INTEGER NOT NULL,
    "habilidad_id" INTEGER NOT NULL,

    CONSTRAINT "empleo_habilidad_pkey" PRIMARY KEY ("empleo_id","habilidad_id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "educacion_edu_usuario_id_idx" ON "educacion"("edu_usuario_id");

-- CreateIndex
CREATE INDEX "empleo_emp_categoria_id_idx" ON "empleo"("emp_categoria_id");

-- CreateIndex
CREATE INDEX "empleo_emp_empresa_id_idx" ON "empleo"("emp_empresa_id");

-- CreateIndex
CREATE INDEX "experiencia_exp_usuario_id_idx" ON "experiencia"("exp_usuario_id");

-- CreateIndex
CREATE INDEX "favorito_fav_empleo_id_idx" ON "favorito"("fav_empleo_id");

-- CreateIndex
CREATE INDEX "favorito_fav_usuario_id_idx" ON "favorito"("fav_usuario_id");

-- CreateIndex
CREATE INDEX "postulacion_pos_empleo_id_idx" ON "postulacion"("pos_empleo_id");

-- CreateIndex
CREATE INDEX "postulacion_pos_usuario_id_idx" ON "postulacion"("pos_usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "postulacion_pos_usuario_id_pos_empleo_id_key" ON "postulacion"("pos_usuario_id", "pos_empleo_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_usu_email_key" ON "usuario"("usu_email");

-- CreateIndex
CREATE INDEX "usuario_empresa_id_idx" ON "usuario"("empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- AddForeignKey
ALTER TABLE "educacion" ADD CONSTRAINT "educacion_edu_usuario_id_fkey" FOREIGN KEY ("edu_usuario_id") REFERENCES "usuario"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empleo" ADD CONSTRAINT "empleo_emp_empresa_id_fkey" FOREIGN KEY ("emp_empresa_id") REFERENCES "empresa"("emp_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empleo" ADD CONSTRAINT "empleo_emp_categoria_id_fkey" FOREIGN KEY ("emp_categoria_id") REFERENCES "categoria"("cat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiencia" ADD CONSTRAINT "experiencia_exp_usuario_id_fkey" FOREIGN KEY ("exp_usuario_id") REFERENCES "usuario"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorito" ADD CONSTRAINT "favorito_fav_usuario_id_fkey" FOREIGN KEY ("fav_usuario_id") REFERENCES "usuario"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorito" ADD CONSTRAINT "favorito_fav_empleo_id_fkey" FOREIGN KEY ("fav_empleo_id") REFERENCES "empleo"("emp_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postulacion" ADD CONSTRAINT "postulacion_pos_empleo_id_fkey" FOREIGN KEY ("pos_empleo_id") REFERENCES "empleo"("emp_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postulacion" ADD CONSTRAINT "postulacion_pos_usuario_id_fkey" FOREIGN KEY ("pos_usuario_id") REFERENCES "usuario"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CV" ADD CONSTRAINT "CV_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("usu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("emp_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_habilidad" ADD CONSTRAINT "usuario_habilidad_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_habilidad" ADD CONSTRAINT "usuario_habilidad_habilidad_id_fkey" FOREIGN KEY ("habilidad_id") REFERENCES "habilidad"("hab_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empleo_habilidad" ADD CONSTRAINT "empleo_habilidad_empleo_id_fkey" FOREIGN KEY ("empleo_id") REFERENCES "empleo"("emp_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empleo_habilidad" ADD CONSTRAINT "empleo_habilidad_habilidad_id_fkey" FOREIGN KEY ("habilidad_id") REFERENCES "habilidad"("hab_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuario"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuario"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;
