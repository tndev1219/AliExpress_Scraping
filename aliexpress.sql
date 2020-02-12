# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: laravel.ciwrdpuezei5.us-west-2.rds.amazonaws.com (MySQL 5.5.5-10.1.34-MariaDB)
# Database: aliexpress
# Generation Time: 2020-01-08 19:34:10 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table ali_queue
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ali_queue`;

CREATE TABLE `ali_queue` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(60) DEFAULT NULL,
  `user_token` varchar(50) DEFAULT NULL,
  `product_code` varchar(30) DEFAULT NULL,
  `language` varchar(2) DEFAULT NULL,
  `product_info_payload` text,
  `status` enum('RESERVED','READY','FINISHED','FAILED') DEFAULT 'READY',
  `failed_at` timestamp NULL DEFAULT NULL,
  `imported` tinyint(1) NOT NULL DEFAULT '0',
  `reserved_at` timestamp NULL DEFAULT NULL,
  `finished_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `ali_queue` WRITE;
/*!40000 ALTER TABLE `ali_queue` DISABLE KEYS */;

INSERT INTO `ali_queue` (`id`, `uuid`, `user_token`, `product_code`, `language`, `product_info_payload`, `status`, `failed_at`, `imported`, `reserved_at`, `finished_at`, `created_at`, `updated_at`)
VALUES
	(1,'00d73e0a-3190-11ea-978f-2e728ce88125', 'arjtT1zdp7dc54eC39HqLyjWD', '32853590425','EN','{\"productId\":\"32853590425\",\"productTitle\":\"Original Vaporesso SWAG Kit 80W Electronic Cigarette Kits With Vaporesso Swag Mod NRG SE NRG SE Mini Tank E-Cigarettes Vape Kit \",\"attributes\":[{\"title\":\"Color\",\"options\":[{\"optionId\":\"14:193\",\"text\":\"Black\"},{\"optionId\":\"14:173\",\"text\":\"Blue\"},{\"optionId\":\"14:366\",\"text\":\"Orange\"},{\"optionId\":\"14:350853\",\"text\":\"Silver\"}]},{\"title\":\"Battery Capacity\",\"options\":[{\"optionId\":\"1328:200660823\",\"text\":\"3.5ml Full Kit\"},{\"optionId\":\"1328:200660824\",\"text\":\"2ml Full Kit\"},{\"optionId\":\"1328:200660825\",\"text\":\"Only Swag Mod\"}]},{\"title\":\"Ships From\",\"options\":[{\"optionId\":\"200007763:201336100\",\"text\":\"China\"},{\"optionId\":\"200007763:201336103\",\"text\":\"Russian Federation\"}]}],\"store\":{\"name\":\"E-cig Vape Store\",\"id\":\"2953022\"},\"pics\":[\"https://ae01.alicdn.com/kf/HTB1HaISXbZnBKNjSZFKq6AGOVXaq/Original-Vaporesso-SWAG-Kit-80W-Electronic-Cigarette-Kits-With-Vaporesso-Swag-Mod-NRG-SE-NRG-SE.jpg\",\"https://ae01.alicdn.com/kf/HTB1cdCPX9tYBeNjSspkq6zU8VXaf/Original-Vaporesso-SWAG-Kit-80W-Electronic-Cigarette-Kits-With-Vaporesso-Swag-Mod-NRG-SE-NRG-SE.jpg\",\"https://ae01.alicdn.com/kf/HTB1S6lXX21TBuNjy0Fjq6yjyXXag/Original-Vaporesso-SWAG-Kit-80W-Electronic-Cigarette-Kits-With-Vaporesso-Swag-Mod-NRG-SE-NRG-SE.jpg\",\"https://ae01.alicdn.com/kf/HTB1bHk8XFuWBuNjSszbq6AS7FXah/Original-Vaporesso-SWAG-Kit-80W-Electronic-Cigarette-Kits-With-Vaporesso-Swag-Mod-NRG-SE-NRG-SE.jpg\",\"https://ae01.alicdn.com/kf/HTB1Yog9XH5YBuNjSspoq6zeNFXaJ/Original-Vaporesso-SWAG-Kit-80W-Electronic-Cigarette-Kits-With-Vaporesso-Swag-Mod-NRG-SE-NRG-SE.jpg\",\"https://ae01.alicdn.com/kf/HTB1TrBaX49YBuNjy0Ffq6xIsVXaG/Original-Vaporesso-SWAG-Kit-80W-Electronic-Cigarette-Kits-With-Vaporesso-Swag-Mod-NRG-SE-NRG-SE.jpg\"],\"variations\":[{\"pricing\":\"42.50\",\"discount\":\"34.00\",\"combinedAttributes\":[\"14:193\",\"1328:200660825\",\"200007763:201336100\"]},{\"pricing\":\"42.50\",\"discount\":\"34.00\",\"combinedAttributes\":[\"14:173\",\"1328:200660825\",\"200007763:201336100\"]},{\"pricing\":\"42.50\",\"discount\":\"34.00\",\"combinedAttributes\":[\"14:366\",\"1328:200660825\",\"200007763:201336100\"]},{\"pricing\":\"41.25\",\"discount\":\"33.00\",\"combinedAttributes\":[\"14:350853\",\"1328:200660825\",\"200007763:201336100\"]},{\"pricing\":\"62.00\",\"discount\":\"49.60\",\"combinedAttributes\":[\"14:193\",\"1328:200660824\",\"200007763:201336100\"]},{\"pricing\":\"62.50\",\"discount\":\"50.00\",\"combinedAttributes\":[\"14:193\",\"1328:200660823\",\"200007763:201336100\"]},{\"pricing\":\"62.00\",\"discount\":\"49.60\",\"combinedAttributes\":[\"14:173\",\"1328:200660824\",\"200007763:201336100\"]},{\"pricing\":\"62.50\",\"discount\":\"50.00\",\"combinedAttributes\":[\"14:173\",\"1328:200660823\",\"200007763:201336100\"]},{\"pricing\":\"62.00\",\"discount\":\"49.60\",\"combinedAttributes\":[\"14:366\",\"1328:200660824\",\"200007763:201336100\"]},{\"pricing\":\"62.50\",\"discount\":\"50.00\",\"combinedAttributes\":[\"14:366\",\"1328:200660823\",\"200007763:201336100\"]},{\"pricing\":\"61.00\",\"discount\":\"48.80\",\"combinedAttributes\":[\"14:350853\",\"1328:200660824\",\"200007763:201336100\"]},{\"pricing\":\"61.25\",\"discount\":\"49.00\",\"combinedAttributes\":[\"14:350853\",\"1328:200660823\",\"200007763:201336100\"]},{\"pricing\":\"42.50\",\"discount\":\"34.00\",\"combinedAttributes\":[\"14:193\",\"1328:200660825\",\"200007763:201336103\"]},{\"pricing\":\"42.50\",\"discount\":\"34.00\",\"combinedAttributes\":[\"14:173\",\"1328:200660825\",\"200007763:201336103\"]},{\"pricing\":\"42.50\",\"discount\":\"34.00\",\"combinedAttributes\":[\"14:366\",\"1328:200660825\",\"200007763:201336103\"]},{\"pricing\":\"41.25\",\"discount\":\"33.00\",\"combinedAttributes\":[\"14:350853\",\"1328:200660825\",\"200007763:201336103\"]},{\"pricing\":\"62.00\",\"discount\":\"49.60\",\"combinedAttributes\":[\"14:193\",\"1328:200660824\",\"200007763:201336103\"]},{\"pricing\":\"62.50\",\"discount\":\"50.00\",\"combinedAttributes\":[\"14:193\",\"1328:200660823\",\"200007763:201336103\"]},{\"pricing\":\"62.00\",\"discount\":\"49.60\",\"combinedAttributes\":[\"14:173\",\"1328:200660824\",\"200007763:201336103\"]},{\"pricing\":\"62.50\",\"discount\":\"50.00\",\"combinedAttributes\":[\"14:173\",\"1328:200660823\",\"200007763:201336103\"]},{\"pricing\":\"62.00\",\"discount\":\"49.60\",\"combinedAttributes\":[\"14:366\",\"1328:200660824\",\"200007763:201336103\"]},{\"pricing\":\"62.50\",\"discount\":\"50.00\",\"combinedAttributes\":[\"14:366\",\"1328:200660823\",\"200007763:201336103\"]},{\"pricing\":\"61.00\",\"discount\":\"48.80\",\"combinedAttributes\":[\"14:350853\",\"1328:200660824\",\"200007763:201336103\"]},{\"pricing\":\"61.25\",\"discount\":\"49.00\",\"combinedAttributes\":[\"14:350853\",\"1328:200660823\",\"200007763:201336103\"]}],\"properties\":[{\"propertyTitle\":\"Nominal Capacity\",\"propertyDescription\":\"None\"},{\"propertyTitle\":\"Monitoring Function Of Smoking Number\",\"propertyDescription\":\"No\"},{\"propertyTitle\":\"Built-in Or External Battery\",\"propertyDescription\":\"External\"},{\"propertyTitle\":\"Atomizers Identification Function\",\"propertyDescription\":\"Yes\"},{\"propertyTitle\":\"Model Number\",\"propertyDescription\":\"Vaporesso SWAG Kit\"},{\"propertyTitle\":\"Compatible Battery\",\"propertyDescription\":\"18650\"},{\"propertyTitle\":\"USB Charger\",\"propertyDescription\":\"Yes\"},{\"propertyTitle\":\"Appearance\",\"propertyDescription\":\"Box Shape\"},{\"propertyTitle\":\"Temperature Control\",\"propertyDescription\":\"Yes\"},{\"propertyTitle\":\"Overheating Protection Function\",\"propertyDescription\":\"Yes\"},{\"propertyTitle\":\"Compatible Model\",\"propertyDescription\":\"Vaporesso SWAG Kit\"},{\"propertyTitle\":\"Firmware Upgradeable\",\"propertyDescription\":\"Yes\"},{\"propertyTitle\":\"TCR Adjustment Modes\",\"propertyDescription\":\"Yes\"},{\"propertyTitle\":\"Brand Name\",\"propertyDescription\":\"vaporesso\"},{\"propertyTitle\":\"Display screen\",\"propertyDescription\":\"Yes\"},{\"propertyTitle\":\"Type\",\"propertyDescription\":\"Electric Mod\"},{\"propertyTitle\":\"Short-circuit Protection Function\",\"propertyDescription\":\"Yes\"},{\"propertyTitle\":\"Material\",\"propertyDescription\":\"Metal\"},{\"propertyTitle\":\"Silicone Case\",\"propertyDescription\":\"No\"},{\"propertyTitle\":\"Low Voltage Alarm Function\",\"propertyDescription\":\"Yes\"},{\"propertyTitle\":\"Mod\",\"propertyDescription\":\"Vaporesso Swag Mod\"},{\"propertyTitle\":\"Vaporesso Swag Tank 1\",\"propertyDescription\":\"Vaporesso NRG SE Tank\"},{\"propertyTitle\":\"Vaporesso Swag Tank 2\",\"propertyDescription\":\"Vaporesso NRG SE Mini Tank\"},{\"propertyTitle\":\"Vaporesso Swag Coil 1 \",\"propertyDescription\":\"Vaporesso GT2 0.4ohm\"},{\"propertyTitle\":\"Vaporesso Swag Coil 2\",\"propertyDescription\":\"Vaporesso GT CCELL 0.5ohm\"},{\"propertyTitle\":\"Voltage Range\",\"propertyDescription\":\"0-8.5V\"},{\"propertyTitle\":\"Battery\",\"propertyDescription\":\"1*18650 battery (Not included)\"},{\"propertyTitle\":\"Power\",\"propertyDescription\":\"5-80W\"},{\"propertyTitle\":\"Output Modes\",\"propertyDescription\":\"VW, CCW, CCT, VT, TCR, RTC, BYPASS\"}],\"description\":\" \\n<p> Original Vaporesso SWAG Kit 80W Electronic Cigarette Kits With Vaporesso Swag Mod NRG SE NRG SE Mini Tank E-Cigarettes Vape Kit&#xA0; </p> \\n<p> <img alt=\\\"SWAG-KIT\\\" src=\\\"https://ae01.alicdn.com/kf/HTB1fTESXbZnBKNjSZFrq6yRLFXaj.jpg\\\"><img alt=\\\"SWAG-KIT-7\\\" src=\\\"https://ae01.alicdn.com/kf/HTB1tHCPX_lYBeNjSszcq6zwhFXan.jpg\\\"><img alt=\\\"SWAG-KIT-1\\\" src=\\\"https://ae01.alicdn.com/kf/HTB1DHuPX_lYBeNjSszcq6zwhFXap.jpg\\\"><img alt=\\\"SWAG-KIT-2\\\" src=\\\"https://ae01.alicdn.com/kf/HTB1cT3PXf6TBKNjSZJiq6zKVFXa1.jpg\\\"><img alt=\\\"SWAG-KIT-3\\\" src=\\\"https://ae01.alicdn.com/kf/HTB1tX.UXXooBKNjSZFPq6xa2XXaO.jpg\\\"><img alt=\\\"SWAG-KIT-6\\\" src=\\\"https://ae01.alicdn.com/kf/HTB1VSw8XH1YBuNjSszeq6yblFXa9.jpg\\\"><img alt=\\\"SWAG-KIT-6-(2)\\\" src=\\\"https://ae01.alicdn.com/kf/HTB1bd3RXbZnBKNjSZFGq6zt3FXao.jpg\\\"></p>\"}','READY',NULL,0,NULL,NULL,NULL,NULL);

