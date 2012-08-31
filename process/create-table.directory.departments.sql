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
	  `buildingId` smallint(5) NOT NULL,
	  `college` varchar(32) NOT NULL,
	  
	  `chair` varchar(64) NOT NULL,
	  `viceChair` varchar(64) NOT NULL,
	  `programChair` varchar(64) NOT NULL,
	  `associateChair` varchar(64) NOT NULL,
	  `departmentChair` varchar(64) NOT NULL,
	  
	  `director` varchar(64) NOT NULL,
	  `viceDirector` varchar(64) NOT NULL,
	  `programDirector` varchar(64) NOT NULL,
	  `associateDirector` varchar(64) NOT NULL,
	  `executiveDirector` varchar(64) NOT NULL,
	  
	  `location` varchar(64) NOT NULL,
	  `phone` varchar(255) NOT NULL,
	  `website` varchar(255) NOT NULL
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;