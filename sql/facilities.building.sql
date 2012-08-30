-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 30 at 11:09 AM
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
-- Table structure for table `facility_buildings`
--

CREATE TABLE IF NOT EXISTS `facility_buildings`(
  `buildingId` int(11) NOT NULL,
  `buildingName` varchar(128) DEFAULT NULL,
  `buildingAbrv` varchar(7) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `facility_buildings`
--

INSERT INTO `facility_buildings`(`buildingId`, `buildingName`, `buildingAbrv`) VALUES
(0, 'UCSB Center at Santa Maria', 'AHC'),
(0, 'Aliso School', 'ALISO'),
(547, 'Anacapa Hall', 'ANCAP'),
(0, 'Archery Range', 'ARCH '),
(534, 'Arts & University Art Museum', 'ARTS'),
(571, 'Biological Science 2', 'BIOL2'),
(0, 'Brandon School', 'BRAND'),
(572, 'Broida Hall', 'BRDA'),
(521, 'Bren School of Environmental Science', 'BREN'),
(522, 'Baseball Facilities', 'BSBL '),
(504, 'Biological Sciences Instructional Facility', 'BSIF'),
(573, 'Buchanan Hall', 'BUCHN'),
(538, 'Campbell Hall', 'CAMPB'),
(557, 'Chemistry', 'CHEM'),
(0, 'El Camino School', 'ELCAM'),
(563, 'Ellison Hall', 'ELLSN'),
(941, 'Embarcadero Hall', 'EMBAR'),
(556, 'Harold Frank Hall (Engineering I)', 'ENGR1'),
(503, 'Engineering II', 'ENGR2'),
(0, 'Engineering Building III', 'ENGR3'),
(225, 'Engineering Science (ESB)', 'ESB'),
(505, 'Events Center (Thunderdome)', 'EVENT'),
(0, 'Franklin School', 'FRANK'),
(564, 'Girvetz Hall', 'GIRV'),
(0, 'Golf Course', 'GOLF '),
(556, 'Harold Frank Hall (Engineering I)', 'HFH'),
(0, 'Hollister School', 'HOLLI'),
(515, 'Humanities Social Sci & Performing Arts Thtr(HSSB)', 'HSSB'),
(948, 'Isla Vista Theater', 'IV'),
(0, 'Isla Vista School', 'IVIST'),
(591, 'Kerr Hall', 'KERR'),
(567, 'Kohn Hall & Kavli Institute', 'KOHN'),
(0, 'La Patera School', 'LAPAT'),
(525, 'Davidson Library', 'LIB'),
(235, 'Life Science', 'LSB'),
(0, 'Main School', 'MAIN'),
(0, 'Manzanita Village De Anza Center', 'MANZ'),
(555, 'Marine Biotechnology Lab', 'MLAB'),
(7035, 'Music Classroom', 'MUSIC'),
(0, 'North Campus Faculty Housing (Planned)', 'NH'),
(544, 'Noble Hall', 'NOBLE'),
(0, 'Off Campus', 'OFF'),
(0, 'Open Alternative School', 'OPENA'),
(0, 'Peabody School', 'PEABO'),
(560, 'Phelps Hall', 'PHELP'),
(657, 'Physical Science North (PSB North)', 'PSB-N'),
(672, 'Physical Sciences South (PSB South)', 'PSB-S'),
(551, 'Psychology', 'PSYCH'),
(0, 'Point Mugu Naval Air Station', 'PT MU'),
(0, 'Recreation Center (RecCen)', 'RECEN'),
(533, 'Robertson Gymnasium', 'RGYM '),
(0, 'Roosevelt School', 'ROOSE'),
(0, 'Recreation Center (RecCen)', 'RQET '),
(568, 'Student Affairs & Administration Services (SAASB)', 'SAASB'),
(553, 'San Miguel Hall', ''),
(561, 'San Nicolas Hall', ''),
(0, 'San Rafael Ocean Cluster', ''),
(0, 'Sand Volleyball Courts', 'SAND '),
(548, 'Santa Cruz Hall', ''),
(527, 'Santa Rosa Hall', ''),
(0, 'Santa Barbara Harbor', 'SB'),
(0, 'Softball Field', 'SFTBL'),
(528, 'South Hall', 'SH'),
(221, 'Student Resource Building (SRB)', 'SRB'),
(0, 'Stadium Field', 'STADM'),
(0, 'Storke Field', 'STORK'),
(588, 'Student Health', 'STU'),
(0, 'Swimming Pool', 'SWIM '),
(554, 'Theater and Dance East & Hatlen Theater', 'TD-E'),
(0, 'Theater and Dance West (TD-W)', 'TD-W'),
(0, 'Track Field', 'TRACK'),
(0, 'UC Sacramento Center', 'UCCS'),
(0, 'UCSB Center at Ventura', 'VNTRA'),
(526, 'Geological Sciences (Webb Hall)', 'WEBB'),
(0, 'Women', 'WMNS '),
(387, 'Modular Classrooms', '387'),
(434, 'Former Women''s Center', '434'),
(479, 'Old Gymnasium', '479'),
(615, 'Materials Research Lab', '615'),
(0, 'Trailer 932 (behind Davidson Library)', '932'),
(936, 'Physics Trailer 3', '936'),
(937, 'Physics Trailer 2', '937'),
(939, 'Physics Trailer 1', '939'),
(0, 'Trailer 940 (behind Davidson Library)', '940');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
