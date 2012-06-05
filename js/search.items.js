SearchItems(

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