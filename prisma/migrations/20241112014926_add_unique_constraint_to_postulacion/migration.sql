/*
  Warnings:

  - A unique constraint covering the columns `[pos_usuario_id,pos_empleo_id]` on the table `postulacion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `postulacion_pos_usuario_id_pos_empleo_id_key` ON `postulacion`(`pos_usuario_id`, `pos_empleo_id`);
