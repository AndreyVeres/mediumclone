import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1745850202033 implements MigrationInterface {
  name = 'Seed1745850202033';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO tags (name) VALUES ('nestjs'), ('reactjs'), ('angularjs')`);

    // password = 123
    await queryRunner.query(
      `INSERT INTO users (username, email, password) VALUES ('admin', 'admin@gmail.com', '$2b$10$TER6vsZGFbdbgjmvDDnnY.3GE5pDZ7BONxYN7jZxb39bPj0T7CBny')`,
    );

    await queryRunner.query(
      `INSERT INTO articles 
      (title, description, body, slug, "tagList", "authorId") 
      VALUES 
      ('first article title', 'first article description', 'first article body', 'first-article-slug', 'dragons' , 2)`,
    );
    await queryRunner.query(
      `INSERT INTO articles 
        (title, description, body, slug, "tagList", "authorId") 
        VALUES 
        ('second article title', 'second article description', 'second article body', 'second-article-slug', 'dragons,react' , 2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