/*!40000 ALTER TABLE `ali_queue` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ali_requests
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ali_requests`;

CREATE TABLE `ali_requests` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(60) NOT NULL DEFAULT '',
  `num_products` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `ali_requests` WRITE;
/*!40000 ALTER TABLE `ali_requests` DISABLE KEYS */;

INSERT INTO `ali_requests` (`id`, `uuid`, `num_products`, `created_at`, `updated_at`)
VALUES
	(1,'00d73e0a-3190-11ea-978f-2e728ce88125',1,NULL,NULL);

/*!40000 ALTER TABLE `ali_requests` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table sources
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sources`;

CREATE TABLE `sources` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `store_name` varchar(255) DEFAULT NULL,
  `store_country` varchar(5) DEFAULT NULL,
  `store_language` varchar(5) DEFAULT NULL,
  `store_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `store_name` (`store_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `sources` WRITE;
/*!40000 ALTER TABLE `sources` DISABLE KEYS */;

INSERT INTO `sources` (`id`, `store_name`, `store_country`, `store_language`, `store_url`)
VALUES
	(1,'Aliexpress','WW','EN','https://www.aliexpress.com/'),
	(2,'Aliexpress Italy','IT','IT','https://it.aliexpress.com/'),
	(3,'Aliexpress Spain','ES','ES','https://es.aliexpress.com/'),
	(4,'Aliexpress France','FR','FR','https://fr.aliexpress.com/'),
	(5,'Aliexpress Germany','DE','DE','https://de.aliexpress.com/'),
	(6,'Aliexpress Netherland','NL','NL','https://nl.aliexpress.com/'),
	(7,'Aliexpress Portugal','PT','PT','https://pt.aliexpress.com/'),
	(8,'Aliexpress Poland','PL','PL','https://pl.aliexpress.com'),
	(9,'Aliexpress Turkey','TR','TR','https://tr.aliexpress.com'),
	(10,'Aliexpress Russia','RU','RU','https://ru.aliexpress.com'),
	(11,'Aliexpress Thailand','TH','TH','https://th.aliexpress.com');

