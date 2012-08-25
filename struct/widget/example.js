


$(layout).ready(function() {
	
	new Database('blake@geog.ucsb.edu').ready(function(db) {
		
	});
	
	var searchBox = new SearchBox('#search');
	
	var staff = new ItemSet(ucsb.directory.staff);
	staff.setPrimaryItem('@lastName',', ','@firstName');
	
	var faculty = new ItemSet(ucsb.directory.faculty);
	faculty.setPrimaryItem('@firstName',' ','@lastName');
	
	searchBox.addItemSet(staff);
	searchBox.addItemSet(faculty);
	
	searchBox.setItemAction(function(itemSet, itemText, itemObj) {
		if(itemSet.descendsFrom(ucsb.directory)) {
			var person = itemObj;
			
			var criteria = {
				name: person.lastName
			};
			
			salaries.search(criteria, function(found, item) {
				if(found) {
					$('#salary').val(item.salary);
				}
			});
		}
	});
});