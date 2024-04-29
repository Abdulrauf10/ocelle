import { addDays } from 'date-fns';
import { QueryRunner, Repository } from 'typeorm';

import Seeder from './Seeder';

import { Career, CareerLine } from '@/entities';
import { CareerLineType, Classification, WorkPattern, WorkType } from '@/enums';

export default class CareerSeeder extends Seeder {
  private getLines(careerLineRepository: Repository<CareerLine>, career: Career) {
    return [
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Responsibility,
        name: 'As an OCELLE Food Engineer, you’ll be part of a small-knit pack of food, nutrition, and dog health experts that bring our food to life.',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Responsibility,
        name: 'Design & develop new pet product concepts for dogs using scientific principles, consumer empathy, and a pet centric approach.',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Responsibility,
        name: 'Coordinate with cross functional partners in Marketing and Operations to achieve shared goals and objectives for new product launches and existing product maintenance.',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Responsibility,
        name: 'Assess opportunities to improve quality, costs, and/or competitive positioning of all new and existing products on a regular basis.',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Responsibility,
        name: 'Coordinate testing for nutrition, sensory, shelf-life stability, and all other key technical attributes of new and existing products through the supply chain.',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Responsibility,
        name: 'Develop specifications for finished goods, including requirements for raw materials, manufacturing processes, and key quality attributes.',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Responsibility,
        name: 'Collaborate with internal and external partners to set standards and expectations for process, quality, and testing protocols.',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Responsibility,
        name: 'Lead or support efforts to solve complex technical problems involving food ingredients, manufacturing processes, and/or quality parameters.',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Responsibility,
        name: 'Serve as a passionate champion of Quality and Product Performance to delight pets, customers, and promote the OCELLE brand.',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Requirement,
        name: '4+ years in a Food Engineering/Product Development role, with a consistent track record of project leadership, cross functional collaboration, and delivery of successful products.',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Requirement,
        name: 'Demonstrated knowledge and experience in new Product Development, with in-depth knowledge of ingredient functionality, process and packaging interactions, and key quality attributes.',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Requirement,
        name: 'Demonstrated curiosity, empathy, and passion for creating insight & data-driven products that meet the needs of pups and their parents. ',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Requirement,
        name: 'Demonstrated strengths in solving complex problems, written and verbal communication, and translating technical data to any audience.',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Requirement,
        name: 'Bachelor’s degree in Food Science, Animal Science, Chemistry, Engineering or related technical field; higher degrees desirable.',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Requirement,
        name: 'Preference will be given to candidates with experience in pet nutrition and baking; other experience in relevant human or animal food designs and processes (meat science, RTE foods, complex formulations) will be considered.',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Requirement,
        name: 'Perseverance to succeed, willingness to tackle new challenges, and desire to learn and grow.',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Benefit,
        name: 'Comprehensive health coverage including medical, dental and vision',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Benefit,
        name: "15-day vacation policy, that you're encouraged to use",
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Benefit,
        name: 'Paid parental leave',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Benefit,
        name: '1-week paw-ternity leave for new dog parents',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Benefit,
        name: 'Free OCELLE subscription',
      }),
      careerLineRepository.create({
        career,
        lineType: CareerLineType.Benefit,
        name: 'Inspiring pack members!',
      }),
    ];
  }

  /**
   * Clean the Collection
   */
  async clean(queryRunner: QueryRunner): Promise<void> {
    const careerRepository = queryRunner.manager.getRepository(Career);
    const careerLineRepository = queryRunner.manager.getRepository(CareerLine);
    await careerLineRepository.remove(await careerLineRepository.find());
    await careerRepository.remove(await careerRepository.find());
  }

  async run(queryRunner: QueryRunner): Promise<void> {
    const careerRepository = queryRunner.manager.getRepository(Career);
    const careerLineRepository = queryRunner.manager.getRepository(CareerLine);

    const careers = [
      careerRepository.create({
        name: 'Food Engineer',
        classification: Classification.Operations,
        workType: WorkType.FullTime,
        workPattern: WorkPattern.OnSite,
        applyDate: new Date(),
        endDate: addDays(new Date(), 180),
        isDisabled: false,
      }),
      careerRepository.create({
        name: 'Social Media Manager',
        classification: Classification.Marketing,
        workType: WorkType.FullTime,
        workPattern: WorkPattern.Hybrid,
        applyDate: new Date(),
        endDate: addDays(new Date(), 180),
        isDisabled: false,
      }),
      careerRepository.create({
        name: 'Accountant',
        classification: Classification.FinanceAndAccounting,
        workType: WorkType.FullTime,
        workPattern: WorkPattern.Hybrid,
        applyDate: new Date(),
        endDate: addDays(new Date(), 180),
        isDisabled: false,
      }),
      careerRepository.create({
        name: 'Analytics Engineer',
        classification: Classification.Technology,
        workType: WorkType.ContractOrTemp,
        workPattern: WorkPattern.Hybrid,
        applyDate: new Date(),
        endDate: addDays(new Date(), 180),
        isDisabled: false,
      }),
      careerRepository.create({
        name: 'Sales Representative',
        classification: Classification.Sales,
        workType: WorkType.PartTime,
        workPattern: WorkPattern.Hybrid,
        applyDate: new Date(),
        endDate: addDays(new Date(), 180),
        isDisabled: false,
      }),
    ];

    await careerRepository.save(careers);

    const lines = this.getLines(careerLineRepository, careers[0]);

    await careerLineRepository.save(lines);
  }
}