/*!40000 ALTER TABLE `sources` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table stores
# ------------------------------------------------------------

DROP TABLE IF EXISTS `stores`;

CREATE TABLE `stores` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `store_id` varchar(255) DEFAULT NULL,
  `store_name` varchar(255) DEFAULT NULL,
  `store_url` varchar(255) DEFAULT NULL,
  `store_feedbacks` double(8,1) DEFAULT NULL,
  `seller_since` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;

INSERT INTO `stores` (`id`, `store_id`, `store_name`, `store_url`, `store_feedbacks`, `seller_since`, `created_at`, `modified_at`)
VALUES
	(1,'2953022','E-cig Vape Store','https://www.aliexpress.com/store/2953022',96.4,'2017-03-07',NULL,NULL);

/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(40) unsigned NOT NULL AUTO_INCREMENT,
  `user_account_number` varchar(255) DEFAULT NULL,
  `api_token` varchar(25) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(60) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `account_number` (`user_account_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `user_account_number`, `api_token`, `email`, `password`, `created_at`, `updated_at`, `deleted_at`)
VALUES
	(1,'aliexpressdaslKL312312kdas','arjtT1zdp7dc54eC39HqLyjWD','aliexpress@email.com','-','2019-05-03 19:59:08','2019-06-20 08:09:40',NULL);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
