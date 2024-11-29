-- CreateTable
CREATE TABLE `CV` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `filename` VARCHAR(191) NOT NULL,
    `mimetype` VARCHAR(191) NOT NULL,
    `content` LONGBLOB NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CV` ADD CONSTRAINT `CV_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
