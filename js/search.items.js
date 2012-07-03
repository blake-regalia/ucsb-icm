/*SearchItems(

	{
		key: 'building.names',
		title: 'Building',
		select: Building.lookup,
	},
	
	
	{
		key: 'geography.faculty.names',
		title: 'Geography Faculty',
	},
	
	
	{
		key: 'geography.staff.names',
		title: 'Geography Staff',
	},
	
	
	{
		key: 'geography.grads.names',
		title: 'Geography Graduate',
	},
	
	
	{
		key: 'geography.researchers.names',
		title: 'Geography Researcher',
	},
	
	
	{
		key: 'registrar.undergrad.lectures',
		title: 'Undergrad Lecture',
		select: Lectures.lookup('undergrad.lectures'),
	}
);
*/
/****/

SearchItems(

	{
		dataset: 'ucsb.facilities.building#(`buildingName`)',
		title: 'Building',
		select: Building.lookup,
	},
	
	
	// Registrar
	
	{
		dataset: 'ucsb.registrar.undergrad.lecture#(`courseTitle` - `fullTitle`)',
		title: 'Undergrad Lecture',
		select: Lectures.lookup('undergrad.lecture'),
	},
	
	{
		dataset: 'ucsb.registrar.graduate.lecture#(`courseTitle` - `fullTitle`)',
		title: 'Graduate Lecture',
	},
	
	{
		dataset: 'ucsb.directory#(`firstName` `lastName`)',
		title: 'Contact',
		select: Contacts.lookup,
	}
	

);

/****/


	// Directory
	/**
	{
		dataset: 'ucsb.directory.staff#(`lastName`, `firstName`)',
		title: 'Staff',
	},
	
	{
		dataset: 'ucsb.directory.faculty#(`lastName`, `firstName`)',
		title: 'Faculty',
	},
	
	{
		dataset: 'ucsb.directory.graduate#(`lastName`, `firstName`)',
		title: 'Graduate',
	},
	
	{
		dataset: 'ucsb.directory.researcher#(`lastName`, `firstName`)',
		title: 'Researcher',
	},
	/**/