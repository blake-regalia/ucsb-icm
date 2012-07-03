-- UCSB Interactive Campus Map - Database Template
-- Authors: Blake Regalia

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "-08:00";

--
-- Database: `ucsb`
--


--
-- facilities 
--

-- --------------------------------------------------------

--
-- Table structure for table `facilities.building`
--

CREATE TABLE IF NOT EXISTS `facilities.building` (
  `buildingId` int(11) NOT NULL,
  `buildingName` varchar(32) CHARACTER SET utf8 NOT NULL,
  `buildingAbbr` varchar(8) CHARACTER SET utf8 NOT NULL,
  `buildingShape` polygon NOT NULL,
  PRIMARY KEY (`buildingId`),
  UNIQUE KEY `buildingAbbr` (`buildingAbbr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- --------------------------------------------------------

--
-- Table structure for table `facilities.parking`
--

CREATE TABLE IF NOT EXISTS `facilities.parking` (
  `lotNumber` int(11) NOT NULL,
  `lotName` varchar(32) NOT NULL,
  `lotLevels` int(11) NOT NULL,
  `lotShape` polygon NOT NULL,
  PRIMARY KEY (`lotNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- --------------------------------------------------------

--
-- Table structure for table `facilities.room`
--

CREATE TABLE IF NOT EXISTS `facilities.room` (
  `buildingId` int(11) NOT NULL,
  `roomNumber` varchar(8) NOT NULL,
  `roomName` varchar(32) NOT NULL,
  `roomShape` polygon NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




--
-- directory 
--


-- --------------------------------------------------------

--
-- Table structure for table `directory`
--


CREATE TABLE IF NOT EXISTS `directory` (
  `lastName` varchar(32) NOT NULL,
  `middleName` varchar(16),
  `firstName` varchar(16) NOT NULL,
  `branch` varchar(64) NOT NULL,
  `role` varchar(32) NOT NULL,
  `title` varchar(32) NOT NULL,
  `department` varchar(32) NOT NULL,
  `picture` blob,
  INDEX name(lastName, middleName, firstName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




--
-- registrar 
--


-- --------------------------------------------------------

--
-- Table structure for table `registrar.undergrad`
--

CREATE TABLE IF NOT EXISTS `registrar` (
  `courseTitle` varchar(255) NOT NULL,
  `fullTitle` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
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
  `courseLevel` varchar(16) NOT NULL,
  `courseType` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
