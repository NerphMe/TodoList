<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210510172941 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE todo DROP FOREIGN KEY FK_FA3C199E727ACA70');
        $this->addSql('ALTER TABLE todo ADD CONSTRAINT FK_FA3C199E727ACA70 FOREIGN KEY (parent_id) REFERENCES Todo (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE Todo DROP FOREIGN KEY FK_FA3C199E727ACA70');
        $this->addSql('ALTER TABLE Todo ADD CONSTRAINT FK_FA3C199E727ACA70 FOREIGN KEY (parent_id) REFERENCES todo (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
    }
}
