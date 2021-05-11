<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210508161950 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE todo ADD CONSTRAINT FK_FA3C199E727ACA70 FOREIGN KEY (parent_id) REFERENCES Todo (id)');
        $this->addSql('CREATE INDEX IDX_FA3C199E727ACA70 ON todo (parent_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE Todo DROP FOREIGN KEY FK_FA3C199E727ACA70');
        $this->addSql('DROP INDEX IDX_FA3C199E727ACA70 ON Todo');
    }
}
