-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema csc648db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema csc648db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `csc648db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `csc648db` ;

-- -----------------------------------------------------
-- Table `csc648db`.`amenities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `csc648db`.`amenities` (
  `amenities_id` INT NOT NULL AUTO_INCREMENT,
  `amenity` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`amenities_id`),
  UNIQUE INDEX `amenities_id_UNIQUE` (`amenities_id` ASC) VISIBLE,
  UNIQUE INDEX `amenity_UNIQUE` (`amenity` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `csc648db`.`interests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `csc648db`.`interests` (
  `interest_id` INT NOT NULL AUTO_INCREMENT,
  `interest` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`interest_id`),
  UNIQUE INDEX `interest_id_UNIQUE` (`interest_id` ASC) VISIBLE,
  UNIQUE INDEX `interest_UNIQUE` (`interest` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `csc648db`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `csc648db`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(128) NOT NULL,
  `last_name` VARCHAR(128) NOT NULL,
  `gender` VARCHAR(70) NOT NULL,
  `dob` DATE NOT NULL,
  `occupation` VARCHAR(100) NOT NULL,
  `fields` VARCHAR(100) NOT NULL,
  `school` VARCHAR(70) NOT NULL,
  `email` VARCHAR(128) NOT NULL,
  `username` VARCHAR(128) NOT NULL,
  `password` VARCHAR(128) NOT NULL,
  `photopath` VARCHAR(128) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `usertype` INT NOT NULL,
  `created` DATETIME NOT NULL,
  `active` TINYINT NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `id_UNIQUE` (`user_id` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `csc648db`.`posts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `csc648db`.`posts` (
  `post_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(128) NOT NULL,
  `address` VARCHAR(128) NOT NULL,
  `rent` DECIMAL(10,2) NOT NULL,
  `privacy` INT NOT NULL,
  `description` TEXT NOT NULL,
  `photopath` VARCHAR(128) NOT NULL,
  `thumbnail` VARCHAR(128) NOT NULL,
  `created` DATETIME NOT NULL,
  `users_user_id` INT NOT NULL,
  PRIMARY KEY (`post_id`),
  UNIQUE INDEX `post_id_UNIQUE` (`post_id` ASC) VISIBLE,
  UNIQUE INDEX `address_UNIQUE` (`address` ASC) VISIBLE,
  INDEX `fk_posts_users1_idx` (`users_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_posts_users1`
    FOREIGN KEY (`users_user_id`)
    REFERENCES `csc648db`.`users` (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `csc648db`.`messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `csc648db`.`messages` (
  `message_id` INT NOT NULL AUTO_INCREMENT,
  `description` TEXT NOT NULL,
  `created` DATETIME NOT NULL,
  `users_user_id` INT NOT NULL,
  `posts_post_id` INT NOT NULL,
  PRIMARY KEY (`message_id`),
  UNIQUE INDEX `messages_id_UNIQUE` (`message_id` ASC) VISIBLE,
  INDEX `fk_messages_users1_idx` (`users_user_id` ASC) VISIBLE,
  INDEX `fk_messages_posts1_idx` (`posts_post_id` ASC) VISIBLE,
  CONSTRAINT `fk_messages_posts1`
    FOREIGN KEY (`posts_post_id`)
    REFERENCES `csc648db`.`posts` (`post_id`),
  CONSTRAINT `fk_messages_users1`
    FOREIGN KEY (`users_user_id`)
    REFERENCES `csc648db`.`users` (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `csc648db`.`posts_amenities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `csc648db`.`posts_amenities` (
  `posts_amenities_id` INT NOT NULL AUTO_INCREMENT,
  `posts_post_id` INT NOT NULL,
  `amenities_amenities_id` INT NOT NULL,
  PRIMARY KEY (`posts_amenities_id`),
  UNIQUE INDEX `posts_amenities_id_UNIQUE` (`posts_amenities_id` ASC) VISIBLE,
  INDEX `fk_posts_amenities_posts1_idx` (`posts_post_id` ASC) VISIBLE,
  INDEX `fk_posts_amenities_amenities1_idx` (`amenities_amenities_id` ASC) VISIBLE,
  CONSTRAINT `fk_posts_amenities_amenities1`
    FOREIGN KEY (`amenities_amenities_id`)
    REFERENCES `csc648db`.`amenities` (`amenities_id`),
  CONSTRAINT `fk_posts_amenities_posts1`
    FOREIGN KEY (`posts_post_id`)
    REFERENCES `csc648db`.`posts` (`post_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `csc648db`.`preferences`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `csc648db`.`preferences` (
  `preference_id` INT NOT NULL AUTO_INCREMENT,
  `preference` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`preference_id`),
  UNIQUE INDEX `preferences_id_UNIQUE` (`preference_id` ASC) VISIBLE,
  UNIQUE INDEX `preferences_UNIQUE` (`preference` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 83
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `csc648db`.`sessions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `csc648db`.`sessions` (
  `session_id` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_bin' NOT NULL,
  `expires` INT UNSIGNED NOT NULL,
  `data` MEDIUMTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`session_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `csc648db`.`user_interests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `csc648db`.`user_interests` (
  `user_interests_id` INT NOT NULL AUTO_INCREMENT,
  `users_user_id` INT NOT NULL,
  `interests_interest_id` INT NOT NULL,
  PRIMARY KEY (`user_interests_id`),
  UNIQUE INDEX `user_interests_id_UNIQUE` (`user_interests_id` ASC) VISIBLE,
  INDEX `fk_user_interests_users_idx` (`users_user_id` ASC) VISIBLE,
  INDEX `fk_user_interests_interests1_idx` (`interests_interest_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_interests_interests1`
    FOREIGN KEY (`interests_interest_id`)
    REFERENCES `csc648db`.`interests` (`interest_id`),
  CONSTRAINT `fk_user_interests_users`
    FOREIGN KEY (`users_user_id`)
    REFERENCES `csc648db`.`users` (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `csc648db`.`user_preferences`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `csc648db`.`user_preferences` (
  `user_preferences_id` INT NOT NULL AUTO_INCREMENT,
  `users_user_id` INT NOT NULL,
  `preferences_preference_id` INT NOT NULL,
  PRIMARY KEY (`user_preferences_id`),
  UNIQUE INDEX `user_preferences_id_UNIQUE` (`user_preferences_id` ASC) VISIBLE,
  INDEX `fk_user_preferences_users1_idx` (`users_user_id` ASC) VISIBLE,
  INDEX `fk_user_preferences_preferences1_idx` (`preferences_preference_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_preferences_preferences1`
    FOREIGN KEY (`preferences_preference_id`)
    REFERENCES `csc648db`.`preferences` (`preference_id`),
  CONSTRAINT `fk_user_preferences_users1`
    FOREIGN KEY (`users_user_id`)
    REFERENCES `csc648db`.`users` (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
