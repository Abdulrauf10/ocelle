export default abstract class Seeder {
  /**
   * Clean the Collection
   */
  abstract clean(): Promise<void>;

  /**
   * Create Entities
   */
  abstract run(): Promise<void>;
}
