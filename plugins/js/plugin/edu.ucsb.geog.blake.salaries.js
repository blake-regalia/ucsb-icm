/**

==Info==
	@name        UCSB Campus Salary Distribution
	@author      Blake Regalia
	@email       blake@geog.ucsb.edu
	@description Visualizes the distribution of income on campus
	@version     1
==/Info==



<plugin>

	<data>
		<connect name="faculty">
			ucsb/directory.people
			<where>
				`type`='faculty'
			</where
		</connect>
		
		<connect name="buildings" uses="buildingId, buildingName">
			ucsb/facility.buildings
		</connect>
		
		<connect name="salaries">
			blake@geog.ucsb.edu/salaries_2011
		</connect>
	</data>
	
</plugin>


<layout for="popup.bldg-info">
	
	<info name="persons">
		<title># People: </title>
	</info>
	
	<info name="average" format="currency.dollars">
		<title>Average: </title>
	</info>

</layout>


**/

var maxSalary = 0;
var minSalary = Infinity;

var buildingArray = DynamicArray();

// for every person on the salary data sheet
var salaryLoop = Data('salaries').each( function(index, salaryRecord, controller) {
	
	// look them up by their name
	var lookupPerson = Select('faculty').where(
		{
			lastName: salaryRecord.last_name,
			firstName: salaryRecord.first_name,
		}
	);
	
	// once the above data lookup is ready
	When(lookupPerson).isReady( function(persons) {
		
		// didn't find them
		if(persons.length == 0) {
			//console.warn('no record for '+salaryRecord.first_name+' '+salaryRecord.last_name);
		}
		
		// bingo!
		else if(persons.length == 1) {
			var person = persons[0];
			var office = new Location(person.location);
			
			// if their office resolved to a location
			if(office.resolved) {
				
				var buildingId = office.getBuildingId();
				
				// add their salary to a running total & increment the counter by 1
				buildingArray(buildingId).add({
					sum: salaryRecord.total_pay,
					count: 1,
				});
				
				// keep track of the highest/lowest salaries per person
				maxSalary = Math.max(maxSalary, salaryRecord.total_pay);
				minSalary = Math.min(minSalary, salaryRecord.total_pay);
			}
			
			// otherwise, figure out which building their department belongs to
			else if(false){
				
				// TODO: implement
				var primaryDepartment = GetListItem(person.departments).at(0);
				
				var lookupBuilding = Select('buildings').where('department').contains(primaryDepartment);
				When(lookupBuilding).isReady( function(buildings) {
				
					if(buildings.length == 1) {
					
						var buildingId = buildings[0].buildingId;
						
						buildingArray(buildingId).add({
							sum: salaryRecord.total_pay,
							count: 1,
						});
					}
				});
			}
		}
		
		// more than one person matched criteria
		else {
			console.warn('more than 1 ',salaryRecord.first_name,' ',salaryRecord.last_name);
		}
		
		controller.doneWith(index);
	});
	
});


// once the above "each" loop is done, THEN do the following
When(salaryLoop).isDone( function() {
	
	// create a linear color gradient to give each building a "heat-color" value
	var gradient = new ColorGradient({
		'white': minSalary,
		'green': maxSalary,
	});
	
	// for every building in the final data array
	buildingArray.each( function(buildingId, buildingSalary) {
		
		// determine the average salary of this building by dividing the salary sum by the total count of people in that building
		var salaryAverage = buildingSalary.sum / buildingSalary.count;
		
		// plot the building using using a symbol with fill color of a gradient based on the average salary
		var building = Building(buildingId);
		
		Map.plot( building,
			{
				fill: gradient(salaryAverage),
				stroke: 'rgb(0,0,0)',
			},
			{
				click: function(here) {
					$('popup.bldg-info').show(this, here);
				},
				data: {
					persons: buildingSalary.count,
					average: salaryAverage,
				},
			}
		);
		
		
	});
});