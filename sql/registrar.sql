-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 30, 2012 at 07:37 AM
-- Server version: 5.5.16
-- PHP Version: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `ucsb`
--

-- --------------------------------------------------------

--
-- Table structure for table `registrar`
--

CREATE TABLE IF NOT EXISTS `registrar` (
  `courseTitle` varchar(255) DEFAULT NULL,
  `fullTitle` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `registrar`
--

INSERT INTO `registrar` (`courseTitle`, `fullTitle`, `description`, `department`, `preReq`, `college`, `units`, `grading`, `primaryTitle`, `status`, `enrollCode`, `levelLimit`, `majorLimitPass`, `majorLimit`, `messages`, `instructor`, `days`, `time`, `location`, `enrolled`, `courseType`, `courseLevel`, `people`) VALUES
('ANTH 105', 'Human Variation', 'An examination of traditional race concepts contrasted with an   approach to human variation through the analysis of   biologically adaptive traits.', 'anth', 'Anthropology 5.', 'L&S', '4.0', 'Optional', 'HUMAN VARIATION', '', '00182/B', '', '', '', '', 'MCALLISTER L', 'MTWR', '2:00pm - 3:10pm', 'HSSB 1174', '44 / 75', 'lecture', 'undergrad', 'Alexandria Mcallister'),
('ANTH 109', 'Human Universals', 'A critical overview of those characteristics of human psyche, behavior, society, and culture that are allegedly found among all peoples: the constants of human nature.', 'anth', '', 'L&S', '4.0', 'Optional', 'HUMAN UNIVERSALS', '', '00190/B', '', '', '', '', 'CIMINO A N', 'MTWR', '3:30pm - 4:40pm', 'HSSB 1174', '72 / 75', 'lecture', 'undergrad', 'Aldo Cimino');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
