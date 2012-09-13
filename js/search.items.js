/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

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
		dataset: 'ucsb/facilities.building#<[`buildingName`]',
		title: 'Building',
		select: Building.newCard,
	},
	
	// Departments
	
	{
		dataset: 'ucsb/directory.department.academic#<[`departmentName`]',
		title: 'Department',
		select: Department.newCard,
	},
	
	// Registrar
	
	{
		dataset: 'ucsb/registrar.lecture.undergrad#<[`courseTitle` - `fullTitle`]',
		title: 'Undergrad Lecture',
		select: Lectures.lookup('lecture.undergrad'),
	},
	
	{
		dataset: 'ucsb/registrar.lecture.graduate#<[`courseTitle` - `fullTitle`]',
		title: 'Graduate Lecture',
		select: Lectures.lookup('lecture.graduate'),
	},
	
	{
		dataset: 'ucsb/directory.people#<[`firstName` `lastName`]',
		title: 'Contact',
		select: Contact.newCard('`firstName` `lastName`'),
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