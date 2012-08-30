-- SQL Database Structure for UCSB Interactive Campus Map
--
-- database: ucsb
-- version 0.0.2
--
-- Author: blake.regalia@gmail.com
--

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "-08:00";


-- --------------------------------------------------------
--
-- Namespace: directory
--
-- --------------------------------------------------------

	--
	-- Table structure for table: departments
	--
	CREATE TABLE IF NOT EXISTS `directory_departments` (
	  `departmentName` varchar(255) NOT NULL,
	  `departmentAbrv` varchar(16) NOT NULL,
	  `buildingId` smallint(5) NOT NULL,
	  `college` varchar(32) NOT NULL,
	  `chair` varchar(64) NOT NULL,
	  
	  `location` varchar(64) NOT NULL,
	  `email` varchar(255) NOT NULL,
	  `phone` varchar(255) NOT NULL,
	  `website` varchar(255) NOT NULL
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	--
	-- Table structure for table: groups
	--
	CREATE TABLE IF NOT EXISTS `directory_groups` (
	  `groupName` varchar(255) NOT NULL,
	  `buildingId` smallint(5) NOT NULL,
	  `catgeory` varchar(16) NOT NULL,
	  `description` text(1024) NOT NULL,
	  
	  `location` varchar(64) NOT NULL,
	  `email` varchar(255) NOT NULL,
	  `phone` varchar(255) NOT NULL,
	  `website` varchar(255) NOT NULL
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	--
	-- Table structure for table: people
	--
	CREATE TABLE IF NOT EXISTS `directory_people` (
	  `firstName` varchar(128) NOT NULL,
	  `lastName` varchar(128) NOT NULL,
	  `departmentName` varchar(255) NOT NULL,
	  `groupName` varchar(255) NOT NULL,
	  `branch` varchar(255) NOT NULL,
	  `role` varchar(255) NOT NULL,
	  `title` varchar(255) NOT NULL,
	  
	  `instructAbrv` varchar(128) NOT NULL,
	  `instructs` text(512) NOT NULL,
	  
	  `location` varchar(64) NOT NULL,
	  `email` varchar(255) NOT NULL,
	  `phone` varchar(255) NOT NULL,
	  `website` varchar(255) NOT NULL,
	  `photo` varchar(512) NOT NULL,
	  
	  `mailcode` smallint(5) NOT NULL,
	  `source` varchar(32) NOT NULL
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	
	
-- --------------------------------------------------------
--
-- Namespace: facility
--
-- --------------------------------------------------------

	--
	-- Table structure for table: buildings
	--
	CREATE TABLE IF NOT EXISTS `facility_buildings` (
	  `buildingId` smallint(5) NOT NULL,
	  `buildingName` varchar(255) NOT NULL,
	  `buildingAbrv` varchar(16) NOT NULL,
	  
	  `photo` varchar(512) NOT NULL
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	--
	-- Table structure for table: parking
	--
	CREATE TABLE IF NOT EXISTS `directory_parking` (
	  `lotNumber` smallint(5) NOT NULL,
	  `lotName` varchar(128) NOT NULL,
	  `levels` tinyint(3) NOT NULL,
	  `capacity` smallint(6) NOT NULL
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	--
	-- Table structure for table: rooms
	--
	CREATE TABLE IF NOT EXISTS `directory_rooms` (
	  `buildingId` smallint(5) NOT NULL,
	  `roomNumber` varchar(16) NOT NULL,
	  `roomName` varchar(255) NOT NULL
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	

-- --------------------------------------------------------
--
-- Namespace: registrar
--
-- --------------------------------------------------------

	--
	-- Table structure for table: *
	--
	CREATE TABLE IF NOT EXISTS `registrar` (
	  `courseTitle` varchar(255) DEFAULT NULL,
	  `fullTitle` varchar(255) DEFAULT NULL,
	  `description` varchar(255) DEFAULT NULL,
	  `departmentName` varchar(255) DEFAULT NULL,
	  `preReq` varchar(255) DEFAULT NULL,
	  `college` varchar(255) DEFAULT NULL,
	  `units` varchar(255) DEFAULT NULL,
	  `grading` varchar(255) DEFAULT NULL,
	  `primaryTitle` varchar(255) DEFAULT NULL,
	  `status` varchar(255) DEFAULT NULL,
	  `enrollCode` varchar(255) DEFAULT NULL,
	  `levelLimit` varchar(255) DEFAULT NULL,
	  `majorLimitPass` varchar(255) DEFAULT NULL,
	  `majorLimit` varchar(255) DEFAULT NULL,
	  `messages` varchar(255) DEFAULT NULL,
	  `instructor` varchar(255) DEFAULT NULL,
	  `days` varchar(255) DEFAULT NULL,
	  `time` varchar(255) DEFAULT NULL,
	  `location` varchar(255) DEFAULT NULL,
	  `enrolled` varchar(255) DEFAULT NULL,
	  `courseType` varchar(8) DEFAULT NULL,
	  `courseLevel` varchar(16) DEFAULT NULL,
	  `people` varchar(255) NOT NULL
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;


