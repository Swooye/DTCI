import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { QuestionnairesController } from './questionnaires.controller';
import { QuestionnairesService } from './questionnaires.service';
import { GeneTypesController } from './gene-types.controller';
import { GeneTypesService } from './gene-types.service';

@Module({
  controllers: [QuestionsController, QuestionnairesController, GeneTypesController],
  providers: [QuestionsService, QuestionnairesService, GeneTypesService],
  exports: [QuestionsService, QuestionnairesService, GeneTypesService],
})
export class AssessmentsModule {}
