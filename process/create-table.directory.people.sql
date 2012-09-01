-- --------------------------------------------------------
--
-- Namespace: directory
--
-- --------------------------------------------------------

	--
	-- Table structure for table: people
	--
	
	CREATE TABLE IF NOT EXISTS `directory_people` (
		  
		`fullName`		varchar(255) NOT NULL,
		`firstName`		varchar(255) NOT NULL,
		`middleName`	varchar(255) NOT NULL,
		`lastName`		varchar(255) NOT NULL,
		
		`type`			varchar(255) NOT NULL,
		`affiliation`	varchar(255) NOT NULL,
		`title`			varchar(255) NOT NULL,
		`departments`	varchar(255) NOT NULL,
		
		`phone`			varchar(255) NOT NULL,
		`email`			varchar(255) NOT NULL,
		`location`		varchar(255) NOT NULL,
		
		`lastUpdated`	varchar(255) NOT NULL

	) ENGINE=InnoDB DEFAULT CHARSET=utf8;
