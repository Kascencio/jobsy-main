-- CreateTable
CREATE TABLE `categoria` (
    `cat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cat_nombre` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`cat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `educacion` (
    `edu_id` INTEGER NOT NULL AUTO_INCREMENT,
    `edu_usuario_id` INTEGER NOT NULL,
    `edu_institucion` VARCHAR(255) NOT NULL,
    `edu_titulo` VARCHAR(255) NOT NULL,
    `edu_fecha_inicio` DATE NOT NULL,
    `edu_fecha_fin` DATE NULL,

    INDEX `educacion_edu_usuario_id_idx`(`edu_usuario_id`),
    PRIMARY KEY (`edu_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empleo` (
    `emp_id` INTEGER NOT NULL AUTO_INCREMENT,
    `emp_titulo` VARCHAR(255) NOT NULL,
    `emp_descripcion` TEXT NULL,
    `emp_empresa_id` INTEGER NOT NULL,
    `emp_categoria_id` INTEGER NOT NULL,
    `emp_fecha_publicacion` DATE NOT NULL,
    `emp_salario_min` DECIMAL(10, 2) NULL,
    `emp_salario_max` DECIMAL(10, 2) NULL,
    `emp_tipo_contrato` VARCHAR(100) NULL,
    `emp_requisitos` TEXT NULL,
    `emp_beneficios` TEXT NULL,
    `emp_num_vacantes` INTEGER NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `empleo_emp_categoria_id_idx`(`emp_categoria_id`),
    INDEX `empleo_emp_empresa_id_idx`(`emp_empresa_id`),
    PRIMARY KEY (`emp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresa` (
    `emp_id` INTEGER NOT NULL AUTO_INCREMENT,
    `emp_nombre` VARCHAR(255) NOT NULL,
    `emp_sector` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`emp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `experiencia` (
    `exp_id` INTEGER NOT NULL AUTO_INCREMENT,
    `exp_usuario_id` INTEGER NOT NULL,
    `exp_puesto` VARCHAR(255) NOT NULL,
    `exp_empresa` VARCHAR(255) NOT NULL,
    `exp_fecha_inicio` DATE NOT NULL,
    `exp_fecha_fin` DATE NULL,
    `exp_descripcion` TEXT NULL,

    INDEX `experiencia_exp_usuario_id_idx`(`exp_usuario_id`),
    PRIMARY KEY (`exp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorito` (
    `fav_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fav_usuario_id` INTEGER NOT NULL,
    `fav_empleo_id` INTEGER NOT NULL,

    INDEX `favorito_fav_empleo_id_idx`(`fav_empleo_id`),
    INDEX `favorito_fav_usuario_id_idx`(`fav_usuario_id`),
    PRIMARY KEY (`fav_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `postulacion` (
    `pos_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pos_usuario_id` INTEGER NOT NULL,
    `pos_empleo_id` INTEGER NOT NULL,
    `pos_fecha_postulacion` DATE NOT NULL,
    `pos_estado` VARCHAR(50) NOT NULL DEFAULT 'Enviada',

    INDEX `postulacion_pos_empleo_id_idx`(`pos_empleo_id`),
    INDEX `postulacion_pos_usuario_id_idx`(`pos_usuario_id`),
    PRIMARY KEY (`pos_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `usu_id` INTEGER NOT NULL AUTO_INCREMENT,
    `usu_nombre` VARCHAR(100) NOT NULL,
    `usu_apellido` VARCHAR(100) NULL,
    `usu_email` VARCHAR(255) NOT NULL,
    `usu_password` VARCHAR(255) NOT NULL,
    `usu_rol` VARCHAR(50) NOT NULL DEFAULT 'candidato',
    `usu_telefono` VARCHAR(20) NULL,
    `usu_direccion` VARCHAR(255) NULL,
    `usu_foto` VARCHAR(255) NULL,
    `usu_resumen` TEXT NULL,
    `empresa_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuario_usu_email_key`(`usu_email`),
    INDEX `usuario_empresa_id_idx`(`empresa_id`),
    PRIMARY KEY (`usu_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `habilidad` (
    `hab_id` INTEGER NOT NULL AUTO_INCREMENT,
    `hab_nombre` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`hab_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_habilidad` (
    `usuario_id` INTEGER NOT NULL,
    `habilidad_id` INTEGER NOT NULL,

    PRIMARY KEY (`usuario_id`, `habilidad_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empleo_habilidad` (
    `empleo_id` INTEGER NOT NULL,
    `habilidad_id` INTEGER NOT NULL,

    PRIMARY KEY (`empleo_id`, `habilidad_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NULL,
    `access_token` VARCHAR(191) NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` VARCHAR(191) NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `verification_tokens_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `educacion` ADD CONSTRAINT `educacion_edu_usuario_id_fkey` FOREIGN KEY (`edu_usuario_id`) REFERENCES `usuario`(`usu_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `empleo` ADD CONSTRAINT `empleo_emp_empresa_id_fkey` FOREIGN KEY (`emp_empresa_id`) REFERENCES `empresa`(`emp_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `empleo` ADD CONSTRAINT `empleo_emp_categoria_id_fkey` FOREIGN KEY (`emp_categoria_id`) REFERENCES `categoria`(`cat_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiencia` ADD CONSTRAINT `experiencia_exp_usuario_id_fkey` FOREIGN KEY (`exp_usuario_id`) REFERENCES `usuario`(`usu_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorito` ADD CONSTRAINT `favorito_fav_usuario_id_fkey` FOREIGN KEY (`fav_usuario_id`) REFERENCES `usuario`(`usu_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorito` ADD CONSTRAINT `favorito_fav_empleo_id_fkey` FOREIGN KEY (`fav_empleo_id`) REFERENCES `empleo`(`emp_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postulacion` ADD CONSTRAINT `postulacion_pos_empleo_id_fkey` FOREIGN KEY (`pos_empleo_id`) REFERENCES `empleo`(`emp_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postulacion` ADD CONSTRAINT `postulacion_pos_usuario_id_fkey` FOREIGN KEY (`pos_usuario_id`) REFERENCES `usuario`(`usu_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresa`(`emp_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_habilidad` ADD CONSTRAINT `usuario_habilidad_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`usu_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_habilidad` ADD CONSTRAINT `usuario_habilidad_habilidad_id_fkey` FOREIGN KEY (`habilidad_id`) REFERENCES `habilidad`(`hab_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `empleo_habilidad` ADD CONSTRAINT `empleo_habilidad_empleo_id_fkey` FOREIGN KEY (`empleo_id`) REFERENCES `empleo`(`emp_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `empleo_habilidad` ADD CONSTRAINT `empleo_habilidad_habilidad_id_fkey` FOREIGN KEY (`habilidad_id`) REFERENCES `habilidad`(`hab_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `usuario`(`usu_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `usuario`(`usu_id`) ON DELETE CASCADE ON UPDATE CASCADE;
