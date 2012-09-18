-- --------------------------------------------------------
--
-- Namespace: registrar
--
-- --------------------------------------------------------

	--
	-- Table structure for table: subjects
	--
	
	CREATE TABLE IF NOT EXISTS `registrar_subjects` (
		
		`subjectName`	varchar(255) NOT NULL,
		`subjectAbrv`	varchar(16) NOT NULL
		
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;