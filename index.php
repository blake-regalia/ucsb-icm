<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=7,IE=9" />
	
	
	<!--The viewport meta tag is used to improve the presentation and behavior of the samples on iOS devices-->
	<!--<meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no"/>-->
	
	<title>UCSB Interactive Campus Map</title>
	
	
	<!-- compiled CSS -->
	<link rel="stylesheet" type="text/css" href="css/compile.php">
	
	
	<!-- BEGIN JAVASCRIPT INCLUDES -->
	
	<!-- load the global CSS constants -->
	<script type="text/javascript" src="css/compile.php?json=globals"></script>
	
<?php $DEBUG=TRUE; chdir('js'); require "js/compile.php"; chdir('..') ?>
	
	<!-- END JAVASCRIPT INCLUDES -->
	
</head>

<body class="claro">

	<div id="flush">
		
		<div id="header">
		
			<div id="omnibox_div">
				<input id="omnibox" type="text"></input>
				
				<div id="omnibox_results" class="omnibox_results_containers" style="display:none;">
				
				</div>
			</div>
			
			
			<div id="header_corner">
				<img class="campus_logo" src="http://ags2.geog.ucsb.edu/icm/images/ucsbLogo.png"></img>
			</div>
			
		</div>
		
		<div id="omnibox_results_shadow" class="omnibox_results_containers" style="display:none;"></div>
		
		<div id="content">
			<div id="map">
			</div>
			
			<div id="info_deck"></div>
			
			<div class="widget-menu">
				<div class="widget-menu-pane">
					<div class="widget-menu-icon" style="background-image:url('resource/widget.icon.directions.gif');">
						<span class="widget-menu-icon-hover">directions</span>
					</div>
					<div class="widget-menu-icon" style="background-image:url('resource/widget.icon.courses.gif');">
						<span class="widget-menu-icon-hover">courses</span>
					</div>
					<div class="widget-menu-icon" style="background-image:url('resource/widget.icon.bus.routes.jpg');">
						<span class="widget-menu-icon-hover">bus routes</span>
					</div>
					<div class="widget-menu-icon" style="background-image:url('resource/widget.icon.parking.jpg');">
						<span class="widget-menu-icon-hover">parking</span>
					</div>
					<div class="widget-menu-icon" style="background-image:url('resource/widget.icon.eateries.jpg');">
						<span class="widget-menu-icon-hover">eateries</span>
					</div>
					<div class="widget-menu-icon" style="background-image:url('resource/widget.icon.environment.jpg');">
						<span class="widget-menu-icon-hover">environment</span>
					</div>
				</div>
			</div>
		</div>
		
	</div>
	
	<!--

	<div dojotype="dijit.layout.BorderContainer" style="width: 100%; height:100%; margin: auto; padding:0px;">
	<div id="header" dojotype="dijit.layout.ContentPane" region="top"> 
			<div style="width: 100%; margin: 0; background-color:#243C5F; color:white; height:27px;">
				<span class="navBar">
					<b><a href="#" onclick="toggle_visibility('searchDiv');">Search</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Classes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					
					<a href="#" onclick="toggle_visibility('layersDiv');">Layers</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					
					<a href="#" onclick="toggle_visibility('sideInfoWindow');">Toggle sideInfoWindow</a></b>
				</span>
			</div>
			<div>
				<img src="http://earth.geog.ucsb.edu/icm/images/banner5.png" style="padding-top: 10px; padding-left: 15px;">
				<img src="http://earth.geog.ucsb.edu/icm/images/ucsbLogo.png" style="position:absolute; right:15px; top:40px;">
				
				
				<input id="omnibox" type="text"></input>
				<div id="search_results"></div>
				
				
				<div>
					<div class="zoommainIcon" style="position:absolute; padding:3px;right:250px; top:50px; z-index:99;" onClick="mainCampusExtent()"></div>
					<div class="zoomfullextIcon" style="position:absolute; padding:3px;right:210px; top:50px; z-index:99;" onClick="fullCampusExtent();"></div>
					<div id="zoomprev" class="zoomprevIcon" style="position:absolute; padding:3px;right:170px; top:50px; z-index:99;" onClick="navToolbar.zoomToPrevExtent();"></div>
					<div id="zoomnext" class="zoomnextIcon" style="position:absolute; padding:3px;right:130px; top:50px; z-index:99;" onClick="navToolbar.zoomToNextExtent();"></div>
				</div>
			</div>
    </div>  
	
	
	<div id="map" dojotype="dijit.layout.ContentPane" region="center" style="overflow:hidden;"></div>
	</div>
	<div id="sideInfoWindow" class="sideInfoWindow" style="display:none;">
		This is where the stuff will go.  It can stretch and be sized as needed and will be easy to change the contents using javascript.
	</div>
	
	<div id="searchDiv" style="display:none;">
		<input id="omnibox" type="text"></input>
		<a href="#" onclick="alert('Search button!');">&nbsp;&nbsp;&nbsp;<img src="images/searchIcon.png" style="vertical-align:middle" width="20"/></a>
	</div>
	
	<div id="layersDiv" style="display:none; color:black;">
		<input type="radio" name="toggleLayer" id="basemap2" onClick="changeMap([recreation]);">Recreation Areas<br>
		<input type="radio" name="toggleLayer" id="basemap3" onClick="changeMap([resources]);">Student Resources<br>
		<input type="radio" name="toggleLayer" id="basemap4" onClick="changeMap([BikeRepairStations]);">Bike Repair Stations<br>
		<input type="radio" name="toggleLayer" id="basemap5" onClick="changeMap([recycling]);">Recycling<br>
		<input type="radio" name="toggleLayer" id="basemap6" onClick="changeMap([emergencyPhones]);">Emergency Phones<br>
        <input type="radio" name="toggleLayer" id="basemap7" onClick="changeMap([wireless]);">Wireless Signal Strength<br>
        <input type="radio" name="toggleLayer" id="basemap8" onClick="changeMap([TalkingSigns]);">Talking Signs<br>
		<input type="radio" name="toggleLayer" id="basemap9" onClick="changeMap([eateries]);">Campus Eateries<br>
		<input type="radio" name="toggleLayer" id="basemap10" onClick="changeMap([ivEateries]);">Isla Vista Restaurants<br>
		<br>
		<input type="button" value="clear" onclick="hideDynamicLayers();">
	</div>
	
	-->
	
</body>

</html>